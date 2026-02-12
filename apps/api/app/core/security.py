from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import base64
import hashlib

from .config import settings

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(subject: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {'sub': subject, 'exp': exp, 'type': 'access'}
    return jwt.encode(payload, settings.secret_key, algorithm='HS256')


def create_refresh_token(subject: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    payload = {'sub': subject, 'exp': exp, 'type': 'refresh'}
    return jwt.encode(payload, settings.secret_key, algorithm='HS256')


def derive_fernet_key(secret: str) -> bytes:
    digest = hashlib.sha256(secret.encode()).digest()
    return base64.urlsafe_b64encode(digest)


def encrypt_token(raw: str) -> str:
    return Fernet(derive_fernet_key(settings.secret_key)).encrypt(raw.encode()).decode()


def decrypt_token(encrypted: str) -> str:
    return Fernet(derive_fernet_key(settings.secret_key)).decrypt(encrypted.encode()).decode()
