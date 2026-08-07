"""
Resource Repository — Spatial queries for asset tracking and dispatch
"""

from typing import List, Dict, Any
from app.repositories.base_repository import BaseRepository


class ResourceRepository(BaseRepository):
    collection_name = "resources"

    async def find_available_near(
        self,
        longitude: float,
        latitude: float,
        resource_type: str = None,
        max_distance_meters: float = 25000,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Find available resources near a coordinate, optionally filtered by type."""
        query_filter = {"status": "AVAILABLE"}
        if resource_type:
            query_filter["type"] = resource_type
        return await self.find_near(
            location_field="current_location",
            longitude=longitude,
            latitude=latitude,
            max_distance_meters=max_distance_meters,
            query_filter=query_filter,
            limit=limit,
        )

    async def get_status_summary(self) -> List[Dict[str, Any]]:
        pipeline = [
            {"$group": {
                "_id": {"type": "$type", "status": "$status"},
                "count": {"$sum": 1},
                "total_quantity": {"$sum": "$quantity"},
            }},
            {"$sort": {"_id.type": 1}},
        ]
        return await self.aggregate(pipeline)
