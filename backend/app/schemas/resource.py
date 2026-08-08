"""
Resource Schemas — Asset tracking, depot management, dispatch DTOs
"""

from typing import Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.geojson import GeoJSONPoint

ResourceCategory = Literal[
    "Emergency Vehicles", "Rescue Equipment", "Personnel", "Supplies"
]

ResourceType = Literal[
    "Ambulance", "Fire Truck", "Police Vehicle", "Rescue Vehicle",
    "Rescue Boat", "Drone", "Generator", "Heavy Machinery",
    "Medical Team", "Fire Team", "Police Team", "Rescue Team", "Engineer", "Volunteer Team",
    "Food", "Drinking Water", "Medical Supplies", "Blankets", "Emergency Kits",
    # Legacy enum support
    "RESCUE_TEAM", "AMBULANCE", "FIRE_ENGINE", "FOOD_SUPPLY", "WATER_PURIFIER", "GENERATOR", "BOAT", "MEDICAL_SUPPLIES"
]

ResourceStatus = Literal["AVAILABLE", "DEPLOYED", "RESERVED", "MAINTENANCE", "UNAVAILABLE", "LOST", "DISPATCHED", "DEPLETED"]

ResourcePriority = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class ResourceCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    category: Optional[str] = "Emergency Vehicles"
    type: str = Field(..., min_length=2)
    organization_agency: Optional[str] = "Emergency Services"
    status: Optional[ResourceStatus] = "AVAILABLE"
    priority: Optional[ResourcePriority] = "MEDIUM"
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    location_name: Optional[str] = "Command Depot"
    capacity: Optional[str] = "Standard"
    contact: Optional[str] = None
    notes: Optional[str] = None


class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    organization_agency: Optional[str] = None
    status: Optional[ResourceStatus] = None
    priority: Optional[ResourcePriority] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    capacity: Optional[str] = None
    contact: Optional[str] = None
    notes: Optional[str] = None
    assigned_incident_id: Optional[str] = None
    assigned_team: Optional[str] = None


class ResourceResponse(BaseModel):
    id: str
    resource_id: Optional[str] = None
    name: str
    category: str
    type: str
    organization_agency: str
    status: ResourceStatus
    priority: ResourcePriority
    latitude: float
    longitude: float
    location_name: str
    capacity: Optional[str] = None
    contact: Optional[str] = None
    assigned_incident_id: Optional[str] = None
    assigned_team: Optional[str] = None
    updated_at: Optional[datetime] = None
    notes: Optional[str] = None


class ResourceListResponse(BaseModel):
    total: int
    resources: List[ResourceResponse]


class DispatchRequest(BaseModel):
    """Request to dispatch/assign a specific resource to an incident."""
    resource_id: str
    incident_id: str


class AutoAllocateRequest(BaseModel):
    """Request auto-allocation engine to assign optimal resources to an incident."""
    incident_id: str
    resource_types_needed: List[str]
    max_radius_km: float = Field(default=25.0, ge=1.0, le=100.0)
