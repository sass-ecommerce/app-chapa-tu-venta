import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { getProductsPage, getProduct, createProduct } from '../api/products';
import { getPresignedUploadUrl, getPresignedViewUrl, uploadToS3 } from '@/shared/config/storage';
import { STORAGE_FOLDERS } from '@/shared/config/constants';
import { compressProductImage } from '@/shared/utils/image-compression';
import type { CreateProductData } from '../types';

// El link firmado expira a los 60 min (ver backend); lo refrescamos antes de eso.
const PRESIGNED_VIEW_STALE_TIME = 50 * 60 * 1000;
const PRESIGNED_VIEW_GC_TIME = 55 * 60 * 1000;

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
  infinite: () => ['products', 'infinite'] as const,
  imageUrl: (key: string) => ['products', 'image-url', key] as const,
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

export function useProductImageUrl(key: string | null | undefined) {
  return useQuery({
    queryKey: productKeys.imageUrl(key ?? ''),
    queryFn: () => getPresignedViewUrl(key as string),
    enabled: !!key,
    staleTime: PRESIGNED_VIEW_STALE_TIME,
    gcTime: PRESIGNED_VIEW_GC_TIME,
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
