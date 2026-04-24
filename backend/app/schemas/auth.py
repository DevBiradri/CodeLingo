from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    username: str = Field(min_length=3, max_length=64)
    password: str = Field(min_length=8, max_length=128)


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    username: str
    name: str
    preferred_domains: list[str]
    preferred_languages: list[str]
    health_points: int
    max_health_points: int = 5
    health_next_regen_at: datetime | None
    health_regen_seconds: int = 180
    experience_points: int
    created_at: datetime


class UpdateUserRequest(BaseModel):
    email: EmailStr | None = None
    username: str | None = Field(default=None, min_length=3, max_length=64)
    name: str | None = Field(default=None, min_length=2, max_length=120)
    preferred_domains: list[str] | None = None
    preferred_languages: list[str] | None = None
    current_password: str | None = Field(default=None, min_length=8, max_length=128)
    new_password: str | None = Field(default=None, min_length=8, max_length=128)

    @model_validator(mode="after")
    def validate_payload(self) -> "UpdateUserRequest":
        has_update = any(
            value is not None
            for value in [
                self.email,
                self.username,
                self.name,
                self.preferred_domains,
                self.preferred_languages,
                self.new_password,
            ]
        )
        if not has_update:
            raise ValueError("At least one field must be provided for update")

        if self.new_password and not self.current_password:
            raise ValueError("current_password is required when changing password")

        if self.current_password and not self.new_password:
            raise ValueError("new_password is required when changing password")

        return self


class AuthResponse(BaseModel):
    user: UserPublic
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_at: datetime
    refresh_expires_at: datetime
