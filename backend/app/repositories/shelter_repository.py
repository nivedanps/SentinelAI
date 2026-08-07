"""
Shelter Repository — Capacity tracking and nearest shelter queries
"""

from typing import List, Dict, Any
from app.repositories.base_repository import BaseRepository


class ShelterRepository(BaseRepository):
    collection_name = "shelters"

    async def find_nearest_open(
        self,
        longitude: float,
        latitude: float,
        max_distance_meters: float = 15000,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """Find nearest active shelters that are not yet full."""
        return await self.find_near(
            location_field="location",
            longitude=longitude,
            latitude=latitude,
            max_distance_meters=max_distance_meters,
            query_filter={
                "is_active": True,
                "$expr": {"$lt": ["$capacity_current", "$capacity_total"]},
            },
            limit=limit,
        )

    async def get_capacity_overview(self) -> List[Dict[str, Any]]:
        pipeline = [
            {"$match": {"is_active": True}},
            {"$project": {
                "name": 1,
                "capacity_total": 1,
                "capacity_current": 1,
                "occupancy_pct": {
                    "$multiply": [
                        {"$divide": ["$capacity_current", "$capacity_total"]},
                        100,
                    ]
                },
            }},
            {"$sort": {"occupancy_pct": -1}},
        ]
        return await self.aggregate(pipeline)
