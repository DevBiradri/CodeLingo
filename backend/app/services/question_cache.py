from __future__ import annotations

import secrets
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from backend.app.schemas.question import GeneratedQuestion


@dataclass(slots=True)
class CachedQuestion:
    question: GeneratedQuestion
    expires_at: datetime


class InMemoryQuestionCache:
    def __init__(self, ttl_seconds: int) -> None:
        self._ttl_seconds = ttl_seconds
        self._items: dict[str, CachedQuestion] = {}

    def put(self, question: GeneratedQuestion) -> str:
        key = secrets.token_urlsafe(18)
        self._items[key] = CachedQuestion(
            question=question,
            expires_at=datetime.now(timezone.utc)
            + timedelta(seconds=self._ttl_seconds),
        )
        self._cleanup_expired()
        return key

    def get(self, key: str) -> GeneratedQuestion | None:
        self._cleanup_expired()
        cached = self._items.get(key)
        if cached is None:
            return None
        if cached.expires_at <= datetime.now(timezone.utc):
            self._items.pop(key, None)
            return None
        return cached.question

    def _cleanup_expired(self) -> None:
        now = datetime.now(timezone.utc)
        expired_keys = [k for k, item in self._items.items() if item.expires_at <= now]
        for key in expired_keys:
            self._items.pop(key, None)
