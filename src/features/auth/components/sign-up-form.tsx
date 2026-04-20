import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Link, router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { Text } from '@/shared/components/ui/text';
import { StatusDialog } from '@/src/shared/components/status-dialog';
import { useRegisterMutation } from '@/features/auth/queries';
import { logError } from '@/shared/utils/utils';

const BRAND = '#E86A1F';

function colors(dark: boolean) {
  if (dark) return {
    bg: '#0F0D0B', fg: '#F5F1EC',
    muted: 'rgba(245,241,236,0.55)',
    card: '#18150F', border: 'rgba(245,241,236,0.09)',
    inputBg: 'rgba(245,241,236,0.04)',
    chip: 'rgba(245,241,236,0.06)', placeholder: 'rgba(245,241,236,0.35)',
  };
  return {
    bg: '#FAF7F2', fg: '#1A1815',
    muted: 'rgba(26,24,21,0.55)',
    card: '#FFFFFF', border: 'rgba(26,24,21,0.08)',
    inputBg: '#FAF7F2',
    chip: '#FFFFFF', placeholder: 'rgba(26,24,21,0.35)',
  };
}

function MailIcon({ color }: { color: string }) {
  return <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect x={2} y={4} width={14} height={11} rx={2} stroke={color} strokeWidth={1.5} />
    <Path d="M2.5 5l6.5 5 6.5-5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>;
}
function LockIcon({ color }: { color: string }) {
  return <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect x={3} y={8} width={12} height={8} rx={2} stroke={color} strokeWidth={1.5} />
    <Path d="M6 8V5a3 3 0 016 0v3" stroke={color} strokeWidth={1.5} />
  </Svg>;
}
function BackChevron({ color }: { color: string }) {
  return <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path d="M10 2L4 7l6 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}
function CheckSm() {
  return <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
    <Path d="M2 5l2 2 4-5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

export function SignUpForm() {
  const registerMutation = useRegisterMutation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const c = colors(isDark);

  const [showPassword, setShowPassword] = React.useState(false);
  const [accepted, setAccepted] = React.useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

  const lastNameRef = React.useRef<TextInput>(null);
  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const form = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      if (!accepted) return;
      try {
        await registerMutation.mutateAsync({
          email: value.email, password: value.password,
          firstName: value.firstName, lastName: value.lastName,
        });
        router.push({ pathname: '/(auth)/sign-up/verify-email', params: { email: value.email } });
      } catch (err) {
        logError('[SignUp] failed:', err);
        setErrorDialogOpen(true);
      }
    },
  });

  const fieldStyle = (focused = false): object => ({
    height: 52, borderRadius: 14,
    backgroundColor: c.inputBg,
    borderWidth: 1, borderColor: focused ? BRAND : c.border,
    paddingHorizontal: 14, fontSize: 15, color: c.fg,
  });

  const rowField = (focused = false): object => ({
    ...fieldStyle(focused), flex: 1,
  });

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ height: insets.top + 8 }} />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.chip, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}>
          <BackChevron color={c.fg} />
        </Pressable>
        <Text style={{ fontSize: 13, color: c.muted }}>
          Paso <Text style={{ color: c.fg, fontWeight: '700' }}>1</Text>/3
        </Text>
      </View>

      {/* Hero */}
      <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
        <Text style={{ fontFamily: 'InstrumentSerif_400Regular', fontSize: 36, lineHeight: 38, color: c.fg, letterSpacing: -0.8 }}>
          {'Crea tu cuenta\n'}
          <Text style={{ fontFamily: 'InstrumentSerif_400Regular_Italic', color: BRAND }}>gratis</Text>
        </Text>
        <Text style={{ marginTop: 8, fontSize: 14, color: c.muted }}>
          Sin comisiones ocultas. Listo en 2 minutos.
        </Text>
      </View>

      {/* Card */}
      <View style={{
        margin: 16, marginTop: 20, padding: 20,
        backgroundColor: c.card, borderRadius: 24,
        borderWidth: 1, borderColor: c.border, gap: 14,
        shadowColor: isDark ? '#000' : '#141428',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 50, elevation: 8,
      }}>
        {/* Name row */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <form.Field name="firstName" validators={{ onChange: z.string().min(2, 'Mínimo 2 caracteres') }}>
            {(field) => (
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: c.fg }}>Nombre</Text>
                <TextInput
                  style={rowField()}
                  placeholder="María"
                  placeholderTextColor={c.placeholder}
                  autoCapitalize="words"
                  autoComplete="given-name"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text style={{ fontSize: 11, color: '#E05252' }}>{String(field.state.meta.errors[0]?.message)}</Text>
                )}
              </View>
            )}
          </form.Field>
          <form.Field name="lastName" validators={{ onChange: z.string().min(2, 'Mínimo 2 caracteres') }}>
            {(field) => (
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: c.fg }}>Apellido</Text>
                <TextInput
                  ref={lastNameRef}
                  style={rowField()}
                  placeholder="López"
                  placeholderTextColor={c.placeholder}
                  autoCapitalize="words"
                  autoComplete="family-name"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text style={{ fontSize: 11, color: '#E05252' }}>{String(field.state.meta.errors[0]?.message)}</Text>
                )}
              </View>
            )}
          </form.Field>
        </View>

        {/* Email */}
        <form.Field name="email" validators={{ onChange: z.string().min(1, 'Requerido').email('Correo inválido') }}>
          {(field) => (
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: c.fg }}>Correo electrónico</Text>
              <View style={{ height: 52, borderRadius: 14, backgroundColor: c.inputBg, borderWidth: 1, borderColor: c.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
                <MailIcon color={c.muted} />
                <TextInput
                  ref={emailRef}
                  style={{ flex: 1, fontSize: 15, color: c.fg }}
                  placeholder="maria@ejemplo.com"
                  placeholderTextColor={c.placeholder}
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              {field.state.meta.errors.length > 0 && (
                <Text style={{ fontSize: 12, color: '#E05252' }}>{String(field.state.meta.errors[0]?.message)}</Text>
              )}
            </View>
          )}
        </form.Field>

        {/* Password */}
        <form.Field name="password" validators={{ onChange: z.string().min(6, 'Mínimo 6 caracteres') }}>
          {(field) => (
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: c.fg }}>Contraseña</Text>
              <View style={{ height: 52, borderRadius: 14, backgroundColor: c.inputBg, borderWidth: 1, borderColor: c.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
                <LockIcon color={c.muted} />
                <TextInput
                  ref={passwordRef}
                  style={{ flex: 1, fontSize: 15, color: c.fg }}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={c.placeholder}
                  secureTextEntry={!showPassword}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  returnKeyType="done"
                />
                <Pressable onPress={() => setShowPassword((v) => !v)}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: c.muted }}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                </Pressable>
              </View>
              {field.state.meta.errors.length > 0 && (
                <Text style={{ fontSize: 12, color: '#E05252' }}>{String(field.state.meta.errors[0]?.message)}</Text>
              )}
            </View>
          )}
        </form.Field>

        {/* Terms badge */}
        <Pressable
          onPress={() => setAccepted((v) => !v)}
          style={{ flexDirection: 'row', gap: 8, padding: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,132,48,0.1)' : '#FFF7F0', borderWidth: 1, borderColor: isDark ? 'rgba(255,132,48,0.2)' : '#FFE4CC' }}>
          <View style={{ width: 18, height: 18, borderRadius: 6, backgroundColor: accepted ? BRAND : 'transparent', borderWidth: accepted ? 0 : 1.5, borderColor: c.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            {accepted && <CheckSm />}
          </View>
          <Text style={{ flex: 1, fontSize: 12, color: c.fg, lineHeight: 18 }}>
            Acepto{' '}
            <Text style={{ textDecorationLine: 'underline', color: c.fg }}>Términos</Text>
            {' '}y{' '}
            <Text style={{ textDecorationLine: 'underline', color: c.fg }}>Privacidad</Text>
            {'. '}
            Gana $10 al registrar tu primera venta.
          </Text>
        </Pressable>

        {/* CTA */}
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Pressable
              onPress={accepted ? form.handleSubmit : undefined}
              style={{
                height: 54, borderRadius: 14, backgroundColor: BRAND,
                alignItems: 'center', justifyContent: 'center',
                opacity: !accepted || isSubmitting || registerMutation.isPending ? 0.6 : 1,
                shadowColor: BRAND, shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35, shadowRadius: 22, elevation: 6,
              }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.1 }}>
                {isSubmitting || registerMutation.isPending ? 'Creando cuenta...' : 'Continuar →'}
              </Text>
            </Pressable>
          )}
        </form.Subscribe>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ paddingBottom: insets.bottom + 28, alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: c.muted }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/(auth)/sign-in" dismissTo>
            <Text style={{ fontSize: 14, color: BRAND, fontWeight: '700' }}>Inicia sesión</Text>
          </Link>
        </Text>
      </View>

      <StatusDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        variant="error"
        title="No pudimos crear tu cuenta"
        description="Ocurrió un problema al registrar tu cuenta. Puedes intentarlo nuevamente."
        actionLabel="Reintentar ahora"
        onAction={() => setErrorDialogOpen(false)}
      />
    </View>
  );
}
