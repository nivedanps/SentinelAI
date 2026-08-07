"""
Situation Awareness Engine (Common Operational Picture)
=======================================================
Maintains the composite state of the COP by aggregating live data from
all sub-engines into unified GeoJSON FeatureCollections and operational
summary snapshots.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone
from app.core.logging import get_logger

logger = get_logger("situation_engine")


class SituationEngine:
    """
    Compiles GIS layers, incident clusters, resource positions, shelter statuses,
    and risk heatmaps into a unified situational awareness snapshot.
    """

    async def generate_cop_snapshot(
        self,
        incidents: List[Dict[str, Any]],
        resources: List[Dict[str, Any]],
        shelters: List[Dict[str, Any]],
        hospitals: List[Dict[str, Any]],
        weather_alerts: List[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Produce a full Common Operational Picture snapshot containing
        GeoJSON FeatureCollections for each layer.
        """
        snapshot = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "layers": {
                "incidents": self._build_feature_collection(
                    incidents, "location", "incident"
                ),
                "resources": self._build_feature_collection(
                    resources, "current_location", "resource"
                ),
                "shelters": self._build_feature_collection(
                    shelters, "location", "shelter"
                ),
                "hospitals": self._build_feature_collection(
                    hospitals, "location", "hospital"
                ),
            },
            "summary": {
                "total_active_incidents": len(
                    [i for i in incidents if i.get("status") not in ("RESOLVED", "REJECTED")]
                ),
                "total_resources_deployed": len(
                    [r for r in resources if r.get("status") == "DISPATCHED"]
                ),
                "total_resources_available": len(
                    [r for r in resources if r.get("status") == "AVAILABLE"]
                ),
                "shelters_active": len(
                    [s for s in shelters if s.get("is_active")]
                ),
                "hospitals_with_icu": len(
                    [h for h in hospitals if h.get("available_icu_beds", 0) > 0]
                ),
            },
            "bottleneck_warnings": self._detect_bottlenecks(
                incidents, resources, shelters, hospitals
            ),
        }

        if weather_alerts:
            snapshot["layers"]["weather_alerts"] = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": alert.get("affected_zone", {}),
                        "properties": {
                            "alert_type": alert.get("alert_type"),
                            "severity": alert.get("severity"),
                            "valid_until": str(alert.get("valid_until", "")),
                        },
                    }
                    for alert in weather_alerts
                ],
            }

        logger.info(
            "COP snapshot generated",
            incidents=len(incidents),
            resources=len(resources),
        )
        return snapshot

    @staticmethod
    def _build_feature_collection(
        entities: List[Dict[str, Any]],
        location_field: str,
        entity_type: str,
    ) -> Dict[str, Any]:
        """Convert a list of entities into a GeoJSON FeatureCollection."""
        features = []
        for entity in entities:
            location = entity.get(location_field)
            if not location:
                continue
            properties = {
                k: v for k, v in entity.items()
                if k not in (location_field, "_id") and not isinstance(v, (dict, list))
            }
            properties["id"] = entity.get("_id", "")
            properties["entity_type"] = entity_type
            features.append({
                "type": "Feature",
                "geometry": location,
                "properties": properties,
            })

        return {
            "type": "FeatureCollection",
            "features": features,
        }

    @staticmethod
    def _detect_bottlenecks(
        incidents: List[Dict],
        resources: List[Dict],
        shelters: List[Dict],
        hospitals: List[Dict],
    ) -> List[str]:
        """Detect operational bottleneck warnings for the command dashboard."""
        warnings = []

        # Unassigned critical incidents
        critical_unassigned = [
            i for i in incidents
            if i.get("severity_score", 0) >= 7.0
            and i.get("status") in ("REPORTED", "VERIFIED")
        ]
        if critical_unassigned:
            warnings.append(
                f"{len(critical_unassigned)} critical incidents remain unassigned"
            )

        # Resource depletion
        available = [r for r in resources if r.get("status") == "AVAILABLE"]
        total = len(resources)
        if total > 0 and len(available) / total < 0.2:
            warnings.append(
                f"Resource pool critically low: {len(available)}/{total} available"
            )

        # Shelter overcrowding
        for s in shelters:
            total_cap = s.get("capacity_total", 1)
            current = s.get("capacity_current", 0)
            if total_cap > 0 and current / total_cap >= 0.9:
                warnings.append(
                    f"Shelter '{s.get('name')}' near full capacity ({current}/{total_cap})"
                )

        # Hospital ICU exhaustion
        for h in hospitals:
            if h.get("available_icu_beds", 0) == 0:
                warnings.append(
                    f"Hospital '{h.get('name')}' has zero ICU beds available"
                )
            if h.get("oxygen_status") in ("CRITICAL", "EXHAUSTED"):
                warnings.append(
                    f"Hospital '{h.get('name')}' oxygen status: {h.get('oxygen_status')}"
                )

        return warnings
