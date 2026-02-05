import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import type { Product } from '@/lib/api/products';

import { ProductCardHorizontal } from './product-card-horizontal';
import { ProductListSkeleton } from './skeleton-loader';
import { PRODUCTS_SCROLL_CONTENT_STYLE } from './utils';

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
  return (
    <View className="mb-6">
      {/* Enhanced Header with Icon */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-foreground">Productos Recientes</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/products')}
          className="flex-row items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 active:opacity-70">
          <Text className="text-sm font-semibold text-primary">Ver todo</Text>
          <Icon as={ArrowRight} size={16} className="text-primary" />
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
              key={product.slug}
              product={product}
              onPress={() => router.push(`/products/${product.slug}`)}
            />
          ))}
        </ScrollView>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!products || products.length === 0) && (
        <View className="items-center rounded-2xl bg-muted/50 p-8">
          <Text className="mb-1 text-base font-semibold text-foreground">No hay productos aún</Text>
          <Text className="mb-4 text-center text-sm text-muted-foreground">
            Comienza agregando tu primer producto
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/products')}
            className="rounded-lg bg-primary px-4 py-2 active:opacity-80">
            <Text className="text-sm font-semibold text-primary-foreground">Agregar Producto</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
