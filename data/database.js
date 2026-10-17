import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'lms.db');
const COURSES_JSON = path.join(__dirname, 'courses.json');

// Khởi tạo kết nối SQLite với WAL mode (Write-Ahead Logging) cho hiệu năng cao nhất
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

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
  `);

  // Safe migrations cho database hiện hữu
  try { db.exec("ALTER TABLE lessons ADD COLUMN attachments_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN timestamps_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN videos_json TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE lessons ADD COLUMN thumbnail_url TEXT"); } catch {}

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

// Khởi chạy tạo bảng ngay
initDatabase();

export default db;
