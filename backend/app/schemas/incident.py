"""
Incident Schemas — SOS Submission, Incident Response, Cluster DTOs
"""

from typing import Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.geojson import GeoJSONPoint, AddressMetadata

IncidentCategory = Literal[
    "FLOOD", "FIRE", "BUILDING_COLLAPSE", "LANDSLIDE",
    "MEDICAL_EMERGENCY", "HAZMAT", "CYCLONE", "EARTHQUAKE", "OTHER",
]

IncidentStatus = Literal[
    "REPORTED", "VERIFIED", "DISPATCHED", "IN_PROGRESS", "RESOLVED", "REJECTED",
]


class AIAnalysis(BaseModel):
    """AI-generated enrichment attached to an incident."""
    urgency: Optional[str] = None
    extracted_needs: Optional[List[str]] = None
    damage_score: Optional[float] = None
    confidence: Optional[float] = None
    summary: Optional[str] = None


class IncidentCreate(BaseModel):
    """Citizen SOS submission / Operator manual entry."""
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    category: IncidentCategory
    location: GeoJSONPoint
    media_urls: Optional[List[str]] = []


class IncidentUpdate(BaseModel):
    """Operator or Officer updating an incident's status or details."""
    status: Optional[IncidentStatus] = None
    severity_score: Optional[float] = Field(None, ge=1.0, le=10.0)
    category: Optional[IncidentCategory] = None
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=2000)


class IncidentResponse(BaseModel):
    """Full incident document returned from API."""
    id: str
    cluster_id: Optional[str] = None
    reported_by_id: Optional[str] = None
    title: str
    description: str
    category: IncidentCategory
    status: IncidentStatus
    severity_score: float
    location: GeoJSONPoint
    address_metadata: Optional[AddressMetadata] = None
    media_urls: List[str] = []
    ai_analysis: Optional[AIAnalysis] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class IncidentListResponse(BaseModel):
    """Paginated list of incidents."""
    total: int
    page: int
    page_size: int
    incidents: List[IncidentResponse]


# --- Cluster Schemas ---

class IncidentClusterResponse(BaseModel):
    """Fused incident cluster (deduplicated group of reports)."""
    id: str
    primary_incident_id: str
    child_incident_ids: List[str]
    category: IncidentCategory
    aggregate_severity: float
    centroid: GeoJSONPoint
    radius_meters: float
    status: IncidentStatus
    report_count: int = 1
    created_at: Optional[datetime] = None


class NearbyIncidentQuery(BaseModel):
    """Query parameters for spatial proximity search."""
    longitude: float = Field(..., ge=-180, le=180)
    latitude: float = Field(..., ge=-90, le=90)
    radius_km: float = Field(default=10.0, ge=0.1, le=100.0)
    category: Optional[IncidentCategory] = None
    status: Optional[IncidentStatus] = None
