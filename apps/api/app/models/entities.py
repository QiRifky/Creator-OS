from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Float, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    role: Mapped[str] = mapped_column(String(32), default='creator')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SocialConnection(Base):
    __tablename__ = 'social_connections'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    platform: Mapped[str] = mapped_column(String(32), index=True)
    account_handle: Mapped[str] = mapped_column(String(255), index=True)
    encrypted_access_token: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AnalyticsSnapshot(Base):
    __tablename__ = 'analytics_snapshots'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    platform: Mapped[str] = mapped_column(String(32), index=True)
    followers: Mapped[int] = mapped_column(Integer)
    views: Mapped[int] = mapped_column(Integer)
    engagement_rate: Mapped[float] = mapped_column(Float)
    growth_percentage: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class ScheduledPost(Base):
    __tablename__ = 'scheduled_posts'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    platform: Mapped[str] = mapped_column(String(32), index=True)
    caption: Mapped[str] = mapped_column(Text)
    media_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    status: Mapped[str] = mapped_column(String(32), default='scheduled')
    viral_probability_score: Mapped[int] = mapped_column(Integer, default=0)


class Competitor(Base):
    __tablename__ = 'competitors'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    platform: Mapped[str] = mapped_column(String(32))
    username: Mapped[str] = mapped_column(String(255), index=True)


class AuditLog(Base):
    __tablename__ = 'audit_logs'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True)
    event_type: Mapped[str] = mapped_column(String(64), index=True)
    details: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(16), default='info')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
