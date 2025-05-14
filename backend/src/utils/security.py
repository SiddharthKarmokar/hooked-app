import bcrypt
from fastapi import HTTPException, status
from typing import Dict, Any
from jose import jwt
from datetime import datetime, timedelta, timezone
from src.config.common_setting import settings

ALGORITHM = "HS256"

class Security:
    def __init__(self):
        pass

    def hash_password(self, password: str) -> str:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed.decode("utf-8")  # Store as string

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

    def create_access_token(self, data: dict, expires_delta: timedelta = timedelta(days=1)):
        to_encode = data.copy()
        to_encode.update({"exp": datetime.now(timezone.utc) + expires_delta})
        return jwt.encode(to_encode, settings.JWT_HASH_KEY, algorithm=ALGORITHM)

    def decode_token(self, token: str) -> Dict[str, Any]:
        try:
            payload = jwt.decode(token, settings.JWT_HASH_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
