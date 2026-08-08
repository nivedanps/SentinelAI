export type ResourceCategory =
  | 'Emergency Vehicles'
  | 'Rescue Equipment'
  | 'Personnel'
  | 'Supplies';

export type ResourceStatus =
  | 'AVAILABLE'
  | 'DEPLOYED'
  | 'RESERVED'
  | 'MAINTENANCE'
  | 'UNAVAILABLE'
  | 'LOST';

export type ResourcePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EmergencyResource {
  id: string;
  resource_id: string;
  name: string;
  category: ResourceCategory;
  type: string;
  organization_agency: string;
  status: ResourceStatus;
  priority: ResourcePriority;
  latitude: number;
  longitude: number;
  location_name: string;
  capacity?: string;
  contact?: string;
  assigned_incident_id?: string | null;
  assigned_incident_title?: string | null;
  assigned_team?: string | null;
  updated_at: string;
  notes?: string;
  distance_km?: number;
}

export interface ResourceOverviewMetrics {
  total: number;
  available: number;
  deployed: number;
  reserved: number;
  maintenance: number;
  unavailable: number;
  criticalShortages: number;
  deploymentPercentage: number;
}

export interface ResourceRecommendation {
  resource: EmergencyResource;
  reason: string;
  priority: ResourcePriority;
  distance_km: number;
  availability: ResourceStatus;
}

export interface ResourceShortageItem {
  id: string;
  incidentId: string;
  incidentTitle: string;
  disasterType: string;
  location: string;
  resourceCategory: string;
  required: number;
  available: number;
  shortage: number;
  priority: ResourcePriority;
  recommendedAction: string;
}

export interface ResourceCategoryDemand {
  category: string;
  required: number;
  available: number;
  missing: number;
}

export interface ResourceAllocationItem {
  incidentId: string;
  incidentTitle: string;
  disasterType: string;
  severity: string;
  affectedPopulation: number;
  location: string;
  demands: ResourceCategoryDemand[];
  assignedResourceIds: string[];
}

export interface AgencyDistributionItem {
  agency: string;
  total: number;
  available: number;
  deployed: number;
  other: number;
}

export interface ResourceActivityItem {
  id: string;
  timestamp: string;
  resourceId: string;
  resourceName: string;
  action: 'deployed' | 'assigned' | 'released' | 'maintenance' | 'created' | 'updated';
  incidentId?: string;
  incidentTitle?: string;
  details: string;
}
