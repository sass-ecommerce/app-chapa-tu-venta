import { apiClient } from '@/shared/config/api';
import type { CreateStorePayload, StoreApiResponse } from '../types';

export async function createStore(
  data: CreateStorePayload,
  token: string
): Promise<StoreApiResponse> {
  try {
    const { data: result } = await apiClient.post<StoreApiResponse>('/stores', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ [createStore] Response:', result);
    return result;
  } catch (error) {
    console.error('❌ [createStore] Error:', error);
    throw error;
  }
}

export async function getStoreBySlug(slug: string, token: string): Promise<StoreApiResponse[]> {
  try {
    const { data: result } = await apiClient.get<StoreApiResponse[]>(`/stores/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ [getStoreBySlug] Response:', result);
    return result;
  } catch (error) {
    console.error('❌ [getStoreBySlug] Error:', error);
    throw error;
  }
}
