import hashlib
import re
import secrets
from datetime import datetime, timezone
from uuid import uuid4

import jwt

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def normalize_email(email: str) -> str:
    return email.strip().lower()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def generate_session_token() -> str:
    return secrets.token_urlsafe(48)


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def generate_session_jti() -> str:
    return str(uuid4())


def hash_session_identifier(identifier: str) -> str:
    return hashlib.sha256(identifier.encode("utf-8")).hexdigest()


def create_session_jwt(
    *,
    user_id: str,
    session_id: str,
    session_jti: str,
    expires_at: datetime,
    token_type: str,
    secret_key: str,
    algorithm: str,
) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "sid": session_id,
        "jti": session_jti,
        "type": token_type,
        "iat": now,
        "nbf": now,
        "exp": expires_at,
    }
    return jwt.encode(payload, secret_key, algorithm=algorithm)


def decode_session_jwt(token: str, secret_key: str, algorithm: str, verify_exp: bool = True) -> dict:
    return jwt.decode(
        token,
        secret_key,
        algorithms=[algorithm],
        options={"require": ["sub", "sid", "jti", "type", "iat", "nbf", "exp"], "verify_exp": verify_exp},
    )


def slugify_username(value: str) -> str:
    value = normalize_email(value.split("@")[0]) if "@" in value else value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = re.sub(r"_{2,}", "_", value).strip("_")
    return value or "user"
