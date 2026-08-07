import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import GEOSPHERE, ASCENDING, DESCENDING
from app.config import settings

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None


db = Database()


async def get_database() -> AsyncIOMotorDatabase:
    return db.db


async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.db = db.client[settings.DATABASE_NAME]
    logger.info(f"Connected to database: '{settings.DATABASE_NAME}'")
    await init_spatial_indexes()


async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed.")


async def init_spatial_indexes():
    """
    Build 2dsphere spatial indexes on location fields across core collections
    to support $near, $geoWithin, and $geoIntersects spatial-temporal queries.
    """
    if db.db is None:
        logger.warning("Database connection unavailable for index creation.")
        return

    try:
        # Incidents: 2dsphere on location, compound indexes on category/status
        await db.db.incidents.create_index([("location", GEOSPHERE)])
        await db.db.incidents.create_index([("status", ASCENDING), ("severity_score", DESCENDING)])
        await db.db.incidents.create_index([("created_at", DESCENDING)])
        logger.info("Created 2dsphere index on 'incidents.location'")

        # Resources: 2dsphere on current_location
        await db.db.resources.create_index([("current_location", GEOSPHERE)])
        await db.db.resources.create_index([("status", ASCENDING), ("type", ASCENDING)])
        logger.info("Created 2dsphere index on 'resources.current_location'")

        # Shelters: 2dsphere on location
        await db.db.shelters.create_index([("location", GEOSPHERE)])
        await db.db.shelters.create_index([("is_active", ASCENDING)])
        logger.info("Created 2dsphere index on 'shelters.location'")

        # Hospitals: 2dsphere on location
        await db.db.hospitals.create_index([("location", GEOSPHERE)])
        logger.info("Created 2dsphere index on 'hospitals.location'")

        # Volunteers: 2dsphere on current_location
        await db.db.volunteers.create_index([("current_location", GEOSPHERE)])
        await db.db.volunteers.create_index([("status", ASCENDING)])
        logger.info("Created 2dsphere index on 'volunteers.current_location'")

        # Users: Unique index on email
        await db.db.users.create_index([("email", ASCENDING)], unique=True)
        logger.info("Created unique index on 'users.email'")

    except Exception as e:
        logger.error(f"Error creating database indexes: {e}")
