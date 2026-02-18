import { authStorage } from '@/features/auth/utils/storage';

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  authToken: process.env.EXPO_PUBLIC_SUPABASE_AUTH_TOKEN!,
  // Kept for backwards compatibility with other endpoints
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_API_KEY!,
};

// Base fetch function with headers and query params support
// Now includes automatic token injection and refresh handling
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  queryParams?: Record<string, string>
): Promise<T> {
  // Construct URL with query params
  let url = `${API_CONFIG.baseUrl}${endpoint}`;

  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url += `?${params.toString()}`;
  }

  // Get access token from storage
  const token = await authStorage.getAccessToken();

  // Build headers with automatic token injection
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Make request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If 401 (unauthorized), try to refresh token and retry
  if (response.status === 401 && token) {
    console.log('🔄 [API] Got 401, attempting token refresh...');

    try {
      // Get refresh token
      const refreshToken = await authStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh endpoint
      const refreshResponse = await fetch(`${API_CONFIG.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const refreshData = await refreshResponse.json();
      const newTokens = refreshData.data;

      // Save new tokens
      await authStorage.saveTokens(newTokens);

      console.log('✅ [API] Token refreshed, retrying original request...');

      // Retry original request with new token
      headers.Authorization = `Bearer ${newTokens.access_token}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      console.error('❌ [API] Token refresh failed:', error);
      // Clear auth data and let user re-authenticate
      await authStorage.clearAll();
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ [API] fetch error:', errorText);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
