"""
Risk Assessment Engine
=======================
Continuously evaluates spatial risk levels across the district.

RiskScore(Z) = w1 * HazardIntensity(Z)
             + w2 * VulnerabilityIndex(Z)
             + w3 * InfrastructureFragility(Z)

Generates dynamic risk polygons with severity color bands
(green → yellow → orange → deep red).
"""

from typing import Dict, Any, List, Optional
from app.core.logging import get_logger

logger = get_logger("risk_engine")

# Risk weight configuration
W_HAZARD = 0.45
W_VULNERABILITY = 0.30
W_INFRASTRUCTURE = 0.25

# Severity thresholds for color bands
RISK_THRESHOLDS = {
    "GREEN": (0, 2.5),
    "YELLOW": (2.5, 5.0),
    "ORANGE": (5.0, 7.5),
    "RED": (7.5, 10.0),
}


class RiskEngine:
    """
    Computes dynamic risk scores for geographic zones based on:
    - Active incident density and severity
    - Weather hazard data
    - Infrastructure vulnerability (proximity to hospitals, schools, dams)
    """

    def compute_zone_risk(
        self,
        hazard_intensity: float,
        vulnerability_index: float,
        infrastructure_fragility: float,
    ) -> Dict[str, Any]:
        """
        Compute a weighted composite risk score and map to a color band.
        All inputs should be normalized to [0, 10].
        """
        raw_score = (
            W_HAZARD * hazard_intensity
            + W_VULNERABILITY * vulnerability_index
            + W_INFRASTRUCTURE * infrastructure_fragility
        )
        score = min(max(raw_score, 0), 10.0)
        level = self._score_to_level(score)

        logger.info(
            "Zone risk computed",
            score=score,
            level=level,
            hazard=hazard_intensity,
            vulnerability=vulnerability_index,
            infrastructure=infrastructure_fragility,
        )

        return {
            "risk_score": round(score, 2),
            "risk_level": level,
            "components": {
                "hazard_intensity": hazard_intensity,
                "vulnerability_index": vulnerability_index,
                "infrastructure_fragility": infrastructure_fragility,
            },
        }

    def compute_incident_severity(
        self,
        category: str,
        description_length: int,
        media_count: int,
        nearby_incident_count: int,
        ai_urgency: str = "MEDIUM",
    ) -> float:
        """
        Compute a severity score [1.0, 10.0] for an incoming incident
        using multi-parameter heuristics.
        """
        # Base severity by category
        category_base = {
            "EARTHQUAKE": 9.0,
            "CYCLONE": 8.5,
            "FLOOD": 7.5,
            "BUILDING_COLLAPSE": 8.0,
            "LANDSLIDE": 7.0,
            "FIRE": 6.5,
            "HAZMAT": 7.0,
            "MEDICAL_EMERGENCY": 5.0,
            "OTHER": 4.0,
        }
        base = category_base.get(category, 5.0)

        # AI urgency modifier
        urgency_mod = {"LOW": -1.5, "MEDIUM": 0, "HIGH": 1.5, "CRITICAL": 3.0}
        base += urgency_mod.get(ai_urgency, 0)

        # Cluster density amplifier: more reports = higher severity
        if nearby_incident_count > 5:
            base += 1.5
        elif nearby_incident_count > 2:
            base += 0.5

        # Clamp to range
        return round(min(max(base, 1.0), 10.0), 1)

    @staticmethod
    def _score_to_level(score: float) -> str:
        for level, (low, high) in RISK_THRESHOLDS.items():
            if low <= score < high:
                return level
        return "RED"

    def generate_risk_heatmap_data(
        self, zone_scores: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Transform zone risk scores into Leaflet-compatible heatmap data points.
        Each entry: { lat, lng, intensity (0-1) }
        """
        heatmap_data = []
        for zone in zone_scores:
            centroid = zone.get("centroid", {})
            coords = centroid.get("coordinates", [0, 0])
            intensity = zone.get("risk_score", 0) / 10.0  # Normalize to 0-1
            heatmap_data.append({
                "lat": coords[1],
                "lng": coords[0],
                "intensity": round(intensity, 3),
            })
        return heatmap_data
