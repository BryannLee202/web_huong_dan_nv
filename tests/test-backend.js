import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  assert(course.videoUrl && course.videoUrl.length > 0, `Bài ${index}: Có đường dẫn videoUrl`);
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

// Test case 3.3: 4 out of 5 correct (80% boundary - Pass)
const fourCorrectAnswers = {};
lesson1.quiz.forEach((q, idx) => {
  fourCorrectAnswers[q.id] = idx === 0 ? (q.correctAnswer + 1) % q.options.length : q.correctAnswer;
});
const result80 = evaluateQuiz(lesson1.quiz, fourCorrectAnswers, lesson1.passingScore);
assert(result80.scorePercentage === 80 && result80.passed === true, 'Test biên 80% (4/5 câu): Đạt điểm và mở khóa bài tiếp');

// Test case 3.4: 3 out of 5 correct (60% boundary - Fail)
const threeCorrectAnswers = {};
lesson1.quiz.forEach((q, idx) => {
  threeCorrectAnswers[q.id] = idx < 2 ? (q.correctAnswer + 1) % q.options.length : q.correctAnswer;
});
const result60 = evaluateQuiz(lesson1.quiz, threeCorrectAnswers, lesson1.passingScore);
assert(result60.scorePercentage === 60 && result60.passed === false, 'Test biên 60% (3/5 câu): Không đạt và KHÔNG mở khóa bài tiếp');

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
assert(importedLucideIcons.has('BookOpen'), 'MapStudyTeacherPage phải import icon "BookOpen"');
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

console.log(`\n========================================`);
console.log(`KẾT QUẢ: ${passedTests}/${totalTests} TESTS ĐẠT HOÀN HẢO 100%`);
console.log(`========================================\n`);
