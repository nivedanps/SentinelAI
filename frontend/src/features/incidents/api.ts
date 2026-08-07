import { apiClient } from '../../utils/axiosClient';
import type { Incident, IncidentFilters, IncidentInput, IncidentPage } from './types';

const PAGE_SIZE = 10;

export async function getIncidents(page: number, filters: IncidentFilters): Promise<IncidentPage> {
  const { data } = await apiClient.get<IncidentPage>('/incidents', { params: { page, page_size: PAGE_SIZE, ...filters } });
  return data;
}

export async function getIncident(id: string): Promise<Incident> {
  const { data } = await apiClient.get<Incident>(`/incidents/${id}`);
  return data;
}

export async function createIncident(payload: IncidentInput): Promise<Incident> {
  const { data } = await apiClient.post<Incident>('/incidents', payload);
  return data;
}

export async function updateIncident(id: string, payload: Partial<IncidentInput>): Promise<Incident> {
  const { data } = await apiClient.patch<Incident>(`/incidents/${id}`, payload);
  return data;
}

export async function archiveIncident(id: string): Promise<Incident> {
  const { data } = await apiClient.post<Incident>(`/incidents/${id}/archive`);
  return data;
}

export async function deleteIncident(id: string): Promise<Incident> {
  const { data } = await apiClient.delete<Incident>(`/incidents/${id}`);
  return data;
}

export async function restoreIncident(id: string): Promise<Incident> {
  const { data } = await apiClient.post<Incident>(`/incidents/${id}/restore`);
  return data;
}
