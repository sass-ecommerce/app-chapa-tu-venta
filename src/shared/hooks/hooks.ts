import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authStorage } from '@/features/auth/utils/storage';
import type { User, LoginPayload, RegisterPayload, UpdateProfilePayload } from '@/features/auth/types';

const USER_KEY = ['auth', 'user'] as const;

const MOCK_USER: User = {
  userSlug: 'demo-user',
  email: 'demo@chapatu.venta',
  firstName: 'Gabriel',
  lastName: 'Demo',
};

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

  async function login(email: string, _password: string) {
    try {
      await new Promise((r) => setTimeout(r, 600));
      const user: User = { ...MOCK_USER, email };
      await authStorage.saveUser(user);
      queryClient.setQueryData(USER_KEY, user);
      return user;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al iniciar sesión';
      Alert.alert('Error', msg);
      throw e;
    }
  }

  async function logout() {
    try {
      await authStorage.clearUser();
      queryClient.setQueryData(USER_KEY, null);
      queryClient.removeQueries({ queryKey: ['auth'] });
      router.replace('/(auth)/sign-in');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al cerrar sesión';
      Alert.alert('Error', msg);
      throw e;
    }
  }

  async function register(_data: RegisterPayload) {
    await new Promise((r) => setTimeout(r, 600));
  }

  async function verifyEmail(username: string, _code: string) {
    try {
      await new Promise((r) => setTimeout(r, 600));
      const user: User = { ...MOCK_USER, email: username };
      await authStorage.saveUser(user);
      queryClient.setQueryData(USER_KEY, user);
      return user;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al verificar email';
      Alert.alert('Error', msg);
      throw e;
    }
  }

  async function resendVerification(_username: string) {
    await new Promise((r) => setTimeout(r, 400));
  }

  async function forgotPassword(_email: string) {
    await new Promise((r) => setTimeout(r, 600));
  }

  async function resetPassword(_email: string, _code: string, _newPassword: string) {
    await new Promise((r) => setTimeout(r, 600));
  }

  return {
    isAuthenticated: !!userQuery.data,
    isLoading: userQuery.isLoading,
    isSignedIn: !!userQuery.data,
    isLoaded: !userQuery.isLoading,
    login: (email: string, password: string) => login(email, password),
    logout,
    signOut: logout,
    register: (data: LoginPayload & RegisterPayload) => register(data),
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    getToken: async () => 'mock-access-token',
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
