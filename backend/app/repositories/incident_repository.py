"""
Incident Repository — Specialized MongoDB operations for incidents and clusters
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from pymongo import DESCENDING
from app.repositories.base_repository import BaseRepository


class IncidentRepository(BaseRepository):
    collection_name = "incidents"

    async def find_nearby_recent(
        self,
        longitude: float,
        latitude: float,
        radius_meters: float = 500,
        time_window_minutes: int = 30,
    ) -> List[Dict[str, Any]]:
        """
        Find incidents near a coordinate within a time window.
        Used by the Fusion Engine for deduplication clustering.
        """
        cutoff_time = datetime.now(timezone.utc) - timedelta(minutes=time_window_minutes)
        return await self.find_near(
            location_field="location",
            longitude=longitude,
            latitude=latitude,
            max_distance_meters=radius_meters,
            query_filter={
                "created_at": {"$gte": cutoff_time},
                "status": {"$ne": "REJECTED"},
            },
            limit=50,
        )

    async def find_by_status(
        self,
        status: str,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        return await self.find_many(
            query={"status": status},
            sort=[("severity_score", DESCENDING), ("created_at", DESCENDING)],
            skip=skip,
            limit=limit,
        )

    async def get_severity_distribution(self) -> List[Dict[str, Any]]:
        """Aggregate incidents by severity buckets for analytics."""
        pipeline = [
            {"$match": {"status": {"$ne": "REJECTED"}}},
            {
                "$bucket": {
                    "groupBy": "$severity_score",
                    "boundaries": [0, 3, 5, 7, 10.1],
                    "default": "Unknown",
                    "output": {
                        "count": {"$sum": 1},
                        "incidents": {"$push": {"id": "$_id", "title": "$title"}},
                    },
                }
            },
        ]
        return await self.aggregate(pipeline)

    async def get_category_breakdown(self) -> List[Dict[str, Any]]:
        """Aggregate incidents by category for dashboard charts."""
        pipeline = [
            {"$match": {"status": {"$ne": "REJECTED"}}},
            {"$group": {"_id": "$category", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        return await self.aggregate(pipeline)

    async def get_status_summary(self) -> List[Dict[str, Any]]:
        """Aggregate incidents by status for operational overview."""
        pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        return await self.aggregate(pipeline)


class IncidentClusterRepository(BaseRepository):
    collection_name = "incident_clusters"

    async def find_active_clusters(self) -> List[Dict[str, Any]]:
        return await self.find_many(
            query={"status": {"$nin": ["RESOLVED", "REJECTED"]}},
            sort=[("aggregate_severity", DESCENDING)],
        )

    async def add_child_incident(
        self, cluster_id: str, incident_id: str, new_severity: float
    ) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(cluster_id)},
            {
                "$push": {"child_incident_ids": ObjectId(incident_id)},
                "$set": {
                    "aggregate_severity": new_severity,
                    "updated_at": datetime.now(timezone.utc),
                },
                "$inc": {"report_count": 1},
            },
        )
        return result.modified_count > 0
