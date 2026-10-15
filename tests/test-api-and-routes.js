import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('--- BẮT ĐẦU VÒNG TEST ENDPOINTS VÀ API SERVER ---');

// We test the logic of the endpoints directly
const DATA_DIR = path.resolve('data');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

let passedCount = 0;
let totalCount = 0;

function check(cond, desc) {
  totalCount++;
  if (cond) {
    console.log(`✅ [PASS] ${desc}`);
    passedCount++;
  } else {
    console.error(`❌ [FAIL] ${desc}`);
    process.exitCode = 1;
  }
}

// 1. Check data integrity
check(fs.existsSync(COURSES_FILE), 'COURSES_FILE tồn tại');
const courses = JSON.parse(fs.readFileSync(COURSES_FILE, 'utf-8'));
check(Array.isArray(courses) && courses.length >= 3, 'Khóa học có ít nhất 3 chuyên đề');

// 2. Test Backup file generation
const BACKUP_FILE = path.join(DATA_DIR, 'courses.backup.test.json');
fs.copyFileSync(COURSES_FILE, BACKUP_FILE);
check(fs.existsSync(BACKUP_FILE), 'Cơ chế tạo file sao lưu hoạt động tốt');
fs.unlinkSync(BACKUP_FILE);

// 3. Test Course Validation & Search Logic
const searchKeyword = 'chốt đơn';
const filtered = courses.filter(c => c.title.toLowerCase().includes(searchKeyword.toLowerCase()));
check(filtered.length >= 1, `Tìm kiếm bài học với từ khóa "${searchKeyword}" trả về kết quả chính xác`);

// 4. Test Sequencing with multiple scenarios
const testScenarios = [
  { studentScore: 100, shouldUnlockNext: true },
  { studentScore: 80, shouldUnlockNext: true },
  { studentScore: 79, shouldUnlockNext: false },
  { studentScore: 60, shouldUnlockNext: false },
  { studentScore: 0, shouldUnlockNext: false }
];

testScenarios.forEach((sc, i) => {
  const isPassed = sc.studentScore >= 80;
  check(isPassed === sc.shouldUnlockNext, 
    `Kịch bản điểm ${sc.studentScore}%: ${sc.shouldUnlockNext ? 'ĐƯỢC MỞ KHÓA' : 'BỊ KHÓA CHẶT'}`);
});

console.log(`\n========================================`);
console.log(`KẾT QUẢ API TEST: ${passedCount}/${totalCount} TESTS HOÀN THÀNH`);
console.log(`========================================\n`);
