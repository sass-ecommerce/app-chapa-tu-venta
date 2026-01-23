import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View, ScrollView } from 'react-native';

export default function ProductosScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="items-center gap-8 p-4 pt-8">
        <Text variant="h1" className="text-3xl font-medium">
          Productos
        </Text>
        <Text className="text-center text-muted-foreground">
          Aquí podrás gestionar tus productos
        </Text>
      </View>
    </ScrollView>
  );
}
