import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Zap
} from 'lucide-react';

// 3-minute diagnostic questions inspired by Duolingo's Practice Test
const practiceQuestions = [
  {
    id: 'pt_1',
    category: 'Kỹ năng Chào hỏi & Khám phá nhu cầu',
    question: 'Khi khách hàng tiềm năng vừa nhấc máy và nói: "Tôi đang rất bận, có gì gửi email đi!", bạn nên xử lý thế nào?',
    options: [
      'Dạ em cúp máy ngay, cảm ơn anh đã nghe.',
      'Em chỉ nói 1 phút thôi mà anh, anh cố gắng nghe đi!',
      'Dạ em hiểu anh đang bận. Em chỉ xin đúng 30 giây để xác nhận xem giải pháp này có đúng nhu cầu của anh không, nếu không phù hợp em xin phép không làm phiền thêm ạ.',
      'Anh không nghe là công ty anh sẽ thiệt hại nặng đấy ạ.'
    ],
    correctAnswer: 2,
    explanation: 'Đồng cảm với quỹ thời gian của khách và đưa ra giới hạn thời gian rõ ràng (30 giây) kèm cam kết tôn trọng sự riêng tư sẽ mở ra cơ hội tiếp cận cao nhất.'
  },
  {
    id: 'pt_2',
    category: 'Kỹ năng Xử lý từ chối giá',
    question: 'Khách hàng nói: "Bên em báo giá cao quá, đối thủ bên B bán rẻ hơn 30%!". Lựa chọn chuyên nghiệp nhất là gì?',
    options: [
      'Bên B bán hàng dởm, chất lượng kém lắm anh đừng tin!',
      'Dạ em cảm ơn anh. Bên B quả thật có mức giá rất tốt, nhưng anh có thể cho em hỏi tiêu chí quan trọng nhất khi anh chọn giải pháp này là độ bền hay chỉ là chi phí ban đầu ạ?',
      'Vậy anh qua bên B mua đi cho rẻ ạ.',
      'Bên em là chuẩn nhất thị trường rồi, đắt xắt ra miếng.'
    ],
    correctAnswer: 1,
    explanation: 'Không bao giờ nói xấu đối thủ. Hãy công nhận ý kiến của khách và nhẹ nhàng điều hướng cuộc trò chuyện quay về giá trị và tiêu chuẩn chất lượng lâu dài.'
  },
  {
    id: 'pt_3',
    category: 'Kỹ năng Chốt đơn & Bán gia tăng',
    question: 'Khi nhận thấy khách hàng đã ưng ý sản phẩm và hỏi về phương thức thanh toán, câu chốt đơn nào hiệu quả nhất?',
    options: [
      'Anh có quyết định mua hàng hôm nay không ạ?',
      'Để em về xin ý kiến sếp xem có giảm giá thêm không nhé.',
      'Dạ vậy bên em giao hàng vào sáng thứ 5 hay chiều thứ 6 này để tiện nhất cho quy trình vận hành của bên mình ạ?',
      'Thôi anh đừng mua nữa, để tháng sau mua cũng được.'
    ],
    correctAnswer: 2,
    explanation: 'Kỹ thuật chốt đơn lựa chọn thay thế (Alternative Choice) đưa ra 2 mốc thời gian đều dẫn đến việc hoàn tất hợp đồng, tránh tạo cảm giác ép buộc.'
  }
];

export default function PracticeTestModal({ isOpen, onClose, onStartFullCourse }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isFinished, setIsFinished] = useState(false);

  const handleFinish = useCallback(() => {
    setIsFinished(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
  }, []);

  const handleFinishRef = useRef(handleFinish);
  useEffect(() => {
    handleFinishRef.current = handleFinish;
  }, [handleFinish]);

  // Timer countdown
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
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
  }, [isFinished, timeLeft]);

  const handleSelectOption = (optIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [practiceQuestions[currentQIndex].id]: optIndex
    }));
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setTimeLeft(180);
    setIsFinished(false);
  };

  // Evaluation calculations
  let correctCount = 0;
  const results = practiceQuestions.map(q => {
    const selected = selectedAnswers[q.id];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correctCount++;
    return { ...q, selected, isCorrect };
  });

  const scorePercent = Math.round((correctCount / practiceQuestions.length) * 100);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = practiceQuestions[currentQIndex];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header - Duolingo Clean Style */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Thi Thử Phản Xạ Bán Hàng 3 Phút</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Bài kiểm tra chẩn đoán năng lực nhanh chuẩn Duolingo</p>
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
              onClick={onClose} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isFinished ? (
            <div className="space-y-6">
              
              {/* Step Progress Dots */}
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold mb-2">
                <span>Câu {currentQIndex + 1} / {practiceQuestions.length}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{currentQ.category}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / practiceQuestions.length) * 100}%` }}
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

                {currentQIndex < practiceQuestions.length - 1 ? (
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
                  KẾT QUẢ ĐÁNH GIÁ PHẢN XẠ NHANH
                </p>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400 my-2">
                  {scorePercent}%
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Đúng {correctCount}/{practiceQuestions.length} câu trong thời gian thử thách.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {scorePercent >= 80 
                    ? '🎉 Phản xạ bán hàng của bạn rất sắc bén! Bạn đã sẵn sàng để chinh phục trọn vẹn chứng chỉ đào tạo.' 
                    : '💡 Phản xạ khá tốt nhưng bạn còn bối rối ở khâu xử lý từ chối. Hãy tham gia lộ trình đào tạo tuần tự để hoàn thiện.'}
                </p>
              </div>

              {/* DUOLINGO STYLE: MULTI-DIMENSIONAL COMPETENCY BREAKDOWN */}
              <div className="bg-white dark:bg-slate-800/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Phân Tích 3 Trụ Cột Năng Lực Bán Hàng</span>
                </h4>

                <div className="space-y-3">
                  {/* Skill 1 */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">1. Kỹ năng Mở đầu & Phá vỡ rào cản</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {results[0].isCorrect ? '100% (Xuất sắc)' : '0% (Cần rèn luyện)'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600" 
                        style={{ width: results[0].isCorrect ? '100%' : '20%' }}
                      />
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">2. Kỹ năng Xử lý Khách chê giá đắt</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {results[1].isCorrect ? '100% (Xuất sắc)' : '0% (Cần rèn luyện)'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600" 
                        style={{ width: results[1].isCorrect ? '100%' : '20%' }}
                      />
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">3. Kỹ năng Chốt đơn không ép khách</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {results[2].isCorrect ? '100% (Xuất sắc)' : '0% (Cần rèn luyện)'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600" 
                        style={{ width: results[2].isCorrect ? '100%' : '20%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Feedback Cards */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">Giải thích đáp án chi tiết:</h5>
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
                    <p className="text-slate-600 dark:text-slate-300">{r.explanation}</p>
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
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thi thử lại</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onStartFullCourse();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Vào phòng học khóa đào tạo chính thức</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left w-full">
              💡 Đây là bài thi thử nhanh không lưu vào học bạ chính thức.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
