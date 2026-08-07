"""
GIS Spatial Operations Engine
===============================
Provides geometric computation utilities using Shapely and GeoPy:
- Hazard buffer zone generation
- Route-hazard intersection checks
- Reverse geocoding via Nominatim
- Overpass API infrastructure queries
- Coordinate validation and transformation
"""

from typing import Dict, Any, List, Optional, Tuple
from shapely.geometry import Point, Polygon, LineString, shape, mapping
from shapely.ops import unary_union
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import httpx
from app.core.logging import get_logger
from app.core.exceptions import GeocodingFailedException, InvalidCoordinatesException

logger = get_logger("gis_engine")

# Nominatim user-agent per TOS
NOMINATIM_USER_AGENT = "disaster-intelligence-platform/1.0"

# Overpass API endpoint
OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"


class GISEngine:
    """
    Performs spatial operations for the disaster intelligence platform:
    buffer zones, intersection tests, geocoding, and infrastructure queries.
    """

    def __init__(self):
        self.geocoder = Nominatim(user_agent=NOMINATIM_USER_AGENT, timeout=10)

    # ------------------------------------------------------------------
    # Coordinate Validation
    # ------------------------------------------------------------------

    @staticmethod
    def validate_coordinates(latitude: float, longitude: float) -> bool:
        if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
            raise InvalidCoordinatesException(latitude, longitude)
        return True

    # ------------------------------------------------------------------
    # Buffer Zone Generation
    # ------------------------------------------------------------------

    @staticmethod
    def create_hazard_buffer(
        longitude: float,
        latitude: float,
        radius_meters: float = 1000,
    ) -> Dict[str, Any]:
        """
        Create a circular buffer polygon around a point.
        Uses approximate degree conversion (1° ≈ 111,320m at equator).
        Returns GeoJSON Polygon.
        """
        point = Point(longitude, latitude)
        # Approximate degree radius (works reasonably for small areas)
        degree_radius = radius_meters / 111_320
        buffer_polygon = point.buffer(degree_radius, resolution=32)
        return mapping(buffer_polygon)

    @staticmethod
    def create_multi_hazard_zone(
        hazard_points: List[Dict[str, Any]],
        radius_meters: float = 1000,
    ) -> Dict[str, Any]:
        """
        Create a unified hazard zone polygon from multiple incident points.
        Merges overlapping buffer zones into a single geometry.
        """
        degree_radius = radius_meters / 111_320
        buffers = []
        for hp in hazard_points:
            coords = hp.get("coordinates", [0, 0])
            point = Point(coords[0], coords[1])
            buffers.append(point.buffer(degree_radius, resolution=32))

        merged = unary_union(buffers)
        return mapping(merged)

    # ------------------------------------------------------------------
    # Route-Hazard Intersection
    # ------------------------------------------------------------------

    @staticmethod
    def check_route_hazard_intersection(
        route_geojson: Dict[str, Any],
        hazard_zone_geojson: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Test whether an evacuation route intersects with a hazard zone.
        Returns intersection status and the intersecting segment geometry.
        """
        route = shape(route_geojson)
        hazard = shape(hazard_zone_geojson)

        intersects = route.intersects(hazard)
        result = {
            "intersects": intersects,
            "intersection_geometry": None,
            "safe_percentage": 100.0,
        }

        if intersects:
            intersection = route.intersection(hazard)
            result["intersection_geometry"] = mapping(intersection)
            # Estimate safe percentage
            if route.length > 0:
                result["safe_percentage"] = round(
                    (1 - intersection.length / route.length) * 100, 1
                )

        return result

    @staticmethod
    def compute_safe_corridor(
        route_geojson: Dict[str, Any],
        hazard_zones: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Compute the portion of a route that lies outside all hazard zones.
        Returns the safe corridor as a GeoJSON geometry.
        """
        route = shape(route_geojson)
        if not hazard_zones:
            return mapping(route)

        hazard_shapes = [shape(hz) for hz in hazard_zones]
        combined_hazard = unary_union(hazard_shapes)
        safe_portion = route.difference(combined_hazard)
        return mapping(safe_portion)

    # ------------------------------------------------------------------
    # Reverse Geocoding (Nominatim)
    # ------------------------------------------------------------------

    async def reverse_geocode(
        self, latitude: float, longitude: float
    ) -> Dict[str, Any]:
        """
        Resolve coordinates to a human-readable address using Nominatim.
        Returns district, block, landmark, and full address metadata.
        """
        try:
            location = self.geocoder.reverse(
                f"{latitude}, {longitude}", exactly_one=True, language="en"
            )
            if not location:
                return self._empty_address()

            raw = location.raw.get("address", {})
            return {
                "district": raw.get("county", raw.get("state_district", "")),
                "block": raw.get("suburb", raw.get("village", raw.get("town", ""))),
                "landmark": raw.get("amenity", raw.get("road", "")),
                "full_address": location.address or "",
            }

        except (GeocoderTimedOut, GeocoderServiceError) as e:
            logger.warning("Geocoding timed out", lat=latitude, lng=longitude, error=str(e))
            return self._empty_address()

    async def forward_geocode(self, query: str) -> Optional[Dict[str, Any]]:
        """
        Resolve an address string to coordinates using Nominatim.
        Returns GeoJSON Point or None.
        """
        try:
            location = self.geocoder.geocode(query, exactly_one=True, language="en")
            if location:
                return {
                    "type": "Point",
                    "coordinates": [location.longitude, location.latitude],
                    "display_name": location.address,
                }
            return None
        except (GeocoderTimedOut, GeocoderServiceError) as e:
            logger.warning("Forward geocoding failed", query=query, error=str(e))
            raise GeocodingFailedException(query)

    # ------------------------------------------------------------------
    # Overpass API — Critical Infrastructure Query
    # ------------------------------------------------------------------

    async def query_nearby_infrastructure(
        self,
        latitude: float,
        longitude: float,
        radius_meters: int = 2000,
        infrastructure_type: str = "hospital",
    ) -> List[Dict[str, Any]]:
        """
        Query OpenStreetMap Overpass API for nearby critical infrastructure.
        Supported types: hospital, school, fire_station, police, shelter.
        """
        tag_map = {
            "hospital": 'amenity="hospital"',
            "school": 'amenity="school"',
            "fire_station": 'amenity="fire_station"',
            "police": 'amenity="police"',
            "shelter": 'amenity="shelter"',
        }
        tag = tag_map.get(infrastructure_type, f'amenity="{infrastructure_type}"')

        query = f"""
        [out:json][timeout:10];
        (
          node[{tag}](around:{radius_meters},{latitude},{longitude});
          way[{tag}](around:{radius_meters},{latitude},{longitude});
        );
        out center;
        """

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.post(
                    OVERPASS_API_URL, data={"data": query}
                )
                response.raise_for_status()
                data = response.json()

            features = []
            for element in data.get("elements", []):
                lat = element.get("lat") or element.get("center", {}).get("lat")
                lon = element.get("lon") or element.get("center", {}).get("lon")
                if lat and lon:
                    features.append({
                        "name": element.get("tags", {}).get("name", "Unknown"),
                        "type": infrastructure_type,
                        "location": {
                            "type": "Point",
                            "coordinates": [lon, lat],
                        },
                        "osm_id": element.get("id"),
                    })

            logger.info(
                "Overpass query complete",
                type=infrastructure_type,
                results=len(features),
            )
            return features

        except Exception as e:
            logger.warning("Overpass API query failed", error=str(e))
            return []

    @staticmethod
    def _empty_address() -> Dict[str, Any]:
        return {
            "district": "",
            "block": "",
            "landmark": "",
            "full_address": "",
        }
