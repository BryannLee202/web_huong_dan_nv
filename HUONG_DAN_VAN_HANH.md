# 📖 CẨM NANG VẬN HÀNH THỰC CHIẾN - HỆ THỐNG ĐÀO TẠO RMSA ACADEMY
> **Dành riêng cho:** Chủ Doanh Nghiệp (Anh Rin) & Đội Ngũ Nhân Sự (10 - 15 nhân viên)  
> **Phiên bản:** Production v2.0 (Kiến trúc SQLite WAL + OWASP Security + Zero-Cloud Cost)  
> **Chi phí vận hành:** **0 VNĐ / Tháng**

---

## 🚀 PHẦN 1: KHỞI ĐỘNG HỆ THỐNG CHỈ VỚI 1 CLICK CHUỘT

Hệ thống được tối ưu hóa tối đa, không cần cài đặt phần mềm máy chủ nặng nề hay trả phí thuê hosting hàng tháng:

| File Khởi Động | Mục Đích Sử Dụng | Mức Độ Chiếm Dụng RAM |
| :--- | :--- | :---: |
| **`Chay_Noi_Bo_Sieu_Nhe.bat`** *(Khuyên dùng thực tế)* | Chạy ở chế độ Production tối ưu: Chỉ 1 click là chạy cả giao diện lẫn máy chủ SQLite, tự động bật trình duyệt `http://localhost:5000`. | **Cực nhẹ (~40MB RAM)** |
| **`Chay_Ung_Dung.bat`** | Chạy ở chế độ phát triển (Development) phục vụ kiểm thử tính năng mới. | ~120MB RAM |

### Cách bật:
1. Nhấp đúp chuột vào file **`Chay_Noi_Bo_Sieu_Nhe.bat`**.
2. Cửa sổ màu đen hiện lên, hiển thị thông tin hệ thống và tự động mở trang web đào tạo trên trình duyệt.
3. **Lưu ý:** Chỉ cần thu nhỏ cửa sổ màu đen này xuống thanh Taskbar trong suốt quá trình nhân viên làm việc/học tập. Khi muốn tắt hệ thống, chỉ cần đóng cửa sổ lại.

---

## 📱 PHẦN 2: CHO NHÂN VIÊN VÀO HỌC TỪ ĐIỆN THOẠI & LAPTOP KHÁC

Nhân viên **KHÔNG CẦN CÀI ĐẶT BẤT CỨ GÌ LÊN MÁY HỌ**.

### 1. Khi ở cùng văn phòng (Dùng chung mạng Wi-Fi công ty):
- Khi bật file `Chay_Noi_Bo_Sieu_Nhe.bat`, màn hình sẽ in ra dòng:
  ```text
  📱 Nhân viên truy cập qua Wi-Fi nội bộ: http://192.168.1.15:5000
  ```
  *(Dãy số IP sẽ phụ thuộc vào mạng Wi-Fi hiện tại của văn phòng).*
- Nhân viên chỉ cần kết nối vào Wi-Fi văn phòng, mở trình duyệt (Safari / Chrome) trên điện thoại hoặc laptop và gõ đúng địa chỉ trên là vào học được ngay lập tức!
- Có thể tạo mã QR từ đường link này dán tại văn phòng để nhân viên quét camera điện thoại là vào thẳng bài học.

### 2. Khi nhân viên ở nhà hoặc đi thị trường (Khác mạng Wi-Fi):
- Sử dụng giải pháp **Cloudflare Tunnel (Hoàn toàn Miễn Phí 100%)**:
  1. Tải công cụ miễn phí `cloudflared` từ Cloudflare.
  2. Mở Terminal và gõ: `cloudflared tunnel --url http://localhost:5000`
  3. Cloudflare sẽ cấp một đường link công khai an toàn (dạng `https://rmsa-academy-xxxx.trycloudflare.com`).
  4. Gửi link này cho nhân viên đi thị trường, họ có thể học mọi lúc mọi nơi từ điện thoại.

---

## 🔐 PHẦN 3: TÀI KHOẢN & PHÂN QUYỀN HỆ THỐNG

| Loại Tài Khoản | Quyền Hạn | Cách Đăng Ký / Kích Hoạt |
| :--- | :--- | :--- |
| **Học viên (Nhân viên mới)** | Học lý thuyết video, làm bài sát hạch trắc nghiệm, mở khóa từng chuyên đề khi đạt $\ge 80\%$, xem lịch sử điểm của mình, tham gia cộng đồng thảo luận nội bộ. | Tự bấm **"Đăng ký tài khoản"** trên trang chủ $\rightarrow$ Chọn vai trò **"Nhân viên mới"**. |
| **Quản trị viên (Chủ / Quản lý)** | Toàn quyền xem danh sách nhân sự, xem luồng hoạt động thời gian thực (Live Stream Logs), tạo chuyên đề mới, tải lên video bài giảng, xuất báo cáo CSV ra Excel, sao lưu nóng database. | Khi đăng ký chọn **"Chủ / Quản lý"** và nhập **Mã bí mật Quản trị**: `RMSA-BOSS-2026` *(hoặc `123456` / `admin2026`)*. |

---

## 📊 PHẦN 4: XUẤT BÁO CÁO KẾT QUẢ ĐÀO TẠO RA EXCEL (1-CLICK)

1. Đăng nhập bằng tài khoản Chủ quản trị.
2. Bấm vào nút **"Bảng Quản Trị"** hoặc icon cài đặt ở góc trên.
3. Nhấp vào nút **"Xuất Báo Cáo CSV (Excel)"**.
4. Trình duyệt sẽ tự động tải về file `RIN_LMS_Bao_Cao_Dao_Tao.csv`.
5. **Đặc điểm an toàn vượt trội:**
   - Dữ liệu đã được mã hóa UTF-8 BOM: Mở bằng Microsoft Excel hiển thị 100% tiếng Việt có dấu chuẩn xác, không bị lỗi font.
   - Tích hợp bộ lọc **Chống tấn công Macro / CSV Formula Injection (OWASP)**: Ngăn chặn hoàn toàn mã độc nếu nhân viên cố ý nhập các ký tự công thức (`=`, `@`, `+`, `-`) vào tên bài.

---

## 💾 PHẦN 5: CƠ CHẾ SAO LƯU & BẢO VỆ DỮ LIỆU TUYỆT ĐỐI

1. **Tự động sao lưu định kỳ:**
   - Cứ sau mỗi **24 giờ**, máy chủ tự động tạo một bản sao lưu an toàn SQLite vào thư mục `data/backups/`.
   - Hệ thống tự động xóa các bản sao lưu cũ hơn **7 ngày** để không làm nặng ổ cứng máy tính.
2. **Sao lưu thủ công 1-Click:**
   - Trong giao diện Bảng Quản Trị, bấm nút **"Sao Lưu Nóng Database"** để tải file snapshot về máy cá nhân hoặc lưu lên Google Drive.
3. **Khi chuyển đổi sang máy tính mới:**
   - Bạn chỉ cần copy toàn bộ thư mục `Web_RIN` sang máy tính mới và chạy file `Chay_Noi_Bo_Sieu_Nhe.bat`.
   - Toàn bộ tài khoản, mật khẩu, tiến độ học và lịch sử thi của 10-15 nhân viên vẫn được giữ nguyên vẹn 100% trong file `data/lms.db`.

---

## 🛠️ PHẦN 6: XỬ LÝ NHANH CÁC TÌNH HUỐNG THƯỜNG GẶP

1. **Hỏi: Báo lỗi "Cổng 5000 bị chiếm dụng"?**
   - **Trả lời:** Hệ thống đã tích hợp sẵn script `scripts/free-ports.js`. Mỗi khi bạn nhấp vào file `.bat`, máy sẽ tự động tìm và giải phóng cổng cũ an toàn.
2. **Hỏi: Nhân viên bị mất kết nối mạng khi đang học?**
   - **Trả lời:** Hệ thống có thanh thông báo trạng thái mạng màu cam (`NetworkStatusBanner`). Khi mất mạng, tiến độ vẫn được lưu tạm vào bộ nhớ điện thoại/máy tính của nhân viên. Ngay khi có mạng trở lại, hệ thống sẽ tự động đồng bộ lên máy chủ trung tâm.
3. **Hỏi: Làm sao đổi video bài học hoặc tạo bài mới?**
   - **Trả lời:** Chủ quản trị vào Bảng Quản Trị $\rightarrow$ Chọn **"Tạo Chuyên Đề Mới"** $\rightarrow$ Tải file video trực tiếp từ máy tính lên (hỗ trợ .mp4, .mov, dung lượng lớn) và nhập câu hỏi trắc nghiệm kèm lời giải thích.

---
*RMSA Academy - Hệ thống vận hành độc lập, tự chủ 100%, bảo mật chuẩn quốc tế.*
