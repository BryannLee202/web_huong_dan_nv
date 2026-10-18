import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Zap,
  Shuffle
} from 'lucide-react';
import { getRandomPracticeQuestions } from '../../data/practiceTestBank';
import api from '../services/api';

export default function PracticeTestModal({ isOpen, onClose, onStartFullCourse, currentUser = null, onRefreshLeaderboard = null }) {
  const [questions, setQuestions] = useState(() => getRandomPracticeQuestions(5));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(180); // 3 phút
  const [isFinished, setIsFinished] = useState(false);
  const [examCode, setExamCode] = useState(() => `RMSA-${Math.floor(1000 + Math.random() * 9000)}`);
  const [submitFeedback, setSubmitFeedback] = useState(null);

  // Khi modal mở lên: Tự động tải bộ đề ngẫu nhiên mới hoàn toàn từ backend
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    api.practiceTest.getQuestions(5)
      .then(res => {
        if (isMounted && res?.success && Array.isArray(res.questions) && res.questions.length > 0) {
          setQuestions(res.questions);
          setExamCode(`RMSA-${Math.floor(1000 + Math.random() * 9000)}`);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [isOpen]);

  const handleModalClose = () => {
    setQuestions(getRandomPracticeQuestions(5));
    setExamCode(`RMSA-${Math.floor(1000 + Math.random() * 9000)}`);
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setTimeLeft(180);
    setIsFinished(false);
    setSubmitFeedback(null);
    if (onClose) onClose();
  };

  const handleRestart = () => {
    setQuestions(getRandomPracticeQuestions(5));
    setExamCode(`RMSA-${Math.floor(1000 + Math.random() * 9000)}`);
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setTimeLeft(180);
    setIsFinished(false);
    setSubmitFeedback(null);
  };

  const handleFinish = useCallback(() => {
    setIsFinished(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    // Tính điểm và gửi lên Backend ghi nhận vào Bảng Vàng (kèm chống spam)
    let cCount = 0;
    (questions || []).forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) cCount++;
    });
    const sPercent = Math.round((cCount / (questions.length || 5)) * 100);
    const studentName = currentUser?.fullName || currentUser?.name || currentUser?.username || 'Nhân Viên';

    api.practiceTest.submit({
      studentName,
      score: sPercent,
      passed: sPercent >= 80,
      timeTakenSeconds: Math.max(0, 180 - timeLeft),
      answers: selectedAnswers
    }).then(res => {
      if (res && res.success) {
        setSubmitFeedback(res);
        if (onRefreshLeaderboard) onRefreshLeaderboard();
      }
    }).catch(err => {
      console.error('Lỗi gửi kết quả bài thi sát hạch:', err);
    });
  }, [questions, selectedAnswers, timeLeft, currentUser, onRefreshLeaderboard]);

  const handleFinishRef = useRef(handleFinish);
  useEffect(() => {
    handleFinishRef.current = handleFinish;
  }, [handleFinish]);

  // Timer countdown
  useEffect(() => {
    if (isFinished || timeLeft <= 0 || !isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished, timeLeft, isOpen]);

  const handleSelectOption = (optIndex) => {
    if (!questions[currentQIndex]) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questions[currentQIndex].id]: optIndex
    }));
  };

  // Evaluation calculations
  let correctCount = 0;
  const results = (questions || []).map(q => {
    const selected = selectedAnswers[q.id];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correctCount++;
    return { ...q, selected, isCorrect };
  });

  const totalQuestions = questions.length || 5;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  // Nhóm kết quả đánh giá theo từng nhóm năng lực đa chiều
  const categoryStats = React.useMemo(() => {
    const map = {};
    results.forEach(r => {
      const cat = r.category || 'Nghiệp vụ thực chiến';
      if (!map[cat]) map[cat] = { total: 0, correct: 0 };
      map[cat].total++;
      if (r.isCorrect) map[cat].correct++;
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      percent: Math.round((data.correct / data.total) * 100),
      isPassed: data.correct === data.total
    }));
  }, [results]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = questions[currentQIndex] || questions[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header - Modern Test Style with Random Code */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Phòng Thi Sát Hạch Thực Địa</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800 flex items-center gap-1">
                  <Shuffle className="w-2.5 h-2.5" />
                  <span>Đề ngẫu nhiên {examCode}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tự động xáo trộn câu hỏi & đáp án • Đóng gói từ HLV Đan Rin
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isFinished && (
              <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                timeLeft < 60 ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                <Timer className="w-3.5 h-3.5 mr-1" />
                {formatTime(timeLeft)}
              </span>
            )}
            <button 
              onClick={handleModalClose} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isFinished && currentQ ? (
            <div className="space-y-6">
              
              {/* Step Progress Dots */}
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold mb-2">
                <span>Câu {currentQIndex + 1} / {totalQuestions}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{currentQ.category}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((optText, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start space-x-3 cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-slate-900 dark:text-white font-semibold ring-1 ring-blue-600 dark:ring-blue-500' 
                          : 'bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {['A', 'B', 'C', 'D'][optIdx]}
                      </span>
                      <span className="leading-relaxed flex-1">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex(prev => prev - 1)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${
                    currentQIndex === 0 ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Câu trước
                </button>

                {currentQIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    <span>Xem kết quả đánh giá</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* RESULTS & MULTI-DIMENSIONAL COMPETENCY BREAKDOWN */
            <div className="space-y-6">
              
              {/* Score Summary Box */}
              <div className={`p-6 rounded-2xl border text-center ${
                scorePercent >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  KẾT QUẢ ĐÁNH GIÁ SÁT HẠCH ({examCode})
                </p>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400 my-2">
                  {scorePercent}%
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Đúng {correctCount}/{totalQuestions} tình huống thực địa trong thời gian thử thách.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {scorePercent >= 80 
                    ? '🎉 Xuất sắc! Phản xạ xử lý tình huống của bạn đạt chuẩn Senior và đã sẵn sàng đi dẫn khách thực tế.' 
                    : '💡 Bạn đã làm khá tốt nhưng còn một số tình huống cần phản xạ chuẩn xác hơn. Hãy thi thử lại với bộ đề mới để rèn thêm!'}
                </p>

                {submitFeedback && (
                  <div className={`mt-3.5 p-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                    submitFeedback.scored 
                      ? 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{submitFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* DYNAMIC COMPETENCY BREAKDOWN */}
              <div className="bg-white dark:bg-slate-800/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Đánh Giá Chi Tiết Theo Nhóm Kỹ Năng</span>
                </h4>

                <div className="space-y-3">
                  {categoryStats.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.name}</span>
                        <span className={`font-bold ${cat.percent >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          {cat.percent}% {cat.percent >= 80 ? '(Đạt)' : '(Cần rèn luyện)'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cat.percent >= 80 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                          style={{ width: `${Math.max(cat.percent, 15)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Feedback Cards */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">Giải thích đáp án từ HLV Đan Rin:</h5>
                {results.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs space-y-1.5">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-800 dark:text-white">Câu {i + 1}: {r.category}</span>
                      {r.isCorrect ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Đúng
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Chưa đúng
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{r.explanation}</p>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isFinished ? (
            <>
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Bốc đề ngẫu nhiên khác</span>
              </button>

              <button
                onClick={() => {
                  handleModalClose();
                  onStartFullCourse();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Vào phòng học khóa đào tạo chính thức</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left w-full flex items-center justify-between">
              <span>💡 Đề thi sát hạch tự động xáo trộn ngẫu nhiên mỗi lần mở lên.</span>
              <button
                onClick={handleRestart}
                className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Shuffle className="w-3 h-3" />
                <span>Đổi bộ đề khác</span>
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
