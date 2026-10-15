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
  `);

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
    (id, order_num, title, category, duration, video_url, video_type, passing_score, summary_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const deleteQuizzesStmt = db.prepare('DELETE FROM quizzes WHERE lesson_id = ?');

  const insertQuizStmt = db.prepare(`
    INSERT INTO quizzes 
    (id, lesson_id, question, options_json, correct_answer, explanation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  coursesList.forEach((course, idx) => {
    insertLessonStmt.run(
      course.id,
      course.order || idx + 1,
      course.title,
      course.category || 'Kỹ năng bán hàng',
      course.duration || '15 phút',
      course.videoUrl,
      course.videoType || 'direct',
      course.passingScore || 80,
      JSON.stringify(course.summary || [])
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

  // Đồng thời sao lưu sang file courses.json để khách hàng vẫn có thể đọc dễ dàng nếu cần
  try {
    fs.writeFileSync(COURSES_JSON, JSON.stringify(coursesList, null, 2), 'utf-8');
  } catch (err) {}
});

// 1. Lấy toàn bộ bài học và câu hỏi trắc nghiệm
export function getAllCourses() {
  const lessons = db.prepare('SELECT * FROM lessons ORDER BY order_num ASC').all();
  const getQuizzesStmt = db.prepare('SELECT * FROM quizzes WHERE lesson_id = ? ORDER BY rowid ASC');

  return lessons.map(lesson => {
    const quizzes = getQuizzesStmt.all(lesson.id);
    return {
      id: lesson.id,
      order: lesson.order_num,
      title: lesson.title,
      category: lesson.category,
      duration: lesson.duration,
      videoUrl: lesson.video_url,
      videoType: lesson.video_type,
      passingScore: lesson.passing_score,
      summary: JSON.parse(lesson.summary_json || '[]'),
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

// 5. Đặt lại tiến độ (Reset)
export function resetStudentProgress(studentName = 'Nguyễn Văn A') {
  try {
    db.prepare('DELETE FROM student_progress WHERE student_name = ?').run(studentName);
    return true;
  } catch (err) {
    console.error('Lỗi khi reset tiến độ trong SQLite:', err);
    return false;
  }
}

// Khởi chạy tạo bảng ngay
initDatabase();

export default db;
