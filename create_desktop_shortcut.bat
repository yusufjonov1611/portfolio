@echo off
set SCRIPT_DIR=%~dp0
set DESKTOP_DIR=%USERPROFILE%\Desktop

echo [InternetShortcut] > "%DESKTOP_DIR%\UWP Portfolio.url"
echo URL=http://localhost:5000 >> "%DESKTOP_DIR%\UWP Portfolio.url"

echo [OK] Ish stolida 'UWP Portfolio' yorlig'i yaratildi!
