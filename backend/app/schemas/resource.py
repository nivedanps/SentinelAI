"""
Resource Schemas — Asset tracking, depot management, dispatch DTOs
"""

from typing import Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.geojson import GeoJSONPoint

ResourceType = Literal[
    "RESCUE_TEAM", "AMBULANCE", "FIRE_ENGINE", "FOOD_SUPPLY",
    "WATER_PURIFIER", "GENERATOR", "BOAT", "MEDICAL_SUPPLIES",
]

ResourceStatus = Literal["AVAILABLE", "DISPATCHED", "MAINTENANCE", "DEPLETED"]


class ResourceCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    type: ResourceType
    quantity: int = Field(..., ge=1)
    current_location: GeoJSONPoint
    depot_name: str = Field(..., min_length=2, max_length=100)


class ResourceUpdate(BaseModel):
    status: Optional[ResourceStatus] = None
    quantity: Optional[int] = Field(None, ge=0)
    current_location: Optional[GeoJSONPoint] = None
    assigned_incident_id: Optional[str] = None


class ResourceResponse(BaseModel):
    id: str
    name: str
    type: ResourceType
    quantity: int
    status: ResourceStatus
    current_location: GeoJSONPoint
    depot_name: str
    assigned_incident_id: Optional[str] = None
    updated_at: Optional[datetime] = None


class ResourceListResponse(BaseModel):
    total: int
    resources: List[ResourceResponse]


class DispatchRequest(BaseModel):
    """Request to dispatch a specific resource to an incident."""
    resource_id: str
    incident_id: str


class AutoAllocateRequest(BaseModel):
    """Request auto-allocation engine to assign optimal resources to an incident."""
    incident_id: str
    resource_types_needed: List[ResourceType]
    max_radius_km: float = Field(default=25.0, ge=1.0, le=100.0)
