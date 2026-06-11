import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProduct, createProduct } from '../api/products';
import type { CreateProductData } from '../types';

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
};

export function useProductsQuery() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useProductQuery(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
