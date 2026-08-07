"""
Weather Endpoints — Active alerts, forecast data, alert generation
"""

from fastapi import APIRouter, Depends, Query
from app.dependencies import get_weather_service
from app.services.weather_service import WeatherService
from app.core.security import get_current_user, RoleChecker, ROLE_COMMAND

router = APIRouter(prefix="/weather", tags=["Weather"])


@router.get("/alerts")
async def get_active_alerts(
    current_user: dict = Depends(get_current_user),
    service: WeatherService = Depends(get_weather_service),
):
    return await service.get_active_alerts()


@router.get("/forecast")
async def get_forecast(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    current_user: dict = Depends(get_current_user),
    service: WeatherService = Depends(get_weather_service),
):
    return await service.fetch_weather_data(latitude, longitude)


@router.post("/check-alerts")
async def check_and_generate_alerts(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
    service: WeatherService = Depends(get_weather_service),
):
    return await service.check_and_generate_alerts(latitude, longitude)
