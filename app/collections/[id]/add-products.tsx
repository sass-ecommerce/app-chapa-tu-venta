import * as React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ChevronLeft, Search } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Input } from '@/shared/components/ui/input';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

import {
  CollectionProductRow,
  collectionKeys,
  useAddProductsToCollectionMutation,
} from '@/features/collections';
import { useProductsInfiniteQuery } from '@/features/products';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { Product, ProductsMeta } from '@/features/products/types';

export default function AddProductsToCollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductsInfiniteQuery();
  const addMutation = useAddProductsToCollectionMutation(id);

  const allProducts = React.useMemo(() => data?.pages.flatMap((p) => p.products) ?? [], [data]);

  // Solo cubre las páginas ya cargadas por el detalle de la colección — un
  // filtro `excludeCollectionId` en el backend resolvería esto de raíz.
  const existingProductIds = React.useMemo(() => {
    const cached = queryClient.getQueryData<
      InfiniteData<{ products: Product[]; meta: ProductsMeta }>
    >(collectionKeys.products(id));
    const ids = new Set<string>();
    cached?.pages.forEach((page) => page.products.forEach((p) => ids.add(p.id)));
    return ids;
  }, [queryClient, id]);

  const filteredProducts = React.useMemo(() => {
    return allProducts.filter((product) => {
      if (existingProductIds.has(product.id)) return false;
      if (!searchQuery) return true;
      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [allProducts, existingProductIds, searchQuery]);

  const handleToggleSelect = React.useCallback((product: Product) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  }, []);

  const handleEndReached = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleConfirm = React.useCallback(() => {
    addMutation.mutate(Array.from(selectedIds), {
      onSuccess: () => router.back(),
    });
  }, [addMutation, selectedIds, router]);

  return (
    <View className="flex-1 bg-[#F6F5FB] dark:bg-[#101018]">
      <Stack.Screen options={{ headerShown: false }} />

      <FlashList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-5 pb-2">
            <CollectionProductRow
              product={item}
              selectable
              selected={selectedIds.has(item.id)}
              onToggleSelect={handleToggleSelect}
            />
          </View>
        )}
        ListHeaderComponent={
          <View className="gap-3 px-5 pb-4 pt-12">
            <View className="flex-row items-center gap-3">
              <Pressable onPress={() => router.back()} className="h-9 w-9 items-center justify-center active:opacity-70">
                <Icon as={ChevronLeft} size={22} color={theme.ink} />
              </Pressable>
              <Text className="text-[17px] font-extrabold tracking-tight">Agregar productos</Text>
            </View>
            <View className="relative">
              <Input
                placeholder="Buscar producto…"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="h-[48px] rounded-full border pl-11 shadow-none"
                style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface, color: theme.ink }}
                placeholderTextColor={theme.muted}
              />
              <View className="absolute left-4 top-3.5">
                <Icon as={Search} size={17} color={theme.muted} />
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" color={theme.accent} />
            </View>
          ) : (
            <View className="items-center px-5 py-16">
              <Text className="text-base font-black uppercase tracking-tight text-foreground">
                Sin productos disponibles
              </Text>
              <Text className="mt-1.5 text-center text-sm text-muted-foreground">
                {searchQuery ? 'Prueba con otro nombre' : 'Ya agregaste todos tus productos a esta colección'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={<View className="h-28" />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />

      {selectedIds.size > 0 && (
        <View className="absolute bottom-6 left-5 right-5">
          <Pressable
            onPress={handleConfirm}
            disabled={addMutation.isPending}
            className="h-[52px] items-center justify-center rounded-2xl active:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: theme.accent,
              shadowColor: theme.accent,
              shadowOpacity: 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            }}>
            <Text className="text-sm font-bold text-white">
              {addMutation.isPending
                ? 'Agregando…'
                : `Agregar ${selectedIds.size} ${selectedIds.size === 1 ? 'producto' : 'productos'}`}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
