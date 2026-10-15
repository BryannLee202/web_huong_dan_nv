@echo off
setlocal
cd /d "%~dp0"
title RIN SALES ACADEMY LMS

echo ===================================================
echo    DANG KHOI CHAY HE THONG DAO TAO RIN LMS
echo ===================================================
echo.
echo [1/2] Kiem tra moi truong Node.js...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [LOI] May tinh chua cai dat Node.js!
    echo Vui long tai Node.js tai: https://nodejs.org
    pause
    exit /b 1
)

echo [2/2] Dang khoi dong may chu va mo trinh duyet...
echo.
echo ===================================================
echo Website dang chay tai: http://localhost:3000
echo Vui long KHONG TAT cua so nay khi dang hoc.
echo (Co the thu nho cua so nay xuong taskbar)
echo ===================================================
echo.

start "" powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"

npm run dev
pause
