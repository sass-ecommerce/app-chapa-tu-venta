import * as React from 'react';
import {
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'nativewind';
import { router } from 'expo-router';

import {
  LogOutIcon,
  MailIcon,
  ShieldCheckIcon,
  UserIcon,
  CalendarIcon,
  ChevronRightIcon,
  BellIcon,
  LockIcon,
  HelpCircleIcon,
  FileTextIcon,
  PencilIcon,
  CameraIcon,
  ImageIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { AnimatedCard } from '@/shared/components/ui/animated-card';
import { CardContent, CardHeader } from '@/shared/components/ui/card';
import { Icon } from '@/shared/components/ui/icon';
import { Separator } from '@/shared/components/ui/separator';
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
import { ANIMATION, REFRESH_COLORS } from '@/shared/config/constants';

export default function PerfilScreen() {
  const { user } = {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      imageUrl: null,
    },
  };
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const pickImageFromGallery = async () => {
    setShowImageDialog(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
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
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!user) return;

    try {
      setIsUploadingImage(true);
      setImageUri(uri);

      // TODO: Implementar upload de imagen con API custom
      // Por ahora solo mostramos la imagen localmente
      console.log('⚠️ [Profile] Image upload not yet implemented in custom API');

      Alert.alert(
        'En desarrollo',
        'La función de actualizar foto de perfil estará disponible pronto'
      );
    } catch (error) {
      console.error('❌ [Profile] Error uploading image:', error);
      Alert.alert('Error', 'No se pudo actualizar la foto de perfil');
      setImageUri(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const userInitials = React.useMemo(() => {
    if (!user) return 'U';
    const name = `${user.firstName} ${user.lastName}`.trim() || user.email || 'U';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.firstName, user?.lastName, user?.email]);

  const createdAt = React.useMemo(() => {
    if (user.createdAt) return null;
    return new Date(user.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [user?.createdAt]);

  const handleSignOut = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsSigningOut(true);
            console.log('🚪 [Profile] User initiated sign out');
            //await signOut();
            console.log('✅ [Profile] Sign out successful');
          } catch (error) {
            console.error('❌ [Profile] Sign out error:', error);
            Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta nuevamente.');
            setIsSigningOut(false);
          }
        },
      },
    ]);
  };

  const handleToggleTheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newScheme);
    console.log(`🎨 [Profile] Theme changed to: ${newScheme}`);
  };

  // const onRefresh = React.useCallback(async () => {
  //   setRefreshing(true);
  //   // Reload user data from API
  //   await refreshUser();
  //   setRefreshing(false);
  // }, [refreshUser]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          //onRefresh={onRefresh}
          colors={[REFRESH_COLORS.LIGHT]}
          tintColor={REFRESH_COLORS.LIGHT}
        />
      }>
      <View className="gap-6 px-5 pt-12">
        {/* Header con Avatar y Info del Usuario */}
        <AnimatedCard delay={0}>
          <CardHeader className="items-center gap-4 pb-6">
            <Pressable onPress={() => setShowImageDialog(true)} disabled={isUploadingImage}>
              <View className="relative">
                <Avatar
                  alt={`${user ? `${user.firstName} ${user.lastName}` : 'Usuario'}'s avatar`}
                  className="size-24">
                  <AvatarImage source={{ uri: imageUri || user?.imageUrl || undefined }} />
                  <AvatarFallback>
                    <Text className="text-2xl">{userInitials}</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="absolute bottom-0 right-0 rounded-full bg-primary p-2">
                  {isUploadingImage ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Icon as={CameraIcon} className="size-4 text-primary-foreground" />
                  )}
                </View>
              </View>
            </Pressable>
            <View className="items-center gap-1">
              <Text className="text-center text-2xl font-semibold">
                {user ? `${user.firstName} ${user.lastName}`.trim() : 'Usuario'}
              </Text>
            </View>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-2"
              onPress={() => router.push('/profile/edit')}>
              <Icon as={PencilIcon} className="size-4" />
              <Text>Editar Perfil</Text>
            </Button>
          </CardHeader>
        </AnimatedCard>

        {/* Información de la Cuenta */}
        <AnimatedCard delay={ANIMATION.STAGGER}>
          <CardHeader>
            <Text className="text-lg font-semibold">Información de la Cuenta</Text>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="flex-row items-center gap-3">
              <View className="size-10 items-center justify-center rounded-full bg-primary/10">
                <Icon as={MailIcon} className="size-5 text-primary" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground">Email</Text>
                <Text className="font-medium">{user?.email || 'No disponible'}</Text>
              </View>
              {user?.email && <Icon as={ShieldCheckIcon} className="size-5 text-green-600" />}
            </View>

            <Separator />

            <View className="flex-row items-center gap-3">
              <View className="size-10 items-center justify-center rounded-full bg-primary/10">
                <Icon as={UserIcon} className="size-5 text-primary" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground">Nombre</Text>
                <Text className="font-medium">{user?.firstName || 'No disponible'}</Text>
              </View>
            </View>

            {createdAt && (
              <>
                <Separator />
                <View className="flex-row items-center gap-3">
                  <View className="size-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon as={CalendarIcon} className="size-5 text-primary" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-muted-foreground">Miembro desde</Text>
                    <Text className="font-medium">{createdAt}</Text>
                  </View>
                </View>
              </>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Configuración y Opciones */}
        <AnimatedCard delay={ANIMATION.STAGGER * 2}>
          <CardHeader>
            <Text className="text-lg font-semibold">Configuración</Text>
          </CardHeader>
          <CardContent className="gap-1">
            <Button
              variant="ghost"
              className="h-14 justify-start gap-3 px-3"
              onPress={handleToggleTheme}>
              <Icon
                as={colorScheme === 'dark' ? SunIcon : MoonIcon}
                className="size-5 text-muted-foreground"
              />
              <Text className="flex-1 text-left">
                {colorScheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </Text>
              <Icon as={ChevronRightIcon} className="size-5 text-muted-foreground" />
            </Button>

            <Separator />

            <Button
              variant="ghost"
              className="h-14 justify-start gap-3 px-3"
              onPress={() => {
                // TODO: Implementar navegación a notificaciones
                Alert.alert('Próximamente', 'Esta función estará disponible pronto');
              }}>
              <Icon as={BellIcon} className="size-5 text-muted-foreground" />
              <Text className="flex-1 text-left">Notificaciones</Text>
              <Icon as={ChevronRightIcon} className="size-5 text-muted-foreground" />
            </Button>

            <Separator />

            <Button
              variant="ghost"
              className="h-14 justify-start gap-3 px-3"
              onPress={() => {
                // TODO: Implementar navegación a privacidad
                Alert.alert('Próximamente', 'Esta función estará disponible pronto');
              }}>
              <Icon as={LockIcon} className="size-5 text-muted-foreground" />
              <Text className="flex-1 text-left">Privacidad y Seguridad</Text>
              <Icon as={ChevronRightIcon} className="size-5 text-muted-foreground" />
            </Button>

            <Separator />

            <Button
              variant="ghost"
              className="h-14 justify-start gap-3 px-3"
              onPress={() => {
                // TODO: Implementar navegación a ayuda
                Alert.alert('Próximamente', 'Esta función estará disponible pronto');
              }}>
              <Icon as={HelpCircleIcon} className="size-5 text-muted-foreground" />
              <Text className="flex-1 text-left">Ayuda y Soporte</Text>
              <Icon as={ChevronRightIcon} className="size-5 text-muted-foreground" />
            </Button>

            <Separator />

            <Button
              variant="ghost"
              className="h-14 justify-start gap-3 px-3"
              onPress={() => {
                // TODO: Implementar navegación a términos
                Alert.alert('Próximamente', 'Esta función estará disponible pronto');
              }}>
              <Icon as={FileTextIcon} className="size-5 text-muted-foreground" />
              <Text className="flex-1 text-left">Términos y Condiciones</Text>
              <Icon as={ChevronRightIcon} className="size-5 text-muted-foreground" />
            </Button>
          </CardContent>
        </AnimatedCard>

        {/* Botón de Cerrar Sesión */}
        <Button
          variant="destructive"
          size="lg"
          onPress={handleSignOut}
          disabled={isSigningOut}
          className="gap-2">
          <Icon as={LogOutIcon} className="size-5" />
          <Text>{isSigningOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</Text>
        </Button>

        {/* Información de la App */}
        <View className="items-center gap-1 pb-4">
          <Text className="text-xs text-muted-foreground">Chapa Tu Venta</Text>
          <Text className="text-xs text-muted-foreground">Versión 1.0.0</Text>
        </View>
      </View>

      <AlertDialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiar foto de perfil</AlertDialogTitle>
            <AlertDialogDescription>
              Elige una opción para actualizar tu foto de perfil
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={pickImageFromGallery}>
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
    </ScrollView>
  );
}
