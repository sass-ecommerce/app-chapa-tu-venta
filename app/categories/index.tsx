import * as React from 'react';
import { View, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus, Tag } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Button } from '@/shared/components/ui/button';

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
          <ActivityIndicator size="large" color="#D9711A" />
        </View>
      );
    }
    if (error) {
      return (
        <View className="mx-5 mt-8 rounded-2xl bg-red-50 p-5 dark:bg-red-950/20">
          <Text className="mb-2 text-base font-semibold text-red-900 dark:text-red-400">
            Error al cargar categorías
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
    return (
      <View className="flex-1 items-center justify-center px-5 py-24">
        <View className="mb-4 rounded-full bg-primary/10 p-5">
          <Icon as={Tag} size={40} className="text-primary" />
        </View>
        <Text className="text-lg font-semibold text-foreground">Sin categorías</Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          Crea tu primera categoría para organizar el catálogo de productos
        </Text>
        <Button onPress={handleOpenCreate} className="mt-6 gap-2" size="lg">
          <Icon as={Plus} size={18} className="text-primary-foreground" />
          <Text className="font-semibold text-primary-foreground">Crear categoría</Text>
        </Button>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Categorías',
          headerRight: () => (
            <Pressable
              onPress={handleOpenCreate}
              className="mr-1 flex-row items-center gap-1 active:opacity-60">
              <Icon as={Plus} size={20} className="text-primary" />
              <Text className="text-sm font-semibold text-primary">Nueva</Text>
            </Pressable>
          ),
        }}
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
            colors={['#D9711A']}
            tintColor="#D9711A"
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
