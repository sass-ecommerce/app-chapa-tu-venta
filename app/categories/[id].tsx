import * as React from 'react';
import { View, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Plus, Tag } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Button } from '@/shared/components/ui/button';
import { ScreenHeader } from '@/shared/components/screen-header';

import { CategoryLabel } from '@/features/categories/components/category-label';
import { CategoryFormModal } from '@/features/categories/components/category-form-modal';
import {
  useCategoryChildren,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/categories/queries/use-categories';
import type { Category, CreateCategoryData } from '@/features/categories/types';

export default function CategoryDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();

  const [formVisible, setFormVisible] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | undefined>();

  const { data: children, isLoading, refetch, isRefetching } = useCategoryChildren(id);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const isFormLoading = createMutation.isPending || updateMutation.isPending;
  const subcategories = children ?? [];

  const handleOpenCreateSub = () => {
    setEditingCategory(undefined);
    setFormVisible(true);
  };

  const handleOpenEditSub = (sub: Category) => {
    setEditingCategory(sub);
    setFormVisible(true);
  };

  const handleSave = (data: CreateCategoryData) => {
    if (editingCategory) {
      updateMutation.mutate(
        { slug: editingCategory.slug, data: { name: data.name } },
        { onSuccess: () => setFormVisible(false) }
      );
    } else {
      createMutation.mutate(
        { ...data, parentId: id },
        { onSuccess: () => setFormVisible(false) }
      );
    }
  };

  const handleDeleteSub = (sub: Category) => {
    deleteMutation.mutate({ id: sub.id });
  };

  const header = (
    <ScreenHeader
      title={name ?? 'Categoría'}
      right={
        <Pressable
          onPress={handleOpenCreateSub}
          className="flex-row items-center gap-1 active:opacity-60">
          <Icon as={Plus} size={20} className="text-primary" />
          <Text className="text-sm font-semibold text-primary">Nueva sub</Text>
        </Pressable>
      }
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <Stack.Screen options={{ headerShown: false }} />
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D9711A" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      {header}

      <FlatList
        data={subcategories}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={['#D9711A']}
            tintColor="#D9711A"
          />
        }
        ListHeaderComponent={
          subcategories.length > 0
            ? () => (
                <View className="px-5 pb-3 pt-4">
                  <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Subcategorías · {subcategories.length}
                  </Text>
                </View>
              )
            : null
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <CategoryLabel
              category={item}
              onPress={() =>
                router.push({
                  pathname: '/categories/[id]',
                  params: { id: item.id, name: item.name },
                })
              }
              onEdit={() => handleOpenEditSub(item)}
              onDelete={() => handleDeleteSub(item)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={() => (
          <View className="items-center px-5 py-12">
            <View className="mb-4 rounded-full bg-primary/10 p-4">
              <Icon as={Tag} size={32} className="text-primary" />
            </View>
            <Text className="font-semibold text-foreground">Sin subcategorías</Text>
            <Text className="mt-1.5 text-center text-sm text-muted-foreground">
              Agrega subcategorías para organizar mejor esta categoría
            </Text>
            <Button onPress={handleOpenCreateSub} className="mt-5 gap-2" size="sm">
              <Icon as={Plus} size={16} className="text-primary-foreground" />
              <Text className="text-sm font-semibold text-primary-foreground">
                Nueva subcategoría
              </Text>
            </Button>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />

      <CategoryFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSave={handleSave}
        isLoading={isFormLoading}
        editCategory={editingCategory}
        parentName={editingCategory ? undefined : name}
      />
    </View>
  );
}
