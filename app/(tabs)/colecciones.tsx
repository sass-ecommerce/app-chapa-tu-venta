import * as React from 'react';
import { View, Pressable, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import Animated from 'react-native-reanimated';

import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { FAB } from '@/shared/components/ui/fab';
import { Icon } from '@/shared/components/ui/icon';
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

import { Search, Plus, Layers } from 'lucide-react-native';

import {
  CollectionCard,
  CollectionSelectionBar,
  CollectionSkeletonGrid,
  CollectionFormModal,
  useCollections,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useUploadCollectionCoverMutation,
  useDeleteCollectionsMutation,
  useCollectionsStore,
} from '@/features/collections';
import {
  SELECTION_MODE_ENTERING,
  SELECTION_MODE_EXITING,
} from '@/features/collections/utils/selection-motion';
import type { Collection } from '@/features/collections';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface CollectionsHeaderProps {
  isLoading: boolean;
  error: Error | null;
  totalCollections: number;
  totalProducts: number;
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

/**
 * Standalone component (not an inline useCallback) so its identity never
 * changes across renders — same FlashList `ListHeaderComponent` remount
 * gotcha documented in the products tab applies here too.
 */
function CollectionsHeader({
  isLoading,
  error,
  totalCollections,
  totalProducts,
  searchQuery,
  onSearchChange,
}: CollectionsHeaderProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <View className="pt-12">
      <View className="px-5 pb-4">
        <Text className="text-[22px] font-extrabold tracking-tight" style={{ color: theme.ink }}>
          Mis colecciones
        </Text>
        {!isLoading && !error && (
          <Text className="mt-1 text-xs font-semibold" style={{ color: theme.muted }}>
            {totalCollections} {totalCollections === 1 ? 'colección' : 'colecciones'}
            {totalProducts > 0 ? ` · ${totalProducts.toLocaleString('es-PE')} productos` : ''}
          </Text>
        )}
      </View>

      <View className="flex-row items-center gap-2 px-5 pb-4">
        <View
          className="h-[52px] w-[52px] items-center justify-center rounded-full border"
          style={{ borderColor: theme.muted + '25', backgroundColor: theme.surface }}>
          <Icon as={Layers} size={19} color={theme.accent} />
        </View>

        <View className="relative flex-1">
          <Input
            placeholder="Buscar colección…"
            value={searchQuery}
            onChangeText={onSearchChange}
            className="h-[52px] rounded-full border pl-12 shadow-none"
            style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface, color: theme.ink }}
            placeholderTextColor={theme.muted}
          />
          <View className="absolute left-4 top-4">
            <Icon as={Search} size={19} color={theme.muted} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ColeccionesScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  const [searchQuery, setSearchQuery] = React.useState('');
  const [formVisible, setFormVisible] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  const selectionMode = useCollectionsStore((state) => state.selectionMode);
  const selectedCollectionIds = useCollectionsStore((state) => state.selectedCollectionIds);
  const enterSelectionMode = useCollectionsStore((state) => state.enterSelectionMode);
  const toggleCollectionSelection = useCollectionsStore((state) => state.toggleCollectionSelection);
  const exitSelectionMode = useCollectionsStore((state) => state.exitSelectionMode);

  const { data: collections, isLoading, error, refetch, isRefetching } = useCollections();
  const createMutation = useCreateCollectionMutation();
  const updateMutation = useUpdateCollectionMutation();
  const uploadCoverMutation = useUploadCollectionCoverMutation();
  const deleteMutation = useDeleteCollectionsMutation();

  const handleLongPress = React.useCallback(
    (collection: Collection) => {
      if (selectionMode) {
        toggleCollectionSelection(collection.id);
      } else {
        enterSelectionMode(collection.id);
      }
    },
    [selectionMode, enterSelectionMode, toggleCollectionSelection]
  );

  const handleToggleSelect = React.useCallback(
    (collection: Collection) => toggleCollectionSelection(collection.id),
    [toggleCollectionSelection]
  );

  const handleConfirmDelete = React.useCallback(() => {
    deleteMutation.mutate(Array.from(selectedCollectionIds), {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
        exitSelectionMode();
      },
      onError: () => {
        Alert.alert('Error', 'No se pudieron eliminar las colecciones. Intenta de nuevo.');
      },
    });
  }, [deleteMutation, selectedCollectionIds, exitSelectionMode]);

  const handleSaveCollection = React.useCallback(
    (data: { name: string; imageAsset?: { uri: string; mimeType: string; fileName: string } | null }) => {
      createMutation.mutate(
        { name: data.name },
        {
          onSuccess: async (collection) => {
            if (data.imageAsset) {
              try {
                const { key } = await uploadCoverMutation.mutateAsync({
                  fileUri: data.imageAsset.uri,
                  fileName: data.imageAsset.fileName,
                  contentType: data.imageAsset.mimeType,
                  collectionId: collection.id,
                });
                // La subida a S3 solo deja el archivo ahí — hay que registrar
                // la key resultante en la colección para que quede asociada.
                await updateMutation.mutateAsync({
                  id: collection.id,
                  data: { coverImageKey: key },
                });
              } catch {
                // La colección ya se creó; la portada se puede reintentar editando.
              }
            }
            setFormVisible(false);
          },
          onError: () => {
            Alert.alert('Error', 'No se pudo crear la colección. Intenta de nuevo.');
          },
        }
      );
    },
    [createMutation, uploadCoverMutation, updateMutation]
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        exitSelectionMode();
        setConfirmDeleteOpen(false);
      };
    }, [exitSelectionMode])
  );

  const filteredCollections = React.useMemo(() => {
    if (!collections) return [];
    if (!searchQuery) return collections;
    return collections.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [collections, searchQuery]);

  const totalProducts = React.useMemo(
    () => (collections ?? []).reduce((sum, c) => sum + c.productsCount, 0),
    [collections]
  );

  const renderEmpty = React.useCallback(() => {
    if (isLoading) {
      return (
        <View className="px-2.5 py-4">
          <CollectionSkeletonGrid count={6} />
        </View>
      );
    }

    if (error) {
      return (
        <View
          className="mx-5 rounded-lg border p-5"
          style={{ borderColor: theme.bad, backgroundColor: theme.bad + '14' }}>
          <Text className="mb-2 text-base font-bold" style={{ color: theme.bad }}>
            Error al cargar colecciones
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

    return (
      <View className="flex-1 items-center justify-center px-5 py-20">
        <View className="mb-4 rounded-full p-5" style={{ backgroundColor: theme.accent + '1A' }}>
          <Icon as={Layers} size={40} color={theme.accent} />
        </View>
        <Text className="text-base font-black uppercase tracking-tight text-foreground">
          Sin colecciones
        </Text>
        <Text className="mt-1 text-center text-sm text-muted-foreground">
          Agrupa tus productos en colecciones como "Ofertas" o "Más vendidos"
        </Text>
        <Button
          onPress={() => setFormVisible(true)}
          className="mt-6 gap-2"
          size="lg"
          style={{ backgroundColor: theme.accent }}>
          <Icon as={Plus} size={18} color="#fff" />
          <Text className="font-bold text-white">Crear colección</Text>
        </Button>
      </View>
    );
  }, [isLoading, error, refetch, theme]);

  const renderItem = React.useCallback(
    ({ item }: { item: Collection }) => {
      const selected = selectedCollectionIds.has(item.id);
      return (
        <View className="p-1.5">
          <CollectionCard
            collection={item}
            selectionMode={selectionMode}
            selected={selected}
            onLongPress={handleLongPress}
            onToggleSelect={handleToggleSelect}
          />
        </View>
      );
    },
    [selectionMode, selectedCollectionIds, handleLongPress, handleToggleSelect]
  );

  return (
    <View className="flex-1 bg-[#F6F5FB] dark:bg-[#101018]">
      {!selectionMode && (
        <Animated.View
          entering={SELECTION_MODE_ENTERING}
          exiting={SELECTION_MODE_EXITING}
          className="absolute bottom-6 right-5 z-50">
          <FAB
            onPress={() => setFormVisible(true)}
            size="large"
            className="bg-[#6C4FF2] shadow-[#6C4FF2]/30 dark:bg-[#8B6BFA] dark:shadow-[#8B6BFA]/30"
          />
        </Animated.View>
      )}

      {selectionMode && (
        <CollectionSelectionBar
          count={selectedCollectionIds.size}
          onCancel={exitSelectionMode}
          onDelete={() => setConfirmDeleteOpen(true)}
          deleting={deleteMutation.isPending}
        />
      )}

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedCollectionIds.size === 1
                ? 'Eliminar colección'
                : `Eliminar ${selectedCollectionIds.size} colecciones`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará solo la agrupación — los productos que
              contienen seguirán existiendo en tu catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              style={{ backgroundColor: theme.bad }}>
              <Text className="font-semibold text-white">
                {deleteMutation.isPending ? 'Eliminando…' : 'Eliminar'}
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FlashList
        data={filteredCollections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        extraData={[selectionMode, selectedCollectionIds]}
        ListHeaderComponent={
          <CollectionsHeader
            isLoading={isLoading}
            error={error}
            totalCollections={collections?.length ?? 0}
            totalProducts={totalProducts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          isLoading || filteredCollections.length === 0 ? null : (
            <View className="h-24" />
          )
        }
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

      <CollectionFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSave={handleSaveCollection}
        isLoading={
          createMutation.isPending || uploadCoverMutation.isPending || updateMutation.isPending
        }
      />
    </View>
  );
}
