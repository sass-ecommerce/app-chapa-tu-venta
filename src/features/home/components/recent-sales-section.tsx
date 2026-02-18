import * as React from 'react';
import { Pressable, View } from 'react-native';

import { ArrowRight } from 'lucide-react-native';

import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import type { Transaction } from '../types';

interface RecentSalesSectionProps {
  transactions: Transaction[];
}

/**
 * Section displaying recent sales/transactions with timeline visual
 */
export function RecentSalesSection({ transactions }: RecentSalesSectionProps) {
  return (
    <View>
      {/* Enhanced Header with Icon */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-foreground">Últimas Ventas</Text>
        <Pressable className="flex-row items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 active:opacity-70">
          <Text className="text-sm font-semibold text-primary">Ver todo</Text>
          <Icon as={ArrowRight} size={16} className="text-primary" />
        </Pressable>
      </View>

      {/* Transaction List with Timeline */}
      <View className="gap-2">
        {transactions.map((transaction, index) => (
          <Pressable
            key={transaction.id}
            className="flex-row items-center rounded-2xl bg-card p-4 active:opacity-70"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}>
            {/* Icon Container with Gradient Border Effect */}
            <View className="relative mr-3">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                {typeof transaction.icon === 'string' ? (
                  <Text className="text-xl font-bold text-foreground">{transaction.icon}</Text>
                ) : (
                  transaction.icon
                )}
              </View>

              {/* Timeline Connector Line */}
              {index < transactions.length - 1 && (
                <View className="absolute left-1/2 top-14 h-8 w-0.5 -translate-x-1/2 bg-border" />
              )}
            </View>

            {/* Transaction Info */}
            <View className="flex-1">
              <Text className="mb-0.5 text-base font-semibold text-foreground">
                {transaction.name}
              </Text>
              <Text className="text-xs text-muted-foreground">{transaction.date}</Text>
            </View>

            {/* Amount with Enhanced Styling */}
            <View className="items-end">
              <View className="rounded-lg bg-green-500/10 px-3 py-1.5">
                <Text className="text-base font-bold text-green-600 dark:text-green-400">
                  S/ {transaction.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Empty State */}
      {transactions.length === 0 && (
        <View className="items-center rounded-2xl bg-muted/50 p-8">
          <Text className="mb-1 text-base font-semibold text-foreground">No hay ventas aún</Text>
          <Text className="text-center text-sm text-muted-foreground">
            Las ventas aparecerán aquí
          </Text>
        </View>
      )}
    </View>
  );
}
