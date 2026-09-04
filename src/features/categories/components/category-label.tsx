import * as React from 'react';
import { View, Alert, Pressable } from 'react-native';
import { ChevronRight, MoreHorizontal, Pencil, Tag, Trash2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';
import type { Category } from '../types';

interface CategoryLabelProps {
  category: Category;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryLabel({ category, onPress, onEdit, onDelete }: CategoryLabelProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  const handleDeleteConfirm = () => {
    Alert.alert('Eliminar categoría', `¿Eliminar "${category.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View
      className="flex-row items-stretch rounded-2xl border"
      style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface }}>
      <Pressable
        onPress={onPress}
        className="flex-1 flex-row items-center gap-3 py-3.5 pl-3.5 pr-2 active:opacity-70">
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: theme.accent + '14' }}>
          <Icon as={Tag} size={18} color={theme.accent} />
        </View>
        <Text className="flex-1 text-sm font-bold" numberOfLines={1}>
          {category.name}
        </Text>
        {category.childrenCount > 0 && (
          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: theme.accent + '14' }}>
            <Text className="text-xs font-bold" style={{ color: theme.accent }}>
              {category.childrenCount}
            </Text>
          </View>
        )}
      </Pressable>

      <View className="flex-row items-center gap-1 pr-3">
        <Popover>
          <PopoverTrigger asChild>
            <Pressable className="rounded-full p-2 active:opacity-70">
              <Icon as={MoreHorizontal} size={18} color={theme.muted} />
            </Pressable>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-40 rounded-2xl border p-0"
            style={{ borderColor: theme.muted + '25', backgroundColor: theme.surface }}>
            <Pressable
              onPress={onEdit}
              className="flex-row items-center gap-3 px-4 py-3 active:opacity-70">
              <Pencil size={16} color={theme.ink} />
              <Text className="text-sm">Editar</Text>
            </Pressable>
            <View className="h-px" style={{ backgroundColor: theme.muted + '20' }} />
            <Pressable
              onPress={handleDeleteConfirm}
              className="flex-row items-center gap-3 px-4 py-3 active:opacity-70">
              <Trash2 size={16} color={theme.bad} />
              <Text className="text-sm font-semibold" style={{ color: theme.bad }}>
                Eliminar
              </Text>
            </Pressable>
          </PopoverContent>
        </Popover>

        <Icon as={ChevronRight} size={16} color={theme.muted} />
      </View>
    </View>
  );
}
