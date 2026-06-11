import * as React from 'react';
import { View, ScrollView, Alert } from 'react-native';

import { Stack, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Sparkles, Package, DollarSign } from 'lucide-react-native';
import { CategoryPicker } from '@/features/categories';
import { useCreateProductMutation } from '@/features/products/queries';
import { ScreenHeader } from '@/shared/components/screen-header';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { AnimatedCard } from '@/shared/components/ui/animated-card';
import { Icon } from '@/shared/components/ui/icon';
import { ANIMATION } from '@/shared/config/constants';

export default function CreateProductScreen() {
  const router = useRouter();
  const [categoryName, setCategoryName] = React.useState<string | null>(null);
  const createMutation = useCreateProductMutation();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      basePrice: 0,
      isActive: true,
      categoryId: '',
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(
        {
          name: value.name,
          description: value.description || undefined,
          basePrice: value.basePrice,
          isActive: value.isActive,
          categoryId: value.categoryId || undefined,
        },
        {
          onSuccess: () =>
            Alert.alert('Éxito', 'Producto creado correctamente', [
              { text: 'OK', onPress: () => router.back() },
            ]),
          onError: () => Alert.alert('Error', 'No se pudo crear el producto. Intenta de nuevo.'),
        }
      );
    },
  });

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="Crear Producto" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8 pt-4">
          {/* Card 1: Información Básica */}
          <AnimatedCard delay={0} className="mb-4">
            <View className="p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <Icon as={Package} className="text-primary" size={18} />
                <Label className="text-base font-semibold">Información Básica</Label>
              </View>

              {/* Nombre */}
              <form.Field
                name="name"
                validators={{
                  onChange: z
                    .string()
                    .min(1, 'El nombre es requerido')
                    .max(255, 'El nombre es muy largo'),
                }}>
                {(field) => (
                  <View className="mb-4">
                    <Label nativeID="name" className="mb-2 text-sm font-medium">
                      Nombre del Producto *
                    </Label>
                    <Input
                      placeholder="Ej: Camiseta Premium"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      className="h-12"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="mt-1 text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0]?.message)}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>

              {/* Descripción */}
              <form.Field name="description">
                {(field) => (
                  <View className="mb-4">
                    <Label nativeID="description" className="mb-2 text-sm font-medium">
                      Descripción
                    </Label>
                    <Input
                      placeholder="Descripción detallada del producto"
                      value={field.state.value || ''}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      multiline
                      numberOfLines={4}
                      className="min-h-[100px]"
                      style={{ textAlignVertical: 'top' }}
                    />
                  </View>
                )}
              </form.Field>

              {/* Categoría */}
              <form.Field name="categoryId">
                {(field) => (
                  <View>
                    <Label nativeID="categoryId" className="mb-2 text-sm font-medium">
                      Categoría
                    </Label>
                    <CategoryPicker
                      value={field.state.value || null}
                      valueName={categoryName}
                      onChange={(id, name) => {
                        field.handleChange(id ?? '');
                        setCategoryName(name);
                      }}
                    />
                  </View>
                )}
              </form.Field>
            </View>
          </AnimatedCard>

          {/* Card 2: Precio */}
          <AnimatedCard delay={ANIMATION.STAGGER} className="mb-4">
            <View className="p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <Icon as={DollarSign} className="text-primary" size={18} />
                <Label className="text-base font-semibold">Precio</Label>
              </View>

              <form.Field
                name="basePrice"
                validators={{
                  onChange: z.number().positive('El precio debe ser mayor a 0'),
                }}>
                {(field) => (
                  <View>
                    <Label nativeID="basePrice" className="mb-2 text-sm font-medium">
                      Precio Base * <Text className="text-muted-foreground">(S/)</Text>
                    </Label>
                    <Input
                      placeholder="0.00"
                      value={field.state.value?.toString()}
                      onChangeText={(text) => field.handleChange(parseFloat(text) || 0)}
                      onBlur={field.handleBlur}
                      keyboardType="decimal-pad"
                      className="h-12"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="mt-1 text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>
            </View>
          </AnimatedCard>

          {/* Card 3: Configuración */}
          <AnimatedCard delay={ANIMATION.STAGGER * 2} className="mb-6">
            <View className="p-5">
              <Label className="mb-4 text-base font-semibold">Configuración</Label>

              <form.Field name="isActive">
                {(field) => (
                  <View className="flex-row items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
                    <View>
                      <Label nativeID="isActive" className="mb-1 text-base font-medium">
                        Producto Activo
                      </Label>
                      <Text className="text-xs text-muted-foreground">
                        Visible para los clientes
                      </Text>
                    </View>
                    <Switch
                      checked={field.state.value ?? true}
                      onCheckedChange={field.handleChange}
                    />
                  </View>
                )}
              </form.Field>
            </View>
          </AnimatedCard>

          {/* Botones de Acción */}
          <View className="gap-3">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  onPress={form.handleSubmit}
                  disabled={!canSubmit}
                  size="lg"
                  className="gap-2">
                  <Icon as={Sparkles} className="text-primary-foreground" size={18} />
                  <Text className="font-semibold">
                    {isSubmitting ? 'Creando...' : 'Crear Producto'}
                  </Text>
                </Button>
              )}
            </form.Subscribe>

            <Button variant="outline" size="lg" onPress={() => router.back()}>
              <Text>Cancelar</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
