/**
 * Helper functions for home screen components
 */

/**
 * Returns Tailwind classes for stock badge color based on stock level
 * @param stock - Stock quantity
 * @returns Tailwind CSS classes string
 */
export function getStockBadgeColor(stock: number): string {
  if (stock > 10) return 'bg-green-500/10 text-green-600 dark:text-green-400';
  if (stock >= 3) return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
  return 'bg-red-500/10 text-red-600 dark:text-red-400';
}

/**
 * Hoisted style object for horizontal product scroll
 * Prevents creating new object on each render
 */
export const PRODUCTS_SCROLL_CONTENT_STYLE = {
  gap: 12,
  paddingHorizontal: 4,
};
