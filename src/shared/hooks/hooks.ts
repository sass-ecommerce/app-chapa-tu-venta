import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authStorage } from '@/features/auth/utils/storage';
import { loginUser, forgotPasswordRequest, resetPasswordRequest } from '@/features/auth/api';
import type { User, UpdateProfilePayload } from '@/features/auth/types';

const USER_KEY = ['auth', 'user'] as const;

function useUserQuery() {
  return useQuery({
    queryKey: USER_KEY,
    queryFn: () => authStorage.getUser(),
    staleTime: Infinity,
    retry: false,
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const userQuery = useUserQuery();

  async function logout() {
    try {
      await Promise.all([authStorage.clearUser(), authStorage.clearTokens()]);
      queryClient.setQueryData(USER_KEY, null);
      queryClient.removeQueries({ queryKey: ['auth'] });
      router.replace('/(auth)/sign-in');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al cerrar sesión';
      Alert.alert('Error', msg);
      throw e;
    }
  }

  async function forgotPassword(email: string) {
    await forgotPasswordRequest(email);
  }

  async function resetPassword(email: string, code: string, newPassword: string) {
    await resetPasswordRequest(email, code, newPassword);
  }

  return {
    isAuthenticated: !!userQuery.data,
    isLoading: userQuery.isLoading,
    isSignedIn: !!userQuery.data,
    isLoaded: !userQuery.isLoading,
    login: (email: string, password: string) => login(email, password),
    logout,
    signOut: logout,
    forgotPassword,
    resetPassword,
    getToken: () => authStorage.getAccessToken(),
  };
}

export function useUser() {
  const queryClient = useQueryClient();
  const userQuery = useUserQuery();

  async function updateUser(data: UpdateProfilePayload) {
    try {
      await new Promise((r) => setTimeout(r, 400));
      const current = await authStorage.getUser();
      const updated: User = {
        ...(current ?? MOCK_USER),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
      };
      await authStorage.saveUser(updated);
      queryClient.setQueryData(USER_KEY, updated);
      return updated;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al actualizar perfil';
      Alert.alert('Error', msg);
      throw e;
    }
  }

  return {
    user: userQuery.data ?? null,
    isLoading: userQuery.isLoading,
    updateUser,
    refreshUser: () => queryClient.invalidateQueries({ queryKey: USER_KEY }),
  };
}
