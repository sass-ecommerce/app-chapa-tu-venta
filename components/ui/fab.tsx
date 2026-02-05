import * as React from 'react';
import { Pressable } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SlideInUp,
  FadeIn,
  ReduceMotion,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';

import { cn } from '@/lib/utils';
import { ANIMATION } from '@/lib/constants';

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  className?: string;
  size?: 'default' | 'large';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FAB({ onPress, icon, className, size = 'default' }: FABProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, ANIMATION.SPRING);
    rotation.value = withSpring(90, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.SPRING);
    rotation.value = withSpring(0, { damping: 15, stiffness: 200 });
  };

  const sizeClasses = {
    default: 'h-14 w-14',
    large: 'h-16 w-16',
  };

  const iconSize = size === 'large' ? 28 : 24;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      entering={SlideInUp.springify()
        .damping(ANIMATION.BOUNCE.damping)
        .stiffness(ANIMATION.BOUNCE.stiffness)
        .reduceMotion(ReduceMotion.System)}
      className={cn(
        'items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30',
        sizeClasses[size],
        className
      )}
      accessibilityRole="button"
      accessibilityLabel="Crear producto">
      {icon || <Plus size={iconSize} color="white" strokeWidth={2.5} />}
    </AnimatedPressable>
  );
}
