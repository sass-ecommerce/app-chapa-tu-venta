import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { verificationApi } from '@/features/auth/api/verification';

/**
 * ========================================
 * EMAIL VERIFICATION MUTATIONS
 * ========================================
 */

/**
 * Verify email mutation
 */
export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async ({ sessionId, code }: { sessionId: string; code: string }) => {
      console.log('📧 [Auth] Verifying email...');
      await verificationApi.verifyEmail({ sessionId, code });
      console.log('✅ [Auth] Email verified successfully');
    },
    onError: (error: Error) => {
      console.error('❌ [Auth] Email verification failed:', error);
      Alert.alert('Error', error.message || 'Error al verificar email');
    },
  });
}

/**
 * Resend verification mutation
 */
export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      console.log('📧 [Auth] Resending verification code...');
      const response = await verificationApi.resendVerification({ sessionId });
      console.log('✅ [Auth] Verification code resent');
      return response.data;
    },
    onError: (error: Error) => {
      console.error('❌ [Auth] Failed to resend verification code:', error);
      Alert.alert('Error', error.message || 'Error al reenviar código');
    },
  });
}
