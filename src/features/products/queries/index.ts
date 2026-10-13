import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductsPage, getProduct, createProduct, deleteProduct } from '../api/products';
import { getPresignedUploadUrl, uploadToS3 } from '@/shared/config/storage';
import { STORAGE_FOLDERS } from '@/shared/config/constants';
import { compressProductImage } from '@/shared/utils/image-compression';
import type { CreateProductData } from '../types';

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
  infinite: () => ['products', 'infinite'] as const,
};

export function useProductsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(),
    queryFn: ({ pageParam }) => getProductsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
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

export function useUploadProductImageMutation() {
  return useMutation({
    mutationFn: async ({
      fileUri,
      fileName,
      contentType,
      primaryIdentifier,
      secondaryIdentifier,
    }: {
      fileUri: string;
      fileName: string;
      contentType: string;
      primaryIdentifier: string;
      secondaryIdentifier?: string;
    }) => {
      const compressed = await compressProductImage({ uri: fileUri, contentType });

      const { uploadUrl, key } = await getPresignedUploadUrl({
        folder: STORAGE_FOLDERS.PRODUCTS,
        fileName,
        contentType: compressed.contentType,
        primaryIdentifier,
        secondaryIdentifier,
      });
      await uploadToS3(uploadUrl, compressed.uri, compressed.contentType);
      return { key };
    },
  });
}

export function useCreateProductMutation() {
  return useMutation({
    mutationFn: (data: CreateProductData) => createProduct(data),
  });
}

export function useDeleteProductsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteProduct(id))),
    onSuccess: (_, ids) => {
      // A deleted product's detail is only marked stale, not refetched: the
      // detail screen may still be mounted while it closes, and refetching
      // would hit a 404.
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
        predicate: (query) => !ids.includes(String(query.queryKey[1])),
      });
      ids.forEach((id) =>
        queryClient.invalidateQueries({ queryKey: productKeys.detail(id), refetchType: 'none' })
      );
    },
  });
}
