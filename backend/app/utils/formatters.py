"""
General Formatting Utilities
"""

from datetime import datetime, timezone
from typing import Any


def format_datetime(dt: datetime) -> str:
    if dt:
        return dt.isoformat()
    return ""


def format_duration_minutes(minutes: float) -> str:
    if minutes < 60:
        return f"{minutes:.0f} min"
    hours = int(minutes // 60)
    remaining = int(minutes % 60)
    return f"{hours}h {remaining}m"


def safe_str(value: Any) -> str:
    if value is None:
        return ""
    return str(value)
