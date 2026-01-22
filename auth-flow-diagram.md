# Diagrama de Flujo de Autenticación
## App Chapa Tu Venta

Este documento describe cómo interactúan todos los componentes del sistema de autenticación de la aplicación.

---

## 🔐 Componentes Principales

### Proveedor de Autenticación
- **ClerkProvider** (`app/_layout.tsx`) - Envuelve toda la aplicación y proporciona el contexto de Clerk

### Hooks de Clerk
- `useSignIn()` - Maneja inicio de sesión y recuperación de contraseña
- `useSignUp()` - Maneja registro de nuevos usuarios
- `setActive()` - Establece la sesión activa después de autenticación exitosa

---

## 📊 Flujo de Autenticación

```mermaid
graph TD
    Start[Usuario Inicia App] --> Layout[app/_layout.tsx<br/>ClerkProvider]
    Layout --> Home[app/index.tsx<br/>Pantalla Principal]
    
    Home --> SignIn[/(auth)/sign-in.tsx]
    Home --> SignUp[/(auth)/sign-up/index.tsx]
    
    SignIn --> SignInForm[SignInForm Component]
    SignInForm --> SignInClerk{useSignIn.create<br/>identifier + password}
    SignInClerk -->|Éxito| SetActive1[setActive]
    SignInClerk -->|Error| SignInError[Mostrar Error]
    SignInError --> SignInForm
    SetActive1 --> Authenticated[Usuario Autenticado]
    
    SignInForm -->|Click Forgot Password| ForgotPwd[/(auth)/forgot-password.tsx]
    
    SignUp --> SignUpForm[SignUpForm Component]
    SignUpForm --> SignUpClerk{useSignUp.create<br/>email + password}
    SignUpClerk --> PrepareEmail[prepareEmailAddressVerification<br/>strategy: email_code]
    PrepareEmail --> VerifyEmail[/(auth)/sign-up/verify-email.tsx]
    SignUpClerk -->|Error| SignUpError[Mostrar Error]
    SignUpError --> SignUpForm
    
    VerifyEmail --> VerifyForm[VerifyEmailForm Component]
    VerifyForm --> VerifyClerk{attemptEmailAddressVerification<br/>code}
    VerifyClerk -->|Éxito| SetActive2[setActive]
    VerifyClerk -->|Error| VerifyError[Mostrar Error]
    VerifyError --> VerifyForm
    VerifyForm -->|Resend Code| PrepareEmail
    SetActive2 --> Authenticated
    
    ForgotPwd --> ForgotForm[ForgotPasswordForm Component]
    ForgotForm --> ForgotClerk{useSignIn.create<br/>strategy: reset_password_email_code}
    ForgotClerk --> ResetPwd[/(auth)/reset-password.tsx]
    ForgotClerk -->|Error| ForgotError[Mostrar Error]
    ForgotError --> ForgotForm
    
    ResetPwd --> ResetForm[ResetPasswordForm Component]
    ResetForm --> ResetClerk{attemptFirstFactor<br/>code + new password}
    ResetClerk -->|Éxito| SetActive3[setActive]
    ResetClerk -->|Error| ResetError[Mostrar Error]
    ResetError --> ResetForm
    SetActive3 --> Authenticated
    
    style Layout fill:#e1f5ff
    style Authenticated fill:#c8e6c9
    style SignInError fill:#ffcdd2
    style SignUpError fill:#ffcdd2
    style VerifyError fill:#ffcdd2
    style ForgotError fill:#ffcdd2
    style ResetError fill:#ffcdd2
```

---

## 🔄 Flujos Detallados

### 1️⃣ Flujo de Inicio de Sesión (Sign In)

```
┌─────────────────────────────────────────────────────┐
│  app/(auth)/sign-in.tsx                             │
│  ├─ ScrollView wrapper                              │
│  └─ <SignInForm />                                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  components/sign-in-form.tsx                        │
│  ├─ useSignIn() hook                                │
│  ├─ Form inputs: email, password                    │
│  ├─ <SocialConnections /> (OAuth)                   │
│  └─ onSubmit()                                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Clerk API - signIn.create()                        │
│  ├─ identifier: email                               │
│  └─ password: password                              │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ✅ Éxito            ❌ Error
         │                   │
         ▼                   ▼
  setActive()         Mostrar mensaje
  session activa      en el formulario
         │                   │
         ▼                   └─► Usuario corrige
  Dashboard/Home                     │
                                     └─► Retry
```

**Navegación alternativa:**
- Click en "Forgot password?" → `/(auth)/forgot-password`
- Click en "Sign up" → `/(auth)/sign-up`

---

### 2️⃣ Flujo de Registro (Sign Up)

```
┌─────────────────────────────────────────────────────┐
│  app/(auth)/sign-up/index.tsx                       │
│  ├─ ScrollView wrapper                              │
│  └─ <SignUpForm />                                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  components/sign-up-form.tsx                        │
│  ├─ useSignUp() hook                                │
│  ├─ Form inputs: email, password                    │
│  ├─ <SocialConnections /> (OAuth)                   │
│  └─ onSubmit()                                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Clerk API - signUp.create()                        │
│  ├─ emailAddress: email                             │
│  └─ password: password                              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  signUp.prepareEmailAddressVerification()           │
│  └─ strategy: 'email_code'                          │
│      (Envía código al email del usuario)            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  router.push('/(auth)/sign-up/verify-email')        │
│  └─ Pasa email como parámetro en query string       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  app/(auth)/sign-up/verify-email.tsx                │
│  └─ <VerifyEmailForm />                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  components/verify-email-form.tsx                   │
│  ├─ useSignUp() hook                                │
│  ├─ useLocalSearchParams() - obtiene email          │
│  ├─ Input: código de verificación (6 dígitos)       │
│  ├─ Countdown timer (30 segundos)                   │
│  ├─ onSubmit() - verificar código                   │
│  └─ onResendCode() - reenviar código                │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    Verificar            Reenviar
         │                   │
         ▼                   ▼
  attemptEmail...     prepareEmail...
  Verification()      Verification()
         │                   │
    ✅ Éxito               Reinicia
         │               countdown
         ▼                   
  setActive()               
  session activa            
         │                  
         ▼                  
  Dashboard/Home            
```

---

### 3️⃣ Flujo de Recuperación de Contraseña

```
┌─────────────────────────────────────────────────────┐
│  app/(auth)/forgot-password.tsx                     │
│  └─ <ForgotPasswordForm />                          │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  components/forgot-password-form.tsx                │
│  ├─ useSignIn() hook                                │
│  ├─ Input: email                                    │
│  └─ onSubmit()                                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Clerk API - signIn.create()                        │
│  ├─ strategy: 'reset_password_email_code'           │
│  └─ identifier: email                               │
│      (Envía código de reseteo al email)             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  router.push('/(auth)/reset-password')              │
│  └─ Pasa email como parámetro                       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  app/(auth)/reset-password.tsx                      │
│  └─ <ResetPasswordForm />                           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  components/reset-password-form.tsx                 │
│  ├─ useSignIn() hook                                │
│  ├─ Input: new password                             │
│  ├─ Input: código de verificación                   │
│  └─ onSubmit()                                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Clerk API - attemptFirstFactor()                   │
│  ├─ strategy: 'reset_password_email_code'           │
│  ├─ code: verification code                         │
│  └─ password: new password                          │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ✅ Éxito            ❌ Error
         │                   │
         ▼                   ▼
  setActive()         Mostrar mensaje
  session activa      en el formulario
         │                   
         ▼                   
  Dashboard/Home             
```

---

## 🔗 Componentes Compartidos

### Social Connections
**Ubicación:** `components/social-connections.tsx`

**Uso:** Compartido por `SignInForm` y `SignUpForm`

**Funcionalidad:**
- Proporciona botones para autenticación OAuth
- Estrategias soportadas (Google, Apple, etc.)
- Se muestra con separador "or" entre el formulario y los botones sociales

```
SignInForm              SignUpForm
    ↓                       ↓
    └───────┬───────────────┘
            ↓
    <SocialConnections />
            ↓
    OAuth Providers
```

---

## 📱 Componentes UI Base

Todos los formularios usan estos componentes del design system:

```
/components/ui/
├── button.tsx          → Botones de acción
├── card.tsx            → Contenedor de formularios
├── input.tsx           → Campos de entrada
├── label.tsx           → Etiquetas de campos
├── text.tsx            → Texto con estilos
└── separator.tsx       → Separador visual
```

**Estructura común de formularios:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    <View>
      <Label>Campo</Label>
      <Input />
      <Text>Error message</Text>
    </View>
    <Button onPress={onSubmit}>
      <Text>Acción</Text>
    </Button>
  </CardContent>
</Card>
```

---

## 🎯 Estados y Validación

### Estados del formulario:
- **Idle** - Esperando entrada del usuario
- **Loading** - Procesando request (cuando `!isLoaded`)
- **Error** - Mostrando mensaje de error
- **Success** - Autenticación exitosa (setActive)

### Manejo de errores:
Todos los formularios siguen el mismo patrón:

```typescript
try {
  const result = await clerkMethod();
  if (result.status === 'complete') {
    await setActive({ session: result.createdSessionId });
  }
} catch (err) {
  if (err instanceof Error) {
    setError(err.message); // Mostrar en UI
  }
  console.error(err);
}
```

---

## 🔐 Seguridad

### Token Cache
- Implementado en `app/_layout.tsx`
- Usa `tokenCache` de `@clerk/clerk-expo/token-cache`
- Persiste sesiones entre reinicios de la app

### Validación de inputs:
- Email: `keyboardType="email-address"`, `autoCapitalize="none"`
- Password: `secureTextEntry={true}`
- Auto-complete configurado para mejor UX

---

## 📝 Navegación entre Pantallas

```
Index/Home
    ↓
    ├─→ Sign In ←──→ Forgot Password
    │       │               ↓
    │       │         Reset Password
    │       │               ↓
    │       └─────────→ (Autenticado)
    │
    └─→ Sign Up
            ↓
       Verify Email
            ↓
      (Autenticado)
```

**Router usado:** Expo Router (file-based routing)
- Rutas automáticas basadas en estructura de carpetas
- `router.push()` para navegación programática
- `useLocalSearchParams()` para parámetros de query string
- Grupo `(auth)` no afecta URL pero agrupa lógicamente

---

## 🎨 Características UI/UX

### Responsive:
- Clases Tailwind con breakpoint `sm:`
- Centrado en móvil, alineado a la izquierda en web
- `max-w-sm` para limitar ancho en pantallas grandes

### Keyboard handling:
- `keyboardShouldPersistTaps="handled"`
- `keyboardDismissMode="interactive"`
- `returnKeyType` y `submitBehavior` configurados
- Referencias de input para navegación con Tab/Next

### Safe Areas:
- `mt-safe` y `ios:mt-0` para notch/dynamic island
- ScrollView para contenido que puede exceder viewport

---

## 🔄 Resumen de Interacciones

1. **App Layout** (`_layout.tsx`) envuelve todo con `ClerkProvider`
2. **Pantallas** (`app/(auth)/*.tsx`) renderizan componentes de formulario
3. **Componentes de formulario** (`components/*.tsx`) usan hooks de Clerk
4. **Hooks de Clerk** (`useSignIn`, `useSignUp`) comunican con API
5. **setActive()** establece la sesión después de autenticación exitosa
6. **Router** navega entre pantallas según el flujo
7. **Componentes UI** proporcionan consistencia visual

**Flujo de datos:**
```
Usuario → UI Components → Form Components → Clerk Hooks → Clerk API
                                                              ↓
Usuario ← App Navigation ← setActive() ← API Response ←──────┘
```
