import * as React from 'react';
import { View, ScrollView, Alert, Pressable, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { Stack, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import {
  Sparkles,
  Package,
  DollarSign,
  ImagePlus,
  Camera,
  X,
  Plus,
  Tag,
  Check,
  ChevronDown,
  ChevronUp,
  Settings2,
  type LucideIcon,
} from 'lucide-react-native';
import { CategoryPicker } from '@/features/categories';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '@/features/products/queries';
import {
  PRODUCT_ATTRIBUTE_OPTIONS,
  PRODUCT_ATTRIBUTE_VALUE_SUGGESTIONS,
} from '@/features/products/constants';
import type { ProductAttributeInput } from '@/features/products/types';
import { ScreenHeader } from '@/shared/components/screen-header';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
} from '@/shared/components/ui/select';
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
const CUSTOM_ATTRIBUTE_VALUE = '__custom__';
const DESCRIPTION_MIN_HEIGHT = 90;
const DESCRIPTION_MAX_HEIGHT = 200;

type AttributeRowState = {
  attributeKey: string;
  attributeLabel: string;
  value: string;
  isCustomValue: boolean;
};

type StepId = 'info' | 'photos' | 'price' | 'attributes' | 'config';

const STEP_ORDER: StepId[] = ['info', 'photos', 'price', 'attributes', 'config'];

function StepCard({
  index,
  icon,
  title,
  optional,
  summary,
  complete,
  isOpen,
  onToggle,
  delay,
  children,
}: {
  index: number;
  icon: LucideIcon;
  title: string;
  optional?: boolean;
  summary?: string;
  complete: boolean;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <AnimatedCard
      delay={delay}
      className={cn(
        'gap-0 overflow-hidden p-0',
        isOpen ? 'border-primary/35' : 'border-border'
      )}>
      <Pressable
        onPress={onToggle}
        className="flex-row items-center gap-3 p-4 active:opacity-70">
        <View
          className={cn(
            'h-7 w-7 items-center justify-center rounded-full border',
            complete ? 'border-primary bg-primary' : 'border-border bg-muted/40'
          )}>
          {complete ? (
            <Icon as={Check} size={13} className="text-primary-foreground" />
          ) : (
            <Text className="text-xs font-semibold text-muted-foreground">{index}</Text>
          )}
        </View>

        <Icon as={icon} size={16} className={complete ? 'text-primary' : 'text-muted-foreground'} />

        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm font-semibold text-foreground">{title}</Text>
            {optional && (
              <Text className="text-xs font-normal text-muted-foreground">· opcional</Text>
            )}
          </View>
          {summary ? (
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              {summary}
            </Text>
          ) : null}
        </View>

        <Icon as={isOpen ? ChevronUp : ChevronDown} size={18} className="text-muted-foreground" />
      </Pressable>

      {isOpen && (
        <View className="border-t border-border/60 p-4 pt-4">{children}</View>
      )}
    </AnimatedCard>
  );
}

export default function CreateProductScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tileSize = (width - 40 - 32 - 16) / 3; // screen px-5 + card p-4 + 2 gaps
  const [categoryName, setCategoryName] = React.useState<string | null>(null);
  const [categoryTouched, setCategoryTouched] = React.useState(false);
  const [descriptionHeight, setDescriptionHeight] = React.useState(DESCRIPTION_MIN_HEIGHT);
  const [imageAssets, setImageAssets] = React.useState<ImageAsset[]>([]);
  const [openStep, setOpenStep] = React.useState<StepId>('info');
  const createMutation = useCreateProductMutation();
  const uploadImageMutation = useUploadProductImageMutation();

  const toggleStep = (id: StepId) => setOpenStep((prev) => (prev === id ? ('' as StepId) : id));

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

  const [attributeRows, setAttributeRows] = React.useState<AttributeRowState[]>([]);

  const addAttributeRow = () => {
    setAttributeRows((prev) => [
      ...prev,
      { attributeKey: '', attributeLabel: '', value: '', isCustomValue: false },
    ]);
    setOpenStep('attributes');
  };

  const removeAttributeRow = (index: number) => {
    setAttributeRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAttributeType = (index: number, option: Option) => {
    setAttributeRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              attributeKey: option?.value ?? '',
              attributeLabel: option?.label ?? '',
              value: '',
              isCustomValue: false,
            }
          : row
      )
    );
  };

  const updateAttributeValueOption = (index: number, option: Option) => {
    setAttributeRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        if (option?.value === CUSTOM_ATTRIBUTE_VALUE) {
          return { ...row, value: '', isCustomValue: true };
        }
        return { ...row, value: option?.value ?? '', isCustomValue: false };
      })
    );
  };

  const updateAttributeValueText = (index: number, text: string) => {
    setAttributeRows((prev) => prev.map((row, i) => (i === index ? { ...row, value: text } : row)));
  };

  const switchAttributeValueToList = (index: number) => {
    setAttributeRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, isCustomValue: false, value: '' } : row))
    );
  };

  const availableOptionsFor = (rowIndex: number) =>
    PRODUCT_ATTRIBUTE_OPTIONS.filter(
      (opt) =>
        opt.value === attributeRows[rowIndex].attributeKey ||
        !attributeRows.some((r) => r.attributeKey === opt.value)
    );

  const allAttributeOptionsUsed = attributeRows.length >= PRODUCT_ATTRIBUTE_OPTIONS.length;

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
        const validAttributes: ProductAttributeInput[] = attributeRows
          .filter((row) => row.attributeKey && row.value.trim().length > 0)
          .map(({ attributeKey, attributeLabel, value }) => ({ attributeKey, attributeLabel, value }));

        const { id } = await createMutation.mutateAsync({
          name: value.name,
          description: value.description || undefined,
          basePrice: value.basePrice,
          isActive: value.isActive,
          categoryId: value.categoryId || undefined,
          attributes: validAttributes.length > 0 ? validAttributes : undefined,
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

  const attributesComplete = attributeRows.every(
    (row) => row.attributeKey && row.value.trim().length > 0
  );

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => <ScreenHeader title="Crear Producto" disabled={isSubmitting} />}
      </form.Subscribe>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8 pt-4">
          <form.Subscribe
            selector={(state) =>
              [
                state.values.name,
                state.values.basePrice,
                state.values.isActive,
                state.values.categoryId,
              ] as const
            }>
            {([name, basePrice, isActive, categoryId]) => {
              const infoComplete = name.trim().length > 0 && categoryId.trim().length > 0;
              const photosComplete = imageAssets.length > 0;
              const priceComplete = basePrice > 0;
              const stepComplete: Record<StepId, boolean> = {
                info: infoComplete,
                photos: photosComplete,
                price: priceComplete,
                attributes: attributesComplete,
                config: true,
              };
              const completedCount = STEP_ORDER.filter((id) => stepComplete[id]).length;

              return (
                <>
                  {/* Barra de progreso */}
                  <View className="mb-5 gap-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Progreso de la ficha
                      </Text>
                      <Text className="text-xs font-semibold tabular-nums text-primary">
                        {completedCount}/5 completado
                      </Text>
                    </View>
                    <View className="flex-row gap-1.5">
                      {STEP_ORDER.map((id) => (
                        <View
                          key={id}
                          className={cn(
                            'h-1.5 flex-1 rounded-full',
                            stepComplete[id] ? 'bg-primary' : 'bg-muted'
                          )}
                        />
                      ))}
                    </View>
                  </View>

                  <View className="gap-3">
                    {/* Paso 1: Información Básica */}
                    <StepCard
                      index={1}
                      icon={Package}
                      title="Información Básica"
                      complete={infoComplete}
                      summary={
                        name.trim().length > 0
                          ? categoryName
                            ? name
                            : `${name} · falta categoría`
                          : undefined
                      }
                      isOpen={openStep === 'info'}
                      onToggle={() => toggleStep('info')}
                      delay={0}>
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

                      <View className="mb-4">
                        <form.Field name="categoryId">
                          {(field) => (
                            <View>
                              <Label nativeID="categoryId" className="mb-2 text-sm font-medium">
                                Categoría <Text className="text-destructive">*</Text>
                              </Label>
                              <CategoryPicker
                                value={field.state.value || null}
                                valueName={categoryName}
                                onChange={(id, catName) => {
                                  field.handleChange(id ?? '');
                                  setCategoryName(catName);
                                  setCategoryTouched(true);
                                }}
                              />
                              {categoryTouched && field.state.value?.length === 0 && (
                                <Text className="mt-1.5 text-xs font-medium text-destructive">
                                  Selecciona una categoría
                                </Text>
                              )}
                            </View>
                          )}
                        </form.Field>
                      </View>

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
                              scrollEnabled={descriptionHeight >= DESCRIPTION_MAX_HEIGHT}
                              onContentSizeChange={(e) =>
                                setDescriptionHeight(
                                  Math.min(
                                    DESCRIPTION_MAX_HEIGHT,
                                    Math.max(DESCRIPTION_MIN_HEIGHT, e.nativeEvent.contentSize.height + 20)
                                  )
                                )
                              }
                              style={{ textAlignVertical: 'top', height: descriptionHeight }}
                            />
                          </View>
                        )}
                      </form.Field>
                    </StepCard>

                    {/* Paso 2: Imágenes */}
                    <StepCard
                      index={2}
                      icon={ImagePlus}
                      title="Fotos del Producto"
                      complete={photosComplete}
                      summary={
                        imageAssets.length > 0
                          ? `${imageAssets.length}/${MAX_IMAGES} fotos añadidas`
                          : undefined
                      }
                      isOpen={openStep === 'photos'}
                      onToggle={() => toggleStep('photos')}
                      delay={ANIMATION.STAGGER}>
                      {imageAssets.length > 0 ? (
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
                              {index === 0 && (
                                <View className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5">
                                  <Text className="text-[10px] font-semibold text-primary-foreground">
                                    Portada
                                  </Text>
                                </View>
                              )}
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
                                <Text className="text-xs font-medium text-muted-foreground">
                                  Cámara
                                </Text>
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
                    </StepCard>

                    {/* Paso 3: Precio */}
                    <StepCard
                      index={3}
                      icon={DollarSign}
                      title="Precio"
                      complete={priceComplete}
                      summary={priceComplete ? `S/. ${basePrice.toFixed(2)}` : undefined}
                      isOpen={openStep === 'price'}
                      onToggle={() => toggleStep('price')}
                      delay={ANIMATION.STAGGER * 2}>
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
                    </StepCard>

                    {/* Paso 4: Atributos */}
                    <StepCard
                      index={4}
                      icon={Tag}
                      title="Atributos"
                      optional
                      complete={attributesComplete}
                      summary={
                        attributeRows.length > 0
                          ? `${attributeRows.length} atributo${attributeRows.length > 1 ? 's' : ''}`
                          : 'Talla, color, material...'
                      }
                      isOpen={openStep === 'attributes'}
                      onToggle={() => toggleStep('attributes')}
                      delay={ANIMATION.STAGGER * 3}>
                      {attributeRows.length > 0 && (
                        <View className="mb-3 gap-2">
                          {attributeRows.map((row, index) => {
                            const suggestions =
                              PRODUCT_ATTRIBUTE_VALUE_SUGGESTIONS[row.attributeKey] ?? [];
                            const showValueList = suggestions.length > 0 && !row.isCustomValue;

                            return (
                              <View key={index} className="gap-1.5">
                                <View className="flex-row items-center gap-2">
                                  <Select
                                    value={
                                      row.attributeKey
                                        ? { value: row.attributeKey, label: row.attributeLabel }
                                        : undefined
                                    }
                                    onValueChange={(option) => updateAttributeType(index, option)}>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {availableOptionsFor(index).map((opt) => (
                                          <SelectItem key={opt.value} label={opt.label} value={opt.value}>
                                            {opt.label}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>

                                  {showValueList ? (
                                    <Select
                                      value={row.value ? { value: row.value, label: row.value } : undefined}
                                      onValueChange={(option) => updateAttributeValueOption(index, option)}>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Valor" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {suggestions.map((suggestion) => (
                                            <SelectItem
                                              key={suggestion}
                                              label={suggestion}
                                              value={suggestion}>
                                              {suggestion}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectItem
                                          label="Personalizado (escribir)"
                                          value={CUSTOM_ATTRIBUTE_VALUE}>
                                          Personalizado (escribir)
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      placeholder="Valor"
                                      value={row.value}
                                      onChangeText={(text) => updateAttributeValueText(index, text)}
                                      editable={!!row.attributeKey}
                                      className={cn('h-10 flex-1', !row.attributeKey && 'opacity-50')}
                                    />
                                  )}

                                  <Pressable
                                    onPress={() => removeAttributeRow(index)}
                                    className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/20 active:opacity-70">
                                    <Icon as={X} className="text-muted-foreground" size={16} />
                                  </Pressable>
                                </View>

                                {row.isCustomValue && suggestions.length > 0 && (
                                  <Pressable
                                    onPress={() => switchAttributeValueToList(index)}
                                    className="self-start active:opacity-70">
                                    <Text className="text-xs font-medium text-primary">
                                      Volver a la lista
                                    </Text>
                                  </Pressable>
                                )}
                              </View>
                            );
                          })}
                        </View>
                      )}

                      <Pressable
                        onPress={addAttributeRow}
                        disabled={allAttributeOptionsUsed}
                        className={cn(
                          'flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3 active:opacity-70',
                          allAttributeOptionsUsed && 'opacity-50'
                        )}>
                        <Icon as={Plus} className="text-primary" size={16} />
                        <Text className="text-sm font-medium text-primary">
                          {allAttributeOptionsUsed ? 'Todos los atributos agregados' : 'Agregar atributo'}
                        </Text>
                      </Pressable>
                    </StepCard>

                    {/* Paso 5: Configuración */}
                    <StepCard
                      index={5}
                      icon={Settings2}
                      title="Configuración"
                      complete
                      summary={isActive ? 'Activo · visible para clientes' : 'Inactivo · oculto'}
                      isOpen={openStep === 'config'}
                      onToggle={() => toggleStep('config')}
                      delay={ANIMATION.STAGGER * 4}>
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
                    </StepCard>
                  </View>
                </>
              );
            }}
          </form.Subscribe>

          {/* Botones de Acción */}
          <View className="mt-6 gap-3">
            <form.Subscribe
              selector={(state) =>
                [
                  state.canSubmit,
                  state.isSubmitting,
                  state.values.name,
                  state.values.basePrice,
                  state.values.categoryId,
                ] as const
              }>
              {([canSubmit, isSubmitting, name, basePrice, categoryId]) => {
                const missing = [
                  name.trim().length === 0 && 'nombre del producto',
                  categoryId.trim().length === 0 && 'categoría',
                  basePrice <= 0 && 'precio',
                ].filter(Boolean) as string[];
                const blocked = missing.length > 0;
                const missingLabel =
                  missing.length <= 1
                    ? missing.join('')
                    : `${missing.slice(0, -1).join(', ')} y ${missing.at(-1)}`;

                return (
                  <>
                    <Button
                      onPress={form.handleSubmit}
                      disabled={!canSubmit || blocked}
                      size="lg"
                      className="gap-2">
                      <Icon as={Sparkles} className="text-primary-foreground" size={18} />
                      <Text className="font-semibold text-primary-foreground">
                        {isSubmitting ? 'Creando...' : 'Crear Producto'}
                      </Text>
                    </Button>
                    {blocked && (
                      <Text className="-mt-1.5 text-center text-xs text-muted-foreground">
                        Falta completar: {missingLabel}
                      </Text>
                    )}

                    <Button
                      variant="outline"
                      size="lg"
                      disabled={isSubmitting}
                      onPress={() => router.back()}>
                      <Text>Cancelar</Text>
                    </Button>
                  </>
                );
              }}
            </form.Subscribe>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
