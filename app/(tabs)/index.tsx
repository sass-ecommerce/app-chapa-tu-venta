import * as React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAuth, useUser } from '@clerk/clerk-expo';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { Search, Bell, ShoppingBag, Package, Flame } from 'lucide-react-native';
import { PieChart } from 'react-native-gifted-charts';

import { ONBOARDING_STEPS } from '@/lib/constants';
import { getRecentProducts } from '@/lib/api/products';

// Chart colors using project palette
const CHART_COLORS = {
  completed: '#4ade80', // green-400
  pending: '#facc15', // yellow-400
  cancelled: '#f87171', // red-400
};

// Mock sales summary data
interface SalesSummary {
  totalSales: number;
  completedOrders: number;
  pendingPaymentOrders: number;
  cancelledOrders: number;
}

const mockSalesData: SalesSummary = {
  totalSales: 4570.8,
  completedOrders: 25,
  pendingPaymentOrders: 12,
  cancelledOrders: 8,
};

// Prepare data for donut chart
const chartData = [
  {
    value: mockSalesData.completedOrders,
    color: CHART_COLORS.completed,
  },
  {
    value: mockSalesData.pendingPaymentOrders,
    color: CHART_COLORS.pending,
  },
  {
    value: mockSalesData.cancelledOrders,
    color: CHART_COLORS.cancelled,
  },
];

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  // Get inner circle color based on theme for donut chart
  const innerCircleColor = colorScheme === 'dark' ? '#0a0a0a' : '#ffffff';

  // Get storeSlug from user metadata
  const storeSlug = (user?.unsafeMetadata as { store?: { slug: string } })?.store?.slug;

  // Fetch recent products from API
  const {
    data: recentProducts,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['recentProducts', storeSlug],
    queryFn: async () => {
      if (!storeSlug) throw new Error('No se encontró el identificador de la tienda');
      const token = await getToken();
      if (!token) throw new Error('No se pudo obtener el token de autenticación');
      return getRecentProducts(storeSlug, token, 5, 0);
    },
    enabled: !!storeSlug,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  React.useEffect(() => {
    console.log('User metadata in index:', user?.unsafeMetadata);
    if (user?.unsafeMetadata?.lastStep === ONBOARDING_STEPS.REGISTER_STORE) {
      router.replace('/(onboarding)/register-store');
    }
  }, [user]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchProducts();
    setRefreshing(false);
  }, [refetchProducts]);

  // Helper function to get stock badge color based on stock level
  const getStockBadgeColor = (stock: number) => {
    if (stock > 10) return 'bg-green-500/10 text-green-600 dark:text-green-400';
    if (stock >= 3) return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    return 'bg-red-500/10 text-red-600 dark:text-red-400';
  };

  const transactions = [
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

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#7c3aed']} // Android
          tintColor="#7c3aed" // iOS
        />
      }>
      <View className="p-5">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between pt-12">
          <View>
            <Text className="text-base font-normal text-muted-foreground">Hola,</Text>
            <Text className="text-2xl font-bold text-foreground">
              {user?.firstName || 'Siyam'} {user?.lastName || 'Ahmed'}!
            </Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Icon as={Search} className="text-foreground" size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Icon as={Bell} className="text-foreground" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sales Summary Card with Donut Chart */}
        <Card className="mb-6 overflow-hidden bg-card p-6">
          {/* Title */}
          <Text className="mb-4 text-lg font-bold text-foreground">Resumen de Ventas Hoy</Text>

          {/* Horizontal Layout: Chart + Metrics */}
          <View className="flex-row items-center justify-between">
            {/* Left Side: Donut Chart */}
            <View className="items-center justify-center" style={{ width: 140, height: 140 }}>
              <PieChart
                data={chartData}
                donut
                radius={70}
                innerRadius={50}
                innerCircleColor={innerCircleColor}
                focusOnPress={false}
                showText={false}
                isAnimated
                animationDuration={800}
              />

              {/* Center Label */}
              <View className="absolute items-center justify-center">
                <Text className="text-2xl font-bold text-foreground">
                  S/{' '}
                  {mockSalesData.totalSales.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
                <Text className="text-xs text-muted-foreground">Venta Total</Text>
              </View>
            </View>

            {/* Right Side: Metrics List */}
            <View className="flex-1 gap-3 pl-6">
              {/* Metric 1: Completed Orders */}
              <View className="flex-row items-center gap-2">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: CHART_COLORS.completed }}
                />
                <View className="flex-1">
                  <Text className="text-xl font-bold text-foreground">
                    {mockSalesData.completedOrders}
                  </Text>
                  <Text className="text-xs text-muted-foreground">Pedidos Completos</Text>
                </View>
              </View>

              {/* Metric 2: Pending Payment Orders */}
              <View className="flex-row items-center gap-2">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: CHART_COLORS.pending }}
                />
                <View className="flex-1">
                  <Text className="text-xl font-bold text-foreground">
                    {mockSalesData.pendingPaymentOrders}
                  </Text>
                  <Text className="text-xs text-muted-foreground">Pendientes de Pago</Text>
                </View>
              </View>

              {/* Metric 3: Cancelled Orders */}
              <View className="flex-row items-center gap-2">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: CHART_COLORS.cancelled }}
                />
                <View className="flex-1">
                  <Text className="text-xl font-bold text-foreground">
                    {mockSalesData.cancelledOrders}
                  </Text>
                  <Text className="text-xs text-muted-foreground">Pedidos Cancelados</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Recent Products Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground">Últimos Productos Agregados</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
              <Text className="text-sm font-medium text-primary">Ver todo</Text>
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {productsLoading && (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color="#7c3aed" />
              <Text className="mt-2 text-sm text-muted-foreground">Cargando productos...</Text>
            </View>
          )}

          {/* Error State */}
          {productsError && (
            <View className="rounded-2xl bg-red-50 p-4 dark:bg-red-950/20">
              <Text className="text-sm font-semibold text-red-900 dark:text-red-100">
                Error al cargar productos
              </Text>
              <Text className="mt-1 text-xs text-red-700 dark:text-red-300">
                {productsError instanceof Error ? productsError.message : 'Error desconocido'}
              </Text>
            </View>
          )}

          {/* Products Scroll */}
          {!productsLoading && !productsError && recentProducts && recentProducts.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}>
              {recentProducts.map((product) => (
                <Pressable
                  key={product.slug}
                  onPress={() => router.push(`/products/${product.slug}`)}
                  className="active:opacity-70">
                  <Card className="w-40 overflow-hidden">
                    {/* Product Image */}
                    <View className="relative h-24 w-full bg-muted">
                      <Image
                        source={{ uri: product.imageUri }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />

                      {/* Trending Badge */}
                      {product.trending && (
                        <View className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full bg-orange-500 px-2 py-1">
                          <Icon as={Flame} size={12} className="text-white" />
                          <Text className="text-xs font-bold text-white">Hot</Text>
                        </View>
                      )}
                    </View>

                    {/* Product Info */}
                    <View className="p-2">
                      {/* Name */}
                      <Text className="mb-1 text-sm font-bold text-foreground" numberOfLines={1}>
                        {product.name}
                      </Text>

                      {/* Price */}
                      <View className="mb-1.5 flex-row items-center gap-2">
                        <Text className="text-base font-bold text-primary">
                          S/ {product.price.toFixed(2)}
                        </Text>
                        {product.priceList > product.price && (
                          <Text className="text-xs text-muted-foreground line-through">
                            S/ {product.priceList.toFixed(2)}
                          </Text>
                        )}
                      </View>

                      {/* Stock Badge */}
                      <View
                        className={`self-start rounded-full px-2 py-0.5 ${getStockBadgeColor(product.stockQuantity)}`}>
                        <Text className="text-xs font-semibold">
                          {product.stockQuantity} disponibles
                        </Text>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Empty State */}
          {!productsLoading &&
            !productsError &&
            (!recentProducts || recentProducts.length === 0) && (
              <View className="items-center rounded-2xl bg-muted p-6">
                <Text className="text-muted-foreground">No hay productos recientes</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/products')} className="mt-2">
                  <Text className="text-sm text-primary">Ir a productos</Text>
                </TouchableOpacity>
              </View>
            )}
        </View>

        {/* Recent Sales Section */}
        <View>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground">Últimas Ventas</Text>
            <TouchableOpacity>
              <Text className="text-sm text-muted-foreground">Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {transactions.map((transaction) => (
              <View
                key={transaction.id}
                className="flex-row items-center justify-between rounded-2xl bg-card p-4">
                <View className="flex-row items-center gap-3">
                  {typeof transaction.icon === 'string' ? (
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Text className="text-xl font-bold text-foreground">{transaction.icon}</Text>
                    </View>
                  ) : (
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
                      {transaction.icon}
                    </View>
                  )}
                  <View>
                    <Text className="text-base font-semibold text-foreground">
                      {transaction.name}
                    </Text>
                    <Text className="text-sm text-muted-foreground">{transaction.date}</Text>
                  </View>
                </View>
                <Text className="text-base font-semibold text-green-500">
                  S/ {transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Extra space for bottom nav */}
        <View className="h-6" />
      </View>
    </ScrollView>
  );
}
