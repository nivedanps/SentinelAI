"""
Hospital Service — Bed tracking, ICU availability, nearest hospital routing
"""

from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.hospital_repository import HospitalRepository
from app.core.exceptions import EntityNotFoundException
from app.core.logging import get_logger

logger = get_logger("hospital_service")


class HospitalService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.hospital_repo = HospitalRepository(db)

    async def create_hospital(self, data: Dict[str, Any]) -> Dict[str, Any]:
        hospital_id = await self.hospital_repo.create(data)
        logger.info("Hospital registered", hospital_id=hospital_id, name=data.get("name"))
        return await self.get_hospital(hospital_id)

    async def get_hospital(self, hospital_id: str) -> Dict[str, Any]:
        doc = await self.hospital_repo.find_by_id(hospital_id)
        if not doc:
            raise EntityNotFoundException("Hospital", hospital_id)
        return self._enrich(doc)

    async def list_hospitals(self) -> Dict[str, Any]:
        hospitals = await self.hospital_repo.find_many(limit=200)
        total = await self.hospital_repo.count()
        return {
            "total": total,
            "hospitals": [self._enrich(h) for h in hospitals],
        }

    async def update_hospital(
        self, hospital_id: str, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        existing = await self.hospital_repo.find_by_id(hospital_id)
        if not existing:
            raise EntityNotFoundException("Hospital", hospital_id)
        await self.hospital_repo.update(hospital_id, data)
        logger.info("Hospital updated", hospital_id=hospital_id)
        return await self.get_hospital(hospital_id)

    async def find_nearest_with_icu(
        self, longitude: float, latitude: float, max_distance_km: float = 20.0
    ) -> List[Dict[str, Any]]:
        results = await self.hospital_repo.find_nearest_with_icu(
            longitude=longitude,
            latitude=latitude,
            max_distance_meters=max_distance_km * 1000,
        )
        return [self._enrich(h) for h in results]

    async def get_bed_utilization(self) -> List[Dict[str, Any]]:
        return await self.hospital_repo.get_bed_utilization_summary()

    @staticmethod
    def _enrich(doc: Dict[str, Any]) -> Dict[str, Any]:
        doc["id"] = str(doc.pop("_id"))
        total = doc.get("total_beds", 1)
        avail_general = doc.get("available_general_beds", 0)
        avail_icu = doc.get("available_icu_beds", 0)
        doc["total_available_beds"] = avail_general + avail_icu
        occupied = total - (avail_general + avail_icu)
        doc["bed_utilization_percentage"] = round((occupied / total) * 100, 1) if total > 0 else 0
        return doc
