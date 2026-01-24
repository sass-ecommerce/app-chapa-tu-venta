import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { UserMenu } from '@/components/user-menu';
import { Tabs } from 'expo-router';
import { HomeIcon, ShoppingBagIcon, UserIcon, MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export default function TabsLayout() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const activeColor = colorScheme === 'dark' ? '#60A5FA' : '#3B82F6';
  const inactiveColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';

  const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => (
          <View className="top-safe flex-row justify-between border-b border-border bg-background px-4 py-2">
            <Button
              onPress={toggleColorScheme}
              size="icon"
              variant="ghost"
              className="rounded-full">
              <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-6" />
            </Button>
            <UserMenu />
          </View>
        ),
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="productos"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color, size }) => <ShoppingBagIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <UserIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
