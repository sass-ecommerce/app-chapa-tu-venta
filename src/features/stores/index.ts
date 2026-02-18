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
export { createStore, getStoreBySlug } from './api/stores';

// Types
export type { Store, CreateStorePayload, StoreApiResponse } from './types';
