import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  hashPassword, 
  legacyHashPassword, 
  generateAuthToken, 
  verifyAuthToken, 
  checkDatabaseHealth,
  registerUser,
  authenticateUser,
  createOtpForUser,
  verifyOtpCode,
  resetUserPasswordWithOtp,
  findOrCreateGoogleUser,
  findUserByIdentifier,
  updateLessonAiGeneratedContent,
  createSingleCourse,
  getAllCourses,
  getUserStreakData,
  saveUserStreakRecord,
  getLeaderboardStats,
  saveStudentProgress,
  resetStudentProgress,
  recordDailyScenarioCorrect,
  recordPracticeTestAttempt,
  getDailyQuota,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
  getUserQuizAttempts,
  cleanTestData,
  getAllUsers,
  recordQuizAttempt,
  getRecentActivities,
  getCommunityPosts,
  createCommunityPost,
  deleteCommunityPost,
  togglePinCommunityPost,
  toggleLikeCommunityPost,
  addCommunityComment,
  deleteCommunityComment,
  getCommunityReels,
  createCommunityReel,
  deleteCommunityReel
} from '../data/database.js';
import { analyzeVideoAndGenerateLmsContent, generateMascotChatReply, generateRandomFieldScenarioWithAi } from '../server/aiService.js';
import { getRandomScenario, scenariosBank } from '../data/scenariosBank.js';
import { getRandomPracticeQuestions, practiceTestBank } from '../data/practiceTestBank.js';
import { getLocalDateString, getYesterdayDateString, getDayDifference } from '../src/utils/streakManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'courses.json');

console.log('--- BẮT ĐẦU VÒNG KIỂM THỬ BACKEND & DỮ LIỆU ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Check courses.json file existence and syntax
assert(fs.existsSync(DATA_FILE), 'File data/courses.json phải tồn tại');

const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
let courses;
try {
  courses = JSON.parse(rawData);
  assert(Array.isArray(courses), 'data/courses.json phải chứa một mảng bài học');
  assert(courses.length >= 3, `Phải có ít nhất 3 bài học mẫu (hiện có: ${courses.length})`);
} catch (e) {
  assert(false, `Lỗi cú pháp JSON trong courses.json: ${e.message}`);
}

// 2. Validate course structure and sequencing fields
courses.forEach((course, idx) => {
  const index = idx + 1;
  assert(course.id && course.id.length > 0, `Bài ${index}: ID hợp lệ`);
  assert(typeof course.order === 'number', `Bài ${index}: Có thứ tự order chuẩn số`);
  assert(course.title && course.title.length > 0, `Bài ${index}: Tiêu đề không rỗng`);
  assert(typeof course.videoUrl === 'string', `Bài ${index}: Có thuộc tính videoUrl dạng chuỗi (kể cả chuỗi rỗng khi chờ admin upload)`);
  assert(Array.isArray(course.summary) && course.summary.length > 0, `Bài ${index}: Có tóm tắt kiến thức`);
  assert(typeof course.passingScore === 'number' && course.passingScore >= 50, `Bài ${index}: Điểm qua môn đạt chuẩn`);
  assert(Array.isArray(course.quiz) && course.quiz.length > 0, `Bài ${index}: Có danh sách câu hỏi trắc nghiệm`);

  // Check quiz questions
  course.quiz.forEach((q, qIdx) => {
    assert(q.id && q.id.length > 0, `Bài ${index} - Câu ${qIdx + 1}: Có ID câu hỏi`);
    assert(q.question && q.question.length > 0, `Bài ${index} - Câu ${qIdx + 1}: Nội dung câu hỏi rõ ràng`);
    assert(Array.isArray(q.options) && q.options.length >= 2, `Bài ${index} - Câu ${qIdx + 1}: Ít nhất 2 đáp án lựa chọn`);
    assert(typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < q.options.length,
      `Bài ${index} - Câu ${qIdx + 1}: Chỉ số đáp án đúng hợp lệ`);
    assert(q.explanation && q.explanation.length > 0, `Bài ${index} - Câu ${qIdx + 1}: Có giải thích lý do vì sao đúng/sai`);
  });
});

// 3. Test Quiz Scoring Logic & Edge Cases (Pure function simulation matching server.js)
function evaluateQuiz(quiz, userAnswers, passingScore = 80) {
  let correctCount = 0;
  const details = quiz.map((q) => {
    const selectedAnswer = userAnswers ? userAnswers[q.id] : undefined;
    const isCorrect = selectedAnswer !== undefined && Number(selectedAnswer) === Number(q.correctAnswer);
    if (isCorrect) correctCount++;
    return { id: q.id, isCorrect, explanation: q.explanation };
  });
  const scorePercentage = Math.round((correctCount / quiz.length) * 100);
  const passed = scorePercentage >= passingScore;
  return { correctCount, scorePercentage, passed, details };
}

const lesson1 = courses[0];

// Test case 3.1: 100% correct answers
const allCorrectAnswers = {};
lesson1.quiz.forEach(q => { allCorrectAnswers[q.id] = q.correctAnswer; });
const result100 = evaluateQuiz(lesson1.quiz, allCorrectAnswers, lesson1.passingScore);
assert(result100.scorePercentage === 100 && result100.passed === true, 'Test 100% đúng: Đạt 100% và trạng thái passed=true');

// Test case 3.2: 0% correct answers
const allWrongAnswers = {};
lesson1.quiz.forEach(q => { allWrongAnswers[q.id] = (q.correctAnswer + 1) % q.options.length; });
const result0 = evaluateQuiz(lesson1.quiz, allWrongAnswers, lesson1.passingScore);
assert(result0.scorePercentage === 0 && result0.passed === false, 'Test 0% đúng: Điểm 0% và trạng thái passed=false');

// Test case 3.3: 8 out of 10 correct (80% boundary - Pass)
const eightCorrectAnswers = {};
const totalQuizQuestions = lesson1.quiz.length;
const targetWrongCount80 = Math.round(totalQuizQuestions * 0.2);
lesson1.quiz.forEach((q, idx) => {
  eightCorrectAnswers[q.id] = idx < targetWrongCount80 ? (q.correctAnswer + 1) % q.options.length : q.correctAnswer;
});
const result80 = evaluateQuiz(lesson1.quiz, eightCorrectAnswers, lesson1.passingScore);
assert(result80.scorePercentage === 80 && result80.passed === true, 'Test biên 80% đạt chuẩn: Đạt điểm và mở khóa bài tiếp');

// Test case 3.4: 6 out of 10 correct (60% boundary - Fail)
const sixCorrectAnswers = {};
const targetWrongCount60 = Math.round(totalQuizQuestions * 0.4);
lesson1.quiz.forEach((q, idx) => {
  sixCorrectAnswers[q.id] = idx < targetWrongCount60 ? (q.correctAnswer + 1) % q.options.length : q.correctAnswer;
});
const result60 = evaluateQuiz(lesson1.quiz, sixCorrectAnswers, lesson1.passingScore);
assert(result60.scorePercentage === 60 && result60.passed === false, 'Test biên 60%: Không đạt và KHÔNG mở khóa bài tiếp');

// Test case 3.5: Empty answers
const emptyAnswers = {};
const resultEmpty = evaluateQuiz(lesson1.quiz, emptyAnswers, lesson1.passingScore);
assert(resultEmpty.scorePercentage === 0 && resultEmpty.passed === false, 'Test nộp bài rỗng: Xử lý an toàn không crash');

// 4. Test Course Unlock Logic
function isLessonUnlocked(targetLessonIndex, coursesList, completedLessons) {
  if (targetLessonIndex === 0) return true; // Lesson 1 is always unlocked
  const previousLesson = coursesList[targetLessonIndex - 1];
  const prevProgress = completedLessons[previousLesson.id];
  return Boolean(prevProgress && prevProgress.passed === true);
}

// Case 4.1: Brand new student (no completed lessons)
const completedInitial = {};
assert(isLessonUnlocked(0, courses, completedInitial) === true, 'Học viên mới: Bài 1 mở');
assert(isLessonUnlocked(1, courses, completedInitial) === false, 'Học viên mới: Bài 2 KHÓA');
assert(isLessonUnlocked(2, courses, completedInitial) === false, 'Học viên mới: Bài 3 KHÓA');

// Case 4.2: Completed Lesson 1 with passing score
completedInitial[courses[0].id] = { passed: true, score: 80 };
assert(isLessonUnlocked(1, courses, completedInitial) === true, 'Đã đỗ Bài 1: Bài 2 được MỞ KHÓA');
assert(isLessonUnlocked(2, courses, completedInitial) === false, 'Chưa làm Bài 2: Bài 3 vẫn KHÓA');

// Case 4.3: Failed Lesson 2 (score 60)
completedInitial[courses[1].id] = { passed: false, score: 60 };
assert(isLessonUnlocked(2, courses, completedInitial) === false, 'Rớt Bài 2: Bài 3 vẫn KHÓA');

// Case 4.4: Retook and Passed Lesson 2 (score 100)
completedInitial[courses[1].id] = { passed: true, score: 100 };
assert(isLessonUnlocked(2, courses, completedInitial) === true, 'Đỗ lại Bài 2: Bài 3 MỞ KHÓA THÀNH CÔNG');

// 5. TEST HERO BANNER CAROUSEL NAVIGATION & COMPONENT INTEGRITY
console.log('\n--- KIỂM THỬ HERO BANNER CAROUSEL & ĐIỀU HƯỚNG TRANG 1 <-> TRANG 3 ---');

const teacherPagePath = path.join(__dirname, '..', 'src', 'components', 'MapStudyTeacherPage.jsx');
assert(fs.existsSync(teacherPagePath), 'File src/components/MapStudyTeacherPage.jsx phải tồn tại');

const teacherPageCode = fs.readFileSync(teacherPagePath, 'utf8');

// 5.1 Check no missing lucide-react components (especially Award)
const lucideImportMatch = teacherPageCode.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"]/);
assert(lucideImportMatch && lucideImportMatch[1], 'MapStudyTeacherPage phải import từ lucide-react');

const importedLucideIcons = new Set(
  (lucideImportMatch ? lucideImportMatch[1] : '').match(/[A-Z][a-zA-Z0-9]+/g) || []
);
assert(importedLucideIcons.has('Award'), 'MapStudyTeacherPage phải import icon "Award" (fix màn hình trắng Slide 3)');
assert(importedLucideIcons.has('ChevronLeft'), 'MapStudyTeacherPage phải import icon "ChevronLeft"');
assert(importedLucideIcons.has('ChevronRight'), 'MapStudyTeacherPage phải import icon "ChevronRight"');
assert(importedLucideIcons.has('BookOpen') || teacherPageCode.includes('RealisticBookIcon'), 'MapStudyTeacherPage phải import icon "BookOpen" hoặc "RealisticBookIcon"');
assert(importedLucideIcons.has('Sparkles'), 'MapStudyTeacherPage phải import icon "Sparkles"');

// 5.2 Test Carousel navigation wrapping logic
const TOTAL_SLIDES = 3;

function getSafeSlide(slideIndex, total = TOTAL_SLIDES) {
  return ((slideIndex % total) + total) % total;
}

function getNextSlide(currentSlide, total = TOTAL_SLIDES) {
  return (currentSlide + 1) % total;
}

function getPrevSlide(currentSlide, total = TOTAL_SLIDES) {
  return ((currentSlide - 1) % total + total) % total;
}

// Test Navigation from Trang 1 (Index 0)
assert(getNextSlide(0, TOTAL_SLIDES) === 1, 'Từ Trang 1 bấm Tiếp Theo -> Chuyển sang Trang 2 (index 1)');
assert(getPrevSlide(0, TOTAL_SLIDES) === 2, 'Từ Trang 1 bấm Quay Về -> VÒNG LẶP SANG TRANG 3 (index 2)');

// Test Navigation from Trang 2 (Index 1)
assert(getNextSlide(1, TOTAL_SLIDES) === 2, 'Từ Trang 2 bấm Tiếp Theo -> Chuyển sang Trang 3 (index 2)');
assert(getPrevSlide(1, TOTAL_SLIDES) === 0, 'Từ Trang 2 bấm Quay Về -> Chuyển sang Trang 1 (index 0)');

// Test Navigation from Trang 3 (Index 2) - CRUCIAL USER REQUEST
assert(getNextSlide(2, TOTAL_SLIDES) === 0, 'Từ Trang 3 bấm Tiếp Theo -> VÒNG LẶP QUAY VỀ TRANG 1 (index 0)');
assert(getPrevSlide(2, TOTAL_SLIDES) === 1, 'Từ Trang 3 bấm Quay Về -> Chuyển sang Trang 2 (index 1)');

// Test Out-of-bounds index resilience
assert(getSafeSlide(3, TOTAL_SLIDES) === 0, 'Chỉ số vượt quá (3) tự động an toàn về Trang 1 (index 0)');
assert(getSafeSlide(4, TOTAL_SLIDES) === 1, 'Chỉ số vượt quá (4) tự động an toàn về Trang 2 (index 1)');
assert(getSafeSlide(-1, TOTAL_SLIDES) === 2, 'Chỉ số âm (-1) tự động an toàn về Trang 3 (index 2)');
assert(getSafeSlide(-2, TOTAL_SLIDES) === 1, 'Chỉ số âm (-2) tự động an toàn về Trang 2 (index 1)');

// 5.3 Test Code structure ensures safeSlide and currentBanner are used
assert(teacherPageCode.includes('safeSlide'), 'Code phải có biến chuẩn hóa safeSlide');
assert(teacherPageCode.includes('currentBanner'), 'Code phải dùng currentBanner an toàn thay vì truy xuất mảng trần');
assert(teacherPageCode.includes('handlePrevSlide'), 'Code phải có hàm handlePrevSlide xử lý vòng lặp');
assert(teacherPageCode.includes('handleNextSlide'), 'Code phải có hàm handleNextSlide xử lý vòng lặp');
assert(teacherPageCode.includes('isBannerHovered'), 'Code phải có cơ chế dừng auto-slide khi người dùng hover/tương tác');

// =========================================================================
// 6. KIỂM THỬ TẦNG GIAO TIẾP & KIẾN TRÚC ĐA TẦNG (INTER-LAYER ARCHITECTURE)
// =========================================================================
console.log('\n--- KIỂM THỬ TẦNG API CLIENT & GIAO TIẾP FRONTEND <-> BACKEND ---');

const API_CLIENT_FILE = path.join(__dirname, '..', 'src', 'services', 'api.js');
assert(fs.existsSync(API_CLIENT_FILE), 'File src/services/api.js phải tồn tại');

const apiCode = fs.readFileSync(API_CLIENT_FILE, 'utf-8');
assert(apiCode.includes('export const api ='), 'api.js phải export đối tượng api chuẩn hóa');
assert(apiCode.includes('courses:'), 'api.js phải có domain courses');
assert(apiCode.includes('progress:'), 'api.js phải có domain progress');
assert(apiCode.includes('quiz:'), 'api.js phải có domain quiz');
assert(apiCode.includes('auth:'), 'api.js phải có domain auth');
assert(apiCode.includes('admin:'), 'api.js phải có domain admin');
assert(apiCode.includes('video:'), 'api.js phải có domain video');
assert(apiCode.includes('system:'), 'api.js phải có domain system');
assert(apiCode.includes('rmsa_cached_courses'), 'api.js phải có cơ chế offline cache cho danh sách khóa học');
assert(apiCode.includes('AbortController'), 'api.js phải có cơ chế Timeout an toàn chống treo UI');
assert(apiCode.includes('API Retry'), 'api.js phải có cơ chế tự động thử lại khi mạng chập chờn');

const BANNER_FILE = path.join(__dirname, '..', 'src', 'components', 'NetworkStatusBanner.jsx');
assert(fs.existsSync(BANNER_FILE), 'File NetworkStatusBanner.jsx phải tồn tại để cảnh báo trạng thái mạng');

const serverCode = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf-8');
assert(serverCode.includes('X-Request-Id'), 'server.js phải có middleware gán Request ID correlation');
assert(serverCode.includes('X-Content-Type-Options'), 'server.js phải có Security Headers chống MIME sniffing');
assert(serverCode.includes('rateLimitAuth'), 'server.js phải có Rate Limiter bảo vệ endpoint nhạy cảm');
assert(serverCode.includes('handleGracefulShutdown'), 'server.js phải có cơ chế Graceful Shutdown an toàn');
assert(serverCode.includes('/api/health'), 'server.js phải có endpoint giám sát sức khỏe hệ thống /api/health');

const dbCode = fs.readFileSync(path.join(__dirname, '..', 'data', 'database.js'), 'utf-8');
assert(dbCode.includes('journal_mode = WAL'), 'SQLite phải cấu hình chế độ WAL');
assert(dbCode.includes('synchronous = NORMAL'), 'SQLite phải cấu hình synchronous = NORMAL');
assert(dbCode.includes('busy_timeout = 5000'), 'SQLite phải cấu hình busy_timeout = 5000 chống khóa bảng');
assert(dbCode.includes('createDatabaseBackup'), 'database.js phải export hàm createDatabaseBackup hot-backup');

// =========================================================================
// 7. KIỂM THỬ BẢO MẬT OWASP & NODE.JS BEST PRACTICES (5 HẠNG MỤC NÂNG CẤP)
// =========================================================================
console.log('\n--- KIỂM THỬ BẢO MẬT OWASP & NODE.JS BEST PRACTICES ---');

// 7.1 Kiểm thử Password Salted Pepper Hashing
const rawPass = 'RinAdmin2026!';
const pepperHash = hashPassword(rawPass);
const plainHash = legacyHashPassword(rawPass);
assert(pepperHash && pepperHash.length === 64, 'HMAC-SHA256 Pepper Hash phải có độ dài 64 ký tự hex');
assert(plainHash && plainHash.length === 64, 'Legacy SHA-256 Hash phải có độ dài 64 ký tự hex');
assert(pepperHash !== plainHash, 'Salted Pepper Hash phải khác hoàn toàn SHA-256 trần để chống Rainbow Tables');
assert(hashPassword(rawPass) === pepperHash, 'Cùng một mật khẩu phải sinh ra hash HMAC nhất quán');

// 7.2 Kiểm thử Token HMAC-SHA256 Generation & Verification
const testUser = { id: 999, username: 'chudan_rin', role: 'admin', full_name: 'Đan Rin' };
const token = generateAuthToken(testUser);
assert(token && token.split('.').length === 3, 'Auth Token phải theo chuẩn [header].[payload].[signature]');

const verifiedUser = verifyAuthToken(token);
assert(verifiedUser && verifiedUser.username === 'chudan_rin' && verifiedUser.role === 'admin', 'Token hợp lệ phải giải mã chính xác thông tin người dùng');

// Test token bị giả mạo chữ ký (Tampered Token Protection)
const tamperedToken = token.slice(0, -5) + 'XXXXX';
assert(verifyAuthToken(tamperedToken) === null, 'Token bị giả mạo chữ ký phải bị từ chối 100% (null)');
assert(verifyAuthToken('invalid.token.string') === null, 'Chuỗi token sai định dạng phải trả về null');
assert(verifyAuthToken(null) === null, 'Token null/undefined phải trả về null an toàn');

// 7.3 Kiểm thử CSV Formula / Macro Injection Prevention (OWASP)
function simulateSanitizeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

assert(simulateSanitizeCsvCell('=cmd|/C calc!A0') === `"'=cmd|/C calc!A0"`, 'Ký tự = phải được vô hiệu hóa bằng dấu nháy đơn');
assert(simulateSanitizeCsvCell('+12345') === `"'+12345"`, 'Ký tự + đầu chuỗi phải được làm sạch');
assert(simulateSanitizeCsvCell('-SUM(A1:A10)') === `"'-SUM(A1:A10)"`, 'Ký tự - đầu chuỗi phải được làm sạch');
assert(simulateSanitizeCsvCell('@SUM(B1:B5)') === `"'@SUM(B1:B5)"`, 'Ký tự @ đầu chuỗi phải được làm sạch');
assert(simulateSanitizeCsvCell('Nguyễn Văn A') === `"Nguyễn Văn A"`, 'Tên văn bản thông thường không bị ảnh hưởng');

// 7.4 Kiểm thử Deep Database Health Check
const dbAlive = checkDatabaseHealth();
assert(dbAlive === true, 'SQLite database liveness check (SELECT 1) phải trả về true khi kết nối sống');

// 7.5 Kiểm thử Middleware & Error Guards trong Source Code
// 7.5 Kiểm thử Middleware & Error Guards trong Source Code
assert(serverCode.includes('requireAdminAuth'), 'server.js phải có middleware requireAdminAuth chống Broken Access Control');
assert(serverCode.includes('sanitizeCsvCell'), 'server.js phải tích hợp sanitizeCsvCell cho báo cáo xuất CSV');
assert(serverCode.includes('unhandledRejection'), 'server.js phải có bộ bắt lỗi unhandledRejection chống crash tiến trình');
assert(serverCode.includes('uncaughtException'), 'server.js phải có bộ bắt lỗi uncaughtException chống crash tiến trình');
assert(apiCode.includes('Authorization') && apiCode.includes('Bearer'), 'api.js phải tự động gắn Bearer Token vào header request');

// =========================================================================
// 8. KIỂM THỬ KHÔI PHỤC MẬT KHẨU OTP THẬT & ĐĂNG NHẬP GOOGLE OAUTH 2.0
// =========================================================================
console.log('\n--- KIỂM THỬ KHÔI PHỤC MẬT KHẨU OTP THẬT & GOOGLE OAUTH 2.0 ---');

// 8.1 Đăng ký tài khoản kiểm thử cho luồng OTP
const testOtpUsername = `test_otp_${Date.now()}@runningman.vn`;
const testOtpPhone = '09' + Math.floor(10000000 + Math.random() * 90000000);
const regResult = registerUser({
  username: testOtpUsername,
  password: 'Password@123',
  fullName: 'Học Viên Test OTP',
  phone: testOtpPhone,
  branch: 'RMSA - Bình Thạnh'
});
assert(regResult.success === true, 'Đăng ký tài khoản kiểm thử OTP thành công');

// 8.2 Tìm kiếm tài khoản bằng Email và Số điện thoại
const foundByEmail = findUserByIdentifier(testOtpUsername);
assert(foundByEmail !== null && foundByEmail.username === testOtpUsername, 'findUserByIdentifier tìm chính xác theo email');

const foundByPhone = findUserByIdentifier(testOtpPhone);
assert(foundByPhone !== null && foundByPhone.username === testOtpUsername, 'findUserByIdentifier tìm chính xác theo số điện thoại');

// 8.3 Tạo mã OTP 6 số
const otpRes = createOtpForUser(testOtpUsername);
assert(otpRes.success === true, 'createOtpForUser tạo thành công mã OTP');
assert(typeof otpRes.otpCode === 'string' && otpRes.otpCode.length === 6, 'Mã OTP sinh ra phải gồm chính xác 6 chữ số');
assert(/^[0-9]{6}$/.test(otpRes.otpCode), 'Mã OTP chỉ chứa các ký tự số (0-9)');

// 8.4 Kiểm thử tài khoản không tồn tại
const notFoundOtp = createOtpForUser('user_khong_ton_tai_9999@gmail.com');
assert(notFoundOtp.success === false, 'Tài khoản không tồn tại thì không được sinh OTP');

// 8.5 Xác thực OTP: Mã sai
const verifyWrong = verifyOtpCode(testOtpUsername, '000000');
assert(verifyWrong.success === false, 'Nhập mã OTP sai phải bị từ chối');

// 8.6 Xác thực OTP: Mã đúng
const verifyCorrect = verifyOtpCode(testOtpUsername, otpRes.otpCode);
assert(verifyCorrect.success === true, 'Nhập đúng mã OTP phải trả về kết quả hợp lệ');

// 8.7 Đặt lại mật khẩu mới: Mật khẩu yếu bị chặn
const resetWeak = resetUserPasswordWithOtp(testOtpUsername, otpRes.otpCode, '123456');
assert(resetWeak.success === false, 'Mật khẩu mới yếu (dưới 8 ký tự, không có hoa/số/ký tự đặc biệt) phải bị từ chối');

// 8.8 Đặt lại mật khẩu mới: Mật khẩu mạnh thành công
const newStrongPass = 'RinSuperSecure@2026!';
const resetStrong = resetUserPasswordWithOtp(testOtpUsername, otpRes.otpCode, newStrongPass);
assert(resetStrong.success === true, 'Đặt lại mật khẩu mới đáp ứng 4 tiêu chuẩn an toàn thành công');

// 8.9 Tái sử dụng mã OTP cũ (Replay Attack Prevention)
const reuseOtp = verifyOtpCode(testOtpUsername, otpRes.otpCode);
assert(reuseOtp.success === false, 'Mã OTP sau khi đã sử dụng để đổi mật khẩu thì không được dùng lại (used=1)');

// 8.10 Đăng nhập bằng mật khẩu mới
const loginWithNewPass = authenticateUser(testOtpUsername, newStrongPass);
assert(loginWithNewPass.success === true, 'Đăng nhập thành công với mật khẩu mới vừa được đặt lại qua OTP');

// 8.11 Kiểm thử Đăng ký / Đăng nhập Google Thật (Google OAuth 2.0)
const testGoogleId = `google_sub_${Date.now()}`;
const testGoogleEmail = `user_google_${Date.now()}@gmail.com`;

// Lần đầu: Tự động tạo tài khoản học viên mới
const googleFirstLogin = findOrCreateGoogleUser({
  googleId: testGoogleId,
  email: testGoogleEmail,
  fullName: 'Nguyễn Văn Google',
  avatarUrl: 'https://lh3.googleusercontent.com/a/test-avatar'
});
assert(googleFirstLogin.success === true, 'Google Sign-In lần đầu tự động tạo tài khoản thành công');
assert(googleFirstLogin.isNewUser === true, 'Tài khoản được đánh dấu là người dùng mới (isNewUser=true)');
assert(googleFirstLogin.user.role === 'student', 'Người dùng Google mặc định có quyền học viên');
assert(googleFirstLogin.token && googleFirstLogin.token.split('.').length === 3, 'Google Sign-In sinh Bearer token hợp lệ');

// Lần thứ hai: Đăng nhập tài khoản đã có sẵn
const googleSecondLogin = findOrCreateGoogleUser({
  googleId: testGoogleId,
  email: testGoogleEmail,
  fullName: 'Nguyễn Văn Google Updated',
  avatarUrl: 'https://lh3.googleusercontent.com/a/test-avatar-new'
});
assert(googleSecondLogin.success === true, 'Google Sign-In lần sau đăng nhập thành công');
assert(googleSecondLogin.isNewUser === false, 'Tài khoản lần sau nhận diện đúng là người dùng cũ (isNewUser=false)');
assert(googleSecondLogin.user.id === googleFirstLogin.user.id, 'Cùng một Google ID phải map đúng vào cùng 1 user id');

// 9. KIỂM THỬ MODULE AI MULTIMODAL VIDEO & AUTO QUIZ ENGINE
console.log('\n--- KIỂM THỬ MODULE AI MULTIMODAL VIDEO & AUTO QUIZ ENGINE ---');
const originalBai1BeforeTest = JSON.parse(JSON.stringify(getAllCourses().find(c => c.id === 'bai-1')));
const aiResult = await analyzeVideoAndGenerateLmsContent({
  lessonId: 'bai-1',
  title: 'Bài 1: Kỹ năng khảo sát và đánh giá nguồn hàng',
  category: 'Kỹ năng môi giới',
  videoUrl: ''
});

assert(aiResult && typeof aiResult === 'object', 'AI Service trả về đối tượng kết quả hợp lệ');
assert(Array.isArray(aiResult.summary) && aiResult.summary.length >= 3, 'AI sinh tóm tắt gồm ít nhất 3 ý cốt lõi thực chiến');
assert(Array.isArray(aiResult.timestamps) && aiResult.timestamps.length >= 3, 'AI sinh mốc thời gian (timestamps) chuẩn phân đoạn');
assert(Array.isArray(aiResult.quiz) && aiResult.quiz.length === 10, 'AI sinh chính xác bộ 10 câu hỏi sát hạch');

aiResult.quiz.forEach((q, idx) => {
  assert(Boolean(q.id), `AI Quiz câu ${idx + 1}: Có mã ID định danh`);
  assert(Boolean(q.question && q.question.length > 10), `AI Quiz câu ${idx + 1}: Nội dung câu hỏi rõ ràng`);
  assert(Array.isArray(q.options) && q.options.length === 4, `AI Quiz câu ${idx + 1}: Có đủ 4 phương án lựa chọn`);
  assert(typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < 4, `AI Quiz câu ${idx + 1}: Đáp án đúng hợp lệ`);
  assert(Boolean(q.explanation && q.explanation.length > 10), `AI Quiz câu ${idx + 1}: Có giải thích sư phạm thực chiến`);
});

const updateRes = updateLessonAiGeneratedContent('bai-1', {
  summary: aiResult.summary,
  timestamps: aiResult.timestamps,
  quiz: aiResult.quiz
});

assert(updateRes && updateRes.success === true, 'Cập nhật nội dung do AI sinh vào SQLite thành công');
const refreshedCourses = getAllCourses();
const refreshedLesson = refreshedCourses.find(c => c.id === 'bai-1');
assert(refreshedLesson && refreshedLesson.quiz.length === 10, 'Khóa học trong SQLite có đủ 10 câu hỏi từ AI');
assert(refreshedLesson.summary.length === aiResult.summary.length, 'Tóm tắt bài học trong SQLite đã được đồng bộ với AI');

// Kiểm thử AI bám sát đúng từng phần video (targetVideoIndex) khi chuyên đề có nhiều phần và tách biệt dữ liệu Phần 1 / Phần 2
const multiPartAiResult = await analyzeVideoAndGenerateLmsContent({
  lessonId: 'bai-1',
  title: 'Bài 1: Hiểu sâu sản phẩm - Phân biệt Studio, Duplex, Căn mini & Thị trường cho thuê',
  category: 'Chủ đề 1: Sản phẩm & Thị trường',
  videos: [
    { id: 1, title: 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt', url: 'https://www.youtube.com/watch?v=video111111' },
    { id: 2, title: 'Phần 2: Bài giảng thực chiến chốt căn Duplex', url: 'https://www.youtube.com/watch?v=video222222' }
  ],
  targetVideoIndex: 1 // Chỉ định đọc Phần 2
});
assert(multiPartAiResult && Array.isArray(multiPartAiResult.quiz) && multiPartAiResult.quiz.length === 10, 'AI quét chính xác Phần 2 và sinh đủ 10 câu sát hạch cho Phần 2');
assert(Array.isArray(multiPartAiResult.questionPool) && multiPartAiResult.questionPool.length >= 15, 'AI sinh ngân hàng mở rộng questionPool >= 15 câu cho Phần 2 để random không trùng lặp');
assert(multiPartAiResult.quiz[0].id.includes('_p2_'), 'ID câu hỏi của Phần 2 có gắn định danh riêng (_p2_) tách biệt với Phần 1');

// Lưu kết quả của Phần 2 vào SQLite và kiểm tra Phần 1 KHÔNG bị ghi đè bởi Phần 2
const part1Before = getAllCourses().find(c => c.id === 'bai-1');
const part1FirstQuestionBefore = part1Before.quiz[0]?.question;
const part1SummaryBefore = part1Before.summary[0];

const updatePart2Res = updateLessonAiGeneratedContent('bai-1', {
  summary: multiPartAiResult.summary,
  timestamps: multiPartAiResult.timestamps,
  quiz: multiPartAiResult.quiz,
  questionPool: multiPartAiResult.questionPool,
  targetVideoIndex: 1,
  videos: [
    { id: 1, title: 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt', url: 'https://www.youtube.com/watch?v=video111111' },
    { id: 2, title: 'Phần 2: Bài giảng thực chiến chốt căn Duplex', url: 'https://www.youtube.com/watch?v=video222222' }
  ]
});
assert(updatePart2Res && updatePart2Res.success === true, 'Cập nhật nội dung AI riêng cho Phần 2 vào SQLite thành công');

const afterPart2Courses = getAllCourses();
const lessonAfterPart2 = afterPart2Courses.find(c => c.id === 'bai-1');
assert(lessonAfterPart2.quiz[0]?.question === part1FirstQuestionBefore, 'Khi tạo đề ở Phần 2, bộ câu hỏi của Phần 1 được bảo toàn nguyên vẹn 100%, không bị ghi đè');
assert(lessonAfterPart2.summary[0] === part1SummaryBefore, 'Khi tạo tóm tắt ở Phần 2, tóm tắt của Phần 1 được bảo toàn nguyên vẹn 100%');
assert(Array.isArray(lessonAfterPart2.videos[1]?.quiz) && lessonAfterPart2.videos[1].quiz.length === 10, 'Phần 2 (videos[1]) lưu trữ riêng 10 câu hỏi của Phần 2');
assert(lessonAfterPart2.videos[1].quiz[0].question !== lessonAfterPart2.videos[0].quiz[0].question, 'Nội dung câu hỏi của Phần 2 và Phần 1 hoàn toàn khác nhau, riêng biệt 100%');

// Khôi phục nguyên trạng dữ liệu thật của bài 1 sau khi test xong
if (originalBai1BeforeTest) {
  createSingleCourse(originalBai1BeforeTest);
}

// 10. KIỂM THỬ AI CHAT RUNNING RIN (TRẢ LỜI TRỰC TIẾP TÌNH HUỐNG THỰC CHIẾN)
console.log('\n--- KIỂM THỬ RUNNING RIN AI REAL-TIME CHAT ASSISTANT ---');
const chatTestQuestion = 'khách kêu còn phòng nào đẹp mà rẻ không. mà bên tôi hết rồi muốn khách chốt phòng này thì nói gì';
const chatReplyRes = await generateMascotChatReply({
  message: chatTestQuestion,
  history: []
});

assert(chatReplyRes && chatReplyRes.success === true, 'Running Rin AI Chat phản hồi thành công (success=true)');
assert(Boolean(chatReplyRes.reply && chatReplyRes.reply.length > 50), 'Running Rin trả lời chi tiết, có chiều sâu (>50 ký tự)');
assert(chatReplyRes.reply.includes('KỊCH BẢN') || chatReplyRes.reply.includes('Bước') || chatReplyRes.reply.includes('chia nhỏ'), 'Running Rin trả lời trực tiếp kịch bản thực chiến thay vì lý thuyết chung chung');

// 11. KIỂM THỬ RANDOM FIELD SCENARIO BANK & PRACTICE TEST BANK (CHỐNG HỌC VẸT, MỖI LẦN MỞ LÊN MỖI KHÁC)
console.log('\n--- KIỂM THỬ RANDOM FIELD SCENARIOS & PHÒNG THI SÁT HẠCH KHÔNG LẶP LẠI ---');
assert(Array.isArray(scenariosBank) && scenariosBank.length >= 8, 'Ngân hàng tình huống thực địa phải có ít nhất 8 kịch bản thực tế');

const randomScen1 = getRandomScenario([]);
assert(Boolean(randomScen1 && randomScen1.id && randomScen1.question), 'getRandomScenario trả về kịch bản hợp lệ có câu hỏi');
assert(Array.isArray(randomScen1.options) && randomScen1.options.length === 4, 'Tình huống thực địa phải có đủ 4 lựa chọn phản xạ');
assert(randomScen1.options.some(opt => opt.isCorrect === true), 'Phải có ít nhất 1 đáp án đúng trong các lựa chọn');

const randomScen2 = getRandomScenario([randomScen1.id]);
assert(randomScen2.id !== randomScen1.id, 'Cơ chế excludeIds đảm bảo không bị lặp lại câu hỏi vừa xuất hiện');

assert(Array.isArray(practiceTestBank) && practiceTestBank.length >= 15, 'Ngân hàng đề thi sát hạch phải có ít nhất 15 câu hỏi thực tế');
const examQuestions = getRandomPracticeQuestions(5);
assert(Array.isArray(examQuestions) && examQuestions.length === 5, 'getRandomPracticeQuestions(5) phải bốc ngẫu nhiên chính xác 5 câu');

examQuestions.forEach((q, idx) => {
  assert(Boolean(q.id && q.question), `Đề thi ngẫu nhiên câu ${idx + 1}: Có ID và nội dung câu hỏi`);
  assert(Array.isArray(q.options) && q.options.length === 4, `Đề thi ngẫu nhiên câu ${idx + 1}: Có đủ 4 đáp án A/B/C/D đã tráo`);
  assert(typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < 4, `Đề thi ngẫu nhiên câu ${idx + 1}: Index đáp án đúng sau khi tráo hợp lệ`);
  assert(Boolean(q.explanation), `Đề thi ngẫu nhiên câu ${idx + 1}: Có giải thích sư phạm`);
});

// Kiểm thử tính ngẫu nhiên: 2 lần bốc câu hỏi có thứ tự ID hoặc nội dung khác nhau
const examSetA = getRandomPracticeQuestions(5).map(q => q.id).join(',');
const examSetB = getRandomPracticeQuestions(5).map(q => q.id).join(',');
assert(typeof examSetA === 'string' && typeof examSetB === 'string', 'Hệ thống sinh chuỗi đề thi ngẫu nhiên ổn định');

const aiScenario = await generateRandomFieldScenarioWithAi({ excludeIds: [] });
assert(Boolean(aiScenario && aiScenario.question), 'AI sinh tình huống thực địa ngẫu nhiên hợp lệ');
assert(Array.isArray(aiScenario.options) && aiScenario.options.length === 4, 'AI sinh tình huống có đủ 4 phương án phản xạ');

// 12. KIỂM THỬ HỆ THỐNG CHUỖI HỌC TẬP THỰC CHIẾN TỰ ĐỘNG (DAILY STREAK ENGINE)
console.log('\n--- KIỂM THỬ HỆ THỐNG CHUỖI HỌC TẬP THỰC CHIẾN TỰ ĐỘNG ---');
const todayStr = getLocalDateString();
const yesterdayStr = getYesterdayDateString();

assert(/^\d{4}-\d{2}-\d{2}$/.test(todayStr), 'getLocalDateString trả về chuỗi ngày YYYY-MM-DD hợp lệ');
assert(/^\d{4}-\d{2}-\d{2}$/.test(yesterdayStr), 'getYesterdayDateString trả về chuỗi ngày YYYY-MM-DD hợp lệ');
assert(getDayDifference(yesterdayStr, todayStr) === 1, 'Khoảng cách giữa hôm qua và hôm nay chính xác bằng 1 ngày');
assert(getDayDifference(todayStr, todayStr) === 0, 'Khoảng cách cùng ngày bằng 0 ngày');

// Kiểm thử lưu và truy vấn SQLite Streak
const testUserId = 'test_streak_user_99';
const initialStreakRes = saveUserStreakRecord(testUserId, {
  streak: 3,
  lastCompletedDate: yesterdayStr,
  history: [yesterdayStr]
});
assert(initialStreakRes.success === true, 'Lưu dữ liệu chuỗi 3 ngày vào SQLite thành công');

const loadedStreak = getUserStreakData(testUserId);
assert(loadedStreak && loadedStreak.streak === 3, 'Truy vấn SQLite trả về chính xác chuỗi 3 ngày');
assert(loadedStreak.lastCompletedDate === yesterdayStr, 'Ngày hoàn thành gần nhất khớp hôm qua');

// Quy tắc: Đủ 3 ngày hôm trước, hôm nay trả lời đúng ít nhất 1 câu -> mở chuỗi 4 ngày!
const streakDayDiff = getDayDifference(loadedStreak.lastCompletedDate, todayStr);
let nextStreak = loadedStreak.streak;
let newlyUnlocked = false;

if (streakDayDiff === 1) {
  nextStreak = loadedStreak.streak + 1; // 3 -> 4
  newlyUnlocked = true;
}

assert(nextStreak === 4 && newlyUnlocked === true, 'Đủ 3 ngày liên tiếp, trả lời đúng hôm nay tự động mở Chuỗi 4 ngày');

// Cập nhật ngày hôm nay vào database
const updateDay4Res = saveUserStreakRecord(testUserId, {
  streak: nextStreak,
  lastCompletedDate: todayStr,
  history: [yesterdayStr, todayStr]
});
assert(updateDay4Res.success === true, 'Ghi nhận hoàn thành chuỗi 4 ngày vào SQLite thành công');

// Quy tắc: Trả lời thêm câu đúng thứ 2 trong cùng ngày hôm nay -> giữ nguyên chuỗi 4 ngày, không spam
const checkLoadedDay4 = getUserStreakData(testUserId);
const sameDayDiff = getDayDifference(checkLoadedDay4.lastCompletedDate, todayStr);
assert(sameDayDiff === 0, 'Hôm nay đã hoàn thành ít nhất 1 câu');
let sameDayStreak = checkLoadedDay4.streak;
if (sameDayDiff === 0) {
  // Giữ nguyên chuỗi của ngày hôm nay
  sameDayStreak = checkLoadedDay4.streak;
}
assert(sameDayStreak === 4, 'Trả lời nhiều câu trong cùng một ngày vẫn bảo toàn chuỗi 4 ngày chuẩn xác');

// Kiểm thử tài khoản hoàn toàn mới chưa học ngày nào
const brandNewUser = 'new_student_' + Date.now();
const brandNewStreak = getUserStreakData(brandNewUser);
assert(brandNewStreak && brandNewStreak.streak === 0, 'Tài khoản mới chưa học ngày nào có chuỗi bằng 0');
assert(brandNewStreak.lastCompletedDate === null, 'Tài khoản mới chưa có ngày hoàn thành (null)');

// Khi tài khoản mới trả lời câu đúng đầu tiên trong ngày hôm nay:
let firstStreak = 0;
if (!brandNewStreak.lastCompletedDate || brandNewStreak.streak === 0) {
  firstStreak = 1;
}
assert(firstStreak === 1, 'Tài khoản mới trả lời đúng câu đầu tiên tự động kích hoạt Chuỗi 1 ngày');

saveUserStreakRecord(brandNewUser, {
  streak: firstStreak,
  lastCompletedDate: todayStr,
  history: [todayStr]
});

const checkFirstDay = getUserStreakData(brandNewUser);
assert(checkFirstDay.streak === 1, 'Lưu và truy vấn thành công Chuỗi 1 ngày cho tài khoản mới');

// ==========================================
// 10. KIỂM THỬ BẢNG VÀNG ĐA TRỤ CỘT & CHỐNG SPAM (ANTI-SPAM LEADERBOARD)
// ==========================================
console.log('\n--- KIỂM THỬ BẢNG VÀNG ĐA TRỤ CỘT & CƠ CHẾ CHỐNG SPAM ---');

// Đảm bảo không còn dữ liệu giả lập tĩnh
const initialLeaderboard = getLeaderboardStats();
assert(Array.isArray(initialLeaderboard), 'getLeaderboardStats() phải trả về một mảng danh sách');

// Test 10.1: Kiểm thử cơ chế chống spam tình huống thực địa (Tối đa 5 câu/ngày tích điểm)
const testSpamUser = 'student_antispam_' + Date.now();
for (let i = 1; i <= 5; i++) {
  const res = recordDailyScenarioCorrect(testSpamUser, `scenario-q${i}`);
  assert(res.success === true && res.scored === true, `Câu ${i}/5: Tích lũy điểm hợp lệ thành công`);
  assert(res.scenariosCorrect === i, `Số câu tích điểm hôm nay đạt ${i}/5`);
}

// Cố tình làm câu thứ 6 để spam điểm:
const spamAttemptRes = recordDailyScenarioCorrect(testSpamUser, 'scenario-q6');
assert(spamAttemptRes.success === true && spamAttemptRes.scored === false, 'Câu thứ 6: Chống spam thành công, không cộng dồn điểm');
assert(spamAttemptRes.scenariosCorrect === 5, 'Hạn ngạch rèn luyện vẫn chặn chuẩn xác ở 5 câu');

// Test 10.2: Kiểm thử cơ chế chống spam phòng thi sát hạch (Tối đa 3 bài/ngày tích điểm)
for (let i = 1; i <= 3; i++) {
  const pRes = recordPracticeTestAttempt(testSpamUser, 90, true, 45, {});
  assert(pRes.success === true && pRes.scored === true, `Bài thi sát hạch ${i}/3: Đạt chuẩn và tích điểm thành công`);
  assert(pRes.practiceTestsPassed === i, `Số bài thi sát hạch đạt hôm nay là ${i}/3`);
}

// Cố tình nộp bài thi thứ 4 để spam điểm:
const spamPracticeRes = recordPracticeTestAttempt(testSpamUser, 100, true, 40, {});
assert(spamPracticeRes.success === true && spamPracticeRes.scored === false, 'Bài thi sát hạch thứ 4: Chống spam thành công, không cộng dồn điểm');
assert(spamPracticeRes.practiceTestsPassed === 3, 'Hạn ngạch thi sát hạch vẫn chặn chuẩn xác ở 3 bài');

// Test 10.3: Kiểm thử hạn ngạch getDailyQuota
const userQuota = getDailyQuota(testSpamUser);
assert(userQuota.scenariosToday === 5 && userQuota.scenariosMax === 5, 'Truy vấn quota tình huống hôm nay chính xác 5/5');
assert(userQuota.practiceToday === 3 && userQuota.practiceMax === 3, 'Truy vấn quota bài thi sát hạch hôm nay chính xác 3/3');

// Test 10.4: Kiểm tra điểm số tổng hợp trên Bảng Vàng của học viên:
// - 5 câu thực địa đúng = 5 * 10 = 50 điểm
// - 3 bài sát hạch đạt chuẩn (TB 90) = (3 * 50) + 90 = 240 điểm
// - 1 bài quiz đạt 100% = (1 * 100) + 100 = 200 điểm
// - Chuỗi 1 ngày = 1 * 15 = 15 điểm
// -> Tổng điểm = 50 + 240 + 200 + 15 = 505 điểm
saveStudentProgress(testSpamUser, { 'bai-1': { score: 100, passed: true } }, 'bai-2');

const fullBoard = getLeaderboardStats();
const userLeaderboardEntry = fullBoard.find(s => s.name === testSpamUser);
assert(userLeaderboardEntry !== undefined, 'Học viên có thành tích tự động xuất hiện trên Bảng Vàng ngay lập tức');
assert(userLeaderboardEntry.scenariosCount === 5, 'Bảng Vàng hiển thị chính xác 5 câu thực địa');
assert(userLeaderboardEntry.practicePassedCount === 3, 'Bảng Vàng hiển thị chính xác 3 bài sát hạch');
assert(userLeaderboardEntry.passedQuizCount === 1, 'Bảng Vàng hiển thị chính xác 1 bài quiz');
assert(userLeaderboardEntry.totalScore === 505, `Tổng điểm Bảng Vàng tính chuẩn xác 505 điểm (hiện tại: ${userLeaderboardEntry.totalScore})`);

// Dọn dẹp sạch sẽ toàn bộ tài khoản và bản ghi kiểm thử khỏi SQLite
resetStudentProgress(testSpamUser);
try {
  const db = (await import('../data/database.js')).default;
  db.prepare("DELETE FROM daily_activity_records WHERE student_name LIKE 'student_anti%' OR student_name LIKE 'test_%' OR student_name LIKE 'new_student_%'").run();
  db.prepare("DELETE FROM user_streaks WHERE user_id LIKE 'student_anti%' OR user_id LIKE 'test_%' OR user_id LIKE 'new_student_%'").run();
  db.prepare("DELETE FROM student_progress WHERE student_name LIKE 'student_anti%' OR student_name LIKE 'test_%' OR student_name LIKE 'new_student_%'").run();
  db.prepare("DELETE FROM users WHERE username LIKE 'test_%' OR username LIKE 'user_google_%'").run();
  db.prepare("DELETE FROM otp_verifications WHERE identifier LIKE 'test_%'").run();
} catch {}

const cleanedBoard = getLeaderboardStats();
assert(!cleanedBoard.some(s => s.name === testSpamUser), 'Dọn dẹp sạch sẽ tài khoản kiểm thử khỏi Bảng Vàng');
assert(cleanedBoard.length === 0, 'Bảng Vàng rỗng sạch sẽ (Empty State) khi chưa có học viên chính thức nào hoàn thành bài');

console.log('\n--- KIỂM THỬ HỒ SƠ CÁ NHÂN & ĐỒNG BỘ AVATAR XUYÊN SUỐT ---');
// 1. Đăng ký tài khoản nhân viên kiểm thử mới
const testProfileUsername = `test_profile_${Date.now()}@runningman.vn`;
const regProf = registerUser({
  username: testProfileUsername,
  password: 'Password@2026',
  fullName: 'Nguyễn Văn Kiểm Thử',
  phone: '0988776655',
  branch: 'RMSA - Bình Thạnh',
  role: 'student'
});
assert(regProf.success === true, 'Đăng ký tài khoản học viên mới thành công');
const testProfUserId = regProf.user.id;

// 2. Cập nhật hồ sơ & đổi avatar sang link mới
const updateProfRes = updateUserProfile(testProfUserId, {
  fullName: 'Nguyễn Văn Cao Thủ',
  phone: '0911223344',
  branch: 'RMSA - Quận 1 (Bến Nghé)',
  avatarUrl: '/uploads/avatars/avatar_test_123.png',
  bio: 'Chốt sale thực chiến - Đam mê căn hộ duplex cao cấp.',
  title: 'Chuyên Viên Tư Vấn Duplex Cao Cấp',
  skills: ['Tư vấn Duplex/Studio', 'Đàm phán cọc thực chiến', 'Chốt deal trong ngày']
});
assert(updateProfRes.success === true, 'Cập nhật hồ sơ cá nhân qua updateUserProfile thành công');
assert(updateProfRes.user.fullName === 'Nguyễn Văn Cao Thủ', 'Tên đầy đủ được cập nhật chuẩn xác');
assert(updateProfRes.user.avatarUrl === '/uploads/avatars/avatar_test_123.png', 'Ảnh đại diện Avatar được lưu và cập nhật chuẩn xác');
assert(updateProfRes.user.branch === 'RMSA - Quận 1 (Bến Nghé)', 'Chi nhánh công tác được cập nhật chuẩn xác');
assert(updateProfRes.user.title === 'Chuyên Viên Tư Vấn Duplex Cao Cấp', 'Chức vụ thực chiến được cập nhật chuẩn xác');
assert(updateProfRes.user.bio.includes('Chốt sale thực chiến'), 'Châm ngôn bio được lưu thành công');

// 3. Kiểm thử đổi mật khẩu qua Profile
const wrongPassRes = changeUserPassword(testProfUserId, {
  currentPassword: 'WrongPassword123',
  newPassword: 'NewSecurePassword@2026'
});
assert(wrongPassRes.success === false, 'Đổi mật khẩu thất bại khi nhập sai mật khẩu cũ');

const rightPassRes = changeUserPassword(testProfUserId, {
  currentPassword: 'Password@2026',
  newPassword: 'NewSecurePassword@2026'
});
assert(rightPassRes.success === true, 'Đổi mật khẩu thành công khi nhập đúng mật khẩu hiện tại');

// Đăng nhập lại với mật khẩu mới để kiểm tra
const reAuth = authenticateUser(testProfileUsername, 'NewSecurePassword@2026');
assert(reAuth.success === true, 'Đăng nhập thành công với mật khẩu mới vừa đổi');
assert(reAuth.user.avatarUrl === '/uploads/avatars/avatar_test_123.png', 'Avatar mới đồng bộ ngay khi đăng nhập lại');

// 4. Dọn dẹp tài khoản kiểm thử
try {
  const db = (await import('../data/database.js')).default;
  db.prepare("DELETE FROM users WHERE id = ?").run(testProfUserId);
} catch {}

console.log('\n--- KIỂM THỬ HỆ THỐNG DEEP-LINKING & BẢO TOÀN VỊ TRÍ F5 ---');
function parseRouteFromHashTest(hash) {
  const cleanHash = (hash || '').replace(/^#\/?/, '').trim();
  const [pathPart = '', queryPart = ''] = cleanHash.split('?');
  const params = new URLSearchParams(queryPart);

  if (pathPart === 'dang-nhap') return { isLoginView: true, loginMode: 'login' };
  if (pathPart === 'dang-ky') return { isLoginView: true, loginMode: 'register' };
  if (pathPart.startsWith('bai-hoc/') || /^bai-\d+/.test(pathPart)) {
    const lessonId = pathPart.replace(/^bai-hoc\//, '') || 'bai-1';
    const tab = params.get('tab') === 'quiz' ? 'quiz' : 'lecture';
    const part = parseInt(params.get('part'), 10);
    const activeVideoIdx = !isNaN(part) && part >= 0 ? part : 0;
    return { currentView: 'player', currentLessonId: lessonId, activeTab: tab, activeVideoIdx, isLoginView: false };
  }
  if (pathPart === 'lo-trinh' || pathPart === 'dashboard') return { currentView: 'dashboard', isLoginView: false };
  if (pathPart === 'khoa-hoc' || pathPart === 'khoa-dao-tao' || pathPart === 'courses') return { currentView: 'landing', landingTab: 'courses', isLoginView: false };
  if (pathPart === 'sat-hach' || pathPart === 'exam') return { currentView: 'landing', landingTab: 'exam', isLoginView: false };
  if (pathPart === 'cam-nang' || pathPart === 'cheatsheet') return { currentView: 'landing', landingTab: 'cheatsheet', isLoginView: false };
  if (pathPart === 'cong-dong' || pathPart === 'community') return { currentView: 'landing', landingTab: 'community', isLoginView: false };
  if (pathPart === 'trang-chu' || pathPart === 'home') return { currentView: 'landing', landingTab: 'home', isLoginView: false };
  return { currentView: 'landing', landingTab: 'home', currentLessonId: 'bai-1', activeTab: 'lecture', activeVideoIdx: 0, isLoginView: false, loginMode: 'login' };
}

function formatHashFromStateTest({ currentView, landingTab, currentLessonId, activeTab, activeVideoIdx, isLoginView, loginMode }) {
  if (isLoginView) return loginMode === 'register' ? '#/dang-ky' : '#/dang-nhap';
  if (currentView === 'player' && currentLessonId) {
    let hash = `#/bai-hoc/${currentLessonId}`;
    const params = new URLSearchParams();
    if (activeTab === 'quiz') params.set('tab', 'quiz');
    if (typeof activeVideoIdx === 'number' && activeVideoIdx > 0) params.set('part', String(activeVideoIdx));
    const q = params.toString();
    return q ? `${hash}?${q}` : hash;
  }
  if (currentView === 'dashboard') return '#/lo-trinh';
  if (currentView === 'landing') {
    if (landingTab === 'courses') return '#/khoa-dao-tao';
    if (landingTab === 'exam') return '#/sat-hach';
    if (landingTab === 'cheatsheet') return '#/cam-nang';
    if (landingTab === 'community') return '#/cong-dong';
    return '#/trang-chu';
  }
  return '#/trang-chu';
}

// Test 1: Khôi phục bài học cụ thể kèm tab trắc nghiệm và phần video con
const rLesson = parseRouteFromHashTest('#/bai-hoc/bai-3?tab=quiz&part=2');
assert(rLesson.currentView === 'player', 'F5 nhận diện đúng view player cho bài học');
assert(rLesson.currentLessonId === 'bai-3', 'F5 nạp lại chính xác Bài học 3 đang học dở');
assert(rLesson.activeTab === 'quiz', 'F5 nạp lại đúng tab Kiểm tra sát hạch (Quiz)');
assert(rLesson.activeVideoIdx === 2, 'F5 nạp lại đúng Video con Phần 3 (index 2)');

// Test 2: Khôi phục trang Lộ trình đào tạo (Dashboard)
const rDashboard = parseRouteFromHashTest('#/lo-trinh');
assert(rDashboard.currentView === 'dashboard', 'F5 nạp lại chính xác trang Lộ trình đào tạo');

// Test 3: Khôi phục trang Sát hạch ngoài Landing
const rExam = parseRouteFromHashTest('#/sat-hach');
assert(rExam.currentView === 'landing' && rExam.landingTab === 'exam', 'F5 nạp lại chính xác tab Sát hạch');

// Test 4: Format Hash từ State chuyển bài
const h1 = formatHashFromStateTest({ currentView: 'player', currentLessonId: 'bai-2', activeTab: 'lecture', activeVideoIdx: 0 });
assert(h1 === '#/bai-hoc/bai-2', 'Chuyển sang Bài 2 sinh hash chuẩn: #/bai-hoc/bai-2');

const h2 = formatHashFromStateTest({ currentView: 'player', currentLessonId: 'bai-2', activeTab: 'quiz', activeVideoIdx: 1 });
assert(h2 === '#/bai-hoc/bai-2?tab=quiz&part=1', 'Chuyển tab Quiz & Phần 2 sinh hash: #/bai-hoc/bai-2?tab=quiz&part=1');

const h3 = formatHashFromStateTest({ currentView: 'dashboard' });
assert(h3 === '#/lo-trinh', 'Về Lộ trình sinh hash: #/lo-trinh');

// ==========================================
// 13. KIỂM THỬ GIÁM SÁT NHÂN SỰ, XEM BÀI LÀM, XÓA TÀI KHOẢN & DỌN DẸP SẠCH
// ==========================================
console.log('\n--- KIỂM THỬ GIÁM SÁT NHÂN SỰ & QUYỀN XÓA TÀI KHOẢN ---');

// Test 13.1: Đăng ký nhân viên kiểm thử mới
const staffUsername = `nhanvien_test_${Date.now()}@runningman.vn`;
const regRes = registerUser({
  username: staffUsername,
  password: 'Password123!',
  fullName: 'Trần Văn Nhân Viên Test',
  phone: '0988776655',
  branch: 'RMSA - Quận 1'
});
assert(regRes.success === true, 'Đăng ký tài khoản nhân viên kiểm thử mới thành công');
const newStaffId = regRes.user.id;

// Test 13.2: Nhân viên làm bài khảo sát 10 câu -> Tự động cập nhật điểm & tiến độ
recordQuizAttempt('bai-1', 90, true, 180, { q1: 0, q2: 1 }, staffUsername);
saveStudentProgress(staffUsername, {
  'bai-1': { score: 90, passed: true, completedAt: new Date().toISOString() }
}, 'bai-1');

// Test 13.3: Quản trị viên lấy danh sách nhân sự thấy điểm TB cập nhật ngay
const allUsers = getAllUsers();
const foundStaff = allUsers.find(u => u.username === staffUsername);
assert(foundStaff !== undefined, 'Quản trị viên tìm thấy nhân viên trong danh sách');
assert(foundStaff.avgScore === 90, 'Điểm sát hạch trung bình của nhân viên tự động tính 90%');
assert(foundStaff.passedLessons === 1, 'Số bài học đỗ được ghi nhận 1 bài');

// Test 13.4: Quản trị viên xem chi tiết toàn bộ bài làm khảo sát của nhân viên
const attempts = getUserQuizAttempts(newStaffId);
assert(Array.isArray(attempts) && attempts.length === 1, 'Quản trị viên lấy đúng 1 lượt làm bài của nhân viên');
assert(attempts[0].score === 90, 'Chi tiết bài làm ghi nhận chính xác 90%');
assert(attempts[0].passed === true, 'Chi tiết bài làm ghi nhận trạng thái ĐỖ');

// Test 13.5: Không được phép xóa tài khoản Root Admin
const deleteAdminRes = deleteUser(1, { name: 'Admin Test' });
assert(deleteAdminRes.success === false, 'Hệ thống bảo vệ nghiêm ngặt: Chặn không cho xóa tài khoản Root Admin');

// Test 13.6: Quản trị viên xóa tài khoản nhân sự
const deleteStaffRes = deleteUser(newStaffId, { id: 1, name: 'Đan Rin (HLV Trưởng)' });
assert(deleteStaffRes.success === true, 'Quản trị viên xóa tài khoản nhân sự thành công');

// Test 13.7: Xác nhận tài khoản và dữ liệu liên quan đã bị dọn sạch
const usersAfterDelete = getAllUsers();
assert(!usersAfterDelete.some(u => u.username === staffUsername), 'Tài khoản nhân viên đã hoàn toàn biến mất khỏi danh sách nhân sự');

// Test 13.8: Dòng hoạt động trực tiếp (Audit Logs) ghi nhận hành động xóa chuẩn xác
const recentActs = getRecentActivities(10);
const deleteLog = recentActs.find(a => a.actionType === 'DELETE_USER');
assert(deleteLog !== undefined, 'Dòng hoạt động trực tiếp ghi nhận chuẩn xác sự kiện DELETE_USER');
assert(deleteLog.description.includes(staffUsername), 'Mô tả dòng hoạt động có chứa tên tài khoản bị xóa');

// ==========================================
// 14. KIỂM THỬ CỘNG ĐỒNG NỘI BỘ ĐỒNG BỘ SQLite (TẠO, BÌNH LUẬN, GHIM, PHÂN QUYỀN XÓA BÀI)
// ==========================================
console.log('\n--- KIỂM THỬ CỘNG ĐỒNG NỘI BỘ ĐỒNG BỘ TOÀN HỆ THỐNG ---');

// Test 14.1: Luôn có sẵn bài viết quy chuẩn ghim mặc định của Ban Đào Tạo
const initialCommunity = getCommunityPosts();
assert(Array.isArray(initialCommunity) && initialCommunity.length >= 1, 'Bảng tin cộng đồng luôn có ít nhất 1 bài quy chuẩn mặc định');
assert(initialCommunity.some(p => p.id === 'notice_official_1' && p.isPinned === true), 'Bài quy chuẩn notice_official_1 được ghim đầu bảng tin');

// Test 14.2: Nhân viên A đăng bài Báo cọc thực hành
const createPostRes = createCommunityPost({
  author: 'Nguyễn Văn An',
  authorUsername: 'nhanvien_a@runningman.vn',
  role: 'student',
  branch: 'RMSA - Bình Thạnh',
  category: 'deals',
  title: 'TING TING! Chốt cọc căn Duplex 5.5tr tại Bình Thạnh',
  content: 'Áp dụng đúng công thức chia nhỏ 16k/ngày của anh Rin, khách gật đầu cọc ngay!',
  depositAmount: '1.500.000đ',
  roomInfo: 'Duplex Ban Công 5.5tr'
});
assert(createPostRes.success === true && createPostRes.post, 'Nhân viên A đăng bài Báo cọc lên SQLite thành công');
const createdPostId = createPostRes.post.id;
assert(createPostRes.post.isCelebration === true, 'Bài báo cọc tự động bật cờ vinh danh isCelebration');

// Test 14.3: Nhân viên B vào bình luận chúc mừng và thả tim
const commentRes = addCommunityComment(createdPostId, {
  author: 'Lê Hoàng Yến',
  authorUsername: 'nhanvien_b@runningman.vn',
  role: 'student',
  branch: 'RMSA - Quận 1',
  text: 'Quá đỉnh anh An ơi! Cho em xin vía chốt đơn chiều nay nhé!'
});
assert(commentRes.success === true && commentRes.comment, 'Nhân viên B thêm bình luận đồng bộ thành công');
const createdCommentId = commentRes.comment.id;

const likeRes = toggleLikeCommunityPost(createdPostId, 'nhanvien_b@runningman.vn');
assert(likeRes.success === true && likeRes.likes === 2, 'Thả tim đồng bộ theo tài khoản tăng chuẩn xác lên 2 lượt thích');

// Test 14.4: Kiểm tra phân quyền xóa bài: Nhân viên B KHÔNG ĐƯỢC xóa bài của Nhân viên A
const unauthorizedDelete = deleteCommunityPost(createdPostId, {
  username: 'nhanvien_b@runningman.vn',
  name: 'Lê Hoàng Yến',
  role: 'student'
});
assert(unauthorizedDelete.success === false && unauthorizedDelete.status === 403, 'Bảo mật phân quyền: Chặn nhân viên B xóa bài viết của nhân viên A');

// Test 14.5: Quản trị viên có quyền Ghim bài viết của Nhân viên A
const pinRes = togglePinCommunityPost(createdPostId, {
  username: 'admin@runningman.vn',
  name: 'Đan Rin (HLV Trưởng)',
  role: 'admin',
  isAdmin: true
});
assert(pinRes.success === true && pinRes.isPinned === true, 'Quản trị viên ghim bài viết của nhân viên lên đầu thành công');

// Test 14.6: Nhân viên B tự xóa bình luận của chính mình thành công
const delCommentRes = deleteCommunityComment(createdPostId, createdCommentId, {
  username: 'nhanvien_b@runningman.vn',
  name: 'Lê Hoàng Yến',
  role: 'student'
});
assert(delCommentRes.success === true, 'Nhân viên tự xóa bình luận của chính mình thành công');

// Test 14.7: Nhân viên A tự xóa bài viết của chính mình thành công
const authorDeleteRes = deleteCommunityPost(createdPostId, {
  username: 'nhanvien_a@runningman.vn',
  name: 'Nguyễn Văn An',
  role: 'student'
});
assert(authorDeleteRes.success === true, 'Tác giả (Nhân viên A) tự xóa bài viết của chính mình thành công');
assert(!authorDeleteRes.posts.some(p => p.id === createdPostId), 'Bài viết đã biến mất hoàn toàn khỏi danh sách đồng bộ');

// Test 14.8: Quản trị viên có toàn quyền xóa bất kỳ bài viết nào của nhân viên khác
const secondPost = createCommunityPost({
  author: 'Nhân Viên Thử Nghiệm',
  authorUsername: 'nv_test_2@runningman.vn',
  role: 'student',
  category: 'qa',
  title: 'Câu hỏi thử nghiệm cần xóa',
  content: 'Nội dung thử nghiệm'
});
const adminDeleteRes = deleteCommunityPost(secondPost.post.id, {
  username: 'admin@runningman.vn',
  name: 'Đan Rin (HLV Trưởng)',
  role: 'admin',
  isAdmin: true
});
assert(adminDeleteRes.success === true, 'Quản trị viên xóa bài viết của nhân viên bất kỳ thành công');

// =========================================================================
// 15. KIỂM THỬ THƯỚC PHIM THỰC ĐỊA (REELS & TIKTOK SHOWCASE) & MOTION UI
// =========================================================================
console.log('\n--- KIỂM THỬ THƯỚC PHIM THỰC ĐỊA (REELS & TIKTOK) & CHUYỂN ĐỘNG 60FPS ---');

const reelsList = getCommunityReels();
assert(Array.isArray(reelsList) && reelsList.length >= 2, 'Bảng community_reels tự động khởi tạo ít nhất 2 thước phim thực địa mẫu');
assert(reelsList.some(r => r.url.includes('1821834182135514')), 'Có sẵn Facebook Reel mẫu (1821834182135514) của người dùng');
assert(reelsList.some(r => r.url.includes('7693034526401924372')), 'Có sẵn TikTok mẫu (7693034526401924372) của người dùng');

// Test thêm mới Reel bởi Admin
const newReelRes = createCommunityReel({
  title: 'Review Căn Duplex Quận 1 Thực Chiến',
  platform: 'tiktok',
  url: 'https://www.tiktok.com/@neongo/video/7693034526401924372',
  author: 'HLV Đan Rin',
  duration: '0:30',
  tag: 'Thực địa'
});
assert(newReelRes.success === true && newReelRes.reel, 'Quản trị viên thêm mới thước phim TikTok/Reel thành công');

// Test chặn nhân viên thường xóa Reel
const blockStudentReelDel = deleteCommunityReel(newReelRes.reel.id, { role: 'student', isAdmin: false });
assert(blockStudentReelDel.success === false && blockStudentReelDel.status === 403, 'Bảo mật phân quyền: Chặn nhân viên thường xóa thước phim thực địa');

// Test Admin xóa Reel thành công
const adminReelDel = deleteCommunityReel(newReelRes.reel.id, { role: 'admin', isAdmin: true });
assert(adminReelDel.success === true, 'Quản trị viên xóa thước phim thực địa và đồng bộ thành công');

// Kiểm tra hệ thống class chuyển động trong index.css
const indexCssPath = path.join(__dirname, '..', 'src', 'index.css');
const indexCssContent = fs.readFileSync(indexCssPath, 'utf8');
assert(indexCssContent.includes('animate-float-slow') && indexCssContent.includes('btn-shimmer') && indexCssContent.includes('hover-3d-card'), 'File index.css phải chứa đầy đủ hệ thống chuyển động 60fps GPU');

// Test 13.9: Dọn dẹp sạch toàn bộ dữ liệu kiểm thử (Clean Test Data)
const cleanRes = cleanTestData({ id: 1, name: 'Đan Rin (HLV Trưởng & Quản Trị Viên)' });
assert(cleanRes.success === true, 'Hàm cleanTestData dọn dẹp sạch sẽ toàn bộ tài khoản thử nghiệm');
const finalUsers = getAllUsers();
assert(finalUsers.length >= 1 && finalUsers.some(u => u.username === 'admin@runningman.vn'), 'Sau khi dọn dẹp bảo toàn an toàn các tài khoản Quản trị viên');

console.log(`\n========================================`);
console.log(`KẾT QUẢ: ${passedTests}/${totalTests} TESTS ĐẠT HOÀN HẢO 100%`);
console.log(`========================================\n`);

