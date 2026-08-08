import { apiClient } from '../../../utils/axiosClient';
import {
  EmergencyResource,
  ResourceActivityItem,
  ResourceAllocationItem,
  ResourceOverviewMetrics,
  ResourceRecommendation,
  ResourceShortageItem,
} from '../types/resource.types';
import {
  getDerivedResourceMetrics,
  mockAgencyDistribution,
  mockEmergencyResources,
  mockResourceActivities,
  mockResourceAllocations,
  mockResourceShortages,
} from '../data/resourceMockData';

// Haversine distance calculator for deterministic proximity ranking
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// In-memory state for client operations during session
let localResources: EmergencyResource[] = [...mockEmergencyResources];
let localActivities: ResourceActivityItem[] = [...mockResourceActivities];

export async function fetchResources(params?: {
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  agency?: string;
  location?: string;
  availability?: string;
}): Promise<EmergencyResource[]> {
  try {
    const { data } = await apiClient.get('/resources', { params });
    if (data && Array.isArray(data.resources) && data.resources.length > 0) {
      return data.resources;
    }
  } catch {
    // Fall back to local in-memory dataset
  }

  let result = [...localResources];

  if (params?.search) {
    const s = params.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.resource_id.toLowerCase().includes(s) ||
        r.organization_agency.toLowerCase().includes(s) ||
        r.location_name.toLowerCase().includes(s) ||
        r.type.toLowerCase().includes(s)
    );
  }

  if (params?.category && params.category !== 'all') {
    result = result.filter((r) => r.category === params.category);
  }

  if (params?.status && params.status !== 'all') {
    result = result.filter((r) => r.status === params.status);
  }

  if (params?.agency && params.agency !== 'all') {
    result = result.filter((r) => r.organization_agency === params.agency);
  }

  if (params?.availability === 'available_only') {
    result = result.filter((r) => r.status === 'AVAILABLE');
  }

  return result;
}

export async function fetchResource(id: string): Promise<EmergencyResource> {
  try {
    const { data } = await apiClient.get<EmergencyResource>(`/resources/${id}`);
    return data;
  } catch {
    const found = localResources.find((r) => r.id === id || r.resource_id === id);
    if (found) return found;
    throw new Error(`Resource ${id} not found`);
  }
}

export async function createResource(
  payload: Omit<EmergencyResource, 'id' | 'updated_at'>
): Promise<EmergencyResource> {
  const newResource: EmergencyResource = {
    ...payload,
    id: `res-${Date.now()}`,
    updated_at: new Date().toISOString(),
  };

  try {
    await apiClient.post('/resources', payload);
  } catch {
    // Fallback to local push
  }

  localResources = [newResource, ...localResources];
  localActivities = [
    {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resourceId: newResource.resource_id,
      resourceName: newResource.name,
      action: 'created',
      details: `Registered new ${newResource.type} under ${newResource.organization_agency}.`,
    },
    ...localActivities,
  ];

  return newResource;
}

export async function updateResource(
  id: string,
  payload: Partial<EmergencyResource>
): Promise<EmergencyResource> {
  try {
    await apiClient.patch(`/resources/${id}`, payload);
  } catch {
    // Fallback
  }

  localResources = localResources.map((r) =>
    r.id === id || r.resource_id === id
      ? { ...r, ...payload, updated_at: new Date().toISOString() }
      : r
  );

  const updated = localResources.find((r) => r.id === id || r.resource_id === id)!;
  return updated;
}

export async function deleteResource(id: string): Promise<void> {
  try {
    await apiClient.delete(`/resources/${id}`);
  } catch {
    // Fallback
  }
  localResources = localResources.filter((r) => r.id !== id && r.resource_id !== id);
}

export async function assignResourceToIncident(
  resourceId: string,
  incidentId: string,
  incidentTitle: string
): Promise<EmergencyResource> {
  try {
    await apiClient.post('/resources/dispatch', { resource_id: resourceId, incident_id: incidentId });
  } catch {
    // Fallback
  }

  localResources = localResources.map((r) => {
    if (r.id === resourceId || r.resource_id === resourceId) {
      return {
        ...r,
        status: 'DEPLOYED',
        assigned_incident_id: incidentId,
        assigned_incident_title: incidentTitle,
        updated_at: new Date().toISOString(),
      };
    }
    return r;
  });

  const updated = localResources.find((r) => r.id === resourceId || r.resource_id === resourceId)!;

  localActivities = [
    {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resourceId: updated.resource_id,
      resourceName: updated.name,
      action: 'deployed',
      incidentId,
      incidentTitle,
      details: `Assigned and dispatched to ${incidentTitle}. Status set to DEPLOYED.`,
    },
    ...localActivities,
  ];

  return updated;
}

export async function releaseResourceFromIncident(resourceId: string): Promise<EmergencyResource> {
  localResources = localResources.map((r) => {
    if (r.id === resourceId || r.resource_id === resourceId) {
      return {
        ...r,
        status: 'AVAILABLE',
        assigned_incident_id: null,
        assigned_incident_title: null,
        assigned_team: null,
        updated_at: new Date().toISOString(),
      };
    }
    return r;
  });

  const updated = localResources.find((r) => r.id === resourceId || r.resource_id === resourceId)!;

  localActivities = [
    {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resourceId: updated.resource_id,
      resourceName: updated.name,
      action: 'released',
      details: `Released from deployment. Status updated to AVAILABLE.`,
    },
    ...localActivities,
  ];

  return updated;
}

// Deterministic Smart Resource Recommendation Engine
export function getRecommendedResourcesForIncident(
  incidentLat: number,
  incidentLng: number,
  disasterType: string,
  severity: string
): ResourceRecommendation[] {
  const availableResources = localResources.filter((r) => r.status === 'AVAILABLE');

  return availableResources
    .map((resource) => {
      const distance = calculateHaversineDistance(
        incidentLat,
        incidentLng,
        resource.latitude,
        resource.longitude
      );

      let reason = 'Nearby available emergency unit.';
      let priority = resource.priority;

      const typeLower = disasterType.toLowerCase();
      const catLower = resource.category.toLowerCase();
      const resTypeLower = resource.type.toLowerCase();

      if (typeLower.includes('flood')) {
        if (resTypeLower.includes('boat')) {
          reason = 'Nearest available rescue boat for flood water evacuations.';
          priority = 'CRITICAL';
        } else if (resTypeLower.includes('ambulance')) {
          reason = 'Rapid medical transport staged near flood evacuation zone.';
        }
      } else if (typeLower.includes('fire')) {
        if (resTypeLower.includes('fire')) {
          reason = 'High-capacity fire suppression tender for hazard containment.';
          priority = 'CRITICAL';
        }
      } else if (typeLower.includes('landslide') || typeLower.includes('road')) {
        if (resTypeLower.includes('machinery') || resTypeLower.includes('excavator')) {
          reason = 'Heavy excavation unit for clearing mudslides and debris.';
          priority = 'HIGH';
        }
      }

      return {
        resource: { ...resource, distance_km: distance },
        reason,
        priority,
        distance_km: distance,
        availability: resource.status,
      };
    })
    .sort((a, b) => a.distance_km - b.distance_km);
}

export async function fetchResourceOverviewMetrics(): Promise<ResourceOverviewMetrics> {
  return getDerivedResourceMetrics(localResources);
}

export async function fetchAgencyDistribution() {
  return mockAgencyDistribution;
}

export async function fetchResourceShortages(): Promise<ResourceShortageItem[]> {
  return mockResourceShortages;
}

export async function fetchResourceAllocations(): Promise<ResourceAllocationItem[]> {
  return mockResourceAllocations;
}

export async function fetchResourceActivities(): Promise<ResourceActivityItem[]> {
  return localActivities;
}
