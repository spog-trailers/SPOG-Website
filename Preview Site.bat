@echo off
REM Double-click to open the SPOG website in a local preview (Windows).
REM First run installs dependencies (about a minute). Close this window to stop the preview.

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js isn't installed. Opening nodejs.org so you can install the LTS version, then double-click this file again.
  start "" "https://nodejs.org"
  pause
  exit /b 1
)

node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=12)?0:1)"
if errorlevel 1 (
  echo This site needs Node.js 22.12 or newer. Opening nodejs.org to update.
  start "" "https://nodejs.org"
  pause
  exit /b 1
)

if not exist node_modules (
  echo First run: installing dependencies...
  call npm install
  if errorlevel 1 (
    echo Install failed.
    pause
    exit /b 1
  )
)

echo Starting preview at http://localhost:4321 ^(your browser will open^). Close this window to stop.
call npm run dev -- --open
pause
