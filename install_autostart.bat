@echo off
title UWP // Windows Autostart Installer
echo ========================================================
echo   UWP // Windows Avtomatik Ishga Tushishni O'rnatish
echo ========================================================
echo.

set SCRIPT_DIR=%~dp0
set VBS_TARGET=%SCRIPT_DIR%start_silent.vbs

echo Set WshShell = CreateObject("WScript.Shell") > "%VBS_TARGET%"
echo WshShell.Run "cmd /c cd /d """ ^& "%SCRIPT_DIR%" ^& """ && npx pm2 start ecosystem.config.cjs", 0, False >> "%VBS_TARGET%"

set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT_VBS=%TEMP%\CreateShortcut.vbs

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%SHORTCUT_VBS%"
echo sLinkFile = "%STARTUP_DIR%\UWP_Portfolio.lnk" >> "%SHORTCUT_VBS%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%SHORTCUT_VBS%"
echo oLink.TargetPath = "wscript.exe" >> "%SHORTCUT_VBS%"
echo oLink.Arguments = """%VBS_TARGET%""" >> "%SHORTCUT_VBS%"
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> "%SHORTCUT_VBS%"
echo oLink.Description = "UWP Permanent Portfolio Service" >> "%SHORTCUT_VBS%"
echo oLink.Save >> "%SHORTCUT_VBS%"

cscript /nologo "%SHORTCUT_VBS%"
del "%SHORTCUT_VBS%"

echo [OK] Windows yoqilganda UWP avtomatik tarzda fonda ishga tushadigan qilindi!
echo Joylashgan joy: %STARTUP_DIR%\UWP_Portfolio.lnk
echo.
pause
