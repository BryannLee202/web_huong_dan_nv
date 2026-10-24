import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Trash2,
  Eye,
  Sparkles,
  ClipboardList,
  Check,
  Ban,
  UserCheck,
  UserX,
  Music
} from 'lucide-react';
import api from '../services/api';
import AdminMusicModal from './AdminMusicModal';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  courses = [], 
  _onSaveCourses, 
  _onReloadCourses,
  initialStaffFilter = 'ALL'
}) {
  const [activeTab] = useState('live-monitoring');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Live Monitoring & Staff states
  const [adminStats, setAdminStats] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [liveActivities, setLiveActivities] = useState([]);
  const [loadingMonitoring, setLoadingMonitoring] = useState(false);
  const [monitoringFilter, setMonitoringFilter] = useState('ALL');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffStatusFilter, setStaffStatusFilter] = useState(initialStaffFilter || 'ALL');
  const [processingUserId, setProcessingUserId] = useState(null);

  // Tự động đồng bộ bộ lọc nhân sự khi mở từ thông báo (VD: Chờ phê duyệt)
  useEffect(() => {
    if (isOpen && initialStaffFilter) {
      setStaffStatusFilter(initialStaffFilter);
      if (initialStaffFilter === 'PENDING') {
        setStatusMessage({ 
          type: 'info', 
          text: '🔔 Đang mở danh sách nhân sự mới chờ phê duyệt theo thông báo.' 
        });
        setTimeout(() => {
          const el = document.getElementById('admin-staff-table-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
  }, [isOpen, initialStaffFilter]);

  // States xem chi tiết bài làm & xóa nhân sự & dọn dữ liệu test
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [userAttempts, setUserAttempts] = useState([]);
  const [loadingUserAttempts, setLoadingUserAttempts] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [confirmCleanOpen, setConfirmCleanOpen] = useState(false);
  const [cleaningData, setCleaningData] = useState(false);
  const [musicModalOpen, setMusicModalOpen] = useState(false);

  const fetchMonitoringData = async (silent = false) => {
    if (!silent) setLoadingMonitoring(true);
    try {
      const [stats, users, activities] = await Promise.all([
        api.admin.getOverviewStats().catch(() => ({})),
        api.admin.getUsers().catch(() => []),
        api.admin.getActivities(60).catch(() => [])
      ]);

      if (stats) setAdminStats(stats);
      if (Array.isArray(users)) setStaffList(users);
      if (Array.isArray(activities)) setLiveActivities(activities);
    } catch {
      // ignore network errors
    } finally {
      if (!silent) setLoadingMonitoring(false);
    }
  };

  // Tự động đồng bộ số liệu Live Monitoring mỗi 4 giây khi mở modal (Cập nhật thời gian thực khi nhân viên đăng ký/đăng nhập Google)
  useEffect(() => {
    let timer = null;
    if (isOpen && activeTab === 'live-monitoring') {
      queueMicrotask(() => fetchMonitoringData(false));
      timer = setInterval(() => {
        fetchMonitoringData(true);
      }, 4000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, activeTab]);

  // Phê duyệt tài khoản nhân viên vào học
  const handleApproveUser = async (user) => {
    if (!user || !user.id) return;
    setProcessingUserId(user.id);
    try {
      // Optimistic UI update
      setStaffList(prev => prev.map(u => u.id === user.id ? { ...u, status: 'active' } : u));
      const res = await api.admin.approveUser(user.id);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Đã phê duyệt thành công cho học viên "${user.name || user.full_name || user.username}" vào học!`
        });
        await fetchMonitoringData(true);
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Lỗi khi phê duyệt học viên' });
        await fetchMonitoringData(true);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi kết nối khi phê duyệt' });
      await fetchMonitoringData(true);
    } finally {
      setProcessingUserId(null);
    }
  };

  // Từ chối / Tạm khóa tài khoản nhân viên
  const handleRejectUser = async (user) => {
    if (!user || !user.id) return;
    setProcessingUserId(user.id);
    try {
      // Optimistic UI update
      setStaffList(prev => prev.map(u => u.id === user.id ? { ...u, status: 'suspended' } : u));
      const res = await api.admin.rejectUser(user.id, 'Quản trị viên từ chối / tạm khóa');
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Đã từ chối / tạm khóa tài khoản "${user.name || user.full_name || user.username}"!`
        });
        await fetchMonitoringData(true);
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Lỗi khi xử lý tài khoản' });
        await fetchMonitoringData(true);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi kết nối khi xử lý' });
      await fetchMonitoringData(true);
    } finally {
      setProcessingUserId(null);
    }
  };

  // Xem chi tiết lịch sử bài làm & khảo sát của một nhân viên
  const handleViewUserAttempts = async (user) => {
    setSelectedUserDetail(user);
    setLoadingUserAttempts(true);
    try {
      const attempts = await api.admin.getUserAttempts(user.id);
      setUserAttempts(Array.isArray(attempts) ? attempts : []);
    } catch {
      setUserAttempts([]);
    } finally {
      setLoadingUserAttempts(false);
    }
  };

  // Xác nhận và xóa tài khoản nhân viên
  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUser(true);
    try {
      const res = await api.admin.deleteUser(userToDelete.id);
      if (res.success) {
        setStatusMessage({ 
          type: 'success', 
          text: `Đã xóa tài khoản nhân sự "${userToDelete.name || userToDelete.full_name || userToDelete.username}" thành công!` 
        });
        setUserToDelete(null);
        await fetchMonitoringData(false);
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Xóa tài khoản thất bại' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi xóa tài khoản' });
    } finally {
      setDeletingUser(false);
    }
  };

  // Dọn dẹp toàn bộ dữ liệu kiểm thử
  const handleCleanTestData = async () => {
    setCleaningData(true);
    try {
      const res = await api.admin.cleanTestData();
      if (res.success) {
        setStatusMessage({ 
          type: 'success', 
          text: 'Đã dọn dẹp sạch toàn bộ tài khoản thử nghiệm và nhật ký cũ thành công!' 
        });
        setConfirmCleanOpen(false);
        await fetchMonitoringData(false);
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Dọn dẹp dữ liệu thất bại' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi dọn dẹp dữ liệu' });
    } finally {
      setCleaningData(false);
    }
  };

  if (!isOpen) return null;

  const pendingCount = staffList.filter(u => u.status === 'pending').length;
  const totalPending = adminStats?.totalPending ?? pendingCount;

  const filteredStaff = staffList.filter(u => {
    if (staffStatusFilter !== 'ALL') {
      if (staffStatusFilter === 'PENDING' && u.status !== 'pending') return false;
      if (staffStatusFilter === 'ACTIVE' && u.status !== 'active') return false;
      if (staffStatusFilter === 'SUSPENDED' && u.status !== 'suspended') return false;
    }
    if (!staffSearchQuery.trim()) return true;
    const q = staffSearchQuery.toLowerCase().trim();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.phone && String(u.phone).includes(q))
    );
  });

  const filteredActivities = liveActivities.filter(act => {
    if (monitoringFilter === 'ALL') return true;
    if (monitoringFilter === 'QUIZ') return act.action_type === 'PASS_QUIZ' || act.action_type === 'FAIL_QUIZ';
    if (monitoringFilter === 'LOGIN') return act.action_type === 'LOGIN' || act.action_type === 'REGISTER_PENDING' || act.action_type === 'GOOGLE_REGISTER_PENDING';
    if (monitoringFilter === 'APPROVAL') return act.action_type === 'APPROVE_USER' || act.action_type === 'REJECT_USER';
    if (monitoringFilter === 'VIDEO') return act.action_type === 'WATCH_VIDEO';
    return true;
  });

  const modalContent = (
    <div data-modal-portal="true" className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border-0 sm:border border-slate-200 dark:border-slate-800 w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-5xl rounded-none sm:rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MOBILE HEADER (sm:hidden) */}
        <div className="sm:hidden px-3.5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0 gap-2">
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0 text-center px-1">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Admin Studio</span>
            </div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white truncate">
              Quản Trị & Giám Sát Sát Hạch
            </h3>
          </div>

          <button
            type="button"
            onClick={() => fetchMonitoringData(false)}
            disabled={loadingMonitoring}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loadingMonitoring ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>

        {/* DESKTOP HEADER (hidden sm:flex) */}
        <div className="hidden sm:flex px-6 py-4 border-b border-slate-200 dark:border-slate-800 items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900">
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
          <div className="py-3 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold flex items-center space-x-1.5 whitespace-nowrap">
            <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Giám Sát & Nhân Sự (Live)</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold rounded-full">
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
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300">TỔNG NHÂN SỰ</span>
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {adminStats?.totalUsers ?? staffList.length}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Chủ/Quản trị: <strong className="text-slate-900 dark:text-white">{adminStats?.totalAdmins ?? 1}</strong> • Học viên: <strong className="text-blue-600 dark:text-blue-400">{adminStats?.totalStudents ?? Math.max(0, staffList.length - 1)}</strong>
                  </div>
                </div>

                {/* Card Chờ Phê Duyệt (Ấn vào để lọc nhanh học viên chờ duyệt) */}
                <div 
                  onClick={() => setStaffStatusFilter(staffStatusFilter === 'PENDING' ? 'ALL' : 'PENDING')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    totalPending > 0
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 hover:border-amber-400 shadow-xs ring-2 ring-amber-400/20'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                  title="Nhấp vào để lọc danh sách học viên chờ phê duyệt"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[11px] font-bold ${totalPending > 0 ? 'text-amber-800 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'}`}>
                      CHỜ PHÊ DUYỆT
                    </span>
                    <UserCheck className={`w-4 h-4 ${totalPending > 0 ? 'text-amber-600 dark:text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className={`text-2xl font-black ${totalPending > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                      {totalPending}
                    </div>
                    {totalPending > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                        Cần duyệt
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {totalPending > 0 ? 'Có tài khoản mới • Bấm để duyệt' : 'Đã duyệt hết 100%'}
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
                    Tự động đồng bộ mỗi 4 giây
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Trung Tâm Giám Sát Nhân Viên & Hoạt Động Doanh Nghiệp</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Tự động đồng bộ mỗi 4 giây" />
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Phân định rõ Chủ/Quản trị viên và Nhân sự. Tự động phát hiện khi có thành viên đăng ký hoặc đăng nhập Google để Quản trị viên duyệt.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMusicModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Quản trị kho nhạc & AI bóc tách điệp khúc"
                  >
                    <Music className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quản Trị Nhạc AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmCleanOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Xóa sạch các tài khoản test và nhật ký cũ"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Dọn dữ liệu test</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchMonitoringData(false)}
                    disabled={loadingMonitoring}
                    className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMonitoring ? 'animate-spin text-blue-600' : 'text-slate-600 dark:text-slate-300'}`} />
                    <span>{loadingMonitoring ? 'Đang cập nhật...' : 'Làm mới dữ liệu'}</span>
                  </button>
                </div>
              </div>

              {/* Grid 2 Cột: Danh Sách Nhân Sự & Dòng Hoạt Động Trực Tiếp */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Cột 1: Danh Sách Nhân Sự */}
                <div id="admin-staff-table-section" className="lg:col-span-7 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Danh Sách Nhân Sự ({filteredStaff.length})</span>
                      </h5>
                    </div>

                    <div className="relative w-full sm:w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm theo tên, email, số điện thoại..."
                        value={staffSearchQuery}
                        onChange={e => setStaffSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1 text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Thanh lọc trạng thái nhân sự: Tất cả, Chờ duyệt, Đã duyệt, Tạm khóa */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setStaffStatusFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        staffStatusFilter === 'ALL'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Tất cả ({staffList.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setStaffStatusFilter('PENDING')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                        staffStatusFilter === 'PENDING'
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80'
                      }`}
                    >
                      <span>Chờ duyệt</span>
                      {pendingCount > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                          staffStatusFilter === 'PENDING' ? 'bg-white text-amber-600' : 'bg-amber-500 text-white animate-pulse'
                        }`}>
                          {pendingCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStaffStatusFilter('ACTIVE')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        staffStatusFilter === 'ACTIVE'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Đã duyệt ({staffList.filter(u => u.status === 'active').length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setStaffStatusFilter('SUSPENDED')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        staffStatusFilter === 'SUSPENDED'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Tạm khóa ({staffList.filter(u => u.status === 'suspended').length})
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-[420px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold sticky top-0 border-b border-slate-200 dark:border-slate-700 backdrop-blur-xs z-10">
                        <tr>
                          <th className="py-2.5 px-3 min-w-[200px]">Nhân sự</th>
                          <th className="py-2.5 px-3 min-w-[100px]">Vai trò</th>
                          <th className="py-2.5 px-3 min-w-[110px]">Điểm TB</th>
                          <th className="py-2.5 px-3 min-w-[110px]">Trạng thái</th>
                          <th className="py-2.5 px-3 text-center min-w-[150px]">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredStaff.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                              {staffStatusFilter === 'PENDING' 
                                ? 'Hiện không có thành viên nào đang chờ phê duyệt.' 
                                : 'Chưa có tài khoản nào phù hợp với bộ lọc.'}
                            </td>
                          </tr>
                        ) : (
                          filteredStaff.map((u) => {
                            const isRootAdmin = u.username === 'admin@runningman.vn';
                            const hasAttempted = (u.totalAttempts || 0) > 0 || (u.passedLessons || 0) > 0;
                            const isPending = u.status === 'pending';
                            const isSuspended = u.status === 'suspended';

                            return (
                              <tr 
                                key={u.id || u.username} 
                                className={`transition-colors ${
                                  isPending 
                                    ? 'bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/70 dark:hover:bg-amber-950/30' 
                                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <td className="py-2.5 px-3">
                                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                                    <span>{u.name || u.full_name || u.username}</span>
                                    {isPending && (
                                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" title="Thành viên mới chờ duyệt" />
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-semibold" title={u.username}>
                                      {u.username}
                                    </span>
                                    {(u.authProvider === 'google' || u.auth_provider === 'google' || u.google_id || (u.username && u.username.includes('@gmail.com'))) ? (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[9.5px] font-bold border border-red-200/60 dark:border-red-900/40">
                                        <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24">
                                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                        </svg>
                                        <span>Google</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9.5px] font-medium border border-slate-200/60 dark:border-slate-700">
                                        Mật khẩu
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                    {u.phone && u.phone !== 'Chưa cập nhật' && (
                                      <span>📱 {u.phone}</span>
                                    )}
                                    {u.createdAt && (
                                      <span>Đăng ký: {new Date(u.createdAt).toLocaleDateString('vi-VN')}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  {isRootAdmin ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-700/40 dark:border-slate-300">
                                      <ShieldCheck className="w-3 h-3 text-blue-400 dark:text-blue-600" />
                                      Chủ / Quản lý
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                                      Học viên
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">
                                  {isPending ? (
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium italic">
                                      Chờ duyệt để thi
                                    </span>
                                  ) : hasAttempted ? (
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                          (u.avgScore || 0) >= 80 
                                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                        }`}>
                                          {u.avgScore || 0}%
                                        </span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                          (Đỗ {u.passedLessons || 0}/8)
                                        </span>
                                      </div>
                                      <div className="text-[9.5px] text-slate-400">
                                        {u.totalAttempts || 0} lượt làm bài
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-[10.5px] text-slate-400 italic">
                                      Chưa làm bài
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">
                                  {isPending ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                      Chờ phê duyệt
                                    </span>
                                  ) : isSuspended ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                      Tạm khóa
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                      Đã duyệt
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center justify-center space-x-1.5">
                                    {/* THAO TÁC KHI ĐANG CHỜ PHÊ DUYỆT */}
                                    {isPending ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleApproveUser(u)}
                                          disabled={processingUserId === u.id}
                                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                          title="Duyệt cho học viên này vào học ngay"
                                        >
                                          {processingUserId === u.id ? (
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <Check className="w-3.5 h-3.5" />
                                          )}
                                          <span>Duyệt</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleRejectUser(u)}
                                          disabled={processingUserId === u.id}
                                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                                          title="Từ chối yêu cầu đăng ký"
                                        >
                                          <Ban className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setUserToDelete(u)}
                                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                                          title="Xóa tài khoản này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </>
                                    ) : isSuspended ? (
                                      /* THAO TÁC KHI TÀI KHOẢN ĐANG BỊ KHÓA */
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleApproveUser(u)}
                                          disabled={processingUserId === u.id}
                                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                          title="Mở khóa và duyệt lại tài khoản"
                                        >
                                          {processingUserId === u.id ? (
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <UserCheck className="w-3.5 h-3.5" />
                                          )}
                                          <span>Mở lại</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setUserToDelete(u)}
                                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                                          title="Xóa vĩnh viễn tài khoản này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </>
                                    ) : (
                                      /* THAO TÁC KHI TÀI KHOẢN ĐÃ DUYỆT (ACTIVE) */
                                      <>
                                        {/* Nút Xem Chi Tiết Bài Làm */}
                                        <button
                                          type="button"
                                          onClick={() => handleViewUserAttempts(u)}
                                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                                          title="Xem chi tiết các bài khảo sát & điểm số"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Nút Tạm Khóa Học Viên (ẩn nếu là Root Admin) */}
                                        {!isRootAdmin && (
                                          <button
                                            type="button"
                                            onClick={() => handleRejectUser(u)}
                                            disabled={processingUserId === u.id}
                                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-600 hover:text-white text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                                            title="Tạm khóa tài khoản học viên này"
                                          >
                                            <Ban className="w-3.5 h-3.5" />
                                          </button>
                                        )}

                                        {/* Nút Xóa Nhân Viên (ẩn nếu là Root Admin) */}
                                        {!isRootAdmin ? (
                                          <button
                                            type="button"
                                            onClick={() => setUserToDelete(u)}
                                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                                            title="Xóa vĩnh viễn tài khoản cá nhân này"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        ) : (
                                          <span className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-700" title="Tài khoản Quản trị viên gốc không thể xóa">
                                            -
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cột 2: Dòng Hoạt Động Trực Tiếp (Live Stream) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                      <span>Dòng Hoạt Động Trực Tiếp</span>
                    </h5>
                    <div className="flex items-center space-x-1">
                      {['ALL', 'APPROVAL', 'QUIZ', 'VIDEO', 'LOGIN'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setMonitoringFilter(cat)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            monitoringFilter === cat
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {cat === 'ALL' && 'Tất cả'}
                          {cat === 'APPROVAL' && 'Duyệt'}
                          {cat === 'QUIZ' && 'Thi'}
                          {cat === 'VIDEO' && 'Video'}
                          {cat === 'LOGIN' && 'Đăng nhập'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 max-h-[420px] overflow-y-auto space-y-2.5">
                    {filteredActivities.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                        Chưa có hoạt động nào được ghi nhận cho bộ lọc này.
                      </div>
                    ) : (
                      filteredActivities.map((act) => {
                        let iconColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900';
                        let iconComponent = <Clock className="w-3.5 h-3.5 text-blue-500" />;

                        if (act.action_type === 'APPROVE_USER') {
                          iconColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
                          iconComponent = <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
                        } else if (act.action_type === 'REJECT_USER') {
                          iconColor = 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
                          iconComponent = <Ban className="w-3.5 h-3.5 text-rose-600" />;
                        } else if (act.action_type === 'REGISTER_PENDING' || act.action_type === 'GOOGLE_REGISTER_PENDING') {
                          iconColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
                          iconComponent = <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />;
                        } else if (act.action_type === 'PASS_QUIZ') {
                          iconColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900';
                          iconComponent = <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
                        } else if (act.action_type === 'FAIL_QUIZ') {
                          iconColor = 'text-rose-500 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900';
                          iconComponent = <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
                        } else if (act.action_type === 'LOGIN') {
                          iconColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900';
                          iconComponent = <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />;
                        } else if (act.action_type === 'WATCH_VIDEO') {
                          iconColor = 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900';
                          iconComponent = <Film className="w-3.5 h-3.5 text-indigo-500" />;
                        } else if (act.action_type === 'DELETE_USER') {
                          iconColor = 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
                          iconComponent = <Trash2 className="w-3.5 h-3.5 text-rose-600" />;
                        } else if (act.action_type === 'SYSTEM_CLEANUP') {
                          iconColor = 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800';
                          iconComponent = <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
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

          {/* MODAL CON 1: XEM CHI TIẾT BÀI KHẢO SÁT 10 CÂU CỦA NHÂN VIÊN */}
          {selectedUserDetail && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Hồ Sơ & Lịch Sử Sát Hạch: {selectedUserDetail.name || selectedUserDetail.full_name || selectedUserDetail.username}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{selectedUserDetail.username}</span>
                        {(selectedUserDetail.authProvider === 'google' || selectedUserDetail.auth_provider === 'google' || (selectedUserDetail.username && selectedUserDetail.username.includes('@gmail.com'))) ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[10px] font-bold">
                            Đăng nhập Google
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                            Mật khẩu
                          </span>
                        )}
                        {selectedUserDetail.phone && selectedUserDetail.phone !== 'Chưa cập nhật' && (
                          <span>• 📱 {selectedUserDetail.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUserDetail(null)}
                    className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 text-center">
                      <div className="text-[10.5px] font-bold text-blue-800 dark:text-blue-300">TỔNG LƯỢT THI</div>
                      <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                        {userAttempts.length}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 text-center">
                      <div className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300">SỐ BÀI ĐÃ ĐỖ (≥80%)</div>
                      <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {selectedUserDetail.passedLessons || userAttempts.filter(a => a.passed).length}/8
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 text-center">
                      <div className="text-[10.5px] font-bold text-indigo-800 dark:text-indigo-300">ĐIỂM TRUNG BÌNH</div>
                      <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {selectedUserDetail.avgScore || (userAttempts.length > 0 ? Math.round(userAttempts.reduce((a, b) => a + (b.score || 0), 0) / userAttempts.length) : 0)}%
                      </div>
                    </div>
                  </div>

                  {/* Attempts List */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-500" />
                      <span>Chi tiết các lần làm bài khảo sát 10 câu:</span>
                    </h5>

                    {loadingUserAttempts ? (
                      <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Đang tải lịch sử thi...</span>
                      </div>
                    ) : userAttempts.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        Nhân viên này chưa thực hiện bài khảo sát sát hạch nào.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        {userAttempts.map((att, idx) => (
                          <div key={att.id || idx} className="p-3 bg-white dark:bg-slate-850 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 flex items-center justify-between gap-3 text-xs">
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {att.lesson_title || att.lesson_id}
                              </div>
                              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>Thời gian: {Math.floor(att.time_taken_seconds / 60)}p {att.time_taken_seconds % 60}s</span>
                                <span>•</span>
                                <span>{att.created_at ? new Date(att.created_at).toLocaleString('vi-VN') : ''}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                att.passed 
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40' 
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300/40'
                              }`}>
                                {att.score}% - {att.passed ? 'ĐỖ' : 'CHƯA ĐẠT'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                  <div>
                    {selectedUserDetail.username !== 'admin@runningman.vn' && (
                      <button
                        type="button"
                        onClick={() => {
                          const user = selectedUserDetail;
                          setSelectedUserDetail(null);
                          setUserToDelete(user);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Xóa vĩnh viễn tài khoản này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa tài khoản này</span>
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUserDetail(null)}
                    className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL CON 2: XÁC NHẬN XÓA TÀI KHOẢN NHÂN VIÊN */}
          {userToDelete && (
            <div data-modal-portal="true" className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Xác Nhận Xóa Tài Khoản Nhân Sự
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Thao tác này sẽ xóa vĩnh viễn và không thể khôi phục
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 rounded-xl text-xs text-rose-900 dark:text-rose-200 space-y-1">
                  <p>
                    Bạn có chắc chắn muốn xóa nhân sự: <strong>{userToDelete.name || userToDelete.full_name || userToDelete.username}</strong> ({userToDelete.username})?
                  </p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-300">
                    Toàn bộ tiến độ học tập, lịch sử thi và điểm Bảng Vàng của tài khoản này sẽ được dọn sạch khỏi SQLite.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUserToDelete(null)}
                    disabled={deletingUser}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteUser}
                    disabled={deletingUser}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {deletingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>{deletingUser ? 'Đang xóa...' : 'Xác nhận xóa vĩnh viễn'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL CON 3: XÁC NHẬN DỌN DẸP DỮ LIỆU TEST */}
          {confirmCleanOpen && (
            <div data-modal-portal="true" className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Dọn Sạch Dữ Liệu Thử Nghiệm
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Làm sạch danh sách nhân sự khỏi các tài khoản test
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/50 rounded-xl text-xs text-purple-900 dark:text-purple-200 space-y-1">
                  <p>
                    Hệ thống sẽ <strong>xóa toàn bộ các tài khoản thử nghiệm tự động (Mock Test Accounts)</strong>.
                  </p>
                  <p className="text-[11px] text-purple-600 dark:text-purple-300">
                    Tài khoản Quản trị viên gốc và tài khoản học viên thật sẽ được bảo toàn an toàn 100%.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmCleanOpen(false)}
                    disabled={cleaningData}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleCleanTestData}
                    disabled={cleaningData}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {cleaningData ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{cleaningData ? 'Đang dọn...' : 'Tiến hành dọn dẹp'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="hidden sm:inline">Tổng số bài học: <strong className="text-slate-800 dark:text-white">{courses.length}</strong></span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer text-center active:scale-98"
          >
            Đóng bảng quản trị
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <>
      {typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
      <AdminMusicModal isOpen={musicModalOpen} onClose={() => setMusicModalOpen(false)} />
    </>
  );
}
