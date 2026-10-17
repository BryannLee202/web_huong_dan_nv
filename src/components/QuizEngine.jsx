import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  AlertCircle,
  Lightbulb,
  Send,
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  Flag,
  History,
  FileCheck2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function QuizEngine({ 
  lessonId, 
  quiz = [], 
  passingScore = 80, 
  onQuizPassed, 
  onNextLesson, 
  hasNextLesson 
}) {
  const [activeView, setActiveView] = useState('exam'); // 'exam' | 'history'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  // Timer state (15 minutes default)
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Attempt History state
  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Load attempt history
  const loadAttemptHistory = async () => {
    setLoadingAttempts(true);
    let remoteAttempts = [];
    try {
      const res = await fetch(`/api/quiz/attempts/${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.attempts)) {
          remoteAttempts = data.attempts;
        }
      }
    } catch (e) {
      // Offline fallback
    }

    // Merge with LocalStorage
    try {
      const local = JSON.parse(localStorage.getItem(`rin_attempts_${lessonId}`) || '[]');
      const merged = remoteAttempts.length > 0 ? remoteAttempts : local;
      setAttempts(merged);
    } catch (e) {
      setAttempts(remoteAttempts);
    }
    setLoadingAttempts(false);
  };

  useEffect(() => {
    loadAttemptHistory();
    // Reset test state when lessonId changes
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setHasSubmitted(false);
    setQuizResult(null);
    setValidationError('');
    setSecondsRemaining(15 * 60);
    setIsTimerRunning(true);
  }, [lessonId]);

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerRunning || hasSubmitted) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, hasSubmitted, selectedAnswers]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (hasSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    setValidationError('');
  };

  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmit = async (autoExpired = false) => {
    const unanswered = quiz.filter(q => selectedAnswers[q.id] === undefined);
    if (!autoExpired && unanswered.length > 0) {
      setValidationError(`Bạn còn ${unanswered.length} câu chưa làm. Hãy hoàn tất hết các câu trước khi nộp bài!`);
      return;
    }

    setIsTimerRunning(false);

    let correctCount = 0;
    const details = quiz.map((q) => {
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

    const scorePercentage = Math.round((correctCount / quiz.length) * 100);
    const passed = scorePercentage >= passingScore;
    const timeTakenSeconds = 15 * 60 - secondsRemaining;

    // Duolingo sub-scores competency breakdown
    const discoveryScore = Math.min(100, Math.round(scorePercentage * 1.05));
    const objectionScore = Math.max(0, Math.round(scorePercentage * 0.95));
    const closingScore = scorePercentage;

    const result = {
      totalQuestions: quiz.length,
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
    const newAttempt = {
      id: Date.now(),
      lessonId,
      userName: 'Nguyễn Văn A',
      score: scorePercentage,
      passed,
      timeTakenSeconds,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem(`rin_attempts_${lessonId}`) || '[]');
      const updated = [newAttempt, ...existing];
      localStorage.setItem(`rin_attempts_${lessonId}`, JSON.stringify(updated));
      setAttempts(updated);
    } catch (e) {}

    // Send attempt to server API
    try {
      await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          userAnswers: selectedAnswers,
          timeTakenSeconds
        })
      });
      loadAttemptHistory();
    } catch (e) {
      console.warn('Backend attempt sync offline, saved to localStorage');
    }

    if (passed) {
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
      if (onQuizPassed) onQuizPassed(lessonId, scorePercentage);
    }
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
  };

  if (!quiz || quiz.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold">Chưa có câu hỏi trắc nghiệm cho bài học này.</p>
      </div>
    );
  }

  const currentQ = quiz[currentQuestionIndex] || quiz[0];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isTimeLow = secondsRemaining <= 120;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* 1. TOP HEADER & TAB SWITCHER (CodeLearn-style Attempt History Tab) */}
      <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('exam')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeView === 'exam'
                ? 'bg-white text-[#007c5d] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Phòng Thi Sát Hạch</span>
          </button>

          <button
            onClick={() => {
              setActiveView('history');
              loadAttemptHistory();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeView === 'history'
                ? 'bg-white text-[#007c5d] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch Sử Làm Bài ({attempts.length})</span>
          </button>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">
            Chuẩn đỗ: <strong className="text-[#007c5d] font-bold">{passingScore}%</strong>
          </span>
          <div className="flex items-center space-x-1 text-slate-500">
            <span>Tiến độ:</span>
            <strong className="text-slate-800">{answeredCount}/{quiz.length} câu</strong>
          </div>
        </div>
      </div>

      {/* VIEW A: EXAM ARENA (70/30 PRO TWO-COLUMN LAYOUT) */}
      {activeView === 'exam' && (
        <div className="p-6">
          
          {/* POST-SUBMISSION BANNER */}
          {hasSubmitted && quizResult && (
            <div className={`mb-6 p-5 rounded-2xl border text-left transition-all ${
              quizResult.passed 
                ? 'bg-emerald-50 border-emerald-300' 
                : 'bg-rose-50 border-rose-300'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2 rounded-xl text-white mt-0.5 ${
                    quizResult.passed ? 'bg-[#007c5d]' : 'bg-rose-600'
                  }`}>
                    {quizResult.passed ? <Award className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${
                      quizResult.passed ? 'text-[#007c5d]' : 'text-rose-900'
                    }`}>
                      {quizResult.passed 
                        ? '🎉 Chúc mừng! Bạn đã xuất sắc vượt qua bài sát hạch!' 
                        : '⚠️ Chưa đạt yêu cầu để mở khóa bài tiếp theo!'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Kết quả: <strong>{quizResult.scorePercentage}%</strong> ({quizResult.correctCount}/{quizResult.totalQuestions} câu đúng) 
                      • Thời gian làm: <strong>{Math.floor(quizResult.timeTakenSeconds / 60)}m {quizResult.timeTakenSeconds % 60}s</strong>
                      {quizResult.passed 
                        ? ' • Bài học tiếp theo đã được tự động mở khóa.' 
                        : ` • Bạn cần đạt từ ${passingScore}% trở lên để tiếp tục lộ trình.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại đề</span>
                  </button>

                  {quizResult.passed && hasNextLesson && (
                    <button
                      onClick={onNextLesson}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-[0_4px_14px_rgba(245,158,11,0.35)] border border-amber-300/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <span>Vào bài tiếp theo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* DUOLINGO SUB-SCORES BREAKDOWN */}
              <div className="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block">Kỹ năng Khám phá nhu cầu</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800">{quizResult.subScores.discovery}%</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">SPIN Framework</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block">Kỹ năng Bẻ gãy từ chối</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800">{quizResult.subScores.objection}%</span>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold">Objection Handling</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block">Kỹ năng Chốt hợp đồng</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800">{quizResult.subScores.closing}%</span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold">Assumptive Close</span>
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
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-[#007c5d] border border-emerald-200 font-mono">
                    CÂU {currentQuestionIndex + 1} / {quiz.length}
                  </span>
                  {flaggedQuestions[currentQ.id] && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center space-x-1">
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
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQ.id] ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
                    <span>{flaggedQuestions[currentQ.id] ? 'Bỏ cờ' : 'Đánh dấu phân vân'}</span>
                  </button>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug pt-1">
                {currentQ.question}
              </h3>

              {/* Options List */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  const isCorrect = Number(optIdx) === Number(currentQ.correctAnswer);
                  
                  let optionClass = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700';

                  if (hasSubmitted) {
                    if (isCorrect) {
                      optionClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'bg-rose-50 border-rose-300 text-rose-950';
                    } else {
                      optionClass = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-70';
                    }
                  } else if (isSelected) {
                    optionClass = 'bg-emerald-50/70 border-[#007c5d] text-slate-900 font-semibold shadow-xs ring-1 ring-[#007c5d]';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${optionClass}`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'bg-[#007c5d] text-white' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {letters[optIdx]}
                      </span>
                      <span className="text-xs sm:text-sm flex-1 leading-relaxed">{opt}</span>

                      {hasSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#007c5d] shrink-0" />
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
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Giải thích đáp án chuẩn:</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-slate-600">
                    {currentQ.explanation || 'Đáp án này tuân thủ đúng quy trình phản xạ giao tiếp bán hàng chuyên nghiệp.'}
                  </p>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                <span className="text-xs text-slate-400 font-medium">
                  {currentQuestionIndex + 1} / {quiz.length}
                </span>

                <button
                  disabled={currentQuestionIndex === quiz.length - 1}
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: QUESTION MATRIX NAVIGATOR & COUNTDOWN TIMER (30%) */}
            <div className="lg:col-span-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-5 text-left sticky top-20">
              
              {/* Countdown Timer Widget */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Thời gian còn lại</span>
                  <div className={`text-xl font-black font-mono tracking-tight flex items-center space-x-1.5 ${
                    isTimeLow ? 'text-rose-600 animate-pulse' : 'text-slate-900'
                  }`}>
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{formatTimer(secondsRemaining)}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#007c5d] border border-emerald-200">
                  {isTimerRunning ? 'Đang bấm giờ' : 'Đã dừng'}
                </span>
              </div>

              {/* Question Matrix Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-800">Lưới câu hỏi ({quiz.length})</span>
                  <span className="text-[11px] font-semibold text-[#007c5d]">{answeredCount}/{quiz.length} đã làm</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {quiz.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIndex;
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isFlagged = flaggedQuestions[q.id];

                    let cellStyle = 'bg-white border-slate-200 text-slate-600';
                    if (isAnswered) cellStyle = 'bg-emerald-50 border-emerald-400 text-[#007c5d] font-bold';
                    if (isFlagged) cellStyle = 'bg-amber-50 border-amber-400 text-amber-800 font-bold';
                    if (isCurrent) cellStyle += ' ring-2 ring-[#007c5d] font-black shadow-xs';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer relative ${cellStyle}`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-3 border-t border-slate-200/80 mt-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span>
                    <span>Đã làm ({answeredCount})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
                    <span>Phân vân ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-white border border-slate-200"></span>
                    <span>Chưa làm ({quiz.length - answeredCount})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-white ring-2 ring-[#007c5d]"></span>
                    <span>Đang xem</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {validationError && (
                <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {validationError}
                </p>
              )}

              {!hasSubmitted ? (
                <button
                  onClick={() => handleSubmit(false)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(245,158,11,0.35)] border border-amber-300/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Nộp bài ({answeredCount}/{quiz.length})</span>
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Thi lại lần nữa</span>
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
              <h3 className="text-sm font-bold text-slate-900">Nhật Ký Lịch Sử Thi Của Học Viên</h3>
              <p className="text-xs text-slate-500">Ghi nhận tiến độ làm bài thi qua từng đợt rèn luyện.</p>
            </div>
            <button
              onClick={() => setActiveView('exam')}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-[0_4px_14px_rgba(245,158,11,0.35)] border border-amber-300/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span>Vào làm bài ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingAttempts ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải lịch sử...</div>
          ) : attempts.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Chưa có lịch sử làm bài nào</p>
              <p className="text-[11px] text-slate-500">Hãy hoàn thành bài kiểm tra đầu tiên để lưu lại bảng điểm.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="px-4 py-3">Lần thi</th>
                    <th className="px-4 py-3">Học viên</th>
                    <th className="px-4 py-3">Điểm số (%)</th>
                    <th className="px-4 py-3">Kết quả</th>
                    <th className="px-4 py-3">Thời gian làm</th>
                    <th className="px-4 py-3">Thời điểm nộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att, idx) => (
                    <tr key={att.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        #{attempts.length - idx}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {att.userName || 'Nguyễn Văn A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-black text-xs px-2 py-0.5 rounded-full ${
                          att.score >= passingScore 
                            ? 'bg-emerald-100 text-[#007c5d]' 
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {att.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {att.passed ? (
                          <span className="inline-flex items-center text-emerald-700 font-bold space-x-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ĐẠT CHUẨN</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-rose-600 font-bold space-x-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span>CHƯA ĐẠT</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono">
                        {att.timeTakenSeconds ? `${Math.floor(att.timeTakenSeconds / 60)}m ${att.timeTakenSeconds % 60}s` : 'Dưới 1 phút'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
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
