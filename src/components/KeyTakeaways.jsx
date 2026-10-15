import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  Target
} from 'lucide-react';

export default function KeyTakeaways({ 
  summary, 
  onStartQuiz, 
  passingScore, 
  quizLength 
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#007c5d] flex items-center justify-center border border-emerald-100">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Tóm Tắt Nội Dung Cốt Lõi</h3>
            <p className="text-xs text-slate-500">Các điểm then chốt cần ghi nhớ để áp dụng thực tế và làm bài kiểm tra</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          <Target className="w-3.5 h-3.5 mr-1 text-[#007c5d]" />
          Chuẩn qua: {passingScore}%
        </span>
      </div>

      {/* Summary points list */}
      <ul className="space-y-2.5 mb-6">
        {summary && summary.map((point, idx) => (
          <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-[#007c5d] mt-0.5 shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* Action banner to start quiz */}
      <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Sẵn sàng kiểm tra kiến thức?</h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Bài test gồm {quizLength} câu hỏi trắc nghiệm. Đạt tối thiểu {passingScore}% để mở khóa bài tiếp theo.
          </p>
        </div>

        <button
          onClick={onStartQuiz}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
        >
          <span>Làm bài kiểm tra ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
