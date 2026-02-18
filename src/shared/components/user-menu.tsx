import * as React from 'react';
import { View } from 'react-native';

import type { TriggerRef } from '@rn-primitives/popover';
import { LogOutIcon, PlusIcon, SettingsIcon } from 'lucide-react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Text } from '@/shared/components/ui/text';

import { useAuth, useUser } from '@/shared/hooks/hooks';

export function UserMenu() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const popoverTriggerRef = React.useRef<TriggerRef>(null);

  async function onSignOut() {
    popoverTriggerRef.current?.close();
    await signOut();
  }

  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <UserAvatar />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-80 p-0">
        <View className="gap-3 border-b border-border p-3">
          <View className="flex-row items-center gap-3">
            <UserAvatar className="size-10" />
            <View className="flex-1">
              <Text className="font-medium leading-5">
                {user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Usuario'}
              </Text>
              {user?.firstName && (
                <Text className="text-sm font-normal leading-4 text-muted-foreground">
                  {user.email}
                </Text>
              )}
            </View>
          </View>
          <View className="flex-row flex-wrap gap-3 py-0.5">
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                // TODO: Navigate to account settings screen
              }}>
              <Icon as={SettingsIcon} className="size-4" />
              <Text>Manage Account</Text>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onPress={onSignOut}>
              <Icon as={LogOutIcon} className="size-4" />
              <Text>Sign Out</Text>
            </Button>
          </View>
        </View>
        <Button
          variant="ghost"
          size="lg"
          className="h-16 justify-start gap-3 rounded-none rounded-b-md px-3 sm:h-14"
          onPress={() => {
            // TODO: Navigate to add account screen
          }}>
          <View className="size-10 items-center justify-center">
            <View className="size-7 items-center justify-center rounded-full border border-dashed border-border bg-muted/50">
              <Icon as={PlusIcon} className="size-5" />
            </View>
          </View>
          <Text>Add account</Text>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function UserAvatar(props: Omit<React.ComponentProps<typeof Avatar>, 'alt'>) {
  const { user } = useUser();

  const { initials, imageSource, userName } = React.useMemo(() => {
    const userName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Unknown';
    const initials = userName
      .split(' ')
      .map((name: string) => name[0])
      .join('');

    const imageSource = user?.imageUrl ? { uri: user.imageUrl } : undefined;
    return { initials, imageSource, userName };
  }, [user?.imageUrl, user?.firstName, user?.lastName, user?.email]);

  return (
    <Avatar alt={`${userName}'s avatar`} {...props}>
      <AvatarImage source={imageSource} />
      <AvatarFallback>
        <Text>{initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
