"""
APScheduler Background Job Manager
====================================
Manages periodic background jobs:
  - Weather alert ingestion (every 15 minutes)
  - Incident cluster re-evaluation (every 5 minutes)
  - Shelter capacity audit (every 10 minutes)
  - Stale incident auto-escalation (every 30 minutes)
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from app.core.logging import get_logger

logger = get_logger("scheduler")

# Singleton scheduler instance
scheduler = AsyncIOScheduler(
    jobstores={"default": MemoryJobStore()},
    job_defaults={
        "coalesce": True,         # Combine missed runs into one
        "max_instances": 1,       # Prevent overlapping executions
        "misfire_grace_time": 60, # Seconds of grace for misfired jobs
    },
)


def start_scheduler():
    """Start the APScheduler event loop. Call during FastAPI lifespan startup."""
    if not scheduler.running:
        scheduler.start()
        logger.info("APScheduler started successfully")


def stop_scheduler():
    """Shutdown the scheduler gracefully. Call during FastAPI lifespan shutdown."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("APScheduler shut down")


def register_background_jobs():
    """
    Register all periodic background tasks.
    Actual job functions are imported from their respective service modules
    to keep this file as a pure orchestrator.
    """

    # Weather ingestion — every 15 minutes
    scheduler.add_job(
        _placeholder_weather_ingestion,
        "interval",
        minutes=15,
        id="weather_ingestion",
        replace_existing=True,
    )

    # Incident cluster re-evaluation — every 5 minutes
    scheduler.add_job(
        _placeholder_cluster_reevaluation,
        "interval",
        minutes=5,
        id="cluster_reevaluation",
        replace_existing=True,
    )

    # Shelter capacity audit — every 10 minutes
    scheduler.add_job(
        _placeholder_shelter_audit,
        "interval",
        minutes=10,
        id="shelter_capacity_audit",
        replace_existing=True,
    )

    # Stale incident auto-escalation — every 30 minutes
    scheduler.add_job(
        _placeholder_incident_escalation,
        "interval",
        minutes=30,
        id="incident_escalation",
        replace_existing=True,
    )

    logger.info("All background jobs registered")


# ---------------------------------------------------------------------------
# Placeholder async job functions (will delegate to actual services later)
# ---------------------------------------------------------------------------
async def _placeholder_weather_ingestion():
    logger.info("Background job: Weather ingestion triggered")


async def _placeholder_cluster_reevaluation():
    logger.info("Background job: Incident cluster re-evaluation triggered")


async def _placeholder_shelter_audit():
    logger.info("Background job: Shelter capacity audit triggered")


async def _placeholder_incident_escalation():
    logger.info("Background job: Stale incident escalation triggered")
