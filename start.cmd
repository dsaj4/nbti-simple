@echo off
setlocal
title NBTI Reboot

cd /d "%~dp0"

where node.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found. Install Node.js and try again.
  pause
  exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm was not found. Reinstall Node.js and try again.
  pause
  exit /b 1
)

if not exist "package.json" (
  echo [ERROR] package.json was not found in %CD%.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
  echo [NBTI] Installing dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
  )
)

echo [NBTI] Starting the development server...
echo [NBTI] Press Ctrl+C to stop.
echo.

if /I "%~1"=="--no-open" (
  call npm.cmd run dev
) else (
  call npm.cmd run dev -- --open
)

set "exit_code=%errorlevel%"
if not "%exit_code%"=="0" (
  echo.
  echo [ERROR] The development server exited with code %exit_code%.
  pause
)

exit /b %exit_code%
