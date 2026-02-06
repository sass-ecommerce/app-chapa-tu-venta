import * as React from 'react';
import { View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';

interface HomeHeaderProps {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  onNotificationsPress?: () => void;
  onSettingsPress?: () => void;
  notificationCount?: number;
}

/**
 * Modern home header with gradient text, avatar, and action buttons
 */
export function HomeHeader({ firstName, lastName, avatarUrl }: HomeHeaderProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Get current date and time
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get user initials for avatar fallback
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <View className="mb-6">
      {/* Main Row: Avatar and Greeting */}
      <View className="flex-row items-center gap-4">
        {/* Avatar */}
        <Avatar alt={`${firstName} ${lastName}`} className="h-16 w-16 border-2 border-primary">
          {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
          <AvatarFallback>
            <Text className="text-xl font-bold text-primary-foreground">{initials}</Text>
          </AvatarFallback>
        </Avatar>

        {/* Greeting with Gradient Text */}
        <View className="flex-1">
          <Text className="text-base font-normal text-muted-foreground">Hola de nuevo,</Text>

          {/* Gradient Text Effect */}
          <View className="mt-1">
            <LinearGradient
              colors={
                isDark
                  ? (['#a78bfa', '#c084fc', '#e879f9'] as [string, string, ...string[]])
                  : (['#7c3aed', '#9333ea', '#a855f7'] as [string, string, ...string[]])
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 8 }}>
              <Text className="px-2 py-1 text-2xl font-bold text-white">
                {firstName || 'Usuario'} {lastName || ''}!
              </Text>
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  );
}
