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
    const response = await apiClient.get<AISituationIntelligenceData>('/dashboard/situation');
    return response.data;
  } catch {
    return mockAISituationIntelligence;
  }
}

export async function generateSituationReport(): Promise<AISituationIntelligenceData> {
  // Clean service interface for AI generation simulation
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    ...mockAISituationIntelligence,
    lastGenerated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
