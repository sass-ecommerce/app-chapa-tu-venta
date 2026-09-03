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
import { Tabs } from '@/shared/components/ui/tabs';
import { Chip } from '@/shared/components/ui/chip';
import { PriceTag } from '@/shared/components/ui/price-tag';
import { FAB } from '@/shared/components/ui/fab';
import { Icon } from '@/shared/components/ui/icon';

import { ProductCard } from '@/features/products/components/product-card';
import { ProductCardList } from '@/features/products/components/product-card-list';
import { ProductSkeletonGrid } from '@/features/products/components/product-skeleton';
import { ProductSelectionBar } from '@/features/products/components/product-selection-bar';

import { Search, Bell, Menu, Plus, Tag, Grid3x3, List } from 'lucide-react-native';
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
import type { TabValue, SortBy } from '@/features/products/utils/products-store';
import {
  SELECTION_MODE_ENTERING,
  SELECTION_MODE_EXITING,
} from '@/features/products/utils/selection-motion';
import { useProductsInfiniteQuery, useDeleteProductsMutation } from '@/features/products/queries';
import { useCategories } from '@/features/categories/queries/use-categories';
import type { Product } from '@/features/products/api/products';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

// Type guard to validate tab value
function isValidTabValue(value: string): value is TabValue {
  return value === 'all' || value === 'active' || value === 'inactive';
}

const SORT_LABELS: Record<SortBy, string> = {
  recent: 'Recientes',
  price_asc: 'Precio ↑',
  price_desc: 'Precio ↓',
};

export default function ProductosScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  // Zustand store states
  const searchQuery = useProductsStore((state) => state.searchQuery);
  const hasNotifications = useProductsStore((state) => state.hasNotifications);
  const viewMode = useProductsStore((state) => state.viewMode);
  const sortBy = useProductsStore((state) => state.sortBy);
  const selectedTab = useProductsStore((state) => state.selectedTab);
  const selectedCategories = useProductsStore((state) => state.selectedCategories);
  const selectionMode = useProductsStore((state) => state.selectionMode);
  const selectedProductIds = useProductsStore((state) => state.selectedProductIds);

  const setSearchQuery = useProductsStore((state) => state.setSearchQuery);
  const toggleNotifications = useProductsStore((state) => state.toggleNotifications);
  const setViewMode = useProductsStore((state) => state.setViewMode);
  const setSortBy = useProductsStore((state) => state.setSortBy);
  const setSelectedTab = useProductsStore((state) => state.setSelectedTab);
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

    const filtered = products.filter((product) => {
      const matchesSearch =
        searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesTab = true;
      if (selectedTab === 'active') matchesTab = product.isActive;
      else if (selectedTab === 'inactive') matchesTab = !product.isActive;

      const productCategoryName = product.categoryId
        ? (categoryNameById[product.categoryId] ?? null)
        : null;
      const matchesCategory =
        selectedCategories.length === 0 ||
        (productCategoryName ? selectedCategories.includes(productCategoryName) : false);

      return matchesSearch && matchesTab && matchesCategory;
    });

    if (sortBy === 'price_asc') {
      return [...filtered].sort((a, b) => a.basePrice - b.basePrice);
    }
    if (sortBy === 'price_desc') {
      return [...filtered].sort((a, b) => b.basePrice - a.basePrice);
    }
    return filtered;
  }, [products, searchQuery, selectedTab, selectedCategories, categoryNameById, sortBy]);

  const totalCount = data?.pages[0]?.meta.total ?? filteredProducts.length;

  // Tab data with counts
  const tabs = React.useMemo(() => {
    if (!products) return [];
    return [
      { value: 'all', label: 'Todos', count: products.length },
      { value: 'active', label: 'Activos', count: products.filter((p) => p.isActive).length },
      { value: 'inactive', label: 'Inactivos', count: products.filter((p) => !p.isActive).length },
    ];
  }, [products]);

  // Render header component with brand bar, search, stats, tabs, and filters
  const renderHeader = React.useCallback(() => {
    return (
      <View className="pt-12">
        {/* Brand bar: menu, brand mark, notification bell */}
        <View className="flex-row items-center justify-between gap-3 px-5 pb-3">
          {/* Menu Button with DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Pressable
                className="h-11 w-11 items-center justify-center rounded-lg border active:opacity-70"
                style={{ borderColor: theme.ink }}>
                <Icon as={Menu} size={19} color={theme.ink} />
              </Pressable>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg border-[1.5px]"
              style={{ borderColor: theme.ink, backgroundColor: theme.surface }}>
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

          <Text
            className="text-lg font-black uppercase tracking-tight"
            style={{ color: theme.ink }}>
            Vitrina
          </Text>

          {/* Notification Bell */}
          <Pressable
            onPress={toggleNotifications}
            className="relative h-11 w-11 items-center justify-center rounded-lg border active:opacity-70"
            style={{ borderColor: theme.ink }}>
            <Icon as={Bell} size={19} color={theme.ink} />
            {hasNotifications && (
              <View
                className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: theme.bad }}
              />
            )}
          </Pressable>
        </View>

        {/* Search bar */}
        <View className="px-5 pb-4">
          <View className="relative">
            <Input
              placeholder="Buscar cualquier producto..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="h-12 rounded-full border-[1.5px] pl-12 shadow-none"
              style={{ borderColor: theme.ink, backgroundColor: theme.surface, color: theme.ink }}
              placeholderTextColor={theme.muted}
            />
            <View className="absolute left-4 top-3">
              <Icon as={Search} size={20} color={theme.muted} />
            </View>
          </View>
        </View>

        {/* Tabs Navigation */}
        {!isLoading && !error && products && (
          <Tabs
            tabs={tabs}
            value={selectedTab}
            onValueChange={(v) => {
              if (isValidTabValue(v)) {
                setSelectedTab(v);
              }
            }}
            accentColor={theme.accent}
          />
        )}

        {/* Item count + Sort + Filter + View toggle */}
        {!isLoading && !error && products && (
          <View className="flex-row items-center justify-between gap-2 px-5 py-4">
            <Text className="text-base font-black" style={{ color: theme.ink }}>
              {totalCount.toLocaleString('es-PE')}+ productos
            </Text>

            <View className="flex-row items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Pressable className="active:opacity-80">
                    <PriceTag
                      fill={sortBy !== 'recent' ? theme.accent : theme.surface}
                      stroke={sortBy !== 'recent' ? theme.accent : theme.ink}
                      holeColor={theme.bg}
                      cut={10}>
                      <View className="flex-row items-center gap-1.5 px-3.5 py-2">
                        <Text
                          className="text-sm font-bold"
                          style={{ color: sortBy !== 'recent' ? '#fff' : theme.ink }}>
                          {SORT_LABELS[sortBy]}
                        </Text>
                      </View>
                    </PriceTag>
                  </Pressable>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg border-[1.5px]"
                  style={{ borderColor: theme.ink, backgroundColor: theme.surface }}>
                  <DropdownMenuItem onPress={() => setSortBy('recent')} className="flex-row items-center gap-3">
                    <Text className="text-base">Recientes</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onPress={() => setSortBy('price_asc')}
                    className="flex-row items-center gap-3">
                    <Text className="text-base">Precio: menor a mayor</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onPress={() => setSortBy('price_desc')}
                    className="flex-row items-center gap-3">
                    <Text className="text-base">Precio: mayor a menor</Text>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {categories.length > 0 && (
                <Chip
                  label="Filtrar"
                  selected={filtersVisible || selectedCategories.length > 0}
                  count={selectedCategories.length || undefined}
                  accentColor={theme.accent}
                  onPress={() => setFiltersVisible((v) => !v)}
                />
              )}

              <Pressable
                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="h-9 w-9 items-center justify-center rounded-lg border active:opacity-70"
                style={{ borderColor: theme.ink }}>
                {viewMode === 'grid' ? (
                  <Icon as={List} size={15} color={theme.ink} />
                ) : (
                  <Icon as={Grid3x3} size={15} color={theme.ink} />
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* Category Chips (toggled by the Filter chip) */}
        {!isLoading && !error && filtersVisible && categories.length > 0 && (
          <View className="gap-3 px-5 pb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
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
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }, [
    searchQuery,
    setSearchQuery,
    hasNotifications,
    toggleNotifications,
    isLoading,
    error,
    products,
    tabs,
    selectedTab,
    setSelectedTab,
    categories,
    categoryNameById,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
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

  // Render footer with pagination spinner + spacer for FAB
  const renderFooter = React.useCallback(() => {
    return (
      <View className="h-24 items-center justify-center">
        {isFetchingNextPage && <ActivityIndicator size="small" color={theme.accent} />}
      </View>
    );
  }, [isFetchingNextPage, theme.accent]);

  // Render item based on view mode
  const renderItem = React.useCallback(
    ({ item }: { item: Product }) => {
      const selected = selectedProductIds.has(item.id);
      if (viewMode === 'grid') {
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
      } else {
        return (
          <View className="px-5">
            <ProductCardList
              product={item}
              selectionMode={selectionMode}
              selected={selected}
              onLongPress={handleLongPressProduct}
              onToggleSelect={handleToggleSelect}
            />
          </View>
        );
      }
    },
    [viewMode, selectionMode, selectedProductIds, handleLongPressProduct, handleToggleSelect]
  );

  return (
    <View className="flex-1 bg-[#FBF9F4] dark:bg-[#18140F]">
      {/* Floating Action Button */}
      {!selectionMode && (
        <Animated.View
          entering={SELECTION_MODE_ENTERING}
          exiting={SELECTION_MODE_EXITING}
          className="absolute bottom-6 right-6 z-50">
          <FAB
            onPress={() => router.push('/products/create')}
            size="large"
            className="bg-[#C0289C] shadow-[#C0289C]/30 dark:bg-[#E85BC0] dark:shadow-[#E85BC0]/30"
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
        numColumns={viewMode === 'grid' ? 2 : 1}
        masonry={viewMode === 'grid'}
        optimizeItemArrangement={viewMode === 'grid'}
        key={viewMode} // Force re-render when switching between grid and list
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
