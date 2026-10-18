# CẨM NANG VẬN HÀNH WEB RMSA 24/7 MIỄN PHÍ 100% (RENDER + UPTIMEROBOT)
> **Tựa đề tài liệu:** Hướng dẫn đưa website đào tạo RMSA lên máy chủ đám mây hoạt động 24/24 cho 10-15 nhân viên, tắt máy tính cá nhân vẫn chạy trơn tru, chi phí 0 đồng trọn đời.
> **File PDF đính kèm:** `HUONG_DAN_VAN_HANH_WEB_MIEN_PHI_100_PHAN_TRAM_24_7.pdf`

---

## 1. TỔNG QUAN GIẢI PHÁP TỐI ƯU NHẤT
- **Chi phí vận hành:** 0 đồng / tháng (Hoàn toàn miễn phí, không yêu cầu thẻ tín dụng Visa/Mastercard).
- **Khi tắt máy tính:** Web vẫn chạy 24/24 trên đám mây máy chủ Singapore, nhân viên vào bất kỳ lúc nào cũng được.
- **Tên miền & Bảo mật:** Được cấp link HTTPS miễn phí có ổ khóa xanh (ví dụ: `https://rmsa-academy.onrender.com`).
- **Bí quyết chống ngủ:** UptimeRobot tự động ping `/api/health` 5 phút/lần giúp web thức liên tục, tải tức thì dưới 1 giây.
- **Quy mô:** Tối ưu mượt mà cho 10 - 20 nhân sự nội bộ truy cập học và thi đồng thời.

---

## 2. QUY TRÌNH 3 BƯỚC THIẾT LẬP THỰC TẾ (MẤT 5 PHÚT)

### BƯỚC 1: KẾT NỐI VÀ KÍCH HOẠT TRÊN RENDER.COM (3 PHÚT)
1. Truy cập trang: **https://dashboard.render.com**
2. Bấm **"Sign in with GitHub"** và đăng nhập tài khoản GitHub **`BryannLee202`** của bạn.
3. Tại màn hình quản trị, bấm nút **"New +"** (màu xanh) $\rightarrow$ chọn **"Web Service"**.
4. Tìm và chọn repository: **`web_huong_dan_nv`** $\rightarrow$ bấm **"Connect"**.
5. Điền cấu hình cực kỳ đơn giản như sau:
   - **Name:** Đặt tên định danh bạn thích (ví dụ: `rmsa-academy` $\rightarrow$ link web sẽ là `https://rmsa-academy.onrender.com`).
   - **Region:** Chọn **Singapore** (máy chủ gần Việt Nam nhất, tốc độ mở trang siêu nhanh).
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Chọn **Free** (0$/tháng).
6. Kéo xuống dưới cùng và bấm nút **"Deploy Web Service"**.
7. Chờ khoảng 2 phút, hệ thống tự động build xong và hiển thị chữ **"Live"** màu xanh lá là website đã chính thức hoạt động trên toàn cầu!

---

### BƯỚC 2: CÀI ĐẶT UPTIMEROBOT ĐỂ WEB KHÔNG BAO GIỜ BỊ "NGỦ" (1 PHÚT)
1. Truy cập trang: **https://uptimerobot.com** $\rightarrow$ Bấm **"Register for FREE"** để tạo tài khoản miễn phí.
2. Tại bảng điều khiển, bấm nút **"+ Add New Monitor"**:
   - **Monitor Type:** Chọn `HTTP(s)`
   - **Friendly Name:** Đặt là `RMSA Academy Health`
   - **URL (or IP):** Điền link kiểm tra sức khỏe của bạn: `https://rmsa-academy.onrender.com/api/health`
   - **Monitoring Interval:** Chọn `5 minutes` (5 phút gửi tín hiệu 1 lần).
3. Bấm **"Create Monitor"** để hoàn tất.

> **💡 Tác dụng tuyệt vời của UptimeRobot:**
> Render bản miễn phí sẽ tự động chuyển sang chế độ "ngủ" nếu sau 15 phút không có ai truy cập. Nhờ UptimeRobot gửi tín hiệu định kỳ mỗi 5 phút, máy chủ Render sẽ hiểu rằng hệ thống luôn có hoạt động, từ đó **luôn luôn giữ trạng thái thức 24/7/365**, nhân viên bấm vào là tải ngay lập tức!

---

### BƯỚC 3: BÀN GIAO & PHÂN QUYỀN CHO 10-15 NHÂN VIÊN (1 PHÚT)
- **Gửi đường link:** Copy link trang web (ví dụ: `https://rmsa-academy.onrender.com`) gửi vào nhóm chat nội bộ (Zalo, Telegram, Facebook).
- **Dành cho nhân viên:** Nhân viên bấm vào link, tạo tài khoản với vai trò *"Nhân viên kinh doanh"*, điền họ tên, số điện thoại, chi nhánh và vào học ngay.
- **Dành cho Chủ Doanh Nghiệp (Đan Rin):** Đăng nhập với tài khoản quản trị:
  - Email: `admin@runningman.vn`
  - Mật khẩu: `123456` (hoặc tài khoản chủ bạn đăng ký với mã bí mật `RMSA-BOSS-2026`).
  - Bấm nút **"Quản Trị Viên"** ở góc trên bên phải để theo dõi trực tiếp bảng điều khiển, kết quả làm bài thi và xuất báo cáo Excel bất kỳ lúc nào.

---

## 3. CÁCH CẬP NHẬT TÍNH NĂNG HOẶC NỘI DUNG MỚI SAU NÀY
Khi bạn chỉnh sửa bài học, đổi giao diện hoặc thêm câu hỏi trắc nghiệm trên máy tính của bạn:
- Bạn chỉ cần chạy lệnh quen thuộc: `git add .` $\rightarrow$ `git commit -m "..."` $\rightarrow$ `git push origin main`.
- Render đã được kết nối tự động với GitHub của bạn, nó sẽ **tự động nhận code mới, tự động build lại và cập nhật website chỉ trong 60 giây** mà bạn không cần phải làm thêm bất kỳ thao tác thủ công nào!
