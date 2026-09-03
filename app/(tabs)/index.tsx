import * as React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';

import { useColorScheme } from 'nativewind';

import { useProductsInfiniteQuery } from '@/features/products/queries';

import { HomeHeader } from '@/features/home/components/home-header';
import { SalesSummaryCard } from '@/features/home/components/sales-summary-card';
import { RecentProductsSection } from '@/features/home/components/recent-products-section';
import { RecentSalesSection } from '@/features/home/components/recent-sales-section';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

import type { SalesSummary, Transaction } from '@/features/home/types';

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
  },
  {
    id: 2,
    name: 'Venta - Polo Adidas',
    date: '21 Sep, 03:22 PM',
    amount: 89.5,
  },
  {
    id: 3,
    name: 'Venta - Pantalón Deportivo',
    date: '21 Sep, 02:02 PM',
    amount: 120.0,
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
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');
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
      className="flex-1 bg-[#FBF9F4] dark:bg-[#18140F]"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.accent]}
          tintColor={theme.accent}
        />
      }>
      <View className="px-5 pt-12">
        {/* Vitrina de mercado header: bold greeting + date sticker */}
        <HomeHeader
          firstName={user?.firstName}
          lastName={user?.lastName}
          avatarUrl={user?.imageUrl ?? undefined}
          notificationCount={3}
          onNotificationsPress={() => {
            console.log('📬 [Home] Notifications pressed');
            // TODO: Navigate to notifications screen
          }}
        />

        {/* Sales stats as price tags, total as a magenta tag */}
        <SalesSummaryCard salesData={mockSalesData} />

        {/* Recent Products Section with Skeletons */}
        <RecentProductsSection
          isLoading={productsLoading}
          error={productsError}
          products={recentProducts}
          onRefetch={refetchProducts}
        />

        {/* Recent Sales Section as ticket stubs */}
        <RecentSalesSection transactions={transactions} />

        {/* Extra space for bottom nav */}
        <View className="h-6" />
      </View>
    </ScrollView>
  );
}
