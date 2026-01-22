import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stack, router } from 'expo-router';
import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from 'nativewind';

const CATEGORIAS = [
  { value: '', label: 'Selecciona una categoría' },
  { value: 'ropa', label: 'Ropa y Accesorios' },
  { value: 'perfumes', label: 'Perfumes y Fragancias' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'alimentos', label: 'Alimentos y Bebidas' },
  { value: 'salud', label: 'Salud y Belleza' },
  { value: 'hogar', label: 'Hogar y Decoración' },
  { value: 'deportes', label: 'Deportes y Fitness' },
  { value: 'juguetes', label: 'Juguetes y Juegos' },
  { value: 'libros', label: 'Libros y Papelería' },
  { value: 'otros', label: 'Otros' },
] as const;

export default function RegisterStoreScreen() {
  const { colorScheme } = useColorScheme();

  const form = useForm({
    defaultValues: {
      nombreTienda: '',
      direccion: '',
      ruc: '',
      categoria: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Tienda registrada:', value);
      // Aquí puedes guardar la información y navegar a la siguiente pantalla
      router.push('/'); // O a donde necesites
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Registra tu tienda',
          headerShown: true,
        }}
      />
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
                name="nombreTienda"
                validators={{
                  onChange: z
                    .string()
                    .min(1, 'El nombre de la tienda es requerido')
                    .max(100, 'El nombre no puede exceder 100 caracteres'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="nombreTienda">Nombre de la tienda</Label>
                    <Input
                      id="nombreTienda"
                      placeholder="Mi Tienda"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      autoCapitalize="words"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="direccion"
                validators={{
                  onChange: z
                    .string()
                    .min(1, 'La dirección es requerida')
                    .max(200, 'La dirección no puede exceder 200 caracteres'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      placeholder="Av. Principal 123, Lima"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      autoCapitalize="words"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="ruc"
                validators={{
                  onChange: z
                    .string()
                    .regex(/^\d{11}$/, 'El RUC debe tener exactamente 11 dígitos')
                    .refine((val) => {
                      const tipo = val.substring(0, 2);
                      return tipo === '10' || tipo === '20';
                    }, 'El RUC debe empezar con 10 (persona) o 20 (empresa)'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="ruc">RUC</Label>
                    <Input
                      id="ruc"
                      placeholder="10123456789 o 20123456789"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      keyboardType="number-pad"
                      maxLength={11}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>

              <form.Field
                name="categoria"
                validators={{
                  onChange: z.string().min(1, 'Debes seleccionar una categoría'),
                }}>
                {(field) => (
                  <View className="gap-1.5">
                    <Label htmlFor="categoria">Categoría de productos</Label>
                    <View className="native:border native:border-input rounded-md">
                      <Picker
                        selectedValue={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        onBlur={field.handleBlur}>
                        {CATEGORIAS.map((cat) => (
                          <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                        ))}
                      </Picker>
                    </View>
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button className="w-full" onPress={form.handleSubmit} disabled={!canSubmit}>
                    <Text>{isSubmitting ? 'Registrando...' : 'Registrar tienda'}</Text>
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
