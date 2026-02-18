import { API_CONFIG } from '@/shared/config/fetch';
import type {
  ApiResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '../types';

/**
 * Password Reset API
 * Handles forgot password and reset password operations
 */

/**
 * Forgot password - Request reset code
 */
async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ApiResponse<{ sessionId: string }>> {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al solicitar código de reset');
  }

  const data = await response.json();
  console.log('✅ [AuthAPI] Password reset code sent');
  return data;
}

/**
 * Reset password with code
 */
async function resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<{}>> {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al resetear contraseña');
  }

  const data = await response.json();
  console.log('✅ [AuthAPI] Password reset successfully');
  return data;
}

export const passwordApi = {
  forgotPassword,
  resetPassword,
};
