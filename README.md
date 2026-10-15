# 🚀 RIN Sales Academy - Hệ Thống Đào Tạo Bán Hàng Trực Tuyến

Hệ thống quản lý học tập (LMS) chuyên sâu dành cho đội ngũ kinh doanh, xây dựng theo chuẩn giao diện **TalentLMS**, tối ưu cho trải nghiệm học tập tuần tự, video bài giảng độ nét cao và kiểm tra trắc nghiệm chấm điểm tự động.

---

## 🌟 Tính Năng Nổi Bật

1. **Giao diện 2 Cột Chuẩn TalentLMS:**
   * Cột trái: Lộ trình bài học tuần tự, đo lường tiến độ (% hoàn thành), phân loại trạng thái (Đã hoàn thành, Đang học, Bị khóa).
   * Cột phải: Màn hình chiếu video HD, tóm tắt kịch bản cốt lõi (Key Takeaways) và bộ câu hỏi trắc nghiệm kiểm tra năng lực.
2. **Khóa Bài Học Tuần Tự (Sequencing Lock):**
   * Học viên bắt buộc phải hoàn thành bài trước với điểm số $\ge 80\%$ mới được mở khóa bài tiếp theo.
3. **Bộ Trắc Nghiệm Tự Động (Quiz Engine):**
   * Tự động chấm điểm ngay khi nộp bài.
   * Phân loại trực quan câu đúng/sai, hiển thị đáp án chuẩn kèm **lời giải thích chi tiết vì sao đúng**.
   * Hiệu ứng pháo hoa chúc mừng khi vượt qua bài thi.
4. **Trung Tâm Quản Trị Khóa Học (Admin Studio):**
   * Thêm bài học mới dễ dàng.
   * Upload video trực tiếp từ máy tính (kéo thả file `.mp4`, `.webm`, dung lượng tới 1GB) hoặc dán link YouTube/Drive/Loom.
   * Soạn thảo câu hỏi trắc nghiệm trực quan mà không cần chỉnh sửa code.
   * Cơ chế **Sao lưu & Khôi phục 1-Click** (Export/Import JSON) giúp bảo toàn dữ liệu cho khách hàng.
5. **Tiện Ích Thực Chiến Cho Dân Sale:**
   * **Sổ tay kịch bản Sale (Cheatsheet Drawer):** Tra cứu nhanh các mẫu câu xử lý từ chối giá đắt, so sánh đối thủ, chốt đơn khi đang tư vấn khách.
   * **Bảng vinh danh (Leaderboard):** Xếp hạng thi đua thành tích học tập trong đội ngũ.
   * **Chứng nhận tốt nghiệp (Certificate):** Cấp bằng chứng nhận hoàn thành khóa học có thể in hoặc xuất PDF.

---

## 🛠️ Cài Đặt & Khởi Chạy

### Cách 1: Khởi chạy 1-Click (Dành cho khách hàng)
Bấm đúp chuột vào file **`Chay_Ung_Dung.bat`** trên máy tính Windows.

### Cách 2: Khởi chạy bằng lệnh dòng lệnh
```bash
# Cài đặt thư viện
npm install

# Khởi chạy cả Backend và Frontend cùng lúc
npm run dev

# Mở trình duyệt tại:
http://localhost:3000
```

### Chạy Kiểm Thử (Testing)
```bash
# Chạy bộ test kiểm thử dữ liệu và logic mở khóa tuần tự
npm test

# Kiểm tra đóng gói build sản phẩm
npm run build
```

---

## 📂 Cấu Trúc Thư Mục
* `data/courses.json`: Dữ liệu cấu hình bài học, kịch bản và câu hỏi trắc nghiệm.
* `uploads/videos/`: Thư mục lưu trữ video tải lên từ máy tính.
* `server.js`: Máy chủ backend Node.js / Express hỗ trợ HTTP 206 video streaming và REST API.
* `src/components/`:
  * `Header.jsx`: Thanh công cụ, tìm kiếm, chứng nhận, quản trị.
  * `Sidebar.jsx`: Lộ trình bài học và thanh tiến độ.
  * `VideoPlayer.jsx`: Trình chiếu video đa nguồn (local, YouTube, Drive) kèm điều chỉnh tốc độ.
  * `KeyTakeaways.jsx`: Tóm tắt kịch bản cốt lõi.
  * `QuizEngine.jsx`: Bộ trắc nghiệm, chấm điểm và giải thích.
  * `AdminModal.jsx`: Giao diện quản trị thêm bài học, upload video và soạn quiz.
  * `CheatsheetDrawer.jsx`: Kịch bản mẫu xử lý từ chối.
  * `CertificateModal.jsx`: Chứng nhận tốt nghiệp có thể in/PDF.
  * `LeaderboardModal.jsx`: Bảng xếp hạng thành tích.
