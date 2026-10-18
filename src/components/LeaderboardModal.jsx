import React, { useState, useEffect } from 'react';
import { X, Trophy, Flame, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function LeaderboardModal({ isOpen, onClose, currentStudentName = 'Nhân Viên' }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    api.leaderboard.get()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setLeaderboard(data);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải bảng xếp hạng:', err);
      })
      .finally(() => {
        if (isMounted) setHasLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Bảng Xếp Hạng Chiến Binh RMSA
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Tự động & Chống spam
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tính điểm công bằng từ Quiz chuyên đề, Đề thi sát hạch (tối đa 3 bài/ngày) và Thực địa (tối đa 5 câu/ngày)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaderboard Table / Content */}
        <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex-1">
          {!hasLoaded ? (
            <div className="py-12 text-center text-slate-400">
              <div className="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs">Đang đồng bộ kết quả mới nhất...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                <Trophy className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Bảng Vàng Đang Chờ Ghi Danh Tuần Này
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
                Hiện tại chưa có nhân sự nào hoàn thành bài học, sát hạch hoặc tình huống thực địa. Hệ thống giới hạn tối đa 5 câu thực địa & 3 bài sát hạch mỗi ngày để chống spam, đảm bảo công bằng 100%.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Hệ thống tự động cập nhật ngay lập tức khi hoàn thành
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {leaderboard.map((st) => {
                const isCurrent = st.name === currentStudentName;
                return (
                  <div 
                    key={st.rank}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isCurrent 
                        ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 shadow-xs' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        st.rank === 1 ? 'bg-amber-400 text-slate-900 shadow-xs' :
                        st.rank === 2 ? 'bg-slate-300 text-slate-900' :
                        st.rank === 3 ? 'bg-amber-700/80 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {st.rank}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                            {st.name} {isCurrent && '(Bạn)'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {st.badge}
                          </span>
                          {st.streak > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> {st.streak} ngày
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{st.branch || 'RMSA'}</span>
                          <span>•</span>
                          <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            📚 Quiz: {st.passedQuizCount || 0}/8
                          </span>
                          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                            🎯 Sát hạch: {st.practicePassedCount || 0} bài
                          </span>
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            ⚡ Thực địa: {st.scenariosCount || 0} câu
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                        {st.totalScore}
                      </span>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Điểm tổng kết</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
