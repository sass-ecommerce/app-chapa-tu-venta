import * as React from 'react';
import { View, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus, Tag } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Button } from '@/shared/components/ui/button';
import { ScreenHeader } from '@/shared/components/screen-header';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

import { CategoryLabel } from '@/features/categories/components/category-label';
import { CategoryFormModal } from '@/features/categories/components/category-form-modal';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/categories/queries/use-categories';
import type { Category, CreateCategoryData } from '@/features/categories/types';

export default function CategoriesScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');
  const [formVisible, setFormVisible] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | undefined>();

  const { data: categories, isLoading, error, refetch, isRefetching } = useCategories();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  const handleOpenCreate = () => {
    setEditingCategory(undefined);
    setFormVisible(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormVisible(true);
  };

  const handleSave = (data: CreateCategoryData) => {
    if (editingCategory) {
      updateMutation.mutate(
        { slug: editingCategory.slug, data: { name: data.name } },
        { onSuccess: () => setFormVisible(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => setFormVisible(false) });
    }
  };

  const handleDelete = (category: Category) => {
    deleteMutation.mutate({ id: category.id });
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-24">
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      );
    }
    if (error) {
      return (
        <View
          className="mx-5 mt-8 rounded-lg border p-5"
          style={{ borderColor: theme.bad, backgroundColor: theme.bad + '14' }}>
          <Text className="mb-2 text-base font-bold" style={{ color: theme.bad }}>
            Error al cargar categorías
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
      <View className="flex-1 items-center justify-center px-5 py-24">
        <View className="mb-4 rounded-full p-5" style={{ backgroundColor: theme.accent + '1A' }}>
          <Icon as={Tag} size={40} color={theme.accent} />
        </View>
        <Text className="text-lg font-black uppercase tracking-tight">Sin categorías</Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          Crea tu primera categoría para organizar el catálogo de productos
        </Text>
        <Button
          onPress={handleOpenCreate}
          className="mt-6 gap-2"
          size="lg"
          style={{ backgroundColor: theme.accent }}>
          <Icon as={Plus} size={18} color="#fff" />
          <Text className="font-bold text-white">Crear categoría</Text>
        </Button>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#FBF9F4] dark:bg-[#18140F]">
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader
        title="Categorías"
        right={
          <Pressable
            onPress={handleOpenCreate}
            className="flex-row items-center gap-1 active:opacity-60">
            <Icon as={Plus} size={20} color={theme.accent} />
            <Text className="text-sm font-bold" style={{ color: theme.accent }}>
              Nueva
            </Text>
          </Pressable>
        }
      />

      <FlatList
        data={categories ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryLabel
            category={item}
            onPress={() =>
              router.push({ pathname: '/categories/[id]', params: { id: item.id, name: item.name } })
            }
            onEdit={() => handleOpenEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListHeaderComponent={null}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
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

      <CategoryFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSave={handleSave}
        isLoading={isFormLoading}
        editCategory={editingCategory}
      />
    </View>
  );
}
