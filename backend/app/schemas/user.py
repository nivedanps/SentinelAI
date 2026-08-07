"""
User Schemas — Registration, Login, Profile DTOs
"""

from typing import Optional, Literal
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.schemas.geojson import GeoJSONPolygon

# Role enum values
UserRole = Literal[
    "CITIZEN",
    "OPERATOR",
    "DISTRICT_ADMIN",
    "OFFICER",
    "HOSPITAL_COORD",
    "VOLUNTEER_COORD",
    "RESPONSE_TEAM",
]


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    role: UserRole = "CITIZEN"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserProfile"


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    phone: Optional[str] = None
    jurisdiction_geo: Optional[GeoJSONPolygon] = None
    created_at: Optional[datetime] = None


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    jurisdiction_geo: Optional[GeoJSONPolygon] = None


# Fix forward reference
TokenResponse.model_rebuild()
