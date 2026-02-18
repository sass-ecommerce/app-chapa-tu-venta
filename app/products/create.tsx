import * as React from 'react';
import { View, ScrollView, Alert, Image, Pressable } from 'react-native';

import { Stack, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon, Link, Sparkles, Package, DollarSign, Hash } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { AnimatedCard } from '@/shared/components/ui/animated-card';
import { Icon } from '@/shared/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ANIMATION } from '@/shared/config/constants';

export default function CreateProductScreen() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = React.useState<string>('');
  const [showUrlInput, setShowUrlInput] = React.useState(false);

  // Función para seleccionar imagen de galería
  const pickImageFromGallery = async (handleChange: (value: string) => void) => {
    setShowUrlInput(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImagePreview(uri);
      handleChange(uri);
    }
  };

  // Función para tomar foto con cámara
  const takePhoto = async (handleChange: (value: string) => void) => {
    setShowUrlInput(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImagePreview(uri);
      handleChange(uri);
    }
  };

  // Función para generar SKU aleatorio
  const generateSKU = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SKU-';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Tanstack Form
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      price_list: 0,
      price_base: 0,
      stock_quantity: 0,
      image_uri: '',
      category_id: '',
      sku: '',
      rating: 0,
      trending: false,
      is_active: true,
    },
    onSubmit: async ({ value }) => {
      console.log('✅ [CreateProduct] Submitting form with values:', value);
      Alert.alert('Éxito', 'Producto creado correctamente', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
  });

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: 'Crear Producto',
          headerBackTitle: 'Productos',
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8 pt-12">
          {/* Hero Header con gradiente */}
          <View className="mb-6">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="rounded-full bg-primary/10 p-2">
                <Icon as={Sparkles} className="text-primary" size={20} />
              </View>
              <Text className="text-2xl font-bold text-foreground">Nuevo Producto</Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              Completa la información para agregar un producto a tu inventario
            </Text>
          </View>

          {/* Card 1: Imagen del Producto */}
          <AnimatedCard delay={0} className="mb-4">
            <View className="p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <Icon as={ImageIcon} className="text-primary" size={18} />
                <Label className="text-base font-semibold">Imagen del Producto</Label>
              </View>

              <form.Field name="image_uri">
                {(field) => (
                  <View>
                    {/* Preview de imagen con diseño mejorado */}
                    {imagePreview ? (
                      <Pressable
                        onPress={() => {
                          setImagePreview('');
                          field.handleChange('');
                        }}
                        className="group mb-3">
                        <View className="overflow-hidden rounded-2xl border-2 border-border bg-muted">
                          <Image
                            source={{ uri: imagePreview }}
                            className="h-56 w-full"
                            resizeMode="cover"
                            onError={() => {
                              setImagePreview('');
                              Alert.alert('Error', 'No se pudo cargar la imagen');
                            }}
                          />
                          <View className="absolute inset-0 items-center justify-center bg-black/40 opacity-0 active:opacity-100">
                            <Text className="font-semibold text-white">Tocar para cambiar</Text>
                          </View>
                        </View>
                      </Pressable>
                    ) : (
                      <View className="mb-3 h-56 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50">
                        <Icon as={ImageIcon} className="mb-2 text-muted-foreground" size={48} />
                        <Text className="text-sm text-muted-foreground">Selecciona una imagen</Text>
                      </View>
                    )}

                    {/* Dropdown para seleccionar método de carga */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="mb-3 w-full gap-2">
                          <Icon as={ImageIcon} className="text-muted-foreground" size={18} />
                          <Text>Seleccionar imagen</Text>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64">
                        <DropdownMenuLabel>Elige una opción</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onPress={() => pickImageFromGallery(field.handleChange)}
                          className="flex-row gap-2">
                          <Icon as={ImageIcon} className="text-muted-foreground" size={18} />
                          <Text>Seleccionar de galería</Text>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onPress={() => takePhoto(field.handleChange)}
                          className="flex-row gap-2">
                          <Icon as={Camera} className="text-muted-foreground" size={18} />
                          <Text>Tomar foto</Text>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onPress={() => {
                            setShowUrlInput(true);
                            setImagePreview('');
                            field.handleChange('');
                          }}
                          className="flex-row gap-2">
                          <Icon as={Link} className="text-muted-foreground" size={18} />
                          <Text>Ingresar URL</Text>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Input para URL */}
                    {showUrlInput && (
                      <View>
                        <Input
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={field.state.value}
                          onChangeText={(text) => {
                            field.handleChange(text);
                            setImagePreview(text);
                          }}
                          onBlur={field.handleBlur}
                          className="mb-2"
                        />
                      </View>
                    )}
                  </View>
                )}
              </form.Field>
            </View>
          </AnimatedCard>

          {/* Card 2: Información Básica */}
          <AnimatedCard delay={ANIMATION.STAGGER} className="mb-4">
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

              {/* SKU y Categoría en grid */}
              <View className="flex-row gap-3">
                {/* SKU */}
                <form.Field name="sku">
                  {(field) => (
                    <View className="mb-4 flex-1">
                      <Label nativeID="sku" className="mb-2 text-sm font-medium">
                        SKU
                      </Label>
                      <View className="flex-row gap-2">
                        <View className="flex-1">
                          <Input
                            placeholder="SKU-001"
                            value={field.state.value || ''}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                            className="h-12"
                          />
                        </View>
                        <Button
                          variant="outline"
                          size="icon"
                          onPress={() => field.handleChange(generateSKU())}
                          className="h-12 w-12">
                          <Icon as={Hash} className="text-muted-foreground" size={18} />
                        </Button>
                      </View>
                    </View>
                  )}
                </form.Field>
              </View>

              {/* Categoría */}
              <form.Field name="category_id">
                {(field) => (
                  <View className="mb-0">
                    <Label nativeID="category_id" className="mb-2 text-sm font-medium">
                      Categoría
                    </Label>
                    <Input
                      placeholder="Ej: Ropa"
                      value={field.state.value || ''}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      className="h-12"
                    />
                  </View>
                )}
              </form.Field>
            </View>
          </AnimatedCard>

          {/* Card 3: Precios */}
          <AnimatedCard delay={ANIMATION.STAGGER * 2} className="mb-4">
            <View className="p-5">
              <View className="mb-4 flex-row items-center gap-2">
                <Icon as={DollarSign} className="text-primary" size={18} />
                <Label className="text-base font-semibold">Precios</Label>
              </View>

              {/* Precio de Venta */}
              <form.Field
                name="price"
                validators={{
                  onChange: z.number().positive('El precio debe ser mayor a 0'),
                }}>
                {(field) => (
                  <View className="mb-4">
                    <Label nativeID="price" className="mb-2 text-sm font-medium">
                      Precio de Venta * <Text className="text-muted-foreground">(S/)</Text>
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

              {/* Grid de precios opcionales */}
              <View className="flex-row gap-3">
                {/* Precio de Lista */}
                <form.Field name="price_list">
                  {(field) => (
                    <View className="mb-4 flex-1">
                      <Label nativeID="price_list" className="mb-2 text-sm font-medium">
                        Precio Lista <Text className="text-muted-foreground">(S/)</Text>
                      </Label>
                      <Input
                        placeholder="0.00"
                        value={field.state.value?.toString()}
                        onChangeText={(text) => field.handleChange(parseFloat(text) || 0)}
                        onBlur={field.handleBlur}
                        keyboardType="decimal-pad"
                        className="h-12"
                      />
                    </View>
                  )}
                </form.Field>

                {/* Precio Base */}
                <form.Field name="price_base">
                  {(field) => (
                    <View className="mb-0 flex-1">
                      <Label nativeID="price_base" className="mb-2 text-sm font-medium">
                        Costo <Text className="text-muted-foreground">(S/)</Text>
                      </Label>
                      <Input
                        placeholder="0.00"
                        value={field.state.value?.toString()}
                        onChangeText={(text) => field.handleChange(parseFloat(text) || 0)}
                        onBlur={field.handleBlur}
                        keyboardType="decimal-pad"
                        className="h-12"
                      />
                    </View>
                  )}
                </form.Field>
              </View>
            </View>
          </AnimatedCard>

          {/* Card 4: Stock y Configuración */}
          <AnimatedCard delay={ANIMATION.STAGGER * 3} className="mb-4">
            <View className="p-5">
              <Label className="mb-4 text-base font-semibold">Stock y Configuración</Label>

              {/* Stock y Rating en grid */}
              <View className="mb-4 flex-row gap-3">
                {/* Stock */}
                <form.Field
                  name="stock_quantity"
                  validators={{
                    onChange: z
                      .number()
                      .int('Debe ser un número entero')
                      .min(0, 'El stock no puede ser negativo'),
                  }}>
                  {(field) => (
                    <View className="flex-1">
                      <Label nativeID="stock_quantity" className="mb-2 text-sm font-medium">
                        Stock *
                      </Label>
                      <Input
                        placeholder="0"
                        value={field.state.value?.toString()}
                        onChangeText={(text) => field.handleChange(parseInt(text) || 0)}
                        onBlur={field.handleBlur}
                        keyboardType="number-pad"
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

                {/* Rating */}
                <form.Field
                  name="rating"
                  validators={{
                    onChange: z.number().min(0, 'Mín: 0').max(5, 'Máx: 5'),
                  }}>
                  {(field) => (
                    <View className="flex-1">
                      <Label nativeID="rating" className="mb-2 text-sm font-medium">
                        Rating (0-5)
                      </Label>
                      <Input
                        placeholder="0.0"
                        value={field.state.value?.toString()}
                        onChangeText={(text) => {
                          const value = parseFloat(text) || 0;
                          field.handleChange(Math.min(5, Math.max(0, value)));
                        }}
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

              {/* Switches con diseño mejorado */}
              <View className="gap-3">
                <form.Field name="trending">
                  {(field) => (
                    <View className="flex-row items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
                      <View>
                        <Label nativeID="trending" className="mb-1 text-base font-medium">
                          Producto en Tendencia
                        </Label>
                        <Text className="text-xs text-muted-foreground">
                          Destacar en la página principal
                        </Text>
                      </View>
                      <Switch
                        checked={field.state.value ?? false}
                        onCheckedChange={field.handleChange}
                      />
                    </View>
                  )}
                </form.Field>

                <form.Field name="is_active">
                  {(field) => (
                    <View className="flex-row items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
                      <View>
                        <Label nativeID="is_active" className="mb-1 text-base font-medium">
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
