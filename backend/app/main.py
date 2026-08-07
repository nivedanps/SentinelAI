from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.core.logging import setup_logging, get_logger, generate_correlation_id
from app.core.scheduler import start_scheduler, stop_scheduler, register_background_jobs
from app.core.exceptions import DisasterPlatformException
from app.api.v1.router import api_router

logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    setup_logging(log_level="DEBUG" if settings.DEBUG else "INFO")
    logger.info(f"Starting {settings.PROJECT_NAME} in {settings.ENVIRONMENT} mode...")
    
    await connect_to_mongo()
    
    register_background_jobs()
    start_scheduler()
    
    logger.info("Application startup completed successfully.")
    yield
    
    # Shutdown actions
    logger.info("Shutting down application...")
    stop_scheduler()
    await close_mongo_connection()
    logger.info("Application shutdown completed.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Correlation ID & Timing Middleware
@app.middleware("http")
async def add_correlation_id_and_timing(request: Request, call_next):
    correlation_id = request.headers.get("X-Correlation-ID", generate_correlation_id())
    request.state.correlation_id = correlation_id
    
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    
    response.headers["X-Correlation-ID"] = correlation_id
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    
    logger.info(
        "Request processed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration_ms=round(process_time, 2),
        correlation_id=correlation_id,
    )
    return response


# Global Custom Domain Exception Handler (RFC 7807)
@app.exception_handler(DisasterPlatformException)
async def disaster_platform_exception_handler(request: Request, exc: DisasterPlatformException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "type": f"https://api.disasterplatform.org/errors/{exc.error_code.lower()}",
            "title": exc.error_code,
            "status": exc.status_code,
            "detail": exc.detail,
            "instance": request.url.path,
            "correlation_id": getattr(request.state, "correlation_id", None),
        },
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
    }


# Include V1 API Router
app.include_router(api_router, prefix=settings.API_V1_STR)
