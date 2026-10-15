@echo off
chcp 65001 >nul
title HỆ THỐNG ĐÀO TẠO BÁN HÀNG RIN LMS
echo ========================================================
echo   🚀 ĐANG KHỞI CHẠY HỆ THỐNG ĐÀO TẠO RIN SALES ACADEMY
echo ========================================================
echo.
echo [1/2] Đang kiểm tra môi trường và khởi động máy chủ...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LỖI] Máy tính của bạn chưa cài đặt Node.js!
    echo Vui lòng tải và cài đặt Node.js miễn phí tại: https://nodejs.org
    pause
    exit /b
)

echo [2/2] Đang khởi động hệ thống...
echo.
echo Hệ thống đang mở trên trình duyệt tại: http://localhost:3000
echo Bạn có thể thu nhỏ cửa sổ này lại nhưng ĐỪNG TẮT nó khi đang sử dụng.
echo.

start http://localhost:3000
npm run dev
