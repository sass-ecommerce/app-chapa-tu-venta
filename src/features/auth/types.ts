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

export interface PublicMetadata {
  storeSlug?: string;
}

export interface UserMetadata {
  publicMetadata: PublicMetadata;
}
