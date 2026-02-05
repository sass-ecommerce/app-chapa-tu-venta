import * as React from 'react';
import { Image, Pressable, View } from 'react-native';

import { Flame, Package } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';

import type { Product } from '@/lib/api/products';

import { getStockBadgeColor } from './utils';

interface ProductCardHorizontalProps {
  product: Product;
  onPress: () => void;
}

/**
 * Enhanced horizontal product card with modern styling
 * Optimized for horizontal scrollable lists with better visual hierarchy
 */
export function ProductCardHorizontal({ product, onPress }: ProductCardHorizontalProps) {
  const [imageLoading, setImageLoading] = React.useState(true);

  return (
    <Pressable onPress={onPress} className="active:scale-95" style={{ opacity: 1 }}>
      <Card
        className="w-44 overflow-hidden shadow-md shadow-primary/10"
        style={{
          shadowColor: '#7c3aed',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}>
        {/* Product Image with Overlay Badges */}
        <View className="relative h-28 w-full bg-muted">
          {imageLoading && product.imageUri && <Skeleton className="absolute h-full w-full" />}
          {product.imageUri ? (
            <Image
              source={{ uri: product.imageUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}

          {/* Top Right Badges */}
          <View className="absolute right-2 top-2 flex-col gap-1">
            {/* Trending Badge */}
            {product.trending && (
              <View className="flex-row items-center gap-1 rounded-full bg-orange-500 px-2 py-1 shadow-sm">
                <Icon as={Flame} size={12} className="text-white" />
                <Text className="text-xs font-bold text-white">Hot</Text>
              </View>
            )}
          </View>

          {/* Low Stock Warning */}
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <View className="absolute bottom-2 left-2">
              <View className="rounded-md bg-yellow-500 px-2 py-0.5">
                <Text className="text-xs font-semibold text-white">Stock bajo</Text>
              </View>
            </View>
          )}

          {/* Out of Stock Badge */}
          {product.stockQuantity === 0 && (
            <View className="absolute inset-0 items-center justify-center bg-black/60">
              <View className="rounded-lg bg-red-500 px-3 py-1.5">
                <Text className="text-sm font-bold text-white">Agotado</Text>
              </View>
            </View>
          )}
        </View>

        {/* Product Info with Better Spacing */}
        <View className="p-3">
          {/* Name with Icon */}
          <View className="mb-2 flex-row items-start gap-1">
            <Icon as={Package} size={14} className="mt-0.5 text-muted-foreground" />
            <Text className="flex-1 text-sm font-bold text-foreground" numberOfLines={2}>
              {product.name}
            </Text>
          </View>

          {/* Price Section */}
          <View className="mb-2 flex-row items-center gap-2">
            <Text className="text-lg font-bold text-primary">S/ {product.price.toFixed(2)}</Text>
            {product.priceList > product.price && (
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground line-through">
                  S/ {product.priceList.toFixed(2)}
                </Text>
                <Text className="text-xs font-semibold text-green-600 dark:text-green-400">
                  {Math.round(((product.priceList - product.price) / product.priceList) * 100)}% off
                </Text>
              </View>
            )}
          </View>

          {/* Stock Badge with Enhanced Styling */}
          <View
            className={`self-start rounded-full px-2.5 py-1 ${getStockBadgeColor(product.stockQuantity)}`}>
            <Text className="text-xs font-semibold">
              {product.stockQuantity === 0 ? 'Sin stock' : `${product.stockQuantity} disponibles`}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
