import * as React from 'react';
import { Modal, View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { ChevronRight, ChevronLeft, X } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { useCategories } from '../queries/use-categories';
import type { Category } from '../types';

interface BreadcrumbItem {
  slug: string;
  name: string;
  children: Category[];
}

// ─── Internal drill-down modal ──────────────────────────────────────────────

function CategoryPickerModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (slug: string, name: string) => void;
}) {
  const { data: rootCategories, isLoading } = useCategories();

  const [breadcrumb, setBreadcrumb] = React.useState<BreadcrumbItem[]>([]);

  React.useEffect(() => {
    if (visible) setBreadcrumb([]);
  }, [visible]);

  const currentItems: Category[] =
    breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].children : (rootCategories ?? []);

  const drillIn = (category: Category) => {
    setBreadcrumb((prev) => [
      ...prev,
      { slug: category.slug, name: category.name, children: category.children },
    ]);
  };

  const drillOut = () => setBreadcrumb((prev) => prev.slice(0, -1));

  const isRoot = breadcrumb.length === 0;
  const currentTitle = breadcrumb.at(-1)?.name ?? 'Seleccionar categoría';
  const parentLabel =
    breadcrumb.length > 1 ? breadcrumb.slice(0, -1).map((b) => b.name).join(' › ') : null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border px-5 pb-4 pt-14">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={isRoot ? onClose : drillOut}
              className="rounded-full p-1.5 active:bg-muted">
              <Icon as={isRoot ? X : ChevronLeft} size={22} className="text-foreground" />
            </Pressable>
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">{currentTitle}</Text>
              {parentLabel && (
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                  {parentLabel}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* "Sin categoría" at root */}
        {isRoot && (
          <Pressable
            onPress={() => { onSelect('', 'Sin categoría'); onClose(); }}
            className="flex-row items-center gap-4 border-b border-border px-5 py-4 active:bg-muted/50">
            <View className="h-3 w-3 rounded-sm border border-muted-foreground/40" />
            <Text className="flex-1 text-sm text-muted-foreground">Sin categoría</Text>
          </Pressable>
        )}

        {isLoading && isRoot ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#D9711A" />
          </View>
        ) : (
          <FlatList
            data={currentItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="flex-row items-stretch border-b border-border">
                {/* Tap body = select */}
                <Pressable
                  onPress={() => { onSelect(item.slug, item.name); onClose(); }}
                  className="flex-1 flex-row items-center px-5 py-4 active:bg-muted/40">
                  <Text className="flex-1 text-sm font-medium text-foreground">{item.name}</Text>
                </Pressable>

                {/* Tap › = drill into children */}
                {item.children.length > 0 && (
                  <Pressable
                    onPress={() => drillIn(item)}
                    className="items-center justify-center border-l border-border px-4 active:bg-muted/40">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs text-muted-foreground">{item.children.length}</Text>
                      <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
                    </View>
                  </Pressable>
                )}
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="items-center justify-center py-20">
                <Text className="text-sm text-muted-foreground">Sin subcategorías</Text>
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

// ─── Public picker trigger ───────────────────────────────────────────────────

interface CategoryPickerProps {
  value: string | null;
  valueName: string | null;
  onChange: (slug: string | null, name: string | null) => void;
}

export function CategoryPicker({ value, valueName, onChange }: CategoryPickerProps) {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="h-12 flex-row items-center justify-between rounded-xl border border-border bg-background px-4 active:bg-muted/30">
        <Text
          className={`flex-1 text-sm ${!valueName || valueName === 'Sin categoría' ? 'text-muted-foreground' : 'text-foreground'}`}
          numberOfLines={1}>
          {valueName ?? 'Seleccionar categoría...'}
        </Text>
        <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
      </Pressable>

      <CategoryPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(slug, name) => onChange(slug || null, name)}
      />
    </>
  );
}
