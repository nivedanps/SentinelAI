import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  generateSituationReport,
  getDashboardOverview,
  getOperationalMapData,
  getSituationIntelligence,
} from '../services/dashboardService';
import { CriticalAlertItem } from '../types/dashboard.types';

const DASHBOARD_KEY = ['dashboard'];

export function useDashboardOverview() {
  return useQuery({
    queryKey: [...DASHBOARD_KEY, 'overview'],
    queryFn: getDashboardOverview,
    staleTime: 30000,
  });
}

export function useOperationalMapData() {
  return useQuery({
    queryKey: [...DASHBOARD_KEY, 'map'],
    queryFn: getOperationalMapData,
    staleTime: 30000,
  });
}

export function useSituationIntelligence() {
  return useQuery({
    queryKey: [...DASHBOARD_KEY, 'situation'],
    queryFn: getSituationIntelligence,
    staleTime: 30000,
  });
}

export function useDashboardAlerts(initialAlerts: CriticalAlertItem[] = []) {
  const [alerts, setAlerts] = useState<CriticalAlertItem[]>(initialAlerts);

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert))
    );
  };

  return {
    alerts,
    setAlerts,
    acknowledgeAlert,
  };
}

export function useGenerateSituationReportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateSituationReport,
    onSuccess: (newData) => {
      queryClient.setQueryData([...DASHBOARD_KEY, 'situation'], newData);
    },
  });
}
