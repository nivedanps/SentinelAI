"""
Intelligence Schemas — AI analysis request/response, structured disaster intelligence DTOs
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AIAnalysisRequest(BaseModel):
    """Request to AI Engine for incident analysis."""
    text: str = Field(..., min_length=5, max_length=5000)
    incident_id: Optional[str] = None
    context: Optional[str] = None  # e.g., "flood", "earthquake"


class SourceEvidence(BaseModel):
    """Source report evidence item."""
    source_type: str  # Citizen, Police, Hospital, Weather, IoT Sensor
    statement: str
    timestamp: Optional[str] = None
    credibility: float = 0.90


class MultiSourceSynthesis(BaseModel):
    """Multi-source evidence synthesis result."""
    sources_analyzed: int = 4
    agreement: str = "HIGH"  # LOW / MEDIUM / HIGH
    confidence: float = 0.94  # 0.0 to 1.0
    conflicting_information: Optional[str] = "None"
    unified_assessment: str = ""


class CategorizedRisk(BaseModel):
    """Risk breakdown item for a specific domain."""
    level: str = "MEDIUM"  # LOW / MEDIUM / HIGH / CRITICAL
    explanation: str = ""


class RiskAssessmentBreakdown(BaseModel):
    """Deterministic & AI combined risk assessment breakdown."""
    overall_level: str = "HIGH"
    overall_score: float = 85.0  # 0.0 to 100.0
    population_risk: CategorizedRisk
    infrastructure_risk: CategorizedRisk
    access_risk: CategorizedRisk
    medical_risk: CategorizedRisk
    resource_risk: CategorizedRisk
    weather_risk: CategorizedRisk
    factor_breakdown: Dict[str, float] = Field(default_factory=dict)
    explanation: str = ""


class ActionRecommendation(BaseModel):
    """Structured response action recommendation."""
    id: str = ""
    action: str
    priority: str = "HIGH"  # LOW / MEDIUM / HIGH / CRITICAL
    reason: str
    supporting_evidence: List[str] = Field(default_factory=list)
    related_incident: str = ""
    recommended_resource: str = ""


class DecisionSupportItem(BaseModel):
    """Commander Decision Support card data."""
    action: str
    expected_benefit: str
    potential_risk: str
    required_resources: List[str] = Field(default_factory=list)
    confidence: float = 0.90


class IncidentIntelligenceAnalysis(BaseModel):
    """Comprehensive structured output for incident AI analysis."""
    analysis_id: str
    incident_id: str
    incident_title: str = ""
    incident_type: str = "FLOOD"
    severity: str = "CRITICAL"
    urgency: str = "CRITICAL"
    confidence: float = 0.92
    affected_population_estimate: int = 0
    potential_impacts: List[str] = Field(default_factory=list)
    infrastructure_impacts: List[str] = Field(default_factory=list)
    required_response_teams: List[str] = Field(default_factory=list)
    required_resources: List[str] = Field(default_factory=list)
    recommended_actions: List[ActionRecommendation] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    uncertainties: List[str] = Field(default_factory=list)
    source_evidence: List[SourceEvidence] = Field(default_factory=list)
    multi_source_synthesis: Optional[MultiSourceSynthesis] = None
    decision_support: List[DecisionSupportItem] = Field(default_factory=list)
    observed_facts: List[str] = Field(default_factory=list)
    inferred_insights: List[str] = Field(default_factory=list)
    provider: str = "mock"
    status: str = "DEMO INTELLIGENCE"  # LIVE AI or DEMO INTELLIGENCE
    timestamp: str = ""


class OperationalIntelligenceOverview(BaseModel):
    """Overall current operational intelligence snapshot."""
    overall_risk: str = "HIGH"
    confidence: float = 0.92
    active_critical_incidents: int = 5
    affected_population: int = 12480
    resource_shortages: int = 3
    situation_summary: str = ""
    last_analysis_time: str = ""
    last_analysis_id: str = ""
    provider_status: str = "DEMO INTELLIGENCE"
    provider_name: str = "Mock Engine"


class SituationReportSchema(BaseModel):
    """Structured Situation Report generated for EOC & DDMO."""
    report_id: str
    generated_at: str
    target_audiences: List[str] = Field(
        default_factory=lambda: [
            "District Disaster Management Officer",
            "Emergency Operations Center",
            "Incident Commander",
        ]
    )
    executive_summary: str
    current_situation: str
    critical_incidents: List[Dict[str, Any]] = Field(default_factory=list)
    affected_population_total: int = 0
    infrastructure_impact_summary: str = ""
    resource_status_summary: str = ""
    shelter_status_summary: str = ""
    major_risks: List[str] = Field(default_factory=list)
    recommended_actions: List[str] = Field(default_factory=list)
    uncertainties: List[str] = Field(default_factory=list)


class AnalysisHistoryItem(BaseModel):
    """Summary item in AI analysis history list."""
    analysis_id: str
    incident_id: str
    incident_title: str
    timestamp: str
    risk: str
    confidence: float
    provider: str
    status: str


class AIAnalysisResponse(BaseModel):
    """Legacy compatibility response from AI Engine."""
    incident_id: Optional[str] = None
    predicted_category: Optional[str] = None
    urgency_level: str = "MEDIUM"
    extracted_needs: List[str] = Field(default_factory=list)
    damage_severity: float = 0.0
    confidence_score: float = 0.0
    summary: str = ""
    recommended_actions: List[str] = Field(default_factory=list)


class ThreatAssessment(BaseModel):
    """Synthesized multi-source threat assessment for a geographic zone."""
    zone_name: str
    threat_level: str
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
    ai_recommendations: List[str] = Field(default_factory=list)
