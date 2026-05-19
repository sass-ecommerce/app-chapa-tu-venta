import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  getCategoryChildren,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories';
import type { Category, CreateCategoryData, UpdateCategoryData } from '../types';

export const categoryKeys = {
  all: ['categories'] as const,
  list: () => ['categories', 'list'] as const,
  children: (id: string) => ['categories', 'children', id] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryChildren(id: string) {
  return useQuery({
    queryKey: categoryKeys.children(id),
    queryFn: () => getCategoryChildren(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryData) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateCategoryData }) =>
      updateCategory(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
