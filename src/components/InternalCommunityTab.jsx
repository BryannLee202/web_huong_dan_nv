import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Sparkles, 
  Trophy, 
  Flame, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  Send, 
  Plus, 
  X, 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  Award,
  Pin,
  Clock,
  ThumbsUp,
  PartyPopper,
  User,
  Inbox,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEY = 'rmsa_internal_community_posts_v2';

// Bài viết ghim hướng dẫn duy nhất từ Ban Đào Tạo (không có bài của học viên ảo)
const OFFICIAL_WELCOME_POST = {
  id: 'notice_official_1',
  author: 'Đan Rin (HLV Trưởng)',
  role: 'mentor',
  branch: 'Ban Đào Tạo RMSA',
  avatar: '/images/anh_rin_avatar.jpg',
  time: 'Ghim Ban Quản Trị',
  category: 'notices',
  categoryLabel: '📢 Quy chế học việc nội bộ',
  categoryColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  isPinned: true,
  title: 'QUY CHUẨN NỘI BỘ: Không gian giải đáp thực địa & Vinh danh kết quả cho nhân viên mới',
  content: 'Chào mừng các bạn chuyên viên và học viên mới gia nhập Running Man Sales Academy!\n\nĐây là không gian thảo luận nghiệp vụ nội bộ 100% dành cho anh em trong lúc đi dắt phòng thực tế:\n• Khi gặp khách ép giá, đòi giữ cọc quá lâu hoặc phòng có khuyết điểm: Hãy đăng ngay câu hỏi vào mục "Hỏi đáp ca khó" để HLV và các anh em hỗ trợ bẻ kịch bản.\n• Khi chốt cọc thành công phòng trọ / duplex: Hãy đăng bài "Báo cọc thực hành" để hệ thống tự động ghi nhận thành tích lên Bảng Vàng Tuần và anh em cùng chúc mừng.\n• Hãy giữ thái độ chia sẻ văn minh, bảo mật thông tin chủ nhà và cùng nhau chạy số bùng nổ!',
  likes: 0,
  likedByMe: false,
  bookmarked: false,
  comments: []
};

export default function InternalCommunityTab({
  isLoggedIn = false,
  currentUser = null,
  onOpenLogin
}) {
  // 1. Quản lý danh sách bài viết với LocalStorage tự động
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Lỗi đọc dữ liệu cộng đồng:', e);
    }
    return [OFFICIAL_WELCOME_POST];
  });

  // Tự động đồng bộ vào LocalStorage khi posts thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Lỗi lưu dữ liệu cộng đồng:', e);
    }
  }, [posts]);

  // Bộ lọc chuyên mục học tập nội bộ
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Quản lý modal tạo bài viết
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('qa');
  const [newContent, setNewContent] = useState('');
  const [newDeposit, setNewDeposit] = useState('');
  const [newRoomInfo, setNewRoomInfo] = useState('');

  // Quản lý khung bình luận đang mở
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  // 2. Tính toán BẢNG VÀNG TUẦN NÀY tự động từ các bài Báo cọc thực tế
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

  // Xử lý Thả tim
  const handleToggleLike = (postId) => {
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
  };

  // Xử lý Lưu bí kíp
  const handleToggleBookmark = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextBookmarked = !p.bookmarked;
        return { ...p, bookmarked: nextBookmarked };
      }
      return p;
    }));
  };

  // Xử lý Xin vía / Chúc mừng chốt cọc
  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Lấy thông tin người dùng hiện tại an toàn
  const getAuthorInfo = () => {
    const name = currentUser?.fullName || currentUser?.name || 'Nhân Viên Mới';
    const role = currentUser?.role || 'student';
    const branch = currentUser?.branch || 'Chi nhánh RMSA';
    const avatar = currentUser?.avatar || (
      role === 'mentor' 
        ? '/images/anh_rin_avatar.jpg' 
        : role === 'pro_sales' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    );
    return { name, role, branch, avatar };
  };

  // Xử lý Gửi bình luận
  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const user = getAuthorInfo();
    const newComment = {
      id: `c_${Date.now()}`,
      author: user.name,
      role: user.role,
      branch: user.branch,
      avatar: user.avatar,
      time: 'Vừa xong',
      text: text
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Xử lý Đăng bài viết mới
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung tình huống!');
      return;
    }

    const categoryMap = {
      qa: { label: '❓ Hỏi đáp ca khó', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
      deals: { label: '🎉 Thực hành chốt cọc', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
      tips: { label: '💡 Bí kíp dẫn trọ', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
      notices: { label: '📢 Lưu ý từ Quản lý', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900' }
    };

    const isDeals = newCategory === 'deals';
    const user = getAuthorInfo();

    const createdPost = {
      id: `post_${Date.now()}`,
      author: user.name,
      role: user.role,
      branch: user.branch,
      avatar: user.avatar,
      time: 'Vừa xong',
      category: newCategory,
      categoryLabel: categoryMap[newCategory]?.label || 'Thảo luận',
      categoryColor: categoryMap[newCategory]?.color || 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
      isCelebration: isDeals,
      title: newTitle.trim(),
      content: newContent.trim(),
      depositAmount: isDeals ? (newDeposit.trim() || '500.000đ - 1.000.000đ') : undefined,
      roomInfo: isDeals ? (newRoomInfo.trim() || 'Phòng cho thuê tiêu chuẩn') : undefined,
      likes: 1,
      likedByMe: true,
      bookmarked: false,
      comments: []
    };

    // Đẩy bài viết mới lên đầu bảng tin (sau bài ghim nếu có)
    setPosts(prev => {
      const pinned = prev.filter(p => p.isPinned);
      const unpinned = prev.filter(p => !p.isPinned);
      return [...pinned, createdPost, ...unpinned];
    });

    // Reset form
    setNewTitle('');
    setNewContent('');
    setNewDeposit('');
    setNewRoomInfo('');
    setIsCreateModalOpen(false);

    // Kích hoạt pháo hoa chúc mừng nếu là báo cọc
    if (isDeals) {
      handleCelebrate();
    }
  };

  // Nút xóa toàn bộ dữ liệu trở về khởi động sạch (Dành cho Quản trị viên khi cần dọn sạch)
  const handleResetToClean = () => {
    if (window.confirm('Bạn có chắc chắn muốn làm mới toàn bộ bảng tin cộng đồng về trạng thái ban đầu?')) {
      setPosts([OFFICIAL_WELCOME_POST]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  // Lọc bài viết theo danh mục
  const filteredPosts = posts.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER CỘNG ĐỒNG NỘI BỘ RMSA (HIỆN ĐẠI & THỰC ĐỊA BẤT ĐỘNG SẢN)  */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        
        {/* Lưới tọa độ kiến trúc căn hộ chìm (Architectural Grid Pattern) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        
        {/* Điểm nhấn dải màu thương hiệu hổ phách thanh lịch góc trên */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-b from-amber-400/10 via-amber-400/5 to-transparent dark:from-amber-400/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            
            {/* Tag nhận diện nghiệp vụ */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-[11px] font-bold tracking-wide">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>DIỄN ĐÀN NỘI BỘ • HỌC VIỆN MÔI GIỚI RUNNING MAN</span>
            </div>
            
            {/* Tiêu đề chính */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Cộng Đồng Môi Giới Thực Chiến <span className="text-amber-600 dark:text-amber-400">Running Man</span>
            </h1>
            
            {/* Mô tả nghiệp vụ */}
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Kênh giải đáp ca khó khi dắt khách, cập nhật kịch bản bẻ từ chối và vinh danh những giao dịch chốt cọc thực tế của anh em học viên mỗi ngày.
            </p>

            {/* 3 Chỉ số cam kết nghiệp vụ */}
            <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Hỗ trợ thực địa 24/7</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Kịch bản bẻ giá độc quyền</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>100% Giao dịch cọc thật</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (!isLoggedIn && onOpenLogin) {
                  onOpenLogin();
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Đăng câu hỏi / Báo cọc</span>
            </button>

            {posts.length > 1 && (
              <button
                onClick={handleResetToClean}
                title="Làm mới về trạng thái sạch ban đầu"
                className="px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Làm sạch feed</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THANH LỌC CHUYÊN MỤC NGHIỆP VỤ & TỔNG QUAN                             */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1f1c1a] p-3 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
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
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
          {posts.length > 1 
            ? `${posts.length} bài thảo luận thực tế` 
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
            <div className="bg-white dark:bg-[#1f1c1a] rounded-2xl p-10 border border-slate-200/80 dark:border-white/[0.08] shadow-xs text-center space-y-4">
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
                  setNewCategory(selectedCategory === 'all' ? 'qa' : selectedCategory);
                  setIsCreateModalOpen(true);
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
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                className={`bg-white dark:bg-[#1f1c1a] rounded-2xl p-6 shadow-xs border transition-all text-left ${
                  post.isCelebration 
                    ? 'border-amber-400/60 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-[0_4px_20px_rgba(251,191,36,0.12)]' 
                    : post.isPinned
                      ? 'border-rose-300/80 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                      : 'border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header bài viết: Tác giả, chức danh, nhãn chuyên mục */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 ring-2 ring-blue-500/10"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {post.author}
                        </span>
                        {post.role === 'mentor' && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">
                            HLV Trưởng
                          </span>
                        )}
                        {post.role === 'pro_sales' && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            Pro Sales
                          </span>
                        )}
                        {post.role === 'student' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                            Học viên
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {post.branch} • {post.time}
                      </p>
                    </div>
                  </div>

                  {/* Badge Chuyên mục & Ghim */}
                  <div className="flex items-center space-x-2">
                    {post.isPinned && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-black bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                        <Pin className="w-3 h-3" />
                        <span>QUAN TRỌNG</span>
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${post.categoryColor}`}>
                      {post.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Banner chúc mừng đặc biệt cho bài Báo cọc */}
                {post.isCelebration && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-400/40 dark:border-amber-700/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
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
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
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
                      className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs ${
                        post.bookmarked 
                          ? 'text-amber-600 dark:text-amber-400 font-bold' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                      title="Lưu tình huống vào sổ tay"
                    >
                      <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-amber-500 stroke-amber-500' : ''}`} />
                      <span className="hidden sm:inline">{post.bookmarked ? 'Đã lưu sổ tay' : 'Lưu bí kíp'}</span>
                    </button>
                  </div>
                </div>

                {/* KHUNG BÌNH LUẬN MỞ RỘNG (ACCORDION COMMENTS) */}
                {activeCommentPostId === post.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.08] space-y-3 animate-in fade-in slide-in-from-top-1">
                    
                    {/* Danh sách bình luận */}
                    {(post.comments || []).length > 0 ? (
                      <div className="space-y-2.5">
                        {post.comments.map(c => (
                          <div 
                            key={c.id} 
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/[0.08] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <img 
                                  src={c.avatar} 
                                  alt={c.author} 
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {c.author}
                                </span>
                                {c.role === 'mentor' && (
                                  <span className="text-[9px] font-black uppercase bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded-full">
                                    HLV
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{c.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
                              {c.text}
                            </p>
                          </div>
                        ))}
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
                        className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CỘT PHẢI (RIGHT WIDGET - 4 COLS): BẢNG VÀNG TUẦN & NGUYÊN TẮC THỰC CHIẾN  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5 text-left sticky top-20">
          
          {/* WIDGET 1: BẢNG VÀNG CHỐT CỌC TRONG TUẦN (TỰ ĐỘNG HÓA TỪ DỮ LIỆU BÁO CỌC) */}
          <div className="bg-white dark:bg-[#1f1c1a] rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Bảng Vàng Tuần Này</h3>
                  <p className="text-[10px] text-slate-400">Tự động cộng dồn theo giao dịch thật</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Tuần Mới
              </span>
            </div>

            {/* Trạng thái Bảng vàng có người vs Trạng thái Bảng vàng đang chờ */}
            {weeklyLeaderboard.length > 0 ? (
              <div className="space-y-2.5">
                {weeklyLeaderboard.slice(0, 5).map(st => (
                  <div 
                    key={st.rank}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/[0.08] text-xs transition-transform hover:scale-[1.01]"
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
                        <p className="text-[10px] text-slate-400">{st.branch}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-blue-600 dark:text-blue-400">{st.deals}</span>
                      <span className="block text-[9px] text-slate-400">{st.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700/80 space-y-2">
                <Sparkles className="w-6 h-6 text-amber-500 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tuần mới vừa khởi động!
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Chưa có giao dịch báo cọc nào. Hãy là nhân viên đầu tiên báo cọc để vinh danh trên Bảng Vàng!
                </p>
                <button
                  onClick={() => {
                    setNewCategory('deals');
                    setIsCreateModalOpen(true);
                  }}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  🎯 Báo cọc mở bát ngay
                </button>
              </div>
            )}
          </div>

          {/* WIDGET 2: 3 NGUYÊN TẮC VÀNG ĐI DẪN PHÒNG */}
          <div className="bg-white dark:bg-[#1f1c1a] rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Quy Chuẩn Dẫn Khách</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <p>Luôn có mặt trước 15-20 phút kiểm tra phòng, bật máy lạnh và chuẩn bị nước mát.</p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <p>Khách chê giá cao: Áp dụng công thức chia nhỏ 16.000đ/ngày (chưa bằng nửa ly cà phê).</p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <p>Tôn trọng khách hàng của đồng đội, cùng hợp tác chia nguồn hàng chéo chi nhánh.</p>
              </div>
            </div>
          </div>

          {/* WIDGET 3: TRỢ GIÚP KHẨN CẤP KHI KẸT DEAL TẠI CHỖ */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-slate-800 dark:to-slate-850 border border-blue-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
              <PhoneCall className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Cần Cứu Deal Tại Phòng?</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Nếu đang ở phòng cùng khách mà gặp tình huống ngoài kịch bản, đừng ngại nhắn tin ngay cho Anh Rin hoặc hotline chi nhánh để được gỡ rối tức thì!
            </p>
            <div className="pt-1">
              <a 
                href="tel:0909999999" 
                className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Hotline Trợ giảng: 0909.xxx.xxx →
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL TẠO BÀI VIẾT / BÁO CỌC MỚI                                       */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#1f1c1a] border border-slate-200 dark:border-white/[0.08] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-left animate-in zoom-in-95">
            
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
                    Đăng câu hỏi ca khó hoặc chia sẻ tin vui chốt phòng
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
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Đăng bài ngay</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
