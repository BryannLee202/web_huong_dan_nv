@echo off
chcp 65001 >nul
cd /d "%~dp0"
title HỆ THỐNG ĐÀO TẠO BÁN HÀNG RIN LMS
echo ========================================================
echo   🚀 ĐANG KHỞI CHẠY HỆ THỐNG ĐÀO TẠO RIN SALES ACADEMY
echo ========================================================
echo.
echo [1/2] Đang kiểm tra môi trường Node.js...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LỖI] Máy tính của bạn chưa cài đặt Node.js!
    echo Vui lòng tải và cài đặt Node.js miễn phí tại: https://nodejs.org
    pause
    exit /b
)

echo [2/2] Đang khởi động Backend SQLite và Giao diện Web...
echo.
echo ========================================================
echo 🌐 Website: http://localhost:3000 (hoặc http://127.0.0.1:3000)
echo 💡 Đang tự động mở trình duyệt sau 3 giây...
echo ⚠️  LƯU Ý: Vui lòng KHÔNG TẮT cửa sổ màu đen này khi đang học.
echo    (Bạn có thể thu nhỏ cửa sổ xuống thanh tác vụ)
echo ========================================================
echo.

:: Đợi 3 giây để máy chủ Vite và Express khởi động xong rồi mới mở trình duyệt
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"

npm run dev
pause
