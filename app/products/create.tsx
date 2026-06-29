import * as React from 'react';
import { View, ScrollView, Alert, Pressable, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { Stack, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Sparkles, Package, DollarSign, ImagePlus, Camera, X, Plus } from 'lucide-react-native';
import { CategoryPicker } from '@/features/categories';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '@/features/products/queries';
import { ScreenHeader } from '@/shared/components/screen-header';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { AnimatedCard } from '@/shared/components/ui/animated-card';
import { Icon } from '@/shared/components/ui/icon';
import { ANIMATION } from '@/shared/config/constants';
import { cn } from '@/shared/utils/utils';

type ImageAsset = {
  uri: string;
  mimeType: string;
  fileName: string;
};

const MAX_IMAGES = 6;

export default function CreateProductScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tileSize = (width - 40 - 40 - 16) / 3; // screen px-5 + card p-5 + 2 gaps
  const [categoryName, setCategoryName] = React.useState<string | null>(null);
  const [imageAssets, setImageAssets] = React.useState<ImageAsset[]>([]);
  const createMutation = useCreateProductMutation();
  const uploadImageMutation = useUploadProductImageMutation();

  const addImageAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const mimeType = asset.mimeType ?? 'image/jpeg';
    const ext = mimeType.split('/')[1] ?? 'jpeg';
    setImageAssets((prev) => [
      ...prev,
      {
        uri: asset.uri,
        mimeType,
        fileName: asset.fileName ?? `product_${Date.now()}.${ext}`,
      },
    ]);
  };

  const removeImageAsset = (index: number) => {
    setImageAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu cámara para tomar fotos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      addImageAsset(result.assets[0]);
    }
  };

  const openLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu biblioteca de fotos.');
      return;
    }
    const remaining = MAX_IMAGES - imageAssets.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
    });
    if (!result.canceled) {
      result.assets.forEach(addImageAsset);
    }
  };

  const pickImage = () => {
    if (imageAssets.length >= MAX_IMAGES) {
      Alert.alert('Límite alcanzado', `Puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
      return;
    }
    Alert.alert('Imagen del producto', 'Elige una opción', [
      { text: 'Cámara', onPress: openCamera },
      { text: 'Biblioteca de fotos', onPress: openLibrary },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      basePrice: 0,
      isActive: true,
      categoryId: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const { id } = await createMutation.mutateAsync({
          name: value.name,
          description: value.description || undefined,
          basePrice: value.basePrice,
          isActive: value.isActive,
          categoryId: value.categoryId || undefined,
        });

        for (let i = 0; i < imageAssets.length; i++) {
          const img = imageAssets[i];
          await uploadImageMutation.mutateAsync({
            fileUri: img.uri,
            fileName: img.fileName,
            contentType: img.mimeType,
            primaryIdentifier: id,
            secondaryIdentifier: String(i),
          });
        }

        Alert.alert('Éxito', 'Producto creado correctamente', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch {
        Alert.alert('Error', 'No se pudo crear el producto. Intenta de nuevo.');
      }
    },
  });

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="Crear Producto" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8 pt-4">
          {/* Card 0: Información Básica */}
          <AnimatedCard delay={0} className="mb-4">
            <View className="p-5">
              <View className="mb-5 flex-row items-center gap-3">
                <View className="rounded-lg bg-primary/10 p-2">
                  <Icon as={Package} className="text-primary" size={16} />
                </View>
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
                      Nombre del Producto <Text className="text-destructive">*</Text>
                    </Label>
                    <Input
                      placeholder="Ej: Camiseta Premium"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      className="h-12"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Text className="mt-1.5 text-xs font-medium text-destructive">
                        {String(field.state.meta.errors[0]?.message)}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>

              {/* Descripción */}
              <form.Field name="description">
                {(field) => (
                  <View>
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

              <View className="h-6" />

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

          {/* Card 1: Imágenes del Producto */}
          <AnimatedCard delay={ANIMATION.STAGGER} className="mb-4">
            <View className="p-5">
              <View className="mb-5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="rounded-lg bg-primary/10 p-2">
                    <Icon as={ImagePlus} className="text-primary" size={16} />
                  </View>
                  <Label className="text-base font-semibold">Imágenes del Producto</Label>
                </View>
                <Text className="text-xs text-muted-foreground">
                  {imageAssets.length}/{MAX_IMAGES}
                </Text>
              </View>

              {imageAssets.length > 0 ? (
                <View>
                  <View className="flex-row flex-wrap gap-2">
                    {imageAssets.map((img, index) => (
                      <View
                        key={index}
                        style={{ width: tileSize, height: tileSize }}
                        className="overflow-hidden rounded-xl">
                        <Image
                          source={{ uri: img.uri }}
                          style={{ width: tileSize, height: tileSize }}
                          contentFit="cover"
                        />
                        <Pressable
                          onPress={() => removeImageAsset(index)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 active:opacity-70">
                          <Icon as={X} size={12} className="text-white" />
                        </Pressable>
                      </View>
                    ))}

                    {imageAssets.length < MAX_IMAGES && (
                      <Pressable onPress={pickImage} className="active:opacity-70">
                        <View
                          style={{ width: tileSize, height: tileSize }}
                          className="items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
                          <Icon as={Plus} className="text-muted-foreground" size={22} />
                        </View>
                      </Pressable>
                    )}
                  </View>
                </View>
              ) : (
                <Pressable
                  onPress={pickImage}
                  className="overflow-hidden rounded-2xl border border-dashed border-border active:opacity-70">
                  <View className="items-center gap-4 bg-muted/20 px-6 py-14">
                    <View className="rounded-2xl bg-primary/10 p-5">
                      <Icon as={ImagePlus} className="text-primary" size={34} />
                    </View>
                    <View className="items-center gap-1">
                      <Text className="text-sm font-semibold text-foreground">
                        Añadir imágenes del producto
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        Hasta {MAX_IMAGES} imágenes · Toca para seleccionar
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <View className="flex-row items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                        <Icon as={Camera} className="text-muted-foreground" size={11} />
                        <Text className="text-xs font-medium text-muted-foreground">Cámara</Text>
                      </View>
                      <View className="flex-row items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                        <Icon as={ImagePlus} className="text-muted-foreground" size={11} />
                        <Text className="text-xs font-medium text-muted-foreground">
                          Biblioteca
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}
            </View>
          </AnimatedCard>

          {/* Card 2: Precio */}
          <AnimatedCard delay={ANIMATION.STAGGER * 2} className="mb-4">
            <View className="p-5">
              <View className="mb-5 flex-row items-center gap-3">
                <View className="rounded-lg bg-primary/10 p-2">
                  <Icon as={DollarSign} className="text-primary" size={16} />
                </View>
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
                      Precio Base <Text className="text-destructive">*</Text>
                    </Label>
                    <View className="h-14 flex-row overflow-hidden rounded-xl border border-input bg-background shadow-sm shadow-black/5">
                      <View className="w-16 items-center justify-center border-r border-input bg-muted/40">
                        <Text className="text-sm font-bold text-primary">S/.</Text>
                      </View>
                      <Input
                        placeholder="0.00"
                        value={field.state.value?.toString()}
                        onChangeText={(text) => field.handleChange(parseFloat(text) || 0)}
                        onBlur={field.handleBlur}
                        keyboardType="decimal-pad"
                        className="h-14 flex-1 rounded-none border-0 text-xl font-semibold shadow-none"
                      />
                    </View>
                    {field.state.meta.errors.length > 0 && (
                      <Text className="mt-1.5 text-xs font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </View>
                )}
              </form.Field>
            </View>
          </AnimatedCard>

          {/* Card 3: Configuración */}
          <AnimatedCard delay={ANIMATION.STAGGER * 3} className="mb-6">
            <View className="p-5">
              <Label className="mb-4 text-base font-semibold">Configuración</Label>

              <form.Field name="isActive">
                {(field) => (
                  <View
                    className={cn(
                      'flex-row items-center justify-between rounded-xl border p-4',
                      field.state.value
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-border bg-muted/30'
                    )}>
                    <View className="flex-row items-center gap-3">
                      <View
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          field.state.value ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                        )}
                      />
                      <View>
                        <Label nativeID="isActive" className="text-base font-medium">
                          Producto Activo
                        </Label>
                        <Text className="text-xs text-muted-foreground">
                          Visible para los clientes
                        </Text>
                      </View>
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
