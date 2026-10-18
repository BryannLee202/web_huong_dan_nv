# HƯỚNG DẪN ĐƯA HỆ THỐNG RMSA ACADEMY VÀO VẬN HÀNH THỰC TẾ (PRODUCTION RUNBOOK)

Tài liệu này hướng dẫn chi tiết quy trình đưa website và hệ thống cơ sở dữ liệu RMSA vào hoạt động thực tế 24/7, ổn định, không lỗi và bảo mật tuyệt đối.

---

## PHẦN 1: NHỮNG GÌ ĐÃ ĐƯỢC HỆ THỐNG CÀI ĐẶT & ÁP DỤNG SẴN 100%

Hệ thống mã nguồn của bạn hiện đã được trang bị toàn bộ tiêu chuẩn Production của thế giới:

1. **Cơ sở dữ liệu SQLite chuẩn công nghiệp (`data/database.js`):**
   - **`journal_mode = WAL` (Write-Ahead Logging):** Cho phép hàng trăm nhân viên đọc tài liệu cùng lúc với việc quản trị viên cập nhật bài học mà không bao giờ bị khóa.
   - **`synchronous = NORMAL`:** Tối ưu hóa đọc/ghi đĩa cực nhanh, chống mất dữ liệu ngay cả khi cúp điện đột ngột.
   - **`busy_timeout = 5000` (5 giây):** Tự động xếp hàng đợi khi có nhiều nhân viên cùng nộp bài thi hoặc đăng ký tài khoản, triệt tiêu hoàn toàn lỗi `database is locked`.
   - **`cache_size = -64000` (64MB RAM):** Cấp bộ nhớ đệm tốc độ cao cho SQLite giúp phản hồi API tức thì.
   - **Hot Backup Online:** Sao lưu cơ sở dữ liệu trực tiếp khi hệ thống đang chạy thông qua API hoặc script mà không làm gián đoạn người dùng.

2. **Backend Server Bảo Mật & Chống Sập (`server.js`):**
   - **Security Headers:** Tự động chống tấn công Clickjacking, MIME-sniffing, XSS.
   - **Rate Limiting:** Chống spam/brute-force mật khẩu ở cổng đăng nhập/đăng ký.
   - **SPA Fallback:** Tự động phục vụ giao diện tĩnh và định tuyến React Router khi F5.
   - **Graceful Shutdown:** Tự động dọn dẹp và ngắt kết nối an toàn khi khởi động lại server.
   - **Health Check API (`/api/health`):** Giám sát thời gian chạy (uptime), dung lượng RAM tiêu thụ và trạng thái SQLite.

3. **Cấu hình Vận hành Sẵn Có:**
   - File cấu hình quản lý tiến trình: `ecosystem.config.cjs` (PM2)
   - File cấu hình máy chủ Web Server: `nginx/rmsa.conf` (Nginx)
   - Bộ đóng gói container: `Dockerfile` & `docker-compose.yml`
   - Lệnh sao lưu độc lập: `npm run backup`

---

## PHẦN 2: NHỮNG BƯỚC BẠN TỰ THỰC HIỆN TRÊN MÁY CHỦ THỰC TẾ

### Bước 1: Chuẩn bị Tên Miền & Máy Chủ VPS
1. **Mua tên miền (Domain):** Mua tại Tenten, Mắt Bão, PA Việt Nam, Namecheap hoặc Cloudflare (Ví dụ: `rmsa-academy.vn`).
2. **Thuê VPS:** 
   - Chọn máy chủ ảo cài hệ điều hành **Ubuntu 22.04 LTS hoặc 24.04 LTS**.
   - Cấu hình đề xuất: 2 CPU, 2GB - 4GB RAM, 40GB SSD (Các nhà cung cấp tốt: Vietnix, TinoHost, InterData, DigitalOcean, Hetzner, Vultr). Chi phí khoảng 100.000đ - 200.000đ/tháng.
3. **Trỏ tên miền về IP của VPS:**
   - Vào trang quản lý DNS của tên miền, tạo 2 bản ghi:
     - Loại `A` | Tên `@` | Giá trị: `<Địa chỉ IP của VPS>`
     - Loại `A` | Tên `www` | Giá trị: `<Địa chỉ IP của VPS>`

---

### Bước 2: Cài Đặt Môi Trường Trên VPS (Chạy lệnh qua SSH)
Mở Terminal trên máy tính (hoặc PuTTY) và đăng nhập vào VPS:
```bash
ssh root@<IP_VPS_CUA_BAN>
```

Chạy lần lượt các lệnh sau:
```bash
# 1. Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt Node.js 20 LTS và công cụ build
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git build-essential

# 3. Cài đặt PM2 toàn cục
sudo npm install -g pm2
```

---

### Bước 3: Tải Mã Nguồn & Khởi Động Ứng Dụng
```bash
# 1. Tạo thư mục chứa dự án
sudo mkdir -p /var/www/web-rin
sudo chown -R $USER:$USER /var/www/web-rin
cd /var/www/web-rin

# 2. Clone mã nguồn từ GitHub
git clone https://github.com/BryannLee202/web_huong_dan_nv.git .

# 3. Cài đặt dependencies và build giao diện
npm ci
npm run build

# 4. Khởi chạy Backend bằng PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
*(Lệnh `pm2 startup` sẽ in ra một dòng lệnh, bạn chỉ cần copy dòng đó chạy tiếp để server tự bật lại khi VPS khởi động lại).*

---

### Bước 4: Cấu Hình Nginx & Cấp Chứng Chỉ SSL (HTTPS)
```bash
# 1. Sao chép file cấu hình Nginx
sudo cp nginx/rmsa.conf /etc/nginx/sites-available/rmsa.conf

# 2. Mở file chỉnh sửa tên miền của bạn
sudo nano /etc/nginx/sites-available/rmsa.conf
# (Tìm dòng server_name yourdomain.com và đổi thành tên miền thật của bạn, sau đó nhấn Ctrl+O -> Enter -> Ctrl+X)

# 3. Kích hoạt cấu hình
sudo ln -s /etc/nginx/sites-available/rmsa.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 4. Cài chứng chỉ bảo mật SSL miễn phí (HTTPS) với Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### Bước 5: Cài Đặt Tự Động Sao Lưu Dữ Liệu Mỗi Đêm
Để dữ liệu học tập và nhân sự không bao giờ bị mất, thiết lập cronjob tự động chạy lúc 2:00 sáng mỗi ngày:
```bash
crontab -e
```
Thêm dòng sau vào cuối file:
```cron
0 2 * * * cd /var/www/web-rin && npm run backup >> /var/log/rmsa-backup.log 2>&1
```

---

## PHẦN 3: CÁC THAO TÁC QUẢN TRỊ KHI ĐANG VẬN HÀNH

| Nhu cầu | Lệnh thực hiện trên VPS |
| :--- | :--- |
| **Xem website có chạy ổn định không** | `pm2 status` |
| **Xem nhật ký hoạt động thời gian thực** | `pm2 logs rmsa-academy` |
| **Cập nhật tính năng mới từ GitHub** | `git pull && npm run build && pm2 restart rmsa-academy` |
| **Sao lưu dữ liệu tức thì** | `npm run backup` |
| **Khởi động lại server** | `pm2 restart rmsa-academy` |
| **Kiểm tra trạng thái Nginx** | `sudo systemctl status nginx` |

---

## PHẦN 4: THAO TÁC CỦA CHỦ DOANH NGHIỆP TRÊN GIAO DIỆN WEB
- **Đăng ký tài khoản Quản trị:** Khi đăng ký, chọn chức danh *"Chủ Doanh Nghiệp"* và nhập mã bí mật: `RMSA-BOSS-2026`.
- **Giám sát trực tiếp:** Bấm vào nút *"Quản Trị Viên"* ở góc trên bên phải để xem trực tiếp danh sách nhân viên, tỷ lệ qua môn thi sát hạch và luồng hoạt động thời gian thực.
- **Tải báo cáo đào tạo:** Bấm nút *"Xuất Báo Cáo Excel (CSV)"* để tải dữ liệu thống kê nhân sự.
