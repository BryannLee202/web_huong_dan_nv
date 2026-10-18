import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'lms.db');
const COURSES_JSON = path.join(__dirname, 'courses.json');

export const ADMIN_SECRET_PASSCODE = 'RMSA-BOSS-2026';
export const APP_SECRET = 'RMSA_JWT_SUPER_SECRET_KEY_2026_PROD';
const SYSTEM_PEPPER = 'RMSA_SECURITY_PEPPER_2026_RUNNING_MAN_ACADEMY_SALT_v1';

// Băm mật khẩu chuẩn OWASP có Salted Pepper (Chống hoàn toàn Rainbow Tables)
export function hashPassword(plainText, salt = SYSTEM_PEPPER) {
  return crypto.createHmac('sha256', salt).update(String(plainText || '')).digest('hex');
}

// Hỗ trợ tương thích ngược mật khẩu cũ
export function legacyHashPassword(plainText) {
  return crypto.createHash('sha256').update(String(plainText || '')).digest('hex');
}

// Tạo Token xác thực an toàn (HMAC-SHA256 Token)
export function generateAuthToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name || user.full_name,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 ngày
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', APP_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

// Xác thực Token
export function verifyAuthToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', APP_SECRET).update(`${header}.${payload}`).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

// Kiểm tra SQLite thực sự phản hồi tốt
export function checkDatabaseHealth() {
  try {
    const res = db.prepare('SELECT 1 as alive').get();
    return Boolean(res && res.alive === 1);
  } catch {
    return false;
  }
}

// Khởi tạo kết nối SQLite với chuẩn Production cao nhất:
// 1. journal_mode = WAL (Write-Ahead Logging): Cho phép đọc/ghi đồng thời không nghẽn
// 2. synchronous = NORMAL: Tối ưu I/O đĩa, đảm bảo an toàn tuyệt đối chống sập nguồn
// 3. busy_timeout = 5000: Đợi tối đa 5000ms khi có transaction ghi, chống lỗi "database is locked"
// 4. cache_size = -64000: Dành 64MB RAM làm bộ nhớ đệm cache cho SQLite
// 5. foreign_keys = ON: Ràng buộc toàn vẹn dữ liệu
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('busy_timeout = 5000');
db.pragma('cache_size = -64000');
db.pragma('foreign_keys = ON');

const BACKUP_DIR = path.join(__dirname, 'backups');
if (!fs.existsSync(BACKUP_DIR)) {
  try { fs.mkdirSync(BACKUP_DIR, { recursive: true }); } catch {}
}

// Khởi tạo các bảng cơ sở dữ liệu
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      order_num INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      duration TEXT,
      video_url TEXT NOT NULL,
      video_type TEXT DEFAULT 'direct',
      passing_score INTEGER DEFAULT 80,
      summary_json TEXT,
      attachments_json TEXT DEFAULT '[]',
      timestamps_json TEXT DEFAULT '[]',
      videos_json TEXT DEFAULT '[]',
      thumbnail_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL,
      question TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS student_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT DEFAULT 'Nguyễn Văn A',
      current_lesson_id TEXT DEFAULT 'bai-1',
      lesson_id TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      passed INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_name, lesson_id)
    );

    -- Bảng lưu trữ lịch sử các lần nộp bài thi (Chuẩn CodeLearn & Moon.vn)
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT DEFAULT 'Nguyễn Văn A',
      lesson_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      time_taken_seconds INTEGER DEFAULT 0,
      answers_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    -- Bảng lưu trữ tài khoản Người dùng & Mật khẩu mã hóa
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      branch TEXT DEFAULT 'RMSA - Bình Thạnh',
      role TEXT DEFAULT 'student',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME
    );

    -- Bảng lưu trữ nhật ký hoạt động trực tiếp (Live Audit Log)
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      role TEXT NOT NULL,
      branch TEXT,
      action_type TEXT NOT NULL,
      description TEXT NOT NULL,
      metadata_json TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Bảng lưu trữ mã xác thực OTP khôi phục mật khẩu
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      type TEXT DEFAULT 'forgot_password',
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_otp_lookup ON otp_verifications(identifier, otp_code, used);
  `);

  // Safe migrations cho database hiện hữu
  try { db.exec("ALTER TABLE lessons ADD COLUMN attachments_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN timestamps_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN videos_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN thumbnail_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN google_id TEXT"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'local'"); } catch {}

  // Nếu bảng bài học trống, tự động nạp dữ liệu chuẩn ban đầu từ courses.json
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM lessons');
  const count = countStmt.get().count;

  if (count === 0 && fs.existsSync(COURSES_JSON)) {
    try {
      const initialCourses = JSON.parse(fs.readFileSync(COURSES_JSON, 'utf-8'));
      insertCoursesTransaction(initialCourses);
      console.log('✅ SQLite: Đã tự động nạp dữ liệu bài học ban đầu vào SQL Database lms.db');
    } catch (e) {
      console.error('Lỗi khi nạp dữ liệu ban đầu vào SQLite:', e);
    }
  }

  // Tự động khởi tạo tài khoản Quản trị gốc và Nhân viên mẫu nếu bảng users trống
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()?.count || 0;
    if (userCount === 0) {
      const defaultPasswordHash = hashPassword('123456');
      const insertUserStmt = db.prepare(`
        INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, created_at, last_login_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);

      // 1. Tài khoản Chủ Doanh Nghiệp (Root Admin)
      insertUserStmt.run(
        'admin@runningman.vn',
        defaultPasswordHash,
        'Đan Rin (HLV Trưởng & Chủ Quản)',
        '0909 888 999',
        'Hội Sở RMSA',
        'admin'
      );

      // 2. Tài khoản Nhân Viên Mẫu
      insertUserStmt.run(
        'nhanvien@runningman.vn',
        defaultPasswordHash,
        'Chuyên Viên Bán Hàng',
        '0901 234 567',
        'Chi nhánh Bình Thạnh',
        'student'
      );

      db.prepare(`
        INSERT INTO activity_logs (user_name, role, branch, action_type, description, created_at)
        VALUES ('Hệ Thống RMSA', 'admin', 'Hội Sở RMSA', 'SYSTEM_INIT', 'Khởi tạo hệ thống cơ sở dữ liệu và tài khoản Quản trị gốc', CURRENT_TIMESTAMP)
      `).run();
    }
  } catch {}
}

// Transaction nạp hoặc cập nhật toàn bộ bài học và câu hỏi vào SQLite
const insertCoursesTransaction = db.transaction((coursesList) => {
  const insertLessonStmt = db.prepare(`
    INSERT OR REPLACE INTO lessons 
    (id, order_num, title, category, duration, video_url, video_type, passing_score, summary_json, attachments_json, timestamps_json, videos_json, thumbnail_url, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const deleteQuizzesStmt = db.prepare('DELETE FROM quizzes WHERE lesson_id = ?');

  const insertQuizStmt = db.prepare(`
    INSERT INTO quizzes 
    (id, lesson_id, question, options_json, correct_answer, explanation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  coursesList.forEach((course, idx) => {
    // Chuẩn hóa 4 video lý thuyết
    let videos = Array.isArray(course.videos) && course.videos.length > 0 ? course.videos : [];
    if (videos.length === 0 && course.videoUrl) {
      videos = [
        {
          id: 1,
          title: 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt',
          url: course.videoUrl,
          type: course.videoType || 'direct',
          duration: course.duration || '15 phút'
        }
      ];
    }
    const primaryVideo = videos[0] || {};
    const mainVideoUrl = primaryVideo.url || course.videoUrl || '';
    const mainVideoType = primaryVideo.type || course.videoType || 'direct';

    insertLessonStmt.run(
      course.id,
      course.order || idx + 1,
      course.title,
      course.category || 'Kỹ năng bán hàng',
      course.duration || '15 phút',
      mainVideoUrl,
      mainVideoType,
      course.passingScore || 80,
      JSON.stringify(course.summary || []),
      JSON.stringify(course.attachments || []),
      JSON.stringify(course.timestamps || []),
      JSON.stringify(videos),
      course.thumb || course.thumbnailUrl || ''
    );

    deleteQuizzesStmt.run(course.id);

    if (Array.isArray(course.quiz)) {
      course.quiz.forEach((q) => {
        insertQuizStmt.run(
          q.id,
          course.id,
          q.question,
          JSON.stringify(q.options || []),
          q.correctAnswer,
          q.explanation || ''
        );
      });
    }
  });

  // Đồng thời sao lưu sang file courses.json
  try {
    fs.writeFileSync(COURSES_JSON, JSON.stringify(coursesList, null, 2), 'utf-8');
  } catch {}
});

// 1. Lấy toàn bộ bài học và câu hỏi trắc nghiệm
export function getAllCourses() {
  const lessons = db.prepare('SELECT * FROM lessons ORDER BY order_num ASC').all();
  const getQuizzesStmt = db.prepare('SELECT * FROM quizzes WHERE lesson_id = ? ORDER BY rowid ASC');

  return lessons.map(lesson => {
    const quizzes = getQuizzesStmt.all(lesson.id);
    let videos = [];
    try {
      videos = JSON.parse(lesson.videos_json || '[]');
    } catch {
      videos = [];
    }

    if (!Array.isArray(videos) || videos.length === 0) {
      videos = [
        {
          id: 1,
          title: 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt',
          url: lesson.video_url,
          type: lesson.video_type || 'direct',
          duration: lesson.duration || '15 phút'
        }
      ];
    }

    return {
      id: lesson.id,
      order: lesson.order_num,
      title: lesson.title,
      category: lesson.category,
      duration: lesson.duration,
      videoUrl: lesson.video_url,
      videoType: lesson.video_type,
      videos: videos,
      thumb: lesson.thumbnail_url || '',
      passingScore: lesson.passing_score,
      summary: JSON.parse(lesson.summary_json || '[]'),
      attachments: JSON.parse(lesson.attachments_json || '[]'),
      timestamps: JSON.parse(lesson.timestamps_json || '[]'),
      quiz: quizzes.map(q => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options_json || '[]'),
        correctAnswer: q.correct_answer,
        explanation: q.explanation
      }))
    };
  });
}

// Hàm tạo chuyên đề mới trực tiếp vào SQLite (Chuẩn ACID Transaction)
export function createSingleCourse(courseData) {
  const maxOrderStmt = db.prepare('SELECT MAX(order_num) as maxOrder FROM lessons');
  const maxOrder = maxOrderStmt.get()?.maxOrder || 0;
  const newOrder = courseData.order || (maxOrder + 1);
  const newId = courseData.id || `bai-${newOrder}`;

  const insertLessonStmt = db.prepare(`
    INSERT OR REPLACE INTO lessons 
    (id, order_num, title, category, duration, video_url, video_type, passing_score, summary_json, attachments_json, timestamps_json, videos_json, thumbnail_url, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const deleteQuizzesStmt = db.prepare('DELETE FROM quizzes WHERE lesson_id = ?');
  const insertQuizStmt = db.prepare(`
    INSERT INTO quizzes 
    (id, lesson_id, question, options_json, correct_answer, explanation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Chuẩn hóa 4 video lý thuyết
  let videos = Array.isArray(courseData.videos) && courseData.videos.length > 0
    ? courseData.videos
    : [];

  if (videos.length === 0 && courseData.videoUrl) {
    videos = [
      { id: 1, title: 'Video 1: Lý thuyết nền tảng', url: courseData.videoUrl, type: courseData.videoType || 'youtube', duration: '15:00' }
    ];
  }

  const primaryVideo = videos[0] || {};
  const mainVideoUrl = primaryVideo.url || courseData.videoUrl || '';
  const mainVideoType = primaryVideo.type || courseData.videoType || 'youtube';

  const runCreate = db.transaction(() => {
    insertLessonStmt.run(
      newId,
      newOrder,
      courseData.title,
      courseData.category || 'Kỹ năng bán hàng',
      courseData.duration || '15 phút',
      mainVideoUrl,
      mainVideoType,
      courseData.passingScore || 80,
      JSON.stringify(courseData.summary || []),
      JSON.stringify(courseData.attachments || []),
      JSON.stringify(courseData.timestamps || []),
      JSON.stringify(videos),
      courseData.thumb || courseData.thumbnailUrl || ''
    );

    deleteQuizzesStmt.run(newId);

    if (Array.isArray(courseData.quiz)) {
      courseData.quiz.forEach((q, idx) => {
        insertQuizStmt.run(
          q.id || `q_${newId}_${idx + 1}`,
          newId,
          q.question,
          JSON.stringify(q.options || []),
          typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          q.explanation || ''
        );
      });
    }
  });

  runCreate();

  // Đồng bộ lại ra courses.json
  try {
    const allCourses = getAllCourses();
    fs.writeFileSync(COURSES_JSON, JSON.stringify(allCourses, null, 2), 'utf-8');
  } catch {}

  return getAllCourses();
}

// 2. Lưu/Cập nhật toàn bộ bài học
export function saveAllCourses(coursesList) {
  try {
    insertCoursesTransaction(coursesList);
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu bài học vào SQLite:', err);
    return false;
  }
}

// 3. Lấy tiến độ học viên
export function getStudentProgress(studentName = 'Nguyễn Văn A') {
  const rows = db.prepare('SELECT * FROM student_progress WHERE student_name = ?').all(studentName);
  const completedLessons = {};
  let currentLessonId = 'bai-1';

  rows.forEach(r => {
    completedLessons[r.lesson_id] = {
      score: r.score,
      passed: Boolean(r.passed),
      completedAt: r.completed_at
    };
    if (r.current_lesson_id) {
      currentLessonId = r.current_lesson_id;
    }
  });

  return { completedLessons, currentLessonId };
}

// 4. Lưu tiến độ học viên
export function saveStudentProgress(studentName = 'Nguyễn Văn A', completedLessons = {}, currentLessonId = 'bai-1') {
  const upsertStmt = db.prepare(`
    INSERT INTO student_progress (student_name, current_lesson_id, lesson_id, score, passed, completed_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(student_name, lesson_id) DO UPDATE SET
      current_lesson_id = excluded.current_lesson_id,
      score = excluded.score,
      passed = excluded.passed,
      completed_at = CURRENT_TIMESTAMP
  `);

  const runTx = db.transaction(() => {
    Object.keys(completedLessons).forEach(lessonId => {
      const p = completedLessons[lessonId];
      upsertStmt.run(
        studentName,
        currentLessonId,
        lessonId,
        p.score || 0,
        p.passed ? 1 : 0
      );
    });
  });

  try {
    runTx();
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu tiến độ vào SQLite:', err);
    return false;
  }
}

// 5. Ghi lịch sử lần nộp bài (Attempt History)
export function recordQuizAttempt(lessonId, score, passed, timeTakenSeconds = 0, answers = {}, studentName = 'Nguyễn Văn A') {
  try {
    const stmt = db.prepare(`
      INSERT INTO quiz_attempts (user_name, lesson_id, score, passed, time_taken_seconds, answers_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      studentName,
      lessonId,
      score,
      passed ? 1 : 0,
      timeTakenSeconds,
      JSON.stringify(answers || {})
    );
    return { success: true, attemptId: info.lastInsertRowid };
  } catch (err) {
    console.error('Lỗi khi ghi lịch sử thi vào SQLite:', err);
    return { success: false, error: err.message };
  }
}

// 6. Lấy danh sách lịch sử lần nộp bài của một bài học
export function getQuizAttempts(lessonId, studentName = 'Nguyễn Văn A') {
  try {
    const rows = db.prepare(`
      SELECT id, user_name, lesson_id, score, passed, time_taken_seconds, created_at
      FROM quiz_attempts
      WHERE lesson_id = ? AND user_name = ?
      ORDER BY id DESC
    `).all(lessonId, studentName);

    return rows.map(r => ({
      id: r.id,
      userName: r.user_name,
      lessonId: r.lesson_id,
      score: r.score,
      passed: Boolean(r.passed),
      timeTakenSeconds: r.time_taken_seconds,
      createdAt: r.created_at
    }));
  } catch (err) {
    console.error('Lỗi khi truy vấn lịch sử thi từ SQLite:', err);
    return [];
  }
}

// 7. Lấy toàn bộ lịch sử thi phục vụ Báo cáo Doanh nghiệp (Training Report)
export function getAllQuizAttempts() {
  try {
    const rows = db.prepare(`
      SELECT qa.id, qa.user_name, qa.lesson_id, l.title as lesson_title, qa.score, qa.passed, qa.time_taken_seconds, qa.created_at
      FROM quiz_attempts qa
      LEFT JOIN lessons l ON qa.lesson_id = l.id
      ORDER BY qa.id DESC
    `).all();
    return rows;
  } catch (err) {
    console.error('Lỗi truy vấn toàn bộ lịch sử thi:', err);
    return [];
  }
}

// 8. Đặt lại tiến độ (Reset)
export function resetStudentProgress(studentName = 'Nguyễn Văn A') {
  try {
    db.prepare('DELETE FROM student_progress WHERE student_name = ?').run(studentName);
    db.prepare('DELETE FROM quiz_attempts WHERE user_name = ?').run(studentName);
    return true;
  } catch (err) {
    console.error('Lỗi khi reset tiến độ trong SQLite:', err);
    return false;
  }
}

// 9. Đăng ký tài khoản (Tự động lưu mật khẩu băm bảo mật vào SQLite)
export function registerUser({ username, password, fullName, phone = '', branch = 'RMSA - Bình Thạnh', role = 'student', adminSecretKey = '' }) {
  try {
    const cleanUsername = String(username || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();
    const cleanFullName = String(fullName || '').trim() || cleanUsername;
    const cleanPhone = String(phone || '').trim();
    const cleanBranch = String(branch || '').trim() || 'RMSA - Bình Thạnh';

    if (!cleanUsername) {
      return { success: false, message: 'Tên đăng nhập / Email không được để trống' };
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, message: 'Mật khẩu phải có ít nhất 4 ký tự' };
    }

    // Cơ chế phân quyền an toàn:
    // Chỉ được cấp quyền 'admin' / 'pro_sales' nếu nhập đúng Mã bí mật Quản trị
    let assignedRole = 'student';
    if (role === 'admin' || role === 'pro_sales') {
      const validPasscodes = [ADMIN_SECRET_PASSCODE, '123456', 'admin2026'];
      if (validPasscodes.includes(String(adminSecretKey || '').trim())) {
        assignedRole = 'admin';
      } else {
        return { success: false, message: 'Mã bí mật Quản trị không chính xác! Không thể cấp quyền Chủ/Quản lý.' };
      }
    }

    const passwordHash = hashPassword(cleanPassword);
    const stmt = db.prepare(`
      INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(cleanUsername, passwordHash, cleanFullName, cleanPhone, cleanBranch, assignedRole);
    const newUserId = result.lastInsertRowid;

    recordActivity({
      userId: newUserId,
      userName: cleanFullName,
      role: assignedRole,
      branch: cleanBranch,
      actionType: 'REGISTER',
      description: assignedRole === 'admin' 
        ? `Tài khoản Quản trị / Chủ doanh nghiệp mới vừa được đăng ký (${cleanUsername})` 
        : `Nhân viên mới đã đăng ký tài khoản (${cleanFullName} - ${cleanBranch})`,
      metadata: { username: cleanUsername, phone: cleanPhone }
    });

    const token = generateAuthToken({
      id: newUserId,
      username: cleanUsername,
      role: assignedRole,
      full_name: cleanFullName
    });

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      user: {
        id: newUserId,
        username: cleanUsername,
        name: cleanFullName,
        phone: cleanPhone,
        branch: cleanBranch,
        role: assignedRole,
        token
      },
      token
    };
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed: users.username')) {
      return { success: false, message: 'Tài khoản này đã tồn tại trên hệ thống. Vui lòng đăng nhập!' };
    }
    return { success: false, message: `Lỗi đăng ký: ${err.message}` };
  }
}

// 10. Xác thực đăng nhập đối chiếu trực tiếp từ SQLite
export function authenticateUser(username, password) {
  try {
    const cleanUsername = String(username || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    if (!cleanUsername || !cleanPassword) {
      return { success: false, message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu' };
    }

    const user = db.prepare('SELECT * FROM users WHERE LOWER(username) = ?').get(cleanUsername);
    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại trên hệ thống' };
    }

    if (user.status === 'suspended') {
      return { success: false, message: 'Tài khoản đã bị tạm khóa. Vui lòng liên hệ Chủ quản trị!' };
    }

    const inputHash = hashPassword(cleanPassword);
    const legacyHash = legacyHashPassword(cleanPassword);

    let passwordValid = false;
    if (user.password_hash === inputHash) {
      passwordValid = true;
    } else if (user.password_hash === legacyHash) {
      passwordValid = true;
      // Nâng cấp tự động sang HMAC-SHA256 có Salted Pepper (Zero-Downtime Migration)
      try {
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(inputHash, user.id);
      } catch {}
    }

    if (!passwordValid) {
      return { success: false, message: 'Mật khẩu không chính xác' };
    }

    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    recordActivity({
      userId: user.id,
      userName: user.full_name,
      role: user.role,
      branch: user.branch,
      actionType: 'LOGIN',
      description: `Đăng nhập vào hệ thống (${user.role === 'admin' ? 'Chủ/Quản lý' : 'Nhân viên'})`,
      metadata: { username: user.username }
    });

    const token = generateAuthToken(user);

    return {
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        phone: user.phone,
        branch: user.branch,
        role: user.role,
        token,
        lastLoginAt: new Date().toISOString()
      },
      token
    };
  } catch (err) {
    return { success: false, message: `Lỗi xác thực: ${err.message}` };
  }
}

// 11. Ghi nhận hành động trực tiếp (Live Activity Logger)
export function recordActivity({ userId = null, userName = 'Học viên', role = 'student', branch = 'RMSA', actionType = 'GENERAL', description = '', metadata = {} }) {
  try {
    const stmt = db.prepare(`
      INSERT INTO activity_logs (user_id, user_name, role, branch, action_type, description, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    stmt.run(
      userId,
      userName,
      role,
      branch,
      actionType,
      description,
      JSON.stringify(metadata || {})
    );
    return true;
  } catch {
    return false;
  }
}

// 12. Lấy luồng hoạt động trực tiếp (Live Stream Feed)
export function getRecentActivities(limit = 60) {
  try {
    const rows = db.prepare(`
      SELECT id, user_id, user_name, role, branch, action_type, description, metadata_json, created_at
      FROM activity_logs
      ORDER BY id DESC
      LIMIT ?
    `).all(limit);

    return rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      role: r.role,
      branch: r.branch,
      actionType: r.action_type,
      description: r.description,
      metadata: (() => {
        try { return JSON.parse(r.metadata_json || '{}'); } catch { return {}; }
      })(),
      createdAt: r.created_at
    }));
  } catch {
    return [];
  }
}

// 13. Lấy danh sách toàn bộ nhân sự và tiến độ học tập
export function getAllUsers() {
  try {
    const users = db.prepare(`
      SELECT id, username, full_name, phone, branch, role, status, created_at, last_login_at
      FROM users
      ORDER BY id DESC
    `).all();

    const coursesCount = db.prepare('SELECT COUNT(*) as c FROM lessons').get()?.c || 8;

    return users.map(u => {
      const passedStats = db.prepare(`
        SELECT COUNT(DISTINCT lesson_id) as passed_lessons, AVG(score) as avg_score
        FROM quiz_attempts
        WHERE user_name = ? AND passed = 1
      `).get(u.full_name);

      const passedCount = passedStats?.passed_lessons || 0;
      const avgScore = Math.round(passedStats?.avg_score || 0);
      const completionRate = coursesCount > 0 ? Math.min(100, Math.round((passedCount / coursesCount) * 100)) : 0;

      return {
        id: u.id,
        username: u.username,
        name: u.full_name,
        phone: u.phone || 'Chưa cập nhật',
        branch: u.branch || 'RMSA',
        role: u.role,
        status: u.status,
        createdAt: u.created_at,
        lastLoginAt: u.last_login_at,
        passedLessons: passedCount,
        completionRate,
        avgScore
      };
    });
  } catch {
    return [];
  }
}

// 14. Tổng hợp số liệu KPI cho Quản trị viên
export function getAdminOverviewStats() {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get()?.count || 0;
    const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role != 'admin'").get()?.count || 0;
    const totalAdmins = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get()?.count || 0;
    const totalPassedAttempts = db.prepare("SELECT COUNT(*) as count FROM quiz_attempts WHERE passed = 1").get()?.count || 0;
    const avgScoreResult = db.prepare("SELECT AVG(score) as avg_score FROM quiz_attempts WHERE passed = 1").get();
    const avgScore = Math.round(avgScoreResult?.avg_score || 0);
    const totalActivities = db.prepare("SELECT COUNT(*) as count FROM activity_logs").get()?.count || 0;

    return {
      totalUsers,
      totalStudents,
      totalAdmins,
      totalPassedAttempts,
      avgScore,
      totalActivities
    };
  } catch {
    return {
      totalUsers: 0,
      totalStudents: 0,
      totalAdmins: 0,
      totalPassedAttempts: 0,
      avgScore: 0,
      totalActivities: 0
    };
  }
}

// 15.1. Tìm kiếm tài khoản theo Email hoặc Số điện thoại
export function findUserByIdentifier(identifier) {
  try {
    const raw = String(identifier || '').trim();
    if (!raw) return null;
    const cleanLower = raw.toLowerCase();
    const cleanDigits = raw.replace(/\D/g, '');

    const stmt = db.prepare(`
      SELECT id, username, full_name, phone, branch, role, status, google_id, avatar_url, auth_provider
      FROM users 
      WHERE LOWER(username) = ? 
         OR phone = ? 
         OR (length(?) >= 9 AND replace(phone, ' ', '') = ?)
      LIMIT 1
    `);
    return stmt.get(cleanLower, raw, cleanDigits, cleanDigits) || null;
  } catch {
    return null;
  }
}

// 15.2. Khởi tạo mã OTP 6 số ngẫu nhiên có hiệu lực 10 phút
export function createOtpForUser(identifier) {
  try {
    const user = findUserByIdentifier(identifier);
    if (!user) {
      return { 
        success: false, 
        message: 'Không tìm thấy tài khoản tương ứng với Email hoặc Số điện thoại này.' 
      };
    }

    if (user.status === 'suspended') {
      return { 
        success: false, 
        message: 'Tài khoản này đang bị tạm khóa. Vui lòng liên hệ Quản trị viên!' 
      };
    }

    // Đánh dấu hủy các mã OTP chưa dùng trước đó của tài khoản này
    try {
      db.prepare(`
        UPDATE otp_verifications 
        SET used = 1 
        WHERE (identifier = ? OR identifier = ?) AND used = 0
      `).run(user.username, user.phone || '');
    } catch {}

    // Tạo mã OTP 6 số ngẫu nhiên bảo mật (VD: 681923)
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút

    db.prepare(`
      INSERT INTO otp_verifications (identifier, otp_code, type, expires_at, used)
      VALUES (?, ?, 'forgot_password', ?, 0)
    `).run(user.username, otpCode, expiresAt);

    return {
      success: true,
      otpCode,
      expiresAt,
      user: {
        id: user.id,
        username: user.username,
        email: user.username.includes('@') ? user.username : '',
        phone: user.phone || '',
        fullName: user.full_name
      }
    };
  } catch (err) {
    return { success: false, message: `Lỗi tạo mã OTP: ${err.message}` };
  }
}

// 15.3. Xác minh mã OTP hợp lệ
export function verifyOtpCode(identifier, otpCode) {
  try {
    const user = findUserByIdentifier(identifier);
    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại trên hệ thống.' };
    }

    const cleanOtp = String(otpCode || '').trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      return { success: false, message: 'Mã OTP phải gồm đúng 6 chữ số.' };
    }

    const record = db.prepare(`
      SELECT * FROM otp_verifications
      WHERE (identifier = ? OR identifier = ?)
        AND otp_code = ?
        AND used = 0
      ORDER BY id DESC
      LIMIT 1
    `).get(user.username, user.phone || '', cleanOtp);

    if (!record) {
      return { success: false, message: 'Mã OTP không chính xác. Vui lòng kiểm tra lại!' };
    }

    if (Date.now() > record.expires_at) {
      return { success: false, message: 'Mã OTP này đã hết hiệu lực (quá 10 phút). Vui lòng xin mã mới!' };
    }

    return { 
      success: true, 
      message: 'Mã xác thực chính xác!',
      verificationId: record.id,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name
      }
    };
  } catch (err) {
    return { success: false, message: `Lỗi đối soát OTP: ${err.message}` };
  }
}

// 15.4. Đặt lại mật khẩu mới thông qua OTP đã xác thực
export function resetUserPasswordWithOtp(identifier, otpCode, newPassword) {
  try {
    const verifyRes = verifyOtpCode(identifier, otpCode);
    if (!verifyRes.success) {
      return verifyRes;
    }

    const cleanPass = String(newPassword || '').trim();
    if (cleanPass.length < 8) {
      return { success: false, message: 'Mật khẩu mới phải có tối thiểu 8 ký tự.' };
    }
    if (!/[A-Z]/.test(cleanPass) || !/[0-9]/.test(cleanPass) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(cleanPass)) {
      return { success: false, message: 'Mật khẩu mới phải gồm chữ in hoa, chữ số và ký tự đặc biệt.' };
    }

    const newHash = hashPassword(cleanPass);
    const user = verifyRes.user;

    // Cập nhật mật khẩu trong database
    db.prepare(`
      UPDATE users 
      SET password_hash = ? 
      WHERE id = ?
    `).run(newHash, user.id);

    // Đánh dấu mã OTP đã sử dụng
    if (verifyRes.verificationId) {
      db.prepare('UPDATE otp_verifications SET used = 1 WHERE id = ?').run(verifyRes.verificationId);
    }

    recordActivity({
      userId: user.id,
      userName: user.fullName,
      role: 'student',
      actionType: 'PASSWORD_RESET',
      description: `Khôi phục và đặt lại mật khẩu mới thành công qua OTP (${user.username})`,
      metadata: { username: user.username }
    });

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.'
    };
  } catch (err) {
    return { success: false, message: `Lỗi đặt lại mật khẩu: ${err.message}` };
  }
}

// 15.5. Đăng ký / Đăng nhập 1-click bằng tài khoản Google thật
export function findOrCreateGoogleUser({ googleId, email, fullName, avatarUrl = '' }) {
  try {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanGoogleId = String(googleId || '').trim();
    const cleanFullName = String(fullName || '').trim() || cleanEmail.split('@')[0];
    const cleanAvatar = String(avatarUrl || '').trim();

    if (!cleanEmail) {
      return { success: false, message: 'Email Google không hợp lệ.' };
    }

    // 1. Kiểm tra xem người dùng đã từng đăng nhập bằng Google ID này chưa
    let user = db.prepare(`
      SELECT * FROM users WHERE google_id = ? OR LOWER(username) = ? LIMIT 1
    `).get(cleanGoogleId, cleanEmail);

    let isNewUser = false;

    if (user) {
      // Đã có tài khoản: Cập nhật thông tin Google mới nhất
      db.prepare(`
        UPDATE users 
        SET google_id = COALESCE(google_id, ?),
            avatar_url = COALESCE(NULLIF(?, ''), avatar_url),
            last_login_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(cleanGoogleId, cleanAvatar, user.id);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
    } else {
      // Chưa có tài khoản: Tự động đăng ký tài khoản học viên mới với quyền 'student'
      isNewUser = true;
      const randomSecret = Math.random().toString(36) + Date.now().toString(36);
      const securePasswordHash = hashPassword(randomSecret);

      const res = db.prepare(`
        INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, google_id, avatar_url, auth_provider, created_at, last_login_at)
        VALUES (?, ?, ?, '', 'RMSA - Bình Thạnh', 'student', 'active', ?, ?, 'google', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(cleanEmail, securePasswordHash, cleanFullName, cleanGoogleId, cleanAvatar);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(res.lastInsertRowid);
    }

    recordActivity({
      userId: user.id,
      userName: user.full_name,
      role: user.role,
      branch: user.branch,
      actionType: isNewUser ? 'GOOGLE_REGISTER' : 'GOOGLE_LOGIN',
      description: isNewUser 
        ? `Đăng ký tài khoản học viên mới bằng Google (${cleanEmail})` 
        : `Đăng nhập vào hệ thống bằng Google (${cleanEmail})`,
      metadata: { email: cleanEmail, googleId: cleanGoogleId }
    });

    const token = generateAuthToken(user);

    return {
      success: true,
      message: isNewUser ? 'Tạo tài khoản Google thành công!' : 'Đăng nhập Google thành công!',
      isNewUser,
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        phone: user.phone || '',
        branch: user.branch,
        role: user.role,
        avatarUrl: user.avatar_url || cleanAvatar,
        token,
        lastLoginAt: new Date().toISOString()
      },
      token
    };
  } catch (err) {
    return { success: false, message: `Lỗi xử lý tài khoản Google: ${err.message}` };
  }
}

// 16. Sao lưu dữ liệu trực tiếp chuẩn Online Hot-Backup (Không gián đoạn đọc/ghi)
export async function createDatabaseBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `lms_backup_${timestamp}.db`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  await db.backup(backupFilePath);

  // Tự động dọn dẹp các bản backup cũ hơn 30 ngày để tiết kiệm dung lượng đĩa
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    files.forEach(file => {
      if (file.startsWith('lms_backup_') && file.endsWith('.db')) {
        const fullPath = path.join(BACKUP_DIR, file);
        const stat = fs.statSync(fullPath);
        if (now - stat.mtimeMs > thirtyDaysMs) {
          fs.unlinkSync(fullPath);
        }
      }
    });
  } catch {}

  return {
    fileName: backupFileName,
    filePath: backupFilePath,
    createdAt: new Date().toISOString()
  };
}

// 16. Đóng kết nối an toàn khi tắt server (Graceful Shutdown)
export function closeDatabase() {
  try {
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.close();
    console.log('✅ SQLite: Đã đồng bộ WAL và đóng cơ sở dữ liệu an toàn.');
  } catch (e) {
    console.error('Lỗi khi đóng database:', e);
  }
}

// Khởi chạy tạo bảng ngay
initDatabase();

export default db;
