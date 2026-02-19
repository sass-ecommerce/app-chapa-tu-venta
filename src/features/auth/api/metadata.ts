import { apiFetch } from '@/shared/config/fetch';
import type { ApiResponse } from '@/features/auth/types';

/**
 * Public metadata structure from API
 */
export interface PublicMetadata {
  storeSlug?: string;
}

/**
 * User metadata API response structure
 * Maps to GET /api/users/{userSlug}/metadata response
 */
interface UserMetadataApiResponse {
  publicMetadata: PublicMetadata;
}

/**
 * Get user metadata from backend
 * Used to check if user has completed onboarding (has storeSlug)
 *
 * @param userSlug - User's unique slug (UUID)
 * @returns Public metadata containing storeSlug if user has registered a store
 * @throws Error if API call fails
 */
export async function getUserMetadata(userSlug: string): Promise<PublicMetadata> {
  try {
    console.log('📝 [Metadata] Fetching user metadata for:', userSlug);

    const response = await apiFetch<ApiResponse<UserMetadataApiResponse>>(
      `/users/${userSlug}/metadata`
    );

    console.log('✅ [Metadata] User metadata retrieved:', response.data.publicMetadata);

    return response.data.publicMetadata;
  } catch (error) {
    console.error('❌ [Metadata] Failed to fetch user metadata:', error);
    throw error;
  }
}
