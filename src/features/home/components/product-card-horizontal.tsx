import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';

import { Package } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import type { Product } from '@/features/products/api/products';

import { PriceTag } from '@/shared/components/ui/price-tag';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface ProductCardHorizontalProps {
  product: Product;
  onPress: () => void;
}

export const ProductCardHorizontal = React.memo(
  ({ product, onPress }: ProductCardHorizontalProps) => {
    const { colorScheme } = useColorScheme();
    const theme = getVitrinaTheme(colorScheme === 'dark');

    const primaryImage =
      product.images.find((img) => img.isPrimary) ?? product.images[0] ?? null;
    const imageUrl = primaryImage?.url;

    return (
      <Pressable onPress={onPress} className="w-36 active:scale-95">
        <PriceTag fill={theme.surface} stroke={theme.ink} holeColor={theme.bg} cut={12}>
          <View className="p-2.5 pt-3">
            <View
              className="mb-2 h-20 w-full items-center justify-center overflow-hidden rounded-sm"
              style={{ backgroundColor: theme.bg }}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              ) : (
                <Icon as={Package} size={22} color={theme.muted} />
              )}
            </View>

            <Text className="text-xs font-bold" numberOfLines={2}>
              {product.name}
            </Text>
            <Text className="mt-1 text-sm font-black" style={{ color: theme.accent }}>
              S/ {product.basePrice.toFixed(2)}
            </Text>
          </View>
        </PriceTag>
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.product.id === nextProps.product.id && prevProps.onPress === nextProps.onPress
);
