import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getAllCourses, 
  saveAllCourses, 
  createSingleCourse,
  getStudentProgress, 
  saveStudentProgress, 
  resetStudentProgress,
  recordQuizAttempt,
  getQuizAttempts,
  getAllQuizAttempts
} from './data/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Directories
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'videos');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// HTTP 206 Partial Content Video Streaming handler (tua video mượt mà không lag)
app.get('/uploads/videos/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Video không tồn tại trên hệ thống' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// Serve other static files in uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueName = `${Date.now()}_${safeBaseName}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file định dạng video (.mp4, .webm, .mov, etc.)'));
    }
  }
});

// --- API ENDPOINTS (CONNECTED TO SQLITE DATABASE) ---

// 1. Get Courses from SQLite
app.get('/api/courses', (req, res) => {
  try {
    const courses = getAllCourses();
    res.json({ success: true, courses });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn khóa học từ SQLite' });
  }
});

// 2. Save/Update Courses in SQLite
app.post('/api/courses', (req, res) => {
  const { courses } = req.body;
  if (!Array.isArray(courses)) {
    return res.status(400).json({ success: false, message: 'Dữ liệu khóa học phải là một danh sách hợp lệ' });
  }
  const ok = saveAllCourses(courses);
  if (ok) {
    res.json({ success: true, message: 'Đã lưu cấu hình bài học vào SQLite thành công', courses });
  } else {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu vào SQLite database' });
  }
});

// 2b. Create Single Course with 4 Videos & Quiz into SQLite
app.post('/api/courses/create', (req, res) => {
  try {
    const courseData = req.body;
    if (!courseData || !courseData.title) {
      return res.status(400).json({ success: false, message: 'Tên chuyên đề không được để trống' });
    }
    const updatedCourses = createSingleCourse(courseData);
    res.json({
      success: true,
      message: 'Đã tạo chuyên đề mới và đồng bộ vào SQLite database thành công',
      courses: updatedCourses
    });
  } catch (err) {
    console.error('Lỗi khi tạo chuyên đề mới:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo chuyên đề mới' });
  }
});

// 3. Upload Video
app.post('/api/upload-video', (req, res) => {
  upload.single('video')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file video cần tải lên' });
    }
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Tải video thành công',
      videoUrl,
      fileName: req.file.originalname,
      size: req.file.size
    });
  });
});

// 4. Progress Management via SQLite
app.get('/api/progress', (req, res) => {
  try {
    const progress = getStudentProgress('Nguyễn Văn A');
    res.json({ success: true, progress });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn tiến độ từ SQLite' });
  }
});

app.post('/api/progress', (req, res) => {
  const { completedLessons, currentLessonId } = req.body;
  const ok = saveStudentProgress('Nguyễn Văn A', completedLessons, currentLessonId);
  if (ok) {
    const updated = getStudentProgress('Nguyễn Văn A');
    res.json({ success: true, progress: updated });
  } else {
    res.status(500).json({ success: false, message: 'Lỗi lưu tiến độ vào SQLite' });
  }
});

app.post('/api/progress/reset', (req, res) => {
  resetStudentProgress('Nguyễn Văn A');
  res.json({ 
    success: true, 
    message: 'Đã đặt lại tiến độ học thành công trong SQLite', 
    progress: { completedLessons: {}, currentLessonId: 'bai-1' } 
  });
});

// 5. Evaluate Quiz Server-side
app.post('/api/quiz/evaluate', (req, res) => {
  const { lessonId, userAnswers } = req.body;
  const courses = getAllCourses();
  const lesson = courses.find(c => c.id === lessonId);

  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
  }

  const quiz = lesson.quiz || [];
  if (quiz.length === 0) {
    return res.json({
      success: true,
      lessonId,
      totalQuestions: 0,
      correctCount: 0,
      scorePercentage: 100,
      passed: true,
      details: []
    });
  }

  let correctCount = 0;
  const details = quiz.map((q) => {
    const selectedAnswer = userAnswers ? userAnswers[q.id] : undefined;
    const isCorrect = selectedAnswer !== undefined && Number(selectedAnswer) === Number(q.correctAnswer);
    if (isCorrect) correctCount++;

    return {
      id: q.id,
      question: q.question,
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation
    };
  });

  const scorePercentage = Math.round((correctCount / quiz.length) * 100);
  const passingScore = lesson.passingScore || 80;
  const passed = scorePercentage >= passingScore;
  const timeTakenSeconds = Number(req.body.timeTakenSeconds || 0);

  // Ghi lịch sử lần nộp bài vào SQLite
  recordQuizAttempt(lessonId, scorePercentage, passed, timeTakenSeconds, userAnswers, 'Nguyễn Văn A');
  const attempts = getQuizAttempts(lessonId, 'Nguyễn Văn A');

  res.json({
    success: true,
    lessonId,
    totalQuestions: quiz.length,
    correctCount,
    scorePercentage,
    passingScore,
    passed,
    timeTakenSeconds,
    attempts,
    details
  });
});

// 6. Lấy lịch sử làm bài của bài học (CodeLearn-style Attempt History)
app.get('/api/quiz/attempts/:lessonId', (req, res) => {
  try {
    const attempts = getQuizAttempts(req.params.lessonId, 'Nguyễn Văn A');
    res.json({ success: true, attempts });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn lịch sử thi từ SQLite' });
  }
});

// 7. Xuất Báo Cáo Đào Tạo Doanh Nghiệp (Export CSV tương thích Excel chuẩn UTF-8)
app.get('/api/reports/export-csv', (req, res) => {
  try {
    const attempts = getAllQuizAttempts();
    const headers = "ID Lần Thi,Học Viên,Mã Bài Học,Tên Chuyên Đề,Điểm Số (%),Kết Quả,Thời Gian Làm (giây),Thời Điểm Nộp\n";
    const rows = attempts.map(a => 
      `"${a.id}","${a.user_name}","${a.lesson_id}","${(a.lesson_title || '').replace(/"/g, '""')}","${a.score}%","${a.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}","${a.time_taken_seconds}s","${a.created_at}"`
    ).join("\n");
    const csvContent = "\uFEFF" + headers + rows; // Ký tự \uFEFF UTF-8 BOM để Excel mở không bị lỗi font tiếng Việt

    res.setHeader('Content-Disposition', 'attachment; filename=RIN_LMS_Bao_Cao_Dao_Tao.csv');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(csvContent);
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi xuất báo cáo CSV' });
  }
});

// 8. Backup Export & Import (1-click cho khách hàng)
app.get('/api/backup/export', (req, res) => {
  const courses = getAllCourses();
  res.setHeader('Content-Disposition', 'attachment; filename=RIN_LMS_Courses_Backup.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(courses, null, 2));
});

app.post('/api/backup/import', (req, res) => {
  const { courses } = req.body;
  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({ success: false, message: 'File backup không hợp lệ hoặc rỗng' });
  }
  const ok = saveAllCourses(courses);
  if (ok) {
    res.json({ success: true, message: 'Khôi phục dữ liệu vào SQLite database thành công!', courses });
  } else {
    res.status(500).json({ success: false, message: 'Không thể khôi phục dữ liệu vào SQLite' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: 'SQLite 3 (WAL mode)', 
    service: 'RIN Sales Academy LMS Backend', 
    timestamp: new Date().toISOString() 
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RIN LMS Backend chạy tại http://localhost:${PORT} (SQLite: data/lms.db)`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[THONG BAO] Cong ${PORT} da co tien trinh backend chay san.`);
  } else {
    console.error('[LOI SERVER]', err);
  }
});

