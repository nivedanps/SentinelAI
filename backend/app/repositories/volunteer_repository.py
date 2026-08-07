"""
Volunteer Repository — Skill matching and spatial assignment queries
"""

from typing import List, Dict, Any
from app.repositories.base_repository import BaseRepository


class VolunteerRepository(BaseRepository):
    collection_name = "volunteers"

    async def find_available_by_skills(
        self,
        longitude: float,
        latitude: float,
        required_skills: List[str],
        max_distance_meters: float = 10000,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Find available volunteers with matching skills near a location."""
        return await self.find_near(
            location_field="current_location",
            longitude=longitude,
            latitude=latitude,
            max_distance_meters=max_distance_meters,
            query_filter={
                "status": "AVAILABLE",
                "skills": {"$in": required_skills},
            },
            limit=limit,
        )

    async def get_skill_distribution(self) -> List[Dict[str, Any]]:
        pipeline = [
            {"$unwind": "$skills"},
            {"$group": {"_id": "$skills", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        return await self.aggregate(pipeline)
