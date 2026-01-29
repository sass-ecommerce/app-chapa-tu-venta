import { apiFetch } from './config';

export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  slug: string;
  external_auth_id: string | null;
  clerk_id: string | null;
  email: string;
  image_url: string | null;
  is_active: boolean;
  role: string | null;
  auth_method: string | null;
  provider_user_id: string | null;
  created_at: string;
  updated_at: string | null;
  store_id: number | null;
}

export interface UpdateUserPayload {
  store_id?: number | null;
  updated_at?: string;
}

export async function updateUserBySlug(slug: string, data: UpdateUserPayload): Promise<User> {
  return apiFetch<User>(`/users?slug=eq.${slug}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...data,
      updated_at: new Date().toISOString(),
    }),
    headers: {
      Prefer: 'return=representation',
    },
  });
}

export async function updateUserById(id: number, data: UpdateUserPayload): Promise<User> {
  return apiFetch<User>(`/users?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...data,
      updated_at: new Date().toISOString(),
    }),
    headers: {
      Prefer: 'return=representation',
    },
  });
}
