@echo off
setlocal
cd /d "%~dp0"
title RIN SALES ACADEMY LMS

echo ===================================================
echo    DANG KHOI CHAY HE THONG DAO TAO RIN LMS
echo ===================================================
echo.
echo [1/3] Kiem tra moi truong Node.js...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [LOI] May tinh chua cai dat Node.js!
    echo Vui long tai Node.js tai: https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Don dep cac tien trinh cu va giai phong cong mang...
node scripts/free-ports.js

echo [3/3] Dang khoi dong he thong va mo trinh duyet...
echo.
echo ===================================================
echo Website se tu dong mo tai: http://127.0.0.1:3000
echo Vui long KHONG TAT cua so nay khi dang hoc.
echo (Co the thu nho cua so nay xuong taskbar)
echo ===================================================
echo.

start "" /B node scripts/wait-and-open.js

npm run dev
pause
