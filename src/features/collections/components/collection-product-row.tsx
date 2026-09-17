import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';
import type { Product } from '@/features/products/types';

interface CollectionProductRowProps {
  product: Product;
  onPress?: (product: Product) => void;
  /** Leading check-circle affordance — used by the "agregar productos" picker
   * and by the collection detail's long-press multi-select. */
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (product: Product) => void;
  /** Enters multi-select mode — used by the collection detail's list view. */
  onLongPress?: (product: Product) => void;
}

export function CollectionProductRow({
  product,
  onPress,
  selectable = false,
  selected = false,
  onToggleSelect,
  onLongPress,
}: CollectionProductRowProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0] ?? null;

  const handlePress = () => {
    if (selectable) {
      onToggleSelect?.(product);
    } else {
      onPress?.(product);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={() => onLongPress?.(product)}
      className="flex-row items-center gap-2.5 rounded-2xl border p-2 active:opacity-80"
      style={{
        borderColor: selected ? theme.accent : theme.muted + '20',
        borderWidth: selected ? 2 : 1,
        backgroundColor: theme.surface,
      }}>
      {selectable && (
        <View
          className="h-6 w-6 items-center justify-center rounded-full border-2"
          style={{ borderColor: selected ? theme.accent : theme.muted + '40', backgroundColor: selected ? theme.accent : 'transparent' }}>
          {selected && <Icon as={Check} size={13} color="#fff" />}
        </View>
      )}

      <View className="h-11 w-11 overflow-hidden rounded-xl" style={{ backgroundColor: theme.accent + '14' }}>
        {primaryImage ? (
          <Image source={{ uri: primaryImage.url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-lg">📦</Text>
          </View>
        )}
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-xs font-bold" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="text-[11px] font-bold" style={{ color: theme.accent }}>
          S/ {product.basePrice.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}
