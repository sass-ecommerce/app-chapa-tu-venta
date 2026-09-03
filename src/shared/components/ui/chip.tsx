import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { PriceTag } from '@/shared/components/ui/price-tag';
import { Text } from '@/shared/components/ui/text';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
  /** Overrides the selected fill (defaults to the Vitrina accent). */
  accentColor?: string;
  accentForeground?: string;
}

/**
 * A category filter shaped like a small price tag — same silhouette as the
 * product cards and category rows, so filtering reads as "picking a tag"
 * rather than a generic pill.
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
    <Pressable onPress={onPress} className="active:opacity-80">
      <PriceTag
        fill={selected ? fillColor : theme.surface}
        stroke={selected ? fillColor : theme.ink}
        holeColor={theme.bg}
        cut={10}
        strokeWidth={selected ? 2 : 1.5}>
        <View className="flex-row items-center gap-1.5 px-3.5 py-2">
          <Text
            className="text-sm font-bold"
            style={{ color: selected ? accentForeground : theme.ink }}>
            {label}
          </Text>
          {count !== undefined && count > 0 && (
            <View
              className="min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5"
              style={{ backgroundColor: selected ? 'rgba(255,255,255,0.25)' : theme.ink + '14' }}>
              <Text
                className="text-xs font-bold"
                style={{ color: selected ? accentForeground : theme.muted }}>
                {count}
              </Text>
            </View>
          )}
        </View>
      </PriceTag>
    </Pressable>
  );
}
