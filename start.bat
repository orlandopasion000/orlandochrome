@echo off
title Chrome Taskbar Command Center
cd /d "%~dp0"

echo ======================================================
echo   Chrome Taskbar Command Center & Live Waitboard
echo ======================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org/ to run the server.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [INFO] Installing required dependencies (ws)...
    call npm install
    echo.
)

echo [INFO] Starting Taskbar Command Center server...
start "" "http://127.0.0.1:48100"
node server/server.js

pause
