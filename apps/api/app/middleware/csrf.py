from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in {'POST', 'PUT', 'PATCH', 'DELETE'}:
            csrf_header = request.headers.get('x-csrf-token')
            if request.url.path.startswith('/auth/'):
                return await call_next(request)
            if not csrf_header:
                return JSONResponse({'detail': 'Missing CSRF token'}, status_code=403)
        return await call_next(request)
