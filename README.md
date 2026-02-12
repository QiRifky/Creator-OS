# Creator-OS — AI Creator Intelligence Platform

Production-oriented monorepo for an AI-powered Creator Intelligence Platform.

## Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind, Framer Motion, Recharts
- **Backend API**: FastAPI, SQLAlchemy, Pydantic v2, JWT, OAuth2, Redis cache
- **Async Jobs**: Celery + Redis broker/backend with retry policies
- **DB**: PostgreSQL
- **Auth**: Email/password, OAuth (Google + Apple), JWT sessions, email verification + reset
- **Monitoring**: Structured logs, audit logs, health endpoints

## Monorepo layout

- `apps/api` — backend services and API routes
- `apps/web` — modern responsive UI with platform tabs and AI copilot
- `infra` — docker-compose and env examples

## Key product modules implemented

- Multi-platform analytics ingestion + dashboard endpoints (YouTube, Instagram, TikTok, Facebook, X)
- Real-time trend tracker endpoint with filters and momentum/velocity metrics
- AI Idea Copilot endpoint (OpenAI API)
- Scheduling API + viral score heuristic endpoint
- Intelligence endpoints for growth forecast and strategy report
- Competitor intelligence endpoint
- Secure auth + OAuth + RBAC-ready user model
- Audit and system log capture

## Quick start

```bash
cp infra/.env.example .env
cd infra
docker compose up --build
```

Then:
- API: `http://localhost:8000/docs`
- Web: `http://localhost:3000`

## Security notes

- Passwords are hashed with bcrypt.
- OAuth tokens are encrypted before persistence.
- JWT uses short-lived access tokens + refresh token rotation support scaffold.
- Login attempts are rate-limited.
- CSRF middleware enabled for cookie-based flows.

## Production hardening checklist

- Configure real API credentials for all social providers.
- Configure OpenAI API key.
- Configure SMTP for verification/reset emails.
- Enable HTTPS reverse proxy + WAF.
- Add Sentry/Datadog exporters.
- Configure backup and retention policies.
