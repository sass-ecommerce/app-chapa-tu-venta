import { API_CONFIG } from '@/shared/config/fetch';
import type {
  ApiResponse,
  VerifyEmailPayload,
  ResendVerificationPayload,
} from '../types';

/**
 * Email Verification API
 * Handles email verification and resend verification code
 */

/**
 * Verify email with OTP code
 */
async function verifyEmail(payload: VerifyEmailPayload): Promise<ApiResponse<{}>> {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al verificar email');
  }

  const data = await response.json();
  console.log('✅ [AuthAPI] Email verified successfully');
  return data;
}

/**
 * Resend verification code
 */
async function resendVerification(
  payload: ResendVerificationPayload
): Promise<ApiResponse<{ sessionId: string }>> {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al reenviar código');
  }

  const data = await response.json();
  console.log('✅ [AuthAPI] Verification code resent');
  return data;
}

export const verificationApi = {
  verifyEmail,
  resendVerification,
};
