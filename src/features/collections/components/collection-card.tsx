import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Layers, Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { AspectRatio } from '@/shared/components/ui/aspect-ratio';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';
import type { Collection } from '../types';
import { CollectionCover } from './collection-cover';

type CollectionCardProps = {
  collection: Collection;
  selectionMode?: boolean;
  selected?: boolean;
  onLongPress?: (collection: Collection) => void;
  onToggleSelect?: (collection: Collection) => void;
};

/**
 * Signature is the stacked-deck silhouette behind the card: two offset
 * edges peeking out communicate "this holds a group of products" at a
 * glance, distinct from the flat single-image ProductCard.
 */
export const CollectionCard = React.memo(
  ({
    collection,
    selectionMode = false,
    selected = false,
    onLongPress,
    onToggleSelect,
  }: CollectionCardProps) => {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const theme = getVitrinaTheme(colorScheme === 'dark');

    const handlePress = () => {
      if (selectionMode) {
        onToggleSelect?.(collection);
      } else {
        router.push({
          pathname: '/collections/[id]',
          params: { id: collection.id, name: collection.name },
        });
      }
    };

    return (
      // Decorative "peeking edges" live outside the Pressable — nesting them as
      // absolute siblings *inside* it was throwing off Android's hit-rect and
      // swallowing every tap/long-press on the card.
      <View className="relative">
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-[20px] border"
          style={{
            borderColor: theme.muted + '20',
            backgroundColor: theme.surface,
            transform: [{ rotate: '-4.5deg' }, { translateX: -2 }, { translateY: 4 }],
          }}
        />
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-[20px] border"
          style={{
            borderColor: theme.muted + '20',
            backgroundColor: theme.surface,
            transform: [{ rotate: '3deg' }, { translateX: 3 }, { translateY: 3 }],
          }}
        />

        <Pressable
          onPress={handlePress}
          onLongPress={() => onLongPress?.(collection)}
          className="relative rounded-[20px] border p-2 active:opacity-90"
          style={{
            borderColor: selected ? theme.accent : theme.muted + '20',
            borderWidth: selected ? 2 : 1,
            backgroundColor: theme.surface,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}>
          <View className="relative overflow-hidden rounded-2xl">
            <AspectRatio ratio={1} style={{ backgroundColor: theme.accent + '14' }}>
              <CollectionCover
                name={collection.name}
                coverImageUrl={collection.coverImageUrl}
                previewImageUrls={collection.previewImageUrls}
              />
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
          </View>

          <View className="gap-1 px-1 pb-1 pt-2.5">
            <Text className="text-[13px] font-bold" numberOfLines={1}>
              {collection.name}
            </Text>
            <View className="flex-row items-center gap-1">
              <Icon as={Layers} size={11} color={theme.muted} />
              <Text className="text-[10.5px] font-bold" style={{ color: theme.muted }}>
                {collection.productsCount} {collection.productsCount === 1 ? 'producto' : 'productos'}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.collection.id === nextProps.collection.id &&
    prevProps.collection.name === nextProps.collection.name &&
    prevProps.collection.coverImageUrl === nextProps.collection.coverImageUrl &&
    prevProps.collection.productsCount === nextProps.collection.productsCount &&
    prevProps.selectionMode === nextProps.selectionMode &&
    prevProps.selected === nextProps.selected
);
