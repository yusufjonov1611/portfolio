@echo off
title UWP // Stop Background Service
cd /d "%~dp0"
echo UWP to'xtatilmoqda...
call npx pm2 stop uwp-portfolio
echo.
echo [OK] UWP xizmati to'xtatildi.
timeout /t 3 >nul
