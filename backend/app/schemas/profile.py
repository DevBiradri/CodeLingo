from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ProgressResponse(BaseModel):
    """Current XP, HP, and level snapshot for the authenticated user."""
    model_config = ConfigDict(from_attributes=True)

    experience_points: int
    health_points: int
    max_health_points: int
    health_next_regen_at: datetime | None
    health_regen_seconds: int
    level: int
    level_name: str
    xp_for_current_level: int
    xp_for_next_level: int | None
    xp_to_next_level: int | None
    completed_missions: dict[str, int] = Field(default_factory=dict)


class ProfileResponse(BaseModel):
    """Full user profile including level progression and health data."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    username: str
    name: str
    preferred_domains: list[str]
    preferred_languages: list[str]
    experience_points: int
    health_points: int
    max_health_points: int
    health_next_regen_at: datetime | None
    health_regen_seconds: int
    level: int
    level_name: str
    xp_for_current_level: int
    xp_for_next_level: int | None
    xp_to_next_level: int | None
    created_at: datetime


class ChangeLanguageRequest(BaseModel):
    language: str  # The single language the user wants to set as their primary
