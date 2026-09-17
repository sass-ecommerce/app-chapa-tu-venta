import * as React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

export function CollectionSkeleton() {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <View
      className="w-full overflow-hidden rounded-[20px] border p-2"
      style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface }}>
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <View className="gap-2 px-1 pb-1 pt-2.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </View>
    </View>
  );
}

interface CollectionSkeletonGridProps {
  count?: number;
}

export function CollectionSkeletonGrid({ count = 6 }: CollectionSkeletonGridProps) {
  return (
    <View className="flex-row flex-wrap">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="w-1/2 p-1.5">
          <CollectionSkeleton />
        </View>
      ))}
    </View>
  );
}
