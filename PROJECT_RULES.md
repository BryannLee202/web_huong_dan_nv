# LUẬT KỸ THUẬT BẮT BUỘC DỰ ÁN RMSA (RUNNING MAN SALES ACADEMY)
# Áp dụng triệt để bài học "Cái giá đắt của Vibe Coding" & Chuẩn Kỹ Thuật Dự Án Web_RIN
# Ngày ban hành: 18/10/2026

Mọi hoạt động lập trình, tái cấu trúc hoặc mở rộng tính năng trên dự án Web_RIN BẮT BUỘC phải tuân thủ 100% các điều khoản dưới đây. Không có ngoại lệ.

---

## ĐIỀU 1: NGUYÊN TẮC ĐỒNG BỘ NHẤT QUÁN (THE SINGLE SOURCE OF TRUTH)
1. **Thanh Header & Navigation Dock:**
   - Cấu trúc thanh tab dock trung tâm giữa Trang chủ (`MapStudyTeacherPage.jsx`) và Trang vào học & thi (`Header.jsx`) phải ĐỒNG BỘ 100%, bao gồm:
     `Trang chủ` | `Vào học & Thi` | `Khóa đào tạo` | `Phòng thi sát hạch` | `Cộng đồng` | `Kịch bản & Cẩm nang`.
   - Chức năng "Vào học & Thi" phải là một tab chức năng trực tiếp trên thanh tab, không để nút bấm lẻ loi tách rời gây rối mắt.
2. **Hồ Sơ & Danh Tính Người Dùng:**
   - Nút Hồ sơ tài khoản hiển thị đồng nhất: Avatar (hoặc ký tự viết hoa), chấm xanh online, Tên thật (`Lê Minh Tài`), Huy hiệu vai trò.
   - Khi bấm vào nút Hồ sơ: mở Dropdown/Drawer hiển thị Avatar lớn, Tên, **Email thật của người đăng nhập** (`currentUser?.email || currentUser?.username`), và đúng 2 cấp phân quyền chuẩn: **`Quản Trị Viên`** hoặc **`Nhân viên`** (loại bỏ vĩnh viễn chi nhánh/chuyên viên).
   - Nút Đăng xuất nằm gọn gàng bên trong menu Hồ sơ. Tuyệt đối không để nút Đăng xuất đỏ trơ trọi ngoài thanh bar gây tràn lề hoặc cắt cụt chữ trên màn hình nhỏ.

---

## ĐIỀU 2: KIẾN TRÚC PHÂN LỚP SẠCH (CLEAN LAYERED ARCHITECTURE)
Tuyệt đối không để xảy ra "Organic Architecture" (code tự phát, lộn xộn). Mọi dữ liệu phải đi qua 4 tầng tách bạch:
1. **Presentation Layer (React Components):** Chỉ quản lý hiển thị và tương tác người dùng. Không được viết câu lệnh SQL, không xử lý hash mật khẩu, không gọi `fetch()` trần.
2. **API Service Layer (`src/services/api.js`):** Điểm trung chuyển duy nhất giữa Frontend và Backend. Tích hợp sẵn Bearer Token, Offline Cache, Timeout an toàn và cơ chế tự động thử lại khi mạng lag.
3. **Controller & Security Layer (`server.js`):** Kiểm tra phân quyền chặt chẽ từ phía máy chủ (`requireAdminAuth`), mã hóa mật khẩu bằng HMAC-SHA256 Secret Pepper, Rate Limiting chống spam và Security Headers chống tấn công.
4. **Data Access Layer (`data/database.js`):** Sử dụng SQLite ở chế độ WAL Mode, Prepared Statements chống SQL Injection 100%, Transaction an toàn và hỗ trợ Hot Backup.

---

## ĐIỀU 3: QUY TRÌNH 3 BƯỚC KIỂM ĐỊNH BẮT BUỘC TRƯỚC KHI BÀN GIAO
Sau bất kỳ chỉnh sửa nào (dù chỉ là 1 dòng code), bắt buộc phải thực thi và đạt chuẩn 100% bộ 3 kiểm tra tự động:
1. **Linter Check:** `npx oxlint` -> Kết quả phải là **0 errors**.
2. **Regression Test Suite:** `npm test` -> Toàn bộ **355/355 bài kiểm thử phải PASS 100%**. Nếu có bất kỳ test nào thất bại, lập tức rollback hoặc sửa lỗi ngay, không được bàn giao mã nguồn gãy.
3. **Production Build:** `npm run build` -> Vite phải build thành công 100% không cảnh báo lỗi module hay cú pháp.

---

## ĐIỀU 4: BẢO MẬT PHÂN QUYỀN TỪ GỐC (ZERO TRUST & RBAC)
1. Ẩn nút trên giao diện là CHƯA ĐỦ. Mọi API nhạy cảm (Upload video dung lượng lớn, biên tập đề thi trắc nghiệm, tạo khóa học, quản lý danh sách học viên) phải được bảo vệ bằng middleware kiểm tra quyền Admin trên server (`server.js`).
2. Nếu client không gửi đúng token Admin, server phải lập tức trả về mã lỗi `403 Forbidden` kèm Request ID để ghi vết.
3. Dữ liệu xuất báo cáo CSV phải được lọc ký tự độc hại (`sanitizeCsvCell`) để chống lỗi CSV Injection trong Excel.

---

## ĐIỀU 5: PHÁT TRIỂN CUỐN CHIẾU & QUẢN LÝ GIT CHẶT CHẼ
1. Chia nhỏ nhiệm vụ: Tách biệt việc tạo bảng cơ sở dữ liệu -> Viết API backend -> Viết test kiểm thử -> Dựng giao diện frontend -> Tích hợp đồng bộ.
2. Kiểm tra `git diff` trước khi commit để đảm bảo chỉ sửa đúng phạm vi cho phép, không chạm vào mã nguồn không liên quan.
3. Sử dụng thông điệp commit chuẩn quốc tế (`feat:`, `fix:`, `refactor:`) bằng tiếng Việt rõ nghĩa và đẩy lên nhánh `main`.

---

## ĐIỀU 6: TRẢI NGHIỆM NGƯỜI DÙNG CHỐNG LỖI VÀ CO GIÃN MƯỢT MÀ (BULLETPROOF UX)
1. **Không giới hạn dung lượng:** Hỗ trợ upload video bài giảng dung lượng lớn (lên đến 10GB) qua XMLHttpRequest kèm thanh tiến độ phần trăm rõ ràng, hỗ trợ đầy đủ 5 nguồn phát (Upload máy tính, YouTube, Google Drive, Direct CDN, Video 4 màn hình).
2. **Chống cắt cụt chữ:** Mọi nút bấm, nhãn chữ, thanh điều hướng phải được cấu hình `shrink-0 whitespace-nowrap` kèm kích thước co giãn responsive hợp lý, đảm bảo hiển thị hoàn hảo từ màn hình di động, laptop 1280px/1366px (kể cả zoom DPI 125%) đến màn hình lớn 2K/4K.
3. **Chống sập giao diện:** Khi xảy ra sự cố mạng, ứng dụng phải hiển thị cảnh báo nhẹ nhàng (`NetworkStatusBanner`) và sử dụng bộ nhớ đệm Offline Cache thay vì làm trắng màn hình.
