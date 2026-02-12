from pydantic import BaseModel
from datetime import datetime


class TrendQuery(BaseModel):
    platform: str
    country: str = 'US'


class SchedulePostRequest(BaseModel):
    platform: str
    caption: str
    media_url: str | None = None
    scheduled_at: datetime


class AIChatRequest(BaseModel):
    niche: str
    prompt: str
    recent_performance_summary: str
