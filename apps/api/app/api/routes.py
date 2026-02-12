from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.db.session import get_db
from app.models.entities import User, AnalyticsSnapshot, ScheduledPost, Competitor
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.domain import TrendQuery, SchedulePostRequest, AIChatRequest
from app.services.audit_service import log_event
from app.services.integrations import (
    fetch_x_trends,
    fetch_openai_idea,
    fetch_youtube_channel_stats,
    IntegrationConfigError,
)

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post('/auth/register', response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status_code=400, detail='Email already registered')
    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    log_event(db, 'auth.register', f'User registered: {user.email}', user.id)
    return TokenResponse(access_token=create_access_token(str(user.id)), refresh_token=create_refresh_token(str(user.id)))


@router.post('/auth/login', response_model=TokenResponse)
@limiter.limit('10/minute')
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        log_event(db, 'auth.login_failed', f'Failed login for {payload.email}', severity='warn')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')
    log_event(db, 'auth.login_success', f'Login success {payload.email}', user.id)
    return TokenResponse(access_token=create_access_token(str(user.id)), refresh_token=create_refresh_token(str(user.id)))


@router.get('/dashboard/analytics')
def dashboard_analytics(platform: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(
        select(AnalyticsSnapshot)
        .where(AnalyticsSnapshot.user_id == user.id, AnalyticsSnapshot.platform == platform)
        .order_by(desc(AnalyticsSnapshot.created_at))
        .limit(30)
    ).all()
    return {'platform': platform, 'points': [
        {
            'followers': r.followers,
            'views': r.views,
            'engagement_rate': r.engagement_rate,
            'growth_percentage': r.growth_percentage,
            'created_at': r.created_at,
        } for r in rows
    ]}


@router.post('/trends/live')
async def trends_live(query: TrendQuery):
    try:
        data = await fetch_x_trends()
        posts = data.get('data', [])
        return {
            'platform': query.platform,
            'country': query.country,
            'trends': [
                {
                    'keyword': p.get('text', '')[:80],
                    'momentum_score': min(100, 50 + len(p.get('text', '')) % 40),
                    'volume_indicator': 'high' if len(p.get('text', '')) > 120 else 'medium',
                    'growth_velocity': round((len(p.get('text', '')) % 13) / 10, 2),
                }
                for p in posts[:20]
            ],
            'updated_at': datetime.now(timezone.utc),
        }
    except IntegrationConfigError as exc:
        raise HTTPException(status_code=503, detail=str(exc))


@router.post('/schedule/posts')
def schedule_post(payload: SchedulePostRequest, user=Depends(get_current_user), db: Session = Depends(get_db)):
    viral = min(100, max(0, 45 + len(payload.caption) // 6 + (15 if '#' in payload.caption else 0)))
    post = ScheduledPost(
        user_id=user.id,
        platform=payload.platform,
        caption=payload.caption,
        media_url=payload.media_url,
        scheduled_at=payload.scheduled_at,
        viral_probability_score=viral,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    log_event(db, 'schedule.post_created', f'Post {post.id} scheduled for {post.platform}', user.id)
    return {'id': post.id, 'viral_probability_score': viral}


@router.post('/idea/chat')
async def ai_idea(payload: AIChatRequest, user=Depends(get_current_user), db: Session = Depends(get_db)):
    enriched_prompt = (
        f"Niche: {payload.niche}\n"
        f"Performance context: {payload.recent_performance_summary}\n"
        f"User request: {payload.prompt}\n"
        'Generate content ideas, hooks, caption, short script, and hashtags.'
    )
    try:
        response = await fetch_openai_idea(enriched_prompt)
        log_event(db, 'ai.idea_generated', 'AI idea generated', user.id)
        return response
    except IntegrationConfigError as exc:
        raise HTTPException(status_code=503, detail=str(exc))


@router.get('/intelligence/predictive')
def predictive(user=Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(AnalyticsSnapshot).where(AnalyticsSnapshot.user_id == user.id).order_by(desc(AnalyticsSnapshot.created_at)).limit(14)).all()
    if not rows:
        return {'forecast_7d': [], 'forecast_30d': [], 'confidence_interval': [0.0, 0.0]}
    latest = rows[0].followers
    avg_growth = sum(max(0, r.growth_percentage) for r in rows) / len(rows)
    forecast_7 = [round(latest * (1 + (avg_growth / 100) * (i + 1)), 0) for i in range(7)]
    forecast_30 = [round(latest * (1 + (avg_growth / 100) * (i + 1)), 0) for i in range(30)]
    return {
        'forecast_7d': forecast_7,
        'forecast_30d': forecast_30,
        'confidence_interval': [round(avg_growth * 0.8, 2), round(avg_growth * 1.2, 2)],
    }


@router.post('/intelligence/competitors')
async def competitor_insights(platform: str, username: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db.add(Competitor(user_id=user.id, platform=platform, username=username))
    db.commit()
    external = {}
    if platform == 'youtube':
        try:
            external = await fetch_youtube_channel_stats(username)
        except IntegrationConfigError:
            external = {'note': 'Missing YouTube API key'}
    return {
        'platform': platform,
        'username': username,
        'comparison': {
            'posting_frequency': 'needs_data',
            'engagement_rate': 'needs_data',
            'growth_trend': 'needs_data',
        },
        'external': external,
        'advice': 'Increase consistency and strengthen hooks in first 3 seconds across short-form clips.',
    }


@router.get('/monitoring/health')
def health(db: Session = Depends(get_db)):
    db.execute(select(User).limit(1))
    return {'status': 'ok', 'service': 'api'}
