import { apiClient } from '@/shared/config/api';
import type { Product, ApiProductResponse, ProductsMeta } from '@/features/products/types';
import type {
  ApiCollectionResponse,
  ApiResponse,
  Collection,
  CreateCollectionData,
  UpdateCollectionData,
} from '../types';

export type { Collection };

function normalizeCollection(item: ApiCollectionResponse): Collection {
  return {
    ...item,
    previewImageUrls: item.previewImageUrls ?? [],
    productsCount:
      typeof item.productsCount === 'string'
        ? parseInt(item.productsCount, 10)
        : item.productsCount,
  };
}

function normalizeProduct(item: ApiProductResponse): Product {
  return {
    ...item,
    basePrice: typeof item.basePrice === 'string' ? parseFloat(item.basePrice) : item.basePrice,
    images: item.images ?? [],
  };
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<ApiCollectionResponse[]>>('/collections');
    return data.data.map(normalizeCollection);
  } catch (error) {
    console.error('❌ [getCollections] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getCollection(id: string): Promise<Collection> {
  try {
    const { data } = await apiClient.get<ApiResponse<ApiCollectionResponse>>(`/collections/${id}`);
    return normalizeCollection(data.data);
  } catch (error) {
    console.error('❌ [getCollection] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function createCollection(payload: CreateCollectionData): Promise<Collection> {
  try {
    const { data } = await apiClient.post<ApiResponse<ApiCollectionResponse>>(
      '/collections',
      payload
    );
    return normalizeCollection(data.data);
  } catch (error) {
    console.error('❌ [createCollection] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function updateCollection(
  id: string,
  payload: UpdateCollectionData
): Promise<Collection> {
  try {
    const { data } = await apiClient.patch<ApiResponse<ApiCollectionResponse>>(
      `/collections/${id}`,
      payload
    );
    return normalizeCollection(data.data);
  } catch (error) {
    console.error('❌ [updateCollection] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function deleteCollections(ids: string[]): Promise<void> {
  try {
    await apiClient.delete('/collections', { data: { ids } });
  } catch (error) {
    console.error('❌ [deleteCollections] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getCollectionProductsPage(
  collectionId: string,
  page: number
): Promise<{ products: Product[]; meta: ProductsMeta }> {
  try {
    const { data } = await apiClient.get<{
      code: number;
      message: string;
      data: { products: ApiProductResponse[]; meta: ProductsMeta };
    }>(`/collections/${collectionId}/products`, { params: { page } });
    return {
      products: data.data.products.map(normalizeProduct),
      meta: data.data.meta,
    };
  } catch (error) {
    console.error(
      '❌ [getCollectionProductsPage] Error:',
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

export async function addProductsToCollection(
  collectionId: string,
  productIds: string[]
): Promise<void> {
  try {
    await apiClient.post(`/collections/${collectionId}/products`, { productIds });
  } catch (error) {
    console.error(
      '❌ [addProductsToCollection] Error:',
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

export async function removeProductsFromCollection(
  collectionId: string,
  productIds: string[]
): Promise<void> {
  try {
    await apiClient.delete(`/collections/${collectionId}/products`, { data: { productIds } });
  } catch (error) {
    console.error(
      '❌ [removeProductsFromCollection] Error:',
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}
