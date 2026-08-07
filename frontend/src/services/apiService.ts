import { apiClient } from '../utils/axiosClient';

export async function fetchModuleStatus(moduleEndpoint: string) {
  const response = await apiClient.get(`/${moduleEndpoint}`);
  return response.data;
}
