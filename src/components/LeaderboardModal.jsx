import React from 'react';
import { X, Trophy } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bảng Xếp Hạng Nhân Sự</h3>
              <p className="text-xs text-slate-500">Thi đua điểm số và tiến độ hoàn thành đào tạo</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="p-6 overflow-y-auto bg-slate-50">
          <div className="space-y-2.5">
            {topStudents.map((st) => (
              <div 
                key={st.rank}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  st.isCurrent 
                    ? 'bg-emerald-50/80 border-[#007c5d] shadow-xs' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    st.rank === 1 ? 'bg-amber-400 text-slate-900' :
                    st.rank === 2 ? 'bg-slate-300 text-slate-900' :
                    st.rank === 3 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {st.rank}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold ${st.isCurrent ? 'text-[#007c5d]' : 'text-slate-900'}`}>
                        {st.name} {st.isCurrent && '(Bạn)'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {st.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{st.speed} • {st.lessonsDone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#007c5d]">{st.score}%</span>
                  <p className="text-[10px] text-slate-400">Điểm thi</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
