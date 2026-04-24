from fastapi import APIRouter

from backend.app.api.v1.endpoints.auth import router as auth_router
from backend.app.api.v1.endpoints.progress import router as progress_router
from backend.app.api.v1.endpoints.questions import router as questions_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(progress_router)
api_router.include_router(questions_router)
