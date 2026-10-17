import React, { useState } from 'react';
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
  PartyPopper
} from 'lucide-react';

export default function InternalCommunityTab({
  isLoggedIn = false,
  currentUser = { name: 'Chuyên Viên Sale', role: 'pro_sales' },
  onOpenLogin
}) {
  // Bộ lọc chuyên mục học tập nội bộ
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // State quản lý bài viết
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Đan Rin (HLV Trưởng)',
      role: 'mentor',
      branch: 'Ban Đào Tạo RMSA',
      avatar: '/images/anh_rin_avatar.jpg',
      time: '2 giờ trước',
      category: 'notices',
      categoryLabel: 'Lưu ý từ Quản lý',
      categoryColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
      isPinned: true,
      title: 'QUAN TRỌNG: 3 điều cấm kỵ khi dẫn khách xem phòng trọ buổi trưa nắng gắt',
      content: 'Nhắc nhở toàn bộ anh em học viên và sale mới: Thời tiết Sài Gòn dạo này đỉnh điểm nắng nóng. Khách đi ngoài đường vào phòng mà hầm bí là tỷ lệ rớt deal lên đến 80%.\n\n1. BẮT BUỘC có mặt trước 20 phút: mở cửa sổ thông gió hoặc bật máy lạnh 24°C sẵn sàng.\n2. Chuẩn bị 1 chai nước suối lạnh mời khách ngay khi vừa dừng xe.\n3. Tuyệt đối không đứng chặn ngay cửa ra vào tạo cảm giác ngột ngạt cho khách.\n\nKhách bước vào phòng mát rượi, được chăm sóc tinh tế là tâm lý đã muốn cọc 50% rồi!',
      likes: 128,
      likedByMe: true,
      bookmarked: true,
      comments: [
        {
          id: 'c1_1',
          author: 'Tuấn Saler',
          role: 'pro_sales',
          branch: 'Bình Thạnh',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          time: '1 giờ trước',
          text: 'Chuẩn luôn anh Rin ơi! Hôm qua em chuẩn bị chai nước mát mời 2 bạn sinh viên, 2 bạn ấy khen tinh tế rồi chuyển khoản cọc luôn căn duplex 5tr8 Phan Đăng Lưu!'
        },
        {
          id: 'c1_2',
          author: 'Hà Linh',
          role: 'student',
          branch: 'Tân Binh Q1',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          time: '30 phút trước',
          text: 'Dạ em cảm ơn bài học thực tế của anh Rin, em ghi chép ngay vào sổ tay thực chiến ạ!'
        }
      ]
    },
    {
      id: 2,
      author: 'Tuấn Saler',
      role: 'pro_sales',
      branch: 'Chi nhánh Bình Thạnh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: '35 phút trước',
      category: 'deals',
      categoryLabel: '🎉 Thực hành chốt cọc',
      categoryColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      isCelebration: true,
      title: 'TING TING! Chốt thành công căn Duplex ban công 5.8tr tại Phan Đăng Lưu chỉ sau 1 lần dẫn!',
      content: 'Chào cả nhà, sáng nay em vừa áp dụng triệt để Checklist đón khách 15 phút và công thức chia nhỏ 16.000đ/ngày của anh Đan Rin. Khách ban đầu so sánh với bên Nơ Trang Long 5.3tr, chê bên mình đắt hơn 500k.\n\nEm nhẹ nhàng bẻ gãy từ chối: "Dạ 500k chỉ bằng 16k/ngày chưa tới nửa ly cà phê, nhưng đổi lại anh chị được ban công lộng gió, máy giặt riêng trong phòng không phải giặt chung và khóa vân tay an ninh tuyệt đối."\n➔ Khách gật gù và bắn cọc 1 triệu giữ phòng ngay tại chỗ!',
      depositAmount: '1.000.000đ',
      roomInfo: 'Duplex 35m² - 5.8 Tr/tháng',
      likes: 64,
      likedByMe: false,
      bookmarked: false,
      comments: [
        {
          id: 'c2_1',
          author: 'Hoàng Minh',
          role: 'pro_sales',
          branch: 'Phú Nhuận',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          time: '20 phút trước',
          text: 'Quá đỉnh anh Tuấn ơi! Xin vía chốt cọc đều tay như anh!'
        }
      ]
    },
    {
      id: 3,
      author: 'Hoàng Minh',
      role: 'student',
      branch: 'Chi nhánh Phú Nhuận',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      time: '1 giờ trước',
      category: 'qa',
      categoryLabel: '❓ Hỏi đáp ca khó',
      categoryColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      title: 'HỎI KINH NGHIỆM: Khách ưng phòng nhưng đòi giữ cọc 10 ngày mới ký hợp đồng thì xử lý thế nào?',
      content: 'Chào các anh chị tiền bối, em là học viên mới dắt ca chiều nay. Khách đã rất ưng căn studio 4.5tr ở Thích Quảng Đức, nhưng xin giữ cọc đến ngày 25 mới dọn vào (tức 10 ngày nữa). Trong khi chủ nhà chỉ cam kết giữ phòng tối đa 3 ngày.\n\nEm nên nói với chủ nhà thế nào để xin hỗ trợ, hoặc deal với khách ra sao để không bị rớt kèo ạ?',
      likes: 35,
      likedByMe: false,
      bookmarked: false,
      comments: [
        {
          id: 'c3_1',
          author: 'Đan Rin (HLV Trưởng)',
          role: 'mentor',
          branch: 'Ban Đào Tạo',
          avatar: '/images/anh_rin_avatar.jpg',
          time: '45 phút trước',
          text: '👉 Giải pháp cho em: Hãy đề xuất giải pháp "Bù tiền hỗ trợ giữ chỗ". Em nói với khách: "Dạ chủ nhà thường chỉ giữ phòng 3 ngày để tránh trống phòng mất doanh thu. Nếu anh chị muốn giữ đến ngày 25, em sẽ xin chủ tính tiền thuê từ ngày thứ 5 (tức hỗ trợ 5 ngày không tính tiền), chỉ tính từ ngày 20 trở đi". Như vậy vừa được lòng chủ nhà mà khách lại thấy mình đã hết lòng thương lượng giảm thiểu chi phí cho họ!'
        },
        {
          id: 'c3_2',
          author: 'Hoàng Minh',
          role: 'student',
          branch: 'Phú Nhuận',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          time: '30 phút trước',
          text: 'Dạ tuyệt vời quá anh Rin ơi, kịch bản quá sắc bén, em áp dụng gọi cho khách ngay đây ạ!'
        }
      ]
    },
    {
      id: 4,
      author: 'Thu Thảo',
      role: 'pro_sales',
      branch: 'Chi nhánh Quận 1',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      time: '3 giờ trước',
      category: 'tips',
      categoryLabel: '💡 Bí kíp dẫn trọ',
      categoryColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      title: 'Mẹo bỏ túi: 4 góc chụp ảnh phòng trọ/duplex "hút khách" nhất bằng điện thoại',
      content: 'Chào các bạn học viên mới! Để tin đăng có nhiều khách inbox nhất, các bạn đừng chụp thẳng góc bừa bãi. Hãy áp dụng đúng 4 góc này:\n\n1. Góc hạ thấp từ cửa chính: Bật chế độ camera 0.5x hoặc góc rộng, hạ camera ngang tầm ngực để lấy trọn chiều cao tầng lửng duplex.\n2. Góc ánh sáng ban ngày: Kéo rèm để ánh sáng tự nhiên tràn vào, mở đèn vàng tạo cảm giác ấm cúng.\n3. Góc bếp & tủ lạnh: Chụp cận cảnh bếp sạch sẽ và bồn rửa không dính cặn.\n4. Góc nhà vệ sinh sạch bóng: Luôn đóng nắp bồn cầu trước khi chụp!\n\nLàm đúng 4 góc này tỷ lệ khách hẹn xem phòng tăng gấp 3 lần nhé!',
      likes: 89,
      likedByMe: true,
      bookmarked: true,
      comments: [
        {
          id: 'c4_1',
          author: 'Đức Huy',
          role: 'student',
          branch: 'Tân Binh Bình Thạnh',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          time: '2 giờ trước',
          text: 'Cảm ơn chị Thảo nhiều ạ! Trước giờ em toàn chụp góc bừa nên nhìn phòng bị méo và chật hẹp, áp dụng ngay bài này ạ.'
        }
      ]
    }
  ]);

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

  // Xử lý Thả tim
  const handleToggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.likedByMe;
        return {
          ...p,
          likedByMe: nextLiked,
          likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
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
        if (nextBookmarked) {
          alert('📌 Đã lưu tình huống này vào Sổ tay nghiệp vụ của bạn!');
        }
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

  // Xử lý Gửi bình luận
  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser?.name || 'Học Viên Mới',
      role: currentUser?.role || 'student',
      branch: 'RMSA Nội Bộ',
      avatar: currentUser?.role === 'pro_sales' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
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
      deals: { label: '🎯 Thực hành chốt cọc', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
      tips: { label: '💡 Bí kíp dẫn trọ', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
      notices: { label: '📢 Lưu ý từ Quản lý', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900' }
    };

    const isDeal = newCategory === 'deals';

    const newPost = {
      id: Date.now(),
      author: currentUser?.name || 'Nhân Viên Mới',
      role: currentUser?.role || 'student',
      branch: 'RMSA Nội Bộ',
      avatar: currentUser?.role === 'pro_sales' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      time: 'Vừa xong',
      category: newCategory,
      categoryLabel: categoryMap[newCategory]?.label || 'Thảo luận',
      categoryColor: categoryMap[newCategory]?.color || 'bg-slate-100 text-slate-700',
      isCelebration: isDeal,
      title: newTitle.trim(),
      content: newContent.trim(),
      depositAmount: isDeal ? (newDeposit.trim() || 'Cọc 1.000.000đ') : null,
      roomInfo: isDeal ? (newRoomInfo.trim() || 'Phòng trọ thực địa') : null,
      likes: 1,
      likedByMe: true,
      bookmarked: false,
      comments: []
    };

    if (isDeal) {
      handleCelebrate();
    }

    setPosts(prev => [newPost, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewDeposit('');
    setNewRoomInfo('');
  };

  // Lọc bài viết theo danh mục
  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'all') return true;
    return post.category === selectedCategory;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6 pb-12">
      
      {/* 1. TOP HERO BANNER: TINH THẦN HỌC VIỆC NỘI BỘ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden mb-6 border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Góc Học Việc & Rèn Luyện Nghiệp Vụ Thực Chiến</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Diễn Đàn Thảo Luận Môi Giới Phòng Trọ RMSA
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Nơi anh em học viên hỏi nhanh các ca khó khi đi dắt phòng, chia sẻ bí kíp thực chiến và báo cáo kết quả chốt cọc mỗi ngày.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn && onOpenLogin) {
                onOpenLogin();
              } else {
                setIsCreateModalOpen(true);
              }
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-400 hover:via-indigo-400 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shrink-0 shadow-[0_4px_16px_rgba(59,130,246,0.35)] border border-blue-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Đăng câu hỏi / Báo cọc</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT: NỘI DUNG FEED (70%) + COMMAND CENTER NỘI BỘ (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* CỘT TRÁI (LEFT FEED - 8 COLS): BỘ LỌC + DANH SÁCH BÀI VIẾT THỰC HÀNH      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* THANH BỘ LỌC CHUYÊN MỤC TINH GỌN */}
          <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center space-x-1.5 overflow-x-auto">
            {[
              { key: 'all', label: 'Tất cả bài viết' },
              { key: 'qa', label: '❓ Hỏi đáp ca khó' },
              { key: 'deals', label: '🎯 Báo cọc thực hành' },
              { key: 'tips', label: '💡 Bí kíp dẫn trọ' },
              { key: 'notices', label: '📢 Lưu ý quản lý' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* DANH SÁCH CÁC BÀI VIẾT FEED */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xs border transition-all space-y-4 ${
                  post.isCelebration 
                    ? 'border-amber-400/80 dark:border-amber-500/80 ring-1 ring-amber-400/30 shadow-[0_4px_20px_rgba(245,158,11,0.08)]'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Header tác giả & Huy hiệu chức danh */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{post.author}</span>
                        {post.role === 'mentor' ? (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            HLV TRƯỞNG
                          </span>
                        ) : post.role === 'pro_sales' ? (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            PRO SALES
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            HỌC VIÊN
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {post.branch} • {post.time}
                      </p>
                    </div>
                  </div>

                  {/* Tag Chuyên mục */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {post.isPinned && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                        <Pin className="w-3 h-3 mr-1" /> Ghim quan trọng
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${post.categoryColor}`}>
                      {post.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Banner Báo Cọc Vinh Danh Nổi Bật (Nếu là Deal Chốt Cọc) */}
                {post.isCelebration && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-orange-500/10 border border-amber-300 dark:border-amber-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                        <PartyPopper className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                          Giao dịch thực chiến thành công
                        </p>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                          {post.roomInfo} • Đã nhận cọc giữ phòng: <strong className="text-amber-600 dark:text-amber-400 font-black">{post.depositAmount}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCelebrate}
                      className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] flex items-center space-x-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0 shadow-xs"
                    >
                      <span>🎉 Chúc mừng & Xin vía!</span>
                    </button>
                  </div>
                )}

                {/* Tiêu đề & Nội dung bài viết */}
                <div className="space-y-2 text-left">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                    {post.content}
                  </p>
                </div>

                {/* Thanh Action: Thả tim, Bình luận, Lưu bí kíp */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center space-x-1.5 transition-colors cursor-pointer font-semibold ${
                        post.likedByMe 
                          ? 'text-rose-600 dark:text-rose-400 font-bold' 
                          : 'hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400' : ''}`} />
                      <span>{post.likes} Hữu ích</span>
                    </button>

                    <button 
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center space-x-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments?.length || 0} Bình luận & Góp ý</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => handleToggleBookmark(post.id)}
                    className={`flex items-center space-x-1 transition-colors cursor-pointer text-xs font-semibold ${
                      post.bookmarked 
                        ? 'text-amber-600 dark:text-amber-400 font-bold' 
                        : 'hover:text-amber-600 dark:hover:text-amber-400'
                    }`}
                    title="Lưu lại bí kíp vào sổ tay"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${post.bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span className="hidden sm:inline">{post.bookmarked ? 'Đã lưu sổ tay' : 'Lưu bí kíp'}</span>
                  </button>
                </div>

                {/* KHU VỰC BÌNH LUẬN & GÓP Ý THỰC CHIẾN (ACCORDION) */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in">
                    
                    {/* Danh sách bình luận đã có */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="space-y-2.5">
                        {post.comments.map((cmt) => (
                          <div 
                            key={cmt.id}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1 text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <img 
                                  src={cmt.avatar} 
                                  alt={cmt.author} 
                                  className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{cmt.author}</span>
                                {cmt.role === 'mentor' && (
                                  <span className="text-[8px] font-black px-1 rounded-sm bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                    HLV
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">{cmt.time}</span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-8 whitespace-pre-line">
                              {cmt.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Khung nhập bình luận mới */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input 
                        type="text"
                        placeholder="Nhập góp ý, hỏi thêm kịch bản hoặc lời chúc..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
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
          
          {/* WIDGET 1: BẢNG VÀNG CHỐT CỌC TRONG TUẦN */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Bảng Vàng Tuần Này</h3>
                  <p className="text-[10px] text-slate-400">Số lượng căn chốt cọc thực tế</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Tuần 42
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { rank: 1, name: 'Tuấn Saler', branch: 'Bình Thạnh', deals: '5 Căn chốt', badge: '🥇 Top 1' },
                { rank: 2, name: 'Hoàng Minh', branch: 'Phú Nhuận', deals: '4 Căn chốt', badge: '🥈 Top 2' },
                { rank: 3, name: 'Thu Thảo', branch: 'Quận 1', deals: '3 Căn chốt', badge: '🥉 Top 3' },
                { rank: 4, name: 'Đức Huy', branch: 'Bình Thạnh', deals: '2 Căn chốt', badge: 'Tân Binh' }
              ].map(st => (
                <div 
                  key={st.rank}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                      st.rank === 1 ? 'bg-amber-400 text-slate-900' :
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
          </div>

          {/* WIDGET 2: 3 NGUYÊN TẮC VÀNG ĐI DẪN PHÒNG */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
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
      {/* 3. MODAL TẠO BÀI VIẾT / BÁO CỌC MỚI                                       */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-left">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tạo Bài Thảo Luận / Báo Cọc Thực Địa</h3>
                  <p className="text-[10px] text-slate-400">Chia sẻ với toàn bộ anh em học viên & chuyên viên RMSA</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
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
                  placeholder="Ví dụ: Khách chê máy giặt chung thì nên bẻ kịch bản thế nào?"
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
                  placeholder="Mô tả cụ thể khách hàng nói gì, tình huống xảy ra ở đâu và bạn đang cần anh em tư vấn điều gì..."
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
