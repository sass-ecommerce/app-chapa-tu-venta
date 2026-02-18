import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { passwordApi } from '../api/password';

/**
 * ========================================
 * PASSWORD RESET MUTATIONS
 * ========================================
 */

/**
 * Forgot password mutation
 */
export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      console.log('🔑 [Auth] Requesting password reset...');
      const response = await passwordApi.forgotPassword({ email });
      console.log('✅ [Auth] Password reset code sent');
      return response.data;
    },
    onError: (error: Error) => {
      console.error('❌ [Auth] Failed to request password reset:', error);
      Alert.alert('Error', error.message || 'Error al solicitar código de reset');
    },
  });
}

/**
 * Reset password mutation
 */
export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async ({
      sessionId,
      code,
      newPassword,
    }: {
      sessionId: string;
      code: string;
      newPassword: string;
    }) => {
      console.log('🔑 [Auth] Resetting password...');
      await passwordApi.resetPassword({ sessionId, code, newPassword });
      console.log('✅ [Auth] Password reset successful');
    },
    onError: (error: Error) => {
      console.error('❌ [Auth] Failed to reset password:', error);
      Alert.alert('Error', error.message || 'Error al resetear contraseña');
    },
  });
}
