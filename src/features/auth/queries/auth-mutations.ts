import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authStorage } from '../utils/storage';
import { authKeys } from '../utils/query-keys';
import type { RegisterPayload } from '../types';
import { authApi } from '@/features/auth/api/auth';
import { userApi } from '../../profile/api/user';

/**
 * ========================================
 * AUTH MUTATIONS
 * ========================================
 */

/**
 * Login mutation
 * - Calls login API
 * - Saves tokens and userSlug to storage
 * - Fetches user data using userSlug
 * - Updates cache
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('🚪 [Auth] Logging in...');

      // Call login API
      const response = await authApi.login({ email, password });
      console.log('✅ [Auth] Login API call successful, response:', response);
      // Save tokens (includes userSlug)
      await authStorage.saveTokens(response.data);

      // Fetch user data using userSlug from login response
      const user = await userApi.getMe(response.data.userSlug, response.data.accessToken);
      await authStorage.saveUser(user);

      console.log('✅ [Auth] Login successful');
      return user;
    },
    onSuccess: (user) => {
      // Update cache with user data
      queryClient.setQueryData(authKeys.user(), user);
    },
    onError: (error: Error) => {
      console.error('❌ [Auth] Login failed:', error);
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    },
  });
}

/**
 * Logout mutation
 * - Calls logout API
 * - Clears storage
 * - Clears cache
 * - Redirects to sign-in
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('🚪 [Auth] Logging out...');

      const refreshToken = await authStorage.getRefreshToken();
      const accessToken = await authStorage.getAccessToken();

      // Call logout API
      if (refreshToken && accessToken) {
        try {
          await authApi.logout({ refreshToken }, accessToken);
        } catch (error) {
          console.error('❌ [Auth] Logout API call failed:', error);
          // Continue with local logout even if API fails
        }
      }

      // Clear storage
      await authStorage.clearAll();

      console.log('✅ [Auth] Logout successful');
    },
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });

      // Navigate to sign-in
      router.replace('/(auth)/sign-in');
    },
    onError: (error: Error) => {
      console.error('❌ [Auth] Logout failed:', error);
      Alert.alert('Error', error.message || 'Error al cerrar sesión');
    },
  });
}

/**
 * Register mutation
 */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      console.log('📝 [Auth] Registering new user...');
      const response = await authApi.register(data);
      console.log('✅ [Auth] Registration successful');
      return response.data;
    },
    onError: (error: Error) => {
      console.error('❌ [Auth] Registration failed:', error);
      Alert.alert('Error', error.message || 'Error al registrar usuario');
    },
  });
}
