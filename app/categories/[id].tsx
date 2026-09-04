import * as React from 'react';
import { View, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
  useCategoryChildren,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/categories/queries/use-categories';
import type { Category, CreateCategoryData } from '@/features/categories/types';

export default function CategoryDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

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
          <Icon as={Plus} size={20} color={theme.accent} />
          <Text className="text-sm font-bold" style={{ color: theme.accent }}>
            Nueva sub
          </Text>
        </Pressable>
      }
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#F6F5FB] dark:bg-[#101018]">
        <Stack.Screen options={{ headerShown: false }} />
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F6F5FB] dark:bg-[#101018]">
      <Stack.Screen options={{ headerShown: false }} />
      {header}

      <FlatList
        data={subcategories}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={[theme.accent]}
            tintColor={theme.accent}
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
            <View className="mb-4 rounded-full p-4" style={{ backgroundColor: theme.accent + '1A' }}>
              <Icon as={Tag} size={32} color={theme.accent} />
            </View>
            <Text className="font-black uppercase tracking-tight">Sin subcategorías</Text>
            <Text className="mt-1.5 text-center text-sm text-muted-foreground">
              Agrega subcategorías para organizar mejor esta categoría
            </Text>
            <Button
              onPress={handleOpenCreateSub}
              className="mt-5 gap-2"
              size="sm"
              style={{ backgroundColor: theme.accent }}>
              <Icon as={Plus} size={16} color="#fff" />
              <Text className="text-sm font-bold text-white">Nueva subcategoría</Text>
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
