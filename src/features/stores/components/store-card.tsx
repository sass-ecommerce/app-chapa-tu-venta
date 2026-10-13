import * as React from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { CameraIcon, ImageIcon } from 'lucide-react-native';

import { useMyTenantQuery, useUploadStoreLogoMutation } from '../queries';
import { AnimatedCard } from '@/shared/components/ui/animated-card';
import { CardContent, CardHeader } from '@/shared/components/ui/card';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { STORE_WEB_DOMAIN } from '@/shared/config/constants';

function storeInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * "Mi tienda": logo, nombre y dominio de la tienda del usuario. Tocar el logo
 * permite cambiarlo (galería o cámara); se sube como PNG cuadrado.
 */
export function StoreCard({ delay = 0 }: { delay?: number }) {
  const { data: tenant } = useMyTenantQuery();
  const uploadLogoMutation = useUploadStoreLogoMutation();
  const [showImageDialog, setShowImageDialog] = React.useState(false);

  // Usuario sin tienda todavía (o error al cargarla): no hay nada que mostrar.
  if (!tenant) return null;

  const uploadLogo = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      await uploadLogoMutation.mutateAsync({
        fileUri: asset.uri,
        contentType: asset.mimeType ?? 'image/jpeg',
        tenantId: tenant.id,
      });
    } catch (error) {
      console.error('❌ [StoreCard] Error uploading logo:', error);
      Alert.alert('Error', 'No se pudo actualizar el logo. Intenta de nuevo.');
    }
  };

  const pickFromGallery = async () => {
    setShowImageDialog(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) await uploadLogo(result.assets[0]);
  };

  const takePhoto = async () => {
    setShowImageDialog(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para tomar fotos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) await uploadLogo(result.assets[0]);
  };

  const isUploading = uploadLogoMutation.isPending;

  return (
    <>
      <AnimatedCard delay={delay}>
        <CardHeader>
          <Text className="text-lg font-semibold">Mi tienda</Text>
        </CardHeader>
        <CardContent className="flex-row items-center gap-4">
          <Pressable
            onPress={() => setShowImageDialog(true)}
            disabled={isUploading}
            accessibilityRole="button"
            accessibilityLabel="Cambiar logo de la tienda">
            <View className="relative">
              <View className="size-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
                {tenant.logoUrl ? (
                  <Image
                    source={{ uri: tenant.logoUrl }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={150}
                  />
                ) : (
                  <Text className="text-lg font-semibold text-muted-foreground">
                    {storeInitials(tenant.name)}
                  </Text>
                )}
              </View>
              <View className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5">
                {isUploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Icon as={CameraIcon} className="size-3.5 text-primary-foreground" />
                )}
              </View>
            </View>
          </Pressable>
          <View className="flex-1 gap-0.5">
            <Text className="font-semibold" numberOfLines={1}>
              {tenant.name}
            </Text>
            <Text className="text-sm text-muted-foreground" numberOfLines={1}>
              {tenant.domain}.{STORE_WEB_DOMAIN}
            </Text>
          </View>
        </CardContent>
      </AnimatedCard>

      <AlertDialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiar logo de la tienda</AlertDialogTitle>
            <AlertDialogDescription>
              Es la imagen que verán tus clientes en tu tienda y al compartir links.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={pickFromGallery}>
              <Icon as={ImageIcon} className="mr-2 size-4" />
              <Text>Galería</Text>
            </AlertDialogAction>
            <AlertDialogAction onPress={takePhoto}>
              <Icon as={CameraIcon} className="mr-2 size-4" />
              <Text>Cámara</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
