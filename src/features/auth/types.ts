// Auth Types

export interface User {
  userSlug: string;
  email: string;
  firstName: string;
  lastName: string;
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

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface PublicMetadata {
  storeSlug?: string;
}

export interface UserMetadata {
  publicMetadata: PublicMetadata;
}
