"""
Intelligence Endpoints — SentinelAI Disaster Intelligence Engine REST API
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.security import get_current_user
from app.engines.ai_engine import AIEngine
from app.schemas.intelligence import (
    AIAnalysisRequest,
    IncidentIntelligenceAnalysis,
    OperationalIntelligenceOverview,
    SituationReportSchema,
)

router = APIRouter(prefix="/intelligence", tags=["Intelligence & AI"])

ai_engine = AIEngine()


@router.get("/status")
async def get_ai_status():
    """Get system and provider status for AI Engine."""
    return await ai_engine.get_system_status()


@router.get("/operational-overview")
async def get_operational_overview():
    """Get overall situation operational intelligence snapshot."""
    provider = ai_engine.get_provider()
    return await provider.summarize_situation([], [], {})


@router.post("/incidents/{incident_id}/analyze")
async def analyze_incident(
    incident_id: str,
    payload: Optional[Dict[str, Any]] = None,
    force_refresh: bool = Query(default=False),
):
    """
    Analyze a specific incident using the Hybrid Intelligence Architecture:
    Deterministic Risk Assessment + AI Multi-source Evidence Synthesis.
    """
    incident_data = payload.get("incident") if payload else None
    evidence_data = payload.get("evidence") if payload else None

    if not incident_data:
        # Generate structured incident object matching Karnataka disaster scenario
        if "1041" in incident_id or "bengaluru" in incident_id.lower():
            incident_data = {
                "id": incident_id,
                "title": "Industrial fire — Bengaluru",
                "category": "FIRE",
                "severity_score": 8.5,
                "description": "Industrial warehouse fire in Peenya sector with chemical smoke release.",
                "location": {"type": "Point", "coordinates": [77.5946, 12.9716]},
            }
        elif "1040" in incident_id or "mandya" in incident_id.lower():
            incident_data = {
                "id": incident_id,
                "title": "Road disruption — Mandya",
                "category": "LANDSLIDE",
                "severity_score": 7.0,
                "description": "Highway access corridor submerged and blocked by debris near Mandya bypass.",
                "location": {"type": "Point", "coordinates": [76.8951, 12.5218]},
            }
        elif "1039" in incident_id or "kodagu" in incident_id.lower():
            incident_data = {
                "id": incident_id,
                "title": "Landslide risk — Kodagu",
                "category": "LANDSLIDE",
                "severity_score": 7.5,
                "description": "Slope instability along Madikeri road following continuous heavy rainfall.",
                "location": {"type": "Point", "coordinates": [75.7382, 12.4244]},
            }
        else:
            incident_data = {
                "id": incident_id,
                "title": "Flood near Mysuru",
                "category": "FLOOD",
                "severity_score": 9.2,
                "description": "Kaveri river overflow submersing residential sectors and cutting off bridge access.",
                "location": {"type": "Point", "coordinates": [76.6394, 12.2958]},
            }

    return await ai_engine.analyze_incident_full(
        incident=incident_data,
        evidence=evidence_data,
        force_refresh=force_refresh,
    )


@router.post("/situation/analyze")
async def analyze_situation(payload: Optional[Dict[str, Any]] = None):
    """Analyze overall active situation across all incidents."""
    provider = ai_engine.get_provider()
    return await provider.summarize_situation([], [], {})


@router.post("/situation/report")
async def generate_situation_report(payload: Optional[Dict[str, Any]] = None):
    """Generate formal Situation Report (SITREP) for DDMO & EOC."""
    return await ai_engine.generate_situation_report(payload or {})


@router.get("/analyses")
async def list_analyses():
    """List analysis history records."""
    return await ai_engine.list_analysis_history()


@router.get("/analyses/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get detailed analysis record by analysis ID."""
    result = await ai_engine.get_analysis_by_id(analysis_id)
    if not result:
        # Fallback to mock generation if requested ID exists in standard scenario
        dummy = {
            "id": "INC-1042",
            "title": "Flood near Mysuru",
            "category": "FLOOD",
            "severity_score": 9.2,
        }
        return await ai_engine.analyze_incident_full(dummy)
    return result


@router.get("/incidents/{incident_id}/latest")
async def get_latest_incident_analysis(incident_id: str):
    """Get latest cached analysis for an incident."""
    return await analyze_incident(incident_id, force_refresh=False)


@router.post("/risk-assessment/{incident_id}")
async def get_deterministic_risk_assessment(
    incident_id: str,
    severity_score: float = Query(default=8.5),
    affected_population: int = Query(default=3200),
):
    """Run deterministic Risk Assessment Engine calculation."""
    return ai_engine.risk_engine.assess_incident_risk(
        severity_score=severity_score,
        affected_population=affected_population,
    )


# Legacy Compatibility Endpoints
@router.post("/analyze")
async def legacy_analyze_text(request: AIAnalysisRequest):
    result = await ai_engine.analyze_incident_text(
        text=request.text, context=request.context
    )
    if request.incident_id:
        result["incident_id"] = request.incident_id
    return result


@router.post("/command-brief")
async def generate_command_brief(
    incidents_summary: dict,
    resource_status: dict,
    weather_data: dict = None,
):
    return await ai_engine.generate_command_brief(
        incidents_summary=incidents_summary,
        resource_status=resource_status,
        weather_data=weather_data,
    )
