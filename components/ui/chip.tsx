import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Chip({ label, selected = false, onPress, count, className }: ChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={cn(
        'flex-row items-center gap-2 rounded-full px-4 py-2.5 transition-colors',
        selected ? 'bg-primary shadow-sm shadow-primary/20' : 'border border-border bg-card',
        className
      )}>
      <Text
        className={cn(
          'text-sm font-semibold',
          selected ? 'text-primary-foreground' : 'text-foreground'
        )}>
        {label}
      </Text>
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
    </AnimatedPressable>
  );
}
