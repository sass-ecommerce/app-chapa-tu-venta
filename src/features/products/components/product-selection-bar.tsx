import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Trash2, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';
import {
  SELECTION_MODE_ENTERING,
  SELECTION_MODE_EXITING,
} from '@/features/products/utils/selection-motion';

interface ProductSelectionBarProps {
  count: number;
  onCancel: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

export function ProductSelectionBar({
  count,
  onCancel,
  onDelete,
  deleting = false,
}: ProductSelectionBarProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <Animated.View
      entering={SELECTION_MODE_ENTERING}
      exiting={SELECTION_MODE_EXITING}
      className="absolute bottom-6 left-5 right-5 z-50 flex-row items-center justify-between rounded-2xl border px-4 py-3"
      style={{ borderColor: theme.muted + '25', backgroundColor: theme.surface, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 }}>
      <Pressable
        onPress={onCancel}
        className="flex-row items-center gap-2 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Cancelar selección">
        <Icon as={X} size={18} color={theme.ink} />
        <Text className="text-sm font-bold" style={{ color: theme.ink }}>
          {count} {count === 1 ? 'seleccionado' : 'seleccionados'}
        </Text>
      </Pressable>

      <Pressable
        onPress={onDelete}
        disabled={deleting}
        className="flex-row items-center gap-2 rounded-md px-4 py-2 active:opacity-80 disabled:opacity-50"
        style={{ backgroundColor: theme.bad }}
        accessibilityRole="button"
        accessibilityLabel="Eliminar productos seleccionados">
        <Icon as={Trash2} size={16} color="#fff" />
        <Text className="text-sm font-bold text-white">
          {deleting ? 'Eliminando…' : 'Eliminar'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
