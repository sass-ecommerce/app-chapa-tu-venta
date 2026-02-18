import { API_CONFIG } from '@/shared/config/fetch';
import type {
  ApiResponse,
  AuthTokens,
  LoginApiResponse,
  RegisterPayload,
  LoginPayload,
  RefreshTokenPayload,
  LogoutPayload,
} from '../types';

/**
 * Authentication Core API
 * Handles register, login, logout, and token refresh
 */

/**
 * Register a new user
 */
async function register(payload: RegisterPayload): Promise<ApiResponse<{ sessionId: string }>> {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar usuario');
  }

  const data = await response.json();
  console.log('✅ [AuthAPI] User registered successfully');
  return data;
}

/**
 * Login user
 * Transforms API response (camelCase) to internal format (snake_case)
 */
async function login(payload: LoginPayload): Promise<ApiResponse<AuthTokens>> {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  const apiResponse: ApiResponse<LoginApiResponse> = await response.json();

  console.log('✅ [AuthAPI] Login successful');

  return {
    code: apiResponse.code,
    message: apiResponse.message,
    data: apiResponse.data,
  };
}

/**
 * Refresh access token
 * Transforms API response (camelCase) to internal format (snake_case)
 */
async function refreshToken(payload: RefreshTokenPayload): Promise<ApiResponse<AuthTokens>> {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al refrescar token');
  }

  const apiResponse: ApiResponse<LoginApiResponse> = await response.json();

  // Transform camelCase API response to snake_case for internal use

  console.log('✅ [AuthAPI] Token refreshed successfully');

  return {
    code: apiResponse.code,
    message: apiResponse.message,
    data: apiResponse.data,
  };
}

/**
 * Logout user
 */
async function logout(payload: LogoutPayload, accessToken: string): Promise<ApiResponse<{}>> {
  const response = await fetch(`${API_CONFIG.baseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al cerrar sesión');
  }

  const data = await response.json();
  console.log('✅ [AuthAPI] Logout successful');
  return data;
}

export const authApi = {
  register,
  login,
  refreshToken,
  logout,
};
