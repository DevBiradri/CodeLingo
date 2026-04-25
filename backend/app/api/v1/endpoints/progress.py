from fastapi import APIRouter
from sqlalchemy import func, select

from backend.app.core.levels import get_level_info
from backend.app.dependencies import CurrentUser, DatabaseSession
from backend.app.models.user import User
from backend.app.schemas.leaderboard import LeaderboardEntry, LeaderboardResponse
from backend.app.schemas.profile import ProgressResponse
from backend.app.services.progress_service import (
    HEALTH_REGEN_INTERVAL,
    MAX_HEALTH_POINTS,
    ProgressService,
)

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/me", response_model=ProgressResponse)
async def get_my_progress(
    current_user: CurrentUser,
    db: DatabaseSession,
) -> ProgressResponse:
    """Return current XP, HP, level, and regen status for the authenticated user.

    Health points regenerate automatically — this endpoint refreshes the
    counter before returning so the client always sees an up-to-date value.
    """
    service = ProgressService(db)
    user = await service.get_progress(current_user.id)
    info = get_level_info(user.experience_points)

    return ProgressResponse(
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
        completed_missions=user.completed_missions,
    )


@router.get("/leaderboard", response_model=LeaderboardResponse, tags=["leaderboard"])
async def get_leaderboard(
    db: DatabaseSession,
    _current_user: CurrentUser,
    limit: int = 50,
) -> LeaderboardResponse:
    """Return the top users ranked by XP descending.

    Query param `limit` controls max entries returned (default 50, max 100).
    """
    limit = min(max(1, limit), 100)

    total: int = (
        await db.scalar(
            select(func.count()).select_from(User).where(User.is_active == True)  # noqa: E712
        )
        or 0
    )

    result = await db.execute(
        select(User)
        .where(User.is_active == True)  # noqa: E712
        .order_by(User.experience_points.desc())
        .limit(limit)
    )
    users = result.scalars().all()

    entries = [
        LeaderboardEntry(
            rank=rank,
            username=u.username,
            name=u.name,
            experience_points=u.experience_points,
            level=get_level_info(u.experience_points).level,
            level_name=get_level_info(u.experience_points).level_name,
        )
        for rank, u in enumerate(users, start=1)
    ]

    return LeaderboardResponse(entries=entries, total=total)
