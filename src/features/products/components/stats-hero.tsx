import * as React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Text } from '@/shared/components/ui/text';
import { Card } from '@/shared/components/ui/card';
import { Package, CheckCircle, DollarSign } from 'lucide-react-native';
import type { Product } from '@/features/products/api/products';

function StatCard({
  icon,
  value,
  label,
  delay,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(600).springify()} className="flex-1">
      <Card className="items-center justify-center rounded-xl bg-card p-3 shadow-sm">
        <View className="mb-1.5 rounded-full bg-primary/10 p-1.5">{icon}</View>
        <Text className="text-xl font-bold tracking-tight text-foreground">{value}</Text>
        <Text className="text-[10px] font-medium text-muted-foreground">{label}</Text>
      </Card>
    </Animated.View>
  );
}

export function StatsHero({ products }: { products: Product[] }) {
  const stats = React.useMemo(() => {
    const totalProducts = products.length;
    const activeCount = products.filter((p) => p.isActive).length;
    const totalValue = products.reduce((sum, p) => sum + p.basePrice, 0);
    return { totalProducts, activeCount, formattedValue: `S/ ${(totalValue / 1000).toFixed(1)}K` };
  }, [products]);

  return (
    <View className="flex-row gap-2 px-5 pb-3">
      <StatCard icon={<Package size={16} className="text-primary" />} value={stats.totalProducts} label="Total" delay={0} />
      <StatCard icon={<CheckCircle size={16} className="text-primary" />} value={stats.activeCount} label="Activos" delay={100} />
      <StatCard icon={<DollarSign size={16} className="text-primary" />} value={stats.formattedValue} label="Valor Total" delay={200} />
    </View>
  );
}
