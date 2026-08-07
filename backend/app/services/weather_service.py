"""
Weather Service — Periodic ingestion and alert management
"""

from typing import Dict, Any, List
from datetime import datetime, timezone
import httpx
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base_repository import BaseRepository
from app.core.logging import get_logger

logger = get_logger("weather_service")

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


class WeatherAlertRepository(BaseRepository):
    collection_name = "weather_alerts"


class WeatherService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.alert_repo = WeatherAlertRepository(db)
        self.db = db

    async def fetch_weather_data(
        self, latitude: float, longitude: float
    ) -> Dict[str, Any]:
        """Fetch current weather from Open-Meteo (free, no API key)."""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(OPEN_METEO_URL, params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current_weather": "true",
                    "hourly": "precipitation,windspeed_10m",
                    "forecast_days": 1,
                })
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.warning("Weather fetch failed", error=str(e))
            return {}

    async def create_alert(self, alert_data: Dict[str, Any]) -> str:
        alert_id = await self.alert_repo.create(alert_data)
        logger.info("Weather alert created", alert_id=alert_id, type=alert_data.get("alert_type"))
        return alert_id

    async def get_active_alerts(self) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc)
        alerts = await self.alert_repo.find_many(
            query={"valid_until": {"$gte": now}},
            sort=[("severity", -1)],
        )
        for a in alerts:
            a["id"] = str(a.pop("_id"))
        return alerts

    async def check_and_generate_alerts(
        self, latitude: float, longitude: float
    ) -> List[Dict[str, Any]]:
        """
        Fetch weather data, evaluate thresholds, and generate alerts
        if rainfall > 50mm/hr or wind > 75km/h.
        """
        data = await self.fetch_weather_data(latitude, longitude)
        if not data:
            return []

        alerts_generated = []
        current = data.get("current_weather", {})
        windspeed = current.get("windspeed", 0)

        hourly = data.get("hourly", {})
        precip_values = hourly.get("precipitation", [])
        max_precip = max(precip_values) if precip_values else 0

        if max_precip > 50:
            severity = "RED" if max_precip > 100 else "ORANGE"
            alert = {
                "alert_type": "HEAVY_RAINFALL",
                "severity": severity,
                "affected_zone": {
                    "type": "Polygon",
                    "coordinates": [self._approx_zone(latitude, longitude)],
                },
                "parameters": {"rainfall_mm": max_precip},
                "valid_until": datetime.now(timezone.utc),
            }
            await self.create_alert(alert)
            alerts_generated.append(alert)

        if windspeed > 75:
            severity = "RED" if windspeed > 120 else "ORANGE"
            alert = {
                "alert_type": "CYCLONE",
                "severity": severity,
                "affected_zone": {
                    "type": "Polygon",
                    "coordinates": [self._approx_zone(latitude, longitude)],
                },
                "parameters": {"wind_speed_kmh": windspeed},
                "valid_until": datetime.now(timezone.utc),
            }
            await self.create_alert(alert)
            alerts_generated.append(alert)

        return alerts_generated

    @staticmethod
    def _approx_zone(lat: float, lng: float, delta: float = 0.1) -> List[List[float]]:
        """Create an approximate rectangular zone polygon around a point."""
        return [
            [lng - delta, lat - delta],
            [lng + delta, lat - delta],
            [lng + delta, lat + delta],
            [lng - delta, lat + delta],
            [lng - delta, lat - delta],
        ]
