"""
V1 API Router Aggregator — Combines all endpoint routers under /api/v1
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    incidents,
    gis,
    resources,
    shelters,
    hospitals,
    volunteers,
    intelligence,
    weather,
    analytics,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(incidents.router)
api_router.include_router(gis.router)
api_router.include_router(resources.router)
api_router.include_router(shelters.router)
api_router.include_router(hospitals.router)
api_router.include_router(volunteers.router)
api_router.include_router(intelligence.router)
api_router.include_router(weather.router)
api_router.include_router(analytics.router)
