"""
Analytics Schemas — Operational metrics, trend DTOs, and analytics snapshots
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AnalyticsFilterRequest(BaseModel):
    """Filter parameters for operational analytics requests."""
    date_range: Optional[str] = "24h"  # 24h, 7d, 30d, custom
    disaster_type: Optional[str] = "ALL"
    severity: Optional[str] = "ALL"
    location: Optional[str] = "ALL"
    status: Optional[str] = "ALL"
    source: Optional[str] = "ALL"


class KpiMetrics(BaseModel):
    active_incidents: int = 24
    critical_incidents: int = 5
    people_affected: int = 12480
    resources_deployed: int = 68
    avg_response_time_min: int = 18
    avg_resolution_time_str: str = "2h 14m"
    resource_utilization_pct: float = 72.0
    overall_risk: str = "HIGH"


class IncidentTrendPoint(BaseModel):
    timestamp: str
    total: int
    critical: int
    high: int
    medium: int
    low: int


class SeverityDistributionItem(BaseModel):
    severity: str
    count: int
    color: str


class DisasterTypeItem(BaseModel):
    disaster_type: str
    incident_count: int
    affected_population: int
    critical_count: int


class HotspotClusterItem(BaseModel):
    id: str
    location_name: str
    lat: float
    lng: float
    incident_count: int
    critical_count: int
    affected_population: int
    dominant_disaster_type: str
    risk_level: str


class PopulationImpactData(BaseModel):
    total_affected: int = 12480
    evacuation_required: int = 3200
    evacuated: int = 2410
    remaining_at_risk: int = 790
    trend: List[Dict[str, Any]] = Field(default_factory=list)


class ResourceStatusData(BaseModel):
    status_breakdown: Dict[str, int]
    category_allocations: List[Dict[str, Any]]


class ResourceShortageItem(BaseModel):
    resource_type: str
    required: int
    available: int
    shortage: int
    priority: str  # CRITICAL, HIGH, MEDIUM


class ResponsePerformanceData(BaseModel):
    avg_response_time: str = "18 min"
    avg_verification_time: str = "7 min"
    avg_assignment_time: str = "11 min"
    avg_resolution_time: str = "2h 14m"
    performance_trend: List[Dict[str, Any]] = Field(default_factory=list)


class LifecycleStageItem(BaseModel):
    stage: str
    count: int


class AIAnalyticsData(BaseModel):
    analyses_performed: int = 42
    avg_confidence_pct: float = 91.0
    high_risk_identified: int = 8
    recommendations_generated: int = 67
    human_approved: int = 54
    human_rejected: int = 13


class RiskTrendPoint(BaseModel):
    timestamp: str
    score: float
    level: str


class OperationalInsightItem(BaseModel):
    id: int
    title: str
    description: str
    type: str  # WARNING, ALERT, INFO, STABLE


class AnomalyItem(BaseModel):
    id: str
    message: str
    severity: str
    timestamp: str


class DataQualityData(BaseModel):
    reports_received: int = 86
    verified: int = 62
    unverified: int = 17
    potential_duplicates: int = 5
    conflicting: int = 2


class SourceAnalyticsItem(BaseModel):
    source_name: str
    report_count: int
    verified_count: int
    confidence_pct: float


class AnalyticsOverviewResponse(BaseModel):
    generated_at: str
    kpis: KpiMetrics
    incident_trend: List[IncidentTrendPoint]
    severity_distribution: List[SeverityDistributionItem]
    disaster_types: List[DisasterTypeItem]
    hotspots: List[HotspotClusterItem]
    population_impact: PopulationImpactData
    resource_status: ResourceStatusData
    resource_shortages: List[ResourceShortageItem]
    response_performance: ResponsePerformanceData
    lifecycle: List[LifecycleStageItem]
    ai_analytics: AIAnalyticsData
    risk_trend: List[RiskTrendPoint]
    operational_insights: List[OperationalInsightItem]
    anomalies: List[AnomalyItem]
    data_quality: DataQualityData
    source_analytics: List[SourceAnalyticsItem]
