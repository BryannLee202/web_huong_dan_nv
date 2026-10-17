import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Key, 
  LogIn, 
  Home, 
  BookOpen, 
  FileText, 
  Newspaper, 
  Award,
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Mail, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Building, 
  Download, 
  Users, 
  Compass, 
  Layers, 
  PhoneCall, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  Flame, 
  CheckCircle, 
  Eye, 
  MessageCircle, 
  ArrowRight, 
  UserCheck, 
  Star, 
  PlayCircle, 
  X,
  Play,
  BarChart3,
  Crosshair,
  Folder,
  Atom,
  LayoutGrid,
  Send,
  Check,
  User,
  LogOut
} from 'lucide-react';
import { 
  RealisticCourseIcon,
  RealisticExamIcon,
  RealisticArenaIcon,
  RealisticBookIcon,
  RealisticFolderIcon,
  RealisticForumIcon,
  RealisticCommunityIcon,
  RealisticFacebookIcon,
  RealisticYoutubeIcon,
  RealisticTiktokIcon
} from './RealisticIcons';

export default function MapStudyTeacherPage({ 
  onOpenLogin, 
  onEnterApp,
  onOpenPracticeTest,
  onOpenCheatsheet,
  onOpenLeaderboard,
  onOpenCertificate,
  onSelectCourse,
  isLoggedIn = false,
  currentUser = null,
  onLogout,
  onOpenAdmin
}) {
  // mainViewTab: 'home' (Trang chá»§ MapStudy) | 'courses' (KhĂ³a Ä‘Ă o táº¡o & Giáº£ng viĂªn Äan Rin) | 'community' (Cá»™ng Ä‘á»“ng)
  const [mainViewTab, setMainViewTab] = useState('home');
  const [courseTabSub, setCourseTabSub] = useState('program'); // 'program' | 'scripts'
  const [activeCourseCategory, setActiveCourseCategory] = useState('all'); // 'all' | 'group1_2' | 'group3_4' | 'group5' | 'group6_8' | 'materials'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTeacherModal, setSelectedTeacherModal] = useState(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form "LiĂªn há»‡ tÆ° váº¥n"
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    facebook: '',
    region: '',
    segment: ''
  });

  // Äá»‹nh dáº¡ng tĂªn tĂ i khoáº£n trang trá»ng, Ä‘Ă ng hoĂ ng
  const formatStudentName = (name) => {
    if (!name) return 'NhĂ¢n ViĂªn';
    const clean = String(name).trim();
    const lower = clean.toLowerCase();
    if (lower === 'nhanvien' || lower === 'nhan vien' || lower === 'nhan_vien' || lower.startsWith('nhanvien@')) {
      return 'NhĂ¢n ViĂªn';
    }
    if (lower === 'hocvien' || lower === 'hoc vien' || lower === 'hoc_vien' || lower.startsWith('hocvien@')) {
      return 'Há»c ViĂªn';
    }
    if (lower === 'admin' || lower.startsWith('admin@')) {
      return 'Quáº£n Trá»‹ ViĂªn';
    }
    return clean;
  };

  // Hero Banners Carousel (Cá»•ng ÄĂ o Táº¡o Ná»™i Bá»™ NhĂ¢n ViĂªn Running Man)
  const heroBanners = [
    {
      id: 1,
      tag: 'Cá»”NG ÄĂ€O Táº O Ná»˜I Bá»˜ RUNNING MAN',
      tagColor: 'text-blue-900 bg-blue-900/5 border-blue-800/15',
      dotColor: 'bg-blue-600',
      date: 'KhĂ³a Huáº¥n Luyá»‡n 2026',
      titleTop: 'Há»† THá»NG HUáº¤N LUYá»†N',
      titleHighlight: 'Ká»¸ NÄ‚NG SALE CÄ‚N Há»˜',
      titleBottom: 'DĂ€NH RIĂNG CHO NHĂ‚N VIĂN RUNNING MAN',
      subtitle: 'ÄĂ³ng gĂ³i toĂ n diá»‡n 8 nhĂ³m nÄƒng lá»±c cá»‘t lĂµi: PhĂ¢n biá»‡t giá» hĂ ng Studio & Duplex, ká»¹ thuáº­t Telesale 30s khai thĂ¡c nhu cáº§u vĂ  quy trĂ¬nh dáº«n khĂ¡ch chá»‘t cá»c trong ngĂ y.',
      badgeTitle: '8 CHUYĂN Äá»€ PHá»„U BĂN HĂ€NG',
      badgeSubtitle: 'Huáº¥n luyá»‡n trá»±c tiáº¿p bá»Ÿi Äan Rin',
      primaryBtnText: 'VĂ o há»c chuyĂªn Ä‘á» ngay',
      secondaryBtnText: 'Xem 8 nhĂ³m nÄƒng lá»±c',
      actionType: 'course',
      bgGradient: 'linear-gradient(135deg, #f0fdf9 0%, #e6f6f2 50%, #edf8f5 100%)',
      spotlightColor: 'bg-teal-200/35',
      visualType: 'apartment',
      cardTitle: 'Studio Duplex GĂ¡c Lá»­ng â€¢ Giá» HĂ ng Tháº­t',
      cardTag: '5.8 Tr/thĂ¡ng',
      cardImg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=80',
      mentorName: 'Äan Rin (Running Man)',
      mentorRole: 'HLV TrÆ°á»Ÿng Running Man',
      mentorDesc: '500+ NhĂ¢n viĂªn Ä‘Ă£ Ä‘Ă o táº¡o thá»±c táº¿'
    },
    {
      id: 2,
      tag: 'TĂ€I LIá»†U Ná»˜I Bá»˜ Äá»˜C QUYá»€N',
      tagColor: 'text-indigo-900 bg-indigo-900/5 border-indigo-800/15',
      dotColor: 'bg-indigo-600',
      date: 'Sá»• Tay Ká»‹ch Báº£n Bá» TĂºi 2026',
      titleTop: 'Bá»˜ Ká»CH Báº¢N 30 GIĂ‚Y',
      titleHighlight: 'Báºº GĂƒY Tá»ª CHá»I GIĂ',
      titleBottom: 'VĂ€ Ká»¸ THUáº¬T CHá»T Cá»ŒC THáº¦N Tá»C',
      subtitle: 'Náº¯m vá»¯ng cĂ´ng thá»©c quy Ä‘á»•i 500k chĂªnh lá»‡ch = 16.000Ä‘/ngĂ y, ká»¹ thuáº­t chá»‘t cá»c giáº£ Ä‘á»‹nh (Assumptive Close) vĂ  checklist Ä‘Ă³n khĂ¡ch 15 phĂºt Ä‘á»ƒ tÄƒng tá»· lá»‡ chá»‘t giao dá»‹ch lĂªn 40%.',
      badgeTitle: '30+ Ká»CH Báº¢N Äá»I ÄĂP Äá»˜C QUYá»€N',
      badgeSubtitle: 'ÄĂ³ng gĂ³i tá»« 8+ nÄƒm thá»±c Ä‘á»‹a',
      primaryBtnText: 'Tra cá»©u ká»‹ch báº£n máº«u',
      secondaryBtnText: 'Xem cáº©m nang thá»±c chiáº¿n',
      actionType: 'playbook',
      bgGradient: 'linear-gradient(135deg, #f0f4ff 0%, #e8edff 50%, #f4f6fc 100%)',
      spotlightColor: 'bg-indigo-200/30',
      visualType: 'playbook',
      cardTitle: 'Sá»• Tay Bá» TĂºi â€¢ BĂ­ Quyáº¿t Äá»‘i ÄĂ¡p KhĂ¡ch',
      cardTag: 'Äá»™c Quyá»n RMSA',
      cardImg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80',
      mentorName: 'Ban NghiĂªn Cá»©u & ÄĂ o Táº¡o',
      mentorRole: 'Ká»‹ch Báº£n Bá» TĂºi (PDF)',
      mentorDesc: 'Quy Ä‘á»•i 16k/ngĂ y â€¢ Assumptive Close'
    },
    {
      id: 3,
      tag: 'SĂT Háº CH NÄ‚NG Lá»°C Äá»NH Ká»²',
      tagColor: 'text-purple-900 bg-purple-900/5 border-purple-800/15',
      dotColor: 'bg-purple-600',
      date: 'PhĂ²ng Thi áº¢o â€¢ Chuáº©n NÄƒng Lá»±c',
      titleTop: 'PHĂ’NG THI SĂT Háº CH áº¢O',
      titleHighlight: 'TĂŒNH HUá»NG THá»°C Äá»A',
      titleBottom: 'VĂ€ CHá»¨NG CHá»ˆ ÄIá»†N Tá»¬ Ná»˜I Bá»˜',
      subtitle: 'Kiá»ƒm tra pháº£n xáº¡ thá»±c táº¿ qua ngĂ¢n hĂ ng 15 cĂ¢u há»i tĂ¬nh huá»‘ng mĂ´ phá»ng. Äáº¡t chuáº©n â‰¥ 80% Ä‘Æ°á»£c cáº¥p Chá»©ng chá»‰ Äiá»‡n tá»­ RMSA vĂ  quyá»n Æ°u tiĂªn nháº­n data khĂ¡ch nĂ©t tá»« cĂ´ng ty.',
      badgeTitle: 'Äáº T CHUáº¨N â‰¥ 80% Cáº¤P CHá»¨NG CHá»ˆ',
      badgeSubtitle: 'Vinh danh Báº£ng VĂ ng Best Seller',
      primaryBtnText: 'VĂ o phĂ²ng thi sĂ¡t háº¡ch',
      secondaryBtnText: 'Xem Báº£ng Xáº¿p Háº¡ng',
      actionType: 'exam',
      bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #fbf8ff 100%)',
      spotlightColor: 'bg-purple-200/30',
      visualType: 'certificate',
      cardTitle: 'Chá»©ng Nháº­n Nghiá»‡p Vá»¥ Sale CÄƒn Há»™ RMSA',
      cardTag: 'Äiá»ƒm Äáº¡t: â‰¥ 80%',
      cardImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80',
      mentorName: 'Há»™i Äá»“ng Kháº£o SĂ¡t RMSA',
      mentorRole: 'XĂ¡c Thá»±c Äiá»‡n Tá»­ QR',
      mentorDesc: 'Cáº¥p chá»©ng nháº­n chuáº©n hĂ³a ná»™i bá»™'
    }
  ];

  const [isBannerHovered, setIsBannerHovered] = useState(false);

  // Safe slide navigation functions with complete wrap-around looping (Trang 1 <-> Trang 3)
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => {
      const len = heroBanners.length;
      return ((prev - 1) % len + len) % len;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => {
      const len = heroBanners.length;
      return (prev + 1) % len;
    });
  };

  // Safe normalized slide index that NEVER goes out of bounds
  const safeSlide = ((currentSlide % heroBanners.length) + heroBanners.length) % heroBanners.length;
  const currentBanner = heroBanners[safeSlide] || heroBanners[0];

  // Auto carousel slide with hover pause
  useEffect(() => {
    if (isBannerHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isBannerHovered, heroBanners.length]);

  // Hot Keywords
  const hotKeywords = [
    { title: 'Ká»‹ch báº£n Telesale 30s', query: 'ká»‹ch báº£n' },
    { title: 'Duplex gĂ¡c lá»­ng', query: 'duplex' },
    { title: 'CÄƒn há»™ Studio', query: 'studio' },
    { title: 'Báº» gĂ£y tá»« chá»‘i giĂ¡', query: 'tá»« chá»‘i' },
    { title: 'Tháº§y Äan Rin', query: 'Äan Rin' },
    { title: 'Checklist Ä‘Ă³n khĂ¡ch 15p', query: 'Ä‘Ă³n khĂ¡ch' },
    { title: '8 NhĂ³m nÄƒng lá»±c', query: 'nhĂ³m' },
    { title: 'Quy Ä‘á»•i 16k/ngĂ y', query: '16k' }
  ];

  // Äá»™i ngÅ© Giáº£ng viĂªn
  const teachersList = [
    {
      id: 1,
      name: 'Äan Rin',
      role: 'SĂ¡ng Láº­p & Huáº¥n Luyá»‡n ViĂªn TrÆ°á»Ÿng RMSA',
      title: 'ChuyĂªn gia Ä‘Ă o táº¡o nghiá»‡p vá»¥ mĂ´i giá»›i & váº­n hĂ nh chuá»—i cÄƒn há»™ cho thuĂª thá»±c chiáº¿n',
      avatar: '/images/anh_rin_avatar.jpg',
      badge: 'GIáº¢NG VIĂN CHĂNH',
      rating: '5.0',
      totalLessons: '6 ChuyĂªn Ä‘á» phá»…u',
      achievements: [
        '8+ nÄƒm kinh nghiá»‡m trá»±c tiáº¿p phĂ¡t triá»ƒn & váº­n hĂ nh chuá»—i cÄƒn há»™ mini, duplex, studio cho thuĂª Ä‘áº¡t tá»· lá»‡ láº¥p Ä‘áº§y >95%.',
        'Huáº¥n luyá»‡n hÆ¡n 500+ anh em mĂ´i giá»›i thá»±c chiáº¿n tá»« con sá»‘ 0 Ä‘áº¿n chá»‘t cá»c Ä‘á»u Ä‘áº·n má»—i thĂ¡ng.',
        'ÄĂ³ng gĂ³i chuáº©n 8 NhĂ³m NÄƒng Lá»±c Nghiá»‡p Vá»¥ MĂ´i Giá»›i CÄƒn Há»™ Cho ThuĂª Running Man.',
        'Triáº¿t lĂ½: "Há»c Ä‘Ăºng bĂ i phá»…u - Ra thá»±c chiáº¿n ngay - Update bĂ i há»c hĂ ng tuáº§n".'
      ]
    },
    {
      id: 2,
      name: 'Ban Váº­n HĂ nh TĂ²a NhĂ ',
      role: 'Quáº£n LĂ½ Nguá»“n HĂ ng & Dá»‹ch Vá»¥ Sá»‘',
      title: 'ChuyĂªn gia kháº£o sĂ¡t nguá»“n hĂ ng tháº­t & sá»‘ hĂ³a thĂ´ng tin chá»§ nhĂ ',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      badge: 'NGUá»’N HĂ€NG THáº¬T',
      rating: '4.9',
      totalLessons: 'NhĂ³m 2: Nguá»“n hĂ ng & Giá» cÄƒn',
      achievements: [
        'Quáº£n lĂ½ danh má»¥c hÆ¡n 3.000 cÄƒn há»™ trá»‘ng trĂªn há»‡ thá»‘ng sá»‘ chá»§ nhĂ .',
        'Quy chuáº©n hĂ³a quy trĂ¬nh chá»¥p áº£nh, quay video gĂ³c rá»™ng vĂ  cáº­p nháº­t tĂ¬nh tráº¡ng phĂ²ng realtime.'
      ]
    },
    {
      id: 3,
      name: 'Tá»• Marketing & ÄÄƒng Tin',
      role: 'Khai ThĂ¡c KhĂ¡ch HĂ ng Tiá»m NÄƒng',
      title: 'ChuyĂªn gia táº¡o phá»…u Chá»£ Tá»‘t, Há»™i nhĂ³m Facebook & Video ngáº¯n TikTok',
      avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      badge: 'Táº O PHá»„U KHĂCH',
      rating: '4.9',
      totalLessons: 'NhĂ³m 3: ÄÄƒng tin & TĂ¬m khĂ¡ch',
      achievements: [
        'Chá»§ Ä‘á»™ng táº¡o ra hÆ¡n 200+ khĂ¡ch há»i thuĂª má»›i má»—i tuáº§n cho Ä‘á»™i ngÅ© mĂ´i giá»›i.',
        'Bá»™ 20 máº«u tin Ä‘Äƒng cĂ³ tá»· lá»‡ click cao nháº¥t ngĂ nh cho thuĂª cÄƒn há»™.'
      ]
    },
    {
      id: 4,
      name: 'Há»™i Äá»“ng Kháº£o SĂ¡t RMSA',
      role: 'Ban SĂ¡t Háº¡ch & Cáº¥p Chá»©ng Chá»‰',
      title: 'Há»‡ thá»‘ng Ä‘Ă¡nh giĂ¡ nÄƒng lá»±c tá»± Ä‘á»™ng & quáº£n lĂ½ phá»…u CRM',
      avatar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      badge: 'PHĂ’NG THI áº¢O',
      rating: '5.0',
      totalLessons: 'Ká»³ thi sĂ¡t háº¡ch & CRM',
      achievements: [
        'SĂ¡t háº¡ch tá»± Ä‘á»™ng sau má»—i bĂ i há»c vá»›i thang Ä‘iá»ƒm chuáº©n â‰¥ 80%.',
        'Theo dĂµi tá»· lá»‡ chuyá»ƒn Ä‘á»•i tá»«ng cháº·ng trong phá»…u bĂ¡n hĂ ng CRM.'
      ]
    }
  ];

  // 8 NhĂ³m nÄƒng lá»±c mĂ´i giá»›i cho thuĂª cá»§a Äan Rin (TĂ¡ch riĂªng tá»«ng chá»§ Ä‘á» Ä‘á»™c láº­p)
  const competencyRoadmap = [
    {
      groupNum: 1,
      filterKey: 'nhom_1',
      title: 'NhĂ³m 1 â€” Hiá»ƒu sáº£n pháº©m vĂ  thá»‹ trÆ°á»ng',
      objective: 'NhĂ¢n viĂªn pháº£i hiá»ƒu mĂ¬nh Ä‘ang bĂ¡n gĂ¬, cho ai vĂ  vĂ¬ sao khĂ¡ch nĂªn thuĂª cÄƒn Ä‘Ă³.',
      status: 'active',
      badge: 'ÄĂ£ Ä‘Ă³ng gĂ³i',
      lessonsCount: 'BĂ i phá»…u cĂ³ sáºµn'
    },
    {
      groupNum: 2,
      filterKey: 'nhom_2',
      title: 'NhĂ³m 2 â€” Táº¡o nguá»“n hĂ ng vĂ  quáº£n lĂ½ giá» cÄƒn há»™',
      objective: 'CĂ³ nguá»“n hĂ ng tháº­t, thĂ´ng tin chĂ­nh xĂ¡c vĂ  Ä‘á»§ lá»±a chá»n Ä‘á»ƒ Ä‘Ă¡p á»©ng nhu cáº§u khĂ¡ch.',
      status: 'active',
      badge: 'ÄĂ£ Ä‘Ă³ng gĂ³i',
      lessonsCount: 'BĂ i phá»…u cĂ³ sáºµn'
    },
    {
      groupNum: 3,
      filterKey: 'nhom_3',
      title: 'NhĂ³m 3 â€” TĂ¬m kiáº¿m khĂ¡ch hĂ ng vĂ  khai thĂ¡c nhu cáº§u',
      objective: 'Biáº¿t chá»§ Ä‘á»™ng táº¡o khĂ¡ch hĂ ng tiá»m nÄƒng, thay vĂ¬ chá»‰ ngá»“i chá» khĂ¡ch há»i tin Ä‘Äƒng.',
      status: 'active',
      badge: 'ÄĂ£ Ä‘Ă³ng gĂ³i',
      lessonsCount: 'BĂ i phá»…u cĂ³ sáºµn'
    },
    {
      groupNum: 4,
      filterKey: 'nhom_4',
      title: 'NhĂ³m 4 â€” TÆ° váº¥n vĂ  dáº«n khĂ¡ch xem cÄƒn há»™',
      objective: 'TÄƒng tá»· lá»‡ khĂ¡ch tá»« Ä‘áº·t lá»‹ch sang xem tháº­t, vĂ  tá»« xem cÄƒn sang lá»±a chá»n cÄƒn phĂ¹ há»£p.',
      status: 'active',
      badge: 'ÄĂ£ Ä‘Ă³ng gĂ³i',
      lessonsCount: 'BĂ i phá»…u cĂ³ sáºµn'
    },
    {
      groupNum: 5,
      filterKey: 'nhom_5',
      title: 'NhĂ³m 5 â€” Xá»­ lĂ½ tá»« chá»‘i, Ä‘Ă m phĂ¡n vĂ  chá»‘t giao dá»‹ch',
      objective: 'Báº» gĂ£y pháº£n Ä‘á»‘i giĂ¡, giáº£i tá»a tĂ¢m lĂ½ do dá»± vĂ  chá»‘t cá»c giá»¯ phĂ²ng nhanh gá»n.',
      status: 'active',
      badge: 'ÄĂ£ Ä‘Ă³ng gĂ³i',
      lessonsCount: 'BĂ i phá»…u cĂ³ sáºµn'
    },
    {
      groupNum: 6,
      filterKey: 'nhom_6',
      title: 'NhĂ³m 6 â€” CRM, KPI vĂ  quáº£n lĂ½ phá»…u bĂ¡n hĂ ng',
      objective: 'Quáº£n lĂ½ data khĂ¡ch, theo dĂµi tá»· lá»‡ chuyá»ƒn Ä‘á»•i tá»«ng giai Ä‘oáº¡n vĂ  ká»· luáº­t cĂ´ng viá»‡c.',
      status: 'active',
      badge: 'ÄĂ£ Ä‘Ă³ng gĂ³i',
      lessonsCount: 'BĂ i phá»…u cĂ³ sáºµn'
    },
    {
      groupNum: 7,
      filterKey: 'nhom_7',
      title: 'NhĂ³m 7 â€” Ká»· luáº­t nghá» nghiá»‡p vĂ  dá»‹ch vá»¥ khĂ¡ch hĂ ng',
      objective: 'Äáº¡o Ä‘á»©c lĂ m nghá» mĂ´i giá»›i, báº£o vá»‡ cá»c cá»§a khĂ¡ch, dá»‹ch vá»¥ sau chá»‘t vĂ  táº¡o nguá»“n giá»›i thiá»‡u.',
      status: 'active',
      badge: 'ÄĂ£ Ä‘Ă³ng gĂ³i',
      lessonsCount: 'BĂ i phá»…u cĂ³ sáºµn'
    },
    {
      groupNum: 8,
      filterKey: 'nhom_8',
      title: 'NhĂ³m 8 â€” Thá»±c chiáº¿n ngoĂ i thá»‹ trÆ°á»ng',
      objective: 'Tá»± tin xá»­ lĂ½ tĂ¬nh huá»‘ng thá»±c Ä‘á»‹a, kháº£o sĂ¡t thá»‹ trÆ°á»ng vĂ  giáº£i quyáº¿t ca khĂ³ phĂ¡t sinh.',
      status: 'active',
      badge: 'ÄĂ£ Ä‘Ă³ng gĂ³i',
      lessonsCount: 'BĂ i phá»…u cĂ³ sáºµn'
    }
  ];

  // Danh má»¥c phĂ¢n loáº¡i chuyĂªn Ä‘á» (TĂ¡ch riĂªng tá»«ng chá»§ Ä‘á» Ä‘á»™c láº­p)
  const courseCategories = [
    { key: 'all', label: 'Táº¥t cáº£ (8 NhĂ³m)' },
    { key: 'nhom_1', label: 'NhĂ³m 1: Sáº£n pháº©m & Thá»‹ trÆ°á»ng' },
    { key: 'nhom_2', label: 'NhĂ³m 2: Nguá»“n hĂ ng & Giá» cÄƒn' },
    { key: 'nhom_3', label: 'NhĂ³m 3: TĂ¬m khĂ¡ch & Nhu cáº§u' },
    { key: 'nhom_4', label: 'NhĂ³m 4: TÆ° váº¥n & Dáº«n khĂ¡ch' },
    { key: 'nhom_5', label: 'NhĂ³m 5: Xá»­ lĂ½ tá»« chá»‘i & Chá»‘t deal' },
    { key: 'nhom_6', label: 'NhĂ³m 6: CRM & Quáº£n lĂ½ phá»…u' },
    { key: 'nhom_7', label: 'NhĂ³m 7: Ká»· luáº­t & Dá»‹ch vá»¥ CSKH' },
    { key: 'nhom_8', label: 'NhĂ³m 8: Thá»±c chiáº¿n thá»‹ trÆ°á»ng' },
    { key: 'materials', label: 'TĂ i liá»‡u & Biá»ƒu máº«u' }
  ];

  // Danh sĂ¡ch cĂ¡c khĂ³a há»c Ä‘Ă o táº¡o (Chuáº©n Card MapStudy theo tá»«ng nhĂ³m nÄƒng lá»±c)
  const trainingCourses = [
    {
      id: 1,
      lessonId: 'bai-1',
      code: 'RM-01',
      stageBadge: 'ChuyĂªn Äá» 01',
      groupKey: 'nhom_1',
      title: 'RM-01: HIá»‚U Sáº¢N PHáº¨M & THá» TRÆ¯á»œNG - PHĂ‚N BIá»†T STUDIO, DUPLEX, CÄ‚N MINI CHO THUĂ',
      categoryLabel: 'NhĂ³m 1 â€¢ Sáº£n Pháº©m',
      thumb: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      duration: '15 phĂºt',
      quizCount: '5 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Äan Rin',
      reactions: 385
    },
    {
      id: 2,
      lessonId: 'bai-2',
      code: 'RM-02',
      stageBadge: 'ChuyĂªn Äá» 02',
      groupKey: 'nhom_2',
      title: 'RM-02: Táº O NGUá»’N HĂ€NG THáº¬T & QUáº¢N TRá» Dá»CH Vá»¤ Sá» CHá»¦ NHĂ€ CHO THUĂ',
      categoryLabel: 'NhĂ³m 2 â€¢ Nguá»“n HĂ ng',
      thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      duration: '14 phĂºt',
      quizCount: '5 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Äan Rin',
      reactions: 420
    },
    {
      id: 3,
      lessonId: 'bai-3',
      code: 'RM-03',
      stageBadge: 'ChuyĂªn Äá» 03',
      groupKey: 'nhom_3',
      title: 'RM-03: Ká»¸ NÄ‚NG ÄÄ‚NG TIN ÄA KĂNH & Bá»˜ 6 CĂ‚U Há»I KHAI THĂC NHU Cáº¦U TRONG 2 PHĂT',
      categoryLabel: 'NhĂ³m 3 â€¢ TĂ¬m KhĂ¡ch',
      thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      duration: '15 phĂºt',
      quizCount: '5 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Äan Rin',
      reactions: 512
    },
    {
      id: 4,
      lessonId: 'bai-4',
      code: 'RM-04',
      stageBadge: 'ChuyĂªn Äá» 04',
      groupKey: 'nhom_4',
      title: 'RM-04: Ká»CH Báº¢N Gá»ŒI ÄIá»†N 30 GIĂ‚Y & CHECKLIST ÄĂ“N KHĂCH TRÆ¯á»C GIá»œ Háº¸N 15 PHĂT',
      categoryLabel: 'NhĂ³m 4 â€¢ Dáº«n KhĂ¡ch',
      thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      duration: '16 phĂºt',
      quizCount: '5 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Äan Rin',
      reactions: 590
    },
    {
      id: 5,
      lessonId: 'bai-5',
      code: 'RM-05',
      stageBadge: 'ChuyĂªn Äá» 05',
      groupKey: 'nhom_5',
      title: 'RM-05: Ká»¸ THUáº¬T Báºº GĂƒY Tá»ª CHá»I GIĂ (16K/NGĂ€Y) & CHá»T Cá»ŒC GIá»® PHĂ’NG Táº I CHá»–',
      categoryLabel: 'NhĂ³m 5 â€¢ Chá»‘t Cá»c',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      duration: '18 phĂºt',
      quizCount: '5 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Äan Rin',
      reactions: 680
    },
    {
      id: 6,
      lessonId: 'bai-6',
      code: 'RM-06',
      stageBadge: 'ChuyĂªn Äá» 06',
      groupKey: 'nhom_6',
      title: 'RM-06: QUáº¢N LĂ PHá»„U CRM, THIáº¾T Láº¬P KPI & Tá»I Æ¯U Tá»¶ Lá»† CHUYá»‚N Äá»”I BĂN HĂ€NG',
      categoryLabel: 'NhĂ³m 6 â€¢ Quáº£n LĂ½ Phá»…u',
      thumb: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      duration: '15 phĂºt',
      quizCount: '5 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Äan Rin',
      reactions: 435
    },
    {
      id: 7,
      lessonId: 'bai-7',
      code: 'RM-07',
      stageBadge: 'ChuyĂªn Äá» 07',
      groupKey: 'nhom_7',
      title: 'RM-07: Ká»¶ LUáº¬T NGHá»€ NGHIá»†P, Báº¢O Vá»† Cá»ŒC & QUY TRĂŒNH CHÄ‚M SĂ“C KHĂCH HĂ€NG 72H',
      categoryLabel: 'NhĂ³m 7 â€¢ Ká»· Luáº­t & CSKH',
      thumb: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
      duration: '15 phĂºt',
      quizCount: '5 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Äan Rin',
      reactions: 480
    },
    {
      id: 8,
      lessonId: 'bai-8',
      code: 'RM-08',
      stageBadge: 'ChuyĂªn Äá» 08',
      groupKey: 'nhom_8',
      title: 'RM-08: THá»°C CHIáº¾N NGOĂ€I THá» TRÆ¯á»œNG - KHáº¢O SĂT THá»°C Äá»A & Xá»¬ LĂ 10 CA KHĂ“',
      categoryLabel: 'NhĂ³m 8 â€¢ Thá»±c Chiáº¿n Thá»‹ TrÆ°á»ng',
      thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      duration: '16 phĂºt',
      quizCount: '5 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Äan Rin',
      reactions: 560
    },
    {
      id: 9,
      lessonId: 'bai-5',
      code: 'RM-DOC-01',
      stageBadge: 'TĂ i Liá»‡u ÄĂ­nh KĂ¨m',
      groupKey: 'materials',
      title: 'Cáº¨M NANG Bá» TĂI: 30 Ká»CH Báº¢N Äá»I ÄĂP Báºº GĂƒY Tá»ª CHá»I GIĂ THUĂ PHĂ’NG TRá»Œ / CÄ‚N Há»˜',
      categoryLabel: 'TĂ i Liá»‡u ÄĂ­nh KĂ¨m',
      thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      duration: 'Ebook PDF',
      quizCount: 'Tra cá»©u nhanh',
      passingScore: 'Miá»…n phĂ­',
      instructor: 'Ban ÄĂ o Táº¡o RMSA',
      reactions: 710
    },
    {
      id: 10,
      lessonId: 'bai-2',
      code: 'RM-DOC-02',
      stageBadge: 'Máº«u Há»£p Äá»“ng',
      groupKey: 'materials',
      title: 'MáºªU Há»¢P Äá»’NG THUĂ CÄ‚N Há»˜ Dá»CH Vá»¤ & BIĂN Báº¢N BĂ€N GIAO PHĂ’NG CHUáº¨N PHĂP LĂ',
      categoryLabel: 'Máº«u Há»£p Äá»“ng',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      duration: 'File Word/PDF',
      quizCount: 'Táº£i trá»±c tiáº¿p',
      passingScore: 'Miá»…n phĂ­',
      instructor: 'Ban PhĂ¡p Cháº¿ RMSA',
      reactions: 395
    },
    {
      id: 11,
      lessonId: 'bai-1',
      code: 'RM-ARENA',
      stageBadge: 'PhĂ²ng Thi áº¢o',
      groupKey: 'materials',
      title: 'Ká»² THI SĂT Háº CH TOĂ€N DIá»†N: 15 CĂ‚U Há»I TĂŒNH HUá»NG THá»°C Äá»A MĂ”I GIá»I CÄ‚N Há»˜',
      categoryLabel: 'SĂ¡t Háº¡ch NÄƒng Lá»±c',
      thumb: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      duration: '15 phĂºt',
      quizCount: '15 cĂ¢u',
      passingScore: 'â‰¥ 80%',
      instructor: 'Há»™i Äá»“ng Kháº£o SĂ¡t RMSA',
      reactions: 620
    }
  ];

  // Cáº©m nang & Tin tá»©c thá»±c chiáº¿n
  const articlesList = [
    {
      id: 'art-1',
      title: 'Ká»‹ch báº£n 30 giĂ¢y phĂ¡ bÄƒng khi khĂ¡ch nháº¯n há»i: "PhĂ²ng nĂ y cĂ²n khĂ´ng em? GiĂ¡ bao nhiĂªu?"',
      excerpt: 'Tuyá»‡t Ä‘á»‘i khĂ´ng chá»‰ tráº£ lá»i "Dáº¡ cĂ²n" rá»“i im láº·ng. Quy trĂ¬nh 3 bÆ°á»›c gá»­i lá»i chĂ o ná»“ng nhiá»‡t, khÆ¡i gá»£i thá»i gian dá»n phĂ²ng vĂ  chá»‘t lá»‹ch xem phĂ²ng trá»±c tiáº¿p trong ngĂ y.',
      tag: 'NhĂ³m 4 â€¢ Telesale',
      readTime: '4 phĂºt Ä‘á»c',
      date: 'ThĂ¡ng 10/2026',
      views: '1,420',
      thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'art-2',
      title: 'BĂ­ quyáº¿t biáº¿n 500k chĂªnh lá»‡ch thĂ nh 16.000Ä‘/ngĂ y: Báº» gĂ£y lá»i tá»« chá»‘i "GiĂ¡ phĂ²ng bĂªn em Ä‘áº¯t quĂ¡"',
      excerpt: 'Quy Ä‘á»•i chi phĂ­ trĂªn ngĂ y: 16k/ngĂ y chÆ°a báº±ng ná»­a ly cĂ  phĂª nhÆ°ng Ä‘á»•i láº¥y an ninh vĂ¢n tay 2 lá»›p, camera 24/7, giá» tá»± do, mĂ¡y giáº·t riĂªng vĂ  báº£o trĂ¬ ká»¹ thuáº­t miá»…n phĂ­.',
      tag: 'NhĂ³m 5 â€¢ Báº» gĂ£y tá»« chá»‘i',
      readTime: '6 phĂºt Ä‘á»c',
      date: 'ThĂ¡ng 10/2026',
      views: '2,890',
      thumb: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'art-3',
      title: 'Checklist 5 bÆ°á»›c biáº¿n cÄƒn phĂ²ng thĂ nh khĂ´ng gian hĂºt khĂ¡ch trÆ°á»›c giá» háº¹n 15 phĂºt',
      excerpt: 'Äáº¿n trÆ°á»›c má»Ÿ cá»­a thĂ´ng thoĂ¡ng, báº­t Ä‘iá»u hĂ²a 24 Ä‘á»™ mĂ¡t rÆ°á»£i, hÆ°Æ¡ng tinh dáº§u nháº¹, kĂ©o rĂ¨m Ä‘Ă³n sĂ¡ng tá»± nhiĂªn táº¡o áº¥n tÆ°á»£ng WOW ngay khi khĂ¡ch bÆ°á»›c chĂ¢n vĂ o.',
      tag: 'NhĂ³m 4 â€¢ Dáº«n khĂ¡ch',
      readTime: '5 phĂºt Ä‘á»c',
      date: 'ThĂ¡ng 10/2026',
      views: '1,950',
      thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'art-4',
      title: 'Ká»¹ thuáº­t chá»‘t cá»c giáº£ Ä‘á»‹nh (Assumptive Close) & Quy trĂ¬nh thu cá»c láº­p phiáº¿u giá»¯ phĂ²ng 24h',
      excerpt: 'CĂ¡ch nháº­n diá»‡n 4 tĂ­n hiá»‡u muá»‘n mua cá»§a khĂ¡ch thuĂª vĂ  hÆ°á»›ng khĂ¡ch hĂ ng vĂ o phÆ°Æ¡ng thá»©c Ä‘áº·t cá»c (tiá»n máº·t hay quĂ©t QR) Ä‘á»ƒ khĂ³a phĂ²ng trĂªn há»‡ thá»‘ng.',
      tag: 'NhĂ³m 5 â€¢ Chá»‘t cá»c',
      readTime: '5 phĂºt Ä‘á»c',
      date: 'ThĂ¡ng 10/2026',
      views: '3,210',
      thumb: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80'
    }
  ];

  // Tháº£o luáº­n cá»™ng Ä‘á»“ng Running Man
  const communityPosts = [
    {
      id: 1,
      author: 'Tuáº¥n Saler - Chi nhĂ¡nh BĂ¬nh Tháº¡nh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: '15 phĂºt trÆ°á»›c',
      title: 'Kinh nghiá»‡m chá»‘t thĂ nh cĂ´ng cÄƒn Duplex 5.8tr táº¡i Phan ÄÄƒng LÆ°u chá»‰ sau 1 láº§n dáº«n!',
      content: 'ChĂ o cáº£ nhĂ , hĂ´m nay em vá»«a Ă¡p dá»¥ng triá»‡t Ä‘á»ƒ Checklist Ä‘Ă³n khĂ¡ch 15 phĂºt vĂ  cĂ´ng thá»©c chia nhá» 16k/ngĂ y cá»§a Äan Rin. KhĂ¡ch ban Ä‘áº§u so sĂ¡nh vá»›i bĂªn NÆ¡ Trang Long 5.3tr nhÆ°ng sau khi chá»‰ ra mĂ¡y giáº·t riĂªng vĂ  ban cĂ´ng thoĂ¡ng, khĂ¡ch Ä‘á»“ng Ă½ chuyá»ƒn khoáº£n cá»c 1 triá»‡u giá»¯ phĂ²ng luĂ´n!',
      likes: 42,
      comments: 18,
      tag: 'Chia sáº» kinh nghiá»‡m'
    },
    {
      id: 2,
      author: 'HoĂ ng Minh - Chi nhĂ¡nh PhĂº Nhuáº­n',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      time: '1 giá» trÆ°á»›c',
      title: 'Há»i kinh nghiá»‡m: KhĂ¡ch Ä‘Ă²i giá»¯ phĂ²ng 1 tuáº§n má»›i kĂ½ há»£p Ä‘á»“ng thĂ¬ xá»­ lĂ½ tháº¿ nĂ o?',
      content: 'Anh em cho em há»i, khĂ¡ch Ä‘Ă£ Æ°ng phĂ²ng nhÆ°ng xin giá»¯ cá»c Ä‘áº¿n cuá»‘i tuáº§n sau má»›i dá»n vĂ o. Chá»§ nhĂ  chá»‰ cho giá»¯ tá»‘i Ä‘a 3 ngĂ y. Trong trÆ°á»ng há»£p nĂ y cĂ¡c bĂ¡c tÆ° váº¥n sao Ä‘á»ƒ khĂ´ng máº¥t khĂ¡ch áº¡?',
      likes: 28,
      comments: 24,
      tag: 'Há»i Ä‘Ă¡p ca khĂ³'
    },
    {
      id: 3,
      author: 'Äan Rin (HLV TrÆ°á»Ÿng)',
      avatar: '/images/anh_rin_avatar.jpg',
      time: '3 giá» trÆ°á»›c',
      title: 'LÆ°u Ă½ quan trá»ng cho anh em khi dáº«n khĂ¡ch xem phĂ²ng giá» trÆ°a náº¯ng gáº¯t',
      content: 'Nháº¯c nhá»Ÿ toĂ n bá»™ anh em: Thá»i tiáº¿t SĂ i GĂ²n dáº¡o nĂ y ráº¥t náº¯ng. Khi háº¹n khĂ¡ch tá»« 11h - 14h, báº¯t buá»™c pháº£i Ä‘áº¿n trÆ°á»›c 20 phĂºt, báº­t mĂ¡y láº¡nh sáºµn vĂ  chuáº©n bá»‹ 1 chai nÆ°á»›c suá»‘i láº¡nh má»i khĂ¡ch. KhĂ¡ch bÆ°á»›c vĂ o phĂ²ng mĂ¡t rÆ°á»£i lĂ  tĂ¢m lĂ½ Ä‘Ă£ muá»‘n chá»‘t 50% rá»“i!',
      likes: 95,
      comments: 31,
      tag: 'Nháº¯c nhá»Ÿ nghiá»‡p vá»¥'
    }
  ];

  const filteredCourses = trainingCourses.filter(course => {
    const matchCategory = activeCourseCategory === 'all' || course.groupKey === activeCourseCategory;
    const matchQuery = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleCourseClick = (course) => {
    if (isLoggedIn && onSelectCourse) {
      onSelectCourse(course.lessonId || 'bai-1');
    } else if (onOpenLogin) {
      onOpenLogin();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Vui lĂ²ng nháº­p Há» vĂ  tĂªn vĂ  Sá»‘ Ä‘iá»‡n thoáº¡i Ä‘á»ƒ Ä‘Æ°á»£c tÆ° váº¥n!');
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      alert('ÄĂ£ gá»­i thĂ´ng tin liĂªn há»‡ thĂ nh cĂ´ng! Ban ÄĂ o táº¡o RMSA & Äan Rin sáº½ liĂªn há»‡ báº¡n trong vĂ²ng 15 phĂºt.');
      setFormData({ fullName: '', phone: '', facebook: '', region: '', segment: '' });
      setFormSubmitted(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-slate-900 selection:text-white pb-16 relative">
      
      {/* Ambient warm & mint diffused lighting (tinh táº¿, thanh lá»‹ch, tá»± nhiĂªn, khĂ´ng giá»‘ng AI) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[480px] bg-gradient-to-b from-teal-50/50 via-emerald-50/20 to-transparent pointer-events-none -z-10 blur-3xl" />
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR: UNIFIED GLASS BAR WITH DISTINGUISHED ZONES                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Zone 1: Brand & Logo Monogram Badge */}
            <div className="flex items-center space-x-3 shrink-0">
              <div 
                onClick={() => setMainViewTab('home')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-1 flex items-center justify-center cursor-pointer select-none shadow-[0_2px_8px_rgba(15,23,42,0.22)] ring-1 ring-slate-800/80 hover:scale-105 transition-all"
                title="RMSA - Running Man Sales Academy"
              >
                <img 
                  src="/images/running_man_logo.png" 
                  alt="Running Man" 
                  className="w-full h-full object-contain filter brightness-110 drop-shadow-xs"
                />
              </div>

              <div className="flex flex-col cursor-pointer select-none" onClick={() => setMainViewTab('home')}>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-black tracking-wider text-slate-900 leading-tight">RUNNING MAN</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200/70 uppercase tracking-wider">PRO</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">SALES ACADEMY</span>
              </div>

              {/* Minimalist Search Pill */}
              <div className="relative hidden 2xl:block w-44 ml-2">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="TĂ¬m chuyĂªn Ä‘á», bĂ i phá»…u..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-full text-slate-700 placeholder-slate-400 border border-slate-200/80 focus:border-indigo-400 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Zone 2: Center Segmented Dock Tabs (Khoang tab cao cáº¥p lá»t lĂ²ng) */}
            <nav className="hidden lg:flex items-center bg-slate-100/80 border border-slate-200/70 p-1 rounded-full shadow-2xs space-x-1 shrink-0">
              <button 
                onClick={() => setMainViewTab('home')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'home' 
                    ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60' 
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title="Trang chá»§ RMSA"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'home' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>Trang chá»§</span>
              </button>

              <button 
                onClick={() => setMainViewTab('courses')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'courses' 
                    ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60' 
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title="KhĂ³a Ä‘Ă o táº¡o & Giáº£ng viĂªn Äan Rin"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'courses' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>KhĂ³a Ä‘Ă o táº¡o</span>
              </button>

              <button 
                onClick={onOpenPracticeTest || onOpenLogin}
                className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all cursor-pointer flex items-center space-x-1.5"
                title="PhĂ²ng thi sĂ¡t háº¡ch trá»±c tuyáº¿n"
              >
                <span>PhĂ²ng thi sĂ¡t háº¡ch</span>
              </button>

              <button 
                onClick={onOpenCheatsheet || onOpenLogin}
                className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all cursor-pointer flex items-center space-x-1.5"
                title="Ká»‹ch báº£n & Cáº©m nang máº«u"
              >
                <span>Ká»‹ch báº£n & Cáº©m nang</span>
              </button>

              <button 
                onClick={() => setMainViewTab('community')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'community' 
                    ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60' 
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title="Cá»™ng Ä‘á»“ng tháº£o luáº­n"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'community' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>Cá»™ng Ä‘á»“ng</span>
              </button>
            </nav>

            {/* Zone 3: Actions & Clear Logout Button */}
            <div className="flex items-center space-x-2 shrink-0">
              {isLoggedIn ? (
                <>
                  {/* Tháº» Ä‘á»‹nh danh NhĂ¢n viĂªn / Há»c viĂªn trang trá»ng Ä‘Ă ng hoĂ ng */}
                  <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 text-xs font-semibold text-slate-800 shrink-0 shadow-2xs transition-all">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200/80 animate-pulse shrink-0"></span>
                    <span className="truncate max-w-[130px] font-bold text-slate-900 tracking-wide">
                      {formatStudentName(currentUser?.name)}
                    </span>
                  </div>

                  {/* NĂºt VĂ o há»c tiáº¿p */}
                  <button
                    onClick={onEnterApp}
                    className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold shadow-[0_3px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_5px_18px_rgba(79,70,229,0.42)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>VĂ o há»c tiáº¿p</span>
                  </button>

                  {/* NĂºt ÄÄƒng xuáº¥t Ä‘Ă ng hoĂ ng, rĂµ rĂ ng */}
                  <button
                    onClick={onLogout || (() => {
                      try { localStorage.removeItem('mapstudy_logged_in'); } catch (e) {}
                      window.location.reload();
                    })}
                    className="px-3 py-1.5 rounded-full bg-rose-50/90 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold text-xs border border-rose-200/80 hover:border-rose-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 active:scale-95"
                    title="ÄÄƒng xuáº¥t khá»i tĂ i khoáº£n"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>ÄÄƒng xuáº¥t</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => onOpenLogin && onOpenLogin('register')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                  >
                    ÄÄƒng kĂ½
                  </button>

                  <button
                    onClick={() => onOpenLogin && onOpenLogin('login')}
                    className="px-4.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold shadow-[0_3px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_5px_18px_rgba(79,70,229,0.42)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <span>ÄÄƒng nháº­p</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CHá»ŒN GIAO DIá»†N HIá»‚N THá» Dá»°A TRĂN TAB:                                    */}
      {/*    A) 'home'     : TRANG CHá»¦ MAPSTUDY (Sidebar trĂ¡i + Banner + TÆ° váº¥n)    */}
      {/*    B) 'courses'  : TRANG GIáº¢NG VIĂN ĐAN RIN & KHĂ“A ÄĂ€O Táº O (áº¢nh thá»© 2)    */}
      {/*    C) 'community': Cá»˜NG Äá»’NG THáº¢O LUáº¬N RUNNING MAN                        */}
      {/* ========================================================================= */}

      {/* ========================================================================= */}
      {/* GIAO DIá»†N B: KHĂ“A ÄĂ€O Táº O & Há»’ SÆ  GIáº¢NG VIĂN ĐAN RIN (Theo Ä‘Ăºng áº£nh 2)     */}
      {/* ========================================================================= */}
      {mainViewTab === 'courses' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Cá»˜T TRĂI: Há»’ SÆ  CHI TIáº¾T GIáº¢NG VIĂN ĐAN RIN */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-6">
              
              {/* Header profile */}
              <div className="space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative shrink-0">
                    <img 
                      src="/images/anh_rin_avatar.jpg" 
                      alt="Äan Rin" 
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase inline-block border border-slate-200/60">
                      Giáº£ng viĂªn thá»±c chiáº¿n
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Äan Rin (Running Man)
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      TrÆ°á»Ÿng Ban ÄĂ o Táº¡o & PhĂ¡t Triá»ƒn NÄƒng Lá»±c BĂ¡n HĂ ng RMSA
                    </p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isLoggedIn ? 'VĂ o há»c ngay trĂªn LMS' : 'ÄÄƒng nháº­p Ä‘á»ƒ vĂ o há»c ngay'}</span>
                </button>
              </div>

              <div className="h-px bg-slate-100" />

              {/* NÄƒng lá»±c & ThĂ nh tĂ­ch huáº¥n luyá»‡n */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>NÄƒng lá»±c & ThĂ nh tĂ­ch huáº¥n luyá»‡n</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed pl-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">â€¢</span>
                    <span>8+ nÄƒm kinh nghiá»‡m trá»±c tiáº¿p phĂ¡t triá»ƒn & váº­n hĂ nh chuá»—i cÄƒn há»™ mini, duplex, studio cho thuĂª Ä‘áº¡t tá»· lá»‡ láº¥p Ä‘áº§y &gt;95%.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">â€¢</span>
                    <span>ÄĂ£ Ä‘Ă o táº¡o hÆ¡n 500+ nhĂ¢n sá»± bĂ¡n hĂ ng, nĂ¢ng tá»· lá»‡ chá»‘t deal thá»±c táº¿ tÄƒng trung bĂ¬nh 40%.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">â€¢</span>
                    <span>ÄĂ³ng gĂ³i bá»™ cáº©m nang Ä‘á»™c quyá»n "Báº» gĂ£y 30 lá»i tá»« chá»‘i giĂ¡ kinh Ä‘iá»ƒn trong cho thuĂª cÄƒn há»™".</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">â€¢</span>
                    <span>XĂ¢y dá»±ng lá»™ trĂ¬nh chuáº©n hĂ³a 8 NhĂ³m NÄƒng Lá»±c MĂ´i Giá»›i Thá»±c Chiáº¿n.</span>
                  </li>
                </ul>
              </div>

              <div className="h-px bg-slate-100" />

              {/* PhÆ°Æ¡ng phĂ¡p Ä‘Ă o táº¡o thá»±c chiáº¿n */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>PhÆ°Æ¡ng phĂ¡p Ä‘Ă o táº¡o thá»±c chiáº¿n</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed pl-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">â€¢</span>
                    <span>PhÆ°Æ¡ng phĂ¡p thá»±c chiáº¿n 100%, nĂ³i khĂ´ng vá»›i lĂ½ thuyáº¿t sĂ¡o rá»—ng. MĂ´ phá»ng trá»±c tiáº¿p tĂ¬nh huá»‘ng Ä‘á»‘i Ä‘Ă¡p khĂ¡ch hĂ ng thá»±c táº¿.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">â€¢</span>
                    <span>SĂ¡t háº¡ch nÄƒng lá»±c tá»± Ä‘á»™ng theo chuáº©n phĂ²ng thi áº£o, pháº£n xáº¡ báº¥m giá» tá»«ng giĂ¢y, Ä‘áº¡t chuáº©n â‰¥ 80% cáº¥p chá»©ng nháº­n hoĂ n thĂ nh.</span>
                  </li>
                </ul>
              </div>

              <div className="h-px bg-slate-100" />

              {/* KĂªnh há»— trá»£ */}
              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  KĂªnh há»— trá»£ nhĂ¢n viĂªn & Doanh nghiá»‡p
                </span>
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Hotline: <strong>0909.xxx.xxx</strong></span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Email: <strong>daotao@runningman.vn</strong></span>
                </p>
              </div>

            </div>

            {/* Cá»˜T PHáº¢I: TABS VĂ€ DANH SĂCH KHĂ“A Há»ŒC / Ká»CH Báº¢N MáºªU */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Header Tabs: ChÆ°Æ¡ng trĂ¬nh Ä‘Ă o táº¡o vs Ká»‹ch báº£n & Cáº©m nang */}
              <div className="flex border-b border-slate-200 space-x-8 text-xs font-bold">
                <button
                  onClick={() => setCourseTabSub('program')}
                  className={`pb-3 border-b-2 cursor-pointer transition-all ${
                    courseTabSub === 'program'
                      ? 'border-slate-900 text-slate-950 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ChÆ°Æ¡ng trĂ¬nh Ä‘Ă o táº¡o (8 nhĂ³m nÄƒng lá»±c thá»±c chiáº¿n)
                </button>

                <button
                  onClick={() => setCourseTabSub('scripts')}
                  className={`pb-3 border-b-2 cursor-pointer transition-all ${
                    courseTabSub === 'scripts'
                      ? 'border-slate-900 text-slate-950 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ká»‹ch báº£n & Cáº©m nang máº«u
                </button>
              </div>

              {/* Category Pills Filter (TĂ¡ch riĂªng tá»«ng chá»§ Ä‘á») */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {courseCategories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCourseCategory(cat.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeCourseCategory === cat.key
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)] border border-blue-400/40 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0'
                        : 'bg-white hover:bg-indigo-50/70 hover:border-indigo-200 text-slate-700 border border-slate-200/90 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Course Cards Grid (2 hoáº·c 3 cá»™t theo áº£nh 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail with stage badge */}
                      <div className="relative aspect-video overflow-hidden bg-slate-900">
                        <img 
                          src={course.thumb} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold tracking-wide shadow-xs border border-white/20">
                          {course.stageBadge}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.duration}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold">
                          <span className="text-slate-900 font-bold">{course.code}</span>
                          <span>â€¢</span>
                          <span>{course.quizCount}</span>
                          <span>â€¢</span>
                          <span>Chuáº©n: {course.passingScore}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {course.title}
                        </h4>

                        <p className="text-[11px] text-slate-400">
                          {course.instructor}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="flex items-center text-rose-500 font-semibold text-[11px]">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 mr-1" />
                        {course.reactions}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 text-blue-700 group-hover:text-white font-bold text-[11px] border border-blue-200/60 group-hover:border-transparent transition-all shadow-xs group-hover:shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
                        VĂ o há»c
                        <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIá»†N A: TRANG CHá»¦ MAPSTUDY Tá»”NG QUAN (Sidebar TrĂ¡i + Slider + TÆ° Váº¥n) */}
      {/* ========================================================================= */}
      {mainViewTab === 'home' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-5">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* COLUMN 1: MODERN FRAMELESS SIDEBAR (Thanh thoĂ¡t, khĂ´ng Ä‘Ă³ng há»™p, chuáº©n UI/UX quá»‘c táº¿) */}
            <aside className="w-full lg:w-60 xl:w-64 shrink-0 lg:sticky lg:top-20 space-y-4">
              
              {/* 1. Top Action CTA: VĂ o há»c ngay */}
              <button 
                onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                className="w-full flex items-center justify-center space-x-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-sm tracking-wide shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.42)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>{isLoggedIn ? 'VĂ o há»c ngay' : 'ÄÄƒng nháº­p LMS'}</span>
              </button>

              {/* 2. Main Navigation List (Frameless soft items) */}
              <div className="space-y-1">
                <button 
                  onClick={() => setMainViewTab('courses')}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticCourseIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">KhĂ³a há»c & Giáº£ng viĂªn</span>
                </button>

                <button 
                  onClick={onOpenPracticeTest || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticExamIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Thi online</span>
                </button>

                <button 
                  onClick={onOpenCheatsheet || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticArenaIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Äáº¥u trÆ°á»ng lĂ½ thuyáº¿t</span>
                </button>

                <button 
                  onClick={onOpenCheatsheet || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticBookIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">SĂ¡ch Map / Sá»• tay RMSA</span>
                </button>

                <button 
                  onClick={() => {
                    setMainViewTab('courses');
                    setActiveCourseCategory('materials');
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticFolderIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">TĂ i liá»‡u</span>
                </button>

                <button 
                  onClick={() => setMainViewTab('community')}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticForumIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Diá»…n Ä‘Ă n</span>
                </button>

                <button 
                  onClick={() => setMainViewTab('community')}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticCommunityIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Cá»™ng Ä‘á»“ng Running Man</span>
                </button>
              </div>

              <div className="h-px bg-slate-200/60 my-2" />

              {/* 3. Section: LiĂªn káº¿t */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 mb-1.5">
                  LiĂªn káº¿t
                </span>

                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors text-xs font-semibold text-slate-600 group"
                >
                  <RealisticFacebookIcon className="w-5 h-5 shrink-0" />
                  <span className="group-hover:text-[#1877f2] transition-colors truncate">Facebook Running Man</span>
                </a>

                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors text-xs font-semibold text-slate-600 group"
                >
                  <RealisticYoutubeIcon className="w-5 h-5 shrink-0" />
                  <span className="group-hover:text-[#ff0000] transition-colors truncate">Tháº§y Äan Rin - CÄƒn Há»™</span>
                </a>

                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors text-xs font-semibold text-slate-600 group"
                >
                  <RealisticTiktokIcon className="w-5 h-5 shrink-0" />
                  <span className="group-hover:text-slate-900 transition-colors truncate">Tiktok Running Man</span>
                </a>
              </div>
            </aside>

            {/* COLUMN 2: MAIN CONTENT (Seamless, breathable, frameless design) */}
            <main className="flex-1 min-w-0 space-y-6">
              
              {/* 1. HERO BANNER CAROUSEL (Cá»”NG ÄĂ€O Táº O Ná»˜I Bá»˜ NHĂ‚N VIĂN RUNNING MAN) */}
              <div 
                onMouseEnter={() => setIsBannerHovered(true)}
                onMouseLeave={() => setIsBannerHovered(false)}
                className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.06)] min-h-[310px] sm:min-h-[340px] flex flex-col justify-between p-6 sm:p-8 lg:p-9 text-slate-900 transition-all duration-500 group/banner"
                style={{
                  background: currentBanner.bgGradient
                }}
              >
                {/* MÅ©i tĂªn chuyá»ƒn trang bĂªn trĂ¡i (Quay vĂ²ng tá»« trang 1 sang trang 3 an toĂ n) */}
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 shadow-md hover:shadow-xl border border-slate-200/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                  title="Chuyá»ƒn vá» trang trÆ°á»›c (Trang 1 <-> Trang 3)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* MÅ©i tĂªn chuyá»ƒn trang bĂªn pháº£i (Quay vĂ²ng tá»« trang 3 sang trang 1 an toĂ n) */}
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 shadow-md hover:shadow-xl border border-slate-200/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                  title="Chuyá»ƒn sang trang tiáº¿p theo (Trang 3 <-> Trang 1)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Soft ambient lighting spots */}
                <div className={`absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 ${currentBanner.spotlightColor} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />
                <div className="absolute left-1/3 bottom-0 -mb-12 w-80 h-80 bg-indigo-100/25 rounded-full blur-3xl pointer-events-none" />

                {/* Top Badge & Date Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 mb-3 px-1 sm:px-3">
                  <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-bold tracking-wide ${currentBanner.tagColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentBanner.dotColor} animate-pulse`}></span>
                    <span>{currentBanner.tag}</span>
                  </div>

                  <span className="text-xs text-slate-500 font-semibold bg-white/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                    {currentBanner.date}
                  </span>
                </div>

                {/* Content Grid: Left Info & Right Visual (Äá»˜NG HOĂ€N TOĂ€N THEO SLIDE) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center my-2 relative z-10 px-1 sm:px-3">
                  
                  {/* Cá»™t trĂ¡i: TiĂªu Ä‘á» typography Ä‘á»™ng */}
                  <div className="md:col-span-7 space-y-3.5 text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-[31px] font-black tracking-tight leading-[1.22] text-slate-950 uppercase">
                      {currentBanner.titleTop} <span className="text-[#0d5cb6]">{currentBanner.titleHighlight}</span><br />
                      <span className="text-slate-800 font-extrabold">{currentBanner.titleBottom}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
                      {currentBanner.subtitle}
                    </p>

                    {/* Huy hiá»‡u Ä‘áº·c quyá»n ná»™i bá»™ */}
                    <div className="pt-1 flex flex-wrap items-center gap-2.5">
                      <div className="px-4 py-2 rounded-full bg-slate-900 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>{currentBanner.badgeTitle}</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          if (currentBanner.actionType === 'playbook') {
                            if (onOpenCheatsheet) onOpenCheatsheet();
                            else if (onOpenLogin) onOpenLogin();
                          } else if (currentBanner.actionType === 'exam') {
                            if (onOpenPracticeTest) onOpenPracticeTest();
                            else if (onOpenLogin) onOpenLogin();
                          } else {
                            if (isLoggedIn) onEnterApp();
                            else onOpenLogin();
                          }
                        }}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-2"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>{currentBanner.primaryBtnText}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (currentBanner.actionType === 'exam') {
                            if (onOpenLeaderboard) onOpenLeaderboard();
                            else setMainViewTab('courses');
                          } else {
                            setMainViewTab('courses');
                          }
                        }}
                        className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-2xs transition-all cursor-pointer hover:border-slate-300"
                      >
                        {currentBanner.secondaryBtnText}
                      </button>
                    </div>
                  </div>

                  {/* Cá»™t pháº£i: THáºº MINH Há»ŒA ÄA Dáº NG THEO Tá»ªNG SLIDE (KhĂ¡c biá»‡t 100%) */}
                  <div className="md:col-span-5 relative">
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-md p-2.5 space-y-2.5 max-w-[340px] ml-auto">
                      
                      {/* áº¢nh minh há»a theo slide */}
                      <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                        <img 
                          src={currentBanner.cardImg} 
                          alt={currentBanner.cardTitle} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-semibold text-white">
                          {currentBanner.cardTitle}
                        </div>
                        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-slate-900/90 text-white font-bold text-[11px] shadow-xs">
                          {currentBanner.cardTag}
                        </div>
                      </div>

                      {/* Tháº» phá»¥ chi tiáº¿t theo tá»«ng slide */}
                      <div 
                        onClick={() => {
                          if (currentBanner.actionType === 'playbook') {
                            if (onOpenCheatsheet) onOpenCheatsheet();
                            else onOpenLogin();
                          } else if (currentBanner.actionType === 'exam') {
                            if (onOpenPracticeTest) onOpenPracticeTest();
                            else onOpenLogin();
                          } else {
                            setMainViewTab('courses');
                          }
                        }}
                        className="flex items-center space-x-3 bg-slate-50/80 hover:bg-slate-100/90 p-2 rounded-xl border border-slate-200/80 transition-colors cursor-pointer group"
                      >
                        {currentBanner.visualType === 'apartment' ? (
                          <img 
                            src="/images/anh_rin_avatar.jpg" 
                            alt="Äan Rin" 
                            className="w-10 h-10 rounded-lg object-cover border border-blue-400/80 shrink-0"
                          />
                        ) : currentBanner.visualType === 'playbook' ? (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-600">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 text-purple-600">
                            <Award className="w-5 h-5" />
                          </div>
                        )}

                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <span className="text-[9px] font-bold text-blue-600 uppercase">
                              {currentBanner.mentorRole}
                            </span>
                            <CheckCircle2 className="w-3 h-3 text-sky-600" />
                          </div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {currentBanner.mentorName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {currentBanner.mentorDesc}
                          </p>
                        </div>

                        <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold shrink-0">
                          RMSA â˜…
                        </span>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Carousel Navigation Dots + Page Counter */}
                <div className="flex items-center justify-center space-x-3 pt-2 relative z-10">
                  <div className="flex items-center space-x-2">
                    {heroBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          safeSlide === idx ? 'w-8 bg-slate-900' : 'w-2 bg-slate-400/50 hover:bg-slate-600'
                        }`}
                        title={`Xem trang ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    0{safeSlide + 1} / 0{heroBanners.length}
                  </span>
                </div>
              </div>

              {/* 2. "LIĂN Há»† TÆ¯ Váº¤N" FORM (Seamless Surface) */}
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(15,23,42,0.02)] border border-slate-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      LiĂªn há»‡ tÆ° váº¥n
                    </h2>
                    <p className="text-xs text-slate-500">
                      ÄÄƒng kĂ½ nháº­n lá»™ trĂ¬nh Ä‘Ă o táº¡o sale cÄƒn há»™ hoáº·c liĂªn há»‡ tÆ° váº¥n cĂ¹ng Äan Rin
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80 hidden sm:inline-block">
                    Pháº£n há»“i trong 15 phĂºt
                  </span>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="* Há» vĂ  tĂªn"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="* Sá»‘ Ä‘iá»‡n thoáº¡i"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="Link Facebook / Zalo cĂ¡ nhĂ¢n"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-700 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">* Khu vá»±c hoáº¡t Ä‘á»™ng / Chi nhĂ¡nh</option>
                        <option value="binh_thanh">Khu vá»±c BĂ¬nh Tháº¡nh - PhĂº Nhuáº­n</option>
                        <option value="quan_1_3">Khu vá»±c Quáº­n 1 - Quáº­n 3 - Quáº­n 10</option>
                        <option value="thu_duc">Khu vá»±c TP. Thá»§ Äá»©c (Tháº£o Äiá»n, An PhĂº)</option>
                        <option value="go_vap">Khu vá»±c GĂ² Váº¥p - TĂ¢n BĂ¬nh</option>
                        <option value="quan_7">Khu vá»±c Quáº­n 7 - Nam SĂ i GĂ²n</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={formData.segment}
                        onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-700 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">* ChuyĂªn Ä‘á» / PhĂ¢n khĂºc quan tĂ¢m</option>
                        <option value="nhom_1">NhĂ³m 1 â€” Hiá»ƒu sáº£n pháº©m vĂ  thá»‹ trÆ°á»ng</option>
                        <option value="nhom_2">NhĂ³m 2 â€” Táº¡o nguá»“n hĂ ng vĂ  quáº£n lĂ½ giá» cÄƒn há»™</option>
                        <option value="nhom_3">NhĂ³m 3 â€” TĂ¬m kiáº¿m khĂ¡ch hĂ ng vĂ  khai thĂ¡c nhu cáº§u</option>
                        <option value="nhom_4">NhĂ³m 4 â€” TÆ° váº¥n vĂ  dáº«n khĂ¡ch xem cÄƒn há»™</option>
                        <option value="nhom_5">NhĂ³m 5 â€” Xá»­ lĂ½ tá»« chá»‘i, Ä‘Ă m phĂ¡n vĂ  chá»‘t giao dá»‹ch</option>
                        <option value="nhom_6">NhĂ³m 6 â€” CRM, KPI vĂ  quáº£n lĂ½ phá»…u bĂ¡n hĂ ng</option>
                        <option value="nhom_7">NhĂ³m 7 â€” Ká»· luáº­t nghá» nghiá»‡p vĂ  dá»‹ch vá»¥ khĂ¡ch hĂ ng</option>
                        <option value="nhom_8">NhĂ³m 8 â€” Ká»¹ nÄƒng thá»±c táº¿ ngoĂ i thá»‹ trÆ°á»ng</option>
                        <option value="all_8">Trá»n gĂ³i 8 ChuyĂªn Ä‘á» Ká»¹ nÄƒng Sale CÄƒn Há»™</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                      ThĂ´ng tin cá»§a báº¡n Ä‘Æ°á»£c báº£o máº­t tuyá»‡t Ä‘á»‘i theo chĂ­nh sĂ¡ch Ä‘Ă o táº¡o Running Man.
                    </p>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gá»­i thĂ´ng tin tÆ° váº¥n</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 3. HOT KEYWORDS ROW (Seamless, no heavy box) */}
              <div className="flex flex-wrap items-center gap-2 py-1 px-1">
                <span className="text-xs font-bold text-slate-500 mr-2 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1" />
                  TĂ¬m kiáº¿m ná»•i báº­t:
                </span>
                {hotKeywords.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item.query);
                      setMainViewTab('courses');
                    }}
                    className="px-3 py-1 rounded-full bg-slate-100/90 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 text-xs font-medium transition-all cursor-pointer border border-transparent shadow-2xs"
                  >
                    #{item.title}
                  </button>
                ))}
              </div>

              {/* 4. DĂ€N GIáº¢NG VIĂN (Frameless Section) */}
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Äá»™i ngÅ© Giáº£ng viĂªn & Huáº¥n luyá»‡n viĂªn
                    </h2>
                    <p className="text-xs text-slate-500">
                      ÄÆ°á»£c dáº«n dáº¯t bá»Ÿi Äan Rin cĂ¹ng ban váº­n hĂ nh nguá»“n hĂ ng tháº­t chuá»—i cÄƒn há»™ Running Man
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {teachersList.map((teacher) => (
                    <div
                      key={teacher.id}
                      onClick={() => setSelectedTeacherModal(teacher)}
                      className="rounded-2xl border border-slate-200/60 hover:border-blue-400/60 p-4 bg-white hover:bg-slate-50/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-xs group-hover:scale-105 transition-transform duration-300">
                          <img 
                            src={teacher.avatar} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                        </div>

                        <div className="text-center space-y-1">
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block border border-slate-200/60">
                            {teacher.badge}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {teacher.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {teacher.title}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 mt-3">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-1" />
                          {teacher.rating}
                        </span>
                        <span className="text-slate-800 font-semibold group-hover:text-blue-600 group-hover:underline flex items-center transition-colors">
                          Xem há»“ sÆ¡
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. 8 NHĂ“M NÄ‚NG Lá»°C Cá»T LĂ•I (FRAMELESS, AIRY, SEAMLESS LUXURY DESIGN) */}
              <section className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold tracking-wider uppercase border border-blue-200/60">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>Khung NÄƒng Lá»±c Cá»‘t LĂµi RMSA</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Lá»™ trĂ¬nh chuáº©n hĂ³a 8 NhĂ³m NÄƒng Lá»±c MĂ´i Giá»›i
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal">
                      Há»c Ä‘Ăºng bĂ i phá»…u â€¢ Ra thá»±c chiáº¿n ngay â€¢ ÄĂ³ng gĂ³i tá»« 8+ nÄƒm kinh nghiá»‡m thá»±c Ä‘á»‹a cá»§a Huáº¥n luyá»‡n viĂªn Äan Rin
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden sm:inline-block">
                    Cáº­p nháº­t liĂªn tá»¥c 2026
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competencyRoadmap.map((item) => (
                    <div
                      key={item.groupNum}
                      onClick={() => {
                        setMainViewTab('courses');
                        setActiveCourseCategory(item.filterKey || `nhom_${item.groupNum}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-5 rounded-2xl bg-white hover:bg-white border border-slate-200/60 hover:border-blue-500/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_-6px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Top Row: Index Badge & Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all shadow-2xs">
                            {item.groupNum < 10 ? `0${item.groupNum}` : item.groupNum}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            ChuyĂªn Ä‘á» {item.groupNum}
                          </span>
                        </div>

                        {item.status === 'active' ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>ÄĂ£ Ä‘Ă³ng gĂ³i</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200/70 shrink-0">
                            <span>Cáº­p nháº­t tuáº§n nĂ y</span>
                          </span>
                        )}
                      </div>

                      {/* Middle: Full Title (NO TRUNCATION!) & Objective */}
                      <div className="space-y-1.5 flex-1 py-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          {item.objective}
                        </p>
                      </div>

                      {/* Bottom Footer: Meta & Action Link */}
                      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">{item.lessonsCount}</span>
                        <span className="font-bold text-slate-600 group-hover:text-blue-600 flex items-center space-x-1 transition-colors">
                          <span>VĂ o há»c chuyĂªn Ä‘á»</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Cáº¨M NANG & KINH NGHIá»†M (FRAMELESS SECTION) */}
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Cáº©m nang & Kinh nghiá»‡m thá»±c chiáº¿n
                    </h2>
                    <p className="text-xs text-slate-500">
                      BĂ­ quyáº¿t xá»­ lĂ½ tĂ¬nh huá»‘ng thá»±c Ä‘á»‹a vĂ  ká»‹ch báº£n Ä‘á»‘i Ä‘Ă¡p Ä‘á»™c quyá»n
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articlesList.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setMainViewTab('courses')}
                      className="p-4 rounded-2xl border border-slate-200/60 hover:border-blue-400/60 bg-white hover:bg-slate-50/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex gap-4 group"
                    >
                      <img 
                        src={art.thumb} 
                        alt={art.title} 
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-200/80 group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60 inline-block">
                          {art.tag}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-1">
                          <span>{art.readTime}</span>
                          <span>â€¢</span>
                          <span>{art.views} lÆ°á»£t xem</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </main>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIá»†N C: Cá»˜NG Äá»’NG THáº¢O LUáº¬N RUNNING MAN                              */}
      {/* ========================================================================= */}
      {mainViewTab === 'community' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Cá»™ng Ä‘á»“ng MĂ´i Giá»›i Thá»±c Chiáº¿n Running Man
                  </h2>
                  <p className="text-xs text-slate-500">
                    NÆ¡i giao lÆ°u, há»i Ä‘Ă¡p tĂ¬nh huá»‘ng thá»±c Ä‘á»‹a vĂ  vinh danh káº¿t quáº£ bĂ¡n hĂ ng má»—i ngĂ y
                  </p>
                </div>
                <button
                  onClick={isLoggedIn ? () => alert('TĂ­nh nÄƒng Ä‘Äƒng bĂ i tháº£o luáº­n ná»™i bá»™!') : onOpenLogin}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.42)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  + Viáº¿t bĂ i chia sáº»
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200/80 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.avatar} 
                        alt={post.author} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{post.author}</p>
                        <span className="text-[10px] text-slate-400">{post.time}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                      {post.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={onOpenLogin}
                        className="flex items-center space-x-1.5 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{post.likes} YĂªu thĂ­ch</span>
                      </button>
                      <button 
                        onClick={onOpenLogin}
                        className="flex items-center space-x-1.5 hover:text-sky-600 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.comments} BĂ¬nh luáº­n</span>
                      </button>
                    </div>
                    <button 
                      onClick={onOpenLogin}
                      className="hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FOOTER 4 Cá»˜T CHUáº¨N                                                     */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-8">
        <footer className="bg-white rounded-2xl p-8 shadow-xs border border-slate-200/80 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-0.5 overflow-hidden">
                  <img 
                    src="/images/running_man_logo.png" 
                    alt="Running Man" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs font-black tracking-wider text-slate-900">RMSA â€¢ RUNNING MAN</span>
                  <p className="text-[10px] text-slate-400">Running Man Sales Academy</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Há»c viá»‡n Ä‘Ă o táº¡o nghiá»‡p vá»¥ mĂ´i giá»›i vĂ  cho thuĂª cÄƒn há»™ thá»±c chiáº¿n Running Man. Äá»‹nh vá»‹ sáº£n pháº©m tháº­t - Dáº«n lá»‘i tÆ° duy thá»±c chiáº¿n.
              </p>
              <p className="text-xs font-bold text-blue-600">
                "EVERY JOURNEY LEADS HOME"
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                KhĂ³a Ä‘Ă o táº¡o
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>NhĂ³m 1: Sáº£n pháº©m & GiĂ¡ thá»‹ trÆ°á»ng</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>NhĂ³m 2: Nguá»“n hĂ ng & Giá» cÄƒn há»™</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>NhĂ³m 3: ÄÄƒng tin & Khai thĂ¡c nhu cáº§u</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>NhĂ³m 4: Telesale 30s & Dáº«n khĂ¡ch</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>NhĂ³m 5: Báº» gĂ£y tá»« chá»‘i giĂ¡ & Chá»‘t cá»c</li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Há»— trá»£ há»c viĂªn
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onOpenCheatsheet || onOpenLogin}>Sá»• tay ká»‹ch báº£n bá» tĂºi (PDF)</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onOpenPracticeTest || onOpenLogin}>Ká»³ thi sĂ¡t háº¡ch trá»±c tuyáº¿n</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onOpenCertificate || onOpenLogin}>Tra cá»©u chá»©ng chá»‰ Ä‘iá»‡n tá»­</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onOpenLeaderboard || onOpenLogin}>Báº£ng xáº¿p háº¡ng Best Seller</li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Ban ÄĂ o Táº¡o & Tuyá»ƒn Dá»¥ng
              </h4>
              <p className="text-slate-600">
                Huáº¥n luyá»‡n viĂªn trÆ°á»Ÿng: <strong className="text-slate-800">Äan Rin</strong>
              </p>
              <p className="text-slate-600">
                Hotline tuyá»ƒn dá»¥ng: <span className="font-bold text-slate-900">0909.xxx.xxx</span>
              </p>
              <p className="text-slate-600">
                Trá»¥ sá»Ÿ: TP. Há»“ ChĂ­ Minh
              </p>
              <div className="pt-2">
                <button
                  onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  {isLoggedIn ? 'VĂ o LMS ÄĂ o Táº¡o' : 'ÄÄƒng nháº­p Cá»•ng Ná»™i Bá»™'}
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Â© 2026 RMSA (Running Man Sales Academy) â€¢ Giao diá»‡n chuáº©n MapStudy â€¢ Báº£n quyá»n thuá»™c vá» Äan Rin & Running Man.
          </div>
        </footer>
      </div>



      {/* ========================================================================= */}
      {/* 5. MODAL Há»’ SÆ  GIáº¢NG VIĂN                                                 */}
      {/* ========================================================================= */}
      {selectedTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setSelectedTeacherModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <img 
                src={selectedTeacherModal.avatar} 
                alt={selectedTeacherModal.name} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block border border-slate-200/60">
                  {selectedTeacherModal.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedTeacherModal.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedTeacherModal.role}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ThĂ nh tá»±u & Kinh nghiá»‡m thá»±c chiáº¿n:
              </h4>
              <ul className="space-y-2">
                {selectedTeacherModal.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedTeacherModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                ÄĂ³ng
              </button>
              <button
                onClick={() => {
                  setSelectedTeacherModal(null);
                  setMainViewTab('courses');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all"
              >
                Xem cĂ¡c khĂ³a há»c cá»§a Äan Rin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
