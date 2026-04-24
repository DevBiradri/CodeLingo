from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.session import get_db
from backend.app.dependencies import get_current_user
from backend.app.schemas.auth import UserPublic
from backend.app.schemas.progress import ExperienceGrantRequest
from backend.app.services.progress_service import ProgressService

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/me", response_model=UserPublic)
async def get_my_progress(
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> UserPublic:
    service = ProgressService(db=db)
    user = await service.get_progress(current_user.id)
    return UserPublic.model_validate(user)


@router.post("/fail", response_model=UserPublic)
async def record_failure(
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> UserPublic:
    service = ProgressService(db=db)
    user = await service.record_failure(current_user.id)
    return UserPublic.model_validate(user)


@router.post("/experience", response_model=UserPublic)
async def add_experience(
    payload: ExperienceGrantRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserPublic:
    service = ProgressService(db=db)
    user = await service.award_experience(current_user.id, payload.amount)
    return UserPublic.model_validate(user)
