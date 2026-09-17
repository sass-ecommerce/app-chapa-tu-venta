import * as React from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { ChevronLeft, Edit, Grid2x2, List, MoreVertical, Plus, Trash2 } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Button } from '@/shared/components/ui/button';
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
import { getVitrinaTheme, type VitrinaTheme } from '@/shared/config/vitrina-palette';

import {
  CollectionCover,
  CollectionFormModal,
  CollectionProductRow,
  CollectionSelectionBar,
  useCollectionQuery,
  useCollectionProductsInfiniteQuery,
  useUpdateCollectionMutation,
  useUploadCollectionCoverMutation,
  useRemoveProductsFromCollectionMutation,
  useDeleteCollectionsMutation,
} from '@/features/collections';
import type { Collection } from '@/features/collections';
import { ProductCard } from '@/features/products';
import type { Product } from '@/features/products/types';

type ViewMode = 'grid' | 'list';

interface CollectionDetailMenuProps {
  theme: VitrinaTheme;
  onEdit: () => void;
  onAddProducts: () => void;
  onDelete: () => void;
}

/** Kept as its own component so its identity is stable across the header's
 * re-renders — a Popover redefined inline loses its open/closed state. */
function CollectionDetailMenu({
  theme,
  onEdit,
  onAddProducts,
  onDelete,
}: CollectionDetailMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Pressable className="h-9 w-9 items-center justify-center rounded-full active:opacity-70">
          <Icon as={MoreVertical} size={20} color={theme.ink} />
        </Pressable>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 rounded-2xl p-0">
        <Pressable
          onPress={onEdit}
          className="flex-row items-center gap-3 px-4 py-3 active:opacity-70">
          <Icon as={Edit} size={17} color={theme.ink} />
          <Text className="text-sm font-semibold">Editar nombre/portada</Text>
        </Pressable>
        <Pressable
          onPress={onAddProducts}
          className="flex-row items-center gap-3 px-4 py-3 active:opacity-70">
          <Icon as={Plus} size={17} color={theme.ink} />
          <Text className="text-sm font-semibold">Agregar productos</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          className="flex-row items-center gap-3 px-4 py-3 active:opacity-70">
          <Icon as={Trash2} size={17} color={theme.bad} />
          <Text className="text-sm font-semibold" style={{ color: theme.bad }}>
            Eliminar colección
          </Text>
        </Pressable>
      </PopoverContent>
    </Popover>
  );
}

interface CollectionDetailHeaderProps {
  collection: Collection | undefined;
  displayName: string;
  productsCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onBack: () => void;
  onAddProducts: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Standalone component (not an inline render function) so FlashList's
 * `ListHeaderComponent` identity never changes across renders — see the
 * same gotcha documented in app/(tabs)/products.tsx.
 */
function CollectionDetailHeader({
  collection,
  displayName,
  productsCount,
  viewMode,
  onViewModeChange,
  onBack,
  onAddProducts,
  onEdit,
  onDelete,
}: CollectionDetailHeaderProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');
  const hasPhotoCover =
    !!collection?.coverImageUrl || (collection?.previewImageUrls?.length ?? 0) >= 4;

  return (
    <View className="gap-4 px-5 pb-4 pt-12">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={onBack}
          className="h-9 w-9 items-center justify-center active:opacity-70">
          <Icon as={ChevronLeft} size={24} color={theme.ink} />
        </Pressable>
        <CollectionDetailMenu
          theme={theme}
          onEdit={onEdit}
          onAddProducts={onAddProducts}
          onDelete={onDelete}
        />
      </View>

      <View className="relative h-36 overflow-hidden rounded-[20px]">
        <CollectionCover
          name={displayName}
          coverImageUrl={collection?.coverImageUrl}
          previewImageUrls={collection?.previewImageUrls}
          monogramFontSize={48}
        />
        {hasPhotoCover && (
          <View
            className="absolute inset-x-0 bottom-0 h-16"
            style={{ backgroundColor: 'rgba(23,21,31,0.5)' }}
            pointerEvents="none"
          />
        )}
        <View className="absolute bottom-3 left-4">
          <Text className="text-[17px] font-extrabold text-white">{displayName}</Text>
          <Text className="text-[11px] font-semibold text-white/85">
            {productsCount} {productsCount === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <View
          className="flex-1 flex-row rounded-full border p-[3px]"
          style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface }}>
          <Pressable
            onPress={() => onViewModeChange('grid')}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-2"
            style={{ backgroundColor: viewMode === 'grid' ? theme.accent : 'transparent' }}>
            <Icon as={Grid2x2} size={14} color={viewMode === 'grid' ? '#fff' : theme.muted} />
            <Text
              className="text-xs font-bold"
              style={{ color: viewMode === 'grid' ? '#fff' : theme.muted }}>
              Grid
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onViewModeChange('list')}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-2"
            style={{ backgroundColor: viewMode === 'list' ? theme.accent : 'transparent' }}>
            <Icon as={List} size={14} color={viewMode === 'list' ? '#fff' : theme.muted} />
            <Text
              className="text-xs font-bold"
              style={{ color: viewMode === 'list' ? '#fff' : theme.muted }}>
              Lista
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={onAddProducts}
        className="h-11 flex-row items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed active:opacity-70"
        style={{ borderColor: theme.muted + '40' }}>
        <Icon as={Plus} size={16} color={theme.accent} />
        <Text className="text-xs font-bold" style={{ color: theme.accent }}>
          Agregar productos
        </Text>
      </Pressable>
    </View>
  );
}

export default function CollectionDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [formVisible, setFormVisible] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmRemoveProductsOpen, setConfirmRemoveProductsOpen] = React.useState(false);

  // Selection mode (long-press a product to start selecting which ones to remove)
  const [selectedProductIds, setSelectedProductIds] = React.useState<Set<string>>(new Set());
  const selectionMode = selectedProductIds.size > 0;

  const { data: collection } = useCollectionQuery(id);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCollectionProductsInfiniteQuery(id);

  const updateMutation = useUpdateCollectionMutation();
  const uploadCoverMutation = useUploadCollectionCoverMutation();
  const removeProductsMutation = useRemoveProductsFromCollectionMutation(id);
  const deleteMutation = useDeleteCollectionsMutation();

  const products = React.useMemo(() => data?.pages.flatMap((p) => p.products) ?? [], [data]);
  const displayName = collection?.name ?? name ?? 'Colección';
  const productsCount = collection?.productsCount ?? products.length;

  const goToAddProducts = React.useCallback(
    () => router.push({ pathname: '/collections/[id]/add-products', params: { id } }),
    [router, id]
  );

  const handleEndReached = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSaveEdit = React.useCallback(
    async (data: {
      name: string;
      imageAsset?: { uri: string; mimeType: string; fileName: string } | null;
    }) => {
      try {
        await updateMutation.mutateAsync({ id, data: { name: data.name } });

        if (data.imageAsset) {
          try {
            const { key } = await uploadCoverMutation.mutateAsync({
              fileUri: data.imageAsset.uri,
              fileName: data.imageAsset.fileName,
              contentType: data.imageAsset.mimeType,
              collectionId: id,
            });
            // La subida a S3 solo deja el archivo ahí — hay que registrar
            // la key resultante en la colección para que quede asociada.
            await updateMutation.mutateAsync({ id, data: { coverImageKey: key } });
          } catch {
            // El nombre ya se guardó; la portada se puede reintentar.
          }
        }

        setFormVisible(false);
      } catch {
        Alert.alert('Error', 'No se pudo guardar la colección. Intenta de nuevo.');
      }
    },
    [updateMutation, uploadCoverMutation, id]
  );

  const handleDeleteCollection = React.useCallback(() => {
    deleteMutation.mutate([id], {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
        router.back();
      },
      onError: () => {
        Alert.alert('Error', 'No se pudo eliminar la colección. Intenta de nuevo.');
      },
    });
  }, [deleteMutation, id, router]);

  const exitSelectionMode = React.useCallback(() => {
    setSelectedProductIds(new Set());
  }, []);

  const toggleProductSelection = React.useCallback((product: Product) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  }, []);

  const handleConfirmRemoveProducts = React.useCallback(() => {
    removeProductsMutation.mutate(Array.from(selectedProductIds), {
      onSuccess: () => {
        setConfirmRemoveProductsOpen(false);
        exitSelectionMode();
      },
      onError: () => {
        Alert.alert('Error', 'No se pudieron quitar los productos de la colección.');
      },
    });
  }, [removeProductsMutation, selectedProductIds, exitSelectionMode]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        exitSelectionMode();
        setConfirmRemoveProductsOpen(false);
      };
    }, [exitSelectionMode])
  );

  const header = (
    <CollectionDetailHeader
      collection={collection}
      displayName={displayName}
      productsCount={productsCount}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onBack={() => router.back()}
      onAddProducts={goToAddProducts}
      onEdit={() => setFormVisible(true)}
      onDelete={() => setConfirmDeleteOpen(true)}
    />
  );

  const renderEmpty = React.useCallback(() => {
    if (isLoading) {
      return (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      );
    }
    return (
      <View className="items-center px-5 py-16">
        <Text className="text-base font-black uppercase tracking-tight text-foreground">
          Sin productos en esta colección
        </Text>
        <Text className="mt-1.5 text-center text-sm text-muted-foreground">
          Agrega productos existentes de tu catálogo
        </Text>
        <Button
          onPress={goToAddProducts}
          className="mt-5 gap-2"
          size="sm"
          style={{ backgroundColor: theme.accent }}>
          <Icon as={Plus} size={16} color="#fff" />
          <Text className="text-sm font-bold text-white">Agregar productos</Text>
        </Button>
      </View>
    );
  }, [isLoading, theme, goToAddProducts]);

  const renderGridItem = React.useCallback(
    ({ item }: { item: Product }) => (
      <View className="p-1.5">
        <ProductCard
          product={item}
          selectionMode={selectionMode}
          selected={selectedProductIds.has(item.id)}
          onLongPress={toggleProductSelection}
          onToggleSelect={toggleProductSelection}
        />
      </View>
    ),
    [selectionMode, selectedProductIds, toggleProductSelection]
  );

  const renderListItem = React.useCallback(
    ({ item }: { item: Product }) => (
      <View className="px-5 pb-2">
        <CollectionProductRow
          product={item}
          selectable={selectionMode}
          selected={selectedProductIds.has(item.id)}
          onLongPress={toggleProductSelection}
          onToggleSelect={toggleProductSelection}
        />
      </View>
    ),
    [selectionMode, selectedProductIds, toggleProductSelection]
  );

  return (
    <View className="flex-1 bg-[#F6F5FB] dark:bg-[#101018]">
      <Stack.Screen options={{ headerShown: false }} />

      {viewMode === 'grid' ? (
        <FlashList
          key="grid"
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderGridItem}
          extraData={[selectionMode, selectedProductIds]}
          ListHeaderComponent={header}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={<View className="h-10" />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlashList
          key="list"
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          extraData={[selectionMode, selectedProductIds]}
          ListHeaderComponent={header}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={<View className="h-10" />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectionMode && (
        <CollectionSelectionBar
          count={selectedProductIds.size}
          onCancel={exitSelectionMode}
          onDelete={() => setConfirmRemoveProductsOpen(true)}
          deleting={removeProductsMutation.isPending}
        />
      )}

      <CollectionFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSave={handleSaveEdit}
        isLoading={updateMutation.isPending || uploadCoverMutation.isPending}
        editCollection={collection}
      />

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar colección</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará solo "{displayName}" — los productos
              que contiene seguirán existiendo en tu catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={handleDeleteCollection}
              disabled={deleteMutation.isPending}
              style={{ backgroundColor: theme.bad }}>
              <Text className="font-semibold text-white">
                {deleteMutation.isPending ? 'Eliminando…' : 'Eliminar'}
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmRemoveProductsOpen} onOpenChange={setConfirmRemoveProductsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedProductIds.size === 1
                ? 'Quitar producto'
                : `Quitar ${selectedProductIds.size} productos`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se {selectedProductIds.size === 1 ? 'quitará' : 'quitarán'} de "{displayName}" — los
              productos seguirán existiendo en tu catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={handleConfirmRemoveProducts}
              disabled={removeProductsMutation.isPending}
              style={{ backgroundColor: theme.bad }}>
              <Text className="font-semibold text-white">
                {removeProductsMutation.isPending ? 'Quitando…' : 'Quitar'}
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
