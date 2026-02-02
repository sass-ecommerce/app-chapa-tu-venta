import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/api/products';
import { Search, Bell, Menu, Plus, FolderPlus } from 'lucide-react-native';
import * as React from 'react';
import {
  Alert,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProductsStore } from '@/lib/store/products-store';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api/products';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function ProductosScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();

  // Get storeSlug from user metadata
  const storeSlug = (user?.unsafeMetadata as { store?: { slug: string } })?.store?.slug;

  // Hook personalizado de Zustand - mucho más limpio!
  const searchQuery = useProductsStore((state) => state.searchQuery);
  const hasNotifications = useProductsStore((state) => state.hasNotifications);
  const setSearchQuery = useProductsStore((state) => state.setSearchQuery);
  const toggleNotifications = useProductsStore((state) => state.toggleNotifications);

  // React Query para obtener productos desde la API
  const {
    data: products,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['products', storeSlug],
    queryFn: async () => {
      console.log('Fetching products for storeSlug:', storeSlug);
      if (!storeSlug) throw new Error('No se encontró el identificador de la tienda');

      const token = await getToken();
      if (!token) throw new Error('No se pudo obtener el token de autenticación');

      return getProducts(storeSlug, token);
    },
    enabled: !!storeSlug, // Only run if storeSlug exists
    // Configuración específica para esta query (sobrescribe la global)
    staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos
    gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en caché
    retry: 2, // Reintentar 2 veces si falla
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true, // Refetch al volver a la app
    refetchOnReconnect: true, // Refetch al reconectar internet
  });

  const filteredProducts = (products ?? []).filter((product) => {
    const matchesSearch =
      searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={['#3b82f6']} // Android
            tintColor="#3b82f6" // iOS
          />
        }>
        <View className="pt-12">
          {/* Search bar with menu and notification bell */}
          <View className="flex-row items-center gap-3 px-4 pb-4">
            {/* Menu Button with DropdownMenu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Menu size={22} color="#666" />
                </Pressable>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onPress={() => router.push('/products/create')}
                  className="flex-row items-center gap-3">
                  <Plus size={18} color="#666" />
                  <Text className="text-base">Crear producto</Text>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onPress={() => Alert.alert('Crear Colección', 'Navegar a crear colección')}
                  className="flex-row items-center gap-3">
                  <FolderPlus size={18} color="#666" />
                  <Text className="text-base">Crear colección</Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <View className="relative flex-1">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="h-12 rounded-full border-0 bg-muted pl-12"
                placeholderTextColor="#666"
              />
              <View className="absolute left-4 top-3">
                <Search size={20} color="#666" />
              </View>
            </View>

            {/* Notification Bell */}
            <Pressable
              onPress={toggleNotifications}
              className="relative h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Bell size={22} color="#666" />
              {hasNotifications && (
                <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
              )}
            </Pressable>
          </View>

          {/* Loading State */}
          {isLoading && (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="mt-4 text-muted-foreground">Cargando productos...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View className="mx-4 rounded-lg bg-red-50 p-4">
              <Text className="mb-2 text-base font-semibold text-red-900">
                Error al cargar productos
              </Text>
              <Text className="mb-4 text-sm text-red-700">
                {error instanceof Error ? error.message : 'Error desconocido'}
              </Text>
              <Button onPress={() => refetch()} variant="outline" className="border-red-300">
                <Text className="text-red-700">Reintentar</Text>
              </Button>
            </View>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-lg text-muted-foreground">No se encontraron productos</Text>
            </View>
          )}

          {/* Products Grid */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <View className="flex-row flex-wrap px-1.5">
              {filteredProducts.map((product) => (
                <View key={product.slug} className="w-1/2 p-1.5">
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
