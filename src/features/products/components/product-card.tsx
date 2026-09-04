import { AspectRatio } from '@/shared/components/ui/aspect-ratio';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { getVitrinaTheme, NAV_BAR } from '@/shared/config/vitrina-palette';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import type { Product } from '@/features/products/api/products';

type ProductCardProps = {
  product: Product;
  selectionMode?: boolean;
  selected?: boolean;
  onLongPress?: (product: Product) => void;
  onToggleSelect?: (product: Product) => void;
};

export const ProductCard = React.memo(
  ({ product, selectionMode = false, selected = false, onLongPress, onToggleSelect }: ProductCardProps) => {
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
        className="rounded-[20px] border p-2 active:opacity-90"
        style={{
          borderColor: selected ? theme.accent : theme.muted + '20',
          borderWidth: selected ? 2 : 1,
          backgroundColor: theme.surface,
        }}>
        <View className="relative overflow-hidden rounded-2xl">
          <AspectRatio ratio={1} style={{ backgroundColor: theme.accent + '14' }}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            ) : (
              <View className="h-full w-full items-center justify-center" style={{ backgroundColor: theme.accent + '14' }}>
                <Text className="text-4xl">📦</Text>
              </View>
            )}
          </AspectRatio>

          {selectionMode && (
            <View
              className="absolute left-2 top-2 h-6 w-6 items-center justify-center rounded-full border-2"
              style={{
                borderColor: '#fff',
                backgroundColor: selected ? theme.accent : 'rgba(0,0,0,0.3)',
              }}>
              {selected && <Icon as={Check} size={14} color="#fff" />}
            </View>
          )}

          {product.category && (
            <View
              className="absolute right-2 top-2 max-w-[65%] rounded-full px-2 py-0.5"
              style={{ backgroundColor: theme.surface + 'E6' }}>
              <Text className="text-[10px] font-bold" numberOfLines={1} style={{ color: theme.muted }}>
                {product.category.name}
              </Text>
            </View>
          )}

          <View className="absolute bottom-2 left-2 rounded-full px-2.5 py-1" style={{ backgroundColor: NAV_BAR }}>
            <Text className="text-[11px] font-bold text-white">S/ {product.basePrice.toFixed(2)}</Text>
          </View>
        </View>

        <View className="gap-1 px-1 pb-1 pt-2.5">
          <Text className="text-[13px] font-bold" numberOfLines={2}>
            {product.name}
          </Text>
          {product.description ? (
            <Text className="text-xs" numberOfLines={2} style={{ color: theme.muted }}>
              {product.description}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.product.id === nextProps.product.id &&
    prevProps.selectionMode === nextProps.selectionMode &&
    prevProps.selected === nextProps.selected
);
