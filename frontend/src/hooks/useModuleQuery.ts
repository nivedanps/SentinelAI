import { useQuery } from '@tanstack/react-query';
import { fetchModuleStatus } from '../services/apiService';

export function useModuleQuery(moduleName: string) {
  return useQuery({
    queryKey: ['module-status', moduleName],
    queryFn: () => fetchModuleStatus(moduleName),
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
