import { useQueryClient } from '@tanstack/react-query';

import {
  useUserQuery,
  useTempCredentialsQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useSaveTempCredentialsMutation,
  useClearTempCredentialsMutation,
  getAuthToken,
  invalidateUser,
} from '@/features/auth/queries';

/**
 * Hook para acceder a funciones de autenticación
 * Ahora implementado con TanStack Query en lugar de React Context
 */
export function useAuth() {
  const userQuery = useUserQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();
  const verifyEmailMutation = useVerifyEmailMutation();
  const resendVerificationMutation = useResendVerificationMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const saveTempCredentialsMutation = useSaveTempCredentialsMutation();
  const clearTempCredentialsMutation = useClearTempCredentialsMutation();
  const tempCredentialsQuery = useTempCredentialsQuery();

  return {
    // Estado
    isAuthenticated: !!userQuery.data,
    isLoading: userQuery.isLoading,
    isSignedIn: !!userQuery.data, // Alias para compatibilidad
    isLoaded: !userQuery.isLoading, // Alias para compatibilidad

    // Métodos de autenticación
    login: async (email: string, password: string) => {
      return loginMutation.mutateAsync({ email, password });
    },
    logout: async () => {
      return logoutMutation.mutateAsync();
    },
    signOut: async () => {
      return logoutMutation.mutateAsync();
    }, // Alias para compatibilidad
    register: async (data: Parameters<typeof registerMutation.mutateAsync>[0]) => {
      return registerMutation.mutateAsync(data);
    },
    verifyEmail: async (sessionId: string, code: string) => {
      return verifyEmailMutation.mutateAsync({ sessionId, code });
    },
    resendVerification: async (sessionId: string) => {
      return resendVerificationMutation.mutateAsync(sessionId);
    },
    forgotPassword: async (email: string) => {
      return forgotPasswordMutation.mutateAsync(email);
    },
    resetPassword: async (sessionId: string, code: string, newPassword: string) => {
      return resetPasswordMutation.mutateAsync({ sessionId, code, newPassword });
    },

    // Token management
    getToken: () => getAuthToken(),

    // Temporary credentials
    saveTempCredentials: async (
      credentials: Parameters<typeof saveTempCredentialsMutation.mutateAsync>[0]
    ) => {
      return saveTempCredentialsMutation.mutateAsync(credentials);
    },
    getTempCredentials: async () => {
      return tempCredentialsQuery.data ?? null;
    },
    clearTempCredentials: async () => {
      return clearTempCredentialsMutation.mutateAsync();
    },
  };
}

/**
 * Hook para acceder a datos y métodos del usuario
 * Ahora implementado con TanStack Query en lugar de React Context
 */
export function useUser() {
  const queryClient = useQueryClient();
  const userQuery = useUserQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  return {
    user: userQuery.data ?? null,
    isLoading: userQuery.isLoading,
    updateUser: async (data: Parameters<typeof updateProfileMutation.mutateAsync>[0]) => {
      return updateProfileMutation.mutateAsync(data);
    },
    refreshUser: async () => {
      return invalidateUser(queryClient);
    },
  };
}
