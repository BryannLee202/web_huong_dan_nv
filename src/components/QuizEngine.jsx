import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle, 
  Award, 
  AlertCircle,
  Lightbulb,
  Sparkles,
  Send
} from 'lucide-react';

export default function QuizEngine({ 
  lessonId, 
  quiz, 
  passingScore = 80, 
  onQuizPassed, 
  onNextLesson, 
  hasNextLesson 
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [validationError, setValidationError] = useState('');

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleSelectOption = (questionId, optionIndex) => {
    if (hasSubmitted) return; // Prevent changing after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    setValidationError('');
  };

  const handleSubmit = () => {
    // 1. Validation: check if all questions are answered
    const unanswered = quiz.filter(q => selectedAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      setValidationError(`Bạn còn ${unanswered.length} câu chưa trả lời. Hãy hoàn thành tất cả câu hỏi trước khi nộp bài!`);
      return;
    }

    // 2. Calculate score & evaluation
    let correctCount = 0;
    const details = quiz.map((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = Number(selected) === Number(q.correctAnswer);
      if (isCorrect) correctCount++;
      return {
        id: q.id,
        isCorrect,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      };
    });

    const scorePercentage = Math.round((correctCount / quiz.length) * 100);
    const passed = scorePercentage >= passingScore;

    const result = {
      totalQuestions: quiz.length,
      correctCount,
      scorePercentage,
      passed,
      details
    };

    setQuizResult(result);
    setHasSubmitted(true);

    // 3. If passed: trigger confetti & inform parent
    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
      if (onQuizPassed) {
        onQuizPassed(lessonId, scorePercentage);
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setHasSubmitted(false);
    setQuizResult(null);
    setValidationError('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-md">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white">Kiểm Tra Trắc Nghiệm Năng Lực</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              {quiz.length} Câu hỏi
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Yêu cầu đạt tối thiểu <span className="text-emerald-400 font-bold">{passingScore}%</span> điểm để mở khóa bài học kế tiếp.
          </p>
        </div>

        {hasSubmitted && (
          <button
            onClick={handleRetake}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại bài kiểm tra</span>
          </button>
        )}
      </div>

      {/* Result Score Banner */}
      {hasSubmitted && quizResult && (
        <div className={`p-5 rounded-2xl mb-8 border transition-all duration-300 shadow-lg ${
          quizResult.passed 
            ? 'bg-gradient-to-r from-emerald-950/70 via-teal-950/60 to-slate-900 border-emerald-600/50 shadow-emerald-950/40' 
            : 'bg-gradient-to-r from-rose-950/70 via-red-950/60 to-slate-900 border-rose-600/50 shadow-rose-950/40'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                quizResult.passed 
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30' 
                  : 'bg-rose-500 text-white shadow-rose-500/30'
              }`}>
                {quizResult.scorePercentage}%
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-white">
                    {quizResult.passed ? '🎉 XUẤT SẮC! BẠN ĐÃ ĐẠT CHUẨN' : '⚠️ CHƯA ĐẠT CHUẨN ĐẦU RA'}
                  </h4>
                  {quizResult.passed && <Sparkles className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Đúng {quizResult.correctCount}/{quizResult.totalQuestions} câu. 
                  {quizResult.passed 
                    ? ' Bạn đã đủ điều kiện để mở khóa bài học tiếp theo!' 
                    : ` Bạn cần đạt tối thiểu ${passingScore}% để mở khóa bài tiếp theo. Hãy xem lại lời giải thích bên dưới và làm lại nhé.`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {!quizResult.passed && (
                <button
                  onClick={handleRetake}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-900/30 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại ngay</span>
                </button>
              )}

              {quizResult.passed && hasNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 transition-all hover:scale-105"
                >
                  <span>Chuyển sang bài tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validation warning */}
      {validationError && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2.5 shadow-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {quiz.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const questionDetail = quizResult?.details.find(d => d.id === q.id);

          return (
            <div 
              key={q.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                hasSubmitted 
                  ? questionDetail?.isCorrect 
                    ? 'bg-emerald-950/20 border-emerald-800/50' 
                    : 'bg-rose-950/20 border-rose-800/50'
                  : isAnswered
                    ? 'bg-slate-900/90 border-slate-700'
                    : 'bg-slate-950/40 border-slate-800/80'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start space-x-3">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    hasSubmitted
                      ? questionDetail?.isCorrect 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {qIndex + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                    {q.question}
                  </h4>
                </div>

                {hasSubmitted && (
                  <div className="shrink-0">
                    {questionDetail?.isCorrect ? (
                      <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Đúng
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Sai
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((optionText, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  const isCorrectAnswer = optIndex === q.correctAnswer;

                  let optionStyle = 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 text-slate-300';

                  if (hasSubmitted) {
                    if (isCorrectAnswer) {
                      optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500/50';
                    } else if (isSelected && !isCorrectAnswer) {
                      optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 line-through';
                    } else {
                      optionStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-emerald-600/20 border-emerald-500 text-white font-medium ring-1 ring-emerald-500/50';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={hasSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        hasSubmitted && isCorrectAnswer
                          ? 'bg-emerald-500 text-slate-950'
                          : isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                      }`}>
                        {letters[optIndex]}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed flex-1">
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box (Visible after submission) */}
              {hasSubmitted && (
                <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold mb-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Giải thích vì sao:</span>
                  </div>
                  <p className="leading-relaxed text-slate-300 pl-5">
                    {q.explanation}
                  </p>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Action Footer Button */}
      {!hasSubmitted && (
        <div className="mt-8 pt-5 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Nộp bài & Chấm điểm ngay</span>
          </button>
        </div>
      )}

    </div>
  );
}
