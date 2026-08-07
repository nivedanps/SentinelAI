"""
Resource Allocation Engine
============================
Solves optimal resource-to-incident matching using NetworkX bipartite
graph minimum weight matching.

W(i, r) = α * TravelTime(r, i) + β * (1 / Severity(i)) + γ * AssetSuitability(r, i)
"""

import networkx as nx
from typing import Dict, Any, List, Tuple, Optional
from app.engines.fusion_engine import haversine_distance
from app.core.logging import get_logger

logger = get_logger("resource_engine")

# Weight coefficients for the dispatch scoring function
ALPHA_TRAVEL = 0.5   # Travel time weight
BETA_SEVERITY = 0.3  # Inverse severity weight (higher severity = lower cost)
GAMMA_SUITABILITY = 0.2  # Asset-to-incident type suitability weight

# Suitability matrix: incident_category -> best resource types
SUITABILITY_MAP = {
    "FLOOD": ["BOAT", "RESCUE_TEAM", "FOOD_SUPPLY", "WATER_PURIFIER"],
    "FIRE": ["FIRE_ENGINE", "RESCUE_TEAM", "AMBULANCE"],
    "BUILDING_COLLAPSE": ["RESCUE_TEAM", "AMBULANCE", "GENERATOR"],
    "LANDSLIDE": ["RESCUE_TEAM", "AMBULANCE", "FOOD_SUPPLY"],
    "MEDICAL_EMERGENCY": ["AMBULANCE", "MEDICAL_SUPPLIES"],
    "HAZMAT": ["FIRE_ENGINE", "RESCUE_TEAM"],
    "CYCLONE": ["RESCUE_TEAM", "FOOD_SUPPLY", "GENERATOR", "WATER_PURIFIER"],
    "EARTHQUAKE": ["RESCUE_TEAM", "AMBULANCE", "FOOD_SUPPLY", "GENERATOR"],
    "OTHER": ["RESCUE_TEAM"],
}

# Assumed average speed for ETA estimation (km/h)
AVERAGE_RESPONSE_SPEED_KMH = 40


class ResourceAllocationEngine:
    """
    Builds a bipartite graph between incidents and available resources,
    then solves minimum-weight matching for optimal dispatch assignments.
    """

    def compute_dispatch_cost(
        self,
        resource: Dict[str, Any],
        incident: Dict[str, Any],
    ) -> float:
        """
        Compute the weighted dispatch cost between a resource and an incident.
        Lower cost = better assignment.
        """
        # Travel time estimation
        r_coords = resource["current_location"]["coordinates"]
        i_coords = incident["location"]["coordinates"]
        distance_m = haversine_distance(
            r_coords[1], r_coords[0], i_coords[1], i_coords[0]
        )
        distance_km = distance_m / 1000
        travel_time_hours = distance_km / AVERAGE_RESPONSE_SPEED_KMH

        # Inverse severity: high severity incidents get lower cost (prioritized)
        severity = incident.get("severity_score", 5.0)
        inverse_severity = 1.0 / max(severity, 0.1)

        # Asset suitability: 0 if perfectly suited, 1 if not ideal
        category = incident.get("category", "OTHER")
        suitable_types = SUITABILITY_MAP.get(category, ["RESCUE_TEAM"])
        resource_type = resource.get("type", "")
        suitability = 0.0 if resource_type in suitable_types else 1.0

        cost = (
            ALPHA_TRAVEL * travel_time_hours
            + BETA_SEVERITY * inverse_severity
            + GAMMA_SUITABILITY * suitability
        )
        return round(cost, 4)

    def compute_eta_minutes(
        self, resource: Dict[str, Any], incident: Dict[str, Any]
    ) -> float:
        """Estimate time of arrival in minutes."""
        r_coords = resource["current_location"]["coordinates"]
        i_coords = incident["location"]["coordinates"]
        distance_m = haversine_distance(
            r_coords[1], r_coords[0], i_coords[1], i_coords[0]
        )
        distance_km = distance_m / 1000
        eta_minutes = (distance_km / AVERAGE_RESPONSE_SPEED_KMH) * 60
        return round(eta_minutes, 1)

    def solve_optimal_matching(
        self,
        incidents: List[Dict[str, Any]],
        resources: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Build a bipartite graph and solve minimum weight full matching
        to produce optimal resource-to-incident dispatch assignments.

        Returns list of: { resource_id, incident_id, cost, eta_minutes }
        """
        if not incidents or not resources:
            return []

        G = nx.Graph()

        # Add incident nodes (partition 0)
        incident_nodes = []
        for i, inc in enumerate(incidents):
            node_id = f"I_{inc.get('_id', i)}"
            G.add_node(node_id, bipartite=0)
            incident_nodes.append((node_id, inc))

        # Add resource nodes (partition 1)
        resource_nodes = []
        for j, res in enumerate(resources):
            node_id = f"R_{res.get('_id', j)}"
            G.add_node(node_id, bipartite=1)
            resource_nodes.append((node_id, res))

        # Add weighted edges between all incident-resource pairs
        for i_node, inc in incident_nodes:
            for r_node, res in resource_nodes:
                cost = self.compute_dispatch_cost(res, inc)
                G.add_edge(i_node, r_node, weight=cost)

        # Solve minimum weight matching
        try:
            matching = nx.min_weight_matching(G)
        except Exception as e:
            logger.error("Graph matching failed", error=str(e))
            return []

        # Build result set
        assignments = []
        inc_lookup = {n: d for n, d in incident_nodes}
        res_lookup = {n: d for n, d in resource_nodes}

        for node_a, node_b in matching:
            # Determine which is incident and which is resource
            if node_a.startswith("I_"):
                i_node, r_node = node_a, node_b
            else:
                i_node, r_node = node_b, node_a

            inc = inc_lookup[i_node]
            res = res_lookup[r_node]

            assignments.append({
                "resource_id": res.get("_id"),
                "resource_name": res.get("name"),
                "resource_type": res.get("type"),
                "incident_id": inc.get("_id"),
                "incident_title": inc.get("title"),
                "cost": G[i_node][r_node]["weight"],
                "eta_minutes": self.compute_eta_minutes(res, inc),
            })

        assignments.sort(key=lambda x: x["cost"])
        logger.info(
            "Optimal dispatch computed",
            total_assignments=len(assignments),
        )
        return assignments
