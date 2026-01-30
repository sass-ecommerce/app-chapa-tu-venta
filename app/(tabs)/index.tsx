import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useUser } from '@clerk/clerk-expo';
import {
  Search,
  Bell,
  Plus,
  MoreVertical,
  Apple,
  ShoppingBag,
  Package,
  CreditCard,
  Truck,
  Shirt,
  Footprints,
  Watch,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ONBOARDING_STEPS } from '@/lib/constants';

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    console.log('User metadata in index:', user?.unsafeMetadata);
    if (user?.unsafeMetadata?.lastStep === ONBOARDING_STEPS.REGISTER_STORE) {
      router.replace('/(onboarding)/register-store');
    }
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Aquí puedes agregar la lógica para recargar los datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const recentProducts = [
    {
      id: 1,
      name: 'Zapatillas Nike Air',
      price: 250.0,
      stock: 15,
      icon: <Icon as={Footprints} className="text-foreground" size={32} />,
      color: '#7c3aed',
    },
    {
      id: 2,
      name: 'Polo Adidas',
      price: 89.5,
      stock: 32,
      icon: <Icon as={Shirt} className="text-foreground" size={32} />,
      color: '#ffffff',
      isDark: colorScheme === 'dark' ? false : true,
    },
    {
      id: 3,
      name: 'Reloj Casio',
      price: 180.0,
      stock: 8,
      icon: <Icon as={Watch} className="text-foreground" size={32} />,
      color: '#7c3aed',
    },
  ];

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

        {/* Current Balance Card */}
        <LinearGradient
          colors={['#a78bfa', '#c4b5fd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mb-6 overflow-hidden rounded-3xl p-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="mb-1 text-sm text-white/80">Saldo Actual</Text>
              <Text className="text-4xl font-bold text-white">S/ 4,570.80</Text>
            </View>
            <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-full bg-white/30">
              <Icon as={Plus} className="text-white" size={24} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Recent Products Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground">Últimos Productos Agregados</Text>
            <TouchableOpacity>
              <Text className="text-sm text-muted-foreground">Ver todo</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
            {recentProducts.map((product, index) => (
              <View
                key={product.id}
                style={{
                  backgroundColor: product.color,
                  marginRight: index < recentProducts.length - 1 ? 12 : 0,
                  borderWidth: product.isDark ? 1 : 0,
                  borderColor: product.isDark ? '#e5e7eb' : 'transparent',
                }}
                className="w-40 rounded-2xl p-4">
                <View className="mb-4 flex-row items-start justify-between">
                  <View
                    className={`h-12 w-12 items-center justify-center rounded-full ${
                      product.isDark ? 'bg-muted' : 'bg-white/30'
                    }`}>
                    {product.icon}
                  </View>
                  <TouchableOpacity>
                    <Icon
                      as={MoreVertical}
                      className={product.isDark ? 'text-foreground' : 'text-white'}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  className={`mb-1 text-base font-semibold ${
                    product.isDark ? 'text-foreground' : 'text-white'
                  }`}>
                  {product.name}
                </Text>
                <Text
                  className={`text-sm ${product.isDark ? 'text-muted-foreground' : 'text-white/80'}`}>
                  S/ {product.price.toFixed(2)}
                </Text>
                <Text
                  className={`text-xs ${product.isDark ? 'text-muted-foreground' : 'text-white/60'}`}>
                  Stock: {product.stock} unidades
                </Text>
              </View>
            ))}
          </ScrollView>
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
