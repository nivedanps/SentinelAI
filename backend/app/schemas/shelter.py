"""
Shelter Schemas — Capacity tracking, amenity metadata, nearest shelter query DTOs
"""

from typing import Optional, List, Literal
from pydantic import BaseModel, Field
from app.schemas.geojson import GeoJSONPoint

ShelterAmenity = Literal[
    "MEDICAL_BAY", "FOOD_STATION", "POWER_GENERATOR",
    "WATER_SUPPLY", "SANITATION", "CHILD_CARE", "PET_FRIENDLY",
]


class ShelterCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    capacity_total: int = Field(..., ge=1)
    location: GeoJSONPoint
    amenities: List[ShelterAmenity] = []
    contact_person: str = Field(..., min_length=2, max_length=100)
    contact_phone: str = Field(..., max_length=20)


class ShelterUpdate(BaseModel):
    capacity_current: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    amenities: Optional[List[ShelterAmenity]] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None


class ShelterResponse(BaseModel):
    id: str
    name: str
    capacity_total: int
    capacity_current: int = 0
    occupancy_percentage: float = 0.0
    location: GeoJSONPoint
    amenities: List[ShelterAmenity] = []
    contact_person: str
    contact_phone: str
    is_active: bool = True
    status_label: str = "OPEN"  # OPEN / NEAR_FULL / FULL


class ShelterListResponse(BaseModel):
    total: int
    shelters: List[ShelterResponse]
