from typing import Annotated

from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import AuthService


AuthorizationHeader = Annotated[str | None, Header(alias="Authorization")]
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    request: Request,
    db: DatabaseSession,
    authorization: AuthorizationHeader = None,
) -> User:
    token = _extract_session_token(request, authorization)
    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

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
