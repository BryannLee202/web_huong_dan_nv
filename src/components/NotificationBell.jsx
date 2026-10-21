import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Video, 
  FileText, 
  Award, 
  UserPlus, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  X, 
  ChevronRight,
  ShieldAlert,
  Smartphone,
  Laptop,
  Volume2
} from 'lucide-react';
import api from '../services/api';

// Chuyển đổi VAPID Public Key base64 thành Uint8Array cho PushManager
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Âm thanh chuông thông báo tinh tế bằng Web Audio API (Zero external assets, không lo 404)
function playDingDongChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    
    // Tone 1: 880Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: 1320Hz (E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.12);
    gain2.gain.setValueAtTime(0.18, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Trình duyệt có thể chặn autoplay nếu chưa có user gesture
  }
}

// Định dạng thời gian tương đối thân thiện (VD: "Vừa xong", "5 phút trước")
function formatTimeAgo(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 45) return 'Vừa xong';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export default function NotificationBell({ 
  currentUser = null, 
  userRole = 'student',
  onNavigate = null 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [isLoading, setIsLoading] = useState(false);
  const [pushPermission, setPushPermission] = useState('default');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null); // { type: 'success'|'error', text: string }
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    targetRole: 'all',
    type: 'general',
    link: '/'
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const dropdownRef = useRef(null);
  const previousUnreadRef = useRef(0);
  const isFirstLoadRef = useRef(true);

  const effectiveRole = currentUser?.role || userRole || 'student';
  const effectiveUserId = currentUser?.id || currentUser?.userId || null;
  const isAdmin = effectiveRole === 'admin';

  // 1. Kiểm tra trạng thái cấp quyền Push Notification của trình duyệt
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    } else {
      setPushPermission('unsupported');
    }
  }, []);

  // 2. Tải danh sách thông báo từ Backend
  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await api.notifications.getAll({
        userId: effectiveUserId,
        role: effectiveRole,
        limit: 40
      });

      if (res && res.success) {
        const newNotifs = res.notifications || [];
        const newUnread = res.unreadCount || 0;

        // Phát chuông nếu có thông báo mới tinh xuất hiện
        if (!isFirstLoadRef.current && newUnread > previousUnreadRef.current) {
          playDingDongChime();
        }

        previousUnreadRef.current = newUnread;
        isFirstLoadRef.current = false;
        setNotifications(newNotifs);
        setUnreadCount(newUnread);
      }
    } catch (err) {
      console.warn('Lỗi tải thông báo:', err?.message);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [effectiveUserId, effectiveRole]);

  // Polling chu kỳ 15 giây để cập nhật liên tục thông báo
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Đóng dropdown khi click ra ngoài (Desktop)
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 3. Đăng ký Web Push Notifications xuống máy (Windows / Android / iOS PWA)
  const handleEnablePush = async () => {
    if (!('Notification' in window)) {
      setSubscribeStatus({ type: 'error', text: 'Trình duyệt này không hỗ trợ tính năng Web Push.' });
      return;
    }
    if (!('serviceWorker' in navigator)) {
      setSubscribeStatus({ type: 'error', text: 'Trình duyệt không hỗ trợ Service Worker.' });
      return;
    }

    setIsSubscribing(true);
    setSubscribeStatus(null);

    try {
      // Yêu cầu quyền thông báo từ người dùng
      const perm = await Notification.requestPermission();
      setPushPermission(perm);

      if (perm !== 'granted') {
        setSubscribeStatus({ 
          type: 'error', 
          text: 'Bạn đã từ chối quyền. Hãy nhấp biểu tượng ổ khóa 🔒 trên thanh địa chỉ để bật Cho phép (Allow).' 
        });
        setIsSubscribing(false);
        return;
      }

      // Đăng ký Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      // Lấy VAPID public key từ server
      const vapidPublicKey = await api.notifications.getVapidPublicKey();
      if (!vapidPublicKey) {
        throw new Error('Không thể tải khóa mã hóa VAPID từ máy chủ.');
      }

      const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

      // Đăng ký Push Subscription với Push Manager của Browser
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey
        });
      }

      // Gửi subscription lên Backend SQLite để lưu giữ
      const subJson = subscription.toJSON();
      await api.notifications.subscribe(subJson, {
        role: effectiveRole,
        userId: effectiveUserId
      });

      setSubscribeStatus({ 
        type: 'success', 
        text: '🎉 Đã bật thông báo đẩy xuống máy thành công! Bạn sẽ nhận được tin nhắn ngay cả khi đang đóng web.' 
      });
      playDingDongChime();
    } catch (err) {
      console.error('Lỗi kích hoạt Push:', err);
      setSubscribeStatus({ 
        type: 'error', 
        text: `Lỗi kích hoạt thông báo: ${err?.message || 'Không xác định'}` 
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // 4. Đánh dấu 1 thông báo đã đọc & điều hướng
  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await api.notifications.markAsRead(notif.id, effectiveUserId);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: 1 } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.warn('Lỗi đánh dấu đã đọc:', err);
      }
    }

    if (notif.link) {
      setIsOpen(false);
      if (typeof onNavigate === 'function') {
        onNavigate(notif.link);
      } else {
        window.location.href = notif.link;
      }
    }
  };

  // 5. Đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllAsRead(effectiveUserId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Lỗi đánh dấu tất cả đã đọc:', err);
    }
  };

  // 6. Quản trị viên phát hành thông báo khẩn cấp
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;
    setIsBroadcasting(true);
    try {
      await api.notifications.broadcast({
        title: broadcastForm.title,
        message: broadcastForm.message,
        type: broadcastForm.type,
        link: broadcastForm.link || '/',
        targetRole: broadcastForm.targetRole
      });
      setShowBroadcastModal(false);
      setBroadcastForm({
        title: '',
        message: '',
        targetRole: 'all',
        type: 'general',
        link: '/'
      });
      await fetchNotifications();
      playDingDongChime();
      alert('Đã phát hành thông báo đẩy thành công đến các thiết bị cá nhân!');
    } catch (err) {
      alert(`Lỗi khi phát thông báo: ${err?.message || 'Không xác định'}`);
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Danh sách đã lọc theo tab
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  // Icon phù hợp theo loại thông báo
  const renderTypeIcon = (type) => {
    switch (type) {
      case 'video_published':
        return (
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>
        );
      case 'quiz_assigned':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        );
      case 'document_uploaded':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'user_pending':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case 'user_approved':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  // Nội dung bảng thông báo (Dùng chung cho Desktop popover và Mobile Drawer)
  const notificationContent = (
    <div className="flex flex-col h-full max-h-[85vh] sm:max-h-[560px]">
      {/* Header của Popup */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Thông báo hệ thống</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-1 cursor-pointer transition-colors"
              title="Đánh dấu tất cả là đã đọc"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đã đọc tất cả</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
              title="Phát thông báo đẩy mới"
            >
              <Send className="w-3 h-3" />
              <span>Phát tin</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="sm:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Banner Đăng ký Nhận Thông Báo Xuống Máy Cá Nhân */}
      {pushPermission !== 'granted' && (
        <div className="p-3 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-blue-500/20">
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Nhận thông báo đẩy xuống máy cá nhân
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                Bật tính năng đẩy trực tiếp xuống Windows / Android / iOS ngay cả khi bạn không mở web.
              </p>
              
              {subscribeStatus && (
                <div className={`mt-2 p-1.5 rounded text-[11px] ${
                  subscribeStatus.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                }`}>
                  {subscribeStatus.text}
                </div>
              )}

              <div className="mt-2.5 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleEnablePush}
                  disabled={isSubscribing}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>{isSubscribing ? 'Đang kích hoạt...' : 'Bật thông báo trên máy'}</span>
                </button>
                <button
                  type="button"
                  onClick={playDingDongChime}
                  title="Thử âm thanh chuông"
                  className="p-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-3 py-2 border-b border-slate-100 dark:border-white/[0.08] flex items-center space-x-1 bg-white dark:bg-slate-900">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Chưa đọc ({unreadCount})
        </button>
      </div>

      {/* Danh sách thông báo */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.05]">
        {isLoading && notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Đang đồng bộ dữ liệu thông báo...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {filter === 'unread' ? 'Không có thông báo chưa đọc nào.' : 'Chưa có thông báo nào được phát hành.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 flex items-start space-x-3 transition-colors cursor-pointer select-none group ${
                notif.isRead 
                  ? 'hover:bg-slate-50/80 dark:hover:bg-white/[0.03] opacity-80' 
                  : 'bg-blue-50/40 hover:bg-blue-50/70 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 font-medium'
              }`}
            >
              {renderTypeIcon(notif.type)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className={`text-xs leading-snug break-words ${
                    notif.isRead ? 'font-semibold text-slate-800 dark:text-slate-200' : 'font-bold text-slate-900 dark:text-white'
                  }`}>
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>{notif.senderName || 'Hệ thống RMSA'}</span>
                  <span>{formatTimeAgo(notif.created_at)}</span>
                </div>
              </div>

              {notif.link && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 self-center transition-colors" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer nhỏ */}
      <div className="px-3 py-2 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-[10px] text-slate-500">
        <span>Đồng bộ tự động theo thời gian thực</span>
        <span className="font-semibold">{pushPermission === 'granted' ? '🟢 Push: Sẵn sàng' : '🟡 Push: Chưa bật'}</span>
      </div>
    </div>
  );

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Nút Chuông Thông Báo */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
        title="Thông báo hệ thống & đẩy xuống máy cá nhân"
        aria-label="Thông báo"
      >
        <Bell className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${unreadCount > 0 ? 'animate-[bounce_2s_infinite]' : ''}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-xs border-2 border-white dark:border-slate-900">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown trên Desktop (>= 640px) */}
      {isOpen && (
        <div className="hidden sm:block absolute right-0 mt-2 w-[390px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.1] shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {notificationContent}
        </div>
      )}

      {/* Drawer Bottom Sheet trên Mobile (< 640px) thông qua Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="sm:hidden fixed inset-0 z-[99999] flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-white/[0.1] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Thanh gạt handle */}
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2" />
            {notificationContent}
          </div>
        </div>,
        document.body
      )}

      {/* Modal Quản trị viên Phát Hành Thông Báo Khẩn (Broadcast) */}
      {showBroadcastModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/[0.1] shadow-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Phát hành thông báo mới</h3>
                  <p className="text-xs text-slate-500">Đẩy tin tức tức thì xuống màn hình máy tính & điện thoại nhân viên</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề thông báo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: 📢 Đã có video bài tập mới chuyên đề 05..."
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nội dung chi tiết *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Nhập nội dung thông báo đầy đủ để nhân viên nắm bắt..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Đối tượng nhận
                  </label>
                  <select
                    value={broadcastForm.targetRole}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, targetRole: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả mọi người (Toàn công ty)</option>
                    <option value="student">Chỉ nhân viên đào tạo (Học viên)</option>
                    <option value="admin">Chỉ ban quản trị (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Loại thông báo
                  </label>
                  <select
                    value={broadcastForm.type}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">Chung / Tin tức</option>
                    <option value="video_published">Bài giảng Video</option>
                    <option value="quiz_assigned">Đề thi Sát hạch</option>
                    <option value="document_uploaded">Tài liệu học tập</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Đường dẫn khi nhấp vào (URL Link)
                </label>
                <input
                  type="text"
                  placeholder="/"
                  value={broadcastForm.link}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isBroadcasting ? 'Đang gửi...' : 'Phát thông báo ngay'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
