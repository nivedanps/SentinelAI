"""
Volunteer Endpoints — Registration, skill matching, task assignment
"""

from typing import List
from fastapi import APIRouter, Depends, Query
from app.dependencies import get_volunteer_service
from app.services.volunteer_service import VolunteerService
from app.core.security import get_current_user, RoleChecker, ROLE_VOLUNTEER_MGMT
from app.schemas.volunteer import VolunteerRegister, VolunteerUpdate, VolunteerTaskAssign

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])


@router.post("/register", status_code=201)
async def register_volunteer(
    vol_in: VolunteerRegister,
    current_user: dict = Depends(get_current_user),
    service: VolunteerService = Depends(get_volunteer_service),
):
    return await service.register_volunteer(
        user_id=current_user["_id"], data=vol_in.model_dump()
    )


@router.get("/")
async def list_volunteers(
    status: str = Query(None),
    current_user: dict = Depends(get_current_user),
    service: VolunteerService = Depends(get_volunteer_service),
):
    return await service.list_volunteers(status=status)


@router.get("/match")
async def find_matching(
    longitude: float = Query(..., ge=-180, le=180),
    latitude: float = Query(..., ge=-90, le=90),
    skills: List[str] = Query(...),
    radius_km: float = Query(10.0, ge=1, le=50),
    current_user: dict = Depends(RoleChecker(ROLE_VOLUNTEER_MGMT)),
    service: VolunteerService = Depends(get_volunteer_service),
):
    return await service.find_matching_volunteers(
        longitude=longitude, latitude=latitude,
        required_skills=skills, max_radius_km=radius_km,
    )


@router.get("/skills-distribution")
async def skill_distribution(
    current_user: dict = Depends(RoleChecker(ROLE_VOLUNTEER_MGMT)),
    service: VolunteerService = Depends(get_volunteer_service),
):
    return await service.get_skill_distribution()


@router.post("/assign")
async def assign_task(
    assignment: VolunteerTaskAssign,
    current_user: dict = Depends(RoleChecker(ROLE_VOLUNTEER_MGMT)),
    service: VolunteerService = Depends(get_volunteer_service),
):
    return await service.assign_task(
        volunteer_id=assignment.volunteer_id,
        incident_id=assignment.incident_id,
        task_description=assignment.task_description,
    )


@router.get("/{volunteer_id}")
async def get_volunteer(
    volunteer_id: str,
    current_user: dict = Depends(get_current_user),
    service: VolunteerService = Depends(get_volunteer_service),
):
    return await service.get_volunteer(volunteer_id)


@router.patch("/{volunteer_id}")
async def update_volunteer(
    volunteer_id: str,
    update_data: VolunteerUpdate,
    current_user: dict = Depends(get_current_user),
    service: VolunteerService = Depends(get_volunteer_service),
):
    return await service.update_volunteer(volunteer_id, update_data.model_dump(exclude_unset=True))
