import * as React from 'react';
import { Alert, ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Archive, Edit, MoreVertical, Trash2 } from 'lucide-react-native';
import { Text } from '@/shared/components/ui/text';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { useProductsQuery } from '@/features/products/queries';

export default function ProductoDetalleScreen() {
  const { slug: productId } = useLocalSearchParams<{ slug: string }>();

  const { data: products, isLoading } = useProductsQuery();
  const product = products?.find((p) => p.id === productId);

  const handleEdit = () => Alert.alert('Editar', `Editar producto: ${product?.name}`);
  const handleArchive = () => Alert.alert('Archivar', `Archivar producto: ${product?.name}`);
  const handleDelete = () => {
    Alert.alert('Eliminar Producto', `¿Eliminar "${product?.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => Alert.alert('Eliminado', 'Producto eliminado') },
    ]);
  };

  const MenuButton = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Pressable className="p-2">
          <MoreVertical size={24} color="#000" />
        </Pressable>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-0">
        <Pressable onPress={handleEdit} className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
          <Edit size={18} color="#666" />
          <Text className="text-base">Editar</Text>
        </Pressable>
        <Pressable onPress={handleArchive} className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
          <Archive size={18} color="#666" />
          <Text className="text-base">Archivar</Text>
        </Pressable>
        <Pressable onPress={handleDelete} className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
          <Trash2 size={18} color="#ef4444" />
          <Text className="text-base text-destructive">Eliminar</Text>
        </Pressable>
      </PopoverContent>
    </Popover>
  );

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: true, title: 'Cargando...' }} />
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" color="#D9711A" />
        </View>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Stack.Screen options={{ headerShown: true, title: 'No encontrado' }} />
        <View className="flex-1 items-center justify-center bg-background p-4">
          <Text className="text-lg text-destructive">Producto no encontrado</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: product.name,
          headerRight: () => <MenuButton />,
        }}
      />
      <ScrollView className="flex-1 bg-background">
        <View className="h-64 w-full items-center justify-center bg-muted">
          <Text className="text-6xl">📦</Text>
        </View>

        <View className="p-6">
          <Text className="text-2xl font-bold text-foreground">{product.name}</Text>

          {product.category && (
            <Text className="mt-1 text-sm text-muted-foreground">{product.category.name}</Text>
          )}

          <Text className="mt-4 text-3xl font-bold text-primary">
            S/ {product.basePrice.toFixed(2)}
          </Text>

          <View className="mt-3">
            <View
              className={`self-start rounded-full px-3 py-1 ${product.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
              <Text
                className={`text-xs font-semibold ${product.isActive ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}>
                {product.isActive ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-lg font-semibold text-foreground">Descripción</Text>
            <Text className="mt-2 leading-6 text-muted-foreground">
              {product.description || 'Sin descripción disponible'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
