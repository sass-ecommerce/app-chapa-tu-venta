# 📱 Android Build Requirements (macOS/Zsh)

Esta guía detalla la configuración necesaria para compilar la aplicación Android localmente (`eas build --local`) usando Expo y React Native en macOS.

## 📋 1. Requisitos Previos (Pre-checks)

Antes de intentar compilar, asegura tener instaladas las siguientes herramientas base. Se recomienda usar **Homebrew**.

### Java Development Kit (JDK) - **CRÍTICO**

React Native y Gradle son estrictos con la versión de Java. **No usar Java 22 o 23**.

- **Versión Requerida:** OpenJDK 17 (Recomendada para Expo SDK 50+).

```zsh
# Verificar versión actual
java -version

# Si no tienes la 17, instálala:
brew install openjdk@17
```

### Node.js & Watchman

- **Node.js:** Versión LTS (Ej. v20 o v22).
- **Watchman:** Necesario para el file-watching de Metro.

```zsh
brew install node
brew install watchman
```

---

## ⚙️ 2. Configuración de Android Studio

Descarga e instala [Android Studio](https://developer.android.com/studio). Luego, abre **Settings/Preferences** > **Languages & Frameworks** > **Android SDK** y verifica las pestañas:

### Pestaña "SDK Platforms"

Asegúrate de tener instalada al menos la API Level que usa el proyecto (actualmente parece ser **API 35** o **36** según tus logs).

### Pestaña "SDK Tools" (Importante)

Marca e instala las siguientes casillas (necesarias para evitar errores de CMake/NDK):

- [x] **Android SDK Build-Tools**
- [x] **Android SDK Command-line Tools (latest)**
- [x] **Android SDK Platform-Tools**
- [x] **CMake** (Evita el error `configureCMakeRelWithDebInfo`)
- [x] **NDK (Side by side)** (Necesario para el motor Hermes)

---

## 🛠 3. Configuración de Variables de Entorno (Zsh)

Gradle necesita saber dónde están tus herramientas.

1. Abre tu configuración de Zsh:

```zsh
nano ~/.zshrc
```

2. Agrega el siguiente bloque al final del archivo:

```zsh
# --- ANDROID & JAVA CONFIG ---

# 1. Java Home (Fuerza la versión 17 si está instalada via Brew)
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"

# 2. Android Home
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin"

# --- END CONFIG ---
```

3. Guarda (`Ctrl+O`, `Enter`) y sal (`Ctrl+X`).

4. **Recarga la configuración:**

```zsh
source ~/.zshrc
```

---

## ✅ 4. Script de Validación (Run this first)

Ejecuta estos comandos uno por uno para validar que tu entorno está listo para el build.

| Comando              | Resultado Esperado                                   |
| -------------------- | ---------------------------------------------------- |
| `echo $ANDROID_HOME` | Debe mostrar `/Users/TU_USUARIO/Library/Android/sdk` |
| `java -version`      | Debe decir `openjdk version "17.X.X"` (No 22, No 23) |
| `adb version`        | Debe mostrar `Android Debug Bridge version x.x.x`    |
| `npx expo doctor`    | No debe mostrar errores críticos de dependencias.    |

---

## 🚀 5. Comandos de Build

### Limpieza (Si el build falló anteriormente)

Si tienes errores extraños de caché, ejecuta esto primero:

```zsh
# Limpia carpetas nativas y node_modules
rm -rf android ios node_modules
npm install
# O si usas prebuild
npx expo prebuild --clean
```

### Generar Build Local (APK)

Este comando generará el APK usando tu hardware local.

```zsh
npx eas build --platform android --profile preview --local
```

### Solución de Errores Comunes

**Error: `SDK location not found`**

- **Causa:** No se cargó `ANDROID_HOME`.
- **Solución:** Ejecuta `source ~/.zshrc` y verifica la ruta.

**Error: `restricted method in java.lang.System` / `configureCMake... FAILED`**

- **Causa:** Estás usando Java 20, 21, 22 o 23.
- **Solución:** Asegúrate de que `java -version` diga **17**.

**Error: `React Native version mismatch`**

- **Causa:** Versiones en `package.json` no coinciden con lo que espera Expo.
- **Solución:** Ejecuta `npx expo install --fix`.

---

## 📝 Notas Adicionales

- Este documento está basado en errores comunes encontrados durante el desarrollo en macOS.
- Si tienes problemas adicionales, verifica los logs completos de EAS Build.
- Para builds en producción, considera usar `eas build --platform android --profile production`.
