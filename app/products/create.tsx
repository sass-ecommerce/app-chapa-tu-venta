import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, type CreateProductData } from '@/lib/api/products';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Link } from 'lucide-react-native';

export default function CreateProductScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  // Mutation para crear producto
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidar la caché de productos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Alert.alert('Éxito', 'Producto creado correctamente', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'No se pudo crear el producto');
    },
  });

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
      createProductMutation.mutate(value);
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

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Imagen */}
          <form.Field name="image_uri">
            {(field) => (
              <View className="mb-6">
                <Label nativeID="image_uri" className="mb-2">
                  Imagen del Producto
                </Label>

                {/* Dropdown para seleccionar método de carga */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="mb-3 w-full">
                      <Text>Seleccionar imagen</Text>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuLabel>Elige una opción</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onPress={() => pickImageFromGallery(field.handleChange)}
                      className="flex-row gap-2">
                      <ImageIcon size={18} color="#666" />
                      <Text>Seleccionar de galería</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onPress={() => takePhoto(field.handleChange)}
                      className="flex-row gap-2">
                      <Camera size={18} color="#666" />
                      <Text>Tomar foto</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onPress={() => {
                        setShowUrlInput(true);
                        setImagePreview('');
                        field.handleChange('');
                      }}
                      className="flex-row gap-2">
                      <Link size={18} color="#666" />
                      <Text>Ingresar URL</Text>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Input para URL (se muestra cuando se selecciona esa opción) */}
                {showUrlInput && (
                  <View>
                    <Input
                      placeholder="Pega la URL de la imagen"
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

                {/* Preview de imagen */}
                {imagePreview && (
                  <View className="overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      source={{ uri: imagePreview }}
                      className="h-48 w-full"
                      resizeMode="cover"
                      onError={() => {
                        setImagePreview('');
                        Alert.alert('Error', 'No se pudo cargar la imagen');
                      }}
                    />
                  </View>
                )}
              </View>
            )}
          </form.Field>

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
              <View className="mb-6">
                <Label nativeID="name" className="mb-2">
                  Nombre del Producto *
                </Label>
                <Input
                  placeholder="Ej: Camiseta Premium"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-sm font-medium text-destructive">
                    {String(field.state.meta.errors[0]?.message)}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          {/* Descripción */}
          <form.Field name="description">
            {(field) => (
              <View className="mb-6">
                <Label nativeID="description" className="mb-2">
                  Descripción
                </Label>
                <Input
                  placeholder="Descripción del producto"
                  value={field.state.value || ''}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  multiline
                  numberOfLines={4}
                  className="min-h-[100px]"
                  style={{ textAlignVertical: 'top' }}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-sm font-medium text-destructive">
                    {String(field.state.meta.errors[0])}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          {/* SKU */}
          <form.Field name="sku">
            {(field) => (
              <View className="mb-6">
                <Label nativeID="sku" className="mb-2">
                  SKU
                </Label>
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Input
                      placeholder="Ej: PROD-001"
                      value={field.state.value || ''}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                    />
                  </View>
                  <Button
                    variant="outline"
                    onPress={() => field.handleChange(generateSKU())}
                    className="px-4">
                    <Text>Generar</Text>
                  </Button>
                </View>
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-sm font-medium text-destructive">
                    {String(field.state.meta.errors[0])}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          {/* Categoría */}
          <form.Field name="category_id">
            {(field) => (
              <View className="mb-6">
                <Label nativeID="category_id" className="mb-2">
                  Categoría
                </Label>
                <Input
                  placeholder="Ej: Ropa"
                  value={field.state.value || ''}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-sm font-medium text-destructive">
                    {String(field.state.meta.errors[0])}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          {/* Precios */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold">Precios</Text>

            <View className="mb-4">
              <form.Field
                name="price"
                validators={{
                  onChange: z.number().positive('El precio debe ser mayor a 0'),
                }}>
                {(field) => (
                  <View>
                    <Label nativeID="price" className="mb-2">
                      Precio de Venta *
                    </Label>
                    <Input
                      placeholder="0.00"
                      value={field.state.value?.toString()}
                      onChangeText={(text) => field.handleChange(parseFloat(text) || 0)}
                      onBlur={field.handleBlur}
                      keyboardType="decimal-pad"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>
            </View>

            <View className="mb-4">
              <form.Field name="price_list">
                {(field) => (
                  <View>
                    <Label nativeID="price_list" className="mb-2">
                      Precio de Lista
                    </Label>
                    <Input
                      placeholder="0.00"
                      value={field.state.value?.toString()}
                      onChangeText={(text) => field.handleChange(parseFloat(text) || 0)}
                      onBlur={field.handleBlur}
                      keyboardType="decimal-pad"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>
            </View>

            <View className="mb-4">
              <form.Field name="price_base">
                {(field) => (
                  <View>
                    <Label nativeID="price_base" className="mb-2">
                      Precio Base (Costo)
                    </Label>
                    <Input
                      placeholder="0.00"
                      value={field.state.value?.toString()}
                      onChangeText={(text) => field.handleChange(parseFloat(text) || 0)}
                      onBlur={field.handleBlur}
                      keyboardType="decimal-pad"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="text-sm font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>
            </View>
          </View>

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
              <View className="mb-6">
                <Label nativeID="stock_quantity" className="mb-2">
                  Cantidad en Stock *
                </Label>
                <Input
                  placeholder="0"
                  value={field.state.value?.toString()}
                  onChangeText={(text) => field.handleChange(parseInt(text) || 0)}
                  onBlur={field.handleBlur}
                  keyboardType="number-pad"
                />
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-sm font-medium text-destructive">
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
              onChange: z
                .number()
                .min(0, 'La calificación mínima es 0')
                .max(5, 'La calificación máxima es 5'),
            }}>
            {(field) => (
              <View className="mb-6">
                <Label nativeID="rating" className="mb-2">
                  Calificación (0-5)
                </Label>
                <Input
                  placeholder="0"
                  value={field.state.value?.toString()}
                  onChangeText={(text) => {
                    const value = parseFloat(text) || 0;
                    field.handleChange(Math.min(5, Math.max(0, value)));
                  }}
                  onBlur={field.handleBlur}
                  keyboardType="decimal-pad"
                />
                {field.state.meta.errors.length > 0 && (
                  <Text className="text-sm font-medium text-destructive">
                    {String(field.state.meta.errors[0])}
                  </Text>
                )}
              </View>
            )}
          </form.Field>

          {/* Switches */}
          <View className="mb-6 gap-4">
            <form.Field name="trending">
              {(field) => (
                <View className="flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
                  <Label nativeID="trending" className="text-base">
                    Producto en Tendencia
                  </Label>
                  <Switch
                    checked={field.state.value ?? false}
                    onCheckedChange={field.handleChange}
                  />
                </View>
              )}
            </form.Field>

            <form.Field name="is_active">
              {(field) => (
                <View className="flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
                  <Label nativeID="is_active" className="text-base">
                    Producto Activo
                  </Label>
                  <Switch
                    checked={field.state.value ?? true}
                    onCheckedChange={field.handleChange}
                  />
                </View>
              )}
            </form.Field>
          </View>

          {/* Botones */}
          <View className="mb-8 gap-3">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  onPress={form.handleSubmit}
                  disabled={!canSubmit || createProductMutation.isPending}
                  className="bg-blue-500">
                  <Text className="font-semibold text-white">
                    {createProductMutation.isPending || isSubmitting
                      ? 'Creando...'
                      : 'Crear Producto'}
                  </Text>
                </Button>
              )}
            </form.Subscribe>

            <Button variant="outline" onPress={() => router.back()}>
              <Text>Cancelar</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
