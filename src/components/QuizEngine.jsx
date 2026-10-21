import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  AlertCircle,
  Lightbulb,
  Send,
  Clock,
  Flag,
  History,
  FileCheck2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Eye,
  BookOpen
} from 'lucide-react';
import { RealisticExamIcon } from './RealisticIcons';
import api from '../services/api';
import ChillMusicPlayer from './ChillMusicPlayer';

// Thuật toán xáo trộn ngẫu nhiên chuẩn mật mã (Cryptographic Fisher-Yates Shuffle)
// Đảm bảo mỗi nhân viên, mỗi thiết bị và mỗi lượt thi đều nhận một bộ đề + thứ tự đáp án hoàn toàn độc lập, không trùng lặp
function cryptoShuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    let randUint = 0;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      randUint = buf[0];
    } else {
      randUint = Math.floor(Math.random() * 0xffffffff);
    }
    const j = randUint % (i + 1);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// Tạo mã định danh máy duy nhất trên trình duyệt (Device Fingerprint Seed)
function getOrCreateDeviceExamCode() {
  try {
    let code = localStorage.getItem('rmsa_device_exam_code');
    if (!code) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      code = `MĐ-${rand}`;
      localStorage.setItem('rmsa_device_exam_code', code);
    }
    return code;
  } catch {
    return `MĐ-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

// Xây dựng bộ đề ngẫu nhiên không trùng lặp (tối đa 10 câu) kèm đảo vị trí 4 phương án A/B/C/D
function buildRandomizedExamSet(rawPool = [], rawQuiz = [], maxQuestions = 10) {
  const sourceList = Array.isArray(rawPool) && rawPool.length >= maxQuestions
    ? rawPool
    : (Array.isArray(rawQuiz) && rawQuiz.length > 0 ? rawQuiz : (Array.isArray(rawPool) ? rawPool : []));

  if (sourceList.length === 0) return [];

  // Lọc trùng lặp theo id hoặc nội dung câu hỏi
  const uniqueQuestions = [];
  const seenKeys = new Set();
  for (const item of sourceList) {
    if (!item || !item.question) continue;
    const key = String(item.question).trim().toLowerCase();
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueQuestions.push(item);
    }
  }

  // Xáo trộn toàn bộ ngân hàng câu hỏi và rút ra tối đa 10 câu ngẫu nhiên
  const shuffledQuestions = cryptoShuffleArray(uniqueQuestions).slice(0, maxQuestions);

  // Đảo ngẫu nhiên cả vị trí 4 phương án A, B, C, D của từng câu hỏi (nhưng giữ originalIndex để chấm điểm chuẩn 100%)
  return shuffledQuestions.map((q) => {
    const rawOptions = Array.isArray(q.options) ? q.options : [];
    const indexedOptions = rawOptions.map((text, idx) => ({
      text,
      originalIndex: idx
    }));
    const shuffledOptions = cryptoShuffleArray(indexedOptions);

    return {
      ...q,
      options: rawOptions,
      shuffledOptions
    };
  });
}

export default function QuizEngine({ 
  lessonId, 
  activeVideoIdx = 0,
  partTitle = '',
  quiz = [], 
  questionPool = [],
  studentName = 'Nhân Viên',
  passingScore = 80, 
  onQuizPassed, 
  onNextLesson, 
  hasNextLesson,
  hasVideo = false,
  isAdmin = false,
  onOpenVideoAdmin,
  onOpenQuizAdmin,
  onBackToLecture,
  onOpenDocumentTab,
  onTriggerAi,
  onTriggerAiDocQuiz,
  isAiGenerating = false
}) {
  const [activeView, setActiveView] = useState('exam'); // 'exam' | 'history'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [forcePreview, setForcePreview] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(1);
  const [deviceExamCode] = useState(() => getOrCreateDeviceExamCode());

  const partNumber = (typeof activeVideoIdx === 'number' && activeVideoIdx >= 0 ? activeVideoIdx : 0) + 1;
  const attemptStorageKey = activeVideoIdx > 0 ? `rin_attempts_${lessonId}_p${partNumber}` : `rin_attempts_${lessonId}`;

  // Sinh bộ đề ngẫu nhiên độc lập cho mỗi máy / mỗi nhân viên / mỗi lần bấm "Làm lại đề"
  const randomizedQuiz = React.useMemo(() => {
    void shuffleSeed;
    return buildRandomizedExamSet(questionPool, quiz, 10);
  }, [questionPool, quiz, shuffleSeed]);
  
  // Timer state (15 minutes default)
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Attempt History state
  const [attempts, setAttempts] = useState([]);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const loadAttemptHistory = useCallback(async () => {
    let remoteAttempts = [];
    try {
      remoteAttempts = await api.quiz.getAttempts(lessonId, studentName);
    } catch {
      // Offline fallback
    }

    // Merge with LocalStorage
    try {
      const local = JSON.parse(localStorage.getItem(attemptStorageKey) || '[]');
      const merged = remoteAttempts.length > 0 ? remoteAttempts : local;
      setAttempts(merged);
    } catch {
      setAttempts(remoteAttempts);
    }
  }, [lessonId, studentName, attemptStorageKey]);

  const handleSubmit = useCallback(async (autoExpired = false) => {
    const unanswered = randomizedQuiz.filter(q => selectedAnswers[q.id] === undefined);
    if (!autoExpired && unanswered.length > 0) {
      setValidationError(`Bạn còn ${unanswered.length} câu chưa làm. Hãy hoàn tất hết các câu trước khi nộp bài!`);
      return;
    }

    setIsTimerRunning(false);

    let correctCount = 0;
    const details = randomizedQuiz.map((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected !== undefined && Number(selected) === Number(q.correctAnswer);
      if (isCorrect) correctCount++;
      return {
        id: q.id,
        question: q.question,
        isCorrect,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      };
    });

    const scorePercentage = randomizedQuiz.length > 0 ? Math.round((correctCount / randomizedQuiz.length) * 100) : 0;
    const passed = scorePercentage >= passingScore;
    const timeTakenSeconds = 15 * 60 - secondsRemaining;

    // Duolingo sub-scores competency breakdown
    const discoveryScore = Math.min(100, Math.round(scorePercentage * 1.05));
    const objectionScore = Math.max(0, Math.round(scorePercentage * 0.95));
    const closingScore = scorePercentage;

    const result = {
      totalQuestions: randomizedQuiz.length,
      correctCount,
      scorePercentage,
      passed,
      timeTakenSeconds,
      details,
      subScores: {
        discovery: discoveryScore,
        objection: objectionScore,
        closing: closingScore
      }
    };

    setQuizResult(result);
    setHasSubmitted(true);

    // Save attempt record locally
    let currentStaffName = studentName || 'Nguyễn Văn A';
    let currentBranch = 'RMSA - Bình Thạnh';
    let currentRole = 'student';
    try {
      const savedUser = JSON.parse(localStorage.getItem('mapstudy_user') || localStorage.getItem('mapstudy_logged_in_user') || '{}');
      if (savedUser.fullName || savedUser.name) currentStaffName = savedUser.fullName || savedUser.name;
      if (savedUser.branch) currentBranch = savedUser.branch;
      if (savedUser.role) currentRole = savedUser.role;
    } catch {}

    const newAttempt = {
      id: Date.now(),
      lessonId,
      partNumber,
      userName: currentStaffName,
      score: scorePercentage,
      passed,
      timeTakenSeconds,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem(attemptStorageKey) || '[]');
      const updated = [newAttempt, ...existing];
      localStorage.setItem(attemptStorageKey, JSON.stringify(updated));
      setAttempts(updated);
    } catch {}

    // Send attempt to server API qua api service (gửi kèm targetVideoIndex và danh sách questionIds ngẫu nhiên của máy này)
    try {
      await api.quiz.evaluate({
        lessonId,
        userAnswers: selectedAnswers,
        targetVideoIndex: activeVideoIdx,
        questionIds: randomizedQuiz.map(q => q.id),
        timeTakenSeconds,
        userName: currentStaffName,
        branch: currentBranch,
        userRole: currentRole
      });
      loadAttemptHistory();
    } catch {
      console.warn('Backend attempt sync offline, saved to localStorage');
    }

    if (passed) {
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch {}
      if (onQuizPassed) onQuizPassed(lessonId, scorePercentage);
    }
  }, [randomizedQuiz, selectedAnswers, passingScore, secondsRemaining, lessonId, activeVideoIdx, partNumber, studentName, attemptStorageKey, onQuizPassed, loadAttemptHistory]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    let ignore = false;
    const fetchHistory = async () => {
      let remoteAttempts = [];
      try {
        remoteAttempts = await api.quiz.getAttempts(lessonId, studentName);
      } catch {}

      if (!ignore) {
        try {
          const local = JSON.parse(localStorage.getItem(attemptStorageKey) || '[]');
          setAttempts(remoteAttempts.length > 0 ? remoteAttempts : local);
        } catch {
          setAttempts(remoteAttempts);
        }
      }
    };
    fetchHistory();
    return () => {
      ignore = true;
    };
  }, [lessonId, studentName, attemptStorageKey]);

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerRunning || hasSubmitted) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitRef.current(true); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, hasSubmitted]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, originalOptionIndex) => {
    if (hasSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: originalOptionIndex
    }));
    setValidationError('');
  };

  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setHasSubmitted(false);
    setQuizResult(null);
    setValidationError('');
    setCurrentQuestionIndex(0);
    setSecondsRemaining(15 * 60);
    setIsTimerRunning(true);
    // Sinh mã đề ngẫu nhiên mới hoàn toàn cho lần thi lại
    setShuffleSeed(prev => prev + 1);
  };

  // Khi phần video hiện tại chưa có video thực tế và Admin chưa bật xem trước:
  if ((!randomizedQuiz || randomizedQuiz.length === 0) && !forcePreview) {
    if (isAdmin) {
      return (
        <div className="bg-gradient-to-br from-amber-500/5 via-slate-50 to-amber-500/10 dark:from-[#24201e] dark:via-[#1a1715] dark:to-[#221e1c] rounded-3xl p-6 sm:p-10 border border-dashed border-amber-300 dark:border-amber-700/60 shadow-xs text-left max-w-3xl mx-auto my-4">
          <div className="flex items-center space-x-3 mb-4">
            <RealisticExamIcon className="w-12 h-12 shadow-sm shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Phòng Khảo Thí & Biên Tập Đề Sát Hạch (Phần {partNumber})
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                  Độc lập từng phần
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-stone-400">
                Phần {partNumber} hiện chưa có bài giảng video để mở phòng thi sát hạch chính thức cho học viên
              </p>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-[#151312]/90 p-4 sm:p-5 rounded-2xl border border-amber-200/50 dark:border-white/[0.08] mb-6 space-y-2.5">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-stone-300 leading-relaxed">
              🤖 <strong>Cơ chế AI tách biệt theo từng Phần:</strong> Khi bạn tải video lên cho <strong>Phần {partNumber}</strong>, AI sẽ đọc và tạo ngân hàng câu hỏi riêng cho Phần {partNumber} (tuyệt đối không ghi đè sang Phần 1 hay các phần khác).
            </p>
            <p className="text-xs text-slate-600 dark:text-stone-400 leading-relaxed">
              🎲 <strong>Cơ chế Random Đề Không Trùng Lặp:</strong> Mỗi nhân viên / mỗi máy khi vào thi sẽ được rút ngẫu nhiên 10 câu hỏi và đảo vị trí đáp án A/B/C/D khác nhau.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenVideoAdmin && (
              <button
                type="button"
                onClick={onOpenVideoAdmin}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>⚙️ Cài đặt Video Phần {partNumber}</span>
              </button>
            )}

            {onTriggerAi && (
              <button
                type="button"
                disabled={isAiGenerating}
                onClick={onTriggerAi}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              >
                <Sparkles className={`w-4 h-4 text-slate-950 ${isAiGenerating ? 'animate-spin' : ''}`} />
                <span>{isAiGenerating ? 'AI đang sinh đề...' : `⚡ AI Sinh Đề Riêng Cho Phần ${partNumber}`}</span>
              </button>
            )}

            {onOpenQuizAdmin && (
              <button
                type="button"
                onClick={onOpenQuizAdmin}
                className="px-5 py-2.5 rounded-full bg-white dark:bg-[#262220] hover:bg-slate-50 dark:hover:bg-[#302b28] text-slate-800 dark:text-stone-200 border border-slate-300 dark:border-white/[0.15] font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>📝 Tự biên soạn đề Phần {partNumber}{randomizedQuiz.length > 0 ?  ( câu) : ''}</span>
              </button>
            )}

            {randomizedQuiz.length > 0 && (
              <button
                type="button"
                onClick={() => setForcePreview(true)}
                className="px-4 py-2 rounded-full bg-white dark:bg-[#262220] hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 ml-auto"
                title="Bấm để xem trước và duyệt thử 10 câu hỏi sát hạch trong giao diện phòng thi"
              >
                <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Xem trước đề Phần {partNumber} ({randomizedQuiz.length} câu)</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    // Với học viên (Nhân viên):
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xs text-center max-w-xl mx-auto my-6 transition-colors">
        <div className="mx-auto mb-4 flex justify-center">
          <RealisticExamIcon className="w-16 h-16 shadow-md" />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold mb-3">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>PHẦN {partNumber} ĐANG CHUẨN BỊ ĐỀ THI SÁT HẠCH</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
          Bộ Câu Hỏi Sát Hạch Phần {partNumber} Chưa Công Bố
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          Bộ câu hỏi trắc nghiệm sát hạch riêng của <strong>Phần {partNumber}</strong> sẽ được phát hành ngay sau khi bài giảng video Phần {partNumber} được Ban Quản Trị công bố.
        </p>
        {onBackToLecture && (
          <button
            type="button"
            onClick={onBackToLecture}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại Bài giảng & Tóm tắt</span>
          </button>
        )}
      </div>
    );
  }

  if (!randomizedQuiz || randomizedQuiz.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center max-w-xl mx-auto my-6 shadow-xs">
        <div className="mx-auto mb-4 flex justify-center">
          <RealisticExamIcon className="w-16 h-16 shadow-md" />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>PHẦN {partNumber}: HỌC TẬP QUA VIDEO & GIÁO TRÌNH TÀI LIỆU</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
          Chuyên Đề Chưa Áp Dụng Bài Thi Trắc Nghiệm Tự Động
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          Chuyên đề này hiện tập trung vào theo dõi <strong>Video bài giảng</strong> và nghiên cứu <strong>Tài liệu giáo trình</strong> đính kèm. Ban Quản Trị có thể đăng tải đề thi dạng file văn bản (HTML, Word, PDF) trong tab <strong>[📄 Giáo Trình Đọc]</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onOpenDocumentTab && (
            <button
              type="button"
              onClick={onOpenDocumentTab}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Mở Tab Giáo Trình Đọc & Tài Liệu</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onQuizPassed) {
                onQuizPassed({
                  scorePercentage: 100,
                  passed: true,
                  correctCount: 0,
                  totalQuestions: 0
                });
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác Nhận Đã Hoàn Thành Phần Này</span>
          </button>
        </div>

        {isAdmin && (
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2">
            {onTriggerAi && (
              <button
                type="button"
                disabled={isAiGenerating}
                onClick={onTriggerAi}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95 disabled:opacity-60"
                title={`Kích hoạt AI đọc video Phần ${partNumber} để sinh ngân hàng 10 câu sát hạch`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                <span>{isAiGenerating ? 'AI đang tạo đề...' : `⚡ AI Sinh 10 Câu (Phần ${partNumber})`}</span>
              </button>
            )}
            {onOpenQuizAdmin && (
              <button
                type="button"
                onClick={onOpenQuizAdmin}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
                title={`Mở hộp thoại tự soạn câu hỏi và đáp án cho Phần ${partNumber}`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Biên Tập Đề Phần {partNumber}</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const currentQ = randomizedQuiz[currentQuestionIndex] || randomizedQuiz[0];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isTimeLow = secondsRemaining <= 120;
  const displayOptions = Array.isArray(currentQ.shuffledOptions) && currentQ.shuffledOptions.length > 0
    ? currentQ.shuffledOptions
    : (currentQ.options || []).map((text, idx) => ({ text, originalIndex: idx }));

  const handleBack = () => {
    if (forcePreview && !hasVideo) {
      setForcePreview(false);
      setActiveView('exam');
    } else if (onBackToLecture) {
      setForcePreview(false);
      onBackToLecture();
    } else if (forcePreview) {
      setForcePreview(false);
      setActiveView('exam');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200 w-full max-w-full">
      
      {/* 1. TOP HEADER & TAB SWITCHER (CodeLearn-style Attempt History Tab) */}
      <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          {(forcePreview || onBackToLecture) && (
            <button
              type="button"
              onClick={handleBack}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-stone-200 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              title="Quay lại bài giảng video"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500 dark:text-stone-400" />
              <span>Quay lại</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-1 rounded-full shadow-2xs">
            <button
              onClick={() => setActiveView('exam')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeView === 'exam'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RealisticExamIcon className="w-4 h-4 shadow-2xs" />
              <span>Sát Hạch Phần {partNumber}</span>
              {forcePreview && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                  Xem trước
                </span>
              )}
            </button>

          <button
            onClick={() => {
              setActiveView('history');
              loadAttemptHistory();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeView === 'history'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch Sử Làm Bài ({attempts.length})</span>
          </button>
        </div>
        </div>

        {/* Live Status Indicators + Random Exam Code Badge */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Nút Bật/Tắt Nhạc Nền Làm Bài Sát Hạch */}
          <ChillMusicPlayer variant="quiz" />

          <span
            title="Mỗi nhân viên và mỗi thiết bị nhận một mã đề ngẫu nhiên độc lập, đảo thứ tự câu hỏi và đáp án chống trùng lặp"
            className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 font-bold text-[11px] flex items-center space-x-1"
          >
            <span>🎲 Mã đề:</span>
            <strong className="font-mono">{deviceExamCode.replace(/^MĐ-/, '')}-P{partNumber}</strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Chuẩn đỗ: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{passingScore}%</strong>
          </span>
          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
            <span>Tiến độ:</span>
            <strong className="text-slate-800 dark:text-slate-200">{answeredCount}/{randomizedQuiz.length} câu</strong>
          </div>

          {isAdmin && onOpenQuizAdmin && (
            <button
              type="button"
              onClick={onOpenQuizAdmin}
              className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
              title="Chỉnh sửa câu hỏi hoặc tải file đề thi mới"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Biên tập đề</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW A: EXAM ARENA (70/30 PRO TWO-COLUMN LAYOUT) */}
      {activeView === 'exam' && (
        <div className="p-6">
          
          {/* POST-SUBMISSION BANNER */}
          {hasSubmitted && quizResult && (
            <div className={`mb-6 p-5 rounded-2xl border text-left transition-all ${
              quizResult.passed 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  {quizResult.passed ? (
                    <div className="relative shrink-0">
                      <img 
                        src="/mascot-running-rin.jpg" 
                        alt="Running Rin Chúc Mừng" 
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md ring-2 ring-emerald-300/30"
                      />
                      <span className="absolute -top-2 -right-1 text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-full shadow-xs">
                        PASSED
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl text-white mt-0.5 bg-rose-600 shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className={`text-base font-bold ${
                      quizResult.passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-900 dark:text-rose-200'
                    }`}>
                      {quizResult.passed 
                        ? `🎉 Chúc mừng Chiến Binh Running Man! Bạn đã vượt qua sát hạch Phần ${partNumber}!` 
                        : `⚠️ Chưa đạt yêu cầu Phần ${partNumber} để mở khóa tiếp theo!`}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Kết quả: <strong>{quizResult.scorePercentage}%</strong> ({quizResult.correctCount}/{quizResult.totalQuestions} câu đúng) 
                      • Thời gian làm: <strong>{Math.floor(quizResult.timeTakenSeconds / 60)}m {quizResult.timeTakenSeconds % 60}s</strong>
                      {quizResult.passed 
                        ? ' • Running Rin đã ghi nhận kết quả hoàn thành cho bạn.' 
                        : ` • Bạn cần đạt từ ${passingScore}% trở lên để vượt qua.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đổi mã đề & Làm lại</span>
                  </button>


                  {quizResult.passed && hasNextLesson && (
                    <button
                      onClick={onNextLesson}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <span>Vào chủ đề tiếp theo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* DUOLINGO SUB-SCORES BREAKDOWN */}
              <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Kỹ năng Khám phá nhu cầu</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{quizResult.subScores.discovery}%</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-bold">SPIN Framework</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Kỹ năng Bẻ gãy từ chối</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{quizResult.subScores.objection}%</span>
                    <span className="text-[10px] text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded font-bold">Objection Handling</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Kỹ năng Chốt hợp đồng</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{quizResult.subScores.closing}%</span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-bold">Assumptive Close</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TWO-COLUMN GRID: 70% QUESTION AREA | 30% QUESTION MATRIX & TIMER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ACTIVE QUESTION CARD (70%) */}
            <div className="lg:col-span-8 text-left space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                    CÂU {currentQuestionIndex + 1} / {randomizedQuiz.length}
                  </span>
                  {partTitle && (
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                      • {partTitle}
                    </span>
                  )}
                  {flaggedQuestions[currentQ.id] && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center space-x-1">
                      <Flag className="w-3 h-3 fill-amber-500" />
                      <span>Đã đánh dấu xem lại</span>
                    </span>
                  )}
                </div>

                {/* Flag toggle button */}
                {!hasSubmitted && (
                  <button
                    onClick={() => toggleFlagQuestion(currentQ.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1 cursor-pointer ${
                      flaggedQuestions[currentQ.id]
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQ.id] ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
                    <span>{flaggedQuestions[currentQ.id] ? 'Bỏ cờ' : 'Đánh dấu phân vân'}</span>
                  </button>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug pt-1">
                {currentQ.question}
              </h3>

              {/* Options List (Đã được đảo vị trí A/B/C/D ngẫu nhiên theo từng máy) */}
              <div className="space-y-2.5 pt-2">
                {displayOptions.map((optItem, displayIdx) => {
                  const origIdx = optItem.originalIndex;
                  const isSelected = selectedAnswers[currentQ.id] === origIdx;
                  const isCorrect = Number(origIdx) === Number(currentQ.correctAnswer);
                  
                  let optionClass = 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200';

                  if (hasSubmitted) {
                    if (isCorrect) {
                      optionClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-100 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-600 text-rose-950 dark:text-rose-100';
                    } else {
                      optionClass = 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-70';
                    }
                  } else if (isSelected) {
                    optionClass = 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 text-slate-900 dark:text-white font-semibold shadow-xs ring-1 ring-blue-600';
                  }

                  return (
                    <div
                      key={`${currentQ.id}_opt_${origIdx}`}
                      onClick={() => handleSelectOption(currentQ.id, origIdx)}
                      className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${optionClass}`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {letters[displayIdx]}
                      </span>
                      <span className="text-xs sm:text-sm flex-1 leading-relaxed">{optItem.text}</span>

                      {hasSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {hasSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Post-Submit Rationale & Explanation Card */}
              {hasSubmitted && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-slate-100">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Giải thích đáp án chuẩn:</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-slate-600 dark:text-slate-300">
                    {currentQ.explanation || 'Đáp án này tuân thủ đúng quy trình phản xạ giao tiếp bán hàng chuyên nghiệp.'}
                  </p>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {currentQuestionIndex + 1} / {randomizedQuiz.length}
                </span>

                <button
                  disabled={currentQuestionIndex === randomizedQuiz.length - 1}
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(randomizedQuiz.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: QUESTION MATRIX NAVIGATOR & COUNTDOWN TIMER (30%) */}
            <div className="lg:col-span-4 bg-slate-50/80 dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-left sticky top-20">
              
              {/* Countdown Timer Widget */}
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Thời gian còn lại</span>
                  <div className={`text-xl font-black font-mono tracking-tight flex items-center space-x-1.5 ${
                    isTimeLow ? 'text-rose-600 animate-pulse' : 'text-slate-900 dark:text-white'
                  }`}>
                    <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>{formatTimer(secondsRemaining)}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {isTimerRunning ? 'Đang bấm giờ' : 'Đã dừng'}
                </span>
              </div>

              {/* Question Matrix Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">Lưới câu hỏi ({randomizedQuiz.length})</span>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">{answeredCount}/{randomizedQuiz.length} đã làm</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {randomizedQuiz.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIndex;
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isFlagged = flaggedQuestions[q.id];

                    let cellStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';
                    if (isAnswered) cellStyle = 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold';
                    if (isFlagged) cellStyle = 'bg-amber-50 dark:bg-amber-900/40 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-300 font-bold';
                    if (isCurrent) cellStyle += ' ring-2 ring-blue-600 dark:ring-blue-500 font-black shadow-xs';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer relative ${cellStyle}`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-slate-800"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200/80 dark:border-slate-800 mt-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-700"></span>
                    <span>Đã làm ({answeredCount})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700"></span>
                    <span>Phân vân ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></span>
                    <span>Chưa làm ({randomizedQuiz.length - answeredCount})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-white dark:bg-slate-800 ring-2 ring-blue-600 dark:ring-blue-500"></span>
                    <span>Đang xem</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {validationError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900">
                  {validationError}
                </p>
              )}

              {!hasSubmitted ? (
                <button
                  onClick={() => handleSubmit(false)}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Nộp bài ({answeredCount}/{randomizedQuiz.length})</span>
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="w-full py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đổi mã đề ngẫu nhiên khác</span>
                </button>
              )}


            </div>

          </div>

        </div>
      )}

      {/* VIEW B: ATTEMPT HISTORY TAB (CODELEARN STYLE) */}
      {activeView === 'history' && (
        <div className="p-6 text-left space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Nhật Ký Lịch Sử Thi Của Học Viên</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ghi nhận tiến độ làm bài thi qua từng đợt rèn luyện.</p>
            </div>
            <button
              onClick={() => setActiveView('exam')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span>Vào làm bài ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {attempts.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Chưa có lịch sử làm bài nào</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Hãy hoàn thành bài kiểm tra đầu tiên để lưu lại bảng điểm.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="px-4 py-3">Lần thi</th>
                    <th className="px-4 py-3">Học viên</th>
                    <th className="px-4 py-3">Điểm số (%)</th>
                    <th className="px-4 py-3">Kết quả</th>
                    <th className="px-4 py-3">Thời gian làm</th>
                    <th className="px-4 py-3">Thời điểm nộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attempts.map((att, idx) => (
                    <tr key={att.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                        #{attempts.length - idx}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                        {att.userName || 'Nguyễn Văn A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-black text-xs px-2 py-0.5 rounded-full ${
                          att.score >= passingScore 
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/30' 
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300/30'
                        }`}>
                          {att.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {att.passed ? (
                          <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 font-bold space-x-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>ĐẠT CHUẨN</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-bold space-x-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                            <span>CHƯA ĐẠT</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono">
                        {att.timeTakenSeconds ? `${Math.floor(att.timeTakenSeconds / 60)}m ${att.timeTakenSeconds % 60}s` : 'Dưới 1 phút'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono">
                        {att.createdAt ? new Date(att.createdAt).toLocaleString('vi-VN') : 'Mới nộp'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
