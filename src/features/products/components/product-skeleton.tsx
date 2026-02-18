import * as React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card } from '@/shared/components/ui/card';

export function ProductSkeleton() {
  return (
    <Card className="w-full overflow-hidden rounded-xl bg-card">
      {/* Image skeleton */}
      <Skeleton className="h-36 w-full rounded-none" />

      {/* Content skeleton */}
      <View className="gap-2 px-3 pb-3 pt-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />

        {/* Stock indicator */}
        <View className="flex-row items-center gap-1.5">
          <Skeleton className="h-1.5 w-1.5 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </View>

        {/* Price */}
        <View className="flex-row items-center gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-12" />
        </View>
      </View>
    </Card>
  );
}

interface ProductSkeletonGridProps {
  count?: number;
}

export function ProductSkeletonGrid({ count = 6 }: ProductSkeletonGridProps) {
  return (
    <View className="flex-row flex-wrap">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="w-1/2 p-1.5">
          <ProductSkeleton />
        </View>
      ))}
    </View>
  );
}
