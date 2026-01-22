import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stack, router } from 'expo-router';
import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

export default function OwnerInfoScreen() {
  const form = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      celular: '',
      edad: '',
      dni: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Datos validados:', value);
      // Aquí puedes guardar la información
      router.push('/(onboarding)/register-store');
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Información del dueño',
          headerShown: true,
        }}
      />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
            <CardHeader>
              <CardTitle className="text-xl">Información personal</CardTitle>
              <CardDescription>
                Completa tus datos como dueño o encargado de la tienda
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
              <form.Field
                name="nombres"
                validators={{
                  onChange: z
                    .string()
                    .min(1, 'Los nombres son requeridos')
                    .max(100, 'Los nombres no pueden exceder 100 caracteres')
                    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'Solo se permiten letras'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input
                      id="nombres"
                      placeholder="Juan Carlos"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      autoCapitalize="words"
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
                name="apellidos"
                validators={{
                  onChange: z
                    .string()
                    .min(1, 'Los apellidos son requeridos')
                    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
                    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'Solo se permiten letras'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input
                      id="apellidos"
                      placeholder="Pérez García"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      autoCapitalize="words"
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
                name="celular"
                validators={{
                  onChange: z
                    .string()
                    .regex(/^\d{9}$/, 'El número de celular debe tener exactamente 9 dígitos'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="celular">Número de celular</Label>
                    <Input
                      id="celular"
                      placeholder="999999999"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      keyboardType="number-pad"
                      maxLength={9}
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
                name="edad"
                validators={{
                  onChange: z
                    .string()
                    .regex(/^\d+$/, 'La edad debe ser un número')
                    .refine((val) => {
                      const num = parseInt(val);
                      return num >= 18 && num <= 120;
                    }, 'La edad debe estar entre 18 y 120 años'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="edad">Edad</Label>
                    <Input
                      id="edad"
                      placeholder="25"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      keyboardType="number-pad"
                      maxLength={3}
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
                name="dni"
                validators={{
                  onChange: z.string().regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                      id="dni"
                      placeholder="12345678"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      keyboardType="number-pad"
                      maxLength={8}
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
                  <Button className="w-full" onPress={form.handleSubmit} disabled={!canSubmit}>
                    <Text>{isSubmitting ? 'Enviando...' : 'Continuar'}</Text>
                  </Button>
                )}
              </form.Subscribe>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
