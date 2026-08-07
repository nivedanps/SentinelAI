"""
Structured JSON Logging Configuration
========================================
Uses structlog for machine-readable, context-enriched log entries.
Every log line automatically includes correlation_id, timestamp, and log level.
"""

import logging
import sys
import structlog
from uuid import uuid4


def setup_logging(log_level: str = "INFO"):
    """
    Configure structlog processors for structured JSON output.
    Call once during application startup (lifespan event).
    """

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            getattr(logging, log_level.upper(), logging.INFO)
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )

    # Also configure stdlib logging to route through structlog
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper(), logging.INFO),
    )


def get_logger(name: str = __name__) -> structlog.BoundLogger:
    """
    Get a structured logger instance with the given name bound as context.
    """
    return structlog.get_logger(logger_name=name)


def generate_correlation_id() -> str:
    """Generate a UUID correlation ID for request tracing."""
    return str(uuid4())
