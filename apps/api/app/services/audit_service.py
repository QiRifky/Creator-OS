from sqlalchemy.orm import Session
from app.models.entities import AuditLog


def log_event(db: Session, event_type: str, details: str, user_id: int | None = None, severity: str = 'info') -> None:
    db.add(AuditLog(user_id=user_id, event_type=event_type, details=details, severity=severity))
    db.commit()
