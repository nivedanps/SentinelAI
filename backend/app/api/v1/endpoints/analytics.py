"""
Analytics Endpoints — Dashboard stats, COP snapshots, operational metrics
"""

from fastapi import APIRouter, Depends
from app.dependencies import get_analytics_service
from app.services.analytics_service import AnalyticsService
from app.core.security import get_current_user, RoleChecker, ROLE_COMMAND

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def get_dashboard_stats(
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: AnalyticsService = Depends(get_analytics_service),
):
    return await service.get_dashboard_stats()


@router.get("/cop-snapshot")
async def get_cop_snapshot(
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: AnalyticsService = Depends(get_analytics_service),
):
    return await service.get_cop_snapshot()
