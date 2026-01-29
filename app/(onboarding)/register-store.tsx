import { View, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from 'expo-router';
import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from 'nativewind';
import { useUser } from '@clerk/clerk-expo';
import { ONBOARDING_STEPS } from '@/lib/constants';
import { createStore, getStoreById } from '@/lib/api/stores';
import { updateUserById } from '@/lib/api/users';
import { Alert } from 'react-native';

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
  const { user } = useUser();
  const [isLoadingStore, setIsLoadingStore] = React.useState(false);

  const form = useForm({
    defaultValues: {
      nombreTienda: '',
      direccion: '',
      ruc: '',
      categoria: '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Crear la tienda en Supabase
        const storeData = {
          name: value.nombreTienda,
          owner_email: user?.emailAddresses[0]?.emailAddress || null,
          ruc: value.ruc ? parseInt(value.ruc) : null,
          plan: null,
          settings: null,
        };

        const [newStore] = await createStore(storeData);

        if (!user) throw new Error('Usuario no autenticado.');

        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            store: {
              id: newStore.id,
              slug: newStore.slug,
            },
          },
        });

        console.log('Tienda creada exitosamente:', newStore);

        // Actualizar el usuario con el store_id
        const { user: userCustom } =
          (user?.publicMetadata as { user: { slug: string; id: number } }) || {};

        console.log('Datos del usuario:', userCustom);

        const { slug, id } = userCustom;

        if (!slug) {
          throw new Error('El slug del usuario no está disponible.');
        }

        const result = await updateUserById(id, {
          store_id: newStore.id,
        });

        console.log('Usuario actualizado con store_id:', result);
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            lastStep: '',
          },
        });

        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error al crear la tienda:', error);
        Alert.alert('Error', 'No se pudo crear la tienda. Por favor, intenta de nuevo.', [
          { text: 'OK' },
        ]);
      }
    },
  });

  // Cargar datos de la tienda si existe en unsafeMetadata
  React.useEffect(() => {
    const loadStoreData = async () => {
      if (!user) return;

      // Actualizar metadata con el último paso
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            lastStep: ONBOARDING_STEPS.REGISTER_STORE,
          },
        });
      } catch (error) {
        console.error('Error actualizando metadata:', error);
      }

      // Verificar si ya existe una tienda en unsafeMetadata
      const storeInMetadata = (user.unsafeMetadata as { store?: { id: number } })?.store;

      if (storeInMetadata?.id) {
        setIsLoadingStore(true);
        try {
          const existingStore = await getStoreById(storeInMetadata.id);

          // Autocompletar el formulario con los datos de la tienda
          form.setFieldValue('nombreTienda', existingStore.name);
          form.setFieldValue('ruc', existingStore.ruc ? String(existingStore.ruc) : '');

          console.log('Datos de tienda cargados:', existingStore);
        } catch (error) {
          console.error('Error cargando datos de la tienda:', error);
        } finally {
          setIsLoadingStore(false);
        }
      }
    };

    loadStoreData();
  }, [user]);

  return (
    <>
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
              {isLoadingStore && (
                <Text className="text-center text-sm text-muted-foreground">
                  Cargando datos de la tienda...
                </Text>
              )}
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
                        {String(field.state.meta.errors[0]?.message)}
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
                        {String(field.state.meta.errors[0]?.message)}
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
                        {String(field.state.meta.errors[0]?.message)}
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
