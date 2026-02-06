import * as React from 'react';
import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for product cards in horizontal scroll
 */
export function ProductCardSkeleton() {
  return (
    <View className="w-40 overflow-hidden rounded-2xl bg-card p-3">
      {/* Image skeleton */}
      <Skeleton className="mb-3 h-24 w-full rounded-xl" />

      {/* Name skeleton */}
      <Skeleton className="mb-2 h-4 w-3/4" />

      {/* Price skeleton */}
      <Skeleton className="mb-2 h-5 w-1/2" />

      {/* Stock badge skeleton */}
      <Skeleton className="h-6 w-20 rounded-full" />
    </View>
  );
}

/**
 * Multiple skeleton loaders for horizontal scroll
 */
export function ProductListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View className="flex-row gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </View>
  );
}
