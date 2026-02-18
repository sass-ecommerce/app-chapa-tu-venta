import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';

interface GradientCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'muted';
  className?: string;
}

const GRADIENT_COLORS = {
  light: {
    primary: ['#f3e8ff', '#e9d5ff', '#ddd6fe'], // purple-100 → purple-200 → purple-300
    success: ['#d1fae5', '#a7f3d0', '#6ee7b7'], // green-100 → green-200 → green-300
    warning: ['#fef3c7', '#fde68a', '#fcd34d'], // yellow-100 → yellow-200 → yellow-300
    muted: ['#f9fafb', '#f3f4f6', '#e5e7eb'], // gray-50 → gray-100 → gray-200
  },
  dark: {
    primary: ['#2e1065', '#4c1d95', '#5b21b6'], // purple-950 → purple-900 → purple-800
    success: ['#022c22', '#064e3b', '#065f46'], // green-950 → green-900 → green-800
    warning: ['#451a03', '#78350f', '#92400e'], // yellow-950 → yellow-900 → yellow-800
    muted: ['#0a0a0a', '#171717', '#262626'], // neutral-950 → neutral-900 → neutral-800
  },
};

/**
 * Card with gradient background that adapts to theme
 * Provides subtle depth and visual interest
 */
export function GradientCard({
  children,
  variant = 'primary',
  className = '',
  ...props
}: GradientCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = isDark ? GRADIENT_COLORS.dark[variant] : GRADIENT_COLORS.light[variant];

  return (
    <View className={`overflow-hidden rounded-2xl ${className}`} {...props}>
      <LinearGradient
        colors={colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1">
        {children}
      </LinearGradient>
    </View>
  );
}
