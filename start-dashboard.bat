@echo off
setlocal
cd /d "%~dp0dashboard"
set "CORDIALS_HOST=127.0.0.1"
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://127.0.0.1:4173'"
node server.js
if errorlevel 1 pause
endlocal
