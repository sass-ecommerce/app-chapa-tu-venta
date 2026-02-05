import { apiFetch } from './config';

export interface CreateStorePayload {
  name: string;
  ownerEmail?: string | null;
  ruc?: number | null;
  plan?: string | null;
  settings?: Record<string, any> | null;
}

export interface StoreResponse {
  name: string;
  slug: string;
  created_at: string;
}

export async function createStore(data: CreateStorePayload, token: string): Promise<StoreResponse> {
  console.log('Creating store with data:', data);
  return apiFetch<StoreResponse>('/stores', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getStoreBySlug(slug: string, token: string): Promise<StoreResponse[]> {
  console.log('Fetching store with slug:', slug);
  return apiFetch<StoreResponse[]>(`/stores/${slug}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}
