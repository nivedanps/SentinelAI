import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { archiveIncident, createIncident, deleteIncident, getIncident, getIncidents, restoreIncident, updateIncident } from './api';
import type { IncidentFilters, IncidentInput } from './types';

const key = ['incidents'];

export const useIncidents = (page: number, filters: IncidentFilters) => useQuery({ queryKey: [...key, page, filters], queryFn: () => getIncidents(page, filters) });
export const useIncident = (id: string) => useQuery({ queryKey: [...key, id], queryFn: () => getIncident(id), enabled: Boolean(id) });

export function useIncidentMutations() {
  const client = useQueryClient();
  const invalidate = () => client.invalidateQueries({ queryKey: key });
  return {
    create: useMutation({ mutationFn: createIncident, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<IncidentInput> }) => updateIncident(id, payload), onSuccess: invalidate }),
    archive: useMutation({ mutationFn: archiveIncident, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteIncident, onSuccess: invalidate }),
    restore: useMutation({ mutationFn: restoreIncident, onSuccess: invalidate }),
  };
}
