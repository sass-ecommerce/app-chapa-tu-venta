import * as React from 'react';
import {
  View,
  Pressable,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Chip } from '@/shared/components/ui/chip';
import { FAB } from '@/shared/components/ui/fab';
import { Icon } from '@/shared/components/ui/icon';

import { ProductCard } from '@/features/products/components/product-card';
import { ProductSkeletonGrid } from '@/features/products/components/product-skeleton';
import { ProductSelectionBar } from '@/features/products/components/product-selection-bar';

import { Search, Menu, Plus, SlidersHorizontal, Tag } from 'lucide-react-native';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

import { useProductsStore } from '@/features/products/utils/products-store';
import {
  SELECTION_MODE_ENTERING,
  SELECTION_MODE_EXITING,
} from '@/features/products/utils/selection-motion';
import { useProductsInfiniteQuery, useDeleteProductsMutation } from '@/features/products/queries';
import { useCategories } from '@/features/categories/queries/use-categories';
import type { Product } from '@/features/products/api/products';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

export default function ProductosScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  // Zustand store states
  const searchQuery = useProductsStore((state) => state.searchQuery);
  const selectedCategories = useProductsStore((state) => state.selectedCategories);
  const selectionMode = useProductsStore((state) => state.selectionMode);
  const selectedProductIds = useProductsStore((state) => state.selectedProductIds);

  const setSearchQuery = useProductsStore((state) => state.setSearchQuery);
  const toggleCategory = useProductsStore((state) => state.toggleCategory);
  const enterSelectionMode = useProductsStore((state) => state.enterSelectionMode);
  const toggleProductSelection = useProductsStore((state) => state.toggleProductSelection);
  const exitSelectionMode = useProductsStore((state) => state.exitSelectionMode);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [filtersVisible, setFiltersVisible] = React.useState(false);
  const deleteProductsMutation = useDeleteProductsMutation();

  const handleLongPressProduct = React.useCallback(
    (product: Product) => {
      if (selectionMode) {
        toggleProductSelection(product.id);
      } else {
        enterSelectionMode(product.id);
      }
    },
    [selectionMode, enterSelectionMode, toggleProductSelection]
  );

  const handleToggleSelect = React.useCallback(
    (product: Product) => toggleProductSelection(product.id),
    [toggleProductSelection]
  );

  const handleConfirmDelete = React.useCallback(() => {
    deleteProductsMutation.mutate(Array.from(selectedProductIds), {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
        exitSelectionMode();
      },
      onError: () => {
        Alert.alert('Error', 'No se pudieron eliminar los productos. Intenta de nuevo.');
      },
    });
  }, [deleteProductsMutation, selectedProductIds, exitSelectionMode]);

  // Leaving the tab (Home, Perfil) clears the selection so the screen looks
  // untouched next time it's focused, instead of resuming mid-selection.
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        exitSelectionMode();
        setConfirmDeleteOpen(false);
      };
    }, [exitSelectionMode])
  );

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsInfiniteQuery();
  const { data: categoriesData } = useCategories();

  const products = React.useMemo(() => data?.pages.flatMap((p) => p.products), [data]);

  const handleEndReached = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Map categoryId → name for chips and filtering
  const categoryNameById = React.useMemo(() => {
    const map: Record<string, string> = {};
    categoriesData?.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categoriesData]);

  // Full category list from the API (not just categories currently in use by products)
  const categories = categoriesData ?? [];

  // Filter products based on all criteria
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch =
        searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());

      const productCategoryName = product.categoryId
        ? (categoryNameById[product.categoryId] ?? null)
        : null;
      const matchesCategory =
        selectedCategories.length === 0 ||
        (productCategoryName ? selectedCategories.includes(productCategoryName) : false);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategories, categoryNameById]);

  const totalCount = data?.pages[0]?.meta.total ?? filteredProducts.length;

  // Render header component with brand bar, search, stats, tabs, and filters
  const renderHeader = React.useCallback(() => {
    return (
      <View className="pt-12">
        {/* Title */}
        <View className="px-5 pb-4">
          <Text className="text-[22px] font-extrabold tracking-tight" style={{ color: theme.ink }}>
            Mis productos
          </Text>
          {!isLoading && !error && products && (
            <Text className="mt-1 text-xs font-semibold" style={{ color: theme.muted }}>
              {totalCount.toLocaleString('es-PE')} productos
              {categories.length > 0 ? ` · ${categories.length} categorías` : ''}
            </Text>
          )}
        </View>

        {/* Menu + search + filter toggle, same pill shape as the escaparate reference */}
        <View className="flex-row items-center gap-2 px-5 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Pressable
                className="h-[52px] w-[52px] items-center justify-center rounded-full border active:opacity-70"
                style={{ borderColor: theme.muted + '25', backgroundColor: theme.surface }}>
                <Icon as={Menu} size={19} color={theme.ink} />
              </Pressable>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-2xl border"
              style={{ borderColor: theme.muted + '25', backgroundColor: theme.surface }}>
              <DropdownMenuItem
                onPress={() => router.push('/products/create')}
                className="flex-row items-center gap-3">
                <Icon as={Plus} size={18} color={theme.accent} />
                <Text className="text-base font-semibold" style={{ color: theme.accent }}>
                  Crear producto
                </Text>
              </DropdownMenuItem>

              <DropdownMenuItem
                onPress={() => router.push('/categories')}
                className="flex-row items-center gap-3">
                <Icon as={Tag} size={18} color={theme.ink} />
                <Text className="text-base">Gestionar categorías</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <View className="relative flex-1">
            <Input
              placeholder="Buscar producto…"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="h-[52px] rounded-full border pl-12 shadow-none"
              style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface, color: theme.ink }}
              placeholderTextColor={theme.muted}
            />
            <View className="absolute left-4 top-4">
              <Icon as={Search} size={19} color={theme.muted} />
            </View>
          </View>

          {categories.length > 0 && (
            <Pressable
              onPress={() => setFiltersVisible((v) => !v)}
              className="relative h-[52px] w-[52px] items-center justify-center rounded-full border active:opacity-80"
              style={{
                borderColor: filtersVisible || selectedCategories.length > 0 ? theme.accent : theme.muted + '20',
                backgroundColor: filtersVisible || selectedCategories.length > 0 ? theme.accent + '14' : theme.surface,
              }}>
              <Icon
                as={SlidersHorizontal}
                size={18}
                color={filtersVisible || selectedCategories.length > 0 ? theme.accent : theme.ink}
              />
              {selectedCategories.length > 0 && (
                <View
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
              )}
            </Pressable>
          )}
        </View>

        {/* Category chips (toggled by the filter button) */}
        {!isLoading && !error && filtersVisible && categories.length > 0 && (
          <View className="pb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  selected={selectedCategories.includes(category.name)}
                  onPress={() => toggleCategory(category.name)}
                  count={products?.filter((p) => p.categoryId === category.id).length}
                  accentColor={theme.accent}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }, [
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    products,
    categories,
    totalCount,
    filtersVisible,
    selectedCategories,
    toggleCategory,
    router,
    theme,
  ]);

  // Render empty component for loading, error, and empty states
  const renderEmpty = React.useCallback(() => {
    if (isLoading) {
      return (
        <View className="px-2.5 py-4">
          <ProductSkeletonGrid count={6} />
        </View>
      );
    }

    if (error) {
      return (
        <View
          className="mx-5 rounded-lg border p-5"
          style={{ borderColor: theme.bad, backgroundColor: theme.bad + '14' }}>
          <Text className="mb-2 text-base font-bold" style={{ color: theme.bad }}>
            Error al cargar productos
          </Text>
          <Text className="mb-4 text-sm" style={{ color: theme.bad }}>
            {error instanceof Error ? error.message : 'Error desconocido'}
          </Text>
          <Button onPress={() => refetch()} variant="outline" style={{ borderColor: theme.bad }}>
            <Text style={{ color: theme.bad }}>Reintentar</Text>
          </Button>
        </View>
      );
    }

    // Empty state - no products match filters
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-base font-black uppercase tracking-tight text-foreground">
          No se encontraron productos
        </Text>
        <Text className="mt-1 text-sm text-muted-foreground">Intenta con otros filtros</Text>
      </View>
    );
  }, [isLoading, error, refetch, theme]);

  // Render footer with pagination spinner + spacer for the FAB
  const renderFooter = React.useCallback(() => {
    return (
      <View className="h-24 items-center justify-center">
        {isFetchingNextPage && <ActivityIndicator size="small" color={theme.accent} />}
      </View>
    );
  }, [isFetchingNextPage, theme.accent]);

  const renderItem = React.useCallback(
    ({ item }: { item: Product }) => {
      const selected = selectedProductIds.has(item.id);
      return (
        <View className="p-1.5">
          <ProductCard
            product={item}
            selectionMode={selectionMode}
            selected={selected}
            onLongPress={handleLongPressProduct}
            onToggleSelect={handleToggleSelect}
          />
        </View>
      );
    },
    [selectionMode, selectedProductIds, handleLongPressProduct, handleToggleSelect]
  );

  return (
    <View className="flex-1 bg-[#F6F5FB] dark:bg-[#101018]">
      {/* Floating Action Button */}
      {!selectionMode && (
        <Animated.View
          entering={SELECTION_MODE_ENTERING}
          exiting={SELECTION_MODE_EXITING}
          className="absolute bottom-6 right-5 z-50">
          <FAB
            onPress={() => router.push('/products/create')}
            size="large"
            className="bg-[#6C4FF2] shadow-[#6C4FF2]/30 dark:bg-[#8B6BFA] dark:shadow-[#8B6BFA]/30"
          />
        </Animated.View>
      )}

      {/* Selection Mode Bar */}
      {selectionMode && (
        <ProductSelectionBar
          count={selectedProductIds.size}
          onCancel={exitSelectionMode}
          onDelete={() => setConfirmDeleteOpen(true)}
          deleting={deleteProductsMutation.isPending}
        />
      )}

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedProductIds.size === 1
                ? 'Eliminar producto'
                : `Eliminar ${selectedProductIds.size} productos`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Los productos seleccionados se eliminarán de tu
              catálogo de forma permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={handleConfirmDelete}
              disabled={deleteProductsMutation.isPending}
              style={{ backgroundColor: theme.bad }}>
              <Text className="font-semibold text-white">
                {deleteProductsMutation.isPending ? 'Eliminando…' : 'Eliminar'}
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FlashList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        masonry
        optimizeItemArrangement
        extraData={[selectionMode, selectedProductIds]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={[theme.accent]}
            tintColor={theme.accent}
          />
        }
      />
    </View>
  );
}
