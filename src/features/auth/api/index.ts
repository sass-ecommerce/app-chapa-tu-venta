import { apiClient } from '@/shared/config/api';
import type { ApiResponse } from '@/src/shared/interfaces/api-response';
import type { LoginPayload, LoginResponse, RegisterPayload } from '../types';

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

export async function loginUser(data: LoginPayload): Promise<LoginResponse> {
  const { data: result } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return result.data;
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
}

export async function resetPasswordRequest(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  await apiClient.post<ApiResponse>('/auth/reset-password', { email, code, newPassword });
}

export interface OnboardingStatus {
  createTenant: {
    completed: boolean;
    tenant: unknown | null;
  };
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const { data: result } = await apiClient.get<ApiResponse<OnboardingStatus>>(
    '/tenants/onboarding'
  );
  return result.data;
}
