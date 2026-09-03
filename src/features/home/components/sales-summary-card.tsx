import * as React from 'react';
import { View } from 'react-native';

import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';

import { AnimatedNumber } from './animated-number';
import { PriceTag } from '@/shared/components/ui/price-tag';
import { getVitrinaTheme, type VitrinaTheme } from '@/shared/config/vitrina-palette';
import type { SalesSummary } from '../types';

interface SalesSummaryCardProps {
  salesData: SalesSummary;
}

interface StatTagProps {
  label: string;
  value: number;
  color: string;
  theme: VitrinaTheme;
}

function StatTag({ label, value, color, theme }: StatTagProps) {
  return (
    <PriceTag fill={theme.surface} stroke={theme.ink} holeColor={theme.bg} cut={12} className="flex-1">
      <View className="items-center px-2 py-3.5">
        <AnimatedNumber value={value} duration={800} className="text-2xl font-black" style={{ color }} />
        <Text
          className="mt-0.5 text-[10px] font-bold uppercase text-muted-foreground"
          style={{ letterSpacing: 0.4 }}>
          {label}
        </Text>
      </View>
    </PriceTag>
  );
}

/**
 * "Vendiste hoy" — three price-tag stats plus a big magenta total tag,
 * replacing the donut chart with the same tag silhouette used across
 * the screen (products, transactions). No chart, no gradient.
 */
export function SalesSummaryCard({ salesData }: SalesSummaryCardProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <View className="mb-6 gap-2">
      <View className="flex-row gap-2">
        <StatTag label="Completas" value={salesData.completedOrders} color={theme.ok} theme={theme} />
        <StatTag label="Pendientes" value={salesData.pendingPaymentOrders} color={theme.warn} theme={theme} />
        <StatTag label="Anuladas" value={salesData.cancelledOrders} color={theme.bad} theme={theme} />
      </View>

      <PriceTag fill={theme.accent} stroke={theme.surface} holeColor={theme.bg} cut={16} strokeWidth={2.25}>
        <View className="px-5 py-4">
          <Text className="text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Vendiste hoy
          </Text>
          <AnimatedNumber
            value={salesData.totalSales}
            duration={1200}
            decimals={2}
            prefix="S/ "
            className="mt-0.5 text-3xl font-black"
            style={{ color: '#FFFFFF' }}
          />
        </View>
      </PriceTag>
    </View>
  );
}
