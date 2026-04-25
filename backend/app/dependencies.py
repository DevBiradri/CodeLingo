from typing import Annotated

from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.services.auth_service import AuthService
from backend.app.services.gemini_service import GeminiService
from backend.app.services.question_cache import InMemoryQuestionCache
from backend.app.services.question_service import QuestionService

AuthorizationHeader = Annotated[str | None, Header(alias="Authorization")]
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    request: Request,
    db: DatabaseSession,
    authorization: AuthorizationHeader = None,
) -> User:
    token = _extract_session_token(request, authorization)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    service = AuthService(db=db, settings=get_settings())
    return await service.get_user_from_session_token(token)


def _extract_session_token(request: Request, authorization: str | None) -> str | None:
    settings = get_settings()
    session_token = request.cookies.get(settings.session_cookie_name)
    if session_token:
        return session_token

    if authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()
        return token or None

    return None


# ─── Singleton service dependencies ──────────────────────────────────────────

def get_question_cache(request: Request) -> InMemoryQuestionCache:
    return request.app.state.question_cache


def get_gemini_service(request: Request) -> GeminiService:
    return request.app.state.gemini_service


def get_question_service(
    db: DatabaseSession,
    cache: Annotated[InMemoryQuestionCache, Depends(get_question_cache)],
    llm: Annotated[GeminiService, Depends(get_gemini_service)],
) -> QuestionService:
    return QuestionService(db=db, settings=get_settings(), cache=cache, llm=llm)


# Typed aliases for injection
CurrentUser = Annotated[User, Depends(get_current_user)]
QuestionServiceDep = Annotated[QuestionService, Depends(get_question_service)]

