/**
 * ========================================
 * PRODUCTS FEATURE - PUBLIC API
 * ========================================
 *
 * Exporta solo lo necesario del feature Products.
 * Los consumidores deben importar desde aquí, no de internals.
 *
 * Ejemplo:
 * import { ProductCard, useProductsQuery } from '@/features/products';
 */

// Components
export { ProductCard } from './components/product-card';
export { ProductCardList } from './components/product-card-list';
export { ProductSkeleton } from './components/product-skeleton';
export { StatsHero } from './components/stats-hero';

// API
export { getProducts, getProductBySlug } from './api/products';

// Store
export { useProductsStore } from './utils/products-store';

// Types
export type { Product, CreateProductData, UpdateProductData } from './types';
