# Guía de Generación de APK - Chapa Tu Venta

Esta guía explica cómo generar las APKs de la aplicación usando EAS Build.

## 📋 Prerequisitos

1. **EAS CLI instalado**:

   ```bash
   npm install -g eas-cli
   ```

2. **Cuenta de Expo**:
   - Inicia sesión: `eas login`
   - Si no tienes cuenta: https://expo.dev/signup

3. **Variables de entorno configuradas**:
   - El archivo `eas.json` debe contener todas las variables necesarias
   - Ver `eas.example.json` como referencia

## 🚀 Comandos para Generar APK

### APK de Preview (Testing/Staging)

Para generar una APK de pruebas internas:

```bash
eas build --profile preview --platform android
```

**Características del profile `preview`:**

- Distribución interna
- Genera APK (no AAB)
- Usa variables de entorno de desarrollo/staging
- Ideal para testing antes de producción

### APK de Producción

Para generar una APK de producción:

```bash
eas build --profile production --platform android
```

**Características del profile `production`:**

- Auto-incrementa el versionCode
- Usa variables de entorno de producción
- Genera AAB por defecto (para Google Play Store)

### Generar ambos simultáneamente

```bash
# En terminales separadas o secuencialmente
eas build --profile preview --platform android
eas build --profile production --platform android
```

## 📱 Después de la Build

1. **Monitorear el progreso**:
   - EAS Build te mostrará un link para seguir el progreso
   - También puedes verlo en: https://expo.dev/accounts/[tu-cuenta]/projects/app-chapa-tu-venta/builds

2. **Descargar la APK**:
   - Una vez completada, recibirás un link de descarga
   - La APK estará disponible por 30 días

3. **Instalar en dispositivo Android**:
   - Descarga la APK en tu teléfono Android
   - Habilita "Instalar apps de fuentes desconocidas"
   - Abre el archivo APK descargado
   - Acepta los permisos e instala

## 🔐 Gestión de Variables de Entorno

### Estructura de Archivos

```
app-chapa-tu-venta/
├── .env                    # Variables locales (NO en git)
├── .env.example            # Plantilla con documentación
├── eas.json                # Config real con secretos (NO en git)
└── eas.example.json        # Plantilla pública
```

### Variables Configuradas

Las siguientes variables están configuradas en `eas.json`:

#### Profile Preview (Testing)

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Key de Clerk para autenticación
- `EXPO_PUBLIC_API_URL`: URL del backend API (staging)
- `EXPO_PUBLIC_SUPABASE_URL`: URL de Supabase
- `EXPO_PUBLIC_SUPABASE_API_KEY`: API Key de Supabase
- `EXPO_PUBLIC_SUPABASE_AUTH_TOKEN`: Token de autenticación de Supabase

#### Profile Production

- Mismas variables que preview
- Idealmente deberías usar credenciales diferentes para producción

### Cambiar Variables de Entorno

1. **Edita el archivo `eas.json`** (no `eas.example.json`)
2. Modifica las variables en el profile correspondiente (`preview` o `production`)
3. Las variables estarán disponibles en el build automáticamente

**Ejemplo**:

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://nueva-api.com/api"
      }
    }
  }
}
```

## ⚠️ Consideraciones de Seguridad

### Archivos NO deben estar en Git

Los siguientes archivos están en `.gitignore` para proteger tus secretos:

- `.env` - Variables locales de desarrollo
- `eas.json` - Configuración con API keys reales

### Archivos SÍ deben estar en Git

Estos archivos son plantillas públicas:

- `.env.example` - Documentación de variables requeridas
- `eas.example.json` - Estructura de configuración sin secretos

### Recomendación para Producción

Para mayor seguridad en producción, considera migrar a **EAS Secrets**:

```bash
# Almacenar secretos en EAS
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_..."
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.com"
```

Luego puedes eliminar el bloque `env` de `eas.json` y las variables se cargarán automáticamente desde EAS Secrets.

## 🐛 Troubleshooting

### Error: "Environment variable not found"

**Solución**: Verifica que la variable esté definida en `eas.json` bajo el profile correcto.

### Error: "Build failed: Invalid credentials"

**Solución**:

1. Verifica que estés autenticado: `eas whoami`
2. Re-autentícate: `eas login`

### Error: "Project not configured"

**Solución**:

```bash
eas build:configure
```

### La APK no se instala en el dispositivo

**Solución**:

1. Habilita "Orígenes desconocidos" en Ajustes > Seguridad
2. Verifica que la APK no esté corrupta (vuelve a descargar)

## 📚 Recursos Adicionales

- **Documentación de EAS Build**: https://docs.expo.dev/build/introduction/
- **Variables de entorno en Expo**: https://docs.expo.dev/build-reference/variables/
- **Configuración de eas.json**: https://docs.expo.dev/build/eas-json/

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs del build en el dashboard de Expo
2. Consulta la documentación oficial de Expo
3. Verifica que todas las variables estén correctamente configuradas

---

**Última actualización**: Febrero 2026
**Versión de EAS CLI requerida**: >= 16.28.0
