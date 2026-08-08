"""
Hospital Schemas — Bed tracking, ICU capacity, blood inventory DTOs
"""

from typing import Optional, Literal, Dict

from typing import List
from pydantic import BaseModel, Field
from app.schemas.geojson import GeoJSONPoint

OxygenStatus = Literal["SUFFICIENT", "CRITICAL", "EXHAUSTED"]


class BloodInventory(BaseModel):
    A_positive: int = 0
    A_negative: int = 0
    B_positive: int = 0
    B_negative: int = 0
    O_positive: int = 0
    O_negative: int = 0
    AB_positive: int = 0
    AB_negative: int = 0


class HospitalCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    location: GeoJSONPoint
    total_beds: int = Field(..., ge=1)
    available_general_beds: int = Field(..., ge=0)
    available_icu_beds: int = Field(..., ge=0)
    oxygen_status: OxygenStatus = "SUFFICIENT"
    blood_inventory: Optional[BloodInventory] = None
    contact_phone: str = Field(..., max_length=20)


class HospitalUpdate(BaseModel):
    available_general_beds: Optional[int] = Field(None, ge=0)
    available_icu_beds: Optional[int] = Field(None, ge=0)
    oxygen_status: Optional[OxygenStatus] = None
    blood_inventory: Optional[BloodInventory] = None
    contact_phone: Optional[str] = None


class HospitalResponse(BaseModel):
    id: str
    name: str
    location: GeoJSONPoint
    total_beds: int
    available_general_beds: int
    available_icu_beds: int
    total_available_beds: int = 0
    bed_utilization_percentage: float = 0.0
    oxygen_status: OxygenStatus
    blood_inventory: Optional[BloodInventory] = None
    contact_phone: str


class HospitalListResponse(BaseModel):
    total: int
    hospitals: List[HospitalResponse]


# Fix missing import at module level
from typing import List
HospitalListResponse.model_rebuild()
