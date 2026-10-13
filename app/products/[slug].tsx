import * as React from 'react';
import { Alert, ActivityIndicator, Pressable, ScrollView, Share, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import type { TriggerRef } from '@rn-primitives/popover';
import { Archive, ChevronRight, Edit, MoreVertical, Share2, Trash2 } from 'lucide-react-native';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
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
import { useDeleteProductsMutation, useProductQuery } from '@/features/products/queries';
import { ProductImageGallery } from '@/features/products/components/product-image-gallery';
import { AttributeValue } from '@/features/products/components/attribute-value';
import { getProductShareUrl } from '@/features/products/utils/share-link';
import { getShareableTenantDomain } from '@/features/auth';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

export default function ProductoDetalleScreen() {
  const { slug: productId } = useLocalSearchParams<{ slug: string }>();

  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');
  const menuTriggerRef = React.useRef<TriggerRef>(null);

  const { data: product, isLoading } = useProductQuery(productId);
  const deleteProductsMutation = useDeleteProductsMutation();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  const handleEdit = () => Alert.alert('Editar', `Editar producto: ${product?.name}`);
  const handleShare = async () => {
    if (!product) return;
    try {
      const tenantDomain = await getShareableTenantDomain();
      if (!tenantDomain) {
        Alert.alert('No se pudo compartir', 'No encontramos el dominio de tu tienda.');
        return;
      }
      const url = getProductShareUrl(tenantDomain, productId);
      await Share.share({ message: `${product.name} — ${url}`, url });
    } catch {
      Alert.alert('Error', 'No se pudo compartir el producto. Intenta de nuevo.');
    }
  };
  const handleArchive = () => Alert.alert('Archivar', `Archivar producto: ${product?.name}`);
  const handleDelete = () => {
    // Close the menu first: on iOS it renders in a full-window overlay that
    // would sit on top of the confirmation dialog.
    menuTriggerRef.current?.close();
    setConfirmDeleteOpen(true);
  };
  const handleConfirmDelete = () => {
    deleteProductsMutation.mutate([productId], {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
        router.back();
      },
      onError: () => {
        Alert.alert('Error', 'No se pudo eliminar el producto. Intenta de nuevo.');
      },
    });
  };

  const MenuButton = () => (
    <Popover>
      <PopoverTrigger asChild ref={menuTriggerRef}>
        <Pressable className="p-2">
          <MoreVertical size={24} color="#000" />
        </Pressable>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-0">
        <Pressable onPress={handleEdit} className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
          <Edit size={18} color="#666" />
          <Text className="text-base">Editar</Text>
        </Pressable>
        <Pressable onPress={handleShare} className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
          <Share2 size={18} color="#666" />
          <Text className="text-base">Compartir</Text>
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
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. "{product.name}" se eliminará de tu catálogo de
              forma permanente.
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
      <ScrollView className="flex-1 bg-background">
        <ProductImageGallery images={product.images} height={256} />

        <View className="p-6">
          {(() => {
            const trail = product.categories?.length
              ? product.categories
              : product.category
                ? [product.category]
                : [];
            if (!trail.length) return null;
            return (
              <View className="mb-2 flex-row flex-wrap items-center gap-1">
                {trail.map((cat, index) => (
                  <React.Fragment key={cat.id}>
                    {index > 0 && (
                      <Icon as={ChevronRight} size={12} className="text-muted-foreground" />
                    )}
                    <Text
                      className={
                        index === trail.length - 1
                          ? 'text-xs font-semibold text-primary'
                          : 'text-xs font-medium text-muted-foreground'
                      }>
                      {cat.name}
                    </Text>
                  </React.Fragment>
                ))}
              </View>
            );
          })()}

          <Text className="text-2xl font-bold text-foreground">{product.name}</Text>

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

          {!!product.attributes?.length && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-foreground">Atributos</Text>
              <View className="mt-2 rounded-xl border border-border">
                {product.attributes.map((attribute, index) => (
                  <View
                    key={attribute.attributeKey}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      index < product.attributes!.length - 1 ? 'border-b border-border' : ''
                    }`}>
                    <Text className="text-muted-foreground">{attribute.attributeLabel}</Text>
                    <AttributeValue attribute={attribute} />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
