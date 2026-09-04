import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
  /** Overrides the selected fill (defaults to the theme accent). */
  accentColor?: string;
  accentForeground?: string;
}

/**
 * A rounded filter pill — solid accent when selected, soft outline
 * otherwise. Same silhouette as the escaparate system's category chips.
 */
export function Chip({
  label,
  selected = false,
  onPress,
  count,
  accentColor,
  accentForeground = '#fff',
}: ChipProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');
  const fillColor = accentColor ?? theme.accent;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 active:opacity-80"
      style={{
        backgroundColor: selected ? fillColor : theme.surface,
        borderColor: selected ? fillColor : theme.muted + '25',
      }}>
      <Text className="text-sm font-bold" style={{ color: selected ? accentForeground : theme.ink }}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <View
          className="min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5"
          style={{ backgroundColor: selected ? 'rgba(255,255,255,0.25)' : theme.muted + '1A' }}>
          <Text className="text-xs font-bold" style={{ color: selected ? accentForeground : theme.muted }}>
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
