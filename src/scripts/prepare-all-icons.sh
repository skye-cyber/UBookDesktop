#!/bin/bash

# Paths to source files
SRC_PNG="./assets/ubookdesktop.png"
SRC_ICO="./assets/ubookdesktop.ico"
SRC_ICNS="./assets/ubookdesktop.icns"

# Destination root
DEST="icons"

# Sizes for Linux
SIZES=(1024 512 256 128 64 48 32)

# Ensure required tools exist
function check_tool {
  if ! command -v "$1" &> /dev/null; then
    echo "❌ Required tool '$1' not found. Install it to continue."
    exit 1
  fi
}

check_tool convert

# ----------------------
# Linux PNG Icons
# ----------------------
if [ -f "$SRC_PNG" ]; then
  echo "🔧 Preparing Linux icons..."
  for size in "${SIZES[@]}"; do
    OUT_DIR="${DEST}/linux/${size}x${size}/apps"
    mkdir -p "$OUT_DIR"
    convert "$SRC_PNG" -resize "${size}x${size}" "${OUT_DIR}/ubookdesktop.png"
    echo "✔ Created $OUT_DIR/ubookdesktop.png"
  done
else
  echo "⚠️  Skipping Linux icons – PNG not found at $SRC_PNG"
fi

# ----------------------
# Windows ICO
# ----------------------
if [ -f "$SRC_ICO" ]; then
  echo "🔧 Copying Windows icon..."
  mkdir -p "${DEST}/windows"
  cp "$SRC_ICO" "${DEST}/windows/ubookdesktop.ico"
  echo "✔ Windows icon copied"
else
  echo "⚠️  Skipping Windows icon – ICO not found at $SRC_ICO"
fi

# ----------------------
# macOS ICNS
# ----------------------
if [ -f "$SRC_ICNS" ]; then
  echo "🔧 Copying macOS icon..."
  mkdir -p "${DEST}/macos"
  cp "$SRC_ICNS" "${DEST}/macos/ubookdesktop.icns"
  echo "✔ macOS icon copied"
else
  echo "⚠️  Skipping macOS icon – ICNS not found at $SRC_ICNS"
fi

echo "🎉 All available icons prepared successfully!"
