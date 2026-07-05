#!/bin/zsh

# Si l'application tourne
#  pkill -f Board.app 2>/dev/null; sleep 1

set -e

APP_NAME="Board"

echo "🧹 clean..."

rm -rf "$APP_NAME.app"
rm -f "$APP_NAME"

echo "🔨 build swift..."

swiftc \
  Sources/Board/*.swift \
  -framework Cocoa \
  -framework WebKit \
  -o "$APP_NAME"

echo "📦 build app bundle..."

mkdir -p "$APP_NAME.app/Contents/MacOS"
mkdir -p "$APP_NAME.app/Contents/Resources/frontend"
mkdir -p "$APP_NAME.app/Contents/Resources/backend"

cp "$APP_NAME" "$APP_NAME.app/Contents/MacOS/"

cp -R frontend/* "$APP_NAME.app/Contents/Resources/frontend/"
cp -R backend/* "$APP_NAME.app/Contents/Resources/backend/"

cp Info.plist "$APP_NAME.app/Contents/" 2>/dev/null || true

echo "🚀 launch..."
open "$APP_NAME.app"