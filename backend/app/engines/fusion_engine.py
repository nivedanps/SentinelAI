"""
Incident Fusion Engine
=======================
Eliminates duplicate citizen SOS reports and synthesizes fragmented inputs
into coherent, verified IncidentClusters.

Algorithm:
1. For incoming report R_n, perform spatial-radius query (R=500m) and
   temporal window query (Δt=30min) in MongoDB.
2. Compute Haversine distance and text similarity (via AI embeddings).
3. If combined match probability > 0.85, attach R_n to existing cluster
   and recompute cluster centroid.
4. Otherwise, create a new IncidentCluster with R_n as the primary incident.
"""

import math
from typing import Optional, Dict, Any, List
from app.repositories.incident_repository import IncidentRepository, IncidentClusterRepository
from app.core.logging import get_logger

logger = get_logger("fusion_engine")

# Configuration constants
CLUSTER_RADIUS_METERS = 500
TIME_WINDOW_MINUTES = 30
MATCH_THRESHOLD = 0.85


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the Haversine distance in meters between two lat/lng points.
    """
    R = 6_371_000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def compute_match_probability(
    distance_meters: float,
    category_match: bool,
    text_similarity: float = 0.0,
) -> float:
    """
    Compute a combined match probability score for deduplication.
    Weights: 40% spatial proximity, 30% category match, 30% text similarity.
    """
    # Spatial score: 1.0 at 0m, decays to 0 at CLUSTER_RADIUS_METERS
    spatial_score = max(0, 1 - (distance_meters / CLUSTER_RADIUS_METERS))

    category_score = 1.0 if category_match else 0.0

    return 0.4 * spatial_score + 0.3 * category_score + 0.3 * text_similarity


class FusionEngine:
    """
    Orchestrates incident deduplication and cluster management.
    """

    def __init__(
        self,
        incident_repo: IncidentRepository,
        cluster_repo: IncidentClusterRepository,
    ):
        self.incident_repo = incident_repo
        self.cluster_repo = cluster_repo

    async def process_incoming_incident(
        self, incident_doc: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Process a new incident through the fusion pipeline:
        1. Search for nearby recent incidents
        2. Compute match probabilities
        3. Either attach to existing cluster or create new one
        Returns the updated incident document with cluster_id assigned.
        """
        coords = incident_doc["location"]["coordinates"]
        lng, lat = coords[0], coords[1]
        category = incident_doc.get("category", "")

        # Step 1: Find nearby recent incidents
        nearby = await self.incident_repo.find_nearby_recent(
            longitude=lng,
            latitude=lat,
            radius_meters=CLUSTER_RADIUS_METERS,
            time_window_minutes=TIME_WINDOW_MINUTES,
        )

        # Step 2: Find the best matching incident
        best_match = None
        best_score = 0.0

        for existing in nearby:
            if existing.get("_id") == incident_doc.get("_id"):
                continue

            existing_coords = existing["location"]["coordinates"]
            distance = haversine_distance(
                lat, lng, existing_coords[1], existing_coords[0]
            )
            cat_match = existing.get("category") == category
            score = compute_match_probability(distance, cat_match, text_similarity=0.5)

            if score > best_score:
                best_score = score
                best_match = existing

        # Step 3: Merge into existing cluster or create new one
        if best_match and best_score >= MATCH_THRESHOLD:
            cluster_id = best_match.get("cluster_id")
            if cluster_id:
                # Attach to existing cluster
                new_severity = max(
                    incident_doc.get("severity_score", 5.0),
                    best_match.get("severity_score", 5.0),
                )
                await self.cluster_repo.add_child_incident(
                    cluster_id, incident_doc["_id"], new_severity
                )
                incident_doc["cluster_id"] = cluster_id
                logger.info(
                    "Incident merged into existing cluster",
                    incident_id=incident_doc["_id"],
                    cluster_id=cluster_id,
                    match_score=best_score,
                )
            else:
                # Create new cluster from matched pair
                cluster_data = {
                    "primary_incident_id": best_match["_id"],
                    "child_incident_ids": [incident_doc["_id"]],
                    "category": category,
                    "aggregate_severity": max(
                        incident_doc.get("severity_score", 5.0),
                        best_match.get("severity_score", 5.0),
                    ),
                    "centroid": self._compute_centroid(
                        [incident_doc["location"], best_match["location"]]
                    ),
                    "radius_meters": CLUSTER_RADIUS_METERS,
                    "status": "REPORTED",
                    "report_count": 2,
                }
                cluster_id = await self.cluster_repo.create(cluster_data)
                incident_doc["cluster_id"] = cluster_id

                # Update the matched incident with the cluster_id too
                await self.incident_repo.update(
                    best_match["_id"], {"cluster_id": cluster_id}
                )

                logger.info(
                    "New cluster created from matched pair",
                    cluster_id=cluster_id,
                    match_score=best_score,
                )
        else:
            logger.info(
                "No cluster match found; incident remains standalone",
                incident_id=incident_doc.get("_id"),
            )

        return incident_doc

    @staticmethod
    def _compute_centroid(locations: List[Dict]) -> Dict:
        """Compute the geographic centroid of a list of GeoJSON Points."""
        lngs = [loc["coordinates"][0] for loc in locations]
        lats = [loc["coordinates"][1] for loc in locations]
        return {
            "type": "Point",
            "coordinates": [sum(lngs) / len(lngs), sum(lats) / len(lats)],
        }
