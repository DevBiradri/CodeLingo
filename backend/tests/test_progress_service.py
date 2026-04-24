from __future__ import annotations

import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from backend.app.db.base import Base
from backend.app.models import session as session_model  # noqa: F401
from backend.app.models.user import User
from backend.app.services.progress_service import (
    HEALTH_REGEN_INTERVAL,
    MAX_HEALTH_POINTS,
    ProgressService,
)


class ProgressServiceTestCase(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory()
        db_path = Path(self.tempdir.name) / "test.db"
        self.engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}")
        self.sessionmaker = async_sessionmaker(
            self.engine, expire_on_commit=False, class_=AsyncSession
        )

        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def asyncTearDown(self) -> None:
        await self.engine.dispose()
        self.tempdir.cleanup()

    async def _create_user(
        self,
        *,
        health_points: int = MAX_HEALTH_POINTS,
        health_next_regen_at: datetime | None = None,
        experience_points: int = 0,
    ) -> User:
        async with self.sessionmaker() as session:
            user = User(
                email="player@example.com",
                username="player",
                name="Player",
                password_hash="hash",
                health_points=health_points,
                health_next_regen_at=health_next_regen_at,
                experience_points=experience_points,
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user

    async def test_record_failure_consumes_health_and_preserves_regen_timing(
        self,
    ) -> None:
        base_time = datetime(2026, 4, 25, 12, 0, tzinfo=timezone.utc)
        user = await self._create_user()

        async with self.sessionmaker() as session:
            service = ProgressService(session, clock=lambda: base_time)
            updated = await service.record_failure(user.id)
            self.assertEqual(updated.health_points, 4)
            self.assertEqual(
                updated.health_next_regen_at,
                (base_time + HEALTH_REGEN_INTERVAL).replace(tzinfo=None),
            )

            service = ProgressService(
                session, clock=lambda: base_time + timedelta(minutes=1)
            )
            updated = await service.record_failure(user.id)
            self.assertEqual(updated.health_points, 3)
            self.assertEqual(
                updated.health_next_regen_at,
                (base_time + HEALTH_REGEN_INTERVAL).replace(tzinfo=None),
            )

    async def test_health_regenerates_over_time(self) -> None:
        base_time = datetime(2026, 4, 25, 12, 0, tzinfo=timezone.utc)
        user = await self._create_user(
            health_points=3,
            health_next_regen_at=base_time + HEALTH_REGEN_INTERVAL,
        )

        async with self.sessionmaker() as session:
            service = ProgressService(
                session, clock=lambda: base_time + timedelta(minutes=6, seconds=1)
            )
            updated = await service.get_progress(user.id)
            self.assertEqual(updated.health_points, 5)
            self.assertIsNone(updated.health_next_regen_at)

    async def test_award_experience_increments_total(self) -> None:
        user = await self._create_user(experience_points=12)

        async with self.sessionmaker() as session:
            service = ProgressService(session)
            updated = await service.award_experience(user.id, 8)

            self.assertEqual(updated.experience_points, 20)

    async def test_record_failure_rejects_when_health_is_empty(self) -> None:
        user = await self._create_user(health_points=0, health_next_regen_at=None)

        async with self.sessionmaker() as session:
            service = ProgressService(session)

            with self.assertRaises(HTTPException) as context:
                await service.record_failure(user.id)

            self.assertEqual(context.exception.status_code, 429)
