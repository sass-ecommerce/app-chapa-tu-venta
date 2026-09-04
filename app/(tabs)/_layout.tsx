import * as React from 'react';
import { View } from 'react-native';

import { Tabs } from 'expo-router';
import { HomeIcon, ShoppingBagIcon, UserIcon, type LucideIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Icon } from '@/shared/components/ui/icon';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface TabIconProps {
  as: LucideIcon;
  focused: boolean;
  color: string;
  size: number;
}

/** Icon + a small indicator bar that appears above it when the tab is active. */
function TabIcon({ as: IconCmp, focused, color, size }: TabIconProps) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 8 }}>
      {focused && (
        <View
          style={{
            position: 'absolute',
            top: -2,
            width: 20,
            height: 3,
            borderRadius: 100,
            backgroundColor: color,
          }}
        />
      )}
      <Icon as={IconCmp} size={size} color={color} />
    </View>
  );
}

/**
 * Docked bottom bar — labels always visible, no floating overlay. Content
 * screens don't need extra bottom padding for this: it's part of layout,
 * not drawn on top of it.
 */
export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.muted + '20',
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon as={HomeIcon} focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon as={ShoppingBagIcon} focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon as={UserIcon} focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
