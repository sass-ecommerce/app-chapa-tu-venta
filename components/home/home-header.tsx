import * as React from 'react';
import { Pressable, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Settings } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
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
export function HomeHeader({
  firstName,
  lastName,
  avatarUrl,
  onNotificationsPress,
  onSettingsPress,
  notificationCount = 0,
}: HomeHeaderProps) {
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

  const formattedDate = currentTime.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const formattedTime = currentTime.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Get user initials for avatar fallback
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <View className="mb-6 pt-12">
      {/* Top Row: Date/Time and Actions */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xs capitalize text-muted-foreground">{formattedDate}</Text>
          <Text className="text-sm font-semibold text-muted-foreground">{formattedTime}</Text>
        </View>

        <View className="flex-row items-center gap-3">
          {/* Notifications Button */}
          <Pressable
            onPress={onNotificationsPress}
            className="relative h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-70">
            <Icon as={Bell} size={20} className="text-foreground" />
            {notificationCount > 0 && (
              <View className="absolute right-0 top-0 h-5 w-5 items-center justify-center rounded-full bg-destructive">
                <Text className="text-xs font-bold text-destructive-foreground">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Settings Button */}
          <Pressable
            onPress={onSettingsPress}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-70">
            <Icon as={Settings} size={20} className="text-foreground" />
          </Pressable>
        </View>
      </View>

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
