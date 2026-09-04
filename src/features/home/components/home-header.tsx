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
 * Escaparate header: soft-bordered avatar and a plain greeting — no more
 * shouting uppercase or a solid-fill date sticker, just a muted caption.
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
  const dateLabel = now.toLocaleDateString('es-PE', { day: '2-digit', month: 'long' }).replace('.', '');

  return (
    <View className="mb-5 flex-row items-center justify-between gap-3">
      <View className="flex-1 flex-row items-center gap-3">
        <Avatar
          alt={`${firstName} ${lastName}`}
          className="h-12 w-12"
          style={{ borderWidth: 1, borderColor: theme.muted + '35' }}>
          {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
          <AvatarFallback>
            <Text className="text-base font-bold" style={{ color: theme.accent }}>
              {initials}
            </Text>
          </AvatarFallback>
        </Avatar>

        <View className="flex-1">
          <Text className="text-base font-bold leading-tight" numberOfLines={1}>
            Hola, {firstName || 'vendedor'}
          </Text>
          <Text className="mt-0.5 text-xs font-semibold capitalize" style={{ color: theme.muted }}>
            {dateLabel}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onNotificationsPress}
        className="h-11 w-11 items-center justify-center rounded-2xl border active:opacity-70"
        style={{ borderColor: theme.muted + '25', backgroundColor: theme.surface }}>
        <Icon as={Bell} size={18} color={theme.ink} />
        {notificationCount > 0 && (
          <View
            className="absolute -right-1 -top-1 h-4 min-w-4 items-center justify-center rounded-full border-2 px-1"
            style={{ backgroundColor: theme.bad, borderColor: theme.bg }}>
            <Text className="text-[9px] font-bold text-white">{notificationCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
