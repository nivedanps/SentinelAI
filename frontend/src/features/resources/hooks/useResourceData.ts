import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  assignResourceToIncident,
  createResource,
  deleteResource,
  fetchAgencyDistribution,
  fetchResource,
  fetchResourceActivities,
  fetchResourceAllocations,
  fetchResourceOverviewMetrics,
  fetchResources,
  fetchResourceShortages,
  releaseResourceFromIncident,
  updateResource,
} from '../api/resourceApi';
import { EmergencyResource } from '../types/resource.types';

const RESOURCE_KEY = ['resources'];

export function useResources(params?: {
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  agency?: string;
  location?: string;
  availability?: string;
}) {
  return useQuery({
    queryKey: [...RESOURCE_KEY, 'list', params],
    queryFn: () => fetchResources(params),
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: [...RESOURCE_KEY, 'detail', id],
    queryFn: () => fetchResource(id),
    enabled: Boolean(id),
  });
}

export function useResourceMetrics() {
  return useQuery({
    queryKey: [...RESOURCE_KEY, 'metrics'],
    queryFn: fetchResourceOverviewMetrics,
  });
}

export function useAgencyDistribution() {
  return useQuery({
    queryKey: [...RESOURCE_KEY, 'agency_distribution'],
    queryFn: fetchAgencyDistribution,
  });
}

export function useResourceShortages() {
  return useQuery({
    queryKey: [...RESOURCE_KEY, 'shortages'],
    queryFn: fetchResourceShortages,
  });
}

export function useResourceAllocations() {
  return useQuery({
    queryKey: [...RESOURCE_KEY, 'allocations'],
    queryFn: fetchResourceAllocations,
  });
}

export function useResourceActivities() {
  return useQuery({
    queryKey: [...RESOURCE_KEY, 'activities'],
    queryFn: fetchResourceActivities,
  });
}

export function useResourceMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: RESOURCE_KEY });
  };

  return {
    create: useMutation({
      mutationFn: createResource,
      onSuccess: invalidateAll,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<EmergencyResource> }) =>
        updateResource(id, payload),
      onSuccess: invalidateAll,
    }),
    remove: useMutation({
      mutationFn: deleteResource,
      onSuccess: invalidateAll,
    }),
    assign: useMutation({
      mutationFn: ({
        resourceId,
        incidentId,
        incidentTitle,
      }: {
        resourceId: string;
        incidentId: string;
        incidentTitle: string;
      }) => assignResourceToIncident(resourceId, incidentId, incidentTitle),
      onSuccess: invalidateAll,
    }),
    release: useMutation({
      mutationFn: (resourceId: string) => releaseResourceFromIncident(resourceId),
      onSuccess: invalidateAll,
    }),
  };
}
