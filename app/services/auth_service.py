from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import HTTPException, status
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy import or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.security import (
    create_session_jwt,
    decode_session_jwt,
    generate_session_jti,
    hash_password,
    hash_session_identifier,
    normalize_email,
    slugify_username,
    verify_password,
)
from app.models.session import Session
from app.models.user import User


@dataclass(slots=True)
class AuthResult:
    user: User
    session: Session
    access_token: str
    refresh_token: str


class AuthService:
    def __init__(self, db: AsyncSession, settings: Settings) -> None:
        self.db = db
        self.settings = settings

    async def register(self, email: str, name: str, password: str) -> AuthResult:
        normalized_email = normalize_email(email)
        existing = await self.db.scalar(
            select(User).where(User.email == normalized_email)
        )
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
            )

        username = await self._build_unique_username(name=name, email=normalized_email)
        user = User(
            email=normalized_email,
            username=username,
            name=name.strip(),
            password_hash=hash_password(password),
        )
        self.db.add(user)
        await self.db.flush()

        session_id = str(uuid4())
        session_jti = generate_session_jti()
        session, access_token, refresh_token = self._build_session_bundle(
            user_id=user.id,
            session_id=session_id,
            access_jti=session_jti,
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(user)
        await self.db.refresh(session)
        return AuthResult(user=user, session=session, access_token=access_token, refresh_token=refresh_token)

    async def login(self, username: str, password: str) -> AuthResult:
        normalized_username = username.strip().lower()
        user = await self.db.scalar(
            select(User).where(
                or_(
                    User.username == normalized_username,
                    User.email == normalized_username,
                )
            )
        )
        if user is None or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )

        session_id = str(uuid4())
        session_jti = generate_session_jti()
        session, access_token, refresh_token = self._build_session_bundle(
            user_id=user.id,
            session_id=session_id,
            access_jti=session_jti,
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return AuthResult(user=user, session=session, access_token=access_token, refresh_token=refresh_token)

    async def refresh(self, raw_token: str) -> AuthResult:
        try:
            claims = decode_session_jwt(raw_token, self.settings.secret_key, self.settings.jwt_algorithm)
        except ExpiredSignatureError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired") from exc
        except InvalidTokenError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session") from exc

        if claims.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

        session = await self.db.scalar(
            select(Session).where(
                Session.id == claims["sid"],
                Session.refresh_jti_hash == hash_session_identifier(claims["jti"]),
                Session.revoked_at.is_(None),
            )
        )
        if session is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

        now = datetime.now(timezone.utc)
        if session.refresh_expires_at <= now:
            session.revoked_at = now
            await self.db.commit()
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")

        user = await self.db.get(User, session.user_id)
        if user is None or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive account")

        access_jti = generate_session_jti()
        refresh_jti = generate_session_jti()
        session.access_jti_hash = hash_session_identifier(access_jti)
        session.refresh_jti_hash = hash_session_identifier(refresh_jti)
        session.access_expires_at = now + timedelta(minutes=self.settings.session_ttl_minutes)
        session.refresh_expires_at = now + timedelta(minutes=self.settings.refresh_session_ttl_minutes)
        session.last_used_at = now

        access_token = create_session_jwt(
            user_id=user.id,
            session_id=session.id,
            session_jti=access_jti,
            expires_at=session.access_expires_at,
            token_type="access",
            secret_key=self.settings.secret_key,
            algorithm=self.settings.jwt_algorithm,
        )
        refresh_token = create_session_jwt(
            user_id=user.id,
            session_id=session.id,
            session_jti=refresh_jti,
            expires_at=session.refresh_expires_at,
            token_type="refresh",
            secret_key=self.settings.secret_key,
            algorithm=self.settings.jwt_algorithm,
        )

        await self.db.commit()
        await self.db.refresh(session)
        return AuthResult(user=user, session=session, access_token=access_token, refresh_token=refresh_token)

    async def logout(self, raw_token: str) -> None:
        try:
            claims = decode_session_jwt(raw_token, self.settings.secret_key, self.settings.jwt_algorithm, verify_exp=False)
        except InvalidTokenError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session") from exc

        if claims.get("type") not in {"access", "refresh"}:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

        session = await self.db.scalar(select(Session).where(Session.id == claims["sid"], Session.revoked_at.is_(None)))
        if session is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

        session.revoked_at = datetime.now(timezone.utc)
        await self.db.commit()

    async def get_user_from_session_token(self, raw_token: str) -> User:
        try:
            claims = decode_session_jwt(raw_token, self.settings.secret_key, self.settings.jwt_algorithm)
        except ExpiredSignatureError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired") from exc
        except InvalidTokenError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session") from exc

        if claims.get("type") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

        session = await self.db.scalar(
            select(Session).where(
                Session.id == claims["sid"],
                Session.access_jti_hash == hash_session_identifier(claims["jti"]),
                Session.revoked_at.is_(None),
            )
        )
        if session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session"
            )

        now = datetime.now(timezone.utc)
        if session.access_expires_at <= now:
            session.revoked_at = now
            await self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired"
            )

        session.last_used_at = now
        await self.db.commit()

        user = await self.db.get(User, session.user_id)
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive account"
            )
        return user

    async def update_user(
        self,
        *,
        user_id: str,
        email: str | None = None,
        username: str | None = None,
        name: str | None = None,
        preferred_domains: list[str] | None = None,
        preferred_languages: list[str] | None = None,
        current_password: str | None = None,
        new_password: str | None = None,
    ) -> User:
        user = await self.db.get(User, user_id)
        if user is None or not user.is_active:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if email is not None:
            normalized_email = normalize_email(email)
            existing_by_email = await self.db.scalar(select(User).where(User.email == normalized_email, User.id != user.id))
            if existing_by_email is not None:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")
            user.email = normalized_email

        if username is not None:
            normalized_username = username.strip().lower()
            existing_by_username = await self.db.scalar(
                select(User).where(User.username == normalized_username, User.id != user.id)
            )
            if existing_by_username is not None:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already in use")
            user.username = normalized_username

        if name is not None:
            user.name = name.strip()

        if preferred_domains is not None:
            user.preferred_domains = self._normalize_unique_list(preferred_domains)

        if preferred_languages is not None:
            user.preferred_languages = self._normalize_unique_list(preferred_languages)

        if new_password is not None:
            if current_password is None or not verify_password(current_password, user.password_hash):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid current password")
            user.password_hash = hash_password(new_password)

            # Invalidate existing sessions after password changes.
            await self.db.execute(
                update(Session)
                .where(Session.user_id == user.id, Session.revoked_at.is_(None))
                .values(revoked_at=datetime.now(timezone.utc))
            )

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def _build_unique_username(self, name: str, email: str) -> str:
        base_username = slugify_username(name or email.split("@")[0])
        candidate = base_username
        suffix = 1

        while (
            await self.db.scalar(select(User.id).where(User.username == candidate))
            is not None
        ):
            suffix += 1
            candidate = f"{base_username}{suffix}"

        return candidate

    def _build_session_bundle(self, user_id: str, session_id: str, access_jti: str) -> tuple[Session, str, str]:
        now = datetime.now(timezone.utc)
        access_expires_at = now + timedelta(minutes=self.settings.session_ttl_minutes)
        refresh_expires_at = now + timedelta(minutes=self.settings.refresh_session_ttl_minutes)
        refresh_jti = generate_session_jti()
        session = Session(
            id=session_id,
            user_id=user_id,
            access_jti_hash=hash_session_identifier(access_jti),
            access_expires_at=access_expires_at,
            refresh_jti_hash=hash_session_identifier(refresh_jti),
            refresh_expires_at=refresh_expires_at,
        )
        access_token = create_session_jwt(
            user_id=user_id,
            session_id=session_id,
            session_jti=access_jti,
            expires_at=access_expires_at,
            token_type="access",
            secret_key=self.settings.secret_key,
            algorithm=self.settings.jwt_algorithm,
        )
        refresh_token = create_session_jwt(
            user_id=user_id,
            session_id=session_id,
            session_jti=refresh_jti,
            expires_at=refresh_expires_at,
            token_type="refresh",
            secret_key=self.settings.secret_key,
            algorithm=self.settings.jwt_algorithm,
        )
        return session, access_token, refresh_token

    def _normalize_unique_list(self, values: list[str]) -> list[str]:
        normalized: list[str] = []
        seen: set[str] = set()
        for raw in values:
            value = raw.strip()
            if not value:
                continue
            key = value.lower()
            if key in seen:
                continue
            seen.add(key)
            normalized.append(value)
        return normalized
