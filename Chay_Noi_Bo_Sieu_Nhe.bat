@echo off
setlocal
cd /d "%~dp0"
title RMSA - He Thong Dao Tao Noi Bo (Chay Sieu Nhe)

echo =========================================================================
echo    RMSA - RUNNING MAN SALES ACADEMY (CHE DO VAN HANH NOI BO SIEU NHE)
echo =========================================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [LOI] May tinh chua cai dat Node.js!
    echo Vui long tai Node.js tai: https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] Kiem tra va giai phong cac cong mang cu...
node scripts/free-ports.js

if not exist "dist\index.html" (
    echo.
    echo [2/3] Bien dich giao dien san xuat lan dau (Vite Build)...
    call npm run build
) else (
    echo.
    echo [2/3] Giao dien san xuat da san sang!
)

echo.
echo [3/3] Dang khoi chay may chu SQLite sieu nhe (~40MB RAM)...
echo.
echo =========================================================================
echo Website Dang Chay: http://localhost:5000
echo Nhan vien trong cung Wi-Fi co the vao dia chi IP duoc hien thi ben duoi.
echo (Vui long giu cua so nay khi dang mo he thong)
echo =========================================================================
echo.

start "" "http://localhost:5000"
node server.js
pause
