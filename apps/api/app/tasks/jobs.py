from sqlalchemy import select
from app.tasks.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.entities import SocialConnection, AnalyticsSnapshot
from app.core.security import decrypt_token


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={'max_retries': 5})
def ingest_analytics(self):
    db = SessionLocal()
    try:
        connections = db.scalars(select(SocialConnection)).all()
        for conn in connections:
            _token = decrypt_token(conn.encrypted_access_token)
            # Real ingestion logic should call platform APIs with decrypted token.
            # Snapshot creation omitted unless real data is fetched to avoid mock production data.
            _ = _token
    finally:
        db.close()
    return {'status': 'queued'}
