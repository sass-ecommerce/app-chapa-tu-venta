import * as React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

export function ProductSkeleton() {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <View
      className="w-full overflow-hidden rounded-sm border p-2.5 pt-3"
      style={{ borderColor: theme.ink + '2A', backgroundColor: theme.surface }}>
      {/* Image skeleton — same inset proportions as the loaded price tag */}
      <Skeleton className="h-28 w-full rounded-sm" />

      {/* Content skeleton */}
      <View className="gap-2 pb-1 pt-2.5">
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
    </View>
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
