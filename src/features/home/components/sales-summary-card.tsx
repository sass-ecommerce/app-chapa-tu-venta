import * as React from 'react';
import { View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';

import { AnimatedNumber } from './animated-number';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';
import type { SalesSummary } from '../types';

interface SalesSummaryCardProps {
  salesData: SalesSummary;
}

interface StatChipProps {
  color: string;
  value: number;
  label: string;
}

function StatChip({ color, value, label }: StatChipProps) {
  return (
    <View
      className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5"
      style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
      <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-[10.5px] font-bold text-white">
        {value} {label}
      </Text>
    </View>
  );
}

/**
 * "Vendiste hoy" as a gradient balance card — the escaparate system's
 * reinterpretation of the reference app's promo carousel. A ghost card
 * peeks behind it for depth; the 3 order states are soft chips instead
 * of separate stat tiles.
 */
export function SalesSummaryCard({ salesData }: SalesSummaryCardProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <View className="mb-6 pt-2">
      <View
        className="absolute bottom-[-6px] left-6 right-[-4px] top-4 rounded-[26px] opacity-40"
        style={{ backgroundColor: theme.accent }}
      />
      <LinearGradient
        colors={[theme.accent, theme.accent2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 26, paddingHorizontal: 20, paddingVertical: 18 }}>
        <Text className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Resumen de hoy
        </Text>
        <AnimatedNumber
          value={salesData.totalSales}
          duration={1200}
          decimals={2}
          prefix="S/ "
          className="mt-1 text-[32px] font-extrabold"
          style={{ color: '#FFFFFF', letterSpacing: -0.5 }}
        />
        <View className="mt-3 flex-row flex-wrap gap-1.5">
          <StatChip color="#FFFFFF" value={salesData.completedOrders} label="completas" />
          <StatChip color="#FFD98A" value={salesData.pendingPaymentOrders} label="pend." />
          <StatChip color="#FF9E9E" value={salesData.cancelledOrders} label="anul." />
        </View>
      </LinearGradient>
    </View>
  );
}
