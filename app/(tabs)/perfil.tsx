import { Text } from '@/components/ui/text';
import { useUser } from '@clerk/clerk-expo';
import * as React from 'react';
import { View, ScrollView } from 'react-native';

export default function PerfilScreen() {
  const { user } = useUser();

  return (
    <ScrollView className="flex-1">
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Text variant="h1" className="text-3xl font-medium">
          Perfil
        </Text>
        {user?.firstName && (
          <Text className="text-center text-lg">Bienvenido, {user.firstName}</Text>
        )}
        <Text className="text-center text-muted-foreground">
          Gestiona tu perfil y configuración
        </Text>
      </View>
    </ScrollView>
  );
}
