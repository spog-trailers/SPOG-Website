#!/bin/bash
# Double-click to open the SPOG website in a local preview (macOS).
# First run installs dependencies (about a minute). Close this window to stop the preview.

cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js isn't installed. Opening nodejs.org so you can install the LTS version, then double-click this file again."
  open "https://nodejs.org" 2>/dev/null
  read -r -p "Press Enter to close."
  exit 1
fi

if ! node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=12)?0:1)"; then
  echo "This site needs Node.js 22.12 or newer. You have $(node -v). Opening nodejs.org to update."
  open "https://nodejs.org" 2>/dev/null
  read -r -p "Press Enter to close."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "First run: installing dependencies..."
  npm install || { read -r -p "Install failed. Press Enter to close."; exit 1; }
fi

echo "Starting preview at http://localhost:4321 (your browser will open). Close this window to stop."
npm run dev -- --open
