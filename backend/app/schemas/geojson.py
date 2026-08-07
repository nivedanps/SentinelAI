"""
GeoJSON Pydantic Models
========================
Strict GeoJSON type models conforming to RFC 7946, with coordinate
boundary validation to prevent malformed spatial payloads.
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, field_validator


class GeoJSONPoint(BaseModel):
    """GeoJSON Point geometry — used for incident locations, shelters, hospitals."""
    type: Literal["Point"] = "Point"
    coordinates: List[float]  # [longitude, latitude]

    @field_validator("coordinates")
    @classmethod
    def validate_coordinates(cls, v: List[float]) -> List[float]:
        if len(v) < 2:
            raise ValueError("Coordinates must contain at least [longitude, latitude]")
        lng, lat = v[0], v[1]
        if not (-180 <= lng <= 180):
            raise ValueError(f"Longitude {lng} out of range [-180, 180]")
        if not (-90 <= lat <= 90):
            raise ValueError(f"Latitude {lat} out of range [-90, 90]")
        return v


class GeoJSONPolygon(BaseModel):
    """GeoJSON Polygon — used for hazard zones, district boundaries, weather alert areas."""
    type: Literal["Polygon"] = "Polygon"
    coordinates: List[List[List[float]]]  # Array of linear rings

    @field_validator("coordinates")
    @classmethod
    def validate_polygon_rings(cls, v: List[List[List[float]]]) -> List[List[List[float]]]:
        if len(v) < 1:
            raise ValueError("Polygon must have at least one linear ring")
        for ring in v:
            if len(ring) < 4:
                raise ValueError("Each linear ring must have at least 4 coordinate pairs")
            if ring[0] != ring[-1]:
                raise ValueError("Linear ring must be closed (first == last coordinate)")
        return v


class GeoJSONLineString(BaseModel):
    """GeoJSON LineString — used for evacuation routes."""
    type: Literal["LineString"] = "LineString"
    coordinates: List[List[float]]

    @field_validator("coordinates")
    @classmethod
    def validate_line(cls, v: List[List[float]]) -> List[List[float]]:
        if len(v) < 2:
            raise ValueError("LineString must have at least 2 coordinate pairs")
        return v


class AddressMetadata(BaseModel):
    """Reverse-geocoded address metadata attached to spatial entities."""
    district: Optional[str] = None
    block: Optional[str] = None
    landmark: Optional[str] = None
    full_address: Optional[str] = None
