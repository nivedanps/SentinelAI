export interface AnalyticsFilterState {
  dateRange: '24h' | '7d' | '30d' | 'custom';
  disasterType: string;
  severity: string;
  location: string;
  status: string;
}

export interface KpiMetrics {
  active_incidents: number;
  critical_incidents: number;
  people_affected: number;
  resources_deployed: number;
  avg_response_time_min: number;
  avg_resolution_time_str: string;
  resource_utilization_pct: number;
  overall_risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface IncidentTrendPoint {
  timestamp: string;
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface SeverityDistributionItem {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  count: number;
  color: string;
}

export interface DisasterTypeItem {
  disaster_type: string;
  incident_count: number;
  affected_population: number;
  critical_count: number;
}

export interface HotspotClusterItem {
  id: string;
  location_name: string;
  lat: number;
  lng: number;
  incident_count: number;
  critical_count: number;
  affected_population: number;
  dominant_disaster_type: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PopulationImpactData {
  total_affected: number;
  evacuation_required: number;
  evacuated: number;
  remaining_at_risk: number;
  trend: Array<{ time: string; affected: number; evacuated: number }>;
}

export interface ResourceStatusData {
  status_breakdown: Record<string, number>;
  category_allocations: Array<{ type: string; deployed: number; total: number }>;
}

export interface ResourceShortageItem {
  resource_type: string;
  required: number;
  available: number;
  shortage: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface ResponsePerformanceData {
  avg_response_time: string;
  avg_verification_time: string;
  avg_assignment_time: string;
  avg_resolution_time: string;
  performance_trend: Array<{ period: string; response_time: number; resolution_time: number }>;
}

export interface LifecycleStageItem {
  stage: string;
  count: number;
}

export interface AIAnalyticsData {
  analyses_performed: number;
  avg_confidence_pct: number;
  high_risk_identified: number;
  recommendations_generated: number;
  human_approved: number;
  human_rejected: number;
}

export interface RiskTrendPoint {
  timestamp: string;
  score: number;
  level: string;
}

export interface OperationalInsightItem {
  id: number;
  title: string;
  description: string;
  type: 'WARNING' | 'ALERT' | 'INFO' | 'STABLE';
}

export interface AnomalyItem {
  id: string;
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
}

export interface DataQualityData {
  reports_received: number;
  verified: number;
  unverified: number;
  potential_duplicates: number;
  conflicting: number;
}

export interface SourceAnalyticsItem {
  source_name: string;
  report_count: number;
  verified_count: number;
  confidence_pct: number;
}

export interface CriticalIncidentRow {
  id: string;
  title: string;
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affected_pop: number;
  risk: string;
  resources_required: string;
  status: string;
  created: string;
}

export interface OperationalAnalyticsData {
  generated_at: string;
  kpis: KpiMetrics;
  incident_trend: IncidentTrendPoint[];
  severity_distribution: SeverityDistributionItem[];
  disaster_types: DisasterTypeItem[];
  hotspots: HotspotClusterItem[];
  population_impact: PopulationImpactData;
  resource_status: ResourceStatusData;
  resource_shortages: ResourceShortageItem[];
  response_performance: ResponsePerformanceData;
  lifecycle: LifecycleStageItem[];
  ai_analytics: AIAnalyticsData;
  risk_trend: RiskTrendPoint[];
  operational_insights: OperationalInsightItem[];
  anomalies: AnomalyItem[];
  data_quality: DataQualityData;
  source_analytics: SourceAnalyticsItem[];
  critical_incidents?: CriticalIncidentRow[];
}
