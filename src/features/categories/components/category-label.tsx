import * as React from 'react';
import { View, Alert, Pressable } from 'react-native';
import { ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import type { Category } from '../types';

interface CategoryLabelProps {
  category: Category;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryLabel({ category, onPress, onEdit, onDelete }: CategoryLabelProps) {
  const handleDeleteConfirm = () => {
    Alert.alert('Eliminar categoría', `¿Eliminar "${category.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View className="flex-row items-stretch overflow-hidden rounded-xl border border-border bg-card">
      <Pressable
        onPress={onPress}
        className="flex-1 flex-row items-center gap-3 py-4 pl-4 pr-2 active:bg-muted/30">
        <Text className="flex-1 text-sm font-semibold text-foreground" numberOfLines={1}>
          {category.name}
        </Text>
      </Pressable>

      <View className="flex-row items-center gap-1 pr-3">
        <Popover>
          <PopoverTrigger asChild>
            <Pressable className="rounded-full p-2 active:bg-muted">
              <Icon as={MoreHorizontal} size={18} className="text-muted-foreground" />
            </Pressable>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-40 p-0">
            <Pressable
              onPress={onEdit}
              className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
              <Pencil size={16} color="#888" />
              <Text className="text-sm">Editar</Text>
            </Pressable>
            <View className="h-px bg-border" />
            <Pressable
              onPress={handleDeleteConfirm}
              className="flex-row items-center gap-3 px-4 py-3 active:bg-accent">
              <Trash2 size={16} color="#ef4444" />
              <Text className="text-sm text-destructive">Eliminar</Text>
            </Pressable>
          </PopoverContent>
        </Popover>

        <Icon as={ChevronRight} size={16} className="text-muted-foreground/60" />
      </View>
    </View>
  );
}
