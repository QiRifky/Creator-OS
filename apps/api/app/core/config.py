from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    app_name: str = 'Creator-OS API'
    environment: str = 'development'
    secret_key: str = 'change-me'
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    database_url: str = 'postgresql+psycopg://postgres:postgres@db:5432/creator_os'
    redis_url: str = 'redis://redis:6379/0'

    openai_api_key: str | None = None
    google_client_id: str | None = None
    google_client_secret: str | None = None
    apple_client_id: str | None = None
    apple_team_id: str | None = None
    apple_key_id: str | None = None
    apple_private_key: str | None = None

    youtube_api_key: str | None = None
    instagram_access_token: str | None = None
    tiktok_access_token: str | None = None
    facebook_access_token: str | None = None
    x_bearer_token: str | None = None

    smtp_host: str | None = None
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from: str = 'no-reply@creator-os.local'


settings = Settings()
