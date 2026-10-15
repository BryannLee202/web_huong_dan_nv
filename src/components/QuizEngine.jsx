import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  AlertCircle,
  Lightbulb,
  Send,
  HelpCircle
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
    if (hasSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    setValidationError('');
  };

  const handleSubmit = () => {
    const unanswered = quiz.filter(q => selectedAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      setValidationError(`Bạn còn ${unanswered.length} câu chưa chọn đáp án. Hãy trả lời hết trước khi nộp bài nhé!`);
      return;
    }

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

    if (passed) {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      if (onQuizPassed) onQuizPassed(lessonId, scorePercentage);
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
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">Bài Kiểm Tra Trắc Nghiệm</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {quiz.length} Câu hỏi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Yêu cầu đạt tối thiểu <span className="text-[#007c5d] font-bold">{passingScore}%</span> điểm để mở khóa bài học tiếp theo.
          </p>
        </div>

        {hasSubmitted && (
          <button
            onClick={handleRetake}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại bài</span>
          </button>
        )}
      </div>

      {/* Result Score Banner */}
      {hasSubmitted && quizResult && (
        <div className={`p-5 rounded-2xl mb-8 border transition-all ${
          quizResult.passed 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs ${
                quizResult.passed 
                  ? 'bg-[#007c5d] text-white' 
                  : 'bg-rose-600 text-white'
              }`}>
                {quizResult.scorePercentage}%
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold">
                  {quizResult.passed ? 'Chúc mừng! Bạn đã đạt chuẩn' : 'Chưa đạt điểm yêu cầu'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Đúng {quizResult.correctCount}/{quizResult.totalQuestions} câu. 
                  {quizResult.passed 
                    ? ' Bài tiếp theo đã được mở khóa trên menu.' 
                    : ` Bạn cần tối thiểu ${passingScore}%. Hãy xem lại giải thích từng câu và làm lại nhé.`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              {!quizResult.passed && (
                <button
                  onClick={handleRetake}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại ngay</span>
                </button>
              )}

              {quizResult.passed && hasNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                >
                  <span>Chuyển sang bài tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validation warning */}
      {validationError && (
        <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {quiz.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const questionDetail = quizResult?.details.find(d => d.id === q.id);

          return (
            <div 
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                hasSubmitted 
                  ? questionDetail?.isCorrect 
                    ? 'bg-emerald-50/30 border-emerald-200' 
                    : 'bg-rose-50/30 border-rose-200'
                  : isAnswered
                    ? 'bg-white border-slate-300 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="flex items-start space-x-2.5">
                  <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 bg-slate-200 text-slate-700">
                    {qIndex + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                    {q.question}
                  </h4>
                </div>

                {hasSubmitted && (
                  <div className="shrink-0">
                    {questionDetail?.isCorrect ? (
                      <span className="inline-flex items-center text-xs font-bold text-[#007c5d] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Đúng
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Sai
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((optionText, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  const isCorrectAnswer = optIndex === q.correctAnswer;

                  let optionStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700';

                  if (hasSubmitted) {
                    if (isCorrectAnswer) {
                      optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrectAnswer) {
                      optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                    } else {
                      optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-emerald-50/60 border-[#007c5d] text-slate-900 font-medium ring-1 ring-[#007c5d]';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={hasSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        hasSubmitted && isCorrectAnswer
                          ? 'bg-[#007c5d] text-white'
                          : isSelected
                            ? 'bg-[#007c5d] text-white'
                            : 'bg-slate-100 text-slate-600'
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

              {/* Explanation Box */}
              {hasSubmitted && (
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <div className="flex items-center space-x-1.5 text-amber-700 font-bold mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Giải thích vì sao:</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-slate-600">
                    {q.explanation}
                  </p>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!hasSubmitted && (
        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Nộp bài & Chấm điểm ngay</span>
          </button>
        </div>
      )}

    </div>
  );
}
