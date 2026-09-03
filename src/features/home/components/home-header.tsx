import * as React from 'react';
import { Pressable, View } from 'react-native';

import { Bell } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';

import { getVitrinaTheme } from '@/shared/config/vitrina-palette';

interface HomeHeaderProps {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
}

/**
 * Vitrina de mercado header: bold greeting, a magenta date sticker
 * (the price-tag detail), and a notification button in the same
 * outlined-tag language as the rest of the screen.
 */
export function HomeHeader({
  firstName,
  lastName,
  avatarUrl,
  notificationCount = 0,
  onNotificationsPress,
}: HomeHeaderProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');

  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  const dateLabel = now
    .toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
    .replace('.', '')
    .toUpperCase();

  return (
    <View className="mb-6 flex-row items-center justify-between gap-3">
      <View className="flex-1 flex-row items-center gap-3">
        <Avatar
          alt={`${firstName} ${lastName}`}
          className="h-14 w-14"
          style={{ borderWidth: 2, borderColor: theme.ink }}>
          {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
          <AvatarFallback>
            <Text className="text-lg font-black">{initials}</Text>
          </AvatarFallback>
        </Avatar>

        <View className="flex-1">
          <Text
            className="text-xl font-black uppercase leading-tight tracking-tight"
            numberOfLines={1}>
            ¡Hola, {firstName || 'vendedor'}!
          </Text>
          <View
            className="mt-1.5 self-start rounded-full px-2.5 py-1"
            style={{ backgroundColor: theme.accent }}>
            <Text className="text-[10px] font-bold text-white">{dateLabel}</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onNotificationsPress}
        className="h-11 w-11 items-center justify-center rounded-lg border active:opacity-70"
        style={{ borderColor: theme.ink }}>
        <Icon as={Bell} size={18} color={theme.ink} />
        {notificationCount > 0 && (
          <View
            className="absolute -right-1.5 -top-1.5 h-4 min-w-4 items-center justify-center rounded-full px-1"
            style={{ backgroundColor: theme.bad }}>
            <Text className="text-[9px] font-bold text-white">{notificationCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
