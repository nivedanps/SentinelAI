"""
Shelter Service — Capacity tracking, nearest shelter routing
"""

from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.shelter_repository import ShelterRepository
from app.core.exceptions import EntityNotFoundException, ShelterCapacityExceededException
from app.core.logging import get_logger

logger = get_logger("shelter_service")


class ShelterService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.shelter_repo = ShelterRepository(db)

    async def create_shelter(self, data: Dict[str, Any]) -> Dict[str, Any]:
        data["capacity_current"] = 0
        data["is_active"] = True
        shelter_id = await self.shelter_repo.create(data)
        logger.info("Shelter created", shelter_id=shelter_id, name=data.get("name"))
        return await self.get_shelter(shelter_id)

    async def get_shelter(self, shelter_id: str) -> Dict[str, Any]:
        doc = await self.shelter_repo.find_by_id(shelter_id)
        if not doc:
            raise EntityNotFoundException("Shelter", shelter_id)
        return self._enrich(doc)

    async def list_shelters(self, active_only: bool = True) -> Dict[str, Any]:
        query = {"is_active": True} if active_only else {}
        shelters = await self.shelter_repo.find_many(query=query, limit=200)
        total = await self.shelter_repo.count(query)
        return {
            "total": total,
            "shelters": [self._enrich(s) for s in shelters],
        }

    async def update_capacity(
        self, shelter_id: str, new_occupancy: int
    ) -> Dict[str, Any]:
        shelter = await self.shelter_repo.find_by_id(shelter_id)
        if not shelter:
            raise EntityNotFoundException("Shelter", shelter_id)

        if new_occupancy > shelter["capacity_total"]:
            raise ShelterCapacityExceededException(shelter["name"])

        await self.shelter_repo.update(shelter_id, {"capacity_current": new_occupancy})
        logger.info("Shelter capacity updated", shelter_id=shelter_id, occupancy=new_occupancy)
        return await self.get_shelter(shelter_id)

    async def find_nearest_open(
        self, longitude: float, latitude: float, max_distance_km: float = 15.0
    ) -> List[Dict[str, Any]]:
        results = await self.shelter_repo.find_nearest_open(
            longitude=longitude,
            latitude=latitude,
            max_distance_meters=max_distance_km * 1000,
        )
        return [self._enrich(s) for s in results]

    async def get_capacity_overview(self) -> List[Dict[str, Any]]:
        return await self.shelter_repo.get_capacity_overview()

    async def update_shelter(
        self, shelter_id: str, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        existing = await self.shelter_repo.find_by_id(shelter_id)
        if not existing:
            raise EntityNotFoundException("Shelter", shelter_id)
        await self.shelter_repo.update(shelter_id, data)
        return await self.get_shelter(shelter_id)

    @staticmethod
    def _enrich(doc: Dict[str, Any]) -> Dict[str, Any]:
        doc["id"] = str(doc.pop("_id"))
        total = doc.get("capacity_total", 1)
        current = doc.get("capacity_current", 0)
        pct = round((current / total) * 100, 1) if total > 0 else 0
        doc["occupancy_percentage"] = pct
        if pct >= 100:
            doc["status_label"] = "FULL"
        elif pct >= 90:
            doc["status_label"] = "NEAR_FULL"
        else:
            doc["status_label"] = "OPEN"
        return doc
