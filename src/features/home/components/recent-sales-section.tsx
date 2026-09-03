import * as React from 'react';
import { Pressable, View } from 'react-native';

import { ArrowRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import type { Transaction } from '../types';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface RecentSalesSectionProps {
  transactions: Transaction[];
}

/**
 * Sales shown as ticket stubs: a colored spine instead of an icon +
 * connector line, amount in the same weight/scale as the price tags above.
 */
export function RecentSalesSection({ transactions }: RecentSalesSectionProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-black uppercase tracking-tight">Últimas Ventas</Text>
        <Pressable
          className="flex-row items-center gap-1 rounded-full px-3 py-1.5 active:opacity-70"
          style={{ backgroundColor: theme.accent + '1A' }}>
          <Text className="text-xs font-bold" style={{ color: theme.accent }}>
            Ver todo
          </Text>
          <Icon as={ArrowRight} size={14} color={theme.accent} />
        </Pressable>
      </View>

      <View className="gap-2.5">
        {transactions.map((transaction) => (
          <Pressable
            key={transaction.id}
            className="flex-row items-center overflow-hidden rounded-lg border active:opacity-70"
            style={{ borderColor: theme.ink + '30' }}>
            <View className="self-stretch" style={{ width: 5, backgroundColor: theme.ok }} />
            <View className="flex-1 flex-row items-center justify-between px-3.5 py-3">
              <View className="flex-1 pr-2">
                <Text className="text-sm font-bold" numberOfLines={1}>
                  {transaction.name}
                </Text>
                <Text className="mt-0.5 text-xs text-muted-foreground">{transaction.date}</Text>
              </View>
              <Text className="text-base font-black" style={{ color: theme.ok }}>
                S/ {transaction.amount.toFixed(2)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {transactions.length === 0 && (
        <View className="items-center rounded-lg border border-dashed border-muted-foreground/30 p-8">
          <Text className="mb-1 text-base font-bold text-foreground">No hay ventas aún</Text>
          <Text className="text-center text-sm text-muted-foreground">
            Las ventas aparecerán aquí
          </Text>
        </View>
      )}
    </View>
  );
}
