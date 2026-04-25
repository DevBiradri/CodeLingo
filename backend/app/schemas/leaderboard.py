from __future__ import annotations

from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    name: str
    experience_points: int
    level: int
    level_name: str


class LeaderboardResponse(BaseModel):
    entries: list[LeaderboardEntry]
    total: int
