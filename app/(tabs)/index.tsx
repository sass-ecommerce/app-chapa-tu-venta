import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useUser } from '@clerk/clerk-expo';
import { Search, Bell, Plus, MoreVertical, Apple, ShoppingBag } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Aquí puedes agregar la lógica para recargar los datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const upcomingPayments = [
    {
      id: 1,
      name: 'Adobe Premium',
      amount: 30,
      daysLeft: 2,
      icon: 'A',
      color: '#7c3aed',
    },
    {
      id: 2,
      name: 'Apple Premium',
      amount: 30,
      daysLeft: 2,
      icon: <Icon as={Apple} className="text-foreground" size={32} />,
      color: '#ffffff',
      isDark: colorScheme === 'dark' ? false : true,
    },
  ];

  const transactions = [
    {
      id: 1,
      name: 'Apple Inc.',
      date: '21 Sep, 03:02 PM',
      amount: -230.5,
      icon: <Icon as={Apple} className="text-foreground" size={24} />,
    },
    {
      id: 2,
      name: 'Adobe',
      date: '21 Sep, 03:22 PM',
      amount: -130.5,
      icon: 'A',
    },
    {
      id: 3,
      name: 'Amazon',
      date: '21 Sep, 02:02',
      amount: -20.5,
      icon: 'a',
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
            <Text className="text-base font-normal text-muted-foreground">Hello,</Text>
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
              <Text className="mb-1 text-sm text-white/80">Current Balance</Text>
              <Text className="text-4xl font-bold text-white">$4,570.80</Text>
            </View>
            <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-full bg-white/30">
              <Icon as={Plus} className="text-white" size={24} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Upcoming Payment Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground">Upcoming payment</Text>
            <TouchableOpacity>
              <Text className="text-sm text-muted-foreground">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
            {upcomingPayments.map((payment, index) => (
              <View
                key={payment.id}
                style={{
                  backgroundColor: payment.color,
                  marginRight: index < upcomingPayments.length - 1 ? 12 : 0,
                }}
                className="w-40 rounded-2xl p-4">
                <View className="mb-4 flex-row items-start justify-between">
                  {typeof payment.icon === 'string' ? (
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-white/30">
                      <Text className="text-2xl font-bold text-white">{payment.icon}</Text>
                    </View>
                  ) : (
                    <View
                      className={`h-12 w-12 items-center justify-center rounded-full ${
                        payment.isDark ? 'bg-muted' : 'bg-white/30'
                      }`}>
                      {payment.icon}
                    </View>
                  )}
                  <TouchableOpacity>
                    <Icon
                      as={MoreVertical}
                      className={payment.isDark ? 'text-foreground' : 'text-white'}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  className={`mb-1 text-base font-semibold ${
                    payment.isDark ? 'text-foreground' : 'text-white'
                  }`}>
                  {payment.name}
                </Text>
                <Text
                  className={`text-sm ${payment.isDark ? 'text-muted-foreground' : 'text-white/80'}`}>
                  ${payment.amount}/month
                </Text>
                <Text
                  className={`text-xs ${payment.isDark ? 'text-muted-foreground' : 'text-white/60'}`}>
                  {payment.daysLeft} days left
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Transactions Section */}
        <View>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground">Recent Transactions</Text>
            <TouchableOpacity>
              <Text className="text-sm text-muted-foreground">See all</Text>
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
                <Text className="text-base font-semibold text-red-500">
                  ${transaction.amount.toFixed(2)}
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
