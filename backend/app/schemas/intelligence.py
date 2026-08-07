"""
Intelligence Schemas — AI analysis request/response, threat assessment DTOs
"""

from typing import Optional, List
from pydantic import BaseModel, Field


class AIAnalysisRequest(BaseModel):
    """Request to Antigravity AI Engine for incident text analysis."""
    text: str = Field(..., min_length=5, max_length=5000)
    incident_id: Optional[str] = None
    context: Optional[str] = None  # e.g., "flood", "earthquake"


class AIAnalysisResponse(BaseModel):
    """Response from AI Engine with structured extraction results."""
    incident_id: Optional[str] = None
    predicted_category: Optional[str] = None
    urgency_level: str = "MEDIUM"  # LOW / MEDIUM / HIGH / CRITICAL
    extracted_needs: List[str] = []
    damage_severity: float = 0.0  # 0.0 to 10.0
    confidence_score: float = 0.0  # 0.0 to 1.0
    summary: str = ""
    recommended_actions: List[str] = []


class ThreatAssessment(BaseModel):
    """Synthesized multi-source threat assessment for a geographic zone."""
    zone_name: str
    threat_level: str  # GREEN / YELLOW / ORANGE / RED
    active_incidents: int
    weather_risk_score: float
    infrastructure_risk_score: float
    combined_risk_score: float
    ai_advisory: str


class CommandBrief(BaseModel):
    """AI-generated operational brief for Command & Control dashboard."""
    timestamp: str
    total_active_incidents: int
    critical_alerts: List[str]
    resource_warnings: List[str]
    operational_summary: str
    recommended_priorities: List[str]


class SituationReport(BaseModel):
    """Periodic situation report combining all engine outputs."""
    report_id: str
    generated_at: str
    incident_summary: dict
    resource_status: dict
    shelter_status: dict
    hospital_status: dict
    weather_outlook: dict
    risk_heatmap_data: Optional[dict] = None
    ai_recommendations: List[str] = []
