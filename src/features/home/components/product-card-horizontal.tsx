import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';

import { Package } from 'lucide-react-native';

import { Card } from '@/shared/components/ui/card';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import type { Product } from '@/features/products/api/products';

interface ProductCardHorizontalProps {
  product: Product;
  onPress: () => void;
}

const CARD_SHADOW_STYLE = {
  shadowColor: '#7c3aed',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
} as const;

const PRESSABLE_STYLE = { opacity: 1 } as const;

export const ProductCardHorizontal = React.memo(
  ({ product, onPress }: ProductCardHorizontalProps) => {
    const primaryImage =
      product.images.find((img) => img.isPrimary) ?? product.images[0] ?? null;
    const imageUrl = primaryImage?.url;

    return (
      <Pressable onPress={onPress} className="mb-2 active:scale-95" style={PRESSABLE_STYLE}>
        <Card
          className="w-44 overflow-hidden shadow-md shadow-primary/10"
          style={CARD_SHADOW_STYLE}>
          <View className="h-28 w-full items-center justify-center overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <Text className="text-4xl">📦</Text>
            )}
          </View>

          {/* Product Info */}
          <View className="p-3">
            <View className="mb-2 flex-row items-start gap-1">
              <Icon as={Package} size={14} className="mt-0.5 text-muted-foreground" />
              <Text className="flex-1 text-sm font-bold text-foreground" numberOfLines={2}>
                {product.name}
              </Text>
            </View>


            <Text className="text-lg font-bold text-primary">
              S/ {product.basePrice.toFixed(2)}
            </Text>
          </View>
        </Card>
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.product.id === nextProps.product.id && prevProps.onPress === nextProps.onPress
);
