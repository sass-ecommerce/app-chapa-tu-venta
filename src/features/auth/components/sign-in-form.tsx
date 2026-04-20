import * as React from 'react';
import { Pressable, TextInput, View, Alert } from 'react-native';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Link, router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { Text } from '@/shared/components/ui/text';
import { useLoginMutation, authStorage } from '@/features/auth';

// ─── Design tokens ─────────────────────────────────────────────────
const BRAND = '#E86A1F';

function colors(dark: boolean) {
  if (dark) return {
    bg: '#0F0D0B', fg: '#F5F1EC',
    muted: 'rgba(245,241,236,0.55)',
    muted2: 'rgba(245,241,236,0.12)',
    card: '#18150F',
    border: 'rgba(245,241,236,0.09)',
    inputBg: 'rgba(245,241,236,0.04)',
    socialBg: 'rgba(245,241,236,0.04)',
    chip: 'rgba(245,241,236,0.06)',
    placeholder: 'rgba(245,241,236,0.35)',
  };
  return {
    bg: '#FAF7F2', fg: '#1A1815',
    muted: 'rgba(26,24,21,0.55)',
    muted2: 'rgba(26,24,21,0.10)',
    card: '#FFFFFF',
    border: 'rgba(26,24,21,0.08)',
    inputBg: '#FAF7F2',
    socialBg: '#FFFFFF',
    chip: '#FFFFFF',
    placeholder: 'rgba(26,24,21,0.35)',
  };
}

// ─── Shared primitives ─────────────────────────────────────────────
function BrandMark({ dark, size = 44 }: { dark: boolean; size?: number }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: size * 0.28,
      backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      shadowColor: BRAND, shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35, shadowRadius: 24, elevation: 6,
    }}>
      {/* diagonal stripe */}
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'transparent',
        borderTopWidth: size * 0.35, borderTopColor: 'rgba(255,255,255,0.18)',
        borderLeftWidth: size, borderLeftColor: 'transparent',
        borderStyle: 'solid',
      }} />
      <Svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none">
        <Path d="M4 14l5 5 11-13" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

function Field({
  label, placeholder, value, dark, focused = false,
  icon, trailing, onChangeText, onBlur, secureTextEntry = false,
  keyboardType, autoComplete, autoCapitalize, returnKeyType, onSubmitEditing, inputRef,
}: {
  label?: string; placeholder?: string; value?: string; dark: boolean; focused?: boolean;
  icon?: React.ReactNode; trailing?: React.ReactNode;
  onChangeText?: (text: string) => void; onBlur?: () => void;
  secureTextEntry?: boolean; keyboardType?: any; autoComplete?: any;
  autoCapitalize?: any; returnKeyType?: any;
  onSubmitEditing?: () => void; inputRef?: React.RefObject<TextInput | null>;
}) {
  const c = colors(dark);
  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text style={{ fontSize: 13, fontWeight: '600', color: c.fg, letterSpacing: -0.1 }}>
          {label}
        </Text>
      )}
      <View style={{
        height: 52, borderRadius: 14,
        backgroundColor: c.inputBg,
        borderWidth: 1, borderColor: focused ? BRAND : c.border,
        shadowColor: focused ? BRAND : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: focused ? 0.13 : 0,
        shadowRadius: focused ? 6 : 0,
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14, gap: 10,
      }}>
        {icon}
        <TextInput
          ref={inputRef}
          style={{ flex: 1, fontSize: 15, color: value ? c.fg : c.placeholder, fontFamily: 'Inter, System' }}
          placeholder={placeholder}
          placeholderTextColor={c.placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {trailing}
      </View>
    </View>
  );
}

function MailIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Rect x={2} y={4} width={14} height={11} rx={2} stroke={color} strokeWidth={1.5} />
      <Path d="M2.5 5l6.5 5 6.5-5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
function LockIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Rect x={3} y={8} width={12} height={8} rx={2} stroke={color} strokeWidth={1.5} />
      <Path d="M6 8V5a3 3 0 016 0v3" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}
function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Path d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.78 2.72v2.26h2.88c1.69-1.55 2.66-3.84 2.66-6.62z" fill="#4285F4" />
      <Path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.88-2.26c-.8.54-1.83.86-3.08.86-2.37 0-4.38-1.6-5.1-3.75H.9v2.33C2.39 15.98 5.48 18 9 18z" fill="#34A853" />
      <Path d="M3.9 10.67a5.41 5.41 0 010-3.34V5H.9a9 9 0 000 8l3-2.33z" fill="#FBBC05" />
      <Path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.39 2.02.9 5l3 2.33C4.62 5.18 6.63 3.58 9 3.58z" fill="#EA4335" />
    </Svg>
  );
}
function AppleIcon({ dark }: { dark: boolean }) {
  return (
    <Svg width={16} height={18} viewBox="0 0 18 20" fill={dark ? '#fff' : '#000'}>
      <Path d="M14.94 10.6c-.03-2.83 2.31-4.19 2.42-4.26-1.32-1.93-3.38-2.19-4.11-2.22-1.75-.18-3.41 1.03-4.3 1.03-.89 0-2.25-1-3.7-.98-1.9.03-3.66 1.11-4.64 2.82-1.98 3.43-.51 8.51 1.42 11.3.94 1.37 2.06 2.9 3.5 2.85 1.41-.06 1.94-.91 3.64-.91 1.7 0 2.18.91 3.66.88 1.51-.02 2.47-1.39 3.4-2.76 1.07-1.58 1.51-3.11 1.54-3.19-.03-.01-2.95-1.13-2.98-4.48zM12.03 2.15C12.8 1.21 13.32 0 13.18-1.21 12.11-.16 10.92.43 10.13 1.37c-.7.83-1.33 2.14-1.16 3.32 1.19.09 2.41-.6 3.06-1.54z" />
    </Svg>
  );
}
function ArrowIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Main form ─────────────────────────────────────────────────────
export function SignInForm() {
  const loginMutation = useLoginMutation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const c = colors(isDark);

  const passwordRef = React.useRef<TextInput>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      try {
        const tokens = await loginMutation.mutateAsync({ email: value.email, password: value.password });
        await authStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
        router.replace('/(tabs)');
      } catch (err) {
        if (err instanceof Error) {
          const msg = err.message.includes('contraseña') ? err.message : 'Credenciales inválidas';
          return { fields: { password: msg } };
        }
        return { fields: { password: 'Error al iniciar sesión' } };
      }
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Ambient gradient blob */}
      <View style={{
        position: 'absolute', top: -80, right: -60,
        width: 280, height: 280, borderRadius: 140,
        backgroundColor: BRAND,
        opacity: isDark ? 0.18 : 0.12,
      }} />

      <View style={{ height: insets.top + 20 }} />

      <View style={{ paddingHorizontal: 24, gap: 18, zIndex: 1 }}>
        {/* Logo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <BrandMark dark={isDark} />
          <Text style={{ fontFamily: 'InstrumentSerif_400Regular', fontSize: 22, color: c.fg, letterSpacing: -0.5 }}>
            Chapa
            <Text style={{ fontFamily: 'InstrumentSerif_400Regular_Italic', fontSize: 22, color: BRAND, letterSpacing: -0.5 }}>
              {' '}tu venta
            </Text>
          </Text>
        </View>

        {/* Offer badge */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          paddingVertical: 6, paddingHorizontal: 12, borderRadius: 100,
          backgroundColor: isDark ? 'rgba(255,132,48,0.14)' : '#FFF1E6',
          borderWidth: 1, borderColor: isDark ? 'rgba(255,132,48,0.3)' : '#FFDCBC',
          alignSelf: 'flex-start',
        }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: BRAND, shadowColor: BRAND, shadowOpacity: 0.8, shadowRadius: 4 }} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: BRAND, letterSpacing: 0.2 }}>
            +2,400 vendedores activos esta semana
          </Text>
        </View>

        {/* Hero heading */}
        <View>
          <Text style={{ fontFamily: 'InstrumentSerif_400Regular', fontSize: 40, lineHeight: 41, color: c.fg, letterSpacing: -1 }}>
            {'Vende más,\n'}
            <Text style={{ fontFamily: 'InstrumentSerif_400Regular_Italic', color: BRAND }}>gana más</Text>
            {'.'}
          </Text>
          <Text style={{ marginTop: 8, fontSize: 15, color: c.muted, lineHeight: 21 }}>
            Inicia sesión y sigue creciendo tu tienda.
          </Text>
        </View>
      </View>

      {/* Form card */}
      <View style={{
        margin: 16, marginTop: 20, padding: 20,
        backgroundColor: c.card, borderRadius: 24,
        borderWidth: 1, borderColor: c.border,
        gap: 14, zIndex: 1,
        shadowColor: isDark ? '#000' : '#141428',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 50, elevation: 8,
      }}>
        {/* Social buttons */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => Alert.alert('Próximamente', 'Login con Google estará disponible pronto.')}
            style={{ flex: 1, height: 50, borderRadius: 14, backgroundColor: c.socialBg, borderWidth: 1, borderColor: c.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <GoogleIcon />
            <Text style={{ fontSize: 15, fontWeight: '600', color: c.fg }}>Google</Text>
          </Pressable>
          <Pressable
            onPress={() => Alert.alert('Próximamente', 'Login con Apple estará disponible pronto.')}
            style={{ flex: 1, height: 50, borderRadius: 14, backgroundColor: c.socialBg, borderWidth: 1, borderColor: c.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <AppleIcon dark={isDark} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: c.fg }}>Apple</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: c.border }} />
          <Text style={{ fontSize: 12, color: c.muted, fontWeight: '500' }}>o con correo</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: c.border }} />
        </View>

        {/* Email */}
        <form.Field
          name="email"
          validators={{ onChange: z.string().min(1, 'Requerido').email('Correo inválido') }}>
          {(field) => (
            <View style={{ gap: 0 }}>
              <Field
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                value={field.state.value}
                dark={isDark}
                icon={<MailIcon color={c.muted} />}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              {field.state.meta.errors.length > 0 && (
                <Text style={{ fontSize: 12, color: '#E05252', fontWeight: '500', marginTop: 4 }}>
                  {String(field.state.meta.errors[0]?.message)}
                </Text>
              )}
            </View>
          )}
        </form.Field>

        {/* Password */}
        <form.Field
          name="password"
          validators={{ onChange: z.string().min(1, 'Requerida').min(6, 'Mínimo 6 caracteres') }}>
          {(field) => (
            <View style={{ gap: 0 }}>
              <Field
                label="Contraseña"
                placeholder="••••••••"
                value={field.state.value}
                dark={isDark}
                focused={passwordFocused}
                secureTextEntry={!showPassword}
                icon={<LockIcon color={c.muted} />}
                trailing={
                  <Pressable onPress={() => setShowPassword((v) => !v)}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: c.muted }}>
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </Text>
                  </Pressable>
                }
                inputRef={passwordRef}
                onChangeText={field.handleChange}
                onBlur={() => { field.handleBlur(); setPasswordFocused(false); }}
                returnKeyType="send"
                onSubmitEditing={form.handleSubmit}
              />
              {field.state.meta.errors.length > 0 && (
                <Text style={{ fontSize: 12, color: '#E05252', fontWeight: '500', marginTop: 4 }}>
                  {String(field.state.meta.errors[0]?.message)}
                </Text>
              )}
            </View>
          )}
        </form.Field>

        {/* Forgot link */}
        <form.Subscribe selector={(s) => s.values.email}>
          {(email) => (
            <Link href={`/(auth)/forgot-password?email=${email}`} asChild>
              <Pressable style={{ alignSelf: 'flex-end', marginTop: -4 }}>
                <Text style={{ fontSize: 13, color: BRAND, fontWeight: '600' }}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>
            </Link>
          )}
        </form.Subscribe>

        {/* CTA */}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Pressable
              onPress={form.handleSubmit}
              disabled={!canSubmit || isSubmitting || loginMutation.isPending}
              style={{
                height: 54, borderRadius: 14, backgroundColor: BRAND,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: !canSubmit || isSubmitting || loginMutation.isPending ? 0.6 : 1,
                shadowColor: BRAND, shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35, shadowRadius: 22, elevation: 6,
              }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.1 }}>
                {isSubmitting || loginMutation.isPending ? 'Iniciando...' : 'Entrar y chapar ventas'}
              </Text>
              {!isSubmitting && !loginMutation.isPending && <ArrowIcon />}
            </Pressable>
          )}
        </form.Subscribe>
      </View>

      <View style={{ flex: 1 }} />

      {/* Bottom link */}
      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 28, alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: c.muted }}>
          ¿Aún no vendes con nosotros?{' '}
          <Link href="/(auth)/sign-up">
            <Text style={{ fontSize: 14, color: BRAND, fontWeight: '700' }}>Crea tu tienda</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}
