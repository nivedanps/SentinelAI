"""
Hospital Endpoints — Bed tracking, ICU routing, utilization metrics
"""

from fastapi import APIRouter, Depends, Query
from app.dependencies import get_hospital_service
from app.services.hospital_service import HospitalService
from app.core.security import get_current_user, RoleChecker, ROLE_MEDICAL, ROLE_COMMAND
from app.schemas.hospital import HospitalCreate, HospitalUpdate

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])


@router.post("/", status_code=201)
async def create_hospital(
    hospital_in: HospitalCreate,
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: HospitalService = Depends(get_hospital_service),
):
    return await service.create_hospital(hospital_in.model_dump())


@router.get("/")
async def list_hospitals(
    current_user: dict = Depends(get_current_user),
    service: HospitalService = Depends(get_hospital_service),
):
    return await service.list_hospitals()


@router.get("/nearest-icu")
async def find_nearest_icu(
    longitude: float = Query(..., ge=-180, le=180),
    latitude: float = Query(..., ge=-90, le=90),
    max_distance_km: float = Query(20.0, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
    service: HospitalService = Depends(get_hospital_service),
):
    return await service.find_nearest_with_icu(longitude, latitude, max_distance_km)


@router.get("/utilization")
async def bed_utilization(
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: HospitalService = Depends(get_hospital_service),
):
    return await service.get_bed_utilization()


@router.get("/{hospital_id}")
async def get_hospital(
    hospital_id: str,
    current_user: dict = Depends(get_current_user),
    service: HospitalService = Depends(get_hospital_service),
):
    return await service.get_hospital(hospital_id)


@router.patch("/{hospital_id}")
async def update_hospital(
    hospital_id: str,
    update_data: HospitalUpdate,
    current_user: dict = Depends(RoleChecker(ROLE_MEDICAL)),
    service: HospitalService = Depends(get_hospital_service),
):
    return await service.update_hospital(hospital_id, update_data.model_dump(exclude_unset=True))
