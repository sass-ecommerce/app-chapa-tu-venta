import * as React from 'react';
import { View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useColorScheme } from 'nativewind';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { AnimatedNumber } from './animated-number';
import type { ChartColors, SalesSummary } from './types';

interface SalesSummaryCardProps {
  salesData: SalesSummary;
  chartColors: ChartColors;
}

export function SalesSummaryCard({ salesData, chartColors }: SalesSummaryCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Memoize chart data to avoid recalculation on every render
  const chartData = React.useMemo(
    () => [
      {
        value: salesData.completedOrders,
        color: chartColors.completed,
      },
      {
        value: salesData.pendingPaymentOrders,
        color: chartColors.pending,
      },
      {
        value: salesData.cancelledOrders,
        color: chartColors.cancelled,
      },
    ],
    [salesData, chartColors]
  );

  // Get inner circle color based on theme for donut chart
  const innerCircleColor = isDark ? '#0a0a0a' : '#ffffff';

  // Gradient colors for card background
  const gradientColors = isDark
    ? (['#1e1b4b', '#312e81', '#3730a3'] as [string, string, ...string[]])
    : (['#f5f3ff', '#ede9fe', '#e9d5ff'] as [string, string, ...string[]]);

  return (
    <View className="mb-6 overflow-hidden rounded-3xl shadow-lg shadow-primary/20">
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View className="p-6">
          {/* Title with Subtitle */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-foreground">Resumen de Ventas</Text>
            <Text className="mt-1 text-sm text-muted-foreground">Rendimiento de hoy</Text>
          </View>

          {/* Horizontal Layout: Chart + Metrics */}
          <View className="flex-row items-center justify-between">
            {/* Left Side: Enhanced Donut Chart with Shadow */}
            <View className="items-center justify-center" style={{ width: 150, height: 150 }}>
              {/* Chart Shadow Effect */}
              <View
                className="absolute rounded-full bg-primary/10"
                style={{ width: 140, height: 140 }}
              />

              <PieChart
                data={chartData}
                donut
                radius={75}
                innerRadius={55}
                innerCircleColor={innerCircleColor}
                focusOnPress={false}
                showText={false}
                isAnimated
                animationDuration={1000}
              />

              {/* Center Label with Animated Number */}
              <View className="absolute items-center justify-center">
                <Text className="text-xs text-muted-foreground">Total</Text>
                <AnimatedNumber
                  value={salesData.totalSales}
                  duration={1200}
                  className="text-2xl font-bold text-foreground"
                  prefix="S/ "
                  decimals={2}
                />
              </View>
            </View>

            {/* Right Side: Enhanced Metrics with Icons */}
            <View className="flex-1 gap-4 pl-6">
              {/* Metric 1: Completed Orders */}
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: chartColors.completed + '20' }}>
                  <Icon as={CheckCircle2} size={20} className="text-green-400" />
                </View>
                <View className="flex-1">
                  <AnimatedNumber
                    value={salesData.completedOrders}
                    duration={800}
                    className="text-2xl font-bold text-foreground"
                  />
                  <Text className="text-xs text-muted-foreground">Completos</Text>
                </View>
              </View>

              {/* Metric 2: Pending Payment Orders */}
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: chartColors.pending + '20' }}>
                  <Icon as={Clock} size={20} className="text-yellow-400" />
                </View>
                <View className="flex-1">
                  <AnimatedNumber
                    value={salesData.pendingPaymentOrders}
                    duration={800}
                    className="text-2xl font-bold text-foreground"
                  />
                  <Text className="text-xs text-muted-foreground">Pendientes</Text>
                </View>
              </View>

              {/* Metric 3: Cancelled Orders */}
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: chartColors.cancelled + '20' }}>
                  <Icon as={XCircle} size={20} className="text-red-400" />
                </View>
                <View className="flex-1">
                  <AnimatedNumber
                    value={salesData.cancelledOrders}
                    duration={800}
                    className="text-2xl font-bold text-foreground"
                  />
                  <Text className="text-xs text-muted-foreground">Cancelados</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
