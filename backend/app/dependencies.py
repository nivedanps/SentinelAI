"""
FastAPI Dependency Injection Providers
========================================
Centralizes all injectable dependencies for clean endpoint signatures.
"""

from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import Depends
from app.core.database import get_database
from app.services.incident_service import IncidentService
from app.services.resource_service import ResourceService
from app.services.shelter_service import ShelterService
from app.services.hospital_service import HospitalService
from app.services.volunteer_service import VolunteerService
from app.services.weather_service import WeatherService
from app.services.analytics_service import AnalyticsService


async def get_incident_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> IncidentService:
    return IncidentService(db)


async def get_resource_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> ResourceService:
    return ResourceService(db)


async def get_shelter_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> ShelterService:
    return ShelterService(db)


async def get_hospital_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> HospitalService:
    return HospitalService(db)


async def get_volunteer_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> VolunteerService:
    return VolunteerService(db)


async def get_weather_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> WeatherService:
    return WeatherService(db)


async def get_analytics_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> AnalyticsService:
    return AnalyticsService(db)
