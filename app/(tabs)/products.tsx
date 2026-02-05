import * as React from 'react';
import { Alert, View, ScrollView, Pressable, RefreshControl } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Chip } from '@/components/ui/chip';
import { FAB } from '@/components/ui/fab';
import { Icon } from '@/components/ui/icon';

import { ProductCard } from '@/components/product-card';
import { ProductCardList } from '@/components/product-card-list';
import { ProductSkeletonGrid } from '@/components/product-skeleton';
import { StatsHero } from '@/components/stats-hero';

import { Search, Bell, Menu, Plus, FolderPlus, Grid3x3, List } from 'lucide-react-native';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useProductsStore } from '@/lib/store/products-store';
import { getProducts } from '@/lib/api/products';
import type { Product } from '@/lib/api/products';
import type { UserPublicMetadata } from '@/lib/types/clerk';
import { REFRESH_COLORS } from '@/lib/constants';

export default function ProductosScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();

  // Get storeSlug from user metadata
  const metadata = (user?.unsafeMetadata || {}) as UserPublicMetadata;
  const storeSlug = metadata?.store?.slug;

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

  // React Query for products
  const {
    data: products,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['products', storeSlug],
    queryFn: async () => {
      console.log('✅ [Products] Fetching for storeSlug:', storeSlug);
      if (!storeSlug) throw new Error('No se encontró el identificador de la tienda');

      const token = await getToken();
      if (!token) throw new Error('No se pudo obtener el token de autenticación');

      return getProducts(storeSlug, token);
    },
    enabled: !!storeSlug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Extract unique categories from products (simulated - using trending as category)
  const categories = React.useMemo(() => {
    if (!products) return [];
    const categorySet = new Set<string>();
    products.forEach((p) => {
      // Simulating categories - in real app this would come from product.category
      if (p.trending) categorySet.add('Destacados');
      if (p.stockQuantity < 10) categorySet.add('Por Agotarse');
      if (p.priceList > p.price) categorySet.add('Ofertas');
    });
    return Array.from(categorySet);
  }, [products]);

  // Filter products based on all criteria
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Tab filter
      let matchesTab = true;
      if (selectedTab === 'low-stock') {
        matchesTab = product.stockQuantity > 0 && product.stockQuantity < 10;
      } else if (selectedTab === 'out-of-stock') {
        matchesTab = product.stockQuantity === 0;
      }

      // Category filter
      let matchesCategory = selectedCategories.length === 0;
      if (!matchesCategory) {
        if (selectedCategories.includes('Destacados') && product.trending) matchesCategory = true;
        if (selectedCategories.includes('Por Agotarse') && product.stockQuantity < 10)
          matchesCategory = true;
        if (selectedCategories.includes('Ofertas') && product.priceList > product.price)
          matchesCategory = true;
      }

      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [products, searchQuery, selectedTab, selectedCategories]);

  // Tab data with counts
  const tabs = React.useMemo(() => {
    if (!products) return [];
    return [
      { value: 'all', label: 'Todos', count: products.length },
      {
        value: 'low-stock',
        label: 'Bajo Stock',
        count: products.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 10).length,
      },
      {
        value: 'out-of-stock',
        label: 'Sin Stock',
        count: products.filter((p) => p.stockQuantity === 0).length,
      },
    ];
  }, [products]);

  return (
    <View className="flex-1 bg-background">
      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6 z-50">
        <FAB onPress={() => router.push('/products/create')} size="large" />
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={[REFRESH_COLORS.LIGHT]}
            tintColor={REFRESH_COLORS.LIGHT}
          />
        }>
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
                  onPress={() => Alert.alert('Crear Colección', 'Navegar a crear colección')}
                  className="flex-row items-center gap-3">
                  <Icon as={FolderPlus} className="text-muted-foreground" size={18} />
                  <Text className="text-base">Crear colección</Text>
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
          {!isLoading && !error && products && <StatsHero products={products} />}

          {/* Tabs Navigation */}
          {!isLoading && !error && products && (
            <Tabs tabs={tabs} value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} />
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
                      count={
                        category === 'Destacados'
                          ? products?.filter((p) => p.trending).length
                          : category === 'Por Agotarse'
                            ? products?.filter((p) => p.stockQuantity < 10).length
                            : products?.filter((p) => p.priceList > p.price).length
                      }
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Loading State with Skeletons */}
          {isLoading && (
            <View className="px-2.5 py-4">
              <ProductSkeletonGrid count={6} />
            </View>
          )}

          {/* Error State */}
          {error && (
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
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-lg font-medium text-muted-foreground">
                No se encontraron productos
              </Text>
              <Text className="mt-2 text-sm text-muted-foreground">Intenta con otros filtros</Text>
            </View>
          )}

          {/* Products Grid or List */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <View className="flex-row flex-wrap px-2.5 pb-24">
                  {filteredProducts.map((product) => (
                    <View key={product.slug} className="w-1/2 p-1.5">
                      <ProductCard product={product} />
                    </View>
                  ))}
                </View>
              ) : (
                <View className="px-5 pb-24">
                  {filteredProducts.map((product) => (
                    <ProductCardList key={product.slug} product={product} />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
