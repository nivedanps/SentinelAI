"""
Analytics Endpoints — Dashboard stats, COP snapshots, operational metrics
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.dependencies import get_analytics_service
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
async def get_analytics_overview(
    date_range: Optional[str] = Query(default="24h"),
    disaster_type: Optional[str] = Query(default="ALL"),
    severity: Optional[str] = Query(default="ALL"),
    location: Optional[str] = Query(default="ALL"),
    service: AnalyticsService = Depends(get_analytics_service),
):
    """Return complete aggregated operational intelligence and analytics snapshot."""
    return await service.get_operational_analytics(
        date_range=date_range,
        disaster_type=disaster_type,
        severity=severity,
        location=location,
    )


@router.get("/dashboard")
async def get_dashboard_stats(
    service: AnalyticsService = Depends(get_analytics_service),
):
    return await service.get_dashboard_stats()


@router.get("/cop-snapshot")
async def get_cop_snapshot(
    service: AnalyticsService = Depends(get_analytics_service),
):
    return await service.get_cop_snapshot()
