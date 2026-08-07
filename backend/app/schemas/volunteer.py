"""
Volunteer Schemas — Registration, skill matching, task assignment DTOs
"""

from typing import Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.geojson import GeoJSONPoint

VolunteerSkill = Literal[
    "FIRST_AID", "DRIVER", "COOKING", "SEARCH_AND_RESCUE",
    "HEAVY_MACHINERY", "BOAT_HANDLER", "COUNSELING",
    "COMMUNICATION", "LOGISTICS",
]

VolunteerStatus = Literal["AVAILABLE", "ASSIGNED", "UNAVAILABLE"]


class VolunteerRegister(BaseModel):
    skills: List[VolunteerSkill] = Field(..., min_length=1)
    current_location: GeoJSONPoint
    phone: Optional[str] = Field(None, max_length=20)


class VolunteerUpdate(BaseModel):
    status: Optional[VolunteerStatus] = None
    current_location: Optional[GeoJSONPoint] = None
    skills: Optional[List[VolunteerSkill]] = None


class VolunteerResponse(BaseModel):
    id: str
    user_id: str
    user_name: Optional[str] = None
    skills: List[VolunteerSkill]
    status: VolunteerStatus
    current_location: GeoJSONPoint
    assigned_task_id: Optional[str] = None
    created_at: Optional[datetime] = None


class VolunteerListResponse(BaseModel):
    total: int
    volunteers: List[VolunteerResponse]


class VolunteerTaskAssign(BaseModel):
    """Assign a volunteer to a relief task linked to an incident."""
    volunteer_id: str
    incident_id: str
    task_description: str = Field(..., min_length=5, max_length=500)
