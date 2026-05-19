import { apiClient } from '@/shared/config/api';
import type {
  Product,
  ApiProductResponse,
  ProductsMeta,
  CreateProductData,
} from '../types';

export type { Product, ApiProductResponse, CreateProductData };

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await apiClient.get<{
      code: number;
      message: string;
      data: { products: ApiProductResponse[]; meta: ProductsMeta };
    }>('/products');
    return data.data.products.map((item) => ({
      ...item,
      basePrice: parseFloat(item.basePrice),
    }));
  } catch (error) {
    console.error('❌ [getProducts] Error:', error instanceof Error ? error.message : error);
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
    console.error('❌ [createProduct] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}
