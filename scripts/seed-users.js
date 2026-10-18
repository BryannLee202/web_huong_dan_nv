import Database from 'better-sqlite3';
import { hashPassword } from '../data/database.js';

const db = new Database('data/lms.db');
const passHash = hashPassword('123456');

// 1. Xóa tài khoản demo cũ
db.prepare("DELETE FROM users WHERE username = 'nhanvien@runningman.vn'").run();

// 2. Cập nhật / tạo tài khoản Quản trị viên
db.prepare(`
  INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, avatar_url, title, created_at, last_login_at)
  VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  ON CONFLICT(username) DO UPDATE SET
    password_hash = excluded.password_hash,
    full_name = excluded.full_name,
    phone = excluded.phone,
    branch = excluded.branch,
    role = excluded.role,
    status = 'active',
    avatar_url = excluded.avatar_url,
    title = excluded.title
`).run(
  'admin@runningman.vn',
  passHash,
  'Đan Rin (HLV Trưởng & Quản Trị Viên)',
  '0909 888 999',
  'Hội Sở RMSA',
  'admin',
  '/images/anh_rin_avatar.jpg',
  'HLV Trưởng & Giám Đốc Đào Tạo'
);

// 3. Tạo tài khoản Nhân viên 1
db.prepare(`
  INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, avatar_url, title, created_at, last_login_at)
  VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  ON CONFLICT(username) DO UPDATE SET
    password_hash = excluded.password_hash,
    full_name = excluded.full_name,
    phone = excluded.phone,
    branch = excluded.branch,
    role = excluded.role,
    status = 'active',
    avatar_url = excluded.avatar_url,
    title = excluded.title
`).run(
  'nhanvien1@runningman.vn',
  passHash,
  'Nguyễn Văn An',
  '0901 111 222',
  'RMSA - Bình Thạnh',
  'student',
  '',
  'Chuyên Viên Bán Hàng'
);

// 4. Tạo tài khoản Nhân viên 2
db.prepare(`
  INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, avatar_url, title, created_at, last_login_at)
  VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  ON CONFLICT(username) DO UPDATE SET
    password_hash = excluded.password_hash,
    full_name = excluded.full_name,
    phone = excluded.phone,
    branch = excluded.branch,
    role = excluded.role,
    status = 'active',
    avatar_url = excluded.avatar_url,
    title = excluded.title
`).run(
  'nhanvien2@runningman.vn',
  passHash,
  'Lê Hoàng Yến',
  '0902 333 444',
  'RMSA - Quận 1',
  'student',
  '',
  'Chuyên Viên Tư Vấn Căn Hộ'
);

console.log('✅ Cập nhật thành công danh sách tài khoản SQLite:');
const users = db.prepare('SELECT id, username, full_name, role, branch, phone, title FROM users').all();
console.table(users);
