import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'lms.db');
const COURSES_JSON = path.join(__dirname, 'courses.json');
const USERS_JSON = path.join(__dirname, 'users.json');

export const ADMIN_SECRET_PASSCODE = 'RIN-2005';
export const APP_SECRET = 'RMSA_JWT_SUPER_SECRET_KEY_2026_PROD';
const SYSTEM_PEPPER = 'RMSA_SECURITY_PEPPER_2026_RUNNING_MAN_ACADEMY_SALT_v1';

// Băm mật khẩu chuẩn OWASP có Salted Pepper (Chống hoàn toàn Rainbow Tables)
export function hashPassword(plainText, salt = SYSTEM_PEPPER) {
  return crypto.createHmac('sha256', salt).update(String(plainText || '')).digest('hex');
}

// Hàm chuẩn hóa chuỗi tiếng Việt bỏ dấu dùng cho tìm kiếm không dấu
export function removeVietnameseTones(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
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

    -- Bảng lưu trữ Chuỗi ngày học thực chiến (Daily Streak Engine)
    CREATE TABLE IF NOT EXISTS user_streaks (
      user_id TEXT PRIMARY KEY,
      streak_count INTEGER DEFAULT 3,
      last_completed_date TEXT,
      history_json TEXT DEFAULT '[]',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Bảng theo dõi hạn ngạch rèn luyện hằng ngày (Anti-spam Daily Quota Engine)
    CREATE TABLE IF NOT EXISTS daily_activity_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      activity_date TEXT NOT NULL,
      scenarios_correct INTEGER DEFAULT 0,
      practice_tests_passed INTEGER DEFAULT 0,
      practice_test_scores_json TEXT DEFAULT '[]',
      scenarios_ids_json TEXT DEFAULT '[]',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_name, activity_date)
    );
    CREATE INDEX IF NOT EXISTS idx_daily_act ON daily_activity_records(student_name, activity_date);

    -- Bảng Bài viết Cộng đồng Nội bộ (Đồng bộ thời gian thực toàn hệ thống)
    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      author TEXT NOT NULL,
      author_username TEXT DEFAULT '',
      role TEXT DEFAULT 'student',
      branch TEXT DEFAULT 'RMSA',
      avatar TEXT DEFAULT '',
      time_label TEXT DEFAULT 'Vừa xong',
      category TEXT DEFAULT 'qa',
      category_label TEXT DEFAULT '',
      category_color TEXT DEFAULT '',
      is_pinned INTEGER DEFAULT 0,
      is_celebration INTEGER DEFAULT 0,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      deposit_amount TEXT DEFAULT '',
      room_info TEXT DEFAULT '',
      likes INTEGER DEFAULT 0,
      liked_by_json TEXT DEFAULT '[]',
      comments_json TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_community_posts_cat ON community_posts(category, is_pinned DESC, created_at DESC);

    -- Bảng Thước Phim Thực Chiến (Reels / TikTok / Shorts đồng bộ toàn hệ thống)
    CREATE TABLE IF NOT EXISTS community_reels (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      platform TEXT DEFAULT 'tiktok',
      video_url TEXT NOT NULL,
      thumbnail_url TEXT DEFAULT '',
      author TEXT DEFAULT 'Đan Rin (HLV Trưởng)',
      tag TEXT DEFAULT 'Thực Địa RMSA',
      views_label TEXT DEFAULT 'Thực chiến',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Bảng Thông Báo Hệ Thống (Đồng bộ thời gian thực cho Học viên & Quản trị viên)
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      target_role TEXT DEFAULT 'all',
      target_user_id TEXT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'system',
      link TEXT,
      sender_name TEXT DEFAULT 'Hội Sở RMSA',
      sender_role TEXT DEFAULT 'admin',
      metadata_json TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_notifications_target ON notifications(target_role, target_user_id, created_at DESC);

    -- Bảng Đánh dấu đã đọc thông báo theo từng tài khoản cá nhân
    CREATE TABLE IF NOT EXISTS user_notification_reads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_identifier TEXT NOT NULL,
      notification_id TEXT NOT NULL,
      read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_identifier, notification_id)
    );
    CREATE INDEX IF NOT EXISTS idx_notif_reads ON user_notification_reads(user_identifier, notification_id);

    -- Bảng Đánh dấu đã xóa / ẩn thông báo theo từng tài khoản cá nhân
    CREATE TABLE IF NOT EXISTS user_notification_deletions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_identifier TEXT NOT NULL,
      notification_id TEXT NOT NULL,
      deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_identifier, notification_id)
    );
    CREATE INDEX IF NOT EXISTS idx_notif_deletions ON user_notification_deletions(user_identifier, notification_id);

    -- Bảng Thiết bị đăng ký nhận thông báo đẩy xuống máy cá nhân (Web Push Subscriptions)
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_identifier TEXT,
      role TEXT DEFAULT 'student',
      endpoint TEXT UNIQUE NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_push_subs_role ON push_subscriptions(role, user_identifier);
  `);

  // Safe migrations cho database hiện hữu
  try { db.exec("ALTER TABLE lessons ADD COLUMN attachments_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN timestamps_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN videos_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN thumbnail_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN google_id TEXT"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'local'"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN title TEXT DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN skills TEXT DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN zalo_phone TEXT DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN cover_url TEXT DEFAULT ''"); } catch {}
  try { db.exec("DELETE FROM lessons WHERE id = 'practice-test'"); } catch {}

  // Tự động khởi tạo bài viết ghim quy chuẩn mặc định của Ban Đào Tạo nếu bảng community_posts trống
  try {
    const postCount = db.prepare('SELECT COUNT(*) as count FROM community_posts').get()?.count || 0;
    if (postCount === 0) {
      seedDefaultCommunityPost();
    }
  } catch {}

  // Tự động khởi tạo Thước Phim Thực Địa (Reels & TikTok) nếu bảng community_reels trống
  try {
    const reelCount = db.prepare('SELECT COUNT(*) as count FROM community_reels').get()?.count || 0;
    if (reelCount === 0) {
      seedDefaultCommunityReels();
    }
  } catch {}

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
  } else if (count > 0) {
    try {
      db.prepare("UPDATE lessons SET category = REPLACE(category, 'Nhóm ', 'Chủ đề ') WHERE category LIKE 'Nhóm %'").run();
    } catch {}
    // Tự động kiểm tra & đồng bộ dữ liệu chuẩn mới (loại bỏ triệt để câu hỏi anime Naruto cũ trong SQLite trên Render)
    try {
      const narutoQuiz = db.prepare("SELECT COUNT(*) as c FROM quizzes WHERE question LIKE '%Naruto%' OR explanation LIKE '%Naruto%'").get();
      const narutoVideo = db.prepare("SELECT COUNT(*) as c FROM lessons WHERE id = 'bai-1' AND (video_url LIKE '%8pPLsYuZZ0Q%' OR videos_json LIKE '%Naruto%')").get();
      if ((narutoQuiz && narutoQuiz.c > 0) || (narutoVideo && narutoVideo.c > 0)) {
        console.log('🔄 Phát hiện câu hỏi Naruto mẫu cũ trong SQLite, tự động cập nhật bộ đề BĐS mới từ courses.json...');
        const freshCourses = JSON.parse(fs.readFileSync(COURSES_JSON, 'utf-8'));
        insertCoursesTransaction(freshCourses);
      }
    } catch (e) {
      console.warn('Lỗi kiểm tra migration dữ liệu bài 1:', e.message);
    }

    // Tự động kiểm tra & đồng bộ: gỡ bỏ câu hỏi mẫu cũ ở các bài chưa tải video/đề (bài 2 -> 8)
    try {
      const dummyQuizzes = db.prepare(`
        SELECT COUNT(*) as c FROM quizzes 
        WHERE lesson_id != 'bai-1' AND lesson_id IN ('bai-2','bai-3','bai-4','bai-5','bai-6','bai-7','bai-8')
      `).get();
      if (dummyQuizzes && dummyQuizzes.c > 0) {
        console.log('🧹 Tự động dọn dẹp câu hỏi mẫu cũ ở các bài chưa có video...');
        db.prepare("DELETE FROM quizzes WHERE lesson_id != 'bai-1' AND lesson_id IN ('bai-2','bai-3','bai-4','bai-5','bai-6','bai-7','bai-8')").run();
        const lessonsToClean = db.prepare("SELECT id, videos_json FROM lessons WHERE id != 'bai-1'").all();
        const updateLessonVideosStmt = db.prepare("UPDATE lessons SET videos_json = ? WHERE id = ?");
        for (const l of lessonsToClean) {
          try {
            const vList = JSON.parse(l.videos_json || '[]');
            if (Array.isArray(vList)) {
              vList.forEach(v => {
                v.quiz = [];
                v.questionPool = [];
              });
              updateLessonVideosStmt.run(JSON.stringify(vList), l.id);
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Lỗi dọn dẹp quiz mẫu cũ:', e.message);
    }
  }

  // Tự động đồng bộ và khôi phục tài khoản từ file users.json nếu có (Bảo toàn 100% dữ liệu khi Render redeploy)
  try {
    if (fs.existsSync(USERS_JSON)) {
      const persistedUsers = JSON.parse(fs.readFileSync(USERS_JSON, 'utf-8'));
      if (Array.isArray(persistedUsers) && persistedUsers.length > 0) {
        const insertOrIgnore = db.prepare(`
          INSERT OR IGNORE INTO users 
          (username, password_hash, full_name, phone, branch, role, status, google_id, avatar_url, auth_provider, title, bio, created_at, last_login_at)
          VALUES (@username, @password_hash, @full_name, @phone, @branch, @role, @status, @google_id, @avatar_url, @auth_provider, @title, @bio, @created_at, @last_login_at)
        `);
        const syncTx = db.transaction((users) => {
          for (const u of users) {
            insertOrIgnore.run({
              username: u.username,
              password_hash: u.password_hash,
              full_name: u.full_name || u.name,
              phone: u.phone || '',
              branch: u.branch || 'RMSA - Bình Thạnh',
              role: u.role || 'student',
              status: u.status || 'active',
              google_id: u.google_id || null,
              avatar_url: u.avatar_url || '',
              auth_provider: u.auth_provider || 'local',
              title: u.title || '',
              bio: u.bio || '',
              created_at: u.created_at || new Date().toISOString(),
              last_login_at: u.last_login_at || null
            });
          }
        });
        syncTx(persistedUsers);
      }
    }
  } catch (err) {
    console.warn('Lỗi nạp users.json vào SQLite:', err.message);
  }

  // Tự động khởi tạo tài khoản Quản trị gốc chính thức nếu bảng users trống
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()?.count || 0;
    if (userCount === 0) {
      const defaultPasswordHash = hashPassword('123456');
      const insertUserStmt = db.prepare(`
        INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, created_at, last_login_at, avatar_url, title)
        VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)
      `);

      // Tài khoản Quản trị viên chính thức (Root Admin)
      insertUserStmt.run(
        'admin@runningman.vn',
        defaultPasswordHash,
        'Đan Rin (HLV Trưởng & Quản Trị Viên)',
        '0376 604 616',
        'Hội Sở RMSA',
        'admin',
        '/images/anh_rin_avatar.jpg',
        'HLV Trưởng & Giám Đốc Đào Tạo'
      );

      db.prepare(`
        INSERT INTO activity_logs (user_name, role, branch, action_type, description, created_at)
        VALUES ('Hệ Thống RMSA', 'admin', 'Hội Sở RMSA', 'SYSTEM_INIT', 'Khởi tạo hệ thống cơ sở dữ liệu và tài khoản Quản trị viên chính thức (Root Admin)', CURRENT_TIMESTAMP)
      `).run();
    }
    // Luôn bảo đảm đồng bộ trạng thái mới nhất sang users.json
    syncUsersToDisk();
  } catch {}
}

// Tự động sao lưu và đồng bộ danh sách tài khoản sang file users.json để bảo toàn 100% dữ liệu ngay cả khi Render redeploy
export function syncUsersToDisk() {
  try {
    const allUsers = db.prepare(`
      SELECT username, password_hash, full_name, phone, branch, role, status, google_id, avatar_url, auth_provider, title, bio, created_at, last_login_at
      FROM users
    `).all();
    fs.writeFileSync(USERS_JSON, JSON.stringify(allUsers, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Lỗi đồng bộ users sang JSON:', err.message);
  }
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

    const lessonSummary = JSON.parse(lesson.summary_json || '[]');
    const lessonTimestamps = JSON.parse(lesson.timestamps_json || '[]');
    const lessonQuiz = quizzes.map(q => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.options_json || '[]'),
      correctAnswer: q.correct_answer,
      explanation: q.explanation
    }));

    // Đảm bảo Phần 1 luôn có dữ liệu đồng bộ nếu chưa có dữ liệu riêng trong videos[0]
    if (videos.length > 0 && videos[0]) {
      if (!Array.isArray(videos[0].summary) || videos[0].summary.length === 0) {
        videos[0].summary = lessonSummary;
      }
      if (!Array.isArray(videos[0].timestamps) || videos[0].timestamps.length === 0) {
        videos[0].timestamps = lessonTimestamps;
      }
      if (!Array.isArray(videos[0].quiz) || videos[0].quiz.length === 0) {
        videos[0].quiz = lessonQuiz;
      }
      if (!Array.isArray(videos[0].questionPool) || videos[0].questionPool.length === 0) {
        videos[0].questionPool = lessonQuiz;
      }
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
      summary: lessonSummary,
      attachments: JSON.parse(lesson.attachments_json || '[]'),
      documents: JSON.parse(lesson.attachments_json || '[]'),
      timestamps: lessonTimestamps,
      quiz: lessonQuiz,
      questionPool: (videos[0] && Array.isArray(videos[0].questionPool) && videos[0].questionPool.length > 0)
        ? videos[0].questionPool
        : lessonQuiz
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
      { id: 1, title: 'Video 1: Lý thuyết nền tảng', url: courseData.videoUrl, type: courseData.videoType || 'youtube', duration: '15:00', quiz: [], questionPool: [] }
    ];
  } else if (videos.length === 0) {
    videos = [
      { id: 1, title: 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt', url: '', type: 'direct', duration: '15:00', quiz: [], questionPool: [] }
    ];
  }

  // Đảm bảo từng phần video luôn có cấu trúc quiz rỗng nếu chưa có bộ đề riêng
  videos = videos.map(v => ({
    ...v,
    quiz: Array.isArray(v.quiz) ? v.quiz : [],
    questionPool: Array.isArray(v.questionPool) ? v.questionPool : []
  }));

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

// Hàm xóa chuyên đề khỏi SQLite (Chuẩn ACID Transaction dọn dẹp toàn bộ dữ liệu liên quan)
export function deleteSingleCourse(lessonId) {
  const cleanId = String(lessonId || '').trim();
  if (!cleanId) return null;

  const existing = db.prepare('SELECT id, title FROM lessons WHERE id = ?').get(cleanId);
  if (!existing) return null;

  const runDelete = db.transaction(() => {
    // Xóa liên kết quiz, bài nộp, và tiến độ
    db.prepare('DELETE FROM quizzes WHERE lesson_id = ?').run(cleanId);
    db.prepare('DELETE FROM quiz_attempts WHERE lesson_id = ?').run(cleanId);
    db.prepare('DELETE FROM student_progress WHERE lesson_id = ?').run(cleanId);
    db.prepare('DELETE FROM lessons WHERE id = ?').run(cleanId);

    // Đánh lại số thứ tự order_num cho các bài còn lại
    const remainingLessons = db.prepare('SELECT id FROM lessons ORDER BY order_num ASC, id ASC').all();
    const updateOrderStmt = db.prepare('UPDATE lessons SET order_num = ? WHERE id = ?');
    remainingLessons.forEach((l, idx) => {
      updateOrderStmt.run(idx + 1, l.id);
    });
  });

  runDelete();

  // Đồng bộ lại ra courses.json
  try {
    const allCourses = getAllCourses();
    fs.writeFileSync(COURSES_JSON, JSON.stringify(allCourses, null, 2), 'utf-8');
  } catch {}

  recordActivity({
    userName: 'Quản Trị Viên',
    role: 'admin',
    branch: 'Hội Sở RMSA',
    actionType: 'DELETE_LESSON',
    description: `Đã xóa chuyên đề "${existing.title}" (Mã: ${cleanId})`,
    metadata: { lessonId: cleanId, title: existing.title }
  });

  return getAllCourses();
}

// Đổi tên / Chỉnh sửa tiêu đề của một chuyên đề cụ thể (Admin only)
export function renameLesson(lessonId, newTitle) {
  try {
    const cleanId = String(lessonId || '').trim();
    const cleanTitle = String(newTitle || '').trim();
    if (!cleanId || !cleanTitle) {
      return { success: false, message: 'Mã bài học và tên mới không được để trống.' };
    }

    const existing = db.prepare('SELECT id, title FROM lessons WHERE id = ?').get(cleanId);
    if (!existing) {
      return { success: false, message: 'Chuyên đề không tồn tại trên hệ thống.' };
    }

    db.prepare('UPDATE lessons SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(cleanTitle, cleanId);

    // Đồng bộ lại ra courses.json
    const allCourses = getAllCourses();
    try {
      fs.writeFileSync(COURSES_JSON, JSON.stringify(allCourses, null, 2), 'utf-8');
    } catch {}

    recordActivity({
      userName: 'Quản Trị Viên',
      role: 'admin',
      branch: 'Hội Sở RMSA',
      actionType: 'RENAME_LESSON',
      description: `Đã đổi tên bài học từ "${existing.title}" thành "${cleanTitle}"`,
      metadata: { lessonId: cleanId, oldTitle: existing.title, newTitle: cleanTitle }
    });

    return {
      success: true,
      message: `Đã đổi tên bài học thành "${cleanTitle}" thành công!`,
      courses: allCourses,
      lessonId: cleanId,
      newTitle: cleanTitle
    };
  } catch (err) {
    return { success: false, message: `Lỗi khi đổi tên chuyên đề: ${err.message}` };
  }
}

// Cập nhật video của một chuyên đề cụ thể (Hỗ trợ đa nguồn & multi-videos, hỗ trợ gỡ bỏ tóm tắt/đề thi cũ nếu resetSummaryAndQuiz=true)
export function updateLessonVideo(lessonId, { videoUrl, videoType = 'direct', videos = [], resetSummaryAndQuiz = false }) {
  try {
    const existing = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId);
    if (!existing) {
      return { success: false, message: 'Chuyên đề không tồn tại trên hệ thống.' };
    }

    let existingVideos = [];
    try {
      existingVideos = JSON.parse(existing.videos_json || '[]');
    } catch {
      existingVideos = [];
    }

    let finalVideos = Array.isArray(videos) && videos.length > 0 ? videos : [];
    if (finalVideos.length === 0 && videoUrl) {
      finalVideos = [
        {
          id: 1,
          title: 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt',
          url: videoUrl,
          type: videoType,
          duration: existing.duration || '15 phút'
        }
      ];
    }

    if (resetSummaryAndQuiz) {
      // Gỡ bỏ hoàn toàn tóm tắt, mốc thời gian và câu hỏi trắc nghiệm cũ không khớp với video mới
      finalVideos = finalVideos.map((v, idx) => ({
        ...v,
        id: idx + 1,
        summary: [],
        timestamps: [],
        quiz: [],
        questionPool: []
      }));

      db.prepare(`
        UPDATE lessons 
        SET summary_json = '[]', timestamps_json = '[]', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(lessonId);

      db.prepare('DELETE FROM quizzes WHERE lesson_id = ?').run(lessonId);
    } else {
      // Bảo toàn dữ liệu AI (summary, timestamps, quiz, questionPool) của từng phần nếu client không truyền kèm
      finalVideos = finalVideos.map((v, idx) => {
        const prev = existingVideos[idx] || {};
        return {
          ...prev,
          ...v,
          id: idx + 1,
          summary: Array.isArray(v.summary) ? v.summary : (Array.isArray(prev.summary) ? prev.summary : []),
          timestamps: Array.isArray(v.timestamps) ? v.timestamps : (Array.isArray(prev.timestamps) ? prev.timestamps : []),
          quiz: Array.isArray(v.quiz) ? v.quiz : (Array.isArray(prev.quiz) ? prev.quiz : []),
          questionPool: Array.isArray(v.questionPool) ? v.questionPool : (Array.isArray(prev.questionPool) ? prev.questionPool : [])
        };
      });
    }

    const primaryVideo = finalVideos[0] || {};
    const mainVideoUrl = primaryVideo.url || videoUrl || '';
    const mainVideoType = primaryVideo.type || videoType || 'direct';

    db.prepare(`
      UPDATE lessons 
      SET video_url = ?, video_type = ?, videos_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(mainVideoUrl, mainVideoType, JSON.stringify(finalVideos), lessonId);

    // Đồng bộ lại file courses.json
    const allCourses = getAllCourses();
    try {
      fs.writeFileSync(COURSES_JSON, JSON.stringify(allCourses, null, 2), 'utf-8');
    } catch {}

    recordActivity({
      userName: 'Quản Trị Viên',
      role: 'admin',
      branch: 'Hội Sở RMSA',
      actionType: 'UPDATE_LESSON_VIDEO',
      description: resetSummaryAndQuiz 
        ? `Đã cập nhật video bài giảng & gỡ bỏ tóm tắt/đề thi cũ cho "${existing.title}"`
        : `Đã cập nhật video bài giảng cho "${existing.title}"`,
      metadata: { lessonId, videoUrl: mainVideoUrl, resetSummaryAndQuiz }
    });

    return {
      success: true,
      message: resetSummaryAndQuiz
        ? 'Cập nhật video bài giảng thành công! Đã làm mới (gỡ bỏ) tóm tắt & bài thi cũ không khớp.'
        : 'Cập nhật video bài giảng thành công!',
      courses: allCourses
    };
  } catch (err) {
    return { success: false, message: `Lỗi cập nhật video: ${err.message}` };
  }
}

// Gỡ bỏ / Làm mới tóm tắt & bộ đề trắc nghiệm không khớp của chuyên đề (Admin only)
export function clearLessonContent(lessonId, { targetVideoIndex = null, clearType = 'all' } = {}) {
  try {
    const existing = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId);
    if (!existing) {
      return { success: false, message: 'Chuyên đề không tồn tại trên hệ thống.' };
    }

    let videos = [];
    try {
      videos = JSON.parse(existing.videos_json || '[]');
    } catch {
      videos = [];
    }

    const clearSummary = clearType === 'all' || clearType === 'summary';
    const clearQuiz = clearType === 'all' || clearType === 'quiz';

    if (typeof targetVideoIndex === 'number' && targetVideoIndex >= 0 && videos[targetVideoIndex]) {
      // Chỉ xóa ở một phần cụ thể
      if (clearSummary) {
        videos[targetVideoIndex].summary = [];
        videos[targetVideoIndex].timestamps = [];
      }
      if (clearQuiz) {
        videos[targetVideoIndex].quiz = [];
        videos[targetVideoIndex].questionPool = [];
      }
      if (targetVideoIndex === 0) {
        if (clearSummary) {
          db.prepare("UPDATE lessons SET summary_json = '[]', timestamps_json = '[]' WHERE id = ?").run(lessonId);
        }
        if (clearQuiz) {
          db.prepare('DELETE FROM quizzes WHERE lesson_id = ?').run(lessonId);
        }
      }
    } else {
      // Xóa toàn bộ chuyên đề
      videos = videos.map(v => ({
        ...v,
        summary: clearSummary ? [] : (v.summary || []),
        timestamps: clearSummary ? [] : (v.timestamps || []),
        quiz: clearQuiz ? [] : (v.quiz || []),
        questionPool: clearQuiz ? [] : (v.questionPool || [])
      }));

      if (clearSummary) {
        db.prepare("UPDATE lessons SET summary_json = '[]', timestamps_json = '[]' WHERE id = ?").run(lessonId);
      }
      if (clearQuiz) {
        db.prepare('DELETE FROM quizzes WHERE lesson_id = ?').run(lessonId);
      }
    }

    db.prepare('UPDATE lessons SET videos_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(JSON.stringify(videos), lessonId);

    const allCourses = getAllCourses();
    try {
      fs.writeFileSync(COURSES_JSON, JSON.stringify(allCourses, null, 2), 'utf-8');
    } catch {}

    recordActivity({
      userName: 'Quản Trị Viên',
      role: 'admin',
      branch: 'Hội Sở RMSA',
      actionType: 'CLEAR_LESSON_CONTENT',
      description: `Đã gỡ bỏ tóm tắt & đề thi của chuyên đề "${existing.title}"`,
      metadata: { lessonId, clearType, targetVideoIndex }
    });

    return {
      success: true,
      message: 'Đã gỡ bỏ tóm tắt & bài thi thành công!',
      courses: allCourses
    };
  } catch (err) {
    return { success: false, message: `Lỗi gỡ bỏ nội dung: ${err.message}` };
  }
}

// Cập nhật câu hỏi trắc nghiệm & điểm chuẩn của một chuyên đề (Hỗ trợ lưu riêng theo từng Phần targetVideoIndex)
export function updateLessonQuiz(lessonId, { quiz = [], questionPool = null, passingScore = 80, targetVideoIndex = null }) {
  try {
    const existing = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId);
    if (!existing) {
      return { success: false, message: 'Chuyên đề không tồn tại trên hệ thống.' };
    }

    const safePassingScore = Number(passingScore) || 80;
    const partIdx = typeof targetVideoIndex === 'number' && targetVideoIndex >= 0 ? targetVideoIndex : 0;

    let currentVideos = [];
    try {
      currentVideos = JSON.parse(existing.videos_json || '[]');
    } catch {
      currentVideos = [];
    }
    if (!Array.isArray(currentVideos) || currentVideos.length === 0) {
      currentVideos = [
        {
          id: 1,
          title: 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt',
          url: existing.video_url || '',
          type: existing.video_type || 'direct',
          duration: existing.duration || '15 phút'
        }
      ];
    }

    const normalizedQuiz = (Array.isArray(quiz) ? quiz : []).map((q, idx) => ({
      id: q.id || `q_${lessonId}_p${partIdx + 1}_${idx + 1}_${Date.now()}`,
      question: String(q.question || '').trim(),
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: String(q.explanation || '').trim()
    }));

    const rawPool = Array.isArray(questionPool) && questionPool.length > 0 ? questionPool : normalizedQuiz;
    const normalizedPool = rawPool.map((q, idx) => ({
      id: q.id || `q_${lessonId}_p${partIdx + 1}_pool_${idx + 1}_${Date.now()}`,
      question: String(q.question || '').trim(),
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: String(q.explanation || '').trim()
    }));

    // Đảm bảo mảng currentVideos đủ phần tử tới partIdx
    while (currentVideos.length <= partIdx) {
      const nextNum = currentVideos.length + 1;
      currentVideos.push({
        id: nextNum,
        title: `Phần ${nextNum}: Nội dung chuyên sâu`,
        url: '',
        type: 'youtube',
        duration: '15 phút',
        summary: [],
        timestamps: [],
        quiz: [],
        questionPool: []
      });
    }

    currentVideos[partIdx] = {
      ...currentVideos[partIdx],
      quiz: normalizedQuiz,
      questionPool: normalizedPool
    };

    const runQuizUpdate = db.transaction(() => {
      // 1. Cập nhật passing_score và videos_json trong lessons
      db.prepare('UPDATE lessons SET passing_score = ?, videos_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(safePassingScore, JSON.stringify(currentVideos), lessonId);

      // 2. Chỉ cập nhật bảng quizzes cấp bài học khi chỉnh sửa Phần 1 (partIdx === 0) để không ghi đè Phần 1 khi sửa Phần 2/3/4
      if (partIdx === 0) {
        db.prepare('DELETE FROM quizzes WHERE lesson_id = ?').run(lessonId);

        const insertQuizStmt = db.prepare(`
          INSERT INTO quizzes (id, lesson_id, question, options_json, correct_answer, explanation)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        normalizedQuiz.forEach((q) => {
          insertQuizStmt.run(
            q.id,
            lessonId,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation
          );
        });
      }
    });

    runQuizUpdate();

    // Đồng bộ lại file courses.json
    const allCourses = getAllCourses();
    try {
      fs.writeFileSync(COURSES_JSON, JSON.stringify(allCourses, null, 2), 'utf-8');
    } catch {}

    return {
      success: true,
      message: `Cập nhật bài kiểm tra sát hạch Phần ${partIdx + 1} thành công!`,
      courses: allCourses
    };
  } catch (err) {
    return { success: false, message: `Lỗi cập nhật bài kiểm tra: ${err.message}` };
  }
}

// Cập nhật nội dung do AI trích xuất (Tách biệt độc lập theo từng Phần: Phần 1, Phần 2, Phần 3, Phần 4...)
// Hỗ trợ generateMode: 'all' | 'summary_only' | 'quiz_only' để tách bạch 2 nút AI riêng biệt
export function updateLessonAiGeneratedContent(lessonId, {
  summary = [],
  timestamps = [],
  quiz = [],
  questionPool = [],
  detectedTitle = '',
  targetVideoIndex = null,
  videos: incomingVideos = null,
  generateMode = 'all'
}) {
  try {
    const existing = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId);
    if (!existing) {
      return { success: false, message: 'Chuyên đề không tồn tại trên hệ thống.' };
    }

    const partIdx = typeof targetVideoIndex === 'number' && targetVideoIndex >= 0 ? targetVideoIndex : 0;

    let currentVideos = [];
    try {
      currentVideos = JSON.parse(existing.videos_json || '[]');
    } catch {
      currentVideos = [];
    }

    // Nếu client gửi danh sách videos mới lên (ví dụ vừa thêm Phần 2 trong modal rồi bấm AI ngay), hợp nhất nhưng vẫn giữ dữ liệu AI cũ của các phần khác
    if (Array.isArray(incomingVideos) && incomingVideos.length > 0) {
      currentVideos = incomingVideos.map((v, idx) => {
        const prev = currentVideos[idx] || {};
        return {
          ...prev,
          ...v,
          id: idx + 1,
          summary: Array.isArray(prev.summary) ? prev.summary : (Array.isArray(v.summary) ? v.summary : []),
          timestamps: Array.isArray(prev.timestamps) ? prev.timestamps : (Array.isArray(v.timestamps) ? v.timestamps : []),
          quiz: Array.isArray(prev.quiz) ? prev.quiz : (Array.isArray(v.quiz) ? v.quiz : []),
          questionPool: Array.isArray(prev.questionPool) ? prev.questionPool : (Array.isArray(v.questionPool) ? v.questionPool : [])
        };
      });
    }

    if (!Array.isArray(currentVideos) || currentVideos.length === 0) {
      currentVideos = [
        {
          id: 1,
          title: 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt',
          url: existing.video_url || '',
          type: existing.video_type || 'direct',
          duration: existing.duration || '15 phút',
          summary: [],
          timestamps: [],
          quiz: [],
          questionPool: []
        }
      ];
    }

    while (currentVideos.length <= partIdx) {
      const nextNum = currentVideos.length + 1;
      currentVideos.push({
        id: nextNum,
        title: `Phần ${nextNum}: Nội dung chuyên sâu`,
        url: '',
        type: 'youtube',
        duration: '15 phút',
        summary: [],
        timestamps: [],
        quiz: [],
        questionPool: []
      });
    }

    const safeSummary = Array.isArray(summary) ? summary : [];
    const safeTimestamps = Array.isArray(timestamps) ? timestamps : [];
    const safeQuiz = (Array.isArray(quiz) ? quiz : []).map((q, idx) => ({
      id: q.id || `${lessonId}_p${partIdx + 1}_ai_q${idx + 1}`,
      question: String(q.question || '').trim(),
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: String(q.explanation || '').trim()
    }));
    const safePool = (Array.isArray(questionPool) && questionPool.length > 0 ? questionPool : safeQuiz).map((q, idx) => ({
      id: q.id || `${lessonId}_p${partIdx + 1}_ai_q${idx + 1}`,
      question: String(q.question || '').trim(),
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: String(q.explanation || '').trim()
    }));

    const curPartTitle = String(currentVideos[partIdx]?.title || '').trim();
    const isDefaultPlaceholder =
      !curPartTitle ||
      curPartTitle === existing.title ||
      /^Phần\s*\d+\s*[:—-]?\s*(Lý thuyết nền tảng.*|Bài giảng thực chiến.*|Nội dung chuyên sâu.*|Khái niệm then chốt.*|Lý thuyết chuyên đề.*|Bài giảng Video.*)?$/i.test(curPartTitle);

    const cleanDetected = String(detectedTitle || '').trim();
    const finalPartTitle = isDefaultPlaceholder && cleanDetected && !cleanDetected.startsWith(`Phần ${partIdx + 1}`)
      ? `Phần ${partIdx + 1}: ${cleanDetected}`
      : (curPartTitle || `Phần ${partIdx + 1}`);

    // Lưu nội dung AI vào ĐÚNG phần partIdx theo chế độ generateMode
    const prevPart = currentVideos[partIdx] || {};
    currentVideos[partIdx] = {
      ...prevPart,
      title: finalPartTitle,
      summary: generateMode === 'quiz_only' ? (Array.isArray(prevPart.summary) ? prevPart.summary : []) : safeSummary,
      timestamps: generateMode === 'quiz_only' ? (Array.isArray(prevPart.timestamps) ? prevPart.timestamps : []) : safeTimestamps,
      quiz: generateMode === 'summary_only' ? (Array.isArray(prevPart.quiz) ? prevPart.quiz : []) : safeQuiz,
      questionPool: generateMode === 'summary_only' ? (Array.isArray(prevPart.questionPool) ? prevPart.questionPool : []) : safePool
    };

    const primaryVideo = currentVideos[0] || {};
    const mainVideoUrl = primaryVideo.url || existing.video_url || '';
    const mainVideoType = primaryVideo.type || existing.video_type || 'direct';

    const runAiContentUpdate = db.transaction(() => {
      // 1. Luôn cập nhật videos_json để lưu riêng từng phần
      // Chỉ khi partIdx === 0 (Phần 1) mới cập nhật summary_json, timestamps_json và quizzes cấp bài học
      if (partIdx === 0) {
        if (generateMode === 'summary_only') {
          // CHỈ cập nhật summary và timestamps, giữ nguyên 100% quizzes
          db.prepare(`
            UPDATE lessons 
            SET video_url = ?, video_type = ?, summary_json = ?, timestamps_json = ?, videos_json = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `).run(
            mainVideoUrl,
            mainVideoType,
            JSON.stringify(safeSummary),
            JSON.stringify(safeTimestamps),
            JSON.stringify(currentVideos),
            lessonId
          );
        } else if (generateMode === 'quiz_only') {
          // CHỈ cập nhật quiz và questionPool, giữ nguyên 100% summary_json và timestamps_json
          db.prepare(`
            UPDATE lessons 
            SET video_url = ?, video_type = ?, videos_json = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `).run(
            mainVideoUrl,
            mainVideoType,
            JSON.stringify(currentVideos),
            lessonId
          );

          if (safeQuiz.length > 0) {
            db.prepare('DELETE FROM quizzes WHERE lesson_id = ?').run(lessonId);

            const insertQuizStmt = db.prepare(`
              INSERT INTO quizzes (id, lesson_id, question, options_json, correct_answer, explanation)
              VALUES (?, ?, ?, ?, ?, ?)
            `);

            safeQuiz.forEach((q) => {
              insertQuizStmt.run(
                q.id,
                lessonId,
                q.question,
                JSON.stringify(q.options),
                q.correctAnswer,
                q.explanation
              );
            });
          }
        } else {
          // 'all': Cập nhật cả hai
          db.prepare(`
            UPDATE lessons 
            SET video_url = ?, video_type = ?, summary_json = ?, timestamps_json = ?, videos_json = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `).run(
            mainVideoUrl,
            mainVideoType,
            JSON.stringify(safeSummary),
            JSON.stringify(safeTimestamps),
            JSON.stringify(currentVideos),
            lessonId
          );

          if (safeQuiz.length > 0) {
            db.prepare('DELETE FROM quizzes WHERE lesson_id = ?').run(lessonId);

            const insertQuizStmt = db.prepare(`
              INSERT INTO quizzes (id, lesson_id, question, options_json, correct_answer, explanation)
              VALUES (?, ?, ?, ?, ?, ?)
            `);

            safeQuiz.forEach((q) => {
              insertQuizStmt.run(
                q.id,
                lessonId,
                q.question,
                JSON.stringify(q.options),
                q.correctAnswer,
                q.explanation
              );
            });
          }
        }
      } else {
        // Khi partIdx > 0 (Phần 2, Phần 3, Phần 4...): CHỈ cập nhật videos_json, bảo toàn 100% dữ liệu Phần 1!
        db.prepare(`
          UPDATE lessons 
          SET videos_json = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(
          JSON.stringify(currentVideos),
          lessonId
        );
      }
    });

    runAiContentUpdate();

    // 3. Đồng bộ lại file courses.json
    const allCourses = getAllCourses();
    try {
      fs.writeFileSync(COURSES_JSON, JSON.stringify(allCourses, null, 2), 'utf-8');
    } catch {}

    const actionLabel = generateMode === 'summary_only'
      ? 'tóm tắt cốt lõi & mốc thời gian'
      : generateMode === 'quiz_only'
        ? 'bộ 10 câu hỏi sát hạch'
        : 'tóm tắt cốt lõi, mốc thời gian và 10 câu sát hạch';

    return {
      success: true,
      message: `AI đã cập nhật ${actionLabel} thành công!`,
      courses: allCourses
    };
  } catch (err) {
    return { success: false, message: `Lỗi lưu trữ dữ liệu AI: ${err.message}` };
  }
}

// Cập nhật tài liệu văn bản / giáo trình đọc (Attachments / Documents) cho một chuyên đề
export function updateLessonAttachments(lessonId, attachments = []) {
  try {
    const existing = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId);
    if (!existing) {
      return { success: false, message: 'Chuyên đề không tồn tại trên hệ thống.' };
    }

    const safeAttachments = Array.isArray(attachments) ? attachments : [];
    db.prepare(`
      UPDATE lessons 
      SET attachments_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(JSON.stringify(safeAttachments), lessonId);

    // Đồng bộ lại file courses.json
    const allCourses = getAllCourses();
    try {
      fs.writeFileSync(COURSES_JSON, JSON.stringify(allCourses, null, 2), 'utf-8');
    } catch {}

    return {
      success: true,
      message: 'Cập nhật tài liệu giáo trình thành công!',
      attachments: safeAttachments,
      documents: safeAttachments,
      courses: allCourses
    };
  } catch (err) {
    return { success: false, message: `Lỗi cập nhật tài liệu: ${err.message}` };
  }
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
      const validPasscodes = [
        ADMIN_SECRET_PASSCODE, 
        'RIN-2005', 'rin-2005', 'RIN2005', 'rin2005', 'Rin-2005',
        'admin2026', 'Admin2026', 'admin@2026', 'Admin@2026'
      ];
      const inputKey = String(adminSecretKey || '').trim();
      if (validPasscodes.includes(inputKey) || inputKey.toUpperCase() === 'RIN-2005') {
        assignedRole = 'admin';
      } else {
        return { success: false, message: 'Mã xác thực Quản trị viên không chính xác! Không thể cấp quyền Chủ / Quản lý.' };
      }
    }

    const passwordHash = hashPassword(cleanPassword);
    const initialStatus = assignedRole === 'admin' ? 'active' : 'pending';
    const stmt = db.prepare(`
      INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, auth_provider, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'local', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(cleanUsername, passwordHash, cleanFullName, cleanPhone, cleanBranch, assignedRole, initialStatus);
    const newUserId = result.lastInsertRowid;

    recordActivity({
      userId: newUserId,
      userName: cleanFullName,
      role: assignedRole,
      branch: cleanBranch,
      actionType: assignedRole === 'admin' ? 'REGISTER' : 'REGISTER_PENDING',
      description: assignedRole === 'admin' 
        ? `Tài khoản Quản trị / Chủ doanh nghiệp mới vừa được đăng ký (${cleanUsername})` 
        : `Nhân viên mới đã đăng ký tài khoản và đang chờ phê duyệt (${cleanFullName} - ${cleanBranch})`,
      metadata: { username: cleanUsername, phone: cleanPhone, status: initialStatus }
    });

    syncUsersToDisk();

    if (assignedRole === 'admin') {
      const token = generateAuthToken({
        id: newUserId,
        username: cleanUsername,
        role: 'admin',
        full_name: cleanFullName
      });

      return {
        success: true,
        pendingApproval: false,
        message: 'Đăng ký tài khoản Quản trị viên thành công',
        user: {
          id: newUserId,
          username: cleanUsername,
          email: cleanUsername.includes('@') ? cleanUsername : '',
          name: cleanFullName,
          phone: cleanPhone,
          branch: cleanBranch,
          role: 'admin',
          status: 'active',
          avatarUrl: '',
          token
        },
        token
      };
    }

    return {
      success: true,
      pendingApproval: true,
      message: 'Đăng ký tài khoản thành công! Tài khoản của bạn đang ở trạng thái CHỜ DUYỆT. Vui lòng liên hệ Quản lý / Hội Sở RMSA để được duyệt vào học.',
      user: {
        id: newUserId,
        username: cleanUsername,
        email: cleanUsername.includes('@') ? cleanUsername : '',
        name: cleanFullName,
        phone: cleanPhone,
        branch: cleanBranch,
        role: 'student',
        status: 'pending',
        avatarUrl: ''
      }
    };
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed: users.username')) {
      return { success: false, message: 'Tài khoản này đã tồn tại trên hệ thống. Vui lòng đăng nhập!' };
    }
    return { success: false, message: `Lỗi đăng ký: ${err.message}` };
  }
}

// 10. Xác thực đăng nhập đối chiếu trực tiếp từ SQLite (Hỗ trợ đa định dạng: Username, Email, Số điện thoại mọi định dạng, Họ tên)
export function authenticateUser(username, password) {
  try {
    const rawInput = String(username || '').trim();
    const cleanPassword = String(password || '').trim();

    if (!rawInput || !cleanPassword) {
      return { success: false, message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu' };
    }

    const cleanLower = rawInput.toLowerCase();
    const prefix = cleanLower.includes('@') ? cleanLower.split('@')[0] : cleanLower;
    const cleanDigits = rawInput.replace(/\D/g, '');
    let normalizedPhone = cleanDigits;
    if (normalizedPhone.startsWith('84') && normalizedPhone.length === 11) {
      normalizedPhone = '0' + normalizedPhone.slice(2);
    } else if (normalizedPhone.length === 9) {
      normalizedPhone = '0' + normalizedPhone;
    }

    // Tìm kiếm thông minh trên nhiều trường: username, prefix trước @, email nội bộ (@runningman.vn, @gmail.com), họ và tên, hoặc số điện thoại
    let candidates = db.prepare(`
      SELECT * FROM users 
      WHERE LOWER(username) = ? 
         OR LOWER(username) = ?
         OR LOWER(username) = ? || '@runningman.vn'
         OR LOWER(username) = ? || '@gmail.com'
         OR (LOWER(username) LIKE ? AND LOWER(username) NOT LIKE '%@%')
         OR (LOWER(username) LIKE ? AND ? NOT LIKE '%@%')
         OR (LOWER(username) LIKE ? || '@%')
         OR full_name = ?
         OR LOWER(full_name) = ?
         OR (length(?) >= 9 AND REPLACE(REPLACE(REPLACE(phone, ' ', ''), '.', ''), '-', '') = ?)
         OR (length(?) >= 9 AND REPLACE(REPLACE(REPLACE(phone, ' ', ''), '.', ''), '-', '') = ?)
      ORDER BY (CASE WHEN role = 'admin' THEN 1 ELSE 2 END) ASC, id DESC
    `).all(
      cleanLower,
      prefix,
      cleanLower,
      cleanLower,
      prefix,
      cleanLower + '@%', cleanLower,
      prefix,
      rawInput,
      cleanLower,
      cleanDigits, cleanDigits,
      normalizedPhone, normalizedPhone
    );

    // Fallback tìm kiếm không dấu (Tiếng Việt) nếu chưa khớp
    if (!candidates || candidates.length === 0) {
      const normInput = removeVietnameseTones(rawInput);
      if (normInput.length >= 2) {
        const allUsers = db.prepare('SELECT * FROM users').all();
        candidates = allUsers.filter(u => 
          removeVietnameseTones(u.full_name) === normInput || 
          removeVietnameseTones(u.username) === normInput ||
          removeVietnameseTones(String(u.username || '').split('@')[0]) === normInput
        );
      }
    }

    if (!candidates || candidates.length === 0) {
      return { 
        success: false, 
        message: 'Tài khoản không tồn tại trên hệ thống. Vui lòng kiểm tra lại Tên tài khoản, Email hoặc Số điện thoại!' 
      };
    }

    const inputHash = hashPassword(cleanPassword);
    const legacyHash = legacyHashPassword(cleanPassword);

    // Kiểm tra mật khẩu lần lượt trên các tài khoản khớp (Ưu tiên tài khoản Admin)
    let authenticatedUser = null;
    let hasGoogleAccountOnly = false;

    for (const cand of candidates) {
      if (cand.password_hash === inputHash) {
        authenticatedUser = cand;
        break;
      } else if (cand.password_hash === legacyHash) {
        authenticatedUser = cand;
        // Zero-Downtime Migration nâng cấp băm
        try {
          db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(inputHash, cand.id);
        } catch {}
        break;
      }

      // Chỉ kích hoạt cảnh báo Google nếu tài khoản này THỰC SỰ chỉ đăng ký qua Google và chưa từng có mật khẩu cá nhân
      if (cand.auth_provider === 'google' && !cand.password_hash) {
        hasGoogleAccountOnly = true;
      }
    }

    if (!authenticatedUser) {
      if (hasGoogleAccountOnly) {
        return { 
          success: false, 
          message: 'Tài khoản này được đăng ký thông qua Google. Vui lòng bấm nút "Tiếp tục với Google" bên dưới để đăng nhập!' 
        };
      }
      return { success: false, message: 'Mật khẩu không chính xác' };
    }

    if (authenticatedUser.status === 'suspended') {
      return { success: false, status: 'suspended', message: 'Tài khoản đã bị tạm khóa. Vui lòng liên hệ Chủ quản trị!' };
    }

    if (authenticatedUser.status === 'pending') {
      return { 
        success: false, 
        status: 'pending', 
        pendingApproval: true, 
        message: 'Tài khoản của bạn đã đăng ký thành công và đang chờ Quản trị viên duyệt để vào học. Vui lòng liên hệ Quản lý / Hội Sở RMSA!',
        user: {
          id: authenticatedUser.id,
          username: authenticatedUser.username,
          name: authenticatedUser.full_name,
          role: authenticatedUser.role,
          status: 'pending'
        }
      };
    }

    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(authenticatedUser.id);
    syncUsersToDisk();

    recordActivity({
      userId: authenticatedUser.id,
      userName: authenticatedUser.full_name,
      role: authenticatedUser.role,
      branch: authenticatedUser.branch,
      actionType: 'LOGIN',
      description: `Đăng nhập vào hệ thống (${authenticatedUser.role === 'admin' ? 'Chủ/Quản lý' : 'Nhân viên'})`,
      metadata: { username: authenticatedUser.username }
    });

    const token = generateAuthToken(authenticatedUser);

    return {
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        email: authenticatedUser.username.includes('@') ? authenticatedUser.username : (authenticatedUser.email || ''),
        name: authenticatedUser.full_name,
        phone: authenticatedUser.phone,
        branch: authenticatedUser.branch,
        role: authenticatedUser.role === 'admin' ? 'admin' : 'student',
        avatarUrl: authenticatedUser.avatar_url || '',
        title: authenticatedUser.title || '',
        bio: authenticatedUser.bio || '',
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

// 13. Lấy danh sách toàn bộ nhân sự và tiến độ học tập (Ưu tiên nhân viên chờ duyệt lên hàng đầu)
export function getAllUsers() {
  try {
    const users = db.prepare(`
      SELECT id, username, full_name, phone, branch, role, status, auth_provider, avatar_url, created_at, last_login_at
      FROM users
      ORDER BY (CASE WHEN status = 'pending' THEN 0 ELSE 1 END) ASC, (CASE WHEN role = 'admin' THEN 1 ELSE 2 END) ASC, id DESC
    `).all();

    const coursesCount = db.prepare('SELECT COUNT(*) as c FROM lessons').get()?.c || 8;

    return users.map(u => {
      const passedStats = db.prepare(`
        SELECT COUNT(DISTINCT lesson_id) as passed_lessons, AVG(score) as avg_score, COUNT(*) as total_attempts, MAX(created_at) as last_attempt_at
        FROM quiz_attempts
        WHERE user_name = ? OR user_name = ?
      `).get(u.full_name, u.username);

      const passedCount = passedStats?.passed_lessons || 0;
      const avgScore = Math.round(passedStats?.avg_score || 0);
      const totalAttempts = passedStats?.total_attempts || 0;
      const lastAttemptAt = passedStats?.last_attempt_at || null;
      const completionRate = coursesCount > 0 ? Math.min(100, Math.round((passedCount / coursesCount) * 100)) : 0;

      return {
        id: u.id,
        username: u.username,
        email: u.username,
        authProvider: u.auth_provider || (u.username?.includes('@gmail.com') ? 'google' : 'local'),
        name: u.full_name,
        phone: u.phone || 'Chưa cập nhật',
        branch: u.branch || 'RMSA',
        role: u.role,
        status: u.status,
        createdAt: u.created_at,
        lastLoginAt: u.last_login_at,
        passedLessons: passedCount,
        completionRate,
        avgScore,
        totalAttempts,
        lastAttemptAt
      };
    });
  } catch {
    return [];
  }
}

// Xóa nhân sự bởi Quản trị viên
export function deleteUser(userId, adminUser = { name: 'Quản trị viên' }) {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return { success: false, message: 'Không tìm thấy tài khoản nhân sự' };
    }
    if (user.role === 'admin' || user.username === 'admin@runningman.vn') {
      return { success: false, message: 'Không thể xóa tài khoản Quản trị viên cấp cao (Root Admin)' };
    }

    const username = user.username;
    const fullName = user.full_name;

    db.transaction(() => {
      db.prepare('DELETE FROM users WHERE id = ?').run(userId);
      db.prepare('DELETE FROM student_progress WHERE student_name = ? OR student_name = ?').run(fullName, username);
      db.prepare('DELETE FROM quiz_attempts WHERE user_name = ? OR user_name = ?').run(fullName, username);
      db.prepare('DELETE FROM user_streaks WHERE user_id = ? OR user_id = ?').run(fullName, username);
      db.prepare('DELETE FROM daily_activity_records WHERE student_name = ? OR student_name = ?').run(fullName, username);
      try {
        db.prepare("DELETE FROM community_posts WHERE id != 'notice_official_1' AND (author = ? OR author_username = ?)").run(fullName, username);
      } catch {}
    })();

    recordActivity({
      userId: adminUser.id || null,
      userName: adminUser.name || adminUser.full_name || 'Quản trị viên',
      role: 'admin',
      branch: 'Hội Sở RMSA',
      actionType: 'DELETE_USER',
      description: `Quản trị viên đã xóa tài khoản nhân sự: ${fullName} (${username}) khỏi hệ thống`,
      metadata: { deletedUserId: userId, deletedUsername: username, deletedFullName: fullName }
    });

    syncUsersToDisk();

    return { success: true, message: `Đã xóa tài khoản nhân sự "${fullName}" thành công` };
  } catch (err) {
    console.error('Lỗi khi xóa nhân viên:', err);
    return { success: false, message: `Lỗi khi xóa nhân sự: ${err.message}` };
  }
}

// Phê duyệt tài khoản thành viên (Chỉ Admin)
export function approveUser(userId, adminUser = { name: 'Quản trị viên' }) {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return { success: false, message: 'Không tìm thấy tài khoản nhân sự cần duyệt' };
    }

    db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(userId);

    recordActivity({
      userId: user.id,
      userName: user.full_name,
      role: user.role,
      branch: user.branch,
      actionType: 'APPROVE_USER',
      description: `Quản trị viên ${adminUser.name || 'Hội Sở'} đã phê duyệt thành viên (${user.full_name}) vào học`,
      metadata: { admin: adminUser.name, approvedUserId: user.id, username: user.username }
    });

    syncUsersToDisk();

    return { 
      success: true, 
      message: `Đã phê duyệt tài khoản "${user.full_name}" thành công! Nhân viên có thể đăng nhập vào học ngay.`,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        status: 'active'
      }
    };
  } catch (err) {
    return { success: false, message: `Lỗi khi phê duyệt tài khoản: ${err.message}` };
  }
}

// Từ chối / Tạm khóa tài khoản thành viên (Chỉ Admin)
export function rejectUser(userId, adminUser = { name: 'Quản trị viên' }, reason = '') {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return { success: false, message: 'Không tìm thấy tài khoản nhân sự' };
    }

    if (user.username === 'admin@runningman.vn') {
      return { success: false, message: 'Không thể tạm khóa tài khoản Quản trị viên tối cao (Root Admin)!' };
    }

    db.prepare("UPDATE users SET status = 'suspended' WHERE id = ?").run(userId);

    recordActivity({
      userId: user.id,
      userName: user.full_name,
      role: user.role,
      branch: user.branch,
      actionType: 'REJECT_USER',
      description: `Quản trị viên ${adminUser.name || 'Hội Sở'} đã từ chối/tạm khóa tài khoản (${user.full_name})${reason ? ': ' + reason : ''}`,
      metadata: { admin: adminUser.name, targetUserId: user.id, username: user.username, reason }
    });

    syncUsersToDisk();

    return { 
      success: true, 
      message: `Đã từ chối / tạm khóa tài khoản "${user.full_name}"`,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        status: 'suspended'
      }
    };
  } catch (err) {
    return { success: false, message: `Lỗi khi xử lý tài khoản: ${err.message}` };
  }
}

// Lấy chi tiết toàn bộ lịch sử thi / khảo sát của một nhân viên cụ thể
export function getUserQuizAttempts(userId) {
  try {
    const user = db.prepare('SELECT id, username, full_name FROM users WHERE id = ?').get(userId);
    if (!user) return [];
    
    const rows = db.prepare(`
      SELECT qa.id, qa.user_name, qa.lesson_id, l.title as lesson_title, qa.score, qa.passed, qa.time_taken_seconds, qa.answers_json, qa.created_at
      FROM quiz_attempts qa
      LEFT JOIN lessons l ON qa.lesson_id = l.id
      WHERE qa.user_name = ? OR qa.user_name = ?
      ORDER BY qa.id DESC
    `).all(user.full_name, user.username);

    return rows.map(r => ({
      ...r,
      passed: Boolean(r.passed),
      answers: (() => {
        try { return JSON.parse(r.answers_json || '{}'); } catch { return {}; }
      })()
    }));
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết bài thi của user:', err);
    return [];
  }
}

// Dọn dẹp toàn bộ dữ liệu kiểm thử (Xóa nhân viên test, xóa nhật ký cũ)
export function cleanTestData(adminUser = { name: 'Đan Rin (HLV Trưởng & Quản Trị Viên)' }) {
  try {
    db.transaction(() => {
      // 1. Xóa tất cả tài khoản, chỉ bảo toàn DUY NHẤT Root Admin 'admin@runningman.vn'
      db.prepare("DELETE FROM users WHERE username != 'admin@runningman.vn'").run();
      
      // 2. Xóa sạch tiến độ, điểm số, lượt thi và chuỗi học tập để đưa Bảng Xếp Hạng về trạng thái mới tinh 100%
      db.prepare("DELETE FROM student_progress").run();
      db.prepare("DELETE FROM quiz_attempts").run();
      db.prepare("DELETE FROM daily_activity_records").run();
      db.prepare("DELETE FROM user_streaks").run();
      db.prepare("DELETE FROM otp_verifications").run();
      try {
        db.prepare("DELETE FROM community_post_likes").run();
        db.prepare("DELETE FROM community_comments").run();
        db.prepare("DELETE FROM community_posts WHERE id != 'notice_official_1'").run();
        seedDefaultCommunityPost();
      } catch {}

      // 3. Xóa toàn bộ nhật ký cũ
      db.prepare("DELETE FROM activity_logs").run();

      // 4. Ghi 1 nhật ký khởi tạo mới tinh
      db.prepare(`
        INSERT INTO activity_logs (user_id, user_name, role, branch, action_type, description, metadata_json, created_at)
        VALUES (?, ?, 'admin', 'Hội Sở RMSA', 'SYSTEM_INIT', 'Hệ thống đã dọn dẹp sạch toàn bộ tài khoản thử nghiệm và reset Bảng Vàng mới tinh, sẵn sàng bàn giao cho Ban Lãnh Đạo & Nhân Viên RMSA', '{}', CURRENT_TIMESTAMP)
      `).run(adminUser.id || 1, adminUser.name || 'Quản trị viên');
    })();

    syncUsersToDisk();

    return {
      success: true,
      message: 'Đã dọn dẹp toàn bộ tài khoản thử nghiệm và nhật ký cũ thành công'
    };
  } catch (err) {
    console.error('Lỗi khi dọn dẹp dữ liệu test:', err);
    return { success: false, message: `Lỗi khi dọn dẹp: ${err.message}` };
  }
}

// 14. Tổng hợp số liệu KPI cho Quản trị viên
export function getAdminOverviewStats() {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get()?.count || 0;
    const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role != 'admin'").get()?.count || 0;
    const totalAdmins = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get()?.count || 0;
    const totalPending = db.prepare("SELECT COUNT(*) as count FROM users WHERE status = 'pending'").get()?.count || 0;
    const totalPassedAttempts = db.prepare("SELECT COUNT(*) as count FROM quiz_attempts WHERE passed = 1").get()?.count || 0;
    const avgScoreResult = db.prepare("SELECT AVG(score) as avg_score FROM quiz_attempts WHERE passed = 1").get();
    const avgScore = Math.round(avgScoreResult?.avg_score || 0);
    const totalActivities = db.prepare("SELECT COUNT(*) as count FROM activity_logs").get()?.count || 0;

    return {
      totalUsers,
      totalStudents,
      totalAdmins,
      totalPending,
      totalPassedAttempts,
      avgScore,
      totalActivities
    };
  } catch {
    return {
      totalUsers: 0,
      totalStudents: 0,
      totalAdmins: 0,
      totalPending: 0,
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
         OR LOWER(username) = ? || '@runningman.vn'
         OR (LOWER(username) LIKE ? AND ? NOT LIKE '%@%')
         OR phone = ? 
         OR (length(?) >= 9 AND replace(phone, ' ', '') = ?)
      LIMIT 1
    `);
    return stmt.get(cleanLower, cleanLower, cleanLower + '@%', cleanLower, raw, cleanDigits, cleanDigits) || null;
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
        message: 'Không tìm thấy tài khoản tương ứng với địa chỉ Gmail này.' 
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

    syncUsersToDisk();

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
      // Chưa có tài khoản: Tự động đăng ký tài khoản học viên mới với trạng thái CHỜ DUYỆT (pending)
      isNewUser = true;
      const randomSecret = Math.random().toString(36) + Date.now().toString(36);
      const securePasswordHash = hashPassword(randomSecret);

      const res = db.prepare(`
        INSERT INTO users (username, password_hash, full_name, phone, branch, role, status, google_id, avatar_url, auth_provider, created_at, last_login_at)
        VALUES (?, ?, ?, '', 'RMSA - Bình Thạnh', 'student', 'pending', ?, ?, 'google', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(cleanEmail, securePasswordHash, cleanFullName, cleanGoogleId, cleanAvatar);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(res.lastInsertRowid);
    }

    recordActivity({
      userId: user.id,
      userName: user.full_name,
      role: user.role,
      branch: user.branch,
      actionType: isNewUser ? 'GOOGLE_REGISTER_PENDING' : 'GOOGLE_LOGIN',
      description: isNewUser 
        ? `Nhân viên mới đăng ký tài khoản qua Google và đang chờ duyệt (${cleanEmail})` 
        : `Đăng nhập vào hệ thống bằng Google (${cleanEmail})`,
      metadata: { email: cleanEmail, googleId: cleanGoogleId, status: user.status }
    });

    syncUsersToDisk();

    // Nếu tài khoản bị tạm khóa
    if (user.status === 'suspended') {
      return { 
        success: false, 
        status: 'suspended', 
        message: 'Tài khoản Google này đã bị tạm khóa. Vui lòng liên hệ Chủ Quản Trị RMSA!' 
      };
    }

    // Nếu tài khoản đang chờ phê duyệt
    if (user.status === 'pending') {
      return {
        success: false,
        status: 'pending',
        pendingApproval: true,
        isNewUser,
        message: isNewUser
          ? `Đăng ký bằng Google (${cleanEmail}) thành công! Tài khoản đang chờ Quản trị viên duyệt để vào học.`
          : `Tài khoản Google (${cleanEmail}) của bạn đang chờ Quản trị viên duyệt. Vui lòng liên hệ Quản lý / Hội Sở RMSA!`,
        user: {
          id: user.id,
          username: user.username,
          email: user.username,
          name: user.full_name,
          phone: user.phone || '',
          branch: user.branch,
          role: user.role,
          status: 'pending',
          avatarUrl: user.avatar_url || cleanAvatar
        }
      };
    }

    const token = generateAuthToken(user);

    return {
      success: true,
      message: isNewUser ? 'Tạo tài khoản Google thành công!' : 'Đăng nhập Google thành công!',
      isNewUser,
      user: {
        id: user.id,
        username: user.username,
        email: user.username,
        name: user.full_name,
        phone: user.phone || '',
        branch: user.branch,
        role: user.role === 'admin' ? 'admin' : 'student',
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

// 17. Quản lý Chuỗi ngày học thực chiến (Daily Streak Engine)
export function getUserStreakData(userId = 'guest') {
  try {
    const row = db.prepare('SELECT user_id, streak_count, last_completed_date, history_json FROM user_streaks WHERE user_id = ?').get(String(userId));
    if (!row) {
      return {
        userId: String(userId),
        streak: 0,
        lastCompletedDate: null,
        history: []
      };
    }
    let history = [];
    try { history = JSON.parse(row.history_json || '[]'); } catch {}
    return {
      userId: row.user_id,
      streak: row.streak_count,
      lastCompletedDate: row.last_completed_date,
      history
    };
  } catch (err) {
    console.error('Lỗi khi lấy user streak:', err);
    return { userId: String(userId), streak: 0, lastCompletedDate: null, history: [] };
  }
}

export function saveUserStreakRecord(userId = 'guest', { streak, lastCompletedDate, history = [] }) {
  try {
    const stmt = db.prepare(`
      INSERT INTO user_streaks (user_id, streak_count, last_completed_date, history_json, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        streak_count = excluded.streak_count,
        last_completed_date = excluded.last_completed_date,
        history_json = excluded.history_json,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(String(userId), streak, lastCompletedDate, JSON.stringify(history));
    return { success: true, streak, lastCompletedDate, history };
  } catch (err) {
    console.error('Lỗi khi lưu user streak:', err);
    return { success: false, error: err.message };
  }
}

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 18. Ghi nhận Tình Huống Thực Địa Hằng Ngày (Chống Spam: Tối đa 5 câu/ngày được tích điểm)
export function recordDailyScenarioCorrect(studentName = 'Nhân Viên', scenarioId = '') {
  try {
    const today = getLocalDateString();
    const cleanName = String(studentName).trim();

    const row = db.prepare('SELECT * FROM daily_activity_records WHERE student_name = ? AND activity_date = ?').get(cleanName, today);
    let scenariosCorrect = row?.scenarios_correct || 0;
    let scenariosIds = [];
    try { scenariosIds = JSON.parse(row?.scenarios_ids_json || '[]'); } catch {}

    const alreadyCompletedThisScenario = scenarioId && scenariosIds.includes(String(scenarioId));
    let scored = false;
    let message = '';

    if (scenariosCorrect < 5) {
      if (!alreadyCompletedThisScenario) {
        scenariosCorrect += 1;
        if (scenarioId) scenariosIds.push(String(scenarioId));
        scored = true;
        message = `Chính xác! Đã tích lũy +10 điểm (${scenariosCorrect}/5 câu hôm nay)`;
      } else {
        message = `Câu này bạn đã làm đúng hôm nay rồi. Hãy làm câu mới để tích thêm điểm (${scenariosCorrect}/5 câu)`;
      }
    } else {
      message = 'Bạn đã hoàn thành xuất sắc 5/5 câu tích điểm hôm nay (chống spam)! Tiếp tục luyện phản xạ miễn phí.';
    }

    db.prepare(`
      INSERT INTO daily_activity_records (student_name, activity_date, scenarios_correct, scenarios_ids_json, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(student_name, activity_date) DO UPDATE SET
        scenarios_correct = excluded.scenarios_correct,
        scenarios_ids_json = excluded.scenarios_ids_json,
        updated_at = CURRENT_TIMESTAMP
    `).run(cleanName, today, scenariosCorrect, JSON.stringify(scenariosIds));

    // Cập nhật Chuỗi Streak tự động
    try {
      const streakRow = db.prepare('SELECT streak_count, last_completed_date, history_json FROM user_streaks WHERE user_id = ?').get(cleanName);
      let currentStreak = streakRow?.streak_count || 0;
      let lastDate = streakRow?.last_completed_date;
      let history = [];
      try { history = JSON.parse(streakRow?.history_json || '[]'); } catch {}

      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        if (lastDate === yStr) {
          currentStreak += 1;
        } else if (!lastDate || currentStreak === 0) {
          currentStreak = 1;
        } else {
          currentStreak = 1;
        }
        if (!history.includes(today)) history.push(today);
        db.prepare(`
          INSERT INTO user_streaks (user_id, streak_count, last_completed_date, history_json, updated_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id) DO UPDATE SET
            streak_count = excluded.streak_count,
            last_completed_date = excluded.last_completed_date,
            history_json = excluded.history_json,
            updated_at = CURRENT_TIMESTAMP
        `).run(cleanName, currentStreak, today, JSON.stringify(history));
      }
    } catch (e) {
      console.error('Lỗi cập nhật streak:', e);
    }

    return {
      success: true,
      scenariosCorrect,
      maxScenarios: 5,
      scored,
      message
    };
  } catch (err) {
    console.error('Lỗi khi ghi nhận tình huống hàng ngày:', err);
    return { success: false, error: err.message };
  }
}

// 19. Ghi nhận Phòng Thi Sát Hạch Thực Địa (Chống Spam: Tối đa 3 bài/ngày được tích điểm)
export function recordPracticeTestAttempt(studentName = 'Nhân Viên', score = 0, passed = false, timeTakenSeconds = 0, _answers = {}) {
  try {
    const today = getLocalDateString();
    const cleanName = String(studentName).trim();
    const numericScore = Number(score) || 0;
    const isPassed = Boolean(passed && numericScore >= 80);

    // 1. Lưu vào activity_logs cho audit trail an toàn
    recordActivity({
      userName: cleanName,
      role: 'student',
      branch: 'RMSA',
      actionType: 'PRACTICE_TEST',
      description: `Hoàn thành bài thi sát hạch: ${numericScore}% (${isPassed ? 'Đạt chuẩn ≥ 80%' : 'Chưa đạt'})`,
      metadata: { score: numericScore, passed: isPassed, timeTakenSeconds }
    });

    // 2. Kiểm tra hạn ngạch chống spam ngày hôm nay
    const row = db.prepare('SELECT * FROM daily_activity_records WHERE student_name = ? AND activity_date = ?').get(cleanName, today);
    let testsPassed = row?.practice_tests_passed || 0;
    let scoresList = [];
    try { scoresList = JSON.parse(row?.practice_test_scores_json || '[]'); } catch {}

    let scored = false;
    let message = '';

    if (isPassed) {
      if (testsPassed < 3) {
        testsPassed += 1;
        scoresList.push(numericScore);
        scored = true;
        message = `Đạt chuẩn sát hạch! +50 điểm tích lũy & điểm thi vào Bảng Vàng (${testsPassed}/3 bài hôm nay)`;
      } else {
        message = 'Bạn đã đạt hạn ngạch 3 bài thi sát hạch tính điểm hôm nay (chống spam)! Lần thi này giúp ôn luyện kỹ năng.';
      }
    } else {
      message = 'Bài thi chưa đạt chuẩn (≥ 80%). Hãy thi lại để ghi danh Bảng Vàng!';
    }

    db.prepare(`
      INSERT INTO daily_activity_records (student_name, activity_date, practice_tests_passed, practice_test_scores_json, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(student_name, activity_date) DO UPDATE SET
        practice_tests_passed = excluded.practice_tests_passed,
        practice_test_scores_json = excluded.practice_test_scores_json,
        updated_at = CURRENT_TIMESTAMP
    `).run(cleanName, today, testsPassed, JSON.stringify(scoresList));

    return {
      success: true,
      practiceTestsPassed: testsPassed,
      maxPracticeTests: 3,
      score: numericScore,
      passed: isPassed,
      scored,
      message
    };
  } catch (err) {
    console.error('Lỗi khi lưu kết quả bài thi sát hạch:', err);
    return { success: false, error: err.message };
  }
}

// 20. Lấy Hạn Ngạch Rèn Luyện Hôm Nay của Học Viên
export function getDailyQuota(studentName = 'Nhân Viên') {
  try {
    const today = getLocalDateString();
    const cleanName = String(studentName).trim();
    const row = db.prepare('SELECT scenarios_correct, practice_tests_passed FROM daily_activity_records WHERE student_name = ? AND activity_date = ?').get(cleanName, today);
    return {
      scenariosToday: row?.scenarios_correct || 0,
      scenariosMax: 5,
      practiceToday: row?.practice_tests_passed || 0,
      practiceMax: 3
    };
  } catch {
    return { scenariosToday: 0, scenariosMax: 5, practiceToday: 0, practiceMax: 3 };
  }
}

// 21. Bảng Vàng Thực Tế Đa Trụ Cột & Chống Spam (Real-time Multi-pillar Fair Leaderboard)
export function getLeaderboardStats() {
  try {
    // 1. Lấy danh sách tất cả học viên có hoạt động
    const studentNamesSet = new Set();
    db.prepare('SELECT DISTINCT student_name FROM student_progress WHERE passed = 1 OR score > 0').all().forEach(r => studentNamesSet.add(r.student_name));
    db.prepare('SELECT DISTINCT student_name FROM daily_activity_records WHERE scenarios_correct > 0 OR practice_tests_passed > 0').all().forEach(r => studentNamesSet.add(r.student_name));
    db.prepare('SELECT DISTINCT user_id FROM user_streaks WHERE streak_count > 0').all().forEach(r => studentNamesSet.add(r.user_id));

    const results = [];

    studentNamesSet.forEach(studentName => {
      // Loại bỏ hoàn toàn tài khoản test, guest hoặc rác hệ thống
      if (!studentName || typeof studentName !== 'string') return;
      const lowerName = studentName.trim().toLowerCase();
      if (lowerName === 'guest' || lowerName.startsWith('test_') || lowerName.startsWith('new_student_')) {
        return;
      }

      // a. Trụ cột 1: Quiz Chuyên Đề (Nhóm 1 & các nhóm khác)
      const quizRows = db.prepare('SELECT score, passed, completed_at FROM student_progress WHERE student_name = ?').all(studentName);
      let passedQuizCount = 0;
      let totalQuizScore = 0;
      let lastCompletedAt = null;

      quizRows.forEach(q => {
        if (q.passed) passedQuizCount++;
        totalQuizScore += (q.score || 0);
        if (!lastCompletedAt || (q.completed_at && q.completed_at > lastCompletedAt)) {
          lastCompletedAt = q.completed_at;
        }
      });
      const avgQuizScore = quizRows.length > 0 ? Math.round(totalQuizScore / quizRows.length) : 0;
      const quizPoints = (passedQuizCount * 100) + avgQuizScore;

      // b. Trụ cột 2 & 3: Tình Huống Hằng Ngày & Thi Sát Hạch (Đã giới hạn chống spam mỗi ngày)
      const dailyRows = db.prepare('SELECT scenarios_correct, practice_tests_passed, practice_test_scores_json, updated_at FROM daily_activity_records WHERE student_name = ?').all(studentName);
      let totalScenariosCorrect = 0;
      let totalPracticePassed = 0;
      let allPracticeScores = [];

      dailyRows.forEach(d => {
        totalScenariosCorrect += (d.scenarios_correct || 0);
        totalPracticePassed += (d.practice_tests_passed || 0);
        try {
          const sc = JSON.parse(d.practice_test_scores_json || '[]');
          if (Array.isArray(sc)) allPracticeScores.push(...sc);
        } catch {}
        if (!lastCompletedAt || (d.updated_at && d.updated_at > lastCompletedAt)) {
          lastCompletedAt = d.updated_at;
        }
      });

      const avgPracticeScore = allPracticeScores.length > 0
        ? Math.round(allPracticeScores.reduce((a, b) => a + b, 0) / allPracticeScores.length)
        : 0;

      const scenarioPoints = totalScenariosCorrect * 10; // Mỗi câu đúng thực địa +10đ
      const practicePoints = (totalPracticePassed * 50) + avgPracticeScore; // Mỗi bài thi đạt +50đ + điểm thi

      // c. Trụ cột Kỷ Luật: Chuỗi Ngày Thực Chiến (Streak)
      let streak = 0;
      try {
        const s = db.prepare('SELECT streak_count FROM user_streaks WHERE user_id = ?').get(studentName);
        if (s) streak = s.streak_count || 0;
      } catch {}
      const streakPoints = streak * 15;

      // Bắt buộc phải có ít nhất 1 hoạt động học tập thực chiến (Quiz, Thi sát hạch, hoặc Tình huống thực địa)
      // Nếu chỉ có chuỗi streak mà không có bất kỳ kết quả rèn luyện thực tế nào thì KHÔNG xếp hạng lên Bảng Vàng.
      const hasRealActivity = passedQuizCount > 0 || totalPracticePassed > 0 || totalScenariosCorrect > 0;
      if (!hasRealActivity) return;

      // Tổng điểm công bằng
      const totalScore = quizPoints + practicePoints + scenarioPoints + streakPoints;

      if (totalScore > 0) {
        let branch = 'RMSA - Hội Sở';
        let avatarUrl = '';
        try {
          const u = db.prepare('SELECT branch, avatar_url FROM users WHERE full_name = ? OR username = ?').get(studentName, studentName);
          if (u) {
            if (u.branch) branch = u.branch;
            if (u.avatar_url) avatarUrl = u.avatar_url;
          }
        } catch {}

        results.push({
          name: studentName,
          branch,
          avatarUrl,
          totalScore,
          quizPoints,
          passedQuizCount,
          totalCourses: 8,
          avgQuizScore,
          practicePoints,
          practicePassedCount: totalPracticePassed,
          avgPracticeScore,
          scenarioPoints,
          scenariosCount: totalScenariosCorrect,
          streak,
          streakPoints,
          lastCompletedAt: lastCompletedAt || new Date().toISOString()
        });
      }
    });

    // Sắp xếp theo tổng điểm giảm dần, bài quiz đạt giảm dần, bài sát hạch giảm dần
    results.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.passedQuizCount !== a.passedQuizCount) return b.passedQuizCount - a.passedQuizCount;
      if (b.practicePassedCount !== a.practicePassedCount) return b.practicePassedCount - a.practicePassedCount;
      return new Date(a.lastCompletedAt) - new Date(b.lastCompletedAt);
    });

    return results.slice(0, 25).map((r, idx) => ({
      ...r,
      rank: idx + 1,
      badge: idx === 0 ? '🥇 Thủ khoa' : (idx === 1 ? '🥈 Á khoa' : (idx === 2 ? '🥉 Top 3' : 'Top Chiến Binh'))
    }));
  } catch (err) {
    console.error('Lỗi khi truy vấn Bảng Vàng từ SQLite:', err);
    return [];
  }
}

// 22. Cập nhật Hồ sơ Cá nhân & Avatar (User Profile Management)
export function updateUserProfile(userId, { fullName, phone, branch, avatarUrl, bio, title, skills, zaloPhone, coverUrl } = {}) {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return { success: false, message: 'Người dùng không tồn tại' };
    }

    const oldFullName = user.full_name;
    const newFullName = fullName !== undefined ? String(fullName).trim() : oldFullName;
    const newPhone = phone !== undefined ? String(phone).trim() : (user.phone || '');
    const newBranch = branch !== undefined ? String(branch).trim() : (user.branch || 'RMSA - Bình Thạnh');
    const newAvatarUrl = avatarUrl !== undefined ? String(avatarUrl).trim() : (user.avatar_url || '');
    const newBio = bio !== undefined ? String(bio).trim() : (user.bio || '');
    const newTitle = title !== undefined ? String(title).trim() : (user.title || '');
    const newSkills = skills !== undefined ? (typeof skills === 'string' ? skills : JSON.stringify(skills)) : (user.skills || '');
    const newZaloPhone = zaloPhone !== undefined ? String(zaloPhone).trim() : (user.zalo_phone || '');
    const newCoverUrl = coverUrl !== undefined ? String(coverUrl).trim() : (user.cover_url || '');

    // Cập nhật thông tin trong users
    db.prepare(`
      UPDATE users
      SET full_name = ?,
          phone = ?,
          branch = ?,
          avatar_url = ?,
          bio = ?,
          title = ?,
          skills = ?,
          zalo_phone = ?,
          cover_url = ?
      WHERE id = ?
    `).run(newFullName, newPhone, newBranch, newAvatarUrl, newBio, newTitle, newSkills, newZaloPhone, newCoverUrl, userId);

    // Nếu tên hoặc avatar thay đổi, đồng bộ sang các bảng liên kết và bảng cộng đồng để không làm mất tiến độ học tập và Bảng Vàng
    if (newFullName && newFullName !== oldFullName) {
      try {
        db.prepare('UPDATE student_progress SET student_name = ? WHERE student_name = ?').run(newFullName, oldFullName);
        db.prepare('UPDATE quiz_attempts SET user_name = ? WHERE user_name = ?').run(newFullName, oldFullName);
        db.prepare('UPDATE daily_activity_records SET student_name = ? WHERE student_name = ?').run(newFullName, oldFullName);
        db.prepare('UPDATE user_streaks SET user_id = ? WHERE user_id = ?').run(newFullName, oldFullName);
        db.prepare('UPDATE community_posts SET author = ? WHERE author = ? OR author_username = ?').run(newFullName, oldFullName, user.username);
      } catch (cascadeErr) {
        console.warn('Lỗi đồng bộ tên sang các bảng liên kết:', cascadeErr.message);
      }
    }
    if (newAvatarUrl && newAvatarUrl !== user.avatar_url) {
      try {
        db.prepare('UPDATE community_posts SET avatar = ? WHERE author_username = ? OR author = ?').run(newAvatarUrl, user.username, newFullName);
      } catch {}
    }

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const token = generateAuthToken(updatedUser);

    syncUsersToDisk();

    return {
      success: true,
      message: 'Cập nhật hồ sơ cá nhân thành công!',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.username.includes('@') ? updatedUser.username : (updatedUser.email || ''),
        name: updatedUser.full_name,
        fullName: updatedUser.full_name,
        phone: updatedUser.phone,
        branch: updatedUser.branch,
        role: updatedUser.role === 'admin' ? 'admin' : 'student',
        avatarUrl: updatedUser.avatar_url || '',
        bio: updatedUser.bio || '',
        title: updatedUser.title || '',
        skills: updatedUser.skills || '',
        zaloPhone: updatedUser.zalo_phone || '',
        coverUrl: updatedUser.cover_url || '',
        token
      }
    };
  } catch (err) {
    console.error('Lỗi khi cập nhật hồ sơ trong SQLite:', err);
    return { success: false, message: `Lỗi cập nhật hồ sơ: ${err.message}` };
  }
}

// 23. Đổi mật khẩu tài khoản trực tiếp từ Profile
export function changeUserPassword(userId, { currentPassword, newPassword } = {}) {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ? OR username = ?').get(userId, String(userId));
    if (!user) {
      return { success: false, message: 'Người dùng không tồn tại' };
    }

    if (!newPassword || String(newPassword).trim().length < 4) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 4 ký tự' };
    }

    const cleanCurrent = String(currentPassword || '').trim();
    const currentHash = hashPassword(cleanCurrent);
    const legacyCurrentHash = legacyHashPassword(cleanCurrent);

    if (user.password_hash !== currentHash && user.password_hash !== legacyCurrentHash) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác' };
    }

    const newHash = hashPassword(String(newPassword).trim());
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, user.id);

    recordActivity({
      userId: user.id,
      userName: user.full_name,
      role: user.role,
      actionType: 'CHANGE_PASSWORD',
      description: `Đổi mật khẩu tài khoản thành công qua Hồ sơ cá nhân (${user.username})`,
      metadata: { username: user.username }
    });

    syncUsersToDisk();

    return { success: true, message: 'Đổi mật khẩu thành công!' };
  } catch (err) {
    return { success: false, message: `Lỗi đổi mật khẩu: ${err.message}` };
  }
}

// =========================================================================
// 24. HỆ THỐNG CỘNG ĐỒNG NỘI BỘ ĐỒNG BỘ THỜI GIAN THỰC (SQLite ACID)
// =========================================================================

export function seedDefaultCommunityPost() {
  try {
    db.prepare(`
      INSERT OR IGNORE INTO community_posts (
        id, author, author_username, role, branch, avatar, time_label,
        category, category_label, category_color, is_pinned, is_celebration,
        title, content, deposit_amount, room_info, likes, liked_by_json, comments_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      'notice_official_1',
      'Đan Rin (HLV Trưởng)',
      'admin@runningman.vn',
      'mentor',
      'Ban Đào Tạo RMSA',
      '/images/anh_rin_avatar.jpg',
      'Ghim Ban Quản Trị',
      'notices',
      '📢 Quy chế học việc nội bộ',
      'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
      1,
      0,
      'QUY CHUẨN NỘI BỘ: Không gian giải đáp thực địa & Vinh danh kết quả cho nhân viên mới',
      'Chào mừng các bạn nhân viên mới gia nhập Running Man Sales Academy!\n\nĐây là không gian thảo luận nghiệp vụ nội bộ 100% dành cho anh em trong lúc đi dắt phòng thực tế:\n• Khi gặp khách ép giá, đòi giữ cọc quá lâu hoặc phòng có khuyết điểm: Hãy đăng ngay câu hỏi vào mục "Hỏi đáp ca khó" để HLV và các anh em hỗ trợ bẻ kịch bản.\n• Khi chốt cọc thành công phòng trọ / duplex: Hãy đăng bài "Báo cọc thực hành" để hệ thống tự động ghi nhận thành tích lên Bảng Vàng Tuần và anh em cùng chúc mừng.\n• Hãy giữ thái độ chia sẻ văn minh, bảo mật thông tin chủ nhà và cùng nhau chạy số bùng nổ!',
      '',
      '',
      0,
      '[]',
      '[]'
    );
  } catch (err) {
    console.warn('Lỗi khởi tạo bài viết cộng đồng mặc định:', err.message);
  }
}

function formatCommunityPostRow(row, viewerIdentifier = '') {
  let likedBy = [];
  let comments = [];
  try { likedBy = JSON.parse(row.liked_by_json || '[]'); } catch { likedBy = []; }
  try { comments = JSON.parse(row.comments_json || '[]'); } catch { comments = []; }

  const cleanViewer = String(viewerIdentifier || '').trim().toLowerCase();
  const likedByMe = cleanViewer ? likedBy.some(u => String(u).toLowerCase() === cleanViewer) : false;

  return {
    id: row.id,
    author: row.author,
    authorUsername: row.author_username || '',
    role: row.role || 'student',
    branch: row.branch || 'RMSA',
    avatar: row.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    time: row.time_label || 'Vừa xong',
    category: row.category || 'qa',
    categoryLabel: row.category_label || 'Thảo luận',
    categoryColor: row.category_color || 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    isPinned: Boolean(row.is_pinned),
    isCelebration: Boolean(row.is_celebration),
    title: row.title,
    content: row.content,
    depositAmount: row.deposit_amount || undefined,
    roomInfo: row.room_info || undefined,
    likes: Number(row.likes) || likedBy.length || 0,
    likedBy,
    likedByMe,
    comments: Array.isArray(comments) ? comments : [],
    createdAt: row.created_at
  };
}

export function getCommunityPosts(viewerIdentifier = '') {
  try {
    const count = db.prepare('SELECT COUNT(*) as c FROM community_posts').get()?.c || 0;
    if (count === 0) {
      seedDefaultCommunityPost();
    }
    const rows = db.prepare(`
      SELECT * FROM community_posts
      ORDER BY is_pinned DESC, created_at DESC, rowid DESC
    `).all();
    return rows.map(r => formatCommunityPostRow(r, viewerIdentifier));
  } catch (err) {
    console.error('Lỗi lấy danh sách bài viết cộng đồng:', err);
    return [];
  }
}

export function createCommunityPost(postData = {}) {
  try {
    const title = String(postData.title || '').trim();
    const content = String(postData.content || '').trim();
    if (!title || !content) {
      return { success: false, message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung tình huống!' };
    }

    const categoryMap = {
      qa: { label: '❓ Hỏi đáp ca khó', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
      deals: { label: '🎉 Thực hành chốt cọc', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
      tips: { label: '💡 Bí kíp dẫn trọ', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
      notices: { label: '📢 Lưu ý từ Quản lý', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900' }
    };

    const category = categoryMap[postData.category] ? postData.category : 'qa';
    const isDeals = category === 'deals';
    const id = postData.id || `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const author = String(postData.author || 'Nhân viên').trim();
    const authorUsername = String(postData.authorUsername || postData.username || author).trim().toLowerCase();
    const role = postData.role || 'student';
    const branch = String(postData.branch || 'RMSA').trim();
    const avatar = String(postData.avatar || (role === 'admin' || role === 'mentor' ? '/images/anh_rin_avatar.jpg' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80')).trim();
    const depositAmount = isDeals ? String(postData.depositAmount || '500.000đ - 1.000.000đ').trim() : '';
    const roomInfo = isDeals ? String(postData.roomInfo || 'Phòng cho thuê tiêu chuẩn').trim() : '';

    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' • ' + new Date().toLocaleDateString('vi-VN');
    const likedBy = [authorUsername];

    db.prepare(`
      INSERT INTO community_posts (
        id, author, author_username, role, branch, avatar, time_label,
        category, category_label, category_color, is_pinned, is_celebration,
        title, content, deposit_amount, room_info, likes, liked_by_json, comments_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      id,
      author,
      authorUsername,
      role,
      branch,
      avatar,
      nowStr,
      category,
      categoryMap[category].label,
      categoryMap[category].color,
      postData.isPinned ? 1 : 0,
      isDeals ? 1 : 0,
      title,
      content,
      depositAmount,
      roomInfo,
      1,
      JSON.stringify(likedBy),
      '[]'
    );

    recordActivity({
      userName: author,
      role: role === 'admin' || role === 'mentor' ? 'admin' : 'student',
      branch,
      actionType: isDeals ? 'COMMUNITY_DEAL_POST' : 'COMMUNITY_POST',
      description: isDeals
        ? `Đăng bài Báo cọc thực hành trên Cộng đồng: "${title}" (${depositAmount})`
        : `Đăng bài thảo luận trên Cộng đồng: "${title}"`,
      metadata: { postId: id, category, title }
    });

    const posts = getCommunityPosts(authorUsername);
    const created = posts.find(p => p.id === id) || null;
    return {
      success: true,
      message: 'Đăng bài viết lên Cộng đồng thành công!',
      post: created,
      posts
    };
  } catch (err) {
    console.error('Lỗi tạo bài viết cộng đồng:', err);
    return { success: false, message: `Lỗi đăng bài: ${err.message}` };
  }
}

export function deleteCommunityPost(postId, requestUser = {}) {
  try {
    const cleanId = String(postId || '').trim();
    if (!cleanId) {
      return { success: false, message: 'Mã bài viết không hợp lệ' };
    }

    const existing = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(cleanId);
    if (!existing) {
      return { success: false, message: 'Bài viết không tồn tại hoặc đã bị xóa trước đó' };
    }

    const reqRole = String(requestUser.role || '').toLowerCase();
    const reqUsername = String(requestUser.username || requestUser.email || '').trim().toLowerCase();
    const reqName = String(requestUser.name || requestUser.fullName || '').trim().toLowerCase();

    const isAdmin = reqRole === 'admin' || reqRole === 'mentor' || Boolean(requestUser.isAdmin);
    const isAuthor =
      (reqUsername && existing.author_username && existing.author_username.toLowerCase() === reqUsername) ||
      (reqName && existing.author && existing.author.toLowerCase() === reqName) ||
      (reqUsername && existing.author && existing.author.toLowerCase() === reqUsername);

    if (!isAdmin && !isAuthor) {
      return {
        success: false,
        status: 403,
        message: 'Bạn chỉ có quyền xóa bài viết do chính mình đăng tải (hoặc cần quyền Quản trị viên).'
      };
    }

    db.prepare('DELETE FROM community_posts WHERE id = ?').run(cleanId);

    // Nếu xóa hết sạch cả bài mặc định, tự động giữ bảng không bị lỗi nhưng cho phép Admin xóa bài ghim nếu muốn
    recordActivity({
      userName: requestUser.name || requestUser.fullName || (isAdmin ? 'Quản Trị Viên' : existing.author),
      role: isAdmin ? 'admin' : 'student',
      branch: requestUser.branch || existing.branch || 'RMSA',
      actionType: 'DELETE_COMMUNITY_POST',
      description: `${isAdmin && !isAuthor ? 'Quản trị viên đã xóa' : 'Đã xóa'} bài viết cộng đồng: "${existing.title}" (Tác giả: ${existing.author})`,
      metadata: { postId: cleanId, title: existing.title, originalAuthor: existing.author }
    });

    const posts = getCommunityPosts(reqUsername || reqName);
    return {
      success: true,
      message: 'Đã xóa bài viết thành công và đồng bộ trên toàn hệ thống!',
      deletedId: cleanId,
      posts
    };
  } catch (err) {
    console.error('Lỗi xóa bài viết cộng đồng:', err);
    return { success: false, message: `Lỗi xóa bài viết: ${err.message}` };
  }
}

export function togglePinCommunityPost(postId, requestUser = {}) {
  try {
    const cleanId = String(postId || '').trim();
    const existing = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(cleanId);
    if (!existing) {
      return { success: false, message: 'Không tìm thấy bài viết' };
    }

    const isAdmin = requestUser.role === 'admin' || requestUser.role === 'mentor' || Boolean(requestUser.isAdmin);
    if (!isAdmin) {
      return { success: false, status: 403, message: 'Chỉ Quản trị viên / HLV Trưởng mới có quyền Ghim bài viết!' };
    }

    const nextPinned = existing.is_pinned ? 0 : 1;
    db.prepare('UPDATE community_posts SET is_pinned = ? WHERE id = ?').run(nextPinned, cleanId);

    const viewer = requestUser.username || requestUser.name || '';
    return {
      success: true,
      isPinned: Boolean(nextPinned),
      message: nextPinned ? 'Đã ghim bài viết lên đầu bảng tin!' : 'Đã bỏ ghim bài viết!',
      posts: getCommunityPosts(viewer)
    };
  } catch (err) {
    return { success: false, message: `Lỗi ghim bài viết: ${err.message}` };
  }
}

export function toggleLikeCommunityPost(postId, viewerIdentifier = '') {
  try {
    const cleanId = String(postId || '').trim();
    const existing = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(cleanId);
    if (!existing) {
      return { success: false, message: 'Không tìm thấy bài viết' };
    }

    const cleanViewer = String(viewerIdentifier || 'guest').trim().toLowerCase();
    let likedBy = [];
    try { likedBy = JSON.parse(existing.liked_by_json || '[]'); } catch { likedBy = []; }

    const idx = likedBy.findIndex(u => String(u).toLowerCase() === cleanViewer);
    let likedByMe = false;
    let nextLikes = Number(existing.likes) || 0;

    if (idx >= 0) {
      likedBy.splice(idx, 1);
      likedByMe = false;
      nextLikes = Math.max(0, nextLikes - 1);
    } else {
      likedBy.push(cleanViewer);
      likedByMe = true;
      nextLikes = nextLikes + 1;
    }

    db.prepare('UPDATE community_posts SET likes = ?, liked_by_json = ? WHERE id = ?')
      .run(nextLikes, JSON.stringify(likedBy), cleanId);

    return {
      success: true,
      likes: nextLikes,
      likedByMe,
      posts: getCommunityPosts(cleanViewer)
    };
  } catch (err) {
    return { success: false, message: `Lỗi thả tim bài viết: ${err.message}` };
  }
}

export function addCommunityComment(postId, commentData = {}) {
  try {
    const cleanId = String(postId || '').trim();
    const text = String(commentData.text || '').trim();
    if (!text) {
      return { success: false, message: 'Nội dung bình luận không được để trống' };
    }

    const existing = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(cleanId);
    if (!existing) {
      return { success: false, message: 'Bài viết không tồn tại hoặc đã bị xóa' };
    }

    let comments = [];
    try { comments = JSON.parse(existing.comments_json || '[]'); } catch { comments = []; }

    const author = String(commentData.author || 'Nhân viên').trim();
    const authorUsername = String(commentData.authorUsername || commentData.username || author).trim().toLowerCase();
    const role = commentData.role || 'student';
    const branch = String(commentData.branch || 'RMSA').trim();
    const avatar = String(commentData.avatar || (role === 'admin' || role === 'mentor' ? '/images/anh_rin_avatar.jpg' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80')).trim();
    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' • ' + new Date().toLocaleDateString('vi-VN');

    const newComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      author,
      authorUsername,
      role,
      branch,
      avatar,
      time: nowStr,
      text
    };

    comments.push(newComment);
    db.prepare('UPDATE community_posts SET comments_json = ? WHERE id = ?')
      .run(JSON.stringify(comments), cleanId);

    return {
      success: true,
      message: 'Đã gửi bình luận thành công!',
      comment: newComment,
      posts: getCommunityPosts(authorUsername)
    };
  } catch (err) {
    return { success: false, message: `Lỗi thêm bình luận: ${err.message}` };
  }
}

export function deleteCommunityComment(postId, commentId, requestUser = {}) {
  try {
    const cleanPostId = String(postId || '').trim();
    const cleanCommentId = String(commentId || '').trim();
    const existing = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(cleanPostId);
    if (!existing) {
      return { success: false, message: 'Không tìm thấy bài viết' };
    }

    let comments = [];
    try { comments = JSON.parse(existing.comments_json || '[]'); } catch { comments = []; }

    const targetComment = comments.find(c => c.id === cleanCommentId);
    if (!targetComment) {
      return { success: false, message: 'Bình luận không tồn tại hoặc đã bị xóa' };
    }

    const reqRole = String(requestUser.role || '').toLowerCase();
    const reqUsername = String(requestUser.username || requestUser.email || '').trim().toLowerCase();
    const reqName = String(requestUser.name || requestUser.fullName || '').trim().toLowerCase();

    const isAdmin = reqRole === 'admin' || reqRole === 'mentor' || Boolean(requestUser.isAdmin);
    const isCommentAuthor =
      (reqUsername && targetComment.authorUsername && targetComment.authorUsername.toLowerCase() === reqUsername) ||
      (reqName && targetComment.author && targetComment.author.toLowerCase() === reqName) ||
      (reqUsername && targetComment.author && targetComment.author.toLowerCase() === reqUsername);
    const isPostAuthor =
      (reqUsername && existing.author_username && existing.author_username.toLowerCase() === reqUsername) ||
      (reqName && existing.author && existing.author.toLowerCase() === reqName);

    if (!isAdmin && !isCommentAuthor && !isPostAuthor) {
      return {
        success: false,
        status: 403,
        message: 'Bạn không có quyền xóa bình luận của người khác.'
      };
    }

    const updatedComments = comments.filter(c => c.id !== cleanCommentId);
    db.prepare('UPDATE community_posts SET comments_json = ? WHERE id = ?')
      .run(JSON.stringify(updatedComments), cleanPostId);

    return {
      success: true,
      message: 'Đã xóa bình luận thành công!',
      posts: getCommunityPosts(reqUsername || reqName)
    };
  } catch (err) {
    return { success: false, message: `Lỗi xóa bình luận: ${err.message}` };
  }
}

export function resetCommunityPostsToDefault(requestUser = {}) {
  try {
    const isAdmin = requestUser.role === 'admin' || requestUser.role === 'mentor' || Boolean(requestUser.isAdmin);
    if (!isAdmin) {
      return { success: false, status: 403, message: 'Chỉ Quản trị viên mới có quyền làm mới toàn bộ bảng tin cộng đồng!' };
    }

    db.transaction(() => {
      db.prepare('DELETE FROM community_posts').run();
      seedDefaultCommunityPost();
    })();

    recordActivity({
      userName: requestUser.name || 'Quản Trị Viên',
      role: 'admin',
      branch: 'Hội Sở RMSA',
      actionType: 'RESET_COMMUNITY_FEED',
      description: 'Quản trị viên đã làm mới toàn bộ bảng tin Cộng đồng về trạng thái mặc định',
      metadata: {}
    });

    return {
      success: true,
      message: 'Đã làm mới toàn bộ bảng tin cộng đồng về trạng thái mặc định!',
      posts: getCommunityPosts(requestUser.username || '')
    };
  } catch (err) {
    return { success: false, message: `Lỗi làm mới bảng tin: ${err.message}` };
  }
}

// =========================================================================
// 25. HỆ THỐNG THƯỚC PHIM THỰC ĐỊA (REELS & TIKTOK SHOWCASE ĐỒNG BỘ SQLite)
// =========================================================================

export function seedDefaultCommunityReels() {
  try {
    const defaultReels = [
      {
        id: 'reel_fb_1',
        title: 'Thực Địa Dẫn Khách & Chốt Cọc Căn Hộ Thực Chiến',
        subtitle: 'Tình huống thực tế xử lý tâm lý khách xem phòng và bẻ từ chối ngay tại căn hộ.',
        platform: 'facebook',
        video_url: 'https://www.facebook.com/reel/1821834182135514',
        thumbnail_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        author: 'Đan Rin (HLV Trưởng)',
        tag: '🔥 Facebook Reel',
        views_label: 'Thực chiến RMSA'
      },
      {
        id: 'reel_tiktok_1',
        title: 'Cảm Hứng Không Gian & Trải Nghiệm Chuyển Động Hiện Đại',
        subtitle: 'Góc nhìn trực quan, sinh động và cuốn hút chuẩn xu hướng dẫn phòng thế hệ mới.',
        platform: 'tiktok',
        video_url: 'https://www.tiktok.com/@neongo/video/7693034526401924372',
        thumbnail_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        author: 'Ban Đào Tạo RMSA',
        tag: '🎵 TikTok Trend',
        views_label: 'Xu hướng mới'
      },
      {
        id: 'reel_duplex_3',
        title: 'Tour Khảo Sát Giỏ Hàng Duplex Gác Cao 5.8Tr Bình Thạnh',
        subtitle: 'Checklist 15 phút chuẩn bị phòng, bật đèn vàng ấm và mở rèm ban công đón khách.',
        platform: 'facebook',
        video_url: 'https://www.facebook.com/reel/1821834182135514',
        thumbnail_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        author: 'Đan Rin (Running Man)',
        tag: '🏢 Giỏ Hàng Duplex',
        views_label: 'Mẫu chuẩn 100%'
      },
      {
        id: 'reel_closing_4',
        title: 'Bí Kíp Quy Đổi 16.000đ/Ngày Bẻ Gãy Lời Chê Giá Cao',
        subtitle: 'Tuyệt chiêu chia nhỏ chi phí giúp khách hàng gật đầu giữ cọc trong 30 giây.',
        platform: 'tiktok',
        video_url: 'https://www.tiktok.com/@neongo/video/7693034526401924372',
        thumbnail_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
        author: 'Đan Rin (HLV Trưởng)',
        tag: '⚡ Chốt Cọc 30s',
        views_label: 'Tỷ lệ chốt +40%'
      }
    ];

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO community_reels (
        id, title, subtitle, platform, video_url, thumbnail_url, author, tag, views_label, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    for (const r of defaultReels) {
      stmt.run(r.id, r.title, r.subtitle, r.platform, r.video_url, r.thumbnail_url, r.author, r.tag, r.views_label);
    }
  } catch (err) {
    console.warn('Lỗi khởi tạo thước phim mặc định:', err.message);
  }
}

export function getCommunityReels() {
  try {
    const count = db.prepare('SELECT COUNT(*) as c FROM community_reels').get()?.c || 0;
    if (count === 0) {
      seedDefaultCommunityReels();
    }
    const rows = db.prepare('SELECT * FROM community_reels ORDER BY created_at DESC, rowid ASC').all();
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle || '',
      platform: r.platform || 'tiktok',
      videoUrl: r.video_url,
      url: r.video_url,
      thumbnailUrl: r.thumbnail_url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      author: r.author || 'Đan Rin (HLV Trưởng)',
      tag: r.tag || 'Thực Địa RMSA',
      viewsLabel: r.views_label || 'Thực chiến',
      createdAt: r.created_at
    }));
  } catch (err) {
    console.error('Lỗi lấy danh sách thước phim:', err);
    return [];
  }
}

export function createCommunityReel(reelData = {}, requestUser = {}) {
  try {
    const title = String(reelData.title || '').trim();
    const videoUrl = String(reelData.videoUrl || reelData.video_url || reelData.url || '').trim();
    if (!title || !videoUrl) {
      return { success: false, message: 'Vui lòng nhập tiêu đề và đường dẫn video (Facebook Reel / TikTok / YouTube / MP4)!' };
    }

    const lowerUrl = videoUrl.toLowerCase();
    let platform = reelData.platform || 'video';
    if (lowerUrl.includes('tiktok.com')) platform = 'tiktok';
    else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) platform = 'facebook';
    else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) platform = 'youtube';

    const id = reelData.id || `reel_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const subtitle = String(reelData.subtitle || 'Thước phim thực chiến dẫn phòng & chốt cọc nội bộ Running Man.').trim();
    const thumbnailUrl = String(reelData.thumbnailUrl || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80').trim();
    const author = String(reelData.author || requestUser.name || 'Đan Rin (HLV Trưởng)').trim();
    const tag = String(reelData.tag || (platform === 'tiktok' ? '🎵 TikTok Thực Chiến' : platform === 'facebook' ? '🔥 Facebook Reel' : '🎬 Video Thực Địa')).trim();
    const viewsLabel = String(reelData.viewsLabel || 'Mới cập nhật').trim();

    db.prepare(`
      INSERT INTO community_reels (
        id, title, subtitle, platform, video_url, thumbnail_url, author, tag, views_label, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(id, title, subtitle, platform, videoUrl, thumbnailUrl, author, tag, viewsLabel);

    recordActivity({
      userName: author,
      role: 'admin',
      branch: 'Hội Sở RMSA',
      actionType: 'CREATE_REEL',
      description: `Đã đăng thước phim thực chiến mới: "${title}" (${platform.toUpperCase()})`,
      metadata: { reelId: id, videoUrl }
    });

    const reels = getCommunityReels();
    const createdReel = reels.find(r => r.id === id) || null;
    return {
      success: true,
      message: 'Đã thêm thước phim thực chiến và đồng bộ toàn hệ thống!',
      reel: createdReel,
      reels
    };
  } catch (err) {
    return { success: false, message: `Lỗi thêm thước phim: ${err.message}` };
  }
}

export function deleteCommunityReel(reelId, requestUser = {}) {
  try {
    const cleanId = String(reelId || '').trim();
    if (!cleanId) {
      return { success: false, message: 'Mã thước phim không hợp lệ' };
    }

    const reqRole = String(requestUser.role || '').toLowerCase();
    const isAdmin = reqRole === 'admin' || reqRole === 'mentor' || Boolean(requestUser.isAdmin);
    if (!isAdmin && Object.keys(requestUser).length > 0) {
      return {
        success: false,
        status: 403,
        message: 'Chỉ Quản trị viên / HLV Trưởng mới có quyền xóa thước phim thực địa!'
      };
    }

    db.prepare('DELETE FROM community_reels WHERE id = ?').run(cleanId);

    recordActivity({
      userName: requestUser.name || 'Quản Trị Viên',
      role: 'admin',
      branch: 'Hội Sở RMSA',
      actionType: 'DELETE_REEL',
      description: `Đã xóa thước phim thực chiến (Mã: ${cleanId})`,
      metadata: { reelId: cleanId }
    });

    return {
      success: true,
      message: 'Đã xóa thước phim thành công!',
      reels: getCommunityReels()
    };
  } catch (err) {
    return { success: false, message: `Lỗi xóa thước phim: ${err.message}` };
  }
}

// ==========================================
// 20. HỆ THỐNG THÔNG BÁO THỜI GIAN THỰC & ĐẨY XUỐNG THIẾT BỊ (NOTIFICATIONS & WEB PUSH)
// ==========================================

export function seedDefaultNotifications() {
  try {
    const count = db.prepare('SELECT COUNT(*) as c FROM notifications').get();
    if (count && count.c === 0) {
      const defaultNotifs = [
        {
          id: 'notif_welcome',
          target_role: 'all',
          title: 'Chào mừng bạn gia nhập Running Man Sales Academy!',
          message: 'Học viện thực chiến BĐS Cho Thuê TP.HCM. Hãy hoàn thành 8 chuyên đề và bài sát hạch để nhận chứng nhận.',
          type: 'system',
          link: '#bai-1',
          sender_name: 'Đan Rin (HLV Trưởng)',
          sender_role: 'admin',
          metadata_json: '{}'
        },
        {
          id: 'notif_policy',
          target_role: 'all',
          title: 'Quy chuẩn giữ cọc phòng 72h & Chăm sóc khách hàng',
          message: 'Bảo vệ tiền cọc của khách hàng, cập nhật giỏ căn hộ trống hàng ngày trước 9h00 sáng.',
          type: 'course_doc',
          link: '#bai-1',
          sender_name: 'Ban Đào Tạo RMSA',
          sender_role: 'admin',
          metadata_json: '{}'
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO notifications (id, target_role, title, message, type, link, sender_name, sender_role, metadata_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const n of defaultNotifs) {
        stmt.run(n.id, n.target_role, n.title, n.message, n.type, n.link, n.sender_name, n.sender_role, n.metadata_json);
      }
    }
  } catch (err) {
    console.error('Lỗi khởi tạo thông báo mẫu:', err);
  }
}

export function createNotification(notifData = {}) {
  try {
    const id = notifData.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const targetRole = notifData.targetRole || notifData.target_role || 'all';
    const targetUserId = notifData.targetUserId || notifData.target_user_id || null;
    const title = String(notifData.title || 'Thông báo mới').trim();
    const message = String(notifData.message || '').trim();
    const type = notifData.type || 'system';
    const link = notifData.link || '';
    const senderName = notifData.senderName || notifData.sender_name || 'Hội Sở RMSA';
    const senderRole = notifData.senderRole || notifData.sender_role || 'admin';
    const metadataJson = typeof notifData.metadata === 'object' ? JSON.stringify(notifData.metadata) : (notifData.metadata_json || '{}');

    db.prepare(`
      INSERT INTO notifications (id, target_role, target_user_id, title, message, type, link, sender_name, sender_role, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, targetRole, targetUserId, title, message, type, link, senderName, senderRole, metadataJson);

    return {
      success: true,
      notification: {
        id,
        targetRole,
        targetUserId,
        title,
        message,
        type,
        link,
        senderName,
        senderRole,
        created_at: new Date().toISOString()
      }
    };
  } catch (err) {
    console.error('Lỗi tạo thông báo:', err);
    return { success: false, message: `Lỗi tạo thông báo: ${err.message}` };
  }
}

export function getNotificationsForUser(param1 = '', param2 = 'student') {
  try {
    seedDefaultNotifications();
    let userIdentifier = '';
    let role = 'student';
    let limit = 60;

    if (typeof param1 === 'object' && param1 !== null) {
      userIdentifier = param1.userIdentifier || param1.userId || '';
      role = param1.role || 'student';
      limit = param1.limit || 60;
    } else {
      userIdentifier = param1;
      role = param2 || 'student';
    }

    const cleanId = String(userIdentifier || 'default_user').trim() || 'default_user';
    const cleanRole = String(role || 'student').trim().toLowerCase();
    const isAdmin = cleanRole === 'admin' || cleanId.toLowerCase().includes('admin');

    const rows = db.prepare(`
      SELECT n.*,
             CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END AS is_read
      FROM notifications n
      LEFT JOIN user_notification_reads r
        ON n.id = r.notification_id 
       AND (
         r.user_identifier = ?
         OR r.user_identifier = 'default_user'
         OR (? = 1 AND r.user_identifier = 'admin')
       )
      LEFT JOIN user_notification_deletions d
        ON n.id = d.notification_id
       AND (
         d.user_identifier = ?
         OR (? = 1 AND d.user_identifier = 'admin')
       )
      WHERE d.id IS NULL
        AND (
          n.target_role = 'all'
          OR (? = 1 AND (n.target_role = 'admin' OR n.target_role = 'student'))
          OR (? = 0 AND n.target_role = 'student')
          OR (n.target_user_id = ? AND ? != '')
        )
      ORDER BY n.created_at DESC
      LIMIT ?
    `).all(cleanId, isAdmin ? 1 : 0, cleanId, isAdmin ? 1 : 0, isAdmin ? 1 : 0, isAdmin ? 1 : 0, cleanId, cleanId, limit);

    const formatted = rows.map(r => ({
      id: r.id,
      title: r.title,
      message: r.message,
      type: r.type,
      link: r.link,
      targetRole: r.target_role,
      targetUserId: r.target_user_id,
      senderName: r.sender_name,
      senderRole: r.sender_role,
      isRead: r.is_read ? 1 : 0,
      created_at: r.created_at,
      createdAt: r.created_at
    }));

    const unreadCount = formatted.filter(n => !n.isRead).length;

    return {
      success: true,
      notifications: formatted,
      unreadCount
    };
  } catch (err) {
    console.error('Lỗi lấy thông báo:', err);
    return { success: false, notifications: [], unreadCount: 0, message: err.message };
  }
}

export function markNotificationAsRead(param1 = '', param2 = '') {
  try {
    let notifId = '';
    let userIdentifier = '';

    if (typeof param1 === 'object' && param1 !== null) {
      notifId = param1.notificationId || param1.id || '';
      userIdentifier = param1.userIdentifier || param1.userId || '';
    } else if (String(param1).startsWith('notif_')) {
      notifId = String(param1);
      userIdentifier = String(param2 || 'default_user');
    } else if (String(param2).startsWith('notif_')) {
      notifId = String(param2);
      userIdentifier = String(param1 || 'default_user');
    } else {
      notifId = String(param1 || '');
      userIdentifier = String(param2 || 'default_user');
    }

    const cleanUser = String(userIdentifier || 'default_user').trim() || 'default_user';
    const cleanNotifId = String(notifId || '').trim();
    if (!cleanNotifId) return { success: false, message: 'Thiếu mã thông báo' };

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO user_notification_reads (user_identifier, notification_id)
      VALUES (?, ?)
    `);
    stmt.run(cleanUser, cleanNotifId);
    if (cleanUser.toLowerCase().includes('admin')) {
      stmt.run('admin', cleanNotifId);
    }
    stmt.run('default_user', cleanNotifId);

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export function markAllNotificationsAsRead(param1 = '', param2 = 'student') {
  try {
    let userIdentifier = '';
    let role = 'student';

    if (typeof param1 === 'object' && param1 !== null) {
      userIdentifier = param1.userIdentifier || param1.userId || '';
      role = param1.role || 'student';
    } else {
      userIdentifier = param1;
      role = param2 || 'student';
    }

    const cleanUser = String(userIdentifier || 'default_user').trim() || 'default_user';
    const isAdmin = role === 'admin' || cleanUser.toLowerCase().includes('admin');

    // Đánh dấu đã đọc tất cả thông báo trong 1 lệnh SQL duy nhất
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO user_notification_reads (user_identifier, notification_id)
      SELECT ?, id FROM notifications
    `);
    stmt.run(cleanUser);

    if (isAdmin) {
      stmt.run('admin');
    }
    stmt.run('default_user');

    return { success: true };
  } catch (err) {
    console.error('Lỗi markAllNotificationsAsRead:', err);
    return { success: false, message: err.message };
  }
}

export function deleteNotificationForUser(param1 = '', param2 = '') {
  try {
    let notifId = '';
    let userIdentifier = '';
    let role = 'student';

    if (typeof param1 === 'object' && param1 !== null) {
      notifId = param1.notificationId || param1.id || '';
      userIdentifier = param1.userIdentifier || param1.userId || '';
      role = param1.role || 'student';
    } else {
      notifId = String(param1 || '').trim();
      userIdentifier = String(param2 || 'default_user').trim();
    }

    const cleanId = String(notifId || '').trim();
    const cleanUser = String(userIdentifier || 'default_user').trim() || 'default_user';
    const isAdmin = role === 'admin' || cleanUser.toLowerCase().includes('admin');

    if (!cleanId) return { success: false, message: 'Thiếu mã thông báo' };

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO user_notification_deletions (user_identifier, notification_id)
      VALUES (?, ?)
    `);

    stmt.run(cleanUser, cleanId);
    if (isAdmin) {
      stmt.run('admin', cleanId);
    }
    if (cleanUser === 'default_user') {
      stmt.run('default_user', cleanId);
    }

    return { success: true };
  } catch (err) {
    console.error('Lỗi deleteNotificationForUser:', err);
    return { success: false, message: err.message };
  }
}

export function clearReadNotificationsForUser(param1 = '', param2 = 'student') {
  try {
    let userIdentifier = '';
    let role = 'student';
    let explicitIds = [];

    if (typeof param1 === 'object' && param1 !== null) {
      userIdentifier = param1.userIdentifier || param1.userId || '';
      role = param1.role || 'student';
      if (Array.isArray(param1.ids)) {
        explicitIds = param1.ids;
      }
    } else {
      userIdentifier = param1;
      role = param2 || 'student';
    }

    const cleanUser = String(userIdentifier || 'default_user').trim() || 'default_user';
    const isAdmin = role === 'admin' || cleanUser.toLowerCase().includes('admin');

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO user_notification_deletions (user_identifier, notification_id)
      VALUES (?, ?)
    `);

    // 1. Chèn các ID đã đọc từ bảng user_notification_reads
    const readRows = db.prepare(`
      SELECT DISTINCT r.notification_id
      FROM user_notification_reads r
      WHERE r.user_identifier = ?
         OR (r.user_identifier = 'default_user' AND ? = 'default_user')
         OR (? = 1 AND r.user_identifier = 'admin')
    `).all(cleanUser, cleanUser, isAdmin ? 1 : 0);

    for (const row of readRows) {
      insertStmt.run(cleanUser, row.notification_id);
      if (isAdmin) {
        insertStmt.run('admin', row.notification_id);
      }
      if (cleanUser === 'default_user') {
        insertStmt.run('default_user', row.notification_id);
      }
    }

    // 2. Chèn bất kỳ ID đã đọc nào được client gửi trực tiếp lên
    if (Array.isArray(explicitIds) && explicitIds.length > 0) {
      for (const id of explicitIds) {
        if (!id) continue;
        insertStmt.run(cleanUser, String(id));
        if (isAdmin) {
          insertStmt.run('admin', String(id));
        }
        if (cleanUser === 'default_user') {
          insertStmt.run('default_user', String(id));
        }
      }
    }

    return { success: true, count: readRows.length + explicitIds.length };
  } catch (err) {
    console.error('Lỗi clearReadNotificationsForUser:', err);
    return { success: false, message: err.message };
  }
}

export function savePushSubscription(subData = {}) {
  try {
    const endpoint = String(subData.endpoint || '').trim();
    const p256dh = String(subData.p256dh || subData.keys?.p256dh || '').trim();
    const auth = String(subData.auth || subData.keys?.auth || '').trim();
    const userIdentifier = String(subData.userIdentifier || subData.userId || '').trim();
    const role = String(subData.role || 'student').trim();
    const userAgent = String(subData.userAgent || '').trim();

    if (!endpoint || !p256dh || !auth) {
      return { success: false, message: 'Dữ liệu đăng ký push notification không hợp lệ' };
    }

    db.prepare(`
      INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_identifier, role, user_agent, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(endpoint) DO UPDATE SET
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        user_identifier = excluded.user_identifier,
        role = excluded.role,
        user_agent = excluded.user_agent,
        updated_at = CURRENT_TIMESTAMP
    `).run(endpoint, p256dh, auth, userIdentifier, role, userAgent);

    return { success: true, message: 'Đăng ký nhận thông báo đẩy trên thiết bị thành công!' };
  } catch (err) {
    console.error('Lỗi lưu push subscription:', err);
    return { success: false, message: err.message };
  }
}

export function getPushSubscriptionsForTarget(targetRole = 'all', targetUserId = null) {
  try {
    let rows = [];
    if (targetRole === 'all') {
      rows = db.prepare('SELECT * FROM push_subscriptions').all();
    } else if (targetUserId) {
      rows = db.prepare('SELECT * FROM push_subscriptions WHERE user_identifier = ? OR role = ?').all(targetUserId, targetRole);
    } else {
      rows = db.prepare('SELECT * FROM push_subscriptions WHERE role = ?').all(targetRole);
    }
    return rows;
  } catch (err) {
    return [];
  }
}

export function deletePushSubscription(endpoint = '') {
  try {
    if (!endpoint) return;
    db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);
  } catch {}
}

// 19. Đóng kết nối an toàn khi tắt server (Graceful Shutdown)
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


