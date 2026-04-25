from fastapi import APIRouter, HTTPException, status

from backend.app.core.config import get_settings
from backend.app.core.levels import get_level_info
from backend.app.dependencies import CurrentUser, DatabaseSession
from backend.app.schemas.auth import UserPublic
from backend.app.schemas.profile import ChangeLanguageRequest, ProfileResponse
from backend.app.services.auth_service import AuthService
from backend.app.services.progress_service import HEALTH_REGEN_INTERVAL, MAX_HEALTH_POINTS

router = APIRouter(prefix="/users", tags=["users"])


def _build_profile(user) -> ProfileResponse:
    """Build a ProfileResponse from a User ORM instance."""
    info = get_level_info(user.experience_points)
    return ProfileResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        name=user.name,
        preferred_domains=user.preferred_domains,
        preferred_languages=user.preferred_languages,
        experience_points=user.experience_points,
        health_points=user.health_points,
        max_health_points=MAX_HEALTH_POINTS,
        health_next_regen_at=user.health_next_regen_at,
        health_regen_seconds=int(HEALTH_REGEN_INTERVAL.total_seconds()),
        level=info.level,
        level_name=info.level_name,
        xp_for_current_level=info.xp_for_current_level,
        xp_for_next_level=info.xp_for_next_level,
        xp_to_next_level=info.xp_to_next_level,
        created_at=user.created_at,
    )


@router.get("/me/profile", response_model=ProfileResponse)
async def get_profile(current_user: CurrentUser) -> ProfileResponse:
    """Return the authenticated user's full profile including level progression."""
    return _build_profile(current_user)


@router.patch("/me/language", response_model=UserPublic)
async def change_language(
    payload: ChangeLanguageRequest,
    current_user: CurrentUser,
    db: DatabaseSession,
) -> UserPublic:
    """Set the user's preferred programming language (single selection).

    Replaces the current `preferred_languages` list with the single chosen language.
    Returns 400 if the language string is blank.
    """
    lang = payload.language.strip()
    if not lang:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language must not be blank.",
        )

    service = AuthService(db=db, settings=get_settings())
    updated = await service.update_user(
        user_id=current_user.id,
        preferred_languages=[lang],
    )
    return UserPublic.model_validate(updated)
