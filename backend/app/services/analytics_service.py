"""
Analytics Service — Operational metrics, response SLAs, and situational summaries
"""

from typing import Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.services.incident_service import IncidentService
from app.services.resource_service import ResourceService
from app.services.shelter_service import ShelterService
from app.services.hospital_service import HospitalService
from app.engines.situation_engine import SituationEngine
from app.core.logging import get_logger

logger = get_logger("analytics_service")


class AnalyticsService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.incident_service = IncidentService(db)
        self.resource_service = ResourceService(db)
        self.shelter_service = ShelterService(db)
        self.hospital_service = HospitalService(db)
        self.situation_engine = SituationEngine()

    async def get_dashboard_stats(self) -> Dict[str, Any]:
        """Aggregate high-level dashboard metrics across all modules."""
        incident_analytics = await self.incident_service.get_analytics()
        resource_summary = await self.resource_service.get_status_summary()
        shelter_overview = await self.shelter_service.get_capacity_overview()
        bed_utilization = await self.hospital_service.get_bed_utilization()

        return {
            "incidents": incident_analytics,
            "resources": resource_summary,
            "shelters": shelter_overview,
            "hospitals": bed_utilization,
        }

    async def get_cop_snapshot(self) -> Dict[str, Any]:
        """Generate a full Common Operational Picture snapshot."""
        from app.repositories.incident_repository import IncidentRepository
        from app.repositories.resource_repository import ResourceRepository
        from app.repositories.shelter_repository import ShelterRepository
        from app.repositories.hospital_repository import HospitalRepository

        incidents = await IncidentRepository(self.db).find_many(
            query={"status": {"$nin": ["RESOLVED", "REJECTED"]}}, limit=500
        )
        resources = await ResourceRepository(self.db).find_many(limit=500)
        shelters = await ShelterRepository(self.db).find_many(
            query={"is_active": True}, limit=200
        )
        hospitals = await HospitalRepository(self.db).find_many(limit=200)

        return await self.situation_engine.generate_cop_snapshot(
            incidents=incidents,
            resources=resources,
            shelters=shelters,
            hospitals=hospitals,
        )
