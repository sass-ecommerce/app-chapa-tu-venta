/**
 * ========================================
 * HOME FEATURE - PUBLIC API
 * ========================================
 *
 * Exporta solo lo necesario del feature Home/Dashboard.
 * Los consumidores deben importar desde aquí, no de internals.
 *
 * Ejemplo:
 * import { HomeHeader, SalesSummaryCard } from '@/features/home';
 */

// Components
export { HomeHeader } from './components/home-header';
export { SalesSummaryCard } from './components/sales-summary-card';
export { RecentProductsSection } from './components/recent-products-section';
export { RecentSalesSection } from './components/recent-sales-section';
export { ProductCardHorizontal } from './components/product-card-horizontal';
export { GradientCard } from './components/gradient-card';
export { ProductCardSkeleton, ProductListSkeleton } from './components/skeleton-loader';
export { AnimatedNumber } from './components/animated-number';

// Utils
export { getStockBadgeColor, PRODUCTS_SCROLL_CONTENT_STYLE } from './utils/utils';

// Types
export type { SalesSummary } from './types';
