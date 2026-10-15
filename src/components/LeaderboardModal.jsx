import React from 'react';
import { X, Trophy, Medal, Star, Sparkles } from 'lucide-react';

export default function LeaderboardModal({ isOpen, onClose, currentStudentName = 'Nguyễn Văn A', currentStudentScore = 100 }) {
  if (!isOpen) return null;

  const topStudents = [
    { rank: 1, name: 'Trần Thị Mai', score: 100, lessonsDone: '3/3 bài', speed: 'Hoàn thành trong 45 phút', badge: '🥇 Thủ khoa' },
    { rank: 2, name: 'Lê Hoàng Nam', score: 95, lessonsDone: '3/3 bài', speed: 'Hoàn thành trong 55 phút', badge: '🥈 Á khoa' },
    { rank: 3, name: currentStudentName, score: currentStudentScore, lessonsDone: '3/3 bài', speed: 'Đang dẫn đầu', badge: '🥉 Top 3', isCurrent: true },
    { rank: 4, name: 'Phạm Minh Tuấn', score: 85, lessonsDone: '2/3 bài', speed: 'Đang học bài 3', badge: 'Top 5' },
    { rank: 5, name: 'Đỗ Thùy Linh', score: 80, lessonsDone: '2/3 bài', speed: 'Đang học bài 2', badge: 'Top 5' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/15 text-yellow-400 flex items-center justify-center border border-yellow-500/30">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Bảng Xếp Hạng Nhân Sự Xuất Sắc</h3>
              <p className="text-xs text-slate-400">Thi đua học tập và điểm số kiểm tra năng lực bán hàng</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-3">
            {topStudents.map((st) => (
              <div 
                key={st.rank}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  st.isCurrent 
                    ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/40' 
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    st.rank === 1 ? 'bg-yellow-500 text-slate-950' :
                    st.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    st.rank === 3 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {st.rank}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold ${st.isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                        {st.name} {st.isCurrent && '(Bạn)'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {st.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{st.speed} • {st.lessonsDone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-amber-400">{st.score}%</span>
                  <p className="text-[10px] text-slate-400">Điểm số</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
