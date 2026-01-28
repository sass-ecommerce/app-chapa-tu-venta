import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useAuth, useUser } from '@clerk/clerk-expo';
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
} from 'lucide-react-native';
import * as React from 'react';
import { View, ScrollView, Alert } from 'react-native';

export default function PerfilScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const userInitials = React.useMemo(() => {
    const name = user?.fullName || user?.emailAddresses[0]?.emailAddress || 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.fullName, user?.emailAddresses]);

  const createdAt = React.useMemo(() => {
    if (!user?.createdAt) return null;
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
            await signOut();
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

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-6 p-4 pt-12">
        {/* Header con Avatar y Info del Usuario */}
        <Card>
          <CardHeader className="items-center gap-4 pb-6">
            <Avatar alt={`${user?.fullName || 'Usuario'}'s avatar`} className="size-24">
              <AvatarImage source={user?.imageUrl ? { uri: user.imageUrl } : undefined} />
              <AvatarFallback>
                <Text className="text-2xl">{userInitials}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="items-center gap-1">
              <Text className="text-center text-2xl font-semibold">
                {user?.fullName || 'Usuario'}
              </Text>
              {user?.username && (
                <Text className="text-center text-muted-foreground">@{user.username}</Text>
              )}
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
        </Card>

        {/* Información de la Cuenta */}
        <Card>
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
                <Text className="font-medium">
                  {user?.emailAddresses[0]?.emailAddress || 'No disponible'}
                </Text>
              </View>
              {user?.emailAddresses[0]?.verification?.status === 'verified' && (
                <Icon as={ShieldCheckIcon} className="size-5 text-green-600" />
              )}
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
        </Card>

        {/* Configuración y Opciones */}
        <Card>
          <CardHeader>
            <Text className="text-lg font-semibold">Configuración</Text>
          </CardHeader>
          <CardContent className="gap-1">
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
        </Card>

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
    </ScrollView>
  );
}
