from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Callable

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.user import User

MAX_HEALTH_POINTS = 5
HEALTH_REGEN_INTERVAL = timedelta(minutes=3)
Clock = Callable[[], datetime]


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ProgressService:
    def __init__(self, db: AsyncSession, clock: Clock = _utcnow) -> None:
        self.db = db
        self.clock = clock

    async def get_progress(self, user_id: str) -> User:
        user = await self._get_active_user(user_id)
        await self._refresh_health(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def record_failure(self, user_id: str) -> User:
        user = await self._get_active_user(user_id)
        await self._refresh_health(user)

        if user.health_points <= 0:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="No health points available",
            )

        user.health_points -= 1
        if user.health_points < MAX_HEALTH_POINTS and user.health_next_regen_at is None:
            user.health_next_regen_at = self.clock() + HEALTH_REGEN_INTERVAL

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def award_experience(self, user_id: str, amount: int) -> User:
        if amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Experience amount must be positive",
            )

        user = await self._get_active_user(user_id)
        await self._refresh_health(user)
        user.experience_points += amount

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def increment_mission_count(self, user_id: str, subtopic: str) -> User:
        user = await self._get_active_user(user_id)
        
        # Ensure completed_missions is a dict (SQLAlchemy JSON field initialization)
        if user.completed_missions is None:
            user.completed_missions = {}
            
        # Use a copy to ensure SQLAlchemy detects the change in the JSON field
        current = dict(user.completed_missions)
        current[subtopic] = current.get(subtopic, 0) + 1
        user.completed_missions = current

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def _get_active_user(self, user_id: str) -> User:
        user = await self.db.get(User, user_id)
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user

    async def _refresh_health(self, user: User) -> None:
        now = self._normalize_datetime(self.clock())

        if user.health_points >= MAX_HEALTH_POINTS:
            user.health_points = MAX_HEALTH_POINTS
            user.health_next_regen_at = None
            return

        if user.health_next_regen_at is None:
            user.health_next_regen_at = now + HEALTH_REGEN_INTERVAL
            return

        next_regen_at = self._normalize_datetime(user.health_next_regen_at)
        regenerated = False
        while user.health_points < MAX_HEALTH_POINTS and next_regen_at <= now:
            user.health_points += 1
            regenerated = True
            next_regen_at += HEALTH_REGEN_INTERVAL

        if user.health_points >= MAX_HEALTH_POINTS:
            user.health_points = MAX_HEALTH_POINTS
            user.health_next_regen_at = None
        elif regenerated:
            user.health_next_regen_at = next_regen_at

    def _normalize_datetime(self, value: datetime | None) -> datetime:
        if value is None:
            return datetime.now(timezone.utc)

        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)

        return value.astimezone(timezone.utc)
