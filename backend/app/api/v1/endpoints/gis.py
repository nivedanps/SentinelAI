"""
GIS Endpoints — Geocoding, hazard zones, infrastructure queries, COP layers
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.core.security import get_current_user
from app.engines.gis_engine import GISEngine

router = APIRouter(prefix="/gis", tags=["GIS & Spatial"])

gis_engine = GISEngine()


@router.get("/geocode/reverse")
async def reverse_geocode(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    current_user: dict = Depends(get_current_user),
):
    return await gis_engine.reverse_geocode(latitude, longitude)


@router.get("/geocode/forward")
async def forward_geocode(
    query: str = Query(..., min_length=3),
    current_user: dict = Depends(get_current_user),
):
    result = await gis_engine.forward_geocode(query)
    if not result:
        return {"error": "Location not found", "query": query}
    return result


@router.get("/hazard-buffer")
async def get_hazard_buffer(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_meters: float = Query(1000, ge=100, le=50000),
    current_user: dict = Depends(get_current_user),
):
    return gis_engine.create_hazard_buffer(longitude, latitude, radius_meters)


@router.get("/infrastructure")
async def query_infrastructure(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_meters: int = Query(2000, ge=500, le=10000),
    type: str = Query("hospital"),
    current_user: dict = Depends(get_current_user),
):
    return await gis_engine.query_nearby_infrastructure(
        latitude=latitude,
        longitude=longitude,
        radius_meters=radius_meters,
        infrastructure_type=type,
    )


@router.post("/route-check")
async def check_route_safety(
    route: dict,
    hazard_zone: dict,
    current_user: dict = Depends(get_current_user),
):
    return gis_engine.check_route_hazard_intersection(route, hazard_zone)
