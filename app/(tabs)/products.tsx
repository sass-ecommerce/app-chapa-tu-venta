import * as React from 'react';
import { View, Pressable, RefreshControl, ScrollView } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Tabs } from '@/shared/components/ui/tabs';
import { Chip } from '@/shared/components/ui/chip';
import { FAB } from '@/shared/components/ui/fab';
import { Icon } from '@/shared/components/ui/icon';

import { ProductCard } from '@/features/products/components/product-card';
import { ProductCardList } from '@/features/products/components/product-card-list';
import { ProductSkeletonGrid } from '@/features/products/components/product-skeleton';
import { StatsHero } from '@/features/products/components/stats-hero';

import { Search, Bell, Menu, Plus, Tag, Grid3x3, List } from 'lucide-react-native';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { useProductsStore } from '@/features/products/utils/products-store';
import type { TabValue } from '@/features/products/utils/products-store';
import { useProductsQuery } from '@/features/products/queries';
import type { Product } from '@/features/products/api/products';
import { REFRESH_COLORS } from '@/shared/config/constants';

// Type guard to validate tab value
function isValidTabValue(value: string): value is TabValue {
  return value === 'all' || value === 'active' || value === 'inactive';
}

export default function ProductosScreen() {
  const router = useRouter();

  // Zustand store states
  const searchQuery = useProductsStore((state) => state.searchQuery);
  const hasNotifications = useProductsStore((state) => state.hasNotifications);
  const viewMode = useProductsStore((state) => state.viewMode);
  const selectedTab = useProductsStore((state) => state.selectedTab);
  const selectedCategories = useProductsStore((state) => state.selectedCategories);

  const setSearchQuery = useProductsStore((state) => state.setSearchQuery);
  const toggleNotifications = useProductsStore((state) => state.toggleNotifications);
  const setViewMode = useProductsStore((state) => state.setViewMode);
  const setSelectedTab = useProductsStore((state) => state.setSelectedTab);
  const toggleCategory = useProductsStore((state) => state.toggleCategory);

  const { data: products, isLoading, error, refetch, isRefetching } = useProductsQuery();

  // Extract unique category names from products
  const categories = React.useMemo(() => {
    if (!products) return [];
    const categorySet = new Set<string>();
    products.forEach((p) => {
      if (p.category?.name) categorySet.add(p.category.name);
    });
    return Array.from(categorySet);
  }, [products]);

  // Filter products based on all criteria
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch =
        searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesTab = true;
      if (selectedTab === 'active') matchesTab = product.isActive;
      else if (selectedTab === 'inactive') matchesTab = !product.isActive;

      const matchesCategory =
        selectedCategories.length === 0 ||
        (product.category?.name ? selectedCategories.includes(product.category.name) : false);

      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [products, searchQuery, selectedTab, selectedCategories]);

  // Tab data with counts
  const tabs = React.useMemo(() => {
    if (!products) return [];
    return [
      { value: 'all', label: 'Todos', count: products.length },
      { value: 'active', label: 'Activos', count: products.filter((p) => p.isActive).length },
      { value: 'inactive', label: 'Inactivos', count: products.filter((p) => !p.isActive).length },
    ];
  }, [products]);

  // Render header component with search, stats, tabs, and filters
  const renderHeader = React.useCallback(() => {
    return (
      <View className="pt-12">
        {/* Search bar with menu and notification bell */}
        <View className="flex-row items-center gap-3 px-5 pb-4">
          {/* Menu Button with DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-muted active:opacity-80">
                <Icon as={Menu} className="text-muted-foreground" size={22} />
              </Pressable>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onPress={() => router.push('/products/create')}
                className="flex-row items-center gap-3">
                <Icon as={Plus} className="text-muted-foreground" size={18} />
                <Text className="text-base">Crear producto</Text>
              </DropdownMenuItem>

              <DropdownMenuItem
                onPress={() => router.push('/categories')}
                className="flex-row items-center gap-3">
                <Icon as={Tag} className="text-muted-foreground" size={18} />
                <Text className="text-base">Gestionar categorías</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <View className="relative flex-1">
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="h-12 rounded-full border-0 bg-muted pl-12"
              placeholderTextColor="#666"
            />
            <View className="absolute left-4 top-3">
              <Icon as={Search} className="text-muted-foreground" size={20} />
            </View>
          </View>

          {/* Notification Bell */}
          <Pressable
            onPress={toggleNotifications}
            className="relative h-12 w-12 items-center justify-center rounded-full bg-muted active:opacity-80">
            <Icon as={Bell} className="text-muted-foreground" size={22} />
            {hasNotifications && (
              <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive" />
            )}
          </Pressable>
        </View>

        {/* Stats Hero Section */}
        {/* {!isLoading && !error && products && <StatsHero products={products} />} */}

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
          />
        )}

        {/* Category Chips + View Toggle */}
        {!isLoading && !error && categories.length > 0 && (
          <View className="gap-3 px-5 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-muted-foreground">Filtrar por:</Text>
              <Pressable
                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex-row items-center gap-2 rounded-full bg-muted px-3 py-1.5 active:opacity-80">
                {viewMode === 'grid' ? (
                  <Icon as={List} className="text-muted-foreground" size={16} />
                ) : (
                  <Icon as={Grid3x3} className="text-muted-foreground" size={16} />
                )}
                <Text className="text-xs font-medium text-muted-foreground">
                  {viewMode === 'grid' ? 'Lista' : 'Grid'}
                </Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    selected={selectedCategories.includes(category)}
                    onPress={() => toggleCategory(category)}
                    count={products?.filter((p) => p.category?.name === category).length}
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
    viewMode,
    setViewMode,
    selectedCategories,
    toggleCategory,
    router,
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
        <View className="mx-5 rounded-2xl bg-red-50 p-5 dark:bg-red-950/20">
          <Text className="mb-2 text-base font-semibold text-red-900 dark:text-red-400">
            Error al cargar productos
          </Text>
          <Text className="mb-4 text-sm text-red-700 dark:text-red-500">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </Text>
          <Button onPress={() => refetch()} variant="outline" className="border-red-300">
            <Text className="text-red-700 dark:text-red-400">Reintentar</Text>
          </Button>
        </View>
      );
    }

    // Empty state - no products match filters
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-lg font-medium text-muted-foreground">
          No se encontraron productos
        </Text>
        <Text className="mt-2 text-sm text-muted-foreground">Intenta con otros filtros</Text>
      </View>
    );
  }, [isLoading, error, refetch]);

  // Render footer with spacer for FAB
  const renderFooter = React.useCallback(() => {
    return <View className="h-24" />;
  }, []);

  // Render item based on view mode
  const renderItem = React.useCallback(
    ({ item }: { item: Product }) => {
      if (viewMode === 'grid') {
        return (
          <View className="p-1.5">
            <ProductCard product={item} />
          </View>
        );
      } else {
        return (
          <View className="px-5">
            <ProductCardList product={item} />
          </View>
        );
      }
    },
    [viewMode]
  );

  return (
    <View className="flex-1 bg-background">
      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6 z-50">
        <FAB onPress={() => router.push('/products/create')} size="large" />
      </View>

      <FlashList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when switching between grid and list
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={[REFRESH_COLORS.LIGHT]}
            tintColor={REFRESH_COLORS.LIGHT}
          />
        }
      />
    </View>
  );
}
