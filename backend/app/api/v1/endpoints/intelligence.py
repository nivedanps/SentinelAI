"""
Intelligence Endpoints — AI analysis, command briefs, threat assessments
"""

from fastapi import APIRouter, Depends
from app.core.security import get_current_user, RoleChecker, ROLE_COMMAND
from app.engines.ai_engine import AIEngine
from app.schemas.intelligence import AIAnalysisRequest

router = APIRouter(prefix="/intelligence", tags=["Intelligence & AI"])

ai_engine = AIEngine()


@router.post("/analyze")
async def analyze_text(
    request: AIAnalysisRequest,
    current_user: dict = Depends(get_current_user),
):
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
    current_user: dict = Depends(RoleChecker(ROLE_COMMAND)),
):
    return await ai_engine.generate_command_brief(
        incidents_summary=incidents_summary,
        resource_status=resource_status,
        weather_data=weather_data,
    )
