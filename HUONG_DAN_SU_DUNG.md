# 🎓 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG ĐÀO TẠO BÁN HÀNG RIN LMS

> **Sản phẩm bàn giao cho Khách hàng & Đội ngũ Kinh doanh**  
> Bản quyền: RIN Sales Academy  
> Công nghệ: React 19 + Vite 8 + Express Backend + Tailwind CSS Design System

---

## ⚡ 1. Khởi Chạy Nhanh Cho Khách Hàng (1-Click)
Khách hàng không cần biết lập trình:
1. Đảm bảo máy tính đã cài đặt [Node.js](https://nodejs.org) (bản miễn phí).
2. **Nhấp đúp chuột vào file `Chay_Ung_Dung.bat`**.
3. Trình duyệt web sẽ tự động mở trang web đào tạo tại địa chỉ: `http://localhost:3000`.

---

## 📚 2. Dành Cho Nhân Viên Bán Hàng (Học Viên)
1. **Lộ trình học tuần tự (Sequencing Lock):**
   * Bắt đầu từ **Bài 1**.
   * Xem video bài giảng (có thể chỉnh tốc độ 1.25x, 1.5x, 2x).
   * Đọc phần **Tóm tắt kịch bản cốt lõi** để ghi nhớ kiến thức thực chiến.
   * Chuyển sang tab **Làm bài kiểm tra trắc nghiệm** và trả lời các câu hỏi tình huống.
   * Bấm **"Nộp bài & Chấm điểm ngay"**:
     * Nếu đạt $\ge 80\%$: Hệ thống chúc mừng và **tự động mở khóa bài tiếp theo**.
     * Nếu dưới $80\%$: Xem giải thích chi tiết các câu sai và bấm **"Làm lại bài kiểm tra"** để cải thiện điểm số.
2. **Sổ tay kịch bản Sale (Cheatsheet):**
   * Bấm nút **"Kịch bản Sale"** trên thanh menu trên cùng để mở nhanh các mẫu câu xử lý từ chối (Khách chê đắt, bận, suy nghĩ thêm) khi đang gọi điện thoại cho khách.
3. **Nhận Chứng nhận Đào tạo (Certificate):**
   * Khi hoàn thành toàn bộ các bài học với điểm $\ge 80\%$, bấm nút **"Chứng nhận"** để xuất và in bằng khen tốt nghiệp có tên và điểm số.

---

## ⚙️ 3. Dành Cho Quản Trị Viên / Sếp (Admin Studio)
Bấm nút **"Quản trị"** ở góc phải thanh menu:

### 3.1. Thêm Bài Học Mới
* Nhập Tiêu đề bài học, Thời lượng, và Tóm tắt kiến thức (mỗi dòng 1 ý).
* Dán link video (YouTube / Google Drive / Loom) hoặc dùng video đã tải lên từ máy tính.
* Bấm **"Lưu bài học mới"** ➔ Bài học tự động hiển thị trên menu của nhân viên!

### 3.2. Tải Video Trực Tiếp Từ Máy Tính
* Chuyển sang tab **"Tải video từ máy tính"**.
* Bấm chọn file video `.mp4`, `.webm`, `.mov` từ ổ cứng máy tính (hỗ trợ file nặng tới 1GB).
* Bấm **"Bắt đầu tải lên hệ thống"**. Video sẽ được lưu trữ an toàn trong máy chủ local.

### 3.3. Soạn Câu Hỏi Trắc Nghiệm (Quiz Builder)
* Chọn bài học muốn thêm câu hỏi.
* Nhập câu hỏi tình huống thực tế.
* Nhập các đáp án A, B, C, D và chọn đáp án ĐÚNG.
* Nhập lời **Giải thích vì sao** để nhân viên học hỏi khi làm bài.
* Bấm **"Thêm câu hỏi vào bài"** ➔ Xong ngay tức thì!

### 3.4. Sao Lưu & Khôi Phục Dữ Liệu (1-Click)
* Bấm **"Tải file Backup về máy"**: Tải toàn bộ khóa học về cất giữ dưới dạng file `.json`.
* Bấm **"Chọn file JSON để khôi phục"**: Phục hồi 100% dữ liệu gốc bất kỳ lúc nào nếu lỡ tay xóa nhầm.

---

## 🌐 4. Hướng Dẫn Đưa Lên Mạng Miễn Phí 100% (Vercel / Render / GitHub)

### Cách 1: Đưa lên Render.com (Hỗ trợ Fullstack Node.js + React Miễn Phí)
1. Đăng ký tài khoản miễn phí tại [Render.com](https://render.com).
2. Chọn **"New Web Service"** và kết nối với GitHub repository:  
   `https://github.com/BryannLee202/web_huong_dan_nv`
3. Điền cấu hình:
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start`
4. Bấm **"Create Web Service"** ➔ Nhận ngay tên miền miễn phí dạng:  
   `https://ten-cong-ty.onrender.com` có bảo mật HTTPS xanh!

### 💡 Mẹo Lưu Trữ Video 0 Đồng - Không Giới Hạn:
Để không bị tốn dung lượng ổ cứng trên các hosting miễn phí:
* Sếp tải video lên kênh **YouTube** của công ty ở chế độ **"Không công khai (Unlisted)"** (chỉ người có link mới xem được, không ai tìm thấy trên YouTube).
* Sao chép link YouTube đó dán vào ô video của bài học.
* ➔ Vừa hoàn toàn miễn phí, vừa xem được chất lượng 1080p Full HD siêu nhanh!
