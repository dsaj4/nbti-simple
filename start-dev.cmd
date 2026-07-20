@echo off
setlocal
cd /d "%~dp0"

set "NBTI_HOST=127.0.0.1"
set "NBTI_PORT=4174"
set "NBTI_URL=http://%NBTI_HOST%:%NBTI_PORT%/"

where node.exe >nul 2>&1
if errorlevel 1 goto no_node

where npm.cmd >nul 2>&1
if errorlevel 1 goto no_npm

if not exist "package.json" goto no_package

if /i "%~1"=="--check" (
  echo [NBTI] Startup environment check passed.
  exit /b 0
)

powershell.exe -NoProfile -Command "$listener = Get-NetTCPConnection -LocalPort %NBTI_PORT% -State Listen -ErrorAction SilentlyContinue; if ($listener) { exit 0 } else { exit 1 }" >nul 2>&1
if not errorlevel 1 (
  echo [NBTI] Dev server is already running: %NBTI_URL%
  start "" "%NBTI_URL%"
  exit /b 0
)

if not exist "node_modules" (
  echo [NBTI] First run: installing dependencies...
  call npm.cmd install
  if errorlevel 1 goto failed
)

echo [NBTI] Starting %NBTI_URL%
call npm.cmd run dev -- --host %NBTI_HOST% --port %NBTI_PORT% --strictPort --open
if errorlevel 1 goto failed

exit /b 0

:no_node
echo [ERROR] Node.js was not found. Install Node.js first.
goto pause_exit

:no_npm
echo [ERROR] npm was not found.
goto pause_exit

:no_package
echo [ERROR] package.json was not found in the project root.
goto pause_exit

:failed
echo [ERROR] Dependency installation or server startup failed.

:pause_exit
pause
exit /b 1
