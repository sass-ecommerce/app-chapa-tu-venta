# Context - App Chapa Tu Venta

## Descripción del Proyecto
Aplicación móvil desarrollada con React Native y Expo para Chapa Tu Venta.

## Stack Tecnológico

### Framework y Lenguaje
- **React Native** con **Expo**
- **TypeScript** - Tipado estático
- **Metro** - Bundler para React Native

### Estilos
- **NativeWind** - TailwindCSS para React Native
- **Tailwind CSS** - Configuración de utilidades

### Estructura de Navegación
- **Expo Router** - Sistema de enrutamiento basado en archivos

## Estructura del Proyecto

### `/app`
Contiene las pantallas de la aplicación usando el sistema de routing de Expo Router:
- `index.tsx` - Pantalla principal/inicio
- `_layout.tsx` - Layout raíz de la aplicación
- `+html.tsx` - Configuración HTML customizada
- `+not-found.tsx` - Pantalla 404

#### `/app/(auth)`
Grupo de rutas para autenticación:
- `sign-in.tsx` - Inicio de sesión
- `forgot-password.tsx` - Recuperación de contraseña
- `reset-password.tsx` - Reseteo de contraseña
- `sign-up/` - Registro de usuarios con verificación de email

### `/components`
Componentes React reutilizables:

#### Componentes de Autenticación
- `sign-in-form.tsx`
- `sign-up-form.tsx`
- `forgot-password-form.tsx`
- `reset-password-form.tsx`
- `verify-email-form.tsx`
- `social-connections.tsx`
- `user-menu.tsx`

#### `/components/ui`
Componentes de UI base del design system:
- `avatar.tsx`
- `button.tsx`
- `card.tsx`
- `icon.tsx`
- `input.tsx`
- `label.tsx`
- `text.tsx`
- `separator.tsx`
- `popover.tsx`
- `native-only-animated-view.tsx`

### `/lib`
Utilidades y configuraciones:
- `utils.ts` - Funciones auxiliares
- `theme.ts` - Configuración del tema

### `/assets`
Recursos estáticos:
- `/images` - Imágenes de la aplicación

## Archivos de Configuración

- `app.json` - Configuración de Expo
- `package.json` - Dependencias y scripts
- `tsconfig.json` - Configuración de TypeScript
- `tailwind.config.js` - Configuración de Tailwind
- `babel.config.js` - Configuración de Babel
- `metro.config.js` - Configuración de Metro bundler
- `components.json` - Configuración de componentes UI
- `nativewind-env.d.ts` - Tipos para NativeWind
- `global.css` - Estilos globales CSS

## Características Principales

### Sistema de Autenticación
- Registro de usuarios con verificación de email
- Inicio de sesión
- Recuperación y reseteo de contraseña
- Conexiones sociales

### Sistema de Componentes UI
Librería de componentes base reutilizables con estilos consistentes usando NativeWind.

## Convenciones

### Routing
- Archivos en `/app` definen rutas automáticamente
- Carpetas entre paréntesis `(auth)` agrupan rutas sin afectar la URL
- Archivos con prefijo `+` son especiales (layout, html, not-found)
- `_layout.tsx` define el layout de un grupo de rutas

### Componentes
- Componentes UI base en `/components/ui`
- Componentes de features en `/components`
- Uso de TypeScript para tipado
- Estilos con NativeWind/TailwindCSS
