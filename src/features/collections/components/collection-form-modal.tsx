import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  View,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Camera, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Icon } from '@/shared/components/ui/icon';
import { getVitrinaTheme } from '@/shared/config/vitrina-palette';
import type { Collection } from '../types';

export type CollectionImageAsset = {
  uri: string;
  mimeType: string;
  fileName: string;
};

const EXT_TO_MIME: Record<string, string> = {
  heic: 'image/heic',
  heif: 'image/heif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

interface CollectionFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; imageAsset?: CollectionImageAsset | null }) => void;
  isLoading?: boolean;
  editCollection?: Collection;
}

export function CollectionFormModal({
  visible,
  onClose,
  onSave,
  isLoading,
  editCollection,
}: CollectionFormModalProps) {
  const { colorScheme } = useColorScheme();
  const theme = getVitrinaTheme(colorScheme === 'dark');
  const [name, setName] = React.useState('');
  const [imageAsset, setImageAsset] = React.useState<CollectionImageAsset | null>(null);
  const [modalVisible, setModalVisible] = React.useState(visible);

  React.useEffect(() => {
    setModalVisible(visible);
    if (visible) {
      setName(editCollection?.name ?? '');
      setImageAsset(null);
    }
  }, [visible, editCollection]);

  const isEditing = !!editCollection;
  const isValid = name.trim().length > 0;
  const previewUri = imageAsset?.uri ?? (isEditing ? editCollection?.coverImageUrl : null);

  const addImageAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const uriExt = asset.uri.split('.').pop()?.toLowerCase();
    const mimeType = asset.mimeType ?? EXT_TO_MIME[uriExt ?? ''] ?? 'image/jpeg';
    const ext = mimeType.split('/')[1] ?? uriExt ?? 'jpeg';
    setImageAsset({
      uri: asset.uri,
      mimeType,
      fileName: asset.fileName ?? `collection_${Date.now()}.${ext}`,
    });
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu cámara para tomar fotos.');
      return;
    }
    setModalVisible(false);
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    setModalVisible(true);
    if (!result.canceled) addImageAsset(result.assets[0]);
  };

  const openLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu biblioteca de fotos.');
      return;
    }
    setModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    setModalVisible(true);
    if (!result.canceled) addImageAsset(result.assets[0]);
  };

  const pickCover = () => {
    Alert.alert('Portada de la colección', 'Elige una opción', [
      { text: 'Cámara', onPress: openCamera },
      { text: 'Biblioteca de fotos', onPress: openLibrary },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSave = () => {
    if (!isValid) return;
    onSave({ name: name.trim(), imageAsset });
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={isLoading ? undefined : onClose}
      statusBarTranslucent>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            className="rounded-t-3xl px-6 pb-10 pt-4"
            style={{ backgroundColor: theme.surface }}>
            <View
              className="mb-5 h-1 w-10 self-center rounded-full"
              style={{ backgroundColor: theme.ink + '30' }}
            />

            <View className="mb-6 flex-row items-start justify-between">
              <Text className="text-xl font-black uppercase tracking-tight">
                {isEditing ? 'Editar colección' : 'Nueva colección'}
              </Text>
              <Pressable
                onPress={onClose}
                disabled={isLoading}
                className="rounded-full p-1.5 active:opacity-70"
                style={{ opacity: isLoading ? 0.4 : 1 }}>
                <Icon as={X} size={20} color={theme.muted} />
              </Pressable>
            </View>

            <View className="mb-4">
              <Label className="mb-2 text-sm font-medium">Nombre *</Label>
              <Input
                placeholder="Ej: Ofertas de verano"
                value={name}
                onChangeText={setName}
                className="h-12 rounded-lg border-[1.5px] shadow-none"
                style={{ borderColor: theme.ink, backgroundColor: theme.bg, color: theme.ink }}
                placeholderTextColor={theme.muted}
                autoFocus
              />
            </View>

            <View className="mb-6">
              <Label className="mb-2 text-sm font-medium">Portada</Label>
              {previewUri ? (
                <Pressable
                  onPress={pickCover}
                  className="relative h-28 overflow-hidden rounded-2xl active:opacity-80">
                  <Image
                    source={{ uri: previewUri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={() => setImageAsset(null)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 active:opacity-70">
                    <Icon as={X} size={13} color="#fff" />
                  </Pressable>
                </Pressable>
              ) : (
                <Pressable
                  onPress={pickCover}
                  className="h-28 items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed"
                  style={{ borderColor: theme.muted + '40' }}>
                  <Icon as={Camera} size={22} color={theme.muted} />
                  <Text className="text-xs font-bold" style={{ color: theme.muted }}>
                    Agregar portada (opcional)
                  </Text>
                </Pressable>
              )}
              <Text className="mt-2 text-xs" style={{ color: theme.muted }}>
                Sin portada, usamos un collage automático de sus productos.
              </Text>
            </View>

            <View className="gap-3">
              <Button
                onPress={handleSave}
                disabled={!isValid || isLoading}
                size="lg"
                style={{ backgroundColor: theme.accent, opacity: !isValid || isLoading ? 0.5 : 1 }}>
                <Text className="font-bold text-white">
                  {isLoading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear colección'}
                </Text>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onPress={onClose}
                disabled={isLoading}
                style={{ borderColor: theme.ink, opacity: isLoading ? 0.5 : 1 }}>
                <Text style={{ color: theme.ink }}>Cancelar</Text>
              </Button>
            </View>
          </View>

          {isLoading && (
            <View
              pointerEvents="auto"
              className="absolute inset-0 items-center justify-center"
              style={{ backgroundColor: theme.bg + 'B3' }}>
              <ActivityIndicator size="large" color={theme.accent} />
              <Text className="mt-3 text-sm font-bold" style={{ color: theme.ink }}>
                {isEditing ? 'Guardando cambios...' : 'Creando colección...'}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
