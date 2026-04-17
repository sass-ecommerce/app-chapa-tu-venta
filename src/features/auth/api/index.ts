import { apiFetch } from '@/shared/config/fetch';
import type { RegisterPayload } from '../types';

export async function registerUser(data: RegisterPayload): Promise<{ userSub: string }> {
  return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export async function confirmRegistration(email: string, code: string): Promise<void> {
  await apiFetch('/auth/confirm-registration', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function resendCode(email: string): Promise<void> {
  await apiFetch('/auth/resend-code', { method: 'POST', body: JSON.stringify({ email }) });
}
