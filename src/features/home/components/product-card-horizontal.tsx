import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';

import { Package } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import type { Product } from '@/features/products/api/products';

import { getVitrinaTheme, NAV_BAR } from '@/shared/config/vitrina-palette';

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
      <Pressable
        onPress={onPress}
        className="w-32 rounded-[18px] border p-2 active:scale-95"
        style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface }}>
        <View
          className="relative mb-2 h-24 w-full items-center justify-center overflow-hidden rounded-xl"
          style={{ backgroundColor: theme.accent + '14' }}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          ) : (
            <Icon as={Package} size={24} color={theme.accent} />
          )}
          <View
            className="absolute bottom-1.5 left-1.5 rounded-full px-2 py-1"
            style={{ backgroundColor: NAV_BAR }}>
            <Text className="text-[10px] font-bold text-white">S/ {product.basePrice.toFixed(0)}</Text>
          </View>
        </View>

        <Text className="px-0.5 text-xs font-bold" numberOfLines={1}>
          {product.name}
        </Text>
        {product.category && (
          <Text className="px-0.5 text-[10px] font-semibold" numberOfLines={1} style={{ color: theme.muted }}>
            {product.category.name}
          </Text>
        )}
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.product.id === nextProps.product.id && prevProps.onPress === nextProps.onPress
);
