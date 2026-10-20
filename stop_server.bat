@echo off
title UWP // Serverni To'xtatish
echo UWP serveri to'xtatilmoqda...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
  taskkill /F /PID %%a >nul 2>&1
)
echo [OK] UWP serveri to'xtatildi.
