#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SDK_ROOT="${ANDROID_SDK_ROOT:-${PROJECT_DIR}/../android-sdk}"
BUILD_TOOLS="${SDK_ROOT}/build-tools/35.0.0"
ANDROID_JAR="${SDK_ROOT}/platforms/android-35/android.jar"
SOURCE_DIR="${PROJECT_DIR}/app/src/main"
BUILD_DIR="${PROJECT_DIR}/build"
OUTPUT_DIR="${PROJECT_DIR}/output"
SIGNING_DIR="${PROJECT_DIR}/signing"
KEYSTORE="${SIGNING_DIR}/prototype.keystore"
PACKAGE_PATH="com/yorungekasasi/game"

rm -rf "${BUILD_DIR}" "${OUTPUT_DIR}"
mkdir -p "${BUILD_DIR}/generated" "${BUILD_DIR}/classes" "${BUILD_DIR}/dex" "${OUTPUT_DIR}" "${SIGNING_DIR}"

node "${PROJECT_DIR}/scripts/prepare-assets.mjs"

"${BUILD_TOOLS}/aapt2" compile \
  --dir "${SOURCE_DIR}/res" \
  -o "${BUILD_DIR}/resources.zip"

"${BUILD_TOOLS}/aapt2" link \
  -o "${BUILD_DIR}/app-unsigned.apk" \
  -I "${ANDROID_JAR}" \
  --manifest "${SOURCE_DIR}/AndroidManifest.xml" \
  --java "${BUILD_DIR}/generated" \
  -A "${SOURCE_DIR}/assets" \
  --min-sdk-version 24 \
  --target-sdk-version 35 \
  "${BUILD_DIR}/resources.zip"

java --module jdk.compiler/com.sun.tools.javac.Main \
  -source 8 \
  -target 8 \
  -classpath "${ANDROID_JAR}" \
  -d "${BUILD_DIR}/classes" \
  "${SOURCE_DIR}/java/${PACKAGE_PATH}/MainActivity.java" \
  "${BUILD_DIR}/generated/${PACKAGE_PATH}/R.java"

mapfile -t CLASS_FILES < <(find "${BUILD_DIR}/classes" -type f -name '*.class' -print)
"${BUILD_TOOLS}/d8" \
  --lib "${ANDROID_JAR}" \
  --min-api 24 \
  --output "${BUILD_DIR}/dex" \
  "${CLASS_FILES[@]}"

(
  cd "${BUILD_DIR}/dex"
  zip -q -u "${BUILD_DIR}/app-unsigned.apk" classes.dex
)

"${BUILD_TOOLS}/zipalign" -f 4 \
  "${BUILD_DIR}/app-unsigned.apk" \
  "${BUILD_DIR}/app-aligned.apk"

if [[ ! -f "${KEYSTORE}" ]]; then
  keytool -genkeypair \
    -keystore "${KEYSTORE}" \
    -storepass android \
    -alias androiddebugkey \
    -keypass android \
    -dname "CN=Yorunge Kasasi Prototype,O=Yorunge Kasasi,C=TR" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -noprompt
fi

"${BUILD_TOOLS}/apksigner" sign \
  --ks "${KEYSTORE}" \
  --ks-key-alias androiddebugkey \
  --ks-pass pass:android \
  --key-pass pass:android \
  --out "${OUTPUT_DIR}/Yorunge-Kasasi-1.9.8.apk" \
  "${BUILD_DIR}/app-aligned.apk"

"${BUILD_TOOLS}/apksigner" verify \
  --verbose \
  --print-certs \
  "${OUTPUT_DIR}/Yorunge-Kasasi-1.9.8.apk"
