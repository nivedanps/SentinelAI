"""
Shelter Endpoints — Capacity management, nearest shelter routing
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.dependencies import get_shelter_service
from app.services.shelter_service import ShelterService
from app.core.security import get_current_user, RoleChecker, ROLE_COMMAND
from app.schemas.shelter import ShelterCreate, ShelterUpdate

router = APIRouter(prefix="/shelters", tags=["Shelters"])


@router.post("/", status_code=201)
async def create_shelter(
    shelter_in: ShelterCreate,
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: ShelterService = Depends(get_shelter_service),
):
    return await service.create_shelter(shelter_in.model_dump())


@router.get("/")
async def list_shelters(
    active_only: bool = Query(True),
    current_user: dict = Depends(get_current_user),
    service: ShelterService = Depends(get_shelter_service),
):
    return await service.list_shelters(active_only=active_only)


@router.get("/nearest")
async def find_nearest_shelter(
    longitude: float = Query(..., ge=-180, le=180),
    latitude: float = Query(..., ge=-90, le=90),
    max_distance_km: float = Query(15.0, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
    service: ShelterService = Depends(get_shelter_service),
):
    return await service.find_nearest_open(longitude, latitude, max_distance_km)


@router.get("/capacity-overview")
async def capacity_overview(
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: ShelterService = Depends(get_shelter_service),
):
    return await service.get_capacity_overview()


@router.get("/{shelter_id}")
async def get_shelter(
    shelter_id: str,
    current_user: dict = Depends(get_current_user),
    service: ShelterService = Depends(get_shelter_service),
):
    return await service.get_shelter(shelter_id)


@router.patch("/{shelter_id}")
async def update_shelter(
    shelter_id: str,
    update_data: ShelterUpdate,
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: ShelterService = Depends(get_shelter_service),
):
    return await service.update_shelter(shelter_id, update_data.model_dump(exclude_unset=True))


@router.patch("/{shelter_id}/capacity")
async def update_capacity(
    shelter_id: str,
    capacity_current: int = Query(..., ge=0),
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: ShelterService = Depends(get_shelter_service),
):
    return await service.update_capacity(shelter_id, capacity_current)
