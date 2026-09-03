import * as React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useColorScheme } from 'nativewind';
import { Text } from '@/shared/components/ui/text';
import { PriceTag } from '@/shared/components/ui/price-tag';
import { Icon } from '@/shared/components/ui/icon';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';
import { Check, ChevronRight } from 'lucide-react-native';
import type { Product } from '@/features/products/api/products';

interface ProductCardListProps {
  product: Product;
  selectionMode?: boolean;
  selected?: boolean;
  onLongPress?: (product: Product) => void;
  onToggleSelect?: (product: Product) => void;
}

export const ProductCardList = React.memo(
  ({ product, selectionMode = false, selected = false, onLongPress, onToggleSelect }: ProductCardListProps) => {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const theme = getVitrinaTheme(colorScheme === 'dark');
    const primaryImage =
      product.images.find((img) => img.isPrimary) ?? product.images[0] ?? null;
    const imageUrl = primaryImage?.url;

    const handlePress = () => {
      if (selectionMode) {
        onToggleSelect?.(product);
      } else {
        router.push(`/products/${product.id}`);
      }
    };

    return (
      <Pressable
        onPress={handlePress}
        onLongPress={() => onLongPress?.(product)}
        className="mb-2 active:opacity-90">
        <PriceTag
          fill={theme.surface}
          stroke={selected ? theme.accent : theme.ink}
          strokeWidth={selected ? 2.5 : 2}
          holeColor={theme.bg}
          cut={12}>
          <View className="flex-row items-center gap-3 p-3 pl-4">
            <View
              className="h-16 w-16 items-center justify-center overflow-hidden rounded-sm"
              style={{ backgroundColor: theme.bg }}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 64, height: 64 }}
                  contentFit="cover"
                />
              ) : (
                <Text className="text-2xl">📦</Text>
              )}

              {selectionMode && (
                <View
                  className="absolute left-1 top-1 h-5 w-5 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: '#fff',
                    backgroundColor: selected ? theme.accent : 'rgba(0,0,0,0.3)',
                  }}>
                  {selected && <Icon as={Check} size={12} color="#fff" />}
                </View>
              )}
            </View>

            <View className="flex-1 gap-1">
              <Text className="text-sm font-bold" numberOfLines={1}>
                {product.name}
              </Text>
              <Text className="text-base font-black" style={{ color: theme.accent }}>
                S/ {product.basePrice.toFixed(2)}
              </Text>
            </View>

            {!selectionMode && <Icon as={ChevronRight} size={20} color={theme.muted} />}
          </View>
        </PriceTag>
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.product.id === nextProps.product.id &&
    prevProps.selectionMode === nextProps.selectionMode &&
    prevProps.selected === nextProps.selected
);
