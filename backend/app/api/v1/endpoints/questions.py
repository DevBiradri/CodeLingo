from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.db.session import get_db
from backend.app.dependencies import get_current_user
from backend.app.schemas.question import (
    GenerateQuestionRequest,
    GenerateQuestionResponse,
    VerifyQuestionRequest,
    VerifyQuestionResponse,
)
from backend.app.services.gemini_service import GeminiService
from backend.app.services.question_cache import InMemoryQuestionCache
from backend.app.services.question_service import QuestionService

router = APIRouter(prefix="/questions", tags=["questions"])
settings = get_settings()
question_cache = InMemoryQuestionCache(ttl_seconds=settings.question_cache_ttl_seconds)


def _build_service(db: AsyncSession) -> QuestionService:
    return QuestionService(
        db=db,
        settings=settings,
        cache=question_cache,
        llm=GeminiService(settings=settings),
    )


@router.post("/generate", response_model=GenerateQuestionResponse)
async def generate_question(
    payload: GenerateQuestionRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
) -> GenerateQuestionResponse:
    service = _build_service(db)
    return await service.generate_question(payload)


@router.post("/verify", response_model=VerifyQuestionResponse)
async def verify_question(
    payload: VerifyQuestionRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
) -> VerifyQuestionResponse:
    service = _build_service(db)
    return await service.verify_answer(user_id=current_user.id, payload=payload)
