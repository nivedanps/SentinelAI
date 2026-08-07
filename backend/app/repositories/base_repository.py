"""
Base Repository — Generic async CRUD operations via Motor (MongoDB)
====================================================================
All domain-specific repositories extend this class and inherit standard
operations: find_by_id, find_many, create, update, delete, count, and
specialized spatial query helpers.
"""

from typing import Optional, List, Any, Dict
from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.logging import get_logger

logger = get_logger("base_repository")


class BaseRepository:
    """
    Generic async MongoDB repository providing standard CRUD + spatial queries.
    Subclasses set `collection_name` to target a specific MongoDB collection.
    """

    collection_name: str = ""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db[self.collection_name]

    # ------------------------------------------------------------------
    # Standard CRUD
    # ------------------------------------------------------------------

    async def find_by_id(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """Find a single document by its _id."""
        doc = await self.collection.find_one({"_id": ObjectId(entity_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_many(
        self,
        query: Dict[str, Any] = None,
        sort: List[tuple] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """Find multiple documents with optional filtering, sorting, and pagination."""
        query = query or {}
        cursor = self.collection.find(query)
        if sort:
            cursor = cursor.sort(sort)
        cursor = cursor.skip(skip).limit(limit)

        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results

    async def create(self, data: Dict[str, Any]) -> str:
        """Insert a new document and return its string _id."""
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        result = await self.collection.insert_one(data)
        logger.info(
            "Document created",
            collection=self.collection_name,
            id=str(result.inserted_id),
        )
        return str(result.inserted_id)

    async def update(self, entity_id: str, data: Dict[str, Any]) -> bool:
        """Update a document by _id. Returns True if a document was modified."""
        data["updated_at"] = datetime.now(timezone.utc)
        result = await self.collection.update_one(
            {"_id": ObjectId(entity_id)},
            {"$set": data},
        )
        return result.modified_count > 0

    async def delete(self, entity_id: str) -> bool:
        """Delete a document by _id. Returns True if deleted."""
        result = await self.collection.delete_one({"_id": ObjectId(entity_id)})
        return result.deleted_count > 0

    async def count(self, query: Dict[str, Any] = None) -> int:
        """Count documents matching a query filter."""
        query = query or {}
        return await self.collection.count_documents(query)

    # ------------------------------------------------------------------
    # Spatial Query Helpers (require 2dsphere index)
    # ------------------------------------------------------------------

    async def find_near(
        self,
        location_field: str,
        longitude: float,
        latitude: float,
        max_distance_meters: float = 10000,
        query_filter: Dict[str, Any] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """
        Find documents near a GeoJSON Point using $near operator.
        Requires a 2dsphere index on `location_field`.
        """
        geo_query = {
            location_field: {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude],
                    },
                    "$maxDistance": max_distance_meters,
                }
            }
        }
        if query_filter:
            geo_query.update(query_filter)

        results = []
        cursor = self.collection.find(geo_query).limit(limit)
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results

    async def find_within_polygon(
        self,
        location_field: str,
        polygon_coordinates: List[List[List[float]]],
        query_filter: Dict[str, Any] = None,
    ) -> List[Dict[str, Any]]:
        """
        Find documents inside a GeoJSON Polygon using $geoWithin.
        Useful for fetching all incidents within a district boundary.
        """
        geo_query = {
            location_field: {
                "$geoWithin": {
                    "$geometry": {
                        "type": "Polygon",
                        "coordinates": polygon_coordinates,
                    }
                }
            }
        }
        if query_filter:
            geo_query.update(query_filter)

        results = []
        async for doc in self.collection.find(geo_query):
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results

    async def aggregate(self, pipeline: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Run a MongoDB aggregation pipeline and return results."""
        results = []
        async for doc in self.collection.aggregate(pipeline):
            if "_id" in doc and isinstance(doc["_id"], ObjectId):
                doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results
