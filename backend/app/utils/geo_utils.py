"""
GIS Utility Helpers
"""

from typing import Tuple


def validate_lat_lng(latitude: float, longitude: float) -> bool:
    return -90 <= latitude <= 90 and -180 <= longitude <= 180


def km_to_meters(km: float) -> float:
    return km * 1000


def meters_to_km(meters: float) -> float:
    return meters / 1000


def format_coordinates(longitude: float, latitude: float) -> str:
    return f"{latitude:.6f}, {longitude:.6f}"
