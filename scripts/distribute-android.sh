#!/usr/bin/env bash
# Bumpea la versión, genera un APK con EAS (build local) y lo sube a Firebase App Distribution.
#
# Uso:
#   ./scripts/distribute-android.sh [profile] [groups] ["release notes"] [bump]
#
# Ejemplos:
#   ./scripts/distribute-android.sh
#   ./scripts/distribute-android.sh preview testers
#   ./scripts/distribute-android.sh production "testers,qa" "Fix login con Google"
#   ./scripts/distribute-android.sh preview testers "" minor   # bump minor en vez de patch
#
# Requiere: eas-cli logueado (npx eas login) y firebase-tools logueado (firebase login).

set -euo pipefail

PROFILE="${1:-preview}"
GROUPS="${2:-testers}"
RELEASE_NOTES_INPUT="${3:-}"
BUMP_TYPE="${4:-patch}"

FIREBASE_PROJECT="chapa-tu-venta"
FIREBASE_APP_ID="1:24588556096:android:6d2e305ac88454fbcb0ca5"

cd "$(dirname "$0")/.."

echo "==> Bumpeando versión ($BUMP_TYPE)..."
NEW_VERSION="$(node scripts/bump-version.js "$BUMP_TYPE")"
echo "==> Nueva versión: $NEW_VERSION"

RELEASE_NOTES="${RELEASE_NOTES_INPUT:-Build $PROFILE $NEW_VERSION - $(date '+%Y-%m-%d %H:%M')}"

OUTPUT_APK="build-$(date +%s).apk"

echo "==> Generando APK (perfil: $PROFILE)..."
npx eas build --platform android --profile "$PROFILE" --local --non-interactive --output "$OUTPUT_APK"

echo "==> Subiendo $OUTPUT_APK a Firebase App Distribution..."
firebase appdistribution:distribute "$OUTPUT_APK" \
  --app "$FIREBASE_APP_ID" \
  --project "$FIREBASE_PROJECT" \
  --groups "$GROUPS" \
  --release-notes "$RELEASE_NOTES"

echo "==> Listo. Versión $NEW_VERSION distribuida. APK local: $OUTPUT_APK"
echo "==> Recordá commitear el bump de versión (app.json / package.json)."
