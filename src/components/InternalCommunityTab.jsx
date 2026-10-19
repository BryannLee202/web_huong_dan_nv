import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Sparkles, 
  Trophy, 
  Flame, 
  HelpCircle, 
  Lightbulb, 
  Send, 
  Plus, 
  X, 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  Pin,
  PartyPopper,
  Inbox,
  RotateCcw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

const STORAGE_KEY = 'rmsa_internal_community_posts_v2';
const BOOKMARK_STORAGE_KEY = 'rmsa_community_bookmarks_v1';

// Bài viết ghim hướng dẫn duy nhất từ Ban Đào Tạo (fallback khi ngoại tuyến)
const OFFICIAL_WELCOME_POST = {
  id: 'notice_official_1',
  author: 'Đan Rin (HLV Trưởng)',
  authorUsername: 'admin@runningman.vn',
  role: 'mentor',
  branch: 'Ban Đào Tạo RMSA',
  avatar: '/images/anh_rin_avatar.jpg',
  time: 'Ghim Ban Quản Trị',
  category: 'notices',
  categoryLabel: '📢 Quy chế học việc nội bộ',
  categoryColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  isPinned: true,
  title: 'QUY CHUẨN NỘI BỘ: Không gian giải đáp thực địa & Vinh danh kết quả cho nhân viên mới',
  content: 'Chào mừng các bạn nhân viên mới gia nhập Running Man Sales Academy!\n\nĐây là không gian thảo luận nghiệp vụ nội bộ 100% dành cho anh em trong lúc đi dắt phòng thực tế:\n• Khi gặp khách ép giá, đòi giữ cọc quá lâu hoặc phòng có khuyết điểm: Hãy đăng ngay câu hỏi vào mục "Hỏi đáp ca khó" để HLV và các anh em hỗ trợ bẻ kịch bản.\n• Khi chốt cọc thành công phòng trọ / duplex: Hãy đăng bài "Báo cọc thực hành" để hệ thống tự động ghi nhận thành tích lên Bảng Vàng Tuần và anh em cùng chúc mừng.\n• Hãy giữ thái độ chia sẻ văn minh, bảo mật thông tin chủ nhà và cùng nhau chạy số bùng nổ!',
  likes: 0,
  likedByMe: false,
  bookmarked: false,
  comments: []
};

export default function InternalCommunityTab({
  isLoggedIn = false,
  currentUser = null,
  isAdmin = false,
  onOpenLogin
}) {
  // Đọc thông tin user từ prop hoặc fallback từ localStorage để luôn nhận diện chính xác người đang đăng nhập
  const effectiveUser = useMemo(() => {
    if (currentUser && (currentUser.username || currentUser.name || currentUser.fullName || currentUser.email)) {
      return currentUser;
    }
    try {
      const raw = localStorage.getItem('mapstudy_user');
      if (raw) return JSON.parse(raw);
    } catch {}
    return currentUser;
  }, [currentUser]);

  const effectiveLoggedIn = Boolean(isLoggedIn || effectiveUser);

  // Xác định quyền Quản trị viên / HLV Trưởng
  const isAdminUser = Boolean(
    isAdmin ||
    effectiveUser?.role === 'admin' ||
    effectiveUser?.role === 'mentor' ||
    effectiveUser?.username === 'admin@runningman.vn' ||
    effectiveUser?.email === 'admin@runningman.vn' ||
    (effectiveUser?.name && effectiveUser.name.toLowerCase().includes('đan rin'))
  );

  // Lấy thông tin người dùng hiện tại an toàn
  const getAuthorInfo = useCallback(() => {
    const name = effectiveUser?.fullName || effectiveUser?.name || (isAdminUser ? 'Đan Rin (HLV Trưởng)' : 'Nhân viên');
    const username = (effectiveUser?.username || effectiveUser?.email || name || 'guest').toLowerCase().trim();
    const role = isAdminUser ? (effectiveUser?.role === 'mentor' ? 'mentor' : 'admin') : (effectiveUser?.role || 'student');
    const branch = effectiveUser?.branch || (isAdminUser ? 'Ban Đào Tạo RMSA' : 'RMSA');
    const avatar = effectiveUser?.avatarUrl || effectiveUser?.avatar_url || effectiveUser?.avatar || (
      isAdminUser
        ? '/images/anh_rin_avatar.jpg'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    );
    return { name, username, role, branch, avatar };
  }, [effectiveUser, isAdminUser]);

  // Kiểm tra quyền xóa một bài viết cụ thể (Admin xóa được mọi bài; Nhân viên xóa được bài chính chủ hoặc bài tạo trên thiết bị của mình)
  const canDeletePost = useCallback((post) => {
    if (!post) return false;
    // Bài quy chuẩn mặc định của Ban Đào Tạo chỉ Admin mới được xóa
    if (post.id === 'notice_official_1') {
      return isAdminUser;
    }
    if (isAdminUser) return true;
    if (!effectiveLoggedIn) return false;

    const me = getAuthorInfo();
    const postUser = (post.authorUsername || '').toLowerCase().trim();
    const postAuthor = (post.author || '').toLowerCase().trim();
    const myName = (me.name || '').toLowerCase().trim();
    const myUser = (me.username || '').toLowerCase().trim();

    // Nếu bài viết cũ trong localStorage chưa có authorUsername, hoặc trùng tên/username với người đang đăng nhập
    if (!postUser) return true;
    return Boolean(
      (myUser && postUser && myUser === postUser) ||
      (myName && postAuthor && (myName === postAuthor || postAuthor.includes(myName) || myName.includes(postAuthor))) ||
      (myUser && postAuthor && myUser === postAuthor)
    );
  }, [effectiveLoggedIn, isAdminUser, getAuthorInfo]);

  // Kiểm tra quyền xóa một bình luận cụ thể (Admin, người viết bình luận, hoặc chủ bài viết)
  const canDeleteComment = useCallback((post, comment) => {
    if (!effectiveLoggedIn && !isAdminUser) return false;
    if (isAdminUser) return true;
    if (canDeletePost(post)) return true;
    const me = getAuthorInfo();
    const commentUser = (comment.authorUsername || '').toLowerCase().trim();
    const commentAuthor = (comment.author || '').toLowerCase().trim();
    if (!commentUser) return true;
    return Boolean(
      (me.username && commentUser && me.username === commentUser) ||
      (me.name && commentAuthor && me.name.toLowerCase() === commentAuthor)
    );
  }, [effectiveLoggedIn, isAdminUser, canDeletePost, getAuthorInfo]);

  // Quản lý danh sách bài viết đã lưu sổ tay (Bookmark cá nhân)
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 1. Quản lý danh sách bài viết (Khởi tạo nhanh từ Cache, sau đó đồng bộ 100% với SQLite)
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [OFFICIAL_WELCOME_POST];
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = useCallback((text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(prev => (prev?.text === text ? null : prev));
    }, 3500);
  }, []);

  // Hàm tải và đồng bộ danh sách bài viết từ Backend SQLite (Kèm tự động chuyển bài cũ từ LocalStorage lên SQLite)
  const fetchCommunityPosts = useCallback(async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const me = getAuthorInfo();
      let serverPosts = await api.community.getPosts(me.username || me.name);

      // Kiểm tra nếu trong localStorage có bài viết cũ chưa được đồng bộ lên SQLite thì đẩy lên tự động
      try {
        const localRaw = localStorage.getItem(STORAGE_KEY);
        if (localRaw) {
          const localParsed = JSON.parse(localRaw);
          if (Array.isArray(localParsed)) {
            const unsynced = localParsed.filter(
              lp => lp && lp.id && lp.id !== 'notice_official_1' && !lp._syncedToSql && !serverPosts.some(sp => sp.id === lp.id)
            );
            if (unsynced.length > 0) {
              for (const lp of unsynced) {
                await api.community.createPost({
                  id: lp.id,
                  author: lp.author || me.name,
                  authorUsername: lp.authorUsername || me.username || lp.author,
                  role: lp.role || me.role,
                  branch: lp.branch || me.branch,
                  avatar: lp.avatar || me.avatar,
                  category: lp.category || 'qa',
                  title: lp.title,
                  content: lp.content,
                  depositAmount: lp.depositAmount || '',
                  roomInfo: lp.roomInfo || ''
                });
              }
              serverPosts = await api.community.getPosts(me.username || me.name);
            }
          }
        }
      } catch {}

      if (Array.isArray(serverPosts) && serverPosts.length > 0) {
        const markedPosts = serverPosts.map(p => ({ ...p, _syncedToSql: true }));
        setPosts(markedPosts);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(markedPosts));
        } catch {}
      }
    } catch (err) {
      if (!silent) {
        console.warn('[CommunitySync] Sử dụng dữ liệu đệm cục bộ:', err.message);
      }
    } finally {
      if (!silent) setIsSyncing(false);
    }
  }, [getAuthorInfo]);

  // Tải dữ liệu ngay khi mở tab và tự động đồng bộ ngầm mỗi 8 giây giữa Quản trị viên & Nhân viên
  useEffect(() => {
    fetchCommunityPosts(false);
    const interval = setInterval(() => {
      fetchCommunityPosts(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchCommunityPosts]);

  // Bộ lọc chuyên mục học tập nội bộ
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Quản lý modal tạo bài viết
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('qa');
  const [newContent, setNewContent] = useState('');
  const [newDeposit, setNewDeposit] = useState('');
  const [newRoomInfo, setNewRoomInfo] = useState('');

  // Quản lý Hộp thoại Xác nhận Xóa Bài Viết & Làm mới Bảng tin
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Quản lý khung bình luận đang mở
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  // 2. Tính toán BẢNG VÀNG TUẦN NÀY tự động từ các bài Báo cọc thực tế (Khi xóa bài báo cọc sẽ tự động trừ ngay)
  const weeklyLeaderboard = useMemo(() => {
    const dealsPosts = posts.filter(p => p.category === 'deals');
    const counts = {};

    dealsPosts.forEach(post => {
      const author = post.author || 'Nhân viên';
      const branch = post.branch || 'RMSA';
      if (!counts[author]) {
        counts[author] = { name: author, branch: branch, dealsCount: 0 };
      }
      counts[author].dealsCount += 1;
    });

    const sorted = Object.values(counts).sort((a, b) => b.dealsCount - a.dealsCount);
    return sorted.map((item, idx) => ({
      rank: idx + 1,
      name: item.name,
      branch: item.branch,
      deals: `${item.dealsCount} Căn chốt`,
      badge: idx === 0 ? '🥇 Top 1' : idx === 1 ? '🥈 Top 2' : idx === 2 ? '🥉 Top 3' : 'Chiến Thần'
    }));
  }, [posts]);

  // Xử lý Thả tim (Đồng bộ SQLite)
  const handleToggleLike = async (postId) => {
    const me = getAuthorInfo();
    // Optimistic UI update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.likedByMe;
        return {
          ...p,
          likedByMe: nextLiked,
          likes: nextLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1)
        };
      }
      return p;
    }));

    try {
      const res = await api.community.toggleLike(postId, me.username || me.name);
      if (res.success && Array.isArray(res.posts)) {
        setPosts(res.posts);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.posts)); } catch {}
      }
    } catch {}
  };

  // Xử lý Lưu bí kíp vào sổ tay
  const handleToggleBookmark = (postId) => {
    setBookmarkedIds(prev => {
      const exists = prev.includes(postId);
      const next = exists ? prev.filter(id => id !== postId) : [...prev, postId];
      try { localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next)); } catch {}
      showToast(exists ? 'Đã bỏ lưu bài viết khỏi sổ tay' : 'Đã lưu bí kíp vào sổ tay cá nhân!');
      return next;
    });
  };

  // Xử lý Ghim / Bỏ ghim bài viết (Dành cho Quản trị viên)
  const handleTogglePin = async (post) => {
    if (!isAdminUser) return;
    const me = getAuthorInfo();
    try {
      const res = await api.community.togglePin(post.id, {
        username: me.username,
        name: me.name,
        role: 'admin'
      });
      if (res.success && Array.isArray(res.posts)) {
        setPosts(res.posts);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.posts)); } catch {}
        showToast(res.message || (res.isPinned ? 'Đã ghim bài viết lên đầu!' : 'Đã bỏ ghim bài viết!'));
      }
    } catch (err) {
      showToast(err.message || 'Không thể ghim bài viết', 'error');
    }
  };

  // Xử lý Xác nhận Xóa bài viết (Đồng bộ 100% mọi thiết bị & dọn sạch cả LocalStorage)
  const handleConfirmDeletePost = async () => {
    if (!postToDelete || isDeleting) return;
    setIsDeleting(true);
    const targetId = postToDelete.id;
    const me = getAuthorInfo();

    // Xóa ngay khỏi state cục bộ & LocalStorage trước để không bị giữ lại bài cũ
    setPosts(prev => {
      const filtered = prev.filter(p => p.id !== targetId);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered)); } catch {}
      return filtered;
    });

    try {
      const res = await api.community.deletePost(targetId, {
        username: me.username,
        name: me.name,
        role: isAdminUser ? 'admin' : me.role,
        branch: me.branch
      });
      if (res.success && Array.isArray(res.posts)) {
        const marked = res.posts.map(p => ({ ...p, _syncedToSql: true }));
        setPosts(marked);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(marked)); } catch {}
      }
      showToast('Đã xóa bài viết và đồng bộ trên toàn hệ thống!');
      setPostToDelete(null);
    } catch (err) {
      // Nếu bài viết là bài cũ chỉ nằm ở localStorage (404 trên server), vẫn coi như đã xóa thành công
      if (err.status === 404 || (err.message && err.message.includes('không tồn tại'))) {
        showToast('Đã xóa bài viết thành công!');
        setPostToDelete(null);
      } else {
        showToast(err.message || 'Không thể xóa bài viết này', 'error');
        fetchCommunityPosts(true);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Xử lý Xóa bình luận (Đồng bộ 100% SQLite)
  const handleDeleteComment = async (postId, commentId) => {
    const me = getAuthorInfo();
    try {
      const res = await api.community.deleteComment(postId, commentId, {
        username: me.username,
        name: me.name,
        role: isAdminUser ? 'admin' : me.role
      });
      if (res.success && Array.isArray(res.posts)) {
        setPosts(res.posts);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.posts)); } catch {}
        showToast('Đã xóa bình luận!');
      }
    } catch (err) {
      showToast(err.message || 'Không thể xóa bình luận', 'error');
    }
  };

  // Xử lý Xin vía / Chúc mừng chốt cọc
  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  // Xử lý Gửi bình luận (Đồng bộ SQLite)
  const handleAddComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    if (!isLoggedIn && !isAdminUser && onOpenLogin) {
      onOpenLogin();
      return;
    }

    const user = getAuthorInfo();
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    try {
      const res = await api.community.addComment(postId, {
        author: user.name,
        authorUsername: user.username,
        role: user.role,
        branch: user.branch,
        avatar: user.avatar,
        text
      });
      if (res.success && Array.isArray(res.posts)) {
        setPosts(res.posts);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.posts)); } catch {}
      }
    } catch (err) {
      showToast(err.message || 'Lỗi gửi bình luận', 'error');
    }
  };

  // Xử lý Đăng bài viết mới (Đồng bộ SQLite cho tất cả Quản trị & Nhân viên)
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const isDeals = newCategory === 'deals';
    const user = getAuthorInfo();

    try {
      const res = await api.community.createPost({
        author: user.name,
        authorUsername: user.username,
        role: user.role,
        branch: user.branch,
        avatar: user.avatar,
        category: newCategory,
        title: newTitle.trim(),
        content: newContent.trim(),
        depositAmount: isDeals ? (newDeposit.trim() || '500.000đ - 1.000.000đ') : '',
        roomInfo: isDeals ? (newRoomInfo.trim() || 'Phòng cho thuê tiêu chuẩn') : ''
      });

      if (res.success && Array.isArray(res.posts)) {
        setPosts(res.posts);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.posts)); } catch {}
      }

      // Reset form
      setNewTitle('');
      setNewContent('');
      setNewDeposit('');
      setNewRoomInfo('');
      setIsCreateModalOpen(false);
      showToast(isDeals ? '🎉 Đã đăng Báo cọc và cập nhật Bảng Vàng toàn hệ thống!' : 'Đã đăng bài viết lên Cộng đồng thành công!');

      if (isDeals) {
        handleCelebrate();
      }
    } catch (err) {
      showToast(err.message || 'Không thể đăng bài viết lúc này', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Làm mới toàn bộ bảng tin về mặc định (Chỉ dành cho Quản trị viên)
  const handleConfirmResetFeed = async () => {
    if (!isAdminUser) return;
    const me = getAuthorInfo();
    try {
      const res = await api.community.resetFeed({
        username: me.username,
        name: me.name,
        role: 'admin'
      });
      if (res.success && Array.isArray(res.posts)) {
        setPosts(res.posts);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.posts)); } catch {}
        showToast('Đã làm mới toàn bộ bảng tin cộng đồng về trạng thái mặc định!');
      }
    } catch (err) {
      showToast(err.message || 'Lỗi khi làm mới bảng tin', 'error');
    } finally {
      setIsResetConfirmOpen(false);
    }
  };

  // Lọc bài viết theo danh mục
  const filteredPosts = posts.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6 pb-28 lg:pb-12 space-y-6 relative">
      
      {/* THÔNG BÁO TOAST ĐỒNG BỘ THỜI GIAN THỰC */}
      {toastMsg && (
        <div className={`fixed top-20 right-4 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
          toastMsg.type === 'error'
            ? 'bg-rose-600 text-white border-rose-500'
            : 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-700 dark:border-emerald-500'
        }`}>
          {toastMsg.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO BANNER CỘNG ĐỒNG NỘI BỘ RMSA (KHUNG SÁNG XANH NGỌC MINT NỔI BẬT)  */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ecfdf5] via-[#d1fae5] to-[#e0f2fe] dark:from-[#0f1d33] dark:via-[#0d192c] dark:to-[#091324] border-2 border-emerald-400/75 dark:border-emerald-500/30 p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(16,185,129,0.2)]">
        
        {/* Họa tiết lưới chấm bi góc phải trên */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-[radial-gradient(#0a2540_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#60a5fa_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        
        {/* Điểm nhấn dải màu thương hiệu góc trên */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-b from-emerald-400/15 via-teal-400/5 to-transparent dark:from-blue-400/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            
            {/* Tag nhận diện nghiệp vụ */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-blue-950/60 border border-emerald-600/30 dark:border-blue-800/80 text-emerald-950 dark:text-blue-300 text-[11px] font-bold tracking-wide">
              <Building2 className="w-3.5 h-3.5 text-emerald-700 dark:text-blue-400" />
              <span>DIỄN ĐÀN NỘI BỘ • ĐỒNG BỘ THỜI GIAN THỰC TOÀN HỆ THỐNG</span>
            </div>
            
            {/* Tiêu đề chính */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0a2540] dark:text-white leading-tight">
              Cộng Đồng Môi Giới Thực Chiến <span className="text-emerald-700 dark:text-blue-400">Running Man</span>
            </h1>
            
            {/* Mô tả nghiệp vụ */}
            <p className="text-xs sm:text-[13px] text-[#243b55] dark:text-slate-300 leading-relaxed font-medium">
              Kênh giải đáp ca khó khi dắt khách, cập nhật kịch bản bẻ từ chối và vinh danh những giao dịch chốt cọc thực tế của anh em học viên mỗi ngày. Mọi bài đăng, bình luận và thao tác xóa đều đồng bộ tức thì giữa Quản trị viên và Nhân viên.
            </p>

            {/* 3 Chỉ số cam kết nghiệp vụ */}
            <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#1e3a5f] dark:text-slate-400">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-800/80 border border-emerald-300/80 dark:border-slate-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Đồng bộ Cloud SQLite 24/7</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-800/80 border border-emerald-300/80 dark:border-slate-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff]"></span>
                <span>Kịch bản bẻ giá độc quyền</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-800/80 border border-emerald-300/80 dark:border-slate-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>100% Giao dịch cọc thật</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (!isLoggedIn && !isAdminUser && onOpenLogin) {
                  onOpenLogin();
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="btn-shimmer winterfrost-primary-btn px-5 py-3 rounded-2xl text-white font-extrabold text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Đăng câu hỏi / Báo cọc</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchCommunityPosts(false)}
                title="Đồng bộ bài viết mới nhất từ máy chủ"
                className="flex-1 sm:flex-initial px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                <span className="sm:hidden lg:inline">Đồng bộ</span>
              </button>

              {isAdminUser && posts.length > 1 && (
                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  title="Quản trị viên: Làm mới toàn bộ bảng tin về mặc định"
                  className="flex-1 sm:flex-initial px-3.5 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800/70 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm sạch feed</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THANH LỌC CHUYÊN MỤC NGHIỆP VỤ & TỔNG QUAN                             */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fafcff] dark:bg-[#202020] p-3 rounded-2xl border border-[#b8d0ee] dark:border-white/[0.08] shadow-[0_8px_24px_rgba(15,45,90,0.06)]">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Tất cả bài viết', icon: Flame, count: posts.length },
            { id: 'qa', label: '❓ Hỏi đáp ca khó dắt phòng', icon: HelpCircle, count: posts.filter(p => p.category === 'qa').length },
            { id: 'deals', label: '🎯 Báo cọc thực hành', icon: PartyPopper, count: posts.filter(p => p.category === 'deals').length },
            { id: 'tips', label: '💡 Bí kíp dẫn trọ', icon: Lightbulb, count: posts.filter(p => p.category === 'tips').length },
            { id: 'notices', label: '📢 Lưu ý từ Quản lý', icon: Pin, count: posts.filter(p => p.category === 'notices').length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-[#eef4fb] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#cddff4]/80 dark:border-transparent hover:bg-[#e1ecfa] dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-[#d6e4f7] dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium px-2">
          {posts.length > 1 
            ? `${posts.length} bài thảo luận đồng bộ toàn hệ thống` 
            : 'Đang mở đón câu hỏi đầu tiên'}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BỐ CỤC CHÍNH (2 CỘT): FEED BÀI VIẾT (8 COLS) + COMMAND WIDGETS (4 COLS)  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI (8 COLS): FEED BÀI THẢO LUẬN THỰC CHIẾN */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* TRƯỜNG HỢP EMPTY STATE: Khi chưa có bài trong danh mục được chọn */}
          {filteredPosts.length === 0 && (
            <div className="bg-[#fafcff] dark:bg-[#202020] rounded-2xl p-10 border border-[#b8d0ee] dark:border-white/[0.08] shadow-[0_8px_24px_rgba(15,45,90,0.06)] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <Inbox className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Chưa có bài viết nào trong mục này
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Bạn vừa dắt ca khó hoặc muốn chia sẻ mẹo phòng trọ thực tế? Hãy là người đầu tiên đăng bài để cả đội cùng thảo luận!
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn && !isAdminUser && onOpenLogin) {
                    onOpenLogin();
                  } else {
                    setNewCategory(selectedCategory === 'all' ? 'qa' : selectedCategory);
                    setIsCreateModalOpen(true);
                  }
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Đăng bài vào mục này ngay</span>
              </button>
            </div>
          )}

          {/* DANH SÁCH BÀI VIẾT */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const allowDelete = canDeletePost(post);
              const isBookmarked = bookmarkedIds.includes(post.id);

              return (
                <div 
                  key={post.id}
                  className={`bg-[#fafcff] dark:bg-[#202020] rounded-2xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(15,45,90,0.06)] border transition-all text-left ${
                    post.isCelebration 
                      ? 'border-amber-400/70 bg-gradient-to-br from-[#fffbeb] via-[#fafcff] to-[#fef3c7]/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-[0_6px_22px_rgba(251,191,36,0.14)]' 
                      : post.isPinned
                        ? 'border-rose-300/80 dark:border-rose-900/60 bg-gradient-to-br from-[#fff5f6] to-[#fafcff] dark:bg-rose-950/10'
                        : 'border-[#b8d0ee] dark:border-white/[0.08] hover:border-[#8bb3e4] dark:hover:border-slate-700'
                  }`}
                >
                  {/* Header bài viết: Tác giả, chức danh, nhãn chuyên mục & Công cụ Quản trị / Xóa bài */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.avatar || '/images/anh_rin_avatar.jpg'} 
                        alt={post.author} 
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 ring-2 ring-blue-500/10 shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {post.author}
                          </span>
                          {(post.role === 'mentor' || post.role === 'admin') ? (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">
                              {post.role === 'mentor' ? 'HLV Trưởng' : 'Quản Trị Viên'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#eef4fb] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#cddff4] dark:border-transparent px-2 py-0.5 rounded-full">
                              Nhân viên
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">
                          {post.branch} • {post.time}
                        </p>
                      </div>
                    </div>

                    {/* Cụm Badge Chuyên mục + Nút Ghim (Admin) + Nút Xóa bài (Tác giả hoặc Admin) */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.isPinned && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-black bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                          <Pin className="w-3 h-3" />
                          <span>GHIM ĐẦU TRANG</span>
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${post.categoryColor}`}>
                        {post.categoryLabel}
                      </span>

                      {/* Nút Ghim / Bỏ ghim bài viết (Dành cho Quản trị viên) */}
                      {isAdminUser && (
                        <button
                          type="button"
                          onClick={() => handleTogglePin(post)}
                          title={post.isPinned ? 'Bỏ ghim bài viết này' : 'Ghim bài viết này lên đầu bảng tin'}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            post.isPinned
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                              : 'bg-[#eef4fb] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#cddff4] dark:border-slate-700 hover:bg-[#e1ecfa]'
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                          <span className="hidden sm:inline">{post.isPinned ? 'Bỏ ghim' : 'Ghim'}</span>
                        </button>
                      )}

                      {/* Nút Xóa bài viết (Hiển thị cho chính tác giả bài viết HOẶC Quản trị viên) */}
                      {allowDelete && (
                        <button
                          type="button"
                          onClick={() => setPostToDelete(post)}
                          title={isAdminUser ? 'Xóa bài viết này (Quyền Quản trị viên)' : 'Xóa bài viết của bạn'}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/70 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa bài</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Banner chúc mừng đặc biệt cho bài Báo cọc */}
                  {post.isCelebration && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-400/40 dark:border-amber-700/50 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                          <PartyPopper className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                            GIAO DỊCH THỰC CHIẾN THÀNH CÔNG
                          </p>
                          <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                            {post.roomInfo} • Đã nhận cọc giữ phòng: <span className="font-black text-amber-950 dark:text-amber-200">{post.depositAmount}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleCelebrate}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Chúc mừng & Xin vía!</span>
                      </button>
                    </div>
                  )}

                  {/* Tiêu đề & Nội dung bài viết */}
                  <div className="mt-3.5 space-y-2">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Thanh tương tác dưới bài */}
                  <div className="mt-4 pt-3 border-t border-[#d4e3f7]/80 dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-4">
                      {/* Nút Thả tim */}
                      <button 
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center space-x-1.5 font-semibold transition-colors cursor-pointer ${
                          post.likedByMe 
                            ? 'text-rose-600 dark:text-rose-400' 
                            : 'hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-600 stroke-rose-600' : ''}`} />
                        <span>{post.likes || 0} Hữu ích</span>
                      </button>

                      {/* Nút Bình luận */}
                      <button 
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className={`flex items-center space-x-1.5 font-semibold transition-colors cursor-pointer ${
                          activeCommentPostId === post.id 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'hover:text-blue-600'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{(post.comments || []).length} Bình luận & Góp ý</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Nút Lưu bí kíp vào sổ tay */}
                      <button 
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`p-1.5 rounded-lg hover:bg-[#eef4fb] dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs ${
                          isBookmarked 
                            ? 'text-amber-600 dark:text-amber-400 font-bold' 
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                        title="Lưu tình huống vào sổ tay"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 stroke-amber-500' : ''}`} />
                        <span className="hidden sm:inline">{isBookmarked ? 'Đã lưu sổ tay' : 'Lưu bí kíp'}</span>
                      </button>

                      {/* Nút Xóa bài viết trực tiếp ở thanh dưới bài viết */}
                      {allowDelete && (
                        <button
                          type="button"
                          onClick={() => setPostToDelete(post)}
                          title="Xóa bài viết này"
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-800/70 transition-all cursor-pointer flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa bài viết</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* KHUNG BÌNH LUẬN MỞ RỘNG (ACCORDION COMMENTS) */}
                  {activeCommentPostId === post.id && (
                    <div className="mt-4 pt-4 border-t border-[#d4e3f7]/80 dark:border-white/[0.08] space-y-3 animate-in fade-in slide-in-from-top-1">
                      
                      {/* Danh sách bình luận */}
                      {(post.comments || []).length > 0 ? (
                        <div className="space-y-2.5">
                          {post.comments.map(c => {
                            const allowDeleteComment = canDeleteComment(post, c);
                            return (
                              <div 
                                key={c.id} 
                                className="p-3 rounded-xl bg-[#eef4fb] dark:bg-slate-800/60 border border-[#cddff4] dark:border-white/[0.08] space-y-1 group"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center space-x-2">
                                    <img 
                                      src={c.avatar || '/images/anh_rin_avatar.jpg'} 
                                      alt={c.author} 
                                      onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                                      }}
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                      {c.author}
                                    </span>
                                    {(c.role === 'mentor' || c.role === 'admin') && (
                                      <span className="text-[9px] font-black uppercase bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded-full">
                                        {c.role === 'mentor' ? 'HLV' : 'QTV'}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <span className="text-[10px] text-slate-400">{c.time}</span>
                                    {allowDeleteComment && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteComment(post.id, c.id)}
                                        title="Xóa bình luận này"
                                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
                                  {c.text}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic text-center py-2">
                          Chưa có lời giải đáp nào. Hãy là người đầu tiên chia sẻ kinh nghiệm xử lý!
                        </p>
                      )}

                      {/* Ô nhập bình luận mới */}
                      <div className="flex items-center space-x-2 pt-1">
                        <input 
                          type="text"
                          placeholder="Viết hướng dẫn hoặc lời khuyên gỡ rối cho đồng đội..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id);
                            }
                          }}
                          className="flex-1 px-4 py-2 text-xs bg-[#eef4fb] dark:bg-slate-800 border border-[#b8d0ee] dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-[#fafcff] dark:focus:bg-slate-800 transition-all"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Gửi</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CỘT PHẢI (RIGHT WIDGET - 4 COLS): BẢNG VÀNG TUẦN & NGUYÊN TẮC THỰC CHIẾN  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5 text-left sticky top-20">
          
          {/* WIDGET 1: BẢNG VÀNG CHỐT CỌC TRONG TUẦN (TỰ ĐỘNG HÓA TỪ DỮ LIỆU BÁO CỌC) */}
          <div className="bg-[#fafcff] dark:bg-[#202020] rounded-2xl p-5 border border-[#b8d0ee] dark:border-white/[0.08] shadow-[0_8px_24px_rgba(15,45,90,0.06)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d4e3f7] dark:border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Bảng Vàng Tuần Này</h3>
                  <p className="text-[10px] text-slate-500">Đồng bộ tự động theo bài Báo cọc thật</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Trực Tuyến
              </span>
            </div>

            {/* Trạng thái Bảng vàng có người vs Trạng thái Bảng vàng đang chờ */}
            {weeklyLeaderboard.length > 0 ? (
              <div className="space-y-2.5">
                {weeklyLeaderboard.slice(0, 5).map(st => (
                  <div 
                    key={st.rank}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-transform hover:scale-[1.01] ${
                      st.rank === 1
                        ? 'bg-[#fffbeb] border-amber-300/80 dark:bg-slate-800/60 dark:border-white/[0.08]'
                        : 'bg-[#eef4fb] border-[#cddff4] dark:bg-slate-800/60 dark:border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                        st.rank === 1 ? 'bg-amber-400 text-slate-900 font-black' :
                        st.rank === 2 ? 'bg-slate-300 text-slate-900' :
                        st.rank === 3 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {st.rank}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                        <p className="text-[10px] text-slate-500">{st.branch}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-blue-600 dark:text-blue-400">{st.deals}</span>
                      <span className="block text-[9px] text-slate-500">{st.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 px-4 text-center rounded-xl bg-[#eef4fb] dark:bg-slate-800/40 border border-dashed border-[#b8d0ee] dark:border-slate-700/80 space-y-2">
                <Sparkles className="w-6 h-6 text-amber-500 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tuần mới vừa khởi động!
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Chưa có giao dịch báo cọc nào. Hãy là nhân viên đầu tiên báo cọc để vinh danh trên Bảng Vàng!
                </p>
                <button
                  onClick={() => {
                    if (!isLoggedIn && !isAdminUser && onOpenLogin) {
                      onOpenLogin();
                    } else {
                      setNewCategory('deals');
                      setIsCreateModalOpen(true);
                    }
                  }}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  🎯 Báo cọc mở bát ngay
                </button>
              </div>
            )}
          </div>

          {/* WIDGET 2: QUYỀN QUẢN LÝ & XÓA BÀI VIẾT TRÊN CỘNG ĐỒNG */}
          <div className="bg-[#fafcff] dark:bg-[#202020] rounded-2xl p-5 border border-[#b8d0ee] dark:border-white/[0.08] shadow-[0_8px_24px_rgba(15,45,90,0.06)] space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#d4e3f7] dark:border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Quy Chuẩn Dẫn Khách & Đăng Bài</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-2 p-2 rounded-xl bg-[#eef4fb] dark:bg-slate-800/50 border border-[#cddff4]/70 dark:border-transparent">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <p>Luôn có mặt trước 15-20 phút kiểm tra phòng, bật máy lạnh và chuẩn bị nước mát.</p>
              </div>

              <div className="flex items-start space-x-2 p-2 rounded-xl bg-[#eef4fb] dark:bg-slate-800/50 border border-[#cddff4]/70 dark:border-transparent">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <p>Khách chê giá cao: Áp dụng công thức chia nhỏ 16.000đ/ngày (chưa bằng nửa ly cà phê).</p>
              </div>

              <div className="flex items-start space-x-2 p-2 rounded-xl bg-[#eef4fb] dark:bg-slate-800/50 border border-[#cddff4]/70 dark:border-transparent">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <p>Bạn có thể bấm nút <strong>"Xóa bài"</strong> góc phải trên bài viết của mình nếu đăng nhầm. Quản trị viên có toàn quyền ghim hoặc xóa mọi bài viết/bình luận.</p>
              </div>
            </div>
          </div>

          {/* WIDGET 3: TRỢ GIÚP KHẨN CẤP KHI KẸT DEAL TẠI CHỖ */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#eef5ff] to-[#e4eefc] dark:from-slate-800 dark:to-slate-850 border border-[#a8c6ea] dark:border-slate-700 shadow-[0_8px_20px_rgba(15,45,90,0.05)] space-y-2">
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
              <PhoneCall className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Cần Cứu Deal Tại Phòng?</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Nếu đang ở phòng cùng khách mà gặp tình huống ngoài kịch bản, đừng ngại nhắn tin ngay cho Anh Rin hoặc hotline đào tạo RMSA để được gỡ rối tức thì!
            </p>
            <div className="pt-1">
              <a 
                href="tel:0909386888" 
                className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Hotline Trợ giảng: 0909.386.888 →
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL XÁC NHẬN XÓA BÀI VIẾT AN TOÀN (ĐỒNG BỘ TOÀN HỆ THỐNG)            */}
      {/* ========================================================================= */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/[0.1] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-left animate-in zoom-in-95 p-6 space-y-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Xác nhận xóa bài viết?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Bài viết này sẽ bị xóa vĩnh viễn và tự động cập nhật ngay lập tức trên tài khoản của Quản trị viên cùng toàn bộ Nhân viên.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 space-y-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                "{postToDelete.title}"
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Đăng bởi: <span className="font-semibold text-slate-700 dark:text-slate-300">{postToDelete.author}</span> ({postToDelete.branch})
              </p>
              {postToDelete.category === 'deals' && (
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 pt-1">
                  ⚠️ Lưu ý: Đây là bài Báo cọc, khi xóa thì số căn chốt trên Bảng Vàng Tuần cũng sẽ tự động trừ tương ứng.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeletePost}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/25 cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL XÁC NHẬN LÀM SẠCH FEED (CHỈ DÀNH CHO QUẢN TRỊ VIÊN)              */}
      {/* ========================================================================= */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/[0.1] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-left animate-in zoom-in-95 p-6 space-y-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Làm sạch toàn bộ Bảng tin Cộng đồng?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Thao tác này sẽ xóa toàn bộ các bài thảo luận thử nghiệm hiện tại và chỉ giữ lại duy nhất bài viết Quy chuẩn nội bộ được ghim của HLV Trưởng Đan Rin.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmResetFeed}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/25 cursor-pointer flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xác nhận làm sạch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL TẠO BÀI VIẾT / BÁO CỌC MỚI                                       */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/[0.08] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-left animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Đăng Bài / Báo Cọc Thực Địa
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Đồng bộ trực tiếp lên bảng tin của Quản trị viên & toàn bộ Nhân viên
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chuyên mục thảo luận *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="qa">❓ Hỏi đáp ca khó khi đi dắt phòng</option>
                  <option value="deals">🎯 Báo cáo chốt cọc thực hành (Ting Ting!)</option>
                  <option value="tips">💡 Bí kíp & Mẹo dẫn khách thực chiến</option>
                  <option value="notices">📢 Lưu ý nghiệp vụ</option>
                </select>
              </div>

              {/* Nếu là Báo cọc: hiển thị thêm ô Số tiền cọc & Thông tin phòng */}
              {newCategory === 'deals' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                      Số tiền khách cọc (VNĐ)
                    </label>
                    <input 
                      type="text"
                      placeholder="Ví dụ: 1.000.000đ"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                      Loại phòng & Giá thuê
                    </label>
                    <input 
                      type="text"
                      placeholder="Ví dụ: Duplex ban công 5.5tr"
                      value={newRoomInfo}
                      onChange={(e) => setNewRoomInfo(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề tình huống *
                </label>
                <input 
                  type="text"
                  required
                  placeholder={
                    newCategory === 'deals' 
                      ? 'Ví dụ: TING TING! Vừa nhận cọc căn Duplex 5.2tr tại Phú Nhuận!' 
                      : 'Ví dụ: Khách chê máy giặt chung thì nên bẻ kịch bản thế nào?'
                  }
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nội dung chi tiết tình huống thực địa *
                </label>
                <textarea 
                  rows={4}
                  required
                  placeholder={
                    newCategory === 'deals'
                      ? 'Chia sẻ niềm vui và kinh nghiệm thực chiến: bạn đã dùng câu nói gì, tư vấn ra sao để khách chốt cọc nhanh chóng...'
                      : 'Mô tả cụ thể khách hàng nói gì, tình huống xảy ra ở đâu và bạn đang cần anh em tư vấn điều gì...'
                  }
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang đăng...' : 'Đăng bài ngay'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
