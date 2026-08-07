"""
Authentication Endpoints — Sign-up, Login, Token Refresh, Profile
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import (
    get_password_hash, verify_password, create_access_token, get_current_user,
)
from app.core.exceptions import InvalidCredentialsException, DuplicateEntityException
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserProfile, UserUpdate
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserRegister,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    existing = await db.users.find_one({"email": user_in.email})
    if existing:
        raise DuplicateEntityException("User", "email", user_in.email)

    user_doc = {
        "email": user_in.email,
        "hashed_password": get_password_hash(user_in.password),
        "full_name": user_in.full_name,
        "phone": user_in.phone,
        "role": user_in.role,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["id"] = str(result.inserted_id)
    return UserProfile(**user_doc)


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise InvalidCredentialsException()

    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    profile = UserProfile(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        phone=user.get("phone"),
    )
    return TokenResponse(access_token=access_token, user=profile)


@router.get("/me", response_model=UserProfile)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserProfile(
        id=current_user["_id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=current_user["role"],
        phone=current_user.get("phone"),
        created_at=current_user.get("created_at"),
    )


@router.put("/me", response_model=UserProfile)
async def update_me(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    update_fields = update_data.model_dump(exclude_unset=True)
    if update_fields:
        from bson import ObjectId
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$set": update_fields},
        )
    updated = await db.users.find_one({"_id": ObjectId(current_user["_id"])})
    return UserProfile(
        id=str(updated["_id"]),
        email=updated["email"],
        full_name=updated["full_name"],
        role=updated["role"],
        phone=updated.get("phone"),
    )
