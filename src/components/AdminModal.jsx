import React, { useState, useEffect } from 'react';
import { 
  X, 
  Film, 
  CheckCircle, 
  AlertCircle,
  Users,
  Activity,
  TrendingUp,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  Mail
} from 'lucide-react';
import api from '../services/api';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  courses = [], 
  onSaveCourses, 
  onReloadCourses 
}) {
  const [activeTab, setActiveTab] = useState('live-monitoring');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Live Monitoring & Staff states
  const [adminStats, setAdminStats] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [liveActivities, setLiveActivities] = useState([]);
  const [loadingMonitoring, setLoadingMonitoring] = useState(false);
  const [monitoringFilter, setMonitoringFilter] = useState('ALL');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  const fetchMonitoringData = async () => {
    setLoadingMonitoring(true);
    try {
      const [stats, users, activities] = await Promise.all([
        api.admin.getOverviewStats().catch(() => ({})),
        api.admin.getUsers().catch(() => []),
        api.admin.getActivities(50).catch(() => [])
      ]);

      if (stats) setAdminStats(stats);
      if (Array.isArray(users)) setStaffList(users);
      if (Array.isArray(activities)) setLiveActivities(activities);
    } catch {
      // ignore network errors
    } finally {
      setLoadingMonitoring(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (isOpen && activeTab === 'live-monitoring') {
      Promise.all([
        api.admin.getOverviewStats().catch(() => ({})),
        api.admin.getUsers().catch(() => []),
        api.admin.getActivities(50).catch(() => [])
      ]).then(([stats, users, activities]) => {
        if (!active) return;
        if (stats) setAdminStats(stats);
        if (Array.isArray(users)) setStaffList(users);
        if (Array.isArray(activities)) setLiveActivities(activities);
      });
    }
    return () => {
      active = false;
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const filteredStaff = staffList.filter(u => {
    if (!staffSearchQuery.trim()) return true;
    const q = staffSearchQuery.toLowerCase();
    return (
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.branch && u.branch.toLowerCase().includes(q))
    );
  });

  const filteredActivities = liveActivities.filter(act => {
    if (monitoringFilter === 'ALL') return true;
    if (monitoringFilter === 'QUIZ') return act.action_type === 'PASS_QUIZ' || act.action_type === 'FAIL_QUIZ';
    if (monitoringFilter === 'LOGIN') return act.action_type === 'LOGIN';
    if (monitoringFilter === 'VIDEO') return act.action_type === 'WATCH_VIDEO';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-5xl rounded-2xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Trung Tâm Quản Trị & Giám Sát Sát Hạch (Admin Studio)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Giám sát nhân sự, hoạt động thi trực tiếp, tạo bài học và xuất báo cáo đào tạo</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tab: Giám Sát & Nhân Sự Trực Tiếp (Live Real-time) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 space-x-4 text-xs font-semibold overflow-x-auto">
          <div className="py-3 border-b-2 border-amber-500 text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-1.5 whitespace-nowrap">
            <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Giám Sát & Nhân Sự (Live)</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold rounded-full">
              Real-time
            </span>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage.text && (
          <div className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
              : statusMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}>
            {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 dark:text-slate-200">
          
          {/* TAB 0: GIÁM SÁT NHÂN SỰ & HOẠT ĐỘNG TRỰC TIẾP (LIVE MONITORING) */}
          {activeTab === 'live-monitoring' && (
            <div className="space-y-6">
              
              {/* Top KPI Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">TỔNG NHÂN SỰ</span>
                    <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {adminStats?.totalUsers ?? staffList.length}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Chủ: <strong className="text-amber-600 dark:text-amber-400">{adminStats?.totalAdmins ?? 1}</strong> • Nhân viên: <strong className="text-blue-600 dark:text-blue-400">{adminStats?.totalStudents ?? Math.max(0, staffList.length - 1)}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">ĐIỂM SÁT HẠCH TB</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {adminStats?.avgScore ?? 0}%
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Đạt: <strong className="text-emerald-600 dark:text-emerald-400">{adminStats?.passedAttempts ?? 0}</strong> / {adminStats?.totalQuizAttempts ?? 0} lần thi
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300">NHẬT KÝ HOẠT ĐỘNG</span>
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {adminStats?.totalActivities ?? liveActivities.length}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Lưu trữ tự động SQLite
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300">TRẠNG THÁI HỆ THỐNG</span>
                    <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 my-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    GIÁM SÁT TRỰC TIẾP
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Đồng bộ thời gian thực 24/7
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Trung Tâm Giám Sát Nhân Viên & Hoạt Động Doanh Nghiệp</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Phân định rõ Chủ/Quản trị viên và Nhân sự. Tự động ghi lại từng lượt thi, xem bài giảng và đăng nhập.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchMonitoringData}
                  disabled={loadingMonitoring}
                  className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMonitoring ? 'animate-spin text-amber-500' : 'text-slate-600 dark:text-slate-300'}`} />
                  <span>{loadingMonitoring ? 'Đang cập nhật...' : 'Làm mới dữ liệu'}</span>
                </button>
              </div>

              {/* Grid 2 Cột: Danh Sách Nhân Sự & Dòng Hoạt Động Trực Tiếp */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Cột 1: Danh Sách Nhân Sự */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-500" />
                      <span>Danh Sách Nhân Sự & Phân Quyền ({filteredStaff.length})</span>
                    </h5>
                    <div className="relative w-44 sm:w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm theo tên, email, vai trò..."
                        value={staffSearchQuery}
                        onChange={e => setStaffSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1 text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold sticky top-0 border-b border-slate-200 dark:border-slate-700 backdrop-blur-xs">
                        <tr>
                          <th className="py-2 px-3">Nhân sự</th>
                          <th className="py-2 px-3">Tài khoản & Email</th>
                          <th className="py-2 px-3">Vai trò</th>
                          <th className="py-2 px-3">Trạng thái</th>
                          <th className="py-2 px-3">Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredStaff.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                              Chưa có tài khoản nào phù hợp với tìm kiếm.
                            </td>
                          </tr>
                        ) : (
                          filteredStaff.map((u) => (
                            <tr key={u.id || u.username} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-slate-900 dark:text-slate-100">
                                  {u.full_name || u.username}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                  {u.username}
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{u.email || u.username}</span>
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                {u.role === 'admin' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40">
                                    <ShieldCheck className="w-3 h-3 text-amber-500" />
                                    Chủ / Quản lý
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                                    Nhân viên
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  {u.status === 'active' ? 'Hoạt động' : 'Đang mở'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'Mặc định'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cột 2: Dòng Hoạt Động Trực Tiếp (Live Stream) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Dòng Hoạt Động Trực Tiếp</span>
                    </h5>
                    <div className="flex items-center space-x-1">
                      {['ALL', 'QUIZ', 'VIDEO', 'LOGIN'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setMonitoringFilter(cat)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            monitoringFilter === cat
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {cat === 'ALL' && 'Tất cả'}
                          {cat === 'QUIZ' && 'Thi'}
                          {cat === 'VIDEO' && 'Video'}
                          {cat === 'LOGIN' && 'Đăng nhập'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 max-h-[380px] overflow-y-auto space-y-2.5">
                    {filteredActivities.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                        Chưa có hoạt động nào được ghi nhận cho bộ lọc này.
                      </div>
                    ) : (
                      filteredActivities.map((act) => {
                        let iconColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900';
                        let iconComponent = <Clock className="w-3.5 h-3.5 text-blue-500" />;

                        if (act.action_type === 'PASS_QUIZ') {
                          iconColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900';
                          iconComponent = <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
                        } else if (act.action_type === 'FAIL_QUIZ') {
                          iconColor = 'text-rose-500 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900';
                          iconComponent = <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
                        } else if (act.action_type === 'LOGIN') {
                          iconColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900';
                          iconComponent = <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />;
                        } else if (act.action_type === 'WATCH_VIDEO') {
                          iconColor = 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900';
                          iconComponent = <Film className="w-3.5 h-3.5 text-indigo-500" />;
                        }

                        return (
                          <div key={act.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-start space-x-2.5 text-xs">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${iconColor}`}>
                              {iconComponent}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                                  {act.user_name}
                                  <span className="ml-1 text-[10px] font-normal text-slate-400">
                                    ({act.role === 'admin' ? 'Chủ' : 'Nhân viên'})
                                  </span>
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                  {act.created_at ? new Date(act.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-snug">
                                {act.description}
                              </p>
                              {act.branch && (
                                <div className="mt-1 flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                                    {act.branch}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Tổng số bài học: <strong className="text-slate-800 dark:text-white">{courses.length}</strong></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
