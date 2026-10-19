import React, { useState } from 'react';
import { 
  X, 
  FileCheck2, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Copy, 
  HelpCircle,
  Award,
  ListOrdered
} from 'lucide-react';
import api from '../services/api';

export default function AdminLessonQuizModal({ 
  isOpen, 
  onClose, 
  currentLesson, 
  onQuizSaved 
}) {
  const [questions, setQuestions] = useState([]);
  const [passingScore, setPassingScore] = useState(80);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'quick_import'
  const [rawText, setRawText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [prevLessonId, setPrevLessonId] = useState(null);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  if (currentLesson && isOpen && currentLesson.id !== prevLessonId) {
    setPrevLessonId(currentLesson.id);
    setPassingScore(currentLesson.passingScore || 80);
    const initialQuestions = Array.isArray(currentLesson.quiz) && currentLesson.quiz.length > 0
      ? currentLesson.quiz.map((q, idx) => ({
          id: q.id || `q_${currentLesson.id}_${idx + 1}`,
          question: q.question || '',
          options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || ''
        }))
      : [];
    setQuestions(initialQuestions);
    setRawText('');
    setStatusMessage({ type: '', text: '' });
  }

  if (!isOpen || !currentLesson) return null;

  // Thêm một câu hỏi mới vào danh sách
  const handleAddQuestion = () => {
    const newIdx = questions.length + 1;
    setQuestions(prev => [
      ...prev,
      {
        id: `q_${currentLesson.id}_${Date.now()}`,
        question: `Câu hỏi mới số ${newIdx}: Nội dung nghiệp vụ thực chiến...`,
        options: [
          'Đáp án lựa chọn A',
          'Đáp án lựa chọn B',
          'Đáp án lựa chọn C',
          'Đáp án lựa chọn D'
        ],
        correctAnswer: 0,
        explanation: 'Giải thích lý do vì sao đáp án này chính xác theo cẩm nang kịch bản Running Man...'
      }
    ]);
  };

  // Cập nhật câu hỏi
  const handleUpdateQuestion = (qIdx, field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx] = { ...updated[qIdx], [field]: value };
      return updated;
    });
  };

  // Cập nhật một đáp án trong câu hỏi
  const handleUpdateOption = (qIdx, optIdx, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      const newOptions = [...updated[qIdx].options];
      newOptions[optIdx] = value;
      updated[qIdx] = { ...updated[qIdx], options: newOptions };
      return updated;
    });
  };

  // Xóa câu hỏi
  const handleDeleteQuestion = (qIdx) => {
    if (window.confirm(`Bạn có chắc muốn xóa câu hỏi số ${qIdx + 1}?`)) {
      setQuestions(prev => prev.filter((_, idx) => idx !== qIdx));
    }
  };

  // Phân tích văn bản nhập nhanh (Quick Text Parser)
  const handleParseRawText = () => {
    if (!rawText.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng dán nội dung văn bản đề thi vào ô bên dưới!' });
      return;
    }

    try {
      const parsedQuestions = [];
      // Tách từng khối câu hỏi theo "Câu 1", "Câu 2", "1.", "2."
      const blocks = rawText.split(/(?=(?:Câu\s*\d+|^\d+[.)])\s*[:.-])/gim);

      for (const block of blocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;

        // Trích xuất nội dung câu hỏi
        const questionMatch = trimmed.match(/(?:Câu\s*\d+|\d+[.)])\s*[:.-]?\s*([^\n]+)/i);
        const questionTitle = questionMatch ? questionMatch[1].trim() : trimmed.split('\n')[0].trim();

        // Trích xuất các đáp án A, B, C, D
        const options = [];
        const optA = trimmed.match(/[Aa][.:)]\s*([^\n]+)/);
        const optB = trimmed.match(/[Bb][.:)]\s*([^\n]+)/);
        const optC = trimmed.match(/[Cc][.:)]\s*([^\n]+)/);
        const optD = trimmed.match(/[Dd][.:)]\s*([^\n]+)/);

        if (optA) options.push(optA[1].trim());
        if (optB) options.push(optB[1].trim());
        if (optC) options.push(optC[1].trim());
        if (optD) options.push(optD[1].trim());

        // Trích xuất đáp án đúng
        let correctAnswer = 0;
        const ansMatch = trimmed.match(/(?:Đáp án đúng|Đáp án|Answer)\s*[:.-]?\s*([A-Da-d0-3])/i);
        if (ansMatch) {
          const char = ansMatch[1].toUpperCase();
          if (char === 'A' || char === '0') correctAnswer = 0;
          else if (char === 'B' || char === '1') correctAnswer = 1;
          else if (char === 'C' || char === '2') correctAnswer = 2;
          else if (char === 'D' || char === '3') correctAnswer = 3;
        }

        // Trích xuất giải thích
        let explanation = '';
        const expMatch = trimmed.match(/(?:Giải thích|Explanation|Lý do)\s*[:.-]?\s*([^\n]+(?:\n[^\n]+)*)/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
        }

        if (options.length >= 2) {
          parsedQuestions.push({
            id: `q_parsed_${Date.now()}_${parsedQuestions.length + 1}`,
            question: questionTitle || `Câu hỏi ${parsedQuestions.length + 1}`,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation || 'Nghiệp vụ cốt lõi theo hướng dẫn của HLV Running Man.'
          });
        }
      }

      if (parsedQuestions.length > 0) {
        setQuestions(prev => [...prev, ...parsedQuestions]);
        setActiveTab('list');
        setStatusMessage({
          type: 'success',
          text: `Đã tự động phân tích và thêm thành công ${parsedQuestions.length} câu hỏi vào đề thi!`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Không thể nhận diện định dạng câu hỏi. Vui lòng bấm "Dán mẫu chuẩn" để xem ví dụ mẫu.'
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Lỗi phân tích: ${err.message}` });
    }
  };

  // Dán mẫu chuẩn mẫu
  const handlePasteSample = () => {
    setRawText(`Câu 1: Điểm nhận diện quan trọng nhất của căn hộ Duplex so với Studio thông thường là gì?
A. Duplex có tầng lửng thông tầng với chiều cao trần thông thoáng
B. Duplex không được phép nấu ăn bên trong
C. Duplex chỉ dành cho khách thuê người nước ngoài
D. Duplex luôn có diện tích nhỏ hơn 15m2
Đáp án đúng: A
Giải thích: Căn hộ Duplex nổi bật với thiết kế có gác lửng thông tầng, tối ưu hóa không gian ngủ và sinh hoạt riêng biệt.

Câu 2: Khi khách hàng thắc mắc giá thuê căn Studio 6.5 triệu cao hơn phòng trọ truyền thống, nhân viên sale nên giải thích thế nào?
A. Khuyên khách đi tìm phòng khác rẻ hơn
B. Phân tích giá trị full nội thất, giờ giấc tự do, an ninh khóa vân tay và không gian sống đẳng cấp
C. Giảm giá ngay lập tức 1 triệu cho khách
D. Báo chủ nhà không cho bớt
Đáp án đúng: B
Giải thích: Bán giá trị thay vì bán giá tiền. Khách hàng sẵn sàng chi trả khi thấy rõ tiện ích sống vượt trội.`);
  };

  // Lưu toàn bộ câu hỏi vào database
  const handleSaveQuiz = async () => {
    if (questions.length === 0) {
      if (!window.confirm('Chuyên đề này hiện chưa có câu hỏi nào. Bạn có chắc muốn lưu đề thi rỗng?')) {
        return;
      }
    }

    // Kiểm tra câu hỏi hợp lệ
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setStatusMessage({ type: 'error', text: `Câu số ${i + 1} chưa có nội dung câu hỏi.` });
        return;
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        setStatusMessage({ type: 'error', text: `Câu số ${i + 1} phải có ít nhất 2 đáp án lựa chọn.` });
        return;
      }
    }

    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await api.courses.updateQuiz(currentLesson.id, {
        quiz: questions,
        passingScore: Number(passingScore) || 80
      });

      if (res && res.success) {
        setStatusMessage({ type: 'success', text: 'Đã lưu toàn bộ bài kiểm tra sát hạch thành công!' });
        if (onQuizSaved) {
          onQuizSaved(res.courses || []);
        }
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Lỗi khi lưu bài kiểm tra' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#1a1715] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.08] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-[#201c1a] dark:to-[#171514]">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {currentLesson.category || 'Chuyên đề'}
                </span>
                <span className="text-xs text-slate-400 dark:text-stone-500 font-mono">
                  {questions.length} câu hỏi
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                Biên tập Sát Hạch: {currentLesson.title}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.15] text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Passing Score Strip */}
        <div className="px-6 py-3 bg-slate-50/70 dark:bg-[#141211] border-b border-slate-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#201c1a] text-slate-600 dark:text-stone-300 hover:text-slate-900 border border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Danh sách câu hỏi ({questions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('quick_import')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'quick_import'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#201c1a] text-slate-600 dark:text-stone-300 hover:text-slate-900 border border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nhập nhanh từ Text / AI</span>
            </button>
          </div>

          {/* Cấu hình Điểm Đạt (Passing Score) */}
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-slate-600 dark:text-stone-300">Điểm đạt để qua bài:</span>
            <select
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer focus:outline-none"
            >
              <option value={60}>60% (Đạt 6/10 câu)</option>
              <option value={70}>70% (Đạt 7/10 câu)</option>
              <option value={80}>80% (Đạt 8/10 câu - Chuẩn RMSA)</option>
              <option value={90}>90% (Đạt 9/10 câu - Xuất sắc)</option>
              <option value={100}>100% (Đạt 10/10 câu - Hoàn hảo)</option>
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Message */}
          {statusMessage.text && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: DANH SÁCH CÂU HỎI TRỰC QUAN */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              {questions.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-stone-800">
                  <FileCheck2 className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-stone-700" />
                  <h4 className="font-bold text-slate-700 dark:text-stone-300 text-sm">Chưa có câu hỏi nào trong chuyên đề này</h4>
                  <p className="text-xs text-slate-400 dark:text-stone-500 mt-1 max-w-sm mx-auto">
                    Bấm nút "Thêm câu hỏi mới" hoặc chuyển sang tab "Nhập nhanh từ Text" để thêm ngay bộ đề thi.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Câu Hỏi Đầu Tiên</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {questions.map((q, qIdx) => (
                    <div 
                      key={q.id || qIdx}
                      className="p-5 rounded-3xl bg-slate-50/70 dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-2xs"
                    >
                      {/* Top Bar câu hỏi */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                          Câu {qIdx + 1} / {questions.length}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(qIdx)}
                          className="px-2.5 py-1 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa câu này</span>
                        </button>
                      </div>

                      {/* Nội dung câu hỏi */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-stone-400 block uppercase tracking-wider">
                          Nội dung câu hỏi
                        </label>
                        <textarea
                          rows={2}
                          value={q.question}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                          placeholder="Nhập nội dung câu hỏi nghiệp vụ..."
                          className="w-full p-3 rounded-2xl bg-white dark:bg-[#171514] border border-slate-200 dark:border-white/[0.08] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>

                      {/* 4 Đáp án lựa chọn */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-stone-400 block uppercase tracking-wider">
                          Các đáp án lựa chọn (Nhấp vào hình tròn để chọn đáp án đúng)
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = Number(q.correctAnswer) === optIdx;
                            return (
                              <div 
                                key={optIdx}
                                className={`flex items-center space-x-2.5 p-2 rounded-2xl border transition-all ${
                                  isCorrect 
                                    ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/50 text-emerald-900 dark:text-emerald-200' 
                                    : 'bg-white dark:bg-[#171514] border-slate-200 dark:border-white/[0.08]'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuestion(qIdx, 'correctAnswer', optIdx)}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition-all ${
                                    isCorrect 
                                      ? 'bg-emerald-500 text-white shadow-xs' 
                                      : 'bg-slate-100 dark:bg-stone-800 text-slate-500 dark:text-stone-400 hover:bg-slate-200'
                                  }`}
                                  title="Chọn đây là đáp án đúng"
                                >
                                  {letters[optIdx] || optIdx + 1}
                                </button>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                  placeholder={`Nội dung lựa chọn ${letters[optIdx]}...`}
                                  className="flex-1 bg-transparent text-xs text-slate-800 dark:text-white focus:outline-none"
                                />
                                {isCorrect && (
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 shrink-0">
                                    Đáp án đúng ✓
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Lời giải thích */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-stone-400 block uppercase tracking-wider flex items-center space-x-1">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Giải thích lý do đúng / sai (Hiển thị sau khi học viên nộp bài)</span>
                        </label>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                          placeholder="Ví dụ: Duplex là căn hộ có gác lửng cao, không gian sống sang trọng..."
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#171514] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-700 dark:text-stone-300 focus:outline-none"
                        />
                      </div>

                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full py-3.5 rounded-2xl border-2 border-dashed border-blue-400/60 dark:border-blue-500/30 hover:border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors bg-blue-50/30 dark:bg-blue-950/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Câu Hỏi Mới</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NHẬP NHANH TỪ VĂN BẢN / AI PARSER */}
          {activeTab === 'quick_import' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                <p className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Trình phân tích đề thi thông minh (Copy & Paste):</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  Bạn có thể copy đề thi từ file Word, Google Docs hoặc tin nhắn Zalo dán vào đây. Hệ thống tự động nhận diện câu hỏi, 4 đáp án A/B/C/D, đáp án đúng và lời giải thích!
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePasteSample}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Dán Mẫu Đề Chuẩn</span>
                </button>
              </div>

              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Dán đề thi của bạn vào đây (Hỗ trợ định dạng: Câu 1, A, B, C, D, Đáp án đúng, Giải thích)..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-mono text-slate-800 dark:text-white focus:outline-none"
              />

              <button
                type="button"
                onClick={handleParseRawText}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>⚡ Phân Tích & Tự Động Nạp Câu Hỏi Vào Đề Thi</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#171514] border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] font-bold text-xs transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveQuiz}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-2"
          >
            {isSaving ? (
              <span>Đang lưu bài thi...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu Bài Kiểm Tra Sát Hạch ({questions.length} câu)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
