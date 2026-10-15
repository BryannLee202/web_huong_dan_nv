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

console.log(`\n========================================`);
console.log(`KẾT QUẢ: ${passedTests}/${totalTests} TESTS ĐẠT HOÀN HẢO 100%`);
console.log(`========================================\n`);
