import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollections,
  getCollectionProductsPage,
  addProductsToCollection,
  removeProductsFromCollection,
} from '../api/collections';
import { getPresignedUploadUrl, uploadToS3 } from '@/shared/config/storage';
import { STORAGE_FOLDERS } from '@/shared/config/constants';
import { compressProductImage } from '@/shared/utils/image-compression';
import type { CreateCollectionData, UpdateCollectionData } from '../types';

export const collectionKeys = {
  list: () => ['collections', 'list'] as const,
  detail: (id: string) => ['collections', id] as const,
  products: (id: string) => ['collections', id, 'products'] as const,
};

export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.list(),
    queryFn: getCollections,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

export function useCollectionQuery(id: string) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => getCollection(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

export function useCollectionProductsInfiniteQuery(collectionId: string) {
  return useInfiniteQuery({
    queryKey: collectionKeys.products(collectionId),
    queryFn: ({ pageParam }) => getCollectionProductsPage(collectionId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

export function useCreateCollectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCollectionData) => createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
    },
  });
}

export function useUpdateCollectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionData }) =>
      updateCollection(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCollectionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteCollections(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
    },
  });
}

export function useUploadCollectionCoverMutation() {
  return useMutation({
    mutationFn: async ({
      fileUri,
      fileName,
      contentType,
      collectionId,
    }: {
      fileUri: string;
      fileName: string;
      contentType: string;
      collectionId: string;
    }) => {
      const compressed = await compressProductImage({ uri: fileUri, contentType });

      const { uploadUrl, key } = await getPresignedUploadUrl({
        folder: STORAGE_FOLDERS.COLLECTIONS,
        fileName,
        contentType: compressed.contentType,
        primaryIdentifier: collectionId,
      });
      await uploadToS3(uploadUrl, compressed.uri, compressed.contentType);
      return { key };
    },
  });
}

export function useAddProductsToCollectionMutation(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productIds: string[]) => addProductsToCollection(collectionId, productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collectionId) });
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      queryClient.resetQueries({ queryKey: collectionKeys.products(collectionId) });
    },
  });
}

export function useRemoveProductsFromCollectionMutation(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productIds: string[]) => removeProductsFromCollection(collectionId, productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collectionId) });
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      queryClient.resetQueries({ queryKey: collectionKeys.products(collectionId) });
    },
  });
}
