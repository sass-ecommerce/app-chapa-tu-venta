import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import type { Product } from '@/features/products/api/products';

import { ProductCardHorizontal } from './product-card-horizontal';
import { ProductListSkeleton } from './skeleton-loader';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';
import { PRODUCTS_SCROLL_CONTENT_STYLE } from '../utils/utils';

interface RecentProductsSectionProps {
  isLoading: boolean;
  error: Error | null;
  products: Product[] | undefined;
  onRefetch: () => void;
}

/**
 * Section displaying recent products in horizontal scroll
 * Handles loading, error, and empty states
 */
export function RecentProductsSection({
  isLoading,
  error,
  products,
  onRefetch,
}: RecentProductsSectionProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-[15px] font-extrabold tracking-tight">Productos recientes</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/products')}
          className="flex-row items-center gap-1 rounded-full px-3 py-1.5 active:opacity-70"
          style={{ backgroundColor: theme.accent + '14' }}>
          <Text className="text-xs font-bold" style={{ color: theme.accent }}>
            Ver todo
          </Text>
          <Icon as={ArrowRight} size={14} color={theme.accent} />
        </Pressable>
      </View>

      {/* Loading State with Skeleton */}
      {isLoading && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={PRODUCTS_SCROLL_CONTENT_STYLE}>
          <ProductListSkeleton count={3} />
        </ScrollView>
      )}

      {/* Error State */}
      {error && (
        <View className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
          <Text className="text-sm font-semibold text-red-900 dark:text-red-100">
            Error al cargar productos
          </Text>
          <Text className="mt-1 text-xs text-red-700 dark:text-red-300">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </Text>
          <Pressable
            onPress={onRefetch}
            className="mt-3 self-start rounded-lg bg-red-100 px-3 py-2 dark:bg-red-900/30">
            <Text className="text-xs font-semibold text-red-900 dark:text-red-100">Reintentar</Text>
          </Pressable>
        </View>
      )}

      {/* Products Scroll */}
      {!isLoading && !error && products && products.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={PRODUCTS_SCROLL_CONTENT_STYLE}>
          {products.map((product) => (
            <ProductCardHorizontal
              key={product.id}
              product={product}
              onPress={() => router.push(`/products/${product.id}`)}
            />
          ))}
        </ScrollView>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!products || products.length === 0) && (
        <View className="items-center rounded-2xl border border-dashed border-muted-foreground/30 p-8">
          <Text className="mb-1 text-base font-bold text-foreground">No hay productos aún</Text>
          <Text className="mb-4 text-center text-sm text-muted-foreground">
            Comienza agregando tu primer producto
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/products')}
            className="rounded-full px-4 py-2.5 active:opacity-80"
            style={{ backgroundColor: theme.accent }}>
            <Text className="text-sm font-bold text-white">Agregar producto</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
