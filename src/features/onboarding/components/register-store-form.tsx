import * as React from 'react';
import { View, ScrollView, Image, Alert } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { router } from 'expo-router';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Text } from '@/shared/components/ui/text';
import { useLogoutMutation } from '@/features/auth';
import { useCreateTenantMutation } from '../queries';

function toSlug(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function RegisterStoreForm() {
  const domainManuallyEdited = React.useRef(false);
  const logoutMutation = useLogoutMutation();
  const createTenantMutation = useCreateTenantMutation();

  const form = useForm({
    defaultValues: {
      name: '',
      domain: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await createTenantMutation.mutateAsync({
          name: value.name,
          domain: value.domain,
        });
        router.replace('/(tabs)');
      } catch (error) {
        Alert.alert('Error', 'No se pudo crear la tienda. Por favor, intenta de nuevo.', [
          { text: 'OK' },
        ]);
      }
    },
  });

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
          <CardHeader>
            <View className="mb-2 items-center">
              <Image
                source={require('@/assets/images/tienda.png')}
                style={{ height: 140 }}
                resizeMode="contain"
              />
            </View>
            <CardTitle className="text-center text-xl">Información de la tienda</CardTitle>
            <CardDescription className="text-center">
              Configura tu tienda para comenzar a vender
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <form.Field
              name="name"
              validators={{
                onChange: z
                  .string()
                  .min(1, 'El nombre de la tienda es requerido')
                  .max(100, 'El nombre no puede exceder 100 caracteres'),
              }}>
              {(field) => (
                <View className="gap-1.5">
                  <Label htmlFor="name">Nombre de la tienda</Label>
                  <Input
                    id="name"
                    placeholder="Mi Tienda"
                    value={field.state.value}
                    onChangeText={(text) => {
                      field.handleChange(text);
                      if (!domainManuallyEdited.current) {
                        form.setFieldValue('domain', toSlug(text));
                      }
                    }}
                    onBlur={field.handleBlur}
                    autoCapitalize="sentences"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0]?.message)}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

            <form.Field
              name="domain"
              validators={{
                onChange: z
                  .string()
                  .min(1, 'El dominio es requerido')
                  .max(63, 'El dominio no puede exceder 63 caracteres')
                  .regex(
                    /^[a-z0-9]+(-[a-z0-9]+)*$/,
                    'Solo letras minúsculas, números y guiones (sin espacios ni caracteres especiales)'
                  ),
              }}>
              {(field) => (
                <View className="gap-1.5">
                  <Label htmlFor="domain">Dominio</Label>
                  <Input
                    id="domain"
                    placeholder="mi-tienda"
                    value={field.state.value}
                    onChangeText={(text) => {
                      domainManuallyEdited.current = true;
                      field.handleChange(text.toLowerCase());
                    }}
                    onBlur={field.handleBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm font-medium text-destructive">
                      {String(field.state.meta.errors[0]?.message)}
                    </Text>
                  )}
                </View>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <>
                  <Button
                    className="w-full"
                    onPress={form.handleSubmit}
                    disabled={!canSubmit || isSubmitting || createTenantMutation.isPending}>
                    <Text>
                      {isSubmitting || createTenantMutation.isPending
                        ? 'Registrando...'
                        : 'Registrar tienda'}
                    </Text>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={logoutMutation.isPending}
                    onPress={() => logoutMutation.mutate()}>
                    <Text>Cerrar sesión</Text>
                  </Button>
                </>
              )}
            </form.Subscribe>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
