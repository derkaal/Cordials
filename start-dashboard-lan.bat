@echo off
setlocal
cd /d "%~dp0dashboard"
set "CORDIALS_HOST=0.0.0.0"
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://127.0.0.1:4173'"
echo.
echo Cordials is available to devices on this trusted local network.
echo Open http://YOUR-PC-IP:4173 on your phone. See dashboard\README.md.
echo Close this window to stop sharing the dashboard.
echo.
node server.js
if errorlevel 1 pause
endlocal
