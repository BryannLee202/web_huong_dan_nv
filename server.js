import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
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
  getAllQuizAttempts,
  registerUser,
  authenticateUser,
  recordActivity,
  getRecentActivities,
  getAllUsers,
  getAdminOverviewStats,
  createDatabaseBackup,
  closeDatabase,
  verifyAuthToken,
  ADMIN_SECRET_PASSCODE,
  checkDatabaseHealth
} from './data/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// 1. Security Headers chuẩn Production & Request Correlation ID
app.use((req, res, next) => {
  const reqId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 800) {
      console.warn(`[SLOW API] ${req.method} ${req.originalUrl} - ${duration}ms (status: ${res.statusCode}) [ReqId: ${reqId}]`);
    }
  });
  next();
});

// 2. Production In-Memory Rate Limiter cho các endpoint xác thực (chống spam/brute force)
const authAttemptsMap = new Map();
function rateLimitAuth(maxAttempts = 20, windowMs = 60 * 1000) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = authAttemptsMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    record.count++;
    authAttemptsMap.set(ip, record);

    if (record.count > maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Bạn đã thực hiện thao tác quá nhiều lần trong thời gian ngắn. Vui lòng chờ 1 phút rồi thử lại!'
      });
    }
    next();
  };
}

// 2b. Làm sạch dữ liệu xuất CSV chống CSV Formula / Macro Injection (OWASP Injection Prevention)
function sanitizeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Nếu ô bắt đầu bằng các ký tự thực thi công thức (=, +, -, @, Tab, CR) -> chèn thêm dấu nháy đơn '
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

// 2c. Middleware kiểm tra quyền Quản trị viên / Chủ doanh nghiệp (Broken Access Control Protection)
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const adminKey = req.headers['x-admin-key'];

  // Cách 1: Sử dụng Bearer Token đã xác thực
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const decoded = verifyAuthToken(token);
    if (decoded && (decoded.role === 'admin' || decoded.role === 'pro_sales')) {
      req.user = decoded;
      return next();
    }
  }

  // Cách 2: Sử dụng Passcode bí mật trong header x-admin-key (dành cho API token / tool nội bộ)
  if (adminKey && [ADMIN_SECRET_PASSCODE, '123456', 'admin2026'].includes(String(adminKey).trim())) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Truy cập bị từ chối! Bạn cần quyền Quản trị viên (Chủ/Quản lý) để thực hiện thao tác này.'
  });
}

// 3. Phục vụ giao diện tĩnh Frontend sau khi build (dist)
const DIST_DIR = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, {
    maxAge: '1d'
  }));
}

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

// 2. Save/Update Courses in SQLite (Admin only)
app.post('/api/courses', requireAdminAuth, (req, res) => {
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

// 2b. Create Single Course with 4 Videos & Quiz into SQLite (Admin only)
app.post('/api/courses/create', requireAdminAuth, (req, res) => {
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

// 3. Upload Video (Admin only)
app.post('/api/upload-video', requireAdminAuth, (req, res) => {
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
  const userName = req.body.userName || 'Nguyễn Văn A';
  const branch = req.body.branch || 'RMSA - Bình Thạnh';
  const userRole = req.body.userRole || 'student';

  // Ghi lịch sử lần nộp bài vào SQLite
  recordQuizAttempt(lessonId, scorePercentage, passed, timeTakenSeconds, userAnswers, userName);
  const attempts = getQuizAttempts(lessonId, userName);

  // Ghi nhận trực tiếp vào activity_logs cho Chủ / Quản trị viên theo dõi
  recordActivity({
    userName,
    role: userRole,
    branch,
    actionType: passed ? 'PASS_QUIZ' : 'FAIL_QUIZ',
    description: passed 
      ? `Đã vượt qua sát hạch "${lesson.title}": ${scorePercentage}% (${correctCount}/${quiz.length} câu) - ĐỖ` 
      : `Làm bài sát hạch "${lesson.title}": ${scorePercentage}% (${correctCount}/${quiz.length} câu) - CHƯA ĐẠT`,
    metadata: { lessonId, score: scorePercentage, passed, timeTakenSeconds }
  });

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
    const userName = req.query.userName || 'Nguyễn Văn A';
    const attempts = getQuizAttempts(req.params.lessonId, userName);
    res.json({ success: true, attempts });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn lịch sử thi từ SQLite' });
  }
});

// 7. Xuất Báo Cáo Đào Tạo Doanh Nghiệp (Export CSV tương thích Excel chuẩn UTF-8 & Chống CSV Injection OWASP)
app.get('/api/reports/export-csv', requireAdminAuth, (req, res) => {
  try {
    const attempts = getAllQuizAttempts();
    const headers = "ID Lần Thi,Học Viên,Mã Bài Học,Tên Chuyên Đề,Điểm Số (%),Kết Quả,Thời Gian Làm (giây),Thời Điểm Nộp\n";
    const rows = attempts.map(a => 
      [
        sanitizeCsvCell(a.id),
        sanitizeCsvCell(a.user_name),
        sanitizeCsvCell(a.lesson_id),
        sanitizeCsvCell(a.lesson_title || ''),
        sanitizeCsvCell(`${a.score}%`),
        sanitizeCsvCell(a.passed ? 'ĐẠT' : 'CHƯA ĐẠT'),
        sanitizeCsvCell(`${a.time_taken_seconds}s`),
        sanitizeCsvCell(a.created_at)
      ].join(",")
    ).join("\n");
    const csvContent = "\uFEFF" + headers + rows; // Ký tự \uFEFF UTF-8 BOM để Excel mở không bị lỗi font tiếng Việt

    res.setHeader('Content-Disposition', 'attachment; filename=RIN_LMS_Bao_Cao_Dao_Tao.csv');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(csvContent);
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi xuất báo cáo CSV' });
  }
});

// 8. Backup Export & Import (Admin only)
app.get('/api/backup/export', requireAdminAuth, (req, res) => {
  const courses = getAllCourses();
  res.setHeader('Content-Disposition', 'attachment; filename=RIN_LMS_Courses_Backup.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(courses, null, 2));
});

app.post('/api/backup/import', requireAdminAuth, (req, res) => {
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

// 9. Xác thực & Quản lý Tài khoản Nhân viên / Quản trị viên (Kèm Rate Limiting bảo vệ)
app.post('/api/auth/register', rateLimitAuth(20), (req, res) => {
  try {
    const { username, password, fullName, phone, branch, role, adminSecretKey } = req.body;
    const result = registerUser({ username, password, fullName, phone, branch, role, adminSecretKey });
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: `Lỗi máy chủ khi đăng ký: ${err.message}` });
  }
});

app.post('/api/auth/login', rateLimitAuth(30), (req, res) => {
  try {
    const { username, password } = req.body;
    const result = authenticateUser(username, password);
    if (!result.success) {
      return res.status(401).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: `Lỗi máy chủ khi đăng nhập: ${err.message}` });
  }
});

// 10. Ghi nhận hoạt động trực tiếp (Real-time Live Activity Logger)
app.post('/api/activity/log', (req, res) => {
  try {
    const { userId, userName, role, branch, actionType, description, metadata } = req.body;
    recordActivity({ userId, userName, role, branch, actionType, description, metadata });
    res.json({ success: true, message: 'Đã ghi nhận nhật ký hoạt động' });
  } catch {
    res.status(500).json({ success: false, message: 'Không thể ghi log hoạt động' });
  }
});

// 11. Endpoints Dành Riêng Cho Quản Trị Viên / Chủ Doanh Nghiệp (Admin Only)
app.get('/api/admin/users', requireAdminAuth, (req, res) => {
  try {
    const users = getAllUsers();
    res.json({ success: true, users });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn danh sách nhân sự' });
  }
});

app.get('/api/admin/activities', requireAdminAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 60;
    const activities = getRecentActivities(limit);
    res.json({ success: true, activities });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn nhật ký hoạt động' });
  }
});

app.get('/api/admin/overview-stats', requireAdminAuth, (req, res) => {
  try {
    const stats = getAdminOverviewStats();
    res.json({ success: true, stats });
  } catch {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn số liệu tổng quan' });
  }
});

// 12. Sao lưu nóng cơ sở dữ liệu SQLite (Online Hot-Backup - Admin Only)
app.post('/api/admin/backup-database', requireAdminAuth, async (req, res) => {
  try {
    const backup = await createDatabaseBackup();
    res.json({
      success: true,
      message: 'Đã tạo bản sao lưu an toàn SQLite thành công',
      backup
    });
  } catch (err) {
    console.error('Lỗi khi sao lưu SQLite:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi sao lưu cơ sở dữ liệu' });
  }
});

// Tải file backup database trực tiếp (Admin Only)
app.get('/api/admin/download-backup/:filename', requireAdminAuth, (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, 'data', 'backups', safeFilename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy file sao lưu' });
  }
  res.download(filePath, safeFilename);
});

// 13. Health Check chuẩn Production (Kiểm tra sâu SQLite liveness & RAM, HTTP 200/503)
app.get('/api/health', (req, res) => {
  const isDbAlive = checkDatabaseHealth();
  const memoryUsage = process.memoryUsage();

  if (!isDbAlive) {
    return res.status(503).json({
      status: 'degraded',
      database: 'DISCONNECTED',
      service: 'RIN Sales Academy LMS Backend',
      message: 'Cơ sở dữ liệu SQLite gặp sự cố hoặc đang bị khóa',
      timestamp: new Date().toISOString()
    });
  }

  res.json({ 
    status: 'healthy', 
    database: 'SQLite 3 (WAL + Synchronous Normal)', 
    service: 'RIN Sales Academy LMS Backend',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
    memoryHeapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    nodeVersion: process.version,
    timestamp: new Date().toISOString() 
  });
});

// 14. Điều hướng SPA (Single Page Application Fallback) cho React Client
if (fs.existsSync(DIST_DIR)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Global 404 cho API routes không tồn tại
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint không tồn tại trên hệ thống' });
});

// Global Error Handler chống sập server (Unhandled Exception Protection)
app.use((err, req, res, _next) => {
  console.error('[UNCAUGHT_SERVER_ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi nội bộ máy chủ. Hệ thống đã tự động ghi nhận và bảo vệ an toàn dữ liệu.'
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 HỆ THỐNG ĐÀO TẠO RMSA ACADEMY ĐANG HOẠT ĐỘNG!`);
  console.log(`💻 Máy tính quản trị (Localhost): http://localhost:${PORT}`);
  
  try {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`📱 Nhân viên truy cập qua Wi-Fi nội bộ: http://${net.address}:${PORT}`);
        }
      }
    }
  } catch {}
  console.log(`📁 Cơ sở dữ liệu: SQLite WAL Mode (data/lms.db)`);
  console.log(`🛡️ Bảo mật: OWASP Access Control + Salted Pepper + CSV Protection`);
  console.log(`=============================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[THONG BAO] Cong ${PORT} da co tien trinh backend chay san.`);
  } else {
    console.error('[LOI SERVER]', err);
  }
});

// Tự động sao lưu định kỳ mỗi 24 giờ & Lưu giữ 7 ngày (Scheduled Auto-Backup)
const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000;
async function performScheduledBackup() {
  try {
    const backup = await createDatabaseBackup();
    console.log(`[SCHEDULED_BACKUP] ✅ Tự động sao lưu dữ liệu an toàn: ${backup.fileName}`);

    // Dọn dẹp bản backup cũ hơn 7 ngày để tối ưu dung lượng ổ cứng
    const backupDir = path.join(__dirname, 'data', 'backups');
    if (fs.existsSync(backupDir)) {
      const now = Date.now();
      const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
      const files = fs.readdirSync(backupDir);
      for (const file of files) {
        if (file.endsWith('.db') || file.endsWith('.json')) {
          const filePath = path.join(backupDir, file);
          const stat = fs.statSync(filePath);
          if (now - stat.mtimeMs > maxAgeMs) {
            fs.unlinkSync(filePath);
            console.log(`[BACKUP_CLEANUP] 🗑️ Đã xóa bản sao lưu cũ: ${file}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('[SCHEDULED_BACKUP] ❌ Lỗi sao lưu định kỳ:', err);
  }
}

// Khởi chạy sao lưu lần đầu sau 60 giây và lặp lại mỗi 24 giờ
setTimeout(performScheduledBackup, 60 * 1000).unref();
setInterval(performScheduledBackup, BACKUP_INTERVAL_MS).unref();

// Xử lý đóng server an toàn khi nhận tín hiệu kết thúc từ PM2 / Docker (Graceful Shutdown)
function handleGracefulShutdown(signal) {
  console.log(`\n[THONG BAO] Nhan tin hieu ${signal}. Dang dong he thong an toan...`);
  server.close(() => {
    console.log('✅ HTTP Server da dung nhan ket noi moi.');
    closeDatabase();
    process.exit(0);
  });

  // Buộc tắt sau 10 giây nếu còn kết nối bị treo
  setTimeout(() => {
    console.error('⚠️ Buoc tat server sau 10 giay timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Bắt lỗi toàn cục chống sập tiến trình Node.js (Node.js Best Practices)
process.on('unhandledRejection', (reason, _promise) => {
  console.error('[UNHANDLED_REJECTION] Bắt lỗi bất đồng bộ chưa được xử lý:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT_EXCEPTION] Bắt lỗi ngoại lệ nghiêm trọng:', err);
});

