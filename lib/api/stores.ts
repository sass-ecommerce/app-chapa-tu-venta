import { apiFetch } from './config';

export interface CreateStorePayload {
  name: string;
  owner_email?: string | null;
  ruc?: number | null;
  plan?: string | null;
  settings?: any | null;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  owner_email: string | null;
  plan: string | null;
  settings: any | null;
  created_at: string;
  status: boolean;
  updated_at: string | null;
  ruc: number | null;
}

export async function createStore(data: CreateStorePayload): Promise<Store[]> {
  console.log('Creating store with data:', data);
  return apiFetch<Store[]>('/stores', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Prefer: 'return=representation',
    },
  });
}

export async function getStoreById(storeId: number): Promise<Store> {
  const response = await apiFetch<Store[]>(`/stores?id=eq.${storeId}`);
  if (!response || response.length === 0) {
    throw new Error('Tienda no encontrada');
  }
  return response[0];
}
