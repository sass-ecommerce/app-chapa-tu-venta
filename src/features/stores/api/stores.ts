import { apiFetch } from '../../../shared/config/fetch';
import type { CreateStorePayload, StoreApiResponse } from '../types';

export async function createStore(
  data: CreateStorePayload,
  token: string
): Promise<StoreApiResponse> {
  console.log('Creating store with data:', data);
  return apiFetch<StoreApiResponse>('/stores', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getStoreBySlug(slug: string, token: string): Promise<StoreApiResponse[]> {
  console.log('Fetching store with slug:', slug);
  return apiFetch<StoreApiResponse[]>(`/stores/${slug}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}
