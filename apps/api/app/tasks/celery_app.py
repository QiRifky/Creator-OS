from celery import Celery
from app.core.config import settings

celery_app = Celery('creator_os', broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)
