from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.db.session import get_db
from backend.app.dependencies import get_current_user
from backend.app.schemas.auth import (
    AuthResponse,
    RegisterRequest,
    UpdateUserRequest,
    UserPublic,
)
from backend.app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


@router.post(
    "/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
async def register(
    payload: RegisterRequest, response: Response, db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    service = AuthService(db=db, settings=settings)
    result = await service.register(
        email=payload.email, name=payload.name, password=payload.password
    )
    _attach_auth_cookies(response, result.access_token, result.refresh_token)
    return AuthResponse(
        user=UserPublic.model_validate(result.user),
        access_token=result.access_token,
        refresh_token=result.refresh_token,
        expires_at=result.session.access_expires_at,
        refresh_expires_at=result.session.refresh_expires_at,
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
) -> AuthResponse:
    service = AuthService(db=db, settings=settings)
    result = await service.login(
        username=form_data.username, password=form_data.password
    )
    _attach_auth_cookies(response, result.access_token, result.refresh_token)
    return AuthResponse(
        user=UserPublic.model_validate(result.user),
        access_token=result.access_token,
        refresh_token=result.refresh_token,
        expires_at=result.session.access_expires_at,
        refresh_expires_at=result.session.refresh_expires_at,
    )


@router.post("/refresh", response_model=AuthResponse)
async def refresh(
    request: Request, response: Response, db: AsyncSession = Depends(get_db)
) -> AuthResponse:
    service = AuthService(db=db, settings=settings)
    refresh_token = _extract_refresh_token(request)
    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    result = await service.refresh(refresh_token)
    _attach_auth_cookies(response, result.access_token, result.refresh_token)
    return AuthResponse(
        user=UserPublic.model_validate(result.user),
        access_token=result.access_token,
        refresh_token=result.refresh_token,
        expires_at=result.session.access_expires_at,
        refresh_expires_at=result.session.refresh_expires_at,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: Request, response: Response, db: AsyncSession = Depends(get_db)
) -> Response:
    service = AuthService(db=db, settings=settings)
    token = _extract_any_session_token(request)
    if token is not None:
        await service.logout(token)
    _clear_auth_cookies(response)
    return response


@router.get("/me", response_model=UserPublic)
async def me(current_user=Depends(get_current_user)) -> UserPublic:
    return UserPublic.model_validate(current_user)


@router.patch("/me", response_model=UserPublic)
async def update_me(
    payload: UpdateUserRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
) -> UserPublic:
    service = AuthService(db=db, settings=settings)
    updated = await service.update_user(
        user_id=current_user.id,
        email=payload.email,
        username=payload.username,
        name=payload.name,
        preferred_domains=payload.preferred_domains,
        preferred_languages=payload.preferred_languages,
        current_password=payload.current_password,
        new_password=payload.new_password,
    )
    return UserPublic.model_validate(updated)


def _attach_auth_cookies(
    response: Response, access_token: str, refresh_token: str
) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=access_token,
        httponly=settings.session_cookie_httponly,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        max_age=settings.session_ttl_minutes * 60,
        path="/",
    )
    response.set_cookie(
        key=settings.refresh_cookie_name,
        value=refresh_token,
        httponly=settings.session_cookie_httponly,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        max_age=settings.refresh_session_ttl_minutes * 60,
        path="/",
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key=settings.session_cookie_name, path="/")
    response.delete_cookie(key=settings.refresh_cookie_name, path="/")


def _extract_refresh_token(request: Request) -> str | None:
    token = request.cookies.get(settings.refresh_cookie_name)
    if token:
        return token

    authorization = request.headers.get("Authorization")
    if authorization and authorization.lower().startswith("bearer "):
        extracted = authorization[7:].strip()
        return extracted or None

    return None


def _extract_any_session_token(request: Request) -> str | None:
    access_token = request.cookies.get(settings.session_cookie_name)
    if access_token:
        return access_token

    refresh_token = request.cookies.get(settings.refresh_cookie_name)
    if refresh_token:
        return refresh_token

    authorization = request.headers.get("Authorization")
    if authorization and authorization.lower().startswith("bearer "):
        extracted = authorization[7:].strip()
        return extracted or None

    return None
