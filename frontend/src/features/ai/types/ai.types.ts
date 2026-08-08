export interface SourceEvidence {
  source_type: 'Citizen' | 'Police' | 'Hospital' | 'Weather' | 'IoT Sensor';
  statement: string;
  timestamp?: string;
  credibility?: number;
}

export interface MultiSourceSynthesis {
  sources_analyzed: number;
  agreement: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  conflicting_information?: string;
  unified_assessment: string;
}

export interface CategorizedRisk {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
}

export interface RiskAssessmentBreakdown {
  overall_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  overall_score: number;
  population_risk: CategorizedRisk;
  infrastructure_risk: CategorizedRisk;
  access_risk: CategorizedRisk;
  medical_risk: CategorizedRisk;
  resource_risk: CategorizedRisk;
  weather_risk: CategorizedRisk;
  factor_breakdown: Record<string, number>;
  explanation: string;
}

export interface ActionRecommendation {
  id: string;
  action: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  supporting_evidence: string[];
  related_incident: string;
  recommended_resource: string;
}

export interface DecisionSupportItem {
  action: string;
  expected_benefit: string;
  potential_risk: string;
  required_resources: string[];
  confidence: number;
}

export interface IncidentIntelligenceAnalysis {
  analysis_id: string;
  incident_id: string;
  incident_title: string;
  incident_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  affected_population_estimate: number;
  potential_impacts: string[];
  infrastructure_impacts: string[];
  required_response_teams: string[];
  required_resources: string[];
  recommended_actions: ActionRecommendation[];
  risks: string[];
  uncertainties: string[];
  source_evidence: SourceEvidence[];
  multi_source_synthesis?: MultiSourceSynthesis;
  decision_support: DecisionSupportItem[];
  observed_facts: string[];
  inferred_insights: string[];
  risk_assessment_breakdown?: RiskAssessmentBreakdown;
  provider: string;
  status: string;
  timestamp: string;
}

export interface OperationalIntelligenceOverview {
  overall_risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  active_critical_incidents: number;
  affected_population: number;
  resource_shortages: number;
  situation_summary: string;
  last_analysis_time: string;
  last_analysis_id: string;
  provider_status: string;
  provider_name: string;
}

export interface SituationReport {
  report_id: string;
  generated_at: string;
  target_audiences: string[];
  executive_summary: string;
  current_situation: string;
  critical_incidents: Array<{
    id: string;
    title: string;
    severity: string;
    affected_pop: number;
  }>;
  affected_population_total: number;
  infrastructure_impact_summary: string;
  resource_status_summary: string;
  shelter_status_summary: string;
  major_risks: string[];
  recommended_actions: string[];
  uncertainties: string[];
}

export interface AnalysisHistoryItem {
  analysis_id: string;
  incident_id: string;
  incident_title: string;
  timestamp: string;
  risk: string;
  confidence: number;
  provider: string;
  status: string;
}
