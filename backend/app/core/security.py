from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.config import settings
from app.core.database import get_database

# ---------------------------------------------------------------------------
# Password Hashing
# ---------------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# ---------------------------------------------------------------------------
# JWT Token Management
# ---------------------------------------------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ---------------------------------------------------------------------------
# Current User Dependency
# ---------------------------------------------------------------------------
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """
    Decodes JWT, resolves user_id from sub claim, and returns the full user doc.
    """
    payload = decode_access_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user["_id"] = str(user["_id"])
    return user


# ---------------------------------------------------------------------------
# Role-Based Access Control (RBAC) Dependency Factory
# ---------------------------------------------------------------------------
class RoleChecker:
    """
    FastAPI dependency that verifies the current user has one of the
    allowed roles before granting access to the endpoint.

    Usage:
        @router.get("/admin-only", dependencies=[Depends(RoleChecker(["DISTRICT_ADMIN"]))])
    """

    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {self.allowed_roles}",
            )
        return current_user


# Convenience role group constants for readability across endpoint definitions
ROLE_ALL = [
    "CITIZEN", "OPERATOR", "DISTRICT_ADMIN", "OFFICER",
    "HOSPITAL_COORD", "VOLUNTEER_COORD", "RESPONSE_TEAM",
]
ROLE_COMMAND = ["DISTRICT_ADMIN", "OFFICER", "OPERATOR"]
ROLE_ADMIN = ["DISTRICT_ADMIN"]
ROLE_MEDICAL = ["HOSPITAL_COORD", "DISTRICT_ADMIN"]
ROLE_VOLUNTEER_MGMT = ["VOLUNTEER_COORD", "DISTRICT_ADMIN", "OFFICER"]
ROLE_FIELD = ["RESPONSE_TEAM", "OFFICER", "OPERATOR"]
