"""
Hospital Repository — Bed availability and nearest ICU queries
"""

from typing import List, Dict, Any
from app.repositories.base_repository import BaseRepository


class HospitalRepository(BaseRepository):
    collection_name = "hospitals"

    async def find_nearest_with_icu(
        self,
        longitude: float,
        latitude: float,
        max_distance_meters: float = 20000,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """Find nearest hospitals with available ICU beds."""
        return await self.find_near(
            location_field="location",
            longitude=longitude,
            latitude=latitude,
            max_distance_meters=max_distance_meters,
            query_filter={"available_icu_beds": {"$gt": 0}},
            limit=limit,
        )

    async def get_bed_utilization_summary(self) -> List[Dict[str, Any]]:
        pipeline = [
            {"$project": {
                "name": 1,
                "total_beds": 1,
                "available_general_beds": 1,
                "available_icu_beds": 1,
                "oxygen_status": 1,
                "utilization_pct": {
                    "$multiply": [
                        {"$divide": [
                            {"$subtract": [
                                "$total_beds",
                                {"$add": ["$available_general_beds", "$available_icu_beds"]},
                            ]},
                            "$total_beds",
                        ]},
                        100,
                    ]
                },
            }},
            {"$sort": {"utilization_pct": -1}},
        ]
        return await self.aggregate(pipeline)
