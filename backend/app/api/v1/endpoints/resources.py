"""
Resource Endpoints — Asset management, dispatch, and auto-allocation
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from app.dependencies import get_resource_service
from app.services.resource_service import ResourceService
from app.core.security import get_current_user, RoleChecker, ROLE_COMMAND, ROLE_FIELD
from app.schemas.resource import ResourceCreate, ResourceUpdate, DispatchRequest, AutoAllocateRequest

router = APIRouter(prefix="/resources", tags=["Resources"])


@router.post("/", status_code=201)
async def create_resource(
    resource_in: ResourceCreate,
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.create_resource(resource_in.model_dump())


@router.get("/")
async def list_resources(
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.list_resources(status=status, resource_type=type)


@router.get("/summary")
async def get_resource_summary(
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.get_status_summary()


@router.post("/dispatch")
async def dispatch_resource(
    request: DispatchRequest,
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.dispatch_resource(request.resource_id, request.incident_id)


@router.post("/auto-allocate")
async def auto_allocate(
    request: AutoAllocateRequest,
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.auto_allocate(
        incident_id=request.incident_id,
        resource_types_needed=request.resource_types_needed,
        max_radius_km=request.max_radius_km,
    )


@router.get("/{resource_id}")
async def get_resource(
    resource_id: str,
    current_user: dict = Depends(get_current_user),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.get_resource(resource_id)


@router.patch("/{resource_id}")
async def update_resource(
    resource_id: str,
    update_data: ResourceUpdate,
    current_user: dict = Depends(RoleChecker(ROLE_FIELD)),
    service: ResourceService = Depends(get_resource_service),
):
    return await service.update_resource(resource_id, update_data.model_dump(exclude_unset=True))
