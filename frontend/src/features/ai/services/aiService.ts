import { apiClient } from '../../../utils/axiosClient';
import {
  IncidentIntelligenceAnalysis,
  OperationalIntelligenceOverview,
  SituationReport,
  AnalysisHistoryItem,
} from '../types/ai.types';

export const mockOperationalOverview: OperationalIntelligenceOverview = {
  overall_risk: 'HIGH',
  confidence: 0.92,
  active_critical_incidents: 5,
  affected_population: 12480,
  resource_shortages: 3,
  situation_summary:
    'Heavy rainfall is increasing flood risk across the eastern response zone. Three critical incidents are active, including flooding near Mysuru and road disruption near Mandya. Two rescue corridors have reduced accessibility. Current medical capacity remains adequate, but rescue boat availability is below projected demand.',
  last_analysis_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  last_analysis_id: 'ANL-109482',
  provider_status: 'DEMO INTELLIGENCE',
  provider_name: 'Demonstration Engine',
};

export const mockMysuruAnalysis: IncidentIntelligenceAnalysis = {
  analysis_id: 'ANL-109482',
  incident_id: 'INC-1042',
  incident_title: 'Flood near Mysuru',
  incident_type: 'FLOOD',
  severity: 'CRITICAL',
  urgency: 'CRITICAL',
  confidence: 0.96,
  affected_population_estimate: 3200,
  potential_impacts: [
    'Submergence of 4 low-lying agricultural residential clusters',
    'Isolation of 320 families in Nanjangud sector',
    'Water contamination risk in local pumping station',
  ],
  infrastructure_impacts: [
    'Mysuru-Mandya highway bridge access restricted',
    'Substation 3 shutdown due to water ingress',
  ],
  required_response_teams: ['NDRF Rescue Unit', 'State Fire & Emergency Services', 'Medical Triage Team'],
  required_resources: ['2 Rescue Inflatable Boats', '1 Mobile Water Filter', '3 Ambulances'],
  observed_facts: [
    'Citizen report: Water level reached 4 feet on main arterial road.',
    'Police report: Bridge traffic closed; state highway diverted.',
    'Hospital report: 12 flood-related trauma injuries admitted.',
    'Weather report: 82mm torrential rainfall logged in past 6 hours.',
  ],
  inferred_insights: [
    'Kaveri river basin overflow rate accelerating by 12 cm/hr.',
    'Secondary access via bypass road will become impassable within 2 hours if rain persists.',
  ],
  risks: [
    'Stranded elderly residents in low-lying sector B',
    'Inflatable boat shortage across district reserve',
  ],
  uncertainties: ['Exact water release rate from upstream Kabini dam.'],
  source_evidence: [
    { source_type: 'Citizen', statement: 'Water has reached the main road near the river.', timestamp: '14:30', credibility: 0.92 },
    { source_type: 'Police', statement: 'Bridge access restricted due to flooding.', timestamp: '14:45', credibility: 0.98 },
    { source_type: 'Hospital', statement: '12 flood-related injuries reported in district hospital.', timestamp: '15:00', credibility: 0.96 },
    { source_type: 'Weather', statement: 'Heavy rainfall continuing across response zone.', timestamp: '15:10', credibility: 0.95 },
  ],
  multi_source_synthesis: {
    sources_analyzed: 4,
    agreement: 'HIGH',
    confidence: 0.94,
    conflicting_information: 'None',
    unified_assessment:
      'Independent citizen, police, hospital and weather observations support a high-confidence flood event requiring immediate watercraft deployment.',
  },
  recommended_actions: [
    {
      id: 'ACT-201',
      action: 'Deploy 2 Rescue Boats to Flood Zone A (Mysuru Sector)',
      priority: 'CRITICAL',
      reason: 'Flood severity is critical, affected population exceeds 3,000, and two access roads are restricted.',
      supporting_evidence: ['Incident report', 'Population estimate', 'Road restriction'],
      related_incident: 'Flood near Mysuru',
      recommended_resource: '2 Rescue Inflatable Boats',
    },
    {
      id: 'ACT-202',
      action: 'Prepare Shelter S-04 for additional evacuation capacity',
      priority: 'HIGH',
      reason: 'Nearby shelter capacity available; secondary low-lying zone inundation imminent.',
      supporting_evidence: ['Rainfall trend', 'Submergence forecast'],
      related_incident: 'Flood near Mysuru',
      recommended_resource: 'Shelter S-04 Staff',
    },
    {
      id: 'ACT-203',
      action: 'Maintain three ambulances in reserve at Mysuru General Hospital',
      priority: 'HIGH',
      reason: 'Hospital report indicates rising casualty admissions.',
      supporting_evidence: ['Hospital triage logs'],
      related_incident: 'Flood near Mysuru',
      recommended_resource: '3 ALS Ambulances',
    },
    {
      id: 'ACT-204',
      action: 'Monitor rising water levels via IoT gauge',
      priority: 'MEDIUM',
      reason: 'Provide early warning for downstream Mandya corridor.',
      supporting_evidence: ['Weather telemetry'],
      related_incident: 'Flood near Mysuru',
      recommended_resource: 'Telemetry Sensor Network',
    },
  ],
  decision_support: [
    {
      action: 'Deploy 2 Rescue Boats',
      expected_benefit: 'Improves evacuation capacity in flooded areas and rescues isolated residents.',
      potential_risk: '2 boats unavailable for secondary incidents in Mandya.',
      required_resources: ['2 Rescue Boats', 'NDRF Crew'],
      confidence: 0.91,
    },
    {
      action: 'Open Shelter S-04 Evacuation Wing',
      expected_benefit: 'Houses up to 500 displaced persons with clean water & bedding.',
      potential_risk: 'Requires pulling 4 volunteers from central warehouse.',
      required_resources: ['Shelter S-04', 'Volunteers'],
      confidence: 0.89,
    },
  ],
  risk_assessment_breakdown: {
    overall_level: 'CRITICAL',
    overall_score: 88.5,
    population_risk: { level: 'HIGH', explanation: '3,200 people inside direct inundation zone.' },
    infrastructure_risk: { level: 'HIGH', explanation: 'State highway bridge & substation offline.' },
    access_risk: { level: 'HIGH', explanation: 'Two major access corridors restricted.' },
    medical_risk: { level: 'MEDIUM', explanation: 'Hospital capacity adequate; 12 injuries treated.' },
    resource_risk: { level: 'HIGH', explanation: 'Rescue inflatable boat availability below demand.' },
    weather_risk: { level: 'HIGH', explanation: 'Torrential 82mm rainfall logging over basin.' },
    factor_breakdown: {
      severity_factor: 28.0,
      population_factor: 22.5,
      infrastructure_factor: 20.0,
      access_factor: 15.0,
      resource_shortage_factor: 5.0,
    },
    explanation:
      'Population factor: 22.5, Severity factor: 28.0, Infrastructure factor: 20.0, Access factor: 15.0, Resource shortage: 5.0. Total Score: 88.5/100 (CRITICAL).',
  },
  provider: 'Mock Engine',
  status: 'DEMO INTELLIGENCE',
  timestamp: new Date().toISOString(),
};

export async function fetchOperationalOverview(): Promise<OperationalIntelligenceOverview> {
  try {
    const { data } = await apiClient.get<OperationalIntelligenceOverview>(
      '/intelligence/operational-overview'
    );
    return data;
  } catch {
    return mockOperationalOverview;
  }
}

export async function analyzeIncident(
  incidentId: string,
  payload?: any
): Promise<IncidentIntelligenceAnalysis> {
  try {
    const { data } = await apiClient.post<IncidentIntelligenceAnalysis>(
      `/intelligence/incidents/${incidentId}/analyze`,
      payload
    );
    return data;
  } catch {
    return {
      ...mockMysuruAnalysis,
      incident_id: incidentId,
      analysis_id: `ANL-${Date.now()}`,
    };
  }
}

export async function generateSituationReport(): Promise<SituationReport> {
  try {
    const { data } = await apiClient.post<SituationReport>('/intelligence/situation/report');
    return data;
  } catch {
    return {
      report_id: `SITREP-${Math.floor(Date.now() / 1000)}`,
      generated_at: new Date().toISOString(),
      target_audiences: [
        'District Disaster Management Officer',
        'Emergency Operations Center',
        'Incident Commander',
      ],
      executive_summary:
        'Monsoon surge over Southern Karnataka has triggered widespread flooding in Mysuru district, road closures along the Mandya transport corridor, and landslide warnings in Kodagu.',
      current_situation:
        '5 active critical incidents under response coordination. Kaveri river gauge indicates water level 1.8m above flood stage. 12,480 citizens estimated inside affected perimeters.',
      critical_incidents: [
        { id: 'INC-1042', title: 'Flood near Mysuru', severity: 'CRITICAL', affected_pop: 3200 },
        { id: 'INC-1041', title: 'Industrial fire — Bengaluru', severity: 'CRITICAL', affected_pop: 4500 },
        { id: 'INC-1040', title: 'Road disruption — Mandya', severity: 'HIGH', affected_pop: 1800 },
        { id: 'INC-1039', title: 'Landslide risk — Kodagu', severity: 'HIGH', affected_pop: 2980 },
      ],
      affected_population_total: 12480,
      infrastructure_impact_summary:
        'Mysuru-Mandya highway bridge access restricted. Substation 3 offline. Bengaluru outer ring road ramp blocked.',
      resource_status_summary:
        'Rescue inflatable boats critically low (2 available / 5 required). Medical ambulances adequate.',
      shelter_status_summary:
        'Shelter S-04 operating at 65% capacity. Shelter S-02 prepped for incoming evacuees.',
      major_risks: [
        'River overflow rate increasing by 12cm/hr',
        'Rescue boat deficit in flooded sector A',
        'Airborne smoke hazard downwind from Bengaluru fire',
      ],
      recommended_actions: [
        'Deploy 2 rescue boats to Flood Zone A (Mysuru Sector)',
        'Prepare Shelter S-04 for additional evacuation',
        'Maintain 3 ambulances in reserve at Mysuru General Hospital',
        'Issue public traffic diversion notice for Mandya highway corridor',
      ],
      uncertainties: [
        'Upstream dam discharge volumes over next 12-hour forecast window',
        'Chemical inventory details at industrial warehouse fire site',
      ],
    };
  }
}

export async function fetchAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
  try {
    const { data } = await apiClient.get<AnalysisHistoryItem[]>('/intelligence/analyses');
    return data;
  } catch {
    return [
      {
        analysis_id: 'ANL-109482',
        incident_id: 'INC-1042',
        incident_title: 'Flood near Mysuru',
        timestamp: '14:30 Today',
        risk: 'CRITICAL',
        confidence: 0.96,
        provider: 'Mock Engine',
        status: 'DEMO INTELLIGENCE',
      },
      {
        analysis_id: 'ANL-109481',
        incident_id: 'INC-1041',
        incident_title: 'Industrial fire — Bengaluru',
        timestamp: '13:15 Today',
        risk: 'CRITICAL',
        confidence: 0.91,
        provider: 'Mock Engine',
        status: 'DEMO INTELLIGENCE',
      },
    ];
  }
}
