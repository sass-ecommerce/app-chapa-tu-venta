import * as React from 'react';
import { Pressable, View } from 'react-native';

import { Plus, Search } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface QuickSaleBarProps {
  onPress?: () => void;
}

/**
 * Reuses the reference app's search-bar shape for the seller's actual
 * top task — logging a sale — instead of product search, which this
 * home screen has no use for.
 */
export function QuickSaleBar({ onPress }: QuickSaleBarProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <Pressable
      onPress={onPress}
      className="mb-5 h-[52px] flex-row items-center gap-2.5 rounded-full border pl-4 pr-1.5 active:opacity-80"
      style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface }}>
      <Icon as={Search} size={17} color={theme.muted} />
      <Text className="flex-1 text-[12.5px] font-medium" style={{ color: theme.muted }}>
        Registrar una venta…
      </Text>
      <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: theme.accent }}>
        <Icon as={Plus} size={18} color="#fff" />
      </View>
    </Pressable>
  );
}
