import { apiClient } from '@/shared/config/api';
import type { ApiResponse, Category, CreateCategoryData, UpdateCategoryData } from '../types';

export type { Category };

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  } catch (error) {
    console.error('❌ [getCategories] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getCategoryChildren(id: string): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(`/categories/${id}`);
    return data.data;
  } catch (error) {
    console.error(
      '❌ [getCategoryChildren] Error:',
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

export async function createCategory(payload: CreateCategoryData): Promise<Category> {
  try {
    const { data } = await apiClient.post<ApiResponse<Category>>('/categories', payload);
    return data.data;
  } catch (error) {
    console.error('❌ [createCategory] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function updateCategory(slug: string, payload: UpdateCategoryData): Promise<Category> {
  // TODO: endpoint not available yet
  return Promise.resolve({ slug, name: payload.name ?? '' } as Category);
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await apiClient.delete(`/categories/${id}`);
  } catch (error) {
    console.error('❌ [deleteCategory] Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}
