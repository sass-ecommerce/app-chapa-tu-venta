import { apiClient } from '@/shared/config/api';
import type { Product, ApiProductResponse, ProductsMeta, CreateProductData } from '../types';

export type { Product, ApiProductResponse, CreateProductData };

function normalizeProduct(item: ApiProductResponse): Product {
  return {
    ...item,
    basePrice: typeof item.basePrice === 'string' ? parseFloat(item.basePrice) : item.basePrice,
    images: item.images ?? [],
  };
}

export async function getProductsPage(
  page: number
): Promise<{ products: Product[]; meta: ProductsMeta }> {
  try {
    const { data } = await apiClient.get<{
      code: number;
      message: string;
      data: { products: ApiProductResponse[]; meta: ProductsMeta };
    }>('/products', { params: { page } });
    return {
      products: data.data.products.map(normalizeProduct),
      meta: data.data.meta,
    };
  } catch (error) {
    console.error('❌ [getProductsPage] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    const { data } = await apiClient.get<{
      code: number;
      message: string;
      data: ApiProductResponse;
    }>(`/products/${id}`);
    return normalizeProduct(data.data);
  } catch (error) {
    console.error('❌ [getProduct] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function createProduct(payload: CreateProductData): Promise<{ id: string }> {
  try {
    const { data } = await apiClient.post<{ code: number; message: string; data: { id: string } }>(
      '/products',
      payload
    );
    return data.data;
  } catch (error) {
    console.log('Payload:', payload);
    console.error('❌ [createProduct] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}
