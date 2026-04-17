import { apiClient } from '@/shared/config/api';
import type { ApiResponse } from '@/src/shared/interfaces/api-response';
import type { RegisterPayload } from '../types';

export async function registerUser(data: RegisterPayload): Promise<{ userSub: string }> {
  const { data: result } = await apiClient.post<ApiResponse<{ userSub: string }>>(
    '/auth/register',
    data
  );
  return result.data;
}

export async function confirmRegistration(email: string, code: string): Promise<void> {
  await apiClient.post<ApiResponse>('/auth/confirm-registration', { email, code });
}

export async function resendCode(email: string): Promise<void> {
  return apiClient.post('/auth/resend-code', { email });
}
