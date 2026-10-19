@echo off
title UWP // Permanent 24/7 Background Service
echo ========================================================
echo   UWP // Permanent Background Process (PM2)
echo ========================================================
echo.
cd /d "%~dp0"
echo PM2 doimiy fonda ishga tushirilmoqda...
call npx pm2 start ecosystem.config.cjs
call npx pm2 save
echo.
echo [OK] UWP 24/7 fonda muvaffaqiyatli ishga tushdi!
echo Manzil: http://localhost:5000
echo.
timeout /t 3 >nul
