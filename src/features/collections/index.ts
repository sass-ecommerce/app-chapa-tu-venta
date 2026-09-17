// Components
export { CollectionCard } from './components/collection-card';
export { CollectionCover } from './components/collection-cover';
export { CollectionSelectionBar } from './components/collection-selection-bar';
export { CollectionSkeleton, CollectionSkeletonGrid } from './components/collection-skeleton';
export { CollectionFormModal } from './components/collection-form-modal';
export type { CollectionImageAsset } from './components/collection-form-modal';
export { CollectionProductRow } from './components/collection-product-row';

// Queries
export {
  collectionKeys,
  useCollections,
  useCollectionQuery,
  useCollectionProductsInfiniteQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionsMutation,
  useUploadCollectionCoverMutation,
  useAddProductsToCollectionMutation,
  useRemoveProductFromCollectionMutation,
  useRemoveProductsFromCollectionMutation,
} from './queries';

// Store
export { useCollectionsStore } from './utils/collections-store';

// Types
export type { Collection, CreateCollectionData, UpdateCollectionData } from './types';
