import { apiClient } from '@/shared/config/api';
import type { ApiResponse } from '@/src/shared/interfaces/api-response';

export interface CreateTenantPayload {
  name: string;
  domain: string;
}

export interface CreateTenantResponse {
  id: string;
  name: string;
  domain: string;
}

export async function createTenant(data: CreateTenantPayload): Promise<CreateTenantResponse> {
  const { data: result } = await apiClient.post<ApiResponse<CreateTenantResponse>>(
    '/tenants',
    data
  );
  return result.data;
}
