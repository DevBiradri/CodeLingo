from contextlib import asynccontextmanager

from dotenv import load_dotenv

# Load environment variables early
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.router import api_router
from backend.app.core.config import get_settings
from backend.app.db.base import Base
from backend.app.db.session import engine
from backend.app.models import session as session_model  # noqa: F401
from backend.app.models import user as user_model  # noqa: F401
from backend.app.services.gemini_service import GeminiService
from backend.app.services.question_cache import InMemoryQuestionCache

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Initialise singleton services once for the lifetime of the app
    app.state.question_cache = InMemoryQuestionCache(
        ttl_seconds=settings.question_cache_ttl_seconds
    )
    app.state.gemini_service = GeminiService(settings=settings)
    yield


app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)

# CORS configuration
cors_origins = settings.cors_origins
allow_all_origins = "*" in cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    return {"status": "ok"}

