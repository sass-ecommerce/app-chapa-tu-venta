import { API_CONFIG } from '../../../shared/config/fetch';
import type { ApiResponse, User, UserApiResponse, UpdateProfilePayload } from '../../auth/types';

/**
 * User Profile API
 * Handles getting and updating user profile information
 */

/**
 * Transform API response to internal User type
 */
function transformUserResponse(apiUser: UserApiResponse): User {
  return {
    userSlug: apiUser.userSlug,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    imageUrl: apiUser.imageUrl,
    role: apiUser.role,
    createdAt: apiUser.createdAt,
  };
}

/**
 * Get current user profile
 * GET /api/users/{userSlug}
 */
async function getMe(userSlug: string, accessToken: string): Promise<User> {
  const response = await fetch(`${API_CONFIG.baseUrl}/users/${userSlug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener datos del usuario');
  }

  const data: ApiResponse<UserApiResponse> = await response.json();
  console.log('✅ [UserAPI] User data fetched successfully');
  return transformUserResponse(data.data);
}

/**
 * Update user profile
 * PATCH /api/users/{userSlug}
 */
async function updateProfile(
  userSlug: string,
  accessToken: string,
  payload: UpdateProfilePayload
): Promise<User> {
  const response = await fetch(`${API_CONFIG.baseUrl}/users/${userSlug}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar perfil');
  }

  const data: ApiResponse<{ userSlug: string }> = await response.json();
  console.log('✅ [UserAPI] Profile updated successfully');

  // After update, fetch the updated user data
  return getMe(userSlug, accessToken);
}

export const userApi = {
  getMe,
  updateProfile,
};
