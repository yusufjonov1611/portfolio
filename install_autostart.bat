@echo off
title UWP // 24/7 Autostart Installer
echo ========================================================
echo   UWP // Windows 24/7 Avtomatik Fonda Ishlash Tizimi
echo ========================================================
echo.

set SCRIPT_DIR=%~dp0
set VBS_TARGET=%SCRIPT_DIR%run_silent.vbs
set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT_VBS=%TEMP%\CreateUWPShortcut.vbs

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%SHORTCUT_VBS%"
echo sLinkFile = "%STARTUP_DIR%\UWP_Portfolio.lnk" >> "%SHORTCUT_VBS%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%SHORTCUT_VBS%"
echo oLink.TargetPath = "wscript.exe" >> "%SHORTCUT_VBS%"
echo oLink.Arguments = """%VBS_TARGET%""" >> "%SHORTCUT_VBS%"
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> "%SHORTCUT_VBS%"
echo oLink.Description = "UWP 24/7 Permanent Background Portfolio" >> "%SHORTCUT_VBS%"
echo oLink.Save >> "%SHORTCUT_VBS%"

cscript /nologo "%SHORTCUT_VBS%"
del "%SHORTCUT_VBS%"

echo [OK] Windows yoqilganda UWP avtomatik 24/7 fonda ishlaydigan qilindi!
echo Startup yorlig'i: %STARTUP_DIR%\UWP_Portfolio.lnk
echo.
