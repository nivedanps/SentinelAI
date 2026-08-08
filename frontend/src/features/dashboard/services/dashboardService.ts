import { apiClient } from '../../../utils/axiosClient';
import {
  AISituationIntelligenceData,
  DashboardOverview,
  MapMarkerData,
} from '../types/dashboard.types';
import {
  mockAISituationIntelligence,
  mockDashboardOverview,
  mockMapMarkers,
} from '../data/dashboardMockData';

export async function getDashboardOverview(): Promise<DashboardOverview> {
  try {
    const response = await apiClient.get<DashboardOverview>('/dashboard/overview');
    return response.data;
  } catch {
    // Graceful fallback to centralized DEMO operational command center mock data
    return mockDashboardOverview;
  }
}

export async function getOperationalMapData(): Promise<MapMarkerData[]> {
  try {
    const response = await apiClient.get<MapMarkerData[]>('/dashboard/map');
    return response.data;
  } catch {
    return mockMapMarkers;
  }
}

export async function getSituationIntelligence(): Promise<AISituationIntelligenceData> {
  try {
    const response = await apiClient.get<any>('/intelligence/operational-overview');
    const data = response.data;
    return {
      summary: data.situation_summary || mockAISituationIntelligence.summary,
      riskLevel: data.overall_risk || 'HIGH',
      confidence: Math.round((data.confidence || 0.92) * 100),
      immediatePriorities: [
        'Deploy rescue boats to Flood Zone A',
        'Prepare Shelter S-04 for evacuation',
        'Maintain three ambulances in reserve',
      ],
      lastGenerated: data.last_analysis_time || 'Just now',
    };
  } catch {
    return mockAISituationIntelligence;
  }
}

export async function generateSituationReport(): Promise<AISituationIntelligenceData> {
  try {
    const response = await apiClient.post<any>('/intelligence/situation/report');
    const data = response.data;
    return {
      summary: data.executive_summary || mockAISituationIntelligence.summary,
      riskLevel: 'HIGH',
      confidence: 94,
      immediatePriorities: data.recommended_actions || mockAISituationIntelligence.immediatePriorities,
      lastGenerated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch {
    return {
      ...mockAISituationIntelligence,
      lastGenerated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
