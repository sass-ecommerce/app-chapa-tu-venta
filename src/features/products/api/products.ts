import { apiClient } from '@/shared/config/api';
import type { Product, ApiProductResponse } from '../types';

export type { Product, ApiProductResponse };

export async function getProducts(storeSlug: string, token: string): Promise<Product[]> {
  try {
    const { data } = await apiClient.get<ApiProductResponse[]>('/products', {
      params: { storeSlug },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ [getProducts] Response:', data);
    return data.map((item) => ({
      ...item,
      stockQuantity: parseInt(item.stockQuantity, 10),
      priceList: parseFloat(item.priceList),
    }));
  } catch (error) {
    console.error('❌ [getProducts] Error:', error);
    throw error;
  }
}

export async function getProductBySlug(slug: string, token: string): Promise<Product> {
  try {
    const { data } = await apiClient.get<ApiProductResponse>(`/products/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [getProductBySlug] Response:`, data);
    if (!data) throw new Error('Producto no encontrado');
    return {
      ...data,
      stockQuantity: parseInt(data.stockQuantity, 10),
      priceList: parseFloat(data.priceList),
    };
  } catch (error) {
    console.error('❌ [getProductBySlug] Error:', error);
    throw error;
  }
}
