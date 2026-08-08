import { DisasterType, Severity, IncidentStatus } from '../../incidents/types';

export type MapMarkerCategory = 'incident' | 'hospital' | 'fire_station' | 'police' | 'shelter' | 'resource';

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  status: 'critical' | 'high' | 'warning' | 'normal' | 'info';
  icon: string;
}

export interface MapMarkerData {
  id: string;
  title: string;
  category: MapMarkerCategory;
  latitude: number;
  longitude: number;
  disasterType?: DisasterType;
  severity?: Severity;
  status?: IncidentStatus | string;
  affectedPopulation?: number;
  timestamp?: string;
  capacity?: string;
  occupied?: string;
  details?: string;
  incidentId?: string;
}

export interface AISituationIntelligenceData {
  summary: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
  immediatePriorities: string[];
  lastGenerated: string;
}

export interface ResourceReadinessItem {
  id: string;
  name: string;
  available: number;
  total: number;
  status: 'available' | 'limited' | 'critical';
}

export interface ShelterOperationItem {
  id: string;
  code: string;
  name: string;
  location: string;
  capacity: number;
  occupied: number;
  isHighCapacity: boolean;
}

export interface CriticalAlertItem {
  id: string;
  severity: Severity;
  title: string;
  location: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ResponseActivityItem {
  id: string;
  timestamp: string;
  description: string;
  type: 'dispatch' | 'shelter' | 'assignment' | 'verification' | 'alert';
}

export interface IncidentTrendPoint {
  time: string;
  incidents: number;
  critical: number;
}

export interface SeverityDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface ResourceUtilizationItem {
  category: string;
  available: number;
  deployed: number;
  unavailable: number;
}

export interface DashboardOverview {
  systemStatus: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  networkStatusMessage: string;
  lastUpdated: string;
  metrics: DashboardMetric[];
  resourceReadiness: ResourceReadinessItem[];
  shelterOverview: {
    activeShelters: number;
    totalCapacity: number;
    occupied: number;
    available: number;
    utilizationPercentage: number;
    shelters: ShelterOperationItem[];
  };
  alerts: CriticalAlertItem[];
  activities: ResponseActivityItem[];
  analytics: {
    incidentTrend: IncidentTrendPoint[];
    severityDistribution: SeverityDistributionItem[];
    resourceUtilization: ResourceUtilizationItem[];
  };
}
