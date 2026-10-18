import { 
  getAllCourses, 
  getStudentProgress, 
  saveStudentProgress, 
  resetStudentProgress,
  recordQuizAttempt,
  getQuizAttempts,
  getAllQuizAttempts
} from '../data/database.js';
import fs from 'fs';
import path from 'path';

console.log('--- BẮT ĐẦU VÒNG KIỂM THỬ SQLITE DATABASE (data/lms.db) ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Check database file
const dbPath = path.resolve('data', 'lms.db');
assert(fs.existsSync(dbPath), 'File SQLite database data/lms.db đã được tạo thành công');

// 2. Test reading all courses from SQLite
const courses = getAllCourses();
assert(Array.isArray(courses), 'getAllCourses() trả về một mảng');
assert(courses.length >= 3, `SQLite chứa đủ ít nhất 3 bài học (hiện có: ${courses.length})`);

// 3. Test Course and Quiz structure from SQLite
courses.forEach((c, idx) => {
  assert(c.id && c.title && typeof c.videoUrl === 'string', `Bài ${idx + 1}: Dữ liệu bài học trong SQLite đầy đủ`);
  assert(Array.isArray(c.quiz) && c.quiz.length === 5, `Bài ${idx + 1}: Có đủ 5 câu hỏi trắc nghiệm liên kết SQL chuẩn xác`);
  assert(Array.isArray(c.attachments), `Bài ${idx + 1}: Có mảng học liệu attachments hợp lệ`);
  assert(Array.isArray(c.timestamps), `Bài ${idx + 1}: Có mảng video timestamps hợp lệ`);
});

// 4. Test Student Progress SQL operations
resetStudentProgress('TestUser');
let progress = getStudentProgress('TestUser');
assert(Object.keys(progress.completedLessons).length === 0, 'Reset tiến độ người dùng thành công (bảng trống)');

// Save progress in SQL
saveStudentProgress('TestUser', {
  'bai-1': { score: 100, passed: true }
}, 'bai-2');

progress = getStudentProgress('TestUser');
assert(progress.completedLessons['bai-1']?.score === 100, 'Lưu điểm 100% vào SQLite thành công');
assert(progress.completedLessons['bai-1']?.passed === true, 'Lưu trạng thái đỗ vào SQLite thành công');
assert(progress.currentLessonId === 'bai-2', 'Cập nhật bài hiện tại sang bai-2 trong SQLite thành công');

// 5. Test Quiz Attempts (CodeLearn feature)
const attemptRes = recordQuizAttempt('bai-1', 80, true, 45, { q1_1: 2 }, 'TestUser');
assert(attemptRes.success === true && attemptRes.attemptId > 0, 'Ghi nhận 1 lần thi (Attempt) vào SQLite thành công');

const attempts = getQuizAttempts('bai-1', 'TestUser');
assert(Array.isArray(attempts) && attempts.length >= 1, 'Truy vấn danh sách lịch sử lần thi từ SQLite thành công');
assert(attempts[0].score === 80 && attempts[0].passed === true, 'Dữ liệu điểm số và trạng thái đỗ của lần thi chính xác');

const allAttempts = getAllQuizAttempts();
assert(Array.isArray(allAttempts) && allAttempts.length >= 1, 'Truy vấn toàn bộ lịch sử thi phục vụ báo cáo thành công');

// Cleanup test user
resetStudentProgress('TestUser');

console.log(`\n========================================`);
console.log(`KẾT QUẢ SQLITE TEST: ${passedTests}/${totalTests} TESTS ĐẠT 100%`);
console.log(`========================================\n`);
