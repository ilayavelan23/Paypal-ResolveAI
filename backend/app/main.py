from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .config import settings
from .database import engine, Base, SessionLocal
from .seed_data import seed_initial_data
from .routers import transactions, paypal, agents, refunds, disputes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Official Backend API for PayPal ResolveAI - AI-Powered Payment Resolution Assistant",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup for React Vite frontend and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(transactions.router, prefix=settings.API_V1_PREFIX)
app.include_router(paypal.router, prefix=settings.API_V1_PREFIX)
app.include_router(agents.router, prefix=settings.API_V1_PREFIX)
app.include_router(refunds.router, prefix=settings.API_V1_PREFIX)
app.include_router(disputes.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "version": "1.0.0",
        "environment": settings.PAYPAL_ENV,
        "paypal_api_base": settings.PAYPAL_API_BASE
    }

@app.get("/health")
def healthcheck():
    return {"status": "healthy"}
