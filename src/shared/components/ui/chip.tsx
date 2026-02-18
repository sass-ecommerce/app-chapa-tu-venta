import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Badge } from '@/shared/components/ui/badge';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils/utils';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
}

export function Chip({ label, selected = false, onPress, count }: ChipProps) {
  return (
    <Pressable onPress={onPress}>
      <Badge
        variant={selected ? 'default' : 'outline'}
        className={cn('gap-2 px-4 py-2.5', selected && 'shadow-sm shadow-primary/20')}>
        <Text className="text-sm font-semibold">{label}</Text>
        {count !== undefined && count > 0 && (
          <View
            className={cn(
              'min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5',
              selected ? 'bg-primary-foreground/20' : 'bg-muted'
            )}>
            <Text
              className={cn(
                'text-xs font-bold',
                selected ? 'text-primary-foreground' : 'text-muted-foreground'
              )}>
              {count}
            </Text>
          </View>
        )}
      </Badge>
    </Pressable>
  );
}
