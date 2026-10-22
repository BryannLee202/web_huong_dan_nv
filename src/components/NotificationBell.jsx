import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2,
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
  Volume2,
  Share2,
  Plus
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

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    
    // Tone 1: 880Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.18, now);
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
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Trình duyệt có thể chặn autoplay nếu chưa có user gesture
  }
}

// Chuẩn hóa chuỗi thời gian đảm bảo UTC ISO chính xác tuyệt đối
export function parseDateSafely(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  let str = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)) {
    str = str.replace(' ', 'T') + 'Z';
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+$/.test(str)) {
    str = str.replace(' ', 'T') + 'Z';
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}

// Định dạng giờ:phút chuẩn Giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7) - VD: "10:28"
export function formatVietnamTime(dateStr) {
  try {
    const d = parseDateSafely(dateStr);
    return d.toLocaleTimeString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return '';
  }
}

// Định dạng đầy đủ Ngày Giờ chuẩn Việt Nam - VD: "10:28:15 • 22/10/2026"
export function formatVietnamFullDate(dateStr) {
  try {
    const d = parseDateSafely(dateStr);
    const time = d.toLocaleTimeString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const date = d.toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return `${time} • ${date}`;
  } catch {
    return '';
  }
}

// Định dạng thời gian tương đối theo giờ thực tế chuẩn xác (VD: "Vừa xong", "5 phút trước")
export function formatTimeAgo(dateString, currentTimestamp = Date.now()) {
  if (!dateString) return '';
  try {
    const date = parseDateSafely(dateString);
    const now = typeof currentTimestamp === 'number' ? currentTimestamp : Date.now();
    const diffSec = Math.max(0, Math.floor((now - date.getTime()) / 1000));

    if (diffSec < 45) return 'Vừa xong';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// Kiểm tra xem người dùng có đang trên thiết bị iOS (iPhone/iPad) hay không
const isIOSDevice = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent || '') || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Kiểm tra xem ứng dụng có đang chạy ở chế độ Standalone (Đã thêm vào màn hình chính PWA)
const isPWAStandalone = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(window.navigator?.standalone) || 
    window.matchMedia('(display-mode: standalone)').matches;
};

// Bộ nhớ đệm Client-side lưu trữ các ID thông báo đã đọc (Chống lặp lại vĩnh viễn)
function getLocalReadIds() {
  try {
    const raw = localStorage.getItem('rmsa_read_notifications');
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(arr.map(x => String(x)));
  } catch {
    return new Set();
  }
}

function saveLocalReadId(id) {
  try {
    const set = getLocalReadIds();
    set.add(String(id));
    localStorage.setItem('rmsa_read_notifications', JSON.stringify([...set]));
  } catch {}
}

function saveAllLocalReadIds(ids) {
  try {
    const set = getLocalReadIds();
    ids.forEach(id => set.add(String(id)));
    localStorage.setItem('rmsa_read_notifications', JSON.stringify([...set]));
  } catch {}
}

// Bộ nhớ đệm Client-side lưu trữ các ID thông báo đã xóa (Ẩn tức thì và vĩnh viễn 100%)
function getLocalDeletedIds() {
  try {
    const raw = localStorage.getItem('rmsa_deleted_notifications');
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(arr.map(x => String(x)));
  } catch {
    return new Set();
  }
}

function saveLocalDeletedId(id) {
  try {
    const set = getLocalDeletedIds();
    set.add(String(id));
    localStorage.setItem('rmsa_deleted_notifications', JSON.stringify([...set]));
  } catch {}
}

function saveAllLocalDeletedIds(ids) {
  try {
    const set = getLocalDeletedIds();
    ids.forEach(id => set.add(String(id)));
    localStorage.setItem('rmsa_deleted_notifications', JSON.stringify([...set]));
  } catch {}
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
  const [showIosPushModal, setShowIosPushModal] = useState(false);
  const [liveNow, setLiveNow] = useState(Date.now());
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    targetRole: 'all',
    type: 'general',
    link: '/'
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showFeedback = (text) => {
    setFeedbackToast(text);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 2500);
  };

  const dropdownRef = useRef(null);
  const previousUnreadRef = useRef(0);
  const isFirstLoadRef = useRef(true);
  const knownNotifIdsRef = useRef(new Set());

  const effectiveRole = currentUser?.role || userRole || 'student';
  const effectiveUserId = String(
    currentUser?.id 
    || currentUser?.userId 
    || currentUser?.username 
    || currentUser?.email 
    || (effectiveRole === 'admin' ? 'admin' : 'default_user')
  ).trim();
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
        const localReadSet = getLocalReadIds();
        const localDeletedSet = getLocalDeletedIds();
        const rawNotifs = (res.notifications || []).filter(n => !localDeletedSet.has(String(n.id)));

        // Đồng bộ trạng thái đã đọc từ cả SQLite Backend VÀ localStorage của thiết bị
        const syncedNotifs = rawNotifs.map(n => {
          const isRead = (n.isRead === 1 || localReadSet.has(String(n.id))) ? 1 : 0;
          return { ...n, isRead };
        });

        const newUnread = syncedNotifs.filter(n => !n.isRead).length;

        // CHỈ PHÁT CHUÔNG CHO THÔNG BÁO HOÀN TOÀN MỚI CHƯA TỪNG THẤY
        // TUYỆT ĐỐI KHÔNG LẶP LẠI CHUÔNG CHO THÔNG BÁO CŨ HOẶC ĐÃ ĐỌC
        if (!isFirstLoadRef.current) {
          const hasBrandNewUnread = syncedNotifs.some(n => 
            !n.isRead && !knownNotifIdsRef.current.has(n.id)
          );
          if (hasBrandNewUnread) {
            playDingDongChime();
          }
        }

        // Lưu lại tất cả ID đã gặp vào Set
        syncedNotifs.forEach(n => knownNotifIdsRef.current.add(n.id));
        isFirstLoadRef.current = false;
        previousUnreadRef.current = newUnread;
        setNotifications(syncedNotifs);
        setUnreadCount(newUnread);
      }
    } catch (err) {
      console.warn('Lỗi tải thông báo:', err?.message);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [effectiveUserId, effectiveRole]);

  // 2.1. Live Ticker: Cập nhật đồng hồ nội bộ mỗi 10 giây để "Vừa xong" -> "1 phút trước" tự nhảy chính xác mà không cần F5
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // 2.2. Polling chu kỳ 8 giây và tự động đồng bộ ngay lập tức khi mở tab hoặc mở điện thoại
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 8000);

    // Khi người dùng chuyển lại tab hoặc mở màn hình điện thoại
    const handleVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        setLiveNow(Date.now());
        fetchNotifications(true);
      }
    };
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    // Lắng nghe tín hiệu Push từ Service Worker gửi vào tab đang mở
    let handleSwMessage;
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      handleSwMessage = (event) => {
        if (event.data?.type === 'RMSA_NEW_NOTIFICATION') {
          setLiveNow(Date.now());
          fetchNotifications(true);
        }
      };
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      if (handleSwMessage && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
    };
  }, [fetchNotifications]);

  // Khi mở bảng thông báo: lập tức cập nhật lại đồng hồ và làm mới dữ liệu
  useEffect(() => {
    if (isOpen) {
      setLiveNow(Date.now());
      fetchNotifications(true);
    }
  }, [isOpen, fetchNotifications]);

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
    // Nếu là iPhone / iPad mở trong trình duyệt Safari (chưa thêm vào Màn hình chính)
    if (isIOSDevice() && !isPWAStandalone()) {
      setShowIosPushModal(true);
      return;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      if (isIOSDevice()) {
        setShowIosPushModal(true);
      } else {
        setSubscribeStatus({ type: 'error', text: 'Trình duyệt này không hỗ trợ tính năng Web Push.' });
      }
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
          text: 'Bạn đã từ chối quyền. Hãy nhấp biểu tượng cài đặt trình duyệt để bật Cho phép (Allow).' 
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
      alert('🎉 Đã kết nối thiết bị thành công! Máy của bạn sẽ nhận thông báo chính thức mỗi khi Admin giao bài tập hoặc phát hành video mới.');
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

  // 4. Đánh dấu 1 thông báo đã đọc & tự động chuyển sang tab/chức năng tương ứng
  const handleNotificationClick = async (notif) => {
    if (!notif) return;
    const cleanId = String(notif.id);
    if (!notif.isRead) {
      // Lưu ngay vào localStorage thiết bị để không bao giờ bị lặp lại chưa đọc
      saveLocalReadId(cleanId);
      setNotifications(prev => prev.map(n => String(n.id) === cleanId ? { ...n, isRead: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));

      try {
        await api.notifications.markAsRead(cleanId, effectiveUserId);
      } catch (err) {
        console.warn('Lỗi đánh dấu đã đọc backend:', err);
      }
    }

    // Đóng dropdown thông báo ngay để người dùng thấy rõ tab/modal đích
    setIsOpen(false);

    // 1. Gọi trực tiếp prop onNavigate nếu component cha đã truyền
    if (typeof onNavigate === 'function') {
      try {
        onNavigate(notif);
      } catch (e) {
        console.warn('Lỗi onNavigate prop:', e);
      }
    }

    // 2. Phát sự kiện toàn cục để App.jsx bắt và tự động kích hoạt tab/modal chuẩn xác
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('RMSA_NAVIGATE_FEATURE', { 
          detail: { 
            notif,
            id: notif.id,
            link: notif.link || '',
            type: notif.type || '',
            title: notif.title || '',
            message: notif.message || ''
          } 
        }));
      } catch (e) {
        console.warn('Lỗi dispatchEvent RMSA_NAVIGATE_FEATURE:', e);
      }

      // 3. Nếu có đường dẫn URL hash, đồng bộ nhẹ URL Hash
      if (notif.link && typeof notif.link === 'string') {
        try {
          const cleanHash = notif.link.replace(/^#\/?/, '').replace(/^\//, '');
          if (cleanHash && !cleanHash.includes('admin')) {
            window.location.hash = `#/${cleanHash}`;
          }
        } catch {}
      }
    }
  };

  // 5. Đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    const allIds = notifications.map(n => String(n.id));
    saveAllLocalReadIds(allIds);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: 1 })));
    setUnreadCount(0);
    showFeedback('✓ Đã đánh dấu tất cả là đã đọc');

    try {
      await api.notifications.markAllAsRead({ userId: effectiveUserId, role: effectiveRole });
    } catch (err) {
      console.warn('Lỗi đánh dấu tất cả đã đọc backend:', err);
    }
  };

  // 6. Xóa 1 thông báo đối với tài khoản cá nhân (Phản hồi 0ms trên di động)
  const handleDeleteNotification = async (e, notifId) => {
    if (e) {
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
    }
    const cleanId = String(notifId);
    const targetNotif = notifications.find(n => String(n.id) === cleanId);
    saveLocalDeletedId(cleanId);
    
    // Gỡ bỏ lập tức trên UI (0ms phản hồi)
    setNotifications(prev => prev.filter(n => String(n.id) !== cleanId));
    if (targetNotif && !targetNotif.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    showFeedback('🗑️ Đã xóa 1 thông báo');

    try {
      await api.notifications.delete(cleanId, { userId: effectiveUserId, role: effectiveRole });
    } catch (err) {
      console.warn('Lỗi xóa thông báo backend:', err);
    }
  };

  // 7. Xóa tất cả thông báo đã đọc
  const handleClearReadNotifications = async () => {
    const readNotifs = notifications.filter(n => n.isRead);
    const readIds = readNotifs.map(n => String(n.id));
    if (readIds.length === 0) {
      showFeedback('ℹ️ Không có thông báo đã đọc nào để xóa');
      return;
    }

    saveAllLocalDeletedIds(readIds);
    setNotifications(prev => prev.filter(n => !n.isRead));
    showFeedback(`🗑️ Đã dọn dẹp ${readIds.length} thông báo đã đọc`);

    try {
      await api.notifications.clearRead({ userId: effectiveUserId, role: effectiveRole, ids: readIds });
    } catch (err) {
      console.warn('Lỗi xóa thông báo đã đọc backend:', err);
    }
  };

  // 8. Xóa toàn bộ thông báo (Cả đã đọc & chưa đọc để dọn sạch hộp thư)
  const handleClearAllNotifications = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ thông báo trong hộp thư không?')) return;

    const allIds = notifications.map(n => String(n.id));
    saveAllLocalDeletedIds(allIds);
    setNotifications([]);
    setUnreadCount(0);
    showFeedback('🗑️ Đã làm sạch toàn bộ hộp thư thông báo');

    try {
      await api.notifications.clearAll({ userId: effectiveUserId, role: effectiveRole });
    } catch (err) {
      console.warn('Lỗi xóa toàn bộ thông báo backend:', err);
    }
  };

  // 8. Quản trị viên phát hành thông báo khẩn cấp
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

  const hasReadNotifications = notifications.some(n => n.isRead);

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
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02] shrink-0">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Thông báo hệ thống</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
              title="Phát thông báo đẩy mới"
            >
              <Send className="w-3 h-3" />
              <span>Phát tin</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
            title="Đóng bảng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Banner Đăng ký Nhận Thông Báo Xuống Máy Cá Nhân */}
      {pushPermission !== 'granted' && (
        <div className="p-3.5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-blue-500/20 shrink-0">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
              <Smartphone className="w-4 h-4 pointer-events-none" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {isIOSDevice() && !isPWAStandalone() 
                  ? 'Bật thông báo đẩy trên iPhone (iOS)' 
                  : 'Nhận thông báo đẩy xuống máy cá nhân'}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                {isIOSDevice() && !isPWAStandalone()
                  ? 'Apple yêu cầu thêm web vào Màn hình chính Safari để nhận thông báo đẩy khi đóng web.'
                  : 'Bật tính năng đẩy trực tiếp xuống Windows / Android / iPhone ngay cả khi đang đóng web.'}
              </p>
              
              {subscribeStatus && (
                <div className={`mt-2 p-2 rounded-xl text-[11px] font-bold ${
                  subscribeStatus.type === 'success' 
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' 
                    : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                }`}>
                  {subscribeStatus.text}
                </div>
              )}

              <div className="mt-2.5 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleEnablePush}
                  disabled={isSubscribing}
                  className="px-3.5 py-2.5 min-h-[38px] rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer touch-manipulation"
                >
                  {isIOSDevice() && !isPWAStandalone() ? (
                    <>
                      <Smartphone className="w-3.5 h-3.5 pointer-events-none" />
                      <span>Xem cách bật trên iPhone</span>
                    </>
                  ) : (
                    <>
                      <Laptop className="w-3.5 h-3.5 pointer-events-none" />
                      <span>{isSubscribing ? 'Đang kích hoạt...' : 'Bật thông báo trên máy'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={playDingDongChime}
                  title="Thử âm thanh chuông thông báo"
                  className="px-3 py-2.5 min-h-[38px] rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 active:scale-95 transition-all flex items-center space-x-1 text-xs font-bold touch-manipulation cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 pointer-events-none" />
                  <span className="text-xs">Thử chuông</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo phản hồi thao tác tức thời */}
      {feedbackToast && (
        <div className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold text-center animate-in fade-in slide-in-from-top-1 shrink-0 flex items-center justify-center space-x-1 shadow-xs">
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Toolbar: Bộ lọc tab & Các nút dọn dẹp (100% rõ ràng, chuẩn touch target trên di động) */}
      <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/[0.08] bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold transition-all cursor-pointer touch-manipulation flex items-center ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold transition-all cursor-pointer touch-manipulation flex items-center ${
              filter === 'unread'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Chưa đọc ({unreadCount})
          </button>
        </div>

        {/* Các nút thao tác dọn dẹp: Kích thước tối thiểu 34px, chạm cực nhạy trên mọi điện thoại */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-2.5 py-1.5 min-h-[34px] rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 flex items-center space-x-1 cursor-pointer transition-all touch-manipulation shadow-2xs"
              title="Đánh dấu tất cả là đã đọc"
            >
              <CheckCheck className="w-3.5 h-3.5 pointer-events-none" />
              <span>Đã đọc hết</span>
            </button>
          )}

          {hasReadNotifications && (
            <button
              type="button"
              onClick={handleClearReadNotifications}
              className="px-2.5 py-1.5 min-h-[34px] rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 active:scale-95 flex items-center space-x-1 cursor-pointer transition-all touch-manipulation shadow-2xs"
              title="Xóa tất cả tin nhắn đã đọc để làm sạch danh sách"
            >
              <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
              <span>Xóa đã đọc</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllNotifications}
              className="px-2.5 py-1.5 min-h-[34px] rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 flex items-center space-x-1 cursor-pointer transition-all touch-manipulation shadow-2xs"
              title="Xóa tất cả thông báo"
            >
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.05]">
        {isLoading && notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Đang đồng bộ dữ liệu thông báo...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 opacity-50 pointer-events-none" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {filter === 'unread' ? 'Không có thông báo chưa đọc nào.' : 'Chưa có thông báo nào được phát hành.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 flex items-start space-x-3 transition-colors group relative ${
                notif.isRead 
                  ? 'hover:bg-slate-50/80 dark:hover:bg-white/[0.03] opacity-80' 
                  : 'bg-blue-50/40 hover:bg-blue-50/70 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 font-medium'
              }`}
            >
              {/* Icon thông báo */}
              <div 
                onClick={() => handleNotificationClick(notif)} 
                className="cursor-pointer shrink-0 mt-0.5 touch-manipulation"
              >
                {renderTypeIcon(notif.type)}
              </div>
              
              {/* Nội dung thông báo - Click vào đây sẽ mở link */}
              <div 
                onClick={() => handleNotificationClick(notif)} 
                className="flex-1 min-w-0 cursor-pointer touch-manipulation"
              >
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

                <div className="mt-1.5 flex items-center justify-between gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <span className="truncate max-w-[48%] font-medium">{notif.senderName || 'Hệ thống RMSA'}</span>
                  <span 
                    className="shrink-0 flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400"
                    title={`Giờ Việt Nam (UTC+7): ${formatVietnamFullDate(notif.created_at)}`}
                  >
                    <span>{formatTimeAgo(notif.created_at, liveNow)}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-mono text-[9.5px] bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/50 dark:border-slate-700/50">
                      {formatVietnamTime(notif.created_at)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Nút Xóa Độc Lập - Vùng bấm rộng 44x44px chuẩn Apple iOS */}
              <div className="flex items-center space-x-1 shrink-0 self-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotification(e, notif.id);
                  }}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 active:bg-rose-100 dark:active:bg-rose-900/50 active:scale-90 transition-all cursor-pointer touch-manipulation z-10 relative"
                  title="Xóa thông báo này"
                  aria-label="Xóa thông báo"
                >
                  <Trash2 className="w-4.5 h-4.5 pointer-events-none" />
                </button>
                {/* Nút mũi tên chuyển nhanh đến tính năng tương ứng */}
                <button
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className="w-8 h-11 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer touch-manipulation"
                  title="Bấm để chuyển trực tiếp đến chức năng này"
                >
                  <ChevronRight className="w-4 h-4 pointer-events-none" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer nhỏ */}
      <div className="px-3 py-2 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <span>Đồng bộ tự động theo thời gian thực</span>
        <span className="font-semibold">{pushPermission === 'granted' ? '🟢 Push: Đã kết nối' : '🟡 Push: Chưa bật'}</span>
      </div>
    </div>
  );

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Nút Chuông Thông Báo */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 touch-manipulation"
        title="Thông báo hệ thống & đẩy xuống máy cá nhân"
        aria-label="Thông báo"
      >
        <Bell className={`w-4 h-4 sm:w-4.5 sm:h-4.5 pointer-events-none transition-transform ${unreadCount > 0 ? 'animate-[bounce_2s_infinite]' : ''}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-xs border-2 border-white dark:border-slate-900 pointer-events-none">
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
        <div data-modal-portal="true" className="sm:hidden fixed inset-0 z-[99999] flex flex-col justify-end">
          {/* Backdrop tối phía sau: Bấm vào vùng tối này (vùng ngoài) để đóng drawer */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer touch-manipulation" 
            onClick={() => setIsOpen(false)}
            aria-label="Đóng bảng thông báo"
          />
          {/* Bottom Sheet Modal: Bắt buộc relative z-10 để nằm đè 100% lên trên backdrop */}
          <div 
            className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-white/[0.1] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thanh gạt handle */}
            <div 
              className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 shrink-0 cursor-pointer touch-manipulation" 
              onClick={() => setIsOpen(false)}
            />
            {notificationContent}
          </div>
        </div>,
        document.body
      )}

      {/* Modal Hướng Dẫn Bật Thông Báo Trên iPhone (iOS Safari) */}
      {showIosPushModal && typeof document !== 'undefined' && createPortal(
        <div 
          data-modal-portal="true"
          className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in touch-manipulation cursor-pointer"
          onClick={() => setShowIosPushModal(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/[0.1] shadow-2xl overflow-hidden p-5 sm:p-6 text-slate-800 dark:text-slate-100 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">Bật thông báo trên iPhone</h3>
                  <p className="text-[11px] text-slate-500">Chính sách bảo mật của Apple iOS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosPushModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Để nhận được thông báo đẩy chính thức xuống màn hình khóa iPhone khi bạn không mở web, Apple yêu cầu cài đặt ứng dụng web qua <strong>2 bước đơn giản</strong>:
              </p>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/40 flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <span>Nhấn biểu tượng Chia sẻ</span>
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    Ở thanh công cụ dưới đáy trình duyệt Safari (biểu tượng ô vuông có mũi tên hướng lên 📤).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/40 flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <span>Chọn "Thêm vào MH chính"</span>
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    Cuộn xuống danh sách và chọn dòng <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong> rồi nhấn "Thêm".
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/40 flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <span>Mở app & Nhận thông báo</span>
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    Mở ứng dụng RMSA từ Màn hình chính, bấm chuông chọn "Cho phép". Bạn sẽ nhận thông báo 100% như app App Store!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosPushModal(false)}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs shadow-md transition-all cursor-pointer touch-manipulation"
            >
              Tôi Đã Hiểu — Để Tôi Thao Tác
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Quản trị viên Phát Hành Thông Báo Khẩn (Broadcast) */}
      {showBroadcastModal && typeof document !== 'undefined' && createPortal(
        <div 
          data-modal-portal="true"
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in touch-manipulation cursor-pointer"
          onClick={() => setShowBroadcastModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/[0.1] shadow-2xl overflow-hidden p-6 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
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
