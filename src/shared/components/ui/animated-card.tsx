import * as React from 'react';
import { ViewProps, View } from 'react-native';

import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { Card } from './card';
import { ANIMATION } from '@/shared/config/constants';

interface AnimatedCardProps extends ViewProps {
  delay?: number;
  children?: React.ReactNode;
}

export function AnimatedCard({ children, delay = 0, ...props }: AnimatedCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .duration(ANIMATION.DURATION.NORMAL)
        .springify()
        .reduceMotion(ReduceMotion.System)}>
      <Card {...props}>{children}</Card>
    </Animated.View>
  );
}
