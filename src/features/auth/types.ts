// Auth Types for Custom Authentication

/**
 * User data from API response
 * Maps to GET /api/users/{userSlug} response
 */
export interface User {
  userSlug: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  role: string;
  createdAt: string;
}

/**
 * Authentication tokens
 * Used internally for storage (snake_case)
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  userSlug: string;
}

/**
 * Login API response structure
 * Maps from API (camelCase) to internal storage format (snake_case)
 */
export interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  userSlug: string;
}

/**
 * User API response structure
 * Maps to GET /api/users/{userSlug} response
 */
export interface UserApiResponse {
  userSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
  role: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  sessionId: string;
  code: string;
}

export interface ResendVerificationPayload {
  sessionId: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  sessionId: string;
  code: string;
  newPassword: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
}

/**
 * Temporary credentials stored during registration flow
 */
export interface TempCredentials {
  email: string;
  password: string;
}

/**
 * User metadata stored locally for onboarding flow
 * This is client-side only until backend provides metadata endpoint
 */
export interface UserMetadata {
  registerStoreCompleted?: boolean;
  store?: {
    slug: string;
  };
  user?: {
    slug: string;
  };
}
