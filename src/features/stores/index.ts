/**
 * ========================================
 * STORES FEATURE - PUBLIC API
 * ========================================
 *
 * Exporta solo lo necesario del feature Stores.
 * Los consumidores deben importar desde aquí, no de internals.
 *
 * Ejemplo:
 * import { createStore, getStoreBySlug } from '@/features/stores';
 */

// API
export { createStore, getStoreBySlug, getMyTenant, updateMyTenant } from './api/stores';

// Queries
export { storeKeys, useMyTenantQuery, useUploadStoreLogoMutation } from './queries';

// Components
export { StoreCard } from './components/store-card';

// Types
export type {
  Store,
  CreateStorePayload,
  StoreApiResponse,
  MyTenant,
  UpdateMyTenantPayload,
} from './types';
