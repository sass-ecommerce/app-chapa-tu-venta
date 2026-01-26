# Referencia de configuración EAS

Este documento explica las opciones disponibles para `eas.json` y el motivo de los valores utilizados actualmente.

## Claves en la raíz

- `cli`: Ajustes del CLI de Expo Application Services. Soporta:
  - `version`: Rango semántico que fija la versión del CLI.
  - `appVersionSource`: Origen del versionado en tiempo de ejecución (`local`, `remote`, `runtimeVersion`).
  - Opcional: `autoPrompt`, `enableCompatibilityChecks`, `requireIntegration`, `uploadConfig`.
- `build`: Mapa de perfiles de build (development, preview, production o nombres personalizados). Cada perfil admite:
  - `extends`: Reutilizar la configuración de otro perfil como base.
  - `distribution`: `store`, `internal` o `simulator`.
  - `developmentClient`: Genera un build compatible con Expo Dev Client cuando vale `true`.
  - `channel` o `releaseChannel`: Objetivo para actualizaciones OTA.
  - `autoIncrement`: Estrategia de incremento automático (`true`, `false`, `version`, `buildNumber`).
  - `env`: Variables de entorno específicas del perfil.
  - `resourceClass`: Nivel de hardware de la máquina de build (`default`, `medium`, `large`, `gpu`, etc.).
  - Sobrescrituras de toolchain: `node`, `npm`, `yarn`, `ruby`.
  - Sobrescrituras por plataforma:
    - `android`: `buildType`, `gradleCommand`, `artifactPath`, `autoIncrement`, `applicationArchivePath`, `credentialsSource`, `releaseChannel`, `track`, `changesNotSentForReview`, `buildCommand`.
    - `ios`: `simulator`, `enterpriseProvisioning`, `autoIncrement`, `credentialsSource`, `scheme`, `buildConfiguration`, `resourceClass`, `runtimeVersion`, `artifactPath`, `applicationArchivePath`.
- `submit`: Perfiles usados al publicar en las tiendas. Se pueden definir bloques por plataforma con credenciales.
- Claves opcionales: `credentialsSource`, `env`, `extends`, `experimental`, `metadata`, `production`, `webhooks`.

## Configuración vigente

### cli

- `version: ">= 16.28.0"` mantiene el proyecto en un rango reciente del CLI para evitar incompatibilidades.
- `appVersionSource: "remote"` delega en EAS el control del versionado desde el panel en la nube.

### build.development

- `developmentClient: true` genera un build Dev Client para depurar módulos nativos en local.
- `distribution: "internal"` limita la distribución a testers mediante enlaces directos.

### build.preview

- `distribution: "internal"` mantiene estos builds restrictos a QA/usuarios internos.
- `android.buildType: "apk"` solicita un APK fácil de instalar en lugar de un AAB.

### build.production

- `autoIncrement: true` incrementa automáticamente `versionCode`/`buildNumber` antes de publicar en tiendas.

### submit.production

- Objeto vacío reservado para añadir credenciales o ajustes de envío cuando sea necesario.

## Cómo añadir más perfiles

Crea nuevas entradas dentro de `build` o `submit` (por ejemplo `staging`, `qa`) y sobreescribe solo los valores que cambian respecto a otro perfil. Usa `extends` cuando la mayor parte de la configuración coincide, así reduces duplicación.
