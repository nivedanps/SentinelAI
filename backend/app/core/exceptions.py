"""
Custom Domain Exception Hierarchy
===================================
All domain-specific exceptions extend a common DisasterPlatformException base,
enabling a single global exception handler in main.py to produce consistent
RFC 7807 Problem Details JSON responses.
"""

from fastapi import HTTPException, status


class DisasterPlatformException(HTTPException):
    """Base exception for all platform domain errors."""

    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail: str = "An unexpected error occurred",
        error_code: str = "PLATFORM_ERROR",
    ):
        self.error_code = error_code
        super().__init__(status_code=status_code, detail=detail)


# ---------------------------------------------------------------------------
# Authentication & Authorization
# ---------------------------------------------------------------------------
class InvalidCredentialsException(DisasterPlatformException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            error_code="AUTH_INVALID_CREDENTIALS",
        )


class TokenExpiredException(DisasterPlatformException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            error_code="AUTH_TOKEN_EXPIRED",
        )


class InsufficientPermissionsException(DisasterPlatformException):
    def __init__(self, required_role: str = ""):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Insufficient permissions. Required: {required_role}",
            error_code="AUTH_INSUFFICIENT_PERMISSIONS",
        )


# ---------------------------------------------------------------------------
# Entity Not Found
# ---------------------------------------------------------------------------
class EntityNotFoundException(DisasterPlatformException):
    def __init__(self, entity_type: str, entity_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{entity_type} with id '{entity_id}' not found",
            error_code="ENTITY_NOT_FOUND",
        )


# ---------------------------------------------------------------------------
# Validation & Business Logic
# ---------------------------------------------------------------------------
class ValidationException(DisasterPlatformException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code="VALIDATION_ERROR",
        )


class DuplicateEntityException(DisasterPlatformException):
    def __init__(self, entity_type: str, field: str, value: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{entity_type} with {field}='{value}' already exists",
            error_code="DUPLICATE_ENTITY",
        )


# ---------------------------------------------------------------------------
# GIS & Spatial
# ---------------------------------------------------------------------------
class InvalidCoordinatesException(DisasterPlatformException):
    def __init__(self, lat: float, lng: float):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid coordinates: lat={lat}, lng={lng}. "
                   f"Latitude must be [-90, 90], Longitude must be [-180, 180].",
            error_code="GIS_INVALID_COORDINATES",
        )


class GeocodingFailedException(DisasterPlatformException):
    def __init__(self, query: str):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Geocoding service failed for query: '{query}'",
            error_code="GIS_GEOCODING_FAILED",
        )


# ---------------------------------------------------------------------------
# External Service Errors
# ---------------------------------------------------------------------------
class ExternalServiceException(DisasterPlatformException):
    def __init__(self, service_name: str, detail: str = "Service unavailable"):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"External service error ({service_name}): {detail}",
            error_code="EXTERNAL_SERVICE_ERROR",
        )


class AIEngineException(DisasterPlatformException):
    def __init__(self, detail: str = "AI analysis failed"):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI Engine error: {detail}",
            error_code="AI_ENGINE_ERROR",
        )


# ---------------------------------------------------------------------------
# Resource Allocation
# ---------------------------------------------------------------------------
class NoAvailableResourceException(DisasterPlatformException):
    def __init__(self, resource_type: str, location: str = ""):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"No available {resource_type} resources near {location}",
            error_code="RESOURCE_UNAVAILABLE",
        )


class ShelterCapacityExceededException(DisasterPlatformException):
    def __init__(self, shelter_name: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Shelter '{shelter_name}' has reached full capacity",
            error_code="SHELTER_CAPACITY_EXCEEDED",
        )
