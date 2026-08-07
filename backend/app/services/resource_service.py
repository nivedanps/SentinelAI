"""
Resource Service — Business logic for asset tracking, dispatch, and auto-allocation
"""

from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.resource_repository import ResourceRepository
from app.repositories.incident_repository import IncidentRepository
from app.engines.resource_engine import ResourceAllocationEngine
from app.core.exceptions import EntityNotFoundException, NoAvailableResourceException
from app.core.logging import get_logger

logger = get_logger("resource_service")


class ResourceService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.resource_repo = ResourceRepository(db)
        self.incident_repo = IncidentRepository(db)
        self.allocation_engine = ResourceAllocationEngine()

    async def create_resource(self, data: Dict[str, Any]) -> Dict[str, Any]:
        data["status"] = "AVAILABLE"
        resource_id = await self.resource_repo.create(data)
        logger.info("Resource created", resource_id=resource_id, type=data.get("type"))
        return await self.get_resource(resource_id)

    async def get_resource(self, resource_id: str) -> Dict[str, Any]:
        doc = await self.resource_repo.find_by_id(resource_id)
        if not doc:
            raise EntityNotFoundException("Resource", resource_id)
        doc["id"] = str(doc.pop("_id"))
        return doc

    async def list_resources(
        self, status: Optional[str] = None, resource_type: Optional[str] = None
    ) -> Dict[str, Any]:
        query = {}
        if status:
            query["status"] = status
        if resource_type:
            query["type"] = resource_type

        resources = await self.resource_repo.find_many(query=query, limit=200)
        total = await self.resource_repo.count(query)
        return {
            "total": total,
            "resources": [{**r, "id": str(r.pop("_id"))} for r in resources],
        }

    async def dispatch_resource(
        self, resource_id: str, incident_id: str
    ) -> Dict[str, Any]:
        resource = await self.resource_repo.find_by_id(resource_id)
        if not resource:
            raise EntityNotFoundException("Resource", resource_id)

        incident = await self.incident_repo.find_by_id(incident_id)
        if not incident:
            raise EntityNotFoundException("Incident", incident_id)

        await self.resource_repo.update(resource_id, {
            "status": "DISPATCHED",
            "assigned_incident_id": incident_id,
        })

        eta = self.allocation_engine.compute_eta_minutes(resource, incident)
        logger.info(
            "Resource dispatched",
            resource_id=resource_id,
            incident_id=incident_id,
            eta_minutes=eta,
        )
        return {"resource_id": resource_id, "incident_id": incident_id, "eta_minutes": eta}

    async def auto_allocate(
        self,
        incident_id: str,
        resource_types_needed: List[str],
        max_radius_km: float = 25.0,
    ) -> List[Dict[str, Any]]:
        """Run the Resource Allocation Engine to find optimal assignments."""
        incident = await self.incident_repo.find_by_id(incident_id)
        if not incident:
            raise EntityNotFoundException("Incident", incident_id)

        coords = incident["location"]["coordinates"]
        all_available = []
        for rtype in resource_types_needed:
            resources = await self.resource_repo.find_available_near(
                longitude=coords[0],
                latitude=coords[1],
                resource_type=rtype,
                max_distance_meters=max_radius_km * 1000,
            )
            all_available.extend(resources)

        if not all_available:
            raise NoAvailableResourceException(
                ", ".join(resource_types_needed),
                f"({coords[1]}, {coords[0]})",
            )

        assignments = self.allocation_engine.solve_optimal_matching(
            incidents=[incident], resources=all_available
        )
        logger.info("Auto-allocation complete", assignments=len(assignments))
        return assignments

    async def update_resource(
        self, resource_id: str, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        existing = await self.resource_repo.find_by_id(resource_id)
        if not existing:
            raise EntityNotFoundException("Resource", resource_id)
        await self.resource_repo.update(resource_id, data)
        return await self.get_resource(resource_id)

    async def get_status_summary(self) -> List[Dict[str, Any]]:
        return await self.resource_repo.get_status_summary()
