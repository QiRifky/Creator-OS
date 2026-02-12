from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.db.session import Base, engine
from app.middleware.csrf import CSRFMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Creator-OS API', version='1.0.0')
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)
app.add_middleware(CSRFMiddleware)


@app.get('/')
def root():
    return {'name': 'Creator-OS API', 'status': 'running'}
