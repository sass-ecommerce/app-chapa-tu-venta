import { Product } from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Archive,
  Edit,
  MoreVertical,
  Flame,
  ShoppingCart,
  Star,
  Trash2,
} from 'lucide-react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/api/products';

export default function ProductoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [imageLoading, setImageLoading] = React.useState(true);

  // Usar React Query para obtener el producto
  const {
    data: product,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const handleEdit = () => {
    Alert.alert('Editar', `Editar producto: ${product?.name}`);
  };

  const handleArchive = () => {
    Alert.alert('Archivar', `Archivar producto: ${product?.name}`);
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Producto', `¿Estás seguro de que deseas eliminar "${product?.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          // Aquí iría la lógica de eliminación
          Alert.alert('Eliminado', 'Producto eliminado exitosamente');
        },
      },
    ]);
  };

  // Componente del menú de tres puntos
  const MenuButton = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Pressable className="p-2">
          <MoreVertical size={24} color="#000" />
        </Pressable>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-0">
        <View>
          <Pressable
            onPress={handleEdit}
            className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
            <Edit size={18} color="#666" />
            <Text className="text-base">Editar</Text>
          </Pressable>

          <Pressable
            onPress={handleArchive}
            className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
            <Archive size={18} color="#666" />
            <Text className="text-base">Archivar</Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
            <Trash2 size={18} color="#ef4444" />
            <Text className="text-base text-destructive">Eliminar</Text>
          </Pressable>
        </View>
      </PopoverContent>
    </Popover>
  );

  // Si no se encuentra el producto, mostrar mensaje
  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Cargando...',
            headerBackTitle: 'Productos',
          }}
        />
        <View className="flex-1 items-center justify-center bg-background p-4">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-muted-foreground">Cargando producto...</Text>
        </View>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Producto No Encontrado',
            headerBackTitle: 'Productos',
          }}
        />
        <View className="flex-1 items-center justify-center bg-background p-4">
          <Text className="text-lg text-destructive">
            {error instanceof Error ? error.message : 'Producto no encontrado'}
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: product.name,
          headerBackTitle: 'Productos',
          headerRight: () => <MenuButton />,
        }}
      />
      <ScrollView
        className="flex-1 bg-background"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }>
        <View className="relative">
          {imageLoading && product.image_uri ? (
            <View style={{ width: '100%', height: 400 }}>
              <Skeleton className="h-full w-full" />
            </View>
          ) : null}
          {product.image_uri ? (
            <Image
              source={{ uri: product.image_uri }}
              style={{ width: '100%', height: 400 }}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          ) : (
            <View style={{ width: '100%', height: 400 }}>
              <Skeleton className="h-full w-full" />
            </View>
          )}

          {/* Badge de trending si aplica */}
          {product.trending && (
            <View className="absolute right-4 top-4">
              <Badge variant="destructive" className="flex-row items-center gap-1">
                <Flame size={14} color="white" />
                <Text className="text-xs font-semibold text-white">Trending</Text>
              </Badge>
            </View>
          )}

          {/* Rating badge */}
          {/* {product.rating && product.rating > 0 && (
            <View className="absolute bottom-4 left-4">
              <Badge variant="outline" className="flex-row items-center gap-1 bg-white">
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text className="text-xs font-semibold">{product.rating.toFixed(1)}</Text>
              </Badge>
            </View>
          )} */}
        </View>

        {/* Información del producto */}
        <View className="p-6">
          {/* Nombre y categoría */}
          <Text className="text-2xl font-bold">{product.name}</Text>
          {product.category_id && (
            <Text className="mt-2 text-sm text-muted-foreground">{product.category_id}</Text>
          )}
          {product.sku && (
            <Text className="mt-1 text-xs text-muted-foreground">SKU: {product.sku}</Text>
          )}

          {/* Precio */}
          <View className="mt-4 flex-row items-center gap-3">
            <Text className="text-3xl font-bold text-primary">S/ {product.price.toFixed(2)}</Text>
            {product.price_list && product.price_list > product.price && (
              <Text className="text-lg text-muted-foreground line-through">
                S/ {product.price_list.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Stock */}
          <View className="mt-3">
            <Text className="text-sm">
              Stock:{' '}
              <Text
                className={`font-semibold ${product.stock_quantity < 10 ? 'text-destructive' : 'text-green-600'}`}>
                {product.stock_quantity} unidades
              </Text>
            </Text>
          </View>

          {/* Descripción */}
          <View className="mt-6">
            <Text className="text-lg font-semibold">Descripción</Text>
            <Text className="mt-2 leading-6 text-muted-foreground">
              {product.description || 'Sin descripción disponible'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
