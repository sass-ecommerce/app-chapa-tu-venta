import type { QueryClient } from '@tanstack/react-query';

import { authStorage } from '../utils/storage';
import { authKeys } from '../utils/query-keys';
import type { User } from '../types';
import { authApi } from '@/features/auth/api/auth';

/**
 * ========================================
 * HELPER FUNCTIONS
 * ========================================
 */

/**
 * Get auth token with automatic refresh if expired
 */
export async function getAuthToken(): Promise<string> {
  const isExpired = await authStorage.isTokenExpired();

  if (isExpired) {
    console.log('🔄 [Auth] Token expired, refreshing...');
    const refreshToken = await authStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authApi.refreshToken({ refreshToken });
      await authStorage.saveTokens(response.data);
      console.log('✅ [Auth] Token refreshed successfully');
    } catch (error) {
      console.error('❌ [Auth] Failed to refresh token:', error);
      // Clear storage and redirect to login
      await authStorage.clearAll();
      throw new Error('Session expired. Please login again.');
    }
  }

  const token = await authStorage.getAccessToken();
  if (!token) {
    throw new Error('No access token available');
  }

  return token;
}

/**
 * Invalidate user query to trigger refetch
 */
export function invalidateUser(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: authKeys.user() });
}

/**
 * Set user data in cache
 */
export function setUserData(queryClient: QueryClient, user: User | null): void {
  queryClient.setQueryData(authKeys.user(), user);
}

/**
 * Get user data from cache
 */
export function getUserData(queryClient: QueryClient): User | null | undefined {
  return queryClient.getQueryData(authKeys.user());
}
