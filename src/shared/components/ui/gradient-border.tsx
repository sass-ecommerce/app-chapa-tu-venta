import * as React from 'react';
import { View, ViewProps } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBorderProps extends ViewProps {
  colors?: readonly [string, string, ...string[]];
  borderWidth?: number;
  borderRadius?: number;
  animate?: boolean;
  duration?: number;
  children: React.ReactNode;
}

export function GradientBorder({
  colors = ['#8b5cf6', '#ec4899', '#8b5cf6'] as const,
  borderWidth = 2,
  borderRadius = 9999,
  animate = false,
  duration = 3000,
  children,
  style,
  ...props
}: GradientBorderProps) {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (animate) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration,
          easing: Easing.linear,
          reduceMotion: ReduceMotion.System,
        }),
        -1,
        false
      );
    }
  }, [animate, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const gradientSize = 200;
  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <View
      style={[
        {
          borderRadius,
          padding: borderWidth,
          overflow: 'hidden',
        },
        style,
      ]}
      {...props}>
      {animate ? (
        <AnimatedGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            {
              position: 'absolute',
              width: gradientSize,
              height: gradientSize,
              borderRadius,
            },
            animatedStyle,
          ]}
        />
      ) : (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius,
          }}
        />
      )}
      <View
        style={{
          borderRadius: borderRadius - borderWidth,
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}>
        {children}
      </View>
    </View>
  );
}
