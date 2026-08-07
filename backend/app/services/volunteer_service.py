"""
Volunteer Service — Registration, skill matching, and task assignment
"""

from typing import Dict, Any, List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.volunteer_repository import VolunteerRepository
from app.core.exceptions import EntityNotFoundException
from app.core.logging import get_logger

logger = get_logger("volunteer_service")


class VolunteerService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.volunteer_repo = VolunteerRepository(db)

    async def register_volunteer(
        self, user_id: str, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        data["user_id"] = ObjectId(user_id)
        data["status"] = "AVAILABLE"
        vol_id = await self.volunteer_repo.create(data)
        logger.info("Volunteer registered", volunteer_id=vol_id, user_id=user_id)
        return await self.get_volunteer(vol_id)

    async def get_volunteer(self, volunteer_id: str) -> Dict[str, Any]:
        doc = await self.volunteer_repo.find_by_id(volunteer_id)
        if not doc:
            raise EntityNotFoundException("Volunteer", volunteer_id)
        doc["id"] = str(doc.pop("_id"))
        if "user_id" in doc:
            doc["user_id"] = str(doc["user_id"])
        return doc

    async def list_volunteers(
        self, status: Optional[str] = None
    ) -> Dict[str, Any]:
        query = {"status": status} if status else {}
        volunteers = await self.volunteer_repo.find_many(query=query, limit=200)
        total = await self.volunteer_repo.count(query)
        for v in volunteers:
            v["id"] = str(v.pop("_id"))
            if "user_id" in v:
                v["user_id"] = str(v["user_id"])
        return {"total": total, "volunteers": volunteers}

    async def find_matching_volunteers(
        self,
        longitude: float,
        latitude: float,
        required_skills: List[str],
        max_radius_km: float = 10.0,
    ) -> List[Dict[str, Any]]:
        results = await self.volunteer_repo.find_available_by_skills(
            longitude=longitude,
            latitude=latitude,
            required_skills=required_skills,
            max_distance_meters=max_radius_km * 1000,
        )
        for v in results:
            v["id"] = str(v.pop("_id"))
            if "user_id" in v:
                v["user_id"] = str(v["user_id"])
        return results

    async def assign_task(
        self, volunteer_id: str, incident_id: str, task_description: str
    ) -> Dict[str, Any]:
        vol = await self.volunteer_repo.find_by_id(volunteer_id)
        if not vol:
            raise EntityNotFoundException("Volunteer", volunteer_id)

        await self.volunteer_repo.update(volunteer_id, {
            "status": "ASSIGNED",
            "assigned_task_id": incident_id,
        })
        logger.info(
            "Volunteer assigned",
            volunteer_id=volunteer_id,
            incident_id=incident_id,
            task=task_description,
        )
        return await self.get_volunteer(volunteer_id)

    async def update_volunteer(
        self, volunteer_id: str, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        existing = await self.volunteer_repo.find_by_id(volunteer_id)
        if not existing:
            raise EntityNotFoundException("Volunteer", volunteer_id)
        await self.volunteer_repo.update(volunteer_id, data)
        return await self.get_volunteer(volunteer_id)

    async def get_skill_distribution(self) -> List[Dict[str, Any]]:
        return await self.volunteer_repo.get_skill_distribution()
