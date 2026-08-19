import * as React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';

import { useProductsInfiniteQuery } from '@/features/products/queries';
import { ShoppingBag, Package } from 'lucide-react-native';

import { Icon } from '@/shared/components/ui/icon';

import { HomeHeader } from '@/features/home/components/home-header';
import { SalesSummaryCard } from '@/features/home/components/sales-summary-card';
import { RecentProductsSection } from '@/features/home/components/recent-products-section';
import { RecentSalesSection } from '@/features/home/components/recent-sales-section';

import type { SalesSummary, Transaction } from '@/features/home/types';
import { REFRESH_COLORS } from '@/shared/config/constants';

// Chart colors using project palette
const CHART_COLORS = {
  completed: '#4ade80', // green-400
  pending: '#facc15', // yellow-400
  cancelled: '#f87171', // red-400
};

// Mock sales summary data
const mockSalesData: SalesSummary = {
  totalSales: 4570.8,
  completedOrders: 25,
  pendingPaymentOrders: 12,
  cancelledOrders: 8,
};

// Mock transactions data
const transactions: Transaction[] = [
  {
    id: 1,
    name: 'Venta - Zapatillas Nike',
    date: '21 Sep, 03:02 PM',
    amount: 250.0,
    icon: <Icon as={ShoppingBag} className="text-foreground" size={24} />,
  },
  {
    id: 2,
    name: 'Venta - Polo Adidas',
    date: '21 Sep, 03:22 PM',
    amount: 89.5,
    icon: <Icon as={Package} className="text-foreground" size={24} />,
  },
  {
    id: 3,
    name: 'Venta - Pantalón Deportivo',
    date: '21 Sep, 02:02 PM',
    amount: 120.0,
    icon: <Icon as={ShoppingBag} className="text-foreground" size={24} />,
  },
];

export default function HomeScreen() {
  const { user } = {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      imageUrl: undefined,
    },
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const {
    data,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProductsInfiniteQuery();

  const recentProducts = data?.pages[0]?.products.slice(0, 5);

  // Pull-to-refresh handler
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchProducts();
    setRefreshing(false);
  }, [refetchProducts]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[REFRESH_COLORS.LIGHT]}
          tintColor={REFRESH_COLORS.LIGHT}
        />
      }>
      <View className="px-5 pt-12">
        {/* Modern Header with Avatar and Actions */}
        <HomeHeader
          firstName={user?.firstName}
          lastName={user?.lastName}
          avatarUrl={user?.imageUrl ?? undefined}
          notificationCount={3}
          onNotificationsPress={() => {
            console.log('📬 [Home] Notifications pressed');
            // TODO: Navigate to notifications screen
          }}
          onSettingsPress={() => {
            console.log('⚙️ [Home] Settings pressed');
            // TODO: Navigate to settings screen
          }}
        />

        {/* Sales Summary Card with Gradients */}
        <SalesSummaryCard salesData={mockSalesData} chartColors={CHART_COLORS} />

        {/* Recent Products Section with Skeletons */}
        <RecentProductsSection
          isLoading={productsLoading}
          error={productsError}
          products={recentProducts}
          onRefetch={refetchProducts}
        />

        {/* Recent Sales Section with Timeline */}
        <RecentSalesSection transactions={transactions} />

        {/* Extra space for bottom nav */}
        <View className="h-6" />
      </View>
    </ScrollView>
  );
}
