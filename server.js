import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'videos');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// HTTP 206 Partial Content Video Streaming handler (tua mượt mà, không giật lag)
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

// Helpers
function readCourses() {
  try {
    if (!fs.existsSync(COURSES_FILE)) return [];
    return JSON.parse(fs.readFileSync(COURSES_FILE, 'utf-8'));
  } catch (err) {
    console.error('Lỗi đọc courses.json:', err);
    return [];
  }
}

function saveCourses(courses) {
  try {
    if (fs.existsSync(COURSES_FILE)) {
      fs.copyFileSync(COURSES_FILE, path.join(DATA_DIR, 'courses.backup.json'));
    }
    fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Lỗi ghi courses.json:', err);
    return false;
  }
}

function readProgress() {
  try {
    if (!fs.existsSync(PROGRESS_FILE)) {
      return { completedLessons: {}, currentLessonId: 'bai-1' };
    }
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch (err) {
    console.error('Lỗi đọc progress.json:', err);
    return { completedLessons: {}, currentLessonId: 'bai-1' };
  }
}

function saveProgress(progress) {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Lỗi ghi progress.json:', err);
    return false;
  }
}

// --- API ENDPOINTS ---

// 1. Get Courses
app.get('/api/courses', (req, res) => {
  res.json({ success: true, courses: readCourses() });
});

// 2. Save/Update Courses
app.post('/api/courses', (req, res) => {
  const { courses } = req.body;
  if (!Array.isArray(courses)) {
    return res.status(400).json({ success: false, message: 'Dữ liệu khóa học phải là một danh sách hợp lệ' });
  }
  const ok = saveCourses(courses);
  if (ok) {
    res.json({ success: true, message: 'Đã lưu cấu hình bài học thành công', courses });
  } else {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu file courses.json' });
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

// 4. Progress Management
app.get('/api/progress', (req, res) => {
  res.json({ success: true, progress: readProgress() });
});

app.post('/api/progress', (req, res) => {
  const { completedLessons, currentLessonId } = req.body;
  const current = readProgress();
  const updated = {
    completedLessons: completedLessons !== undefined ? completedLessons : current.completedLessons,
    currentLessonId: currentLessonId !== undefined ? currentLessonId : current.currentLessonId
  };
  saveProgress(updated);
  res.json({ success: true, progress: updated });
});

app.post('/api/progress/reset', (req, res) => {
  const initial = { completedLessons: {}, currentLessonId: 'bai-1' };
  saveProgress(initial);
  res.json({ success: true, message: 'Đã đặt lại tiến độ học thành công', progress: initial });
});

// 5. Evaluate Quiz Server-side
app.post('/api/quiz/evaluate', (req, res) => {
  const { lessonId, userAnswers } = req.body;
  const courses = readCourses();
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

  res.json({
    success: true,
    lessonId,
    totalQuestions: quiz.length,
    correctCount,
    scorePercentage,
    passingScore,
    passed,
    details
  });
});

// 6. Backup Export & Import (1-click cho khách hàng)
app.get('/api/backup/export', (req, res) => {
  const courses = readCourses();
  res.setHeader('Content-Disposition', 'attachment; filename=RIN_LMS_Courses_Backup.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(courses, null, 2));
});

app.post('/api/backup/import', (req, res) => {
  const { courses } = req.body;
  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({ success: false, message: 'File backup không hợp lệ hoặc rỗng' });
  }
  const ok = saveCourses(courses);
  if (ok) {
    res.json({ success: true, message: 'Khôi phục dữ liệu từ bản sao lưu thành công!', courses });
  } else {
    res.status(500).json({ success: false, message: 'Không thể khôi phục dữ liệu' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'RIN Sales Academy LMS Backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 RIN LMS Backend chạy tại http://localhost:${PORT}`);
});
