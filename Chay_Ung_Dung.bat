@echo off
setlocal
cd /d "%~dp0"
title RMSA - RUNNING MAN SALES ACADEMY

echo ===================================================
echo    DANG KHOI CHAY HE THONG RMSA - RUNNING MAN SALES ACADEMY
echo ===================================================
echo.
echo [1/2] Kiem tra Node.js va don dep tien trinh cu...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [LOI] May tinh chua cai dat Node.js!
    echo Vui long tai Node.js tai: https://nodejs.org
    pause
    exit /b 1
)

node scripts/free-ports.js

echo.
echo [2/2] Dang khoi dong he thong va mo trinh duyet...
echo.
echo ===================================================
echo Website dang chay tai: http://localhost:3000
echo Trinh duyet se tu dong bat len sau 3 giay...
echo.
echo (Vui long giu cua so nay khi dang su dung)
echo ===================================================
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

npm run dev
pause
