import { useQuery } from '@tanstack/react-query';

import { authStorage } from '../utils/storage';
import { authKeys } from '../utils/query-keys';
import type { User } from '../types';
import { authApi } from '@/features/auth/api/auth';
import { userApi } from '../../profile/api/user';

/**
 * ========================================
 * QUERIES
 * ========================================
 */

/**
 * Query for current user data
 * - Loads initial data from storage
 * - Fetches from API if token is valid
 * - Handles token refresh automatically
 */
export function useUserQuery() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      try {
        const token = await authStorage.getAccessToken();
        const userSlug = await authStorage.getUserSlug();
        const isExpired = await authStorage.isTokenExpired();

        if (!token || !userSlug || isExpired) {
          // Try to refresh if we have a refresh token
          const refreshToken = await authStorage.getRefreshToken();
          const storedUserSlug = await authStorage.getUserSlug();

          if (refreshToken && storedUserSlug) {
            try {
              const response = await authApi.refreshToken({ refreshToken });
              await authStorage.saveTokens({
                ...response.data,
                userSlug: storedUserSlug, // Preserve userSlug as refresh doesn't return it
              });
              const user = await userApi.getMe(storedUserSlug, response.data.accessToken);
              await authStorage.saveUser(user);
              return user;
            } catch (error) {
              console.error('❌ [Auth] Failed to refresh token:', error);
              await authStorage.clearAll();
              return null;
            }
          }
          return null;
        }

        // Token is valid, fetch user data
        const user = await userApi.getMe(userSlug, token);
        await authStorage.saveUser(user);
        return user;
      } catch (error) {
        console.error('❌ [Auth] Failed to fetch user:', error);
        await authStorage.clearAll();
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: 1,
  });
}

/**
 * Query for temporary credentials
 */
export function useTempCredentialsQuery() {
  return useQuery({
    queryKey: authKeys.tempCredentials(),
    queryFn: () => authStorage.getTempCredentials(),
    staleTime: Infinity, // Never goes stale
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
