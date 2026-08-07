"""
Incident Service — Business Logic for Incident Lifecycle
==========================================================
Orchestrates the full incident pipeline:
  Submission → AI Analysis → GIS Enrichment → Fusion Dedup → Risk Scoring → Persistence
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.incident_repository import IncidentRepository, IncidentClusterRepository
from app.engines.fusion_engine import FusionEngine
from app.engines.risk_engine import RiskEngine
from app.engines.ai_engine import AIEngine
from app.engines.gis_engine import GISEngine
from app.core.exceptions import EntityNotFoundException
from app.core.logging import get_logger

logger = get_logger("incident_service")


class IncidentService:
    """
    Core service orchestrating the incident lifecycle from raw citizen
    report to verified, enriched, and triaged operational incident.
    """

    def __init__(self, db: AsyncIOMotorDatabase):
        self.incident_repo = IncidentRepository(db)
        self.cluster_repo = IncidentClusterRepository(db)
        self.fusion_engine = FusionEngine(self.incident_repo, self.cluster_repo)
        self.risk_engine = RiskEngine()
        self.ai_engine = AIEngine()
        self.gis_engine = GISEngine()

    async def create_incident(
        self, incident_data: Dict[str, Any], user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Full pipeline for processing an incoming incident report:
        1. AI analysis of description text
        2. Reverse geocoding for address metadata
        3. Severity scoring
        4. Persist to MongoDB
        5. Run through Fusion Engine for deduplication
        """
        # Step 1: AI Analysis
        ai_result = await self.ai_engine.analyze_incident_text(
            text=incident_data["description"],
            context=incident_data.get("category"),
        )
        incident_data["ai_analysis"] = ai_result

        # Step 2: GIS Enrichment — reverse geocode
        coords = incident_data["location"]["coordinates"]
        address = await self.gis_engine.reverse_geocode(
            latitude=coords[1], longitude=coords[0]
        )
        incident_data["address_metadata"] = address

        # Step 3: Severity Scoring
        severity = self.risk_engine.compute_incident_severity(
            category=incident_data["category"],
            description_length=len(incident_data["description"]),
            media_count=len(incident_data.get("media_urls", [])),
            nearby_incident_count=0,  # Will be refined by fusion
            ai_urgency=ai_result.get("urgency_level", "MEDIUM"),
        )
        incident_data["severity_score"] = severity
        incident_data["status"] = "REPORTED"
        incident_data["reported_by_id"] = ObjectId(user_id) if user_id else None

        # Step 4: Persist
        incident_id = await self.incident_repo.create(incident_data)
        incident_data["_id"] = incident_id

        # Step 5: Fusion — attempt deduplication clustering
        incident_data = await self.fusion_engine.process_incoming_incident(incident_data)

        # Update with cluster_id if assigned
        if incident_data.get("cluster_id"):
            await self.incident_repo.update(
                incident_id, {"cluster_id": incident_data["cluster_id"]}
            )

        logger.info(
            "Incident created and processed",
            incident_id=incident_id,
            severity=severity,
            category=incident_data["category"],
            cluster_id=incident_data.get("cluster_id"),
        )

        return await self.get_incident(incident_id)

    async def get_incident(self, incident_id: str) -> Dict[str, Any]:
        doc = await self.incident_repo.find_by_id(incident_id)
        if not doc:
            raise EntityNotFoundException("Incident", incident_id)
        return self._serialize(doc)

    async def list_incidents(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, Any]:
        query = {}
        if status:
            query["status"] = status
        if category:
            query["category"] = category

        skip = (page - 1) * page_size
        incidents = await self.incident_repo.find_many(
            query=query,
            sort=[("severity_score", -1), ("created_at", -1)],
            skip=skip,
            limit=page_size,
        )
        total = await self.incident_repo.count(query)

        return {
            "total": total,
            "page": page,
            "page_size": page_size,
            "incidents": [self._serialize(i) for i in incidents],
        }

    async def update_incident(
        self, incident_id: str, update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        existing = await self.incident_repo.find_by_id(incident_id)
        if not existing:
            raise EntityNotFoundException("Incident", incident_id)

        await self.incident_repo.update(incident_id, update_data)
        logger.info("Incident updated", incident_id=incident_id, fields=list(update_data.keys()))
        return await self.get_incident(incident_id)

    async def find_nearby(
        self,
        longitude: float,
        latitude: float,
        radius_km: float = 10.0,
        category: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        query_filter = {}
        if category:
            query_filter["category"] = category
        if status:
            query_filter["status"] = status

        results = await self.incident_repo.find_near(
            location_field="location",
            longitude=longitude,
            latitude=latitude,
            max_distance_meters=radius_km * 1000,
            query_filter=query_filter,
        )
        return [self._serialize(r) for r in results]

    async def get_analytics(self) -> Dict[str, Any]:
        status_summary = await self.incident_repo.get_status_summary()
        category_breakdown = await self.incident_repo.get_category_breakdown()
        total = await self.incident_repo.count()

        return {
            "total_incidents": total,
            "by_status": {item["_id"]: item["count"] for item in status_summary},
            "by_category": {item["_id"]: item["count"] for item in category_breakdown},
        }

    @staticmethod
    def _serialize(doc: Dict[str, Any]) -> Dict[str, Any]:
        doc["id"] = str(doc.pop("_id", ""))
        for field in ("reported_by_id", "cluster_id"):
            if field in doc and doc[field]:
                doc[field] = str(doc[field])
        return doc
