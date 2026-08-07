"""
Incident Endpoints — SOS submission, listing, triage, and spatial queries
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.dependencies import get_incident_service
from app.services.incident_service import IncidentService
from app.core.security import get_current_user, RoleChecker, ROLE_ALL, ROLE_COMMAND
from app.schemas.incident import IncidentCreate, IncidentUpdate

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.post("/", status_code=201)
async def create_incident(
    incident_in: IncidentCreate,
    current_user: dict = Depends(get_current_user),
    service: IncidentService = Depends(get_incident_service),
):
    data = incident_in.model_dump()
    return await service.create_incident(data, user_id=current_user.get("_id"))


@router.get("/")
async def list_incidents(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    service: IncidentService = Depends(get_incident_service),
):
    return await service.list_incidents(
        status=status, category=category, page=page, page_size=page_size
    )


@router.get("/nearby")
async def find_nearby_incidents(
    longitude: float = Query(..., ge=-180, le=180),
    latitude: float = Query(..., ge=-90, le=90),
    radius_km: float = Query(10.0, ge=0.1, le=100),
    category: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    service: IncidentService = Depends(get_incident_service),
):
    return await service.find_nearby(
        longitude=longitude, latitude=latitude, radius_km=radius_km, category=category
    )


@router.get("/analytics")
async def get_incident_analytics(
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: IncidentService = Depends(get_incident_service),
):
    return await service.get_analytics()


@router.get("/{incident_id}")
async def get_incident(
    incident_id: str,
    current_user: dict = Depends(get_current_user),
    service: IncidentService = Depends(get_incident_service),
):
    return await service.get_incident(incident_id)


@router.patch("/{incident_id}")
async def update_incident(
    incident_id: str,
    update_data: IncidentUpdate,
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: IncidentService = Depends(get_incident_service),
):
    data = update_data.model_dump(exclude_unset=True)
    return await service.update_incident(incident_id, data)
