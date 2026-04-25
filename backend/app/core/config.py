import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the directory of the current file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_FILE = os.path.join(BASE_DIR, ".env")

# Explicitly load .env file
load_dotenv(ENV_FILE)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "CodeQuest API"
    environment: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    database_url: str = "sqlite+aiosqlite:///./codequest.db"
    secret_key: str = Field(default="change-me-in-production")
    jwt_algorithm: str = "HS256"
    session_ttl_minutes: int = 60 * 24 * 7
    refresh_session_ttl_minutes: int = 60 * 24 * 30
    session_cookie_name: str = "codequest_session"
    refresh_cookie_name: str = "codequest_refresh"
    session_cookie_secure: bool = False
    session_cookie_httponly: bool = True
    session_cookie_samesite: str = "lax"
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    gemini_api_key: str | None = None
    gemini_generation_model: str = "gemini-2.0-flash"
    gemini_judge_model: str = "gemini-2.0-flash"
    question_cache_ttl_seconds: int = 60 * 30
    challenge_success_xp: int = 10
    refactor_success_threshold: int = 70


@lru_cache
def get_settings() -> Settings:
    return Settings()
