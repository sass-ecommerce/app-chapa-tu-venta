import * as React from 'react';
import { View, DimensionValue } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  ReduceMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { cn } from '@/shared/utils/utils';

interface ShimmerSkeletonProps {
  className?: string;
  width?: DimensionValue;
  height?: DimensionValue;
}

export function ShimmerSkeleton({ className, width, height }: ShimmerSkeletonProps) {
  const shimmerTranslate = useSharedValue(-1);

  React.useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerTranslate.value, [-1, 1], [-300, 300]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      className={cn('overflow-hidden rounded-md bg-muted', className)}
      style={{ width, height }}>
      <Animated.View style={[{ width: '100%', height: '100%' }, animatedStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.15)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>
    </View>
  );
}
