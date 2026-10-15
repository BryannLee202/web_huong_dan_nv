import React from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Target,
  FileCheck2
} from 'lucide-react';

export default function KeyTakeaways({ 
  summary, 
  onStartQuiz, 
  passingScore, 
  quizLength 
}) {
  return (
    <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nội Dung Tóm Tắt & Kịch Bản Cốt Lõi</h3>
            <p className="text-xs text-slate-400">Các nguyên tắc vàng cần ghi nhớ để áp dụng thực tế và làm bài kiểm tra</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Target className="w-3.5 h-3.5 mr-1" />
          Chuẩn qua môn: {passingScore}%
        </span>
      </div>

      {/* Summary points list */}
      <ul className="space-y-3 mb-6">
        {summary && summary.map((point, idx) => (
          <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* Action banner to start quiz */}
      <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/30 p-4 rounded-xl border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <FileCheck2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Sẵn sàng kiểm tra năng lực?</h4>
            <p className="text-xs text-slate-400">
              Bài test gồm {quizLength} câu hỏi tình huống thực chiến. Đạt $\ge$ {passingScore}% để mở khóa bài tiếp theo.
            </p>
          </div>
        </div>

        <button
          onClick={onStartQuiz}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer hover:scale-[1.02]"
        >
          <span>Làm bài kiểm tra ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
