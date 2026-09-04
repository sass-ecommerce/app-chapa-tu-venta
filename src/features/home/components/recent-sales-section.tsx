import * as React from 'react';
import { Pressable, View } from 'react-native';

import { ArrowRight, ShoppingBag } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import type { Transaction } from '../types';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface RecentSalesSectionProps {
  transactions: Transaction[];
}

/**
 * Sales as statement rows: icon in a tinted circle, amount in the same
 * tabular scale as the balance card — replaces the ticket-stub-with-spine
 * from the market-stall system.
 */
export function RecentSalesSection({ transactions }: RecentSalesSectionProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-[15px] font-extrabold tracking-tight">Últimas ventas</Text>
        <Pressable
          className="flex-row items-center gap-1 rounded-full px-3 py-1.5 active:opacity-70"
          style={{ backgroundColor: theme.accent + '14' }}>
          <Text className="text-xs font-bold" style={{ color: theme.accent }}>
            Ver todo
          </Text>
          <Icon as={ArrowRight} size={14} color={theme.accent} />
        </Pressable>
      </View>

      <View className="gap-2">
        {transactions.map((transaction) => (
          <Pressable
            key={transaction.id}
            className="flex-row items-center gap-3 rounded-2xl border px-3.5 py-3 active:opacity-70"
            style={{ borderColor: theme.muted + '20', backgroundColor: theme.surface }}>
            <View
              className="h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: theme.ok + '1E' }}>
              <Icon as={ShoppingBag} size={16} color={theme.ok} />
            </View>
            <View className="flex-1 pr-2">
              <Text className="text-[13px] font-bold" numberOfLines={1}>
                {transaction.name}
              </Text>
              <Text className="mt-0.5 text-[11px] font-semibold" style={{ color: theme.muted }}>
                {transaction.date}
              </Text>
            </View>
            <Text className="text-[14px] font-extrabold" style={{ color: theme.ok }}>
              S/ {transaction.amount.toFixed(2)}
            </Text>
          </Pressable>
        ))}
      </View>

      {transactions.length === 0 && (
        <View
          className="items-center rounded-2xl border border-dashed p-8"
          style={{ borderColor: theme.muted + '35' }}>
          <Text className="mb-1 text-base font-bold text-foreground">No hay ventas aún</Text>
          <Text className="text-center text-sm" style={{ color: theme.muted }}>
            Las ventas aparecerán aquí
          </Text>
        </View>
      )}
    </View>
  );
}
