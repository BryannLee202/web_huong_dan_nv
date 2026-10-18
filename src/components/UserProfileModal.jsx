import React, { useState, useRef } from 'react';
import { 
  X, Camera, Upload, ShieldCheck, User, Phone, MapPin, 
  Award, Flame, Trophy, Sparkles, KeyRound, Check, AlertCircle, 
  Briefcase, Tag, QrCode, Smartphone, Trash2
} from 'lucide-react';
import api from '../services/api';

const PRESET_AVATARS = [
  { id: 'mascot-chibi', label: 'Rin Chibi 3D', url: '/mascot-running-rin-chibi.jpg' },
  { id: 'mascot-pro', label: 'Rin Chiến Binh', url: '/mascot-running-rin.jpg' },
  { id: 'coach-rin', label: 'HLV Đan Rin', url: '/images/anh_rin_avatar.jpg' },
  { id: 'logo-crest', label: 'RMSA Crest', url: '/images/running_man_logo.png' }
];

const SKILL_SUGGESTIONS = [
  'Tư vấn Duplex/Studio',
  'Đàm phán cọc thực chiến',
  'Xử lý từ chối giá cao',
  'Dẫn khách thực địa',
  'Soi pháp lý & Quy hoạch',
  'Chốt deal trong ngày',
  'Chăm sóc khách VIP',
  'Telesale phản xạ nhanh'
];

const BRANCH_OPTIONS = [
  'RMSA - Bình Thạnh',
  'RMSA - Quận 1 (Bến Nghé)',
  'RMSA - Quận 7 (Phú Mỹ Hưng)',
  'RMSA - TP. Thủ Đức (Thảo Điền)',
  'RMSA - Phú Nhuận',
  'RMSA - Hội Sở Đào Tạo'
];

function parseUserSkills(rawSkills) {
  if (Array.isArray(rawSkills)) return rawSkills;
  if (typeof rawSkills === 'string' && rawSkills.trim()) {
    try {
      const parsed = JSON.parse(rawSkills);
      return Array.isArray(parsed) ? parsed : rawSkills.split(',').map(s => s.trim());
    } catch {
      return rawSkills.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return ['Tư vấn Duplex/Studio', 'Dẫn khách thực địa', 'Đàm phán cọc thực chiến'];
}

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  completedLessons = {},
  courses = []
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'badge' | 'security'
  
  // Khởi tạo state trực tiếp từ currentUser
  const [fullName, setFullName] = useState(() => currentUser?.fullName || currentUser?.name || '');
  const [phone, setPhone] = useState(() => currentUser?.phone || '');
  const [branch, setBranch] = useState(() => currentUser?.branch || 'RMSA - Bình Thạnh');
  const [title, setTitle] = useState(() => currentUser?.title || (currentUser?.role === 'admin' ? 'Quản Trị Viên & HLV Đào Tạo' : 'Chuyên Viên Tư Vấn Thực Chiến'));
  const [bio, setBio] = useState(() => currentUser?.bio || 'Chiến binh Running Man Sales Academy - Chốt deal thực chiến.');
  const [skills, setSkills] = useState(() => parseUserSkills(currentUser?.skills));
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(() => currentUser?.avatarUrl || currentUser?.avatar_url || '');
  const [coverTheme, setCoverTheme] = useState('navy'); // 'navy' | 'slate' | 'emerald' | 'amber'

  // Điều chỉnh state an toàn khi currentUser thay đổi
  const [prevUserId, setPrevUserId] = useState(() => currentUser?.id);
  if (currentUser && currentUser.id !== prevUserId) {
    setPrevUserId(currentUser.id);
    setFullName(currentUser.fullName || currentUser.name || '');
    setPhone(currentUser.phone || '');
    setBranch(currentUser.branch || 'RMSA - Bình Thạnh');
    setTitle(currentUser.title || (currentUser.role === 'admin' ? 'Quản Trị Viên & HLV Đào Tạo' : 'Chuyên Viên Tư Vấn Thực Chiến'));
    setBio(currentUser.bio || 'Chiến binh Running Man Sales Academy - Chốt deal thực chiến.');
    setSkills(parseUserSkills(currentUser.skills));
    setAvatarUrl(currentUser.avatarUrl || currentUser.avatar_url || '');
  }

  // Trạng thái đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityStatus, setSecurityStatus] = useState({ loading: false, msg: '', type: '' });

  // Trạng thái lưu hồ sơ
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ msg: '', type: '' });

  // Upload refs
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  if (!isOpen || !currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const initialChar = (fullName || currentUser.name || 'U').charAt(0).toUpperCase();

  // Thống kê thành tích
  const passedLessonsCount = Object.values(completedLessons).filter(l => l?.passed).length;
  const totalCourses = courses.length || 8;
  const progressPercent = Math.round((passedLessonsCount / totalCourses) * 100);

  // Cấp bậc học viện
  let tierLevel = 'Học Viên Tập Sự';
  let tierColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800';
  if (passedLessonsCount >= 8) {
    tierLevel = 'Master Chốt Deal';
    tierColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700';
  } else if (passedLessonsCount >= 5) {
    tierLevel = 'Cao Thủ Đàm Phán';
    tierColor = 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800';
  } else if (passedLessonsCount >= 3) {
    tierLevel = 'Chiến Binh Thực Chiến';
    tierColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800';
  }

  // Xử lý nén ảnh trên trình duyệt bằng Canvas (giảm dung lượng, load siêu nhanh)
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 480;
          let width = img.width;
          let height = img.height;

          // Crop vuông tâm ảnh
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxDim, maxDim);

          // Xuất ảnh JPEG chất lượng 0.88 (~35KB)
          const base64 = canvas.toDataURL('image/jpeg', 0.88);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload và đồng bộ Avatar tức thì
  const handleAvatarFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (.jpg, .png, .webp)');
      return;
    }

    setIsUploadingAvatar(true);
    setFeedback({ msg: 'Đang tối ưu & nén ảnh đại diện...', type: 'info' });

    try {
      const compressedBase64 = await processImageFile(file);
      setAvatarUrl(compressedBase64); // Live Preview ngay tức khắc

      // Gửi lên server backend SQLite
      const res = await api.profile.uploadAvatar({
        imageBase64: compressedBase64,
        userId: currentUser.id
      });

      if (res && res.success) {
        const finalUrl = res.avatarUrl || compressedBase64;
        setAvatarUrl(finalUrl);

        // Cập nhật state hệ thống và localStorage
        const updated = {
          ...currentUser,
          avatarUrl: finalUrl,
          avatar_url: finalUrl
        };
        if (onUpdateUser) onUpdateUser(updated);

        setFeedback({ msg: 'Cập nhật ảnh đại diện thành công!', type: 'success' });
        setIsAvatarPickerOpen(false);
      } else {
        setFeedback({ msg: res?.message || 'Không thể lưu ảnh đại diện lên máy chủ', type: 'error' });
      }
    } catch (err) {
      console.error('Lỗi upload avatar:', err);
      setFeedback({ msg: 'Lỗi tải ảnh đại diện. Vui lòng thử lại!', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = '';
    }
  };

  // Chọn avatar Preset
  const handleSelectPresetAvatar = async (presetUrl) => {
    setIsUploadingAvatar(true);
    setAvatarUrl(presetUrl);

    try {
      const res = await api.profile.update({
        userId: currentUser.id,
        avatarUrl: presetUrl
      });

      if (res && res.success) {
        const updated = {
          ...currentUser,
          avatarUrl: presetUrl,
          avatar_url: presetUrl
        };
        if (onUpdateUser) onUpdateUser(updated);
        setFeedback({ msg: 'Đã đổi ảnh đại diện mascot Running Rin!', type: 'success' });
        setIsAvatarPickerOpen(false);
      }
    } catch {
      setFeedback({ msg: 'Lỗi đổi ảnh đại diện', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Xóa ảnh đại diện (trở về chữ cái)
  const handleRemoveAvatar = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh đại diện và quay về chữ cái mặc định?')) return;
    setIsUploadingAvatar(true);
    setAvatarUrl('');

    try {
      const res = await api.profile.update({
        userId: currentUser.id,
        avatarUrl: ''
      });

      if (res && res.success) {
        const updated = {
          ...currentUser,
          avatarUrl: '',
          avatar_url: ''
        };
        if (onUpdateUser) onUpdateUser(updated);
        setFeedback({ msg: 'Đã xóa ảnh đại diện.', type: 'info' });
        setIsAvatarPickerOpen(false);
      }
    } catch {
      setFeedback({ msg: 'Lỗi xóa ảnh đại diện', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Toggle kỹ năng
  const handleToggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  // Thêm kỹ năng tùy chỉnh
  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setCustomSkillInput('');
    }
  };

  // Lưu thông tin hồ sơ
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFeedback({ msg: 'Vui lòng nhập họ và tên của bạn', type: 'error' });
      return;
    }

    setIsSaving(true);
    setFeedback({ msg: 'Đang lưu thông tin hồ sơ vào cơ sở dữ liệu SQLite...', type: 'info' });

    try {
      const res = await api.profile.update({
        userId: currentUser.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        branch,
        title: title.trim(),
        bio: bio.trim(),
        skills: JSON.stringify(skills),
        avatarUrl
      });

      if (res && res.success && res.user) {
        const updated = {
          ...currentUser,
          ...res.user,
          name: res.user.fullName || res.user.name,
          fullName: res.user.fullName,
          avatarUrl: res.user.avatarUrl,
          skills
        };
        if (onUpdateUser) onUpdateUser(updated);
        setFeedback({ msg: 'Lưu và đồng bộ hồ sơ cá nhân thành công!', type: 'success' });
      } else {
        setFeedback({ msg: res?.message || 'Lỗi khi lưu thông tin', type: 'error' });
      }
    } catch (err) {
      setFeedback({ msg: err.message || 'Lỗi kết nối máy chủ', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setSecurityStatus({ loading: false, msg: 'Vui lòng nhập mật khẩu hiện tại', type: 'error' });
      return;
    }
    if (newPassword.length < 4) {
      setSecurityStatus({ loading: false, msg: 'Mật khẩu mới phải có ít nhất 4 ký tự', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityStatus({ loading: false, msg: 'Xác nhận mật khẩu mới không khớp', type: 'error' });
      return;
    }

    setSecurityStatus({ loading: true, msg: 'Đang xử lý đổi mật khẩu...', type: 'info' });

    try {
      const res = await api.profile.changePassword({
        userId: currentUser.id,
        currentPassword,
        newPassword
      });

      if (res && res.success) {
        setSecurityStatus({ loading: false, msg: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới.', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSecurityStatus({ loading: false, msg: res?.message || 'Không thể đổi mật khẩu', type: 'error' });
      }
    } catch (err) {
      setSecurityStatus({ loading: false, msg: err.message || 'Lỗi kết nối máy chủ', type: 'error' });
    }
  };

  // Preset Theme Background cho Cover Banner
  const coverGradients = {
    navy: 'from-slate-900 via-blue-950 to-indigo-950',
    slate: 'from-slate-950 via-zinc-900 to-slate-900',
    emerald: 'from-slate-950 via-emerald-950 to-teal-950',
    amber: 'from-slate-950 via-amber-950 to-stone-900'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Hidden File Inputs for Avatar Upload */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarFileSelected}
      />
      <input 
        ref={cameraInputRef}
        type="file" 
        accept="image/*" 
        capture="user" 
        className="hidden" 
        onChange={handleAvatarFileSelected}
      />

      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#18191c] border border-slate-200/90 dark:border-white/[0.12] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* TOP COVER BANNER (Phong cách Airbnb/LinkedIn/Twitter Pro) */}
        <div className={`relative h-32 sm:h-40 bg-gradient-to-r ${coverGradients[coverTheme]} p-4 flex flex-col justify-between overflow-hidden shrink-0`}>
          {/* Architectural Blueprint Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Top Controls on Banner */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white/90 text-[11px] font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hồ Sơ Cán Bộ & Học Viên RMSA</span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Color Themes for Cover */}
              <div className="hidden sm:flex items-center space-x-1 bg-black/30 backdrop-blur-md p-1 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setCoverTheme('navy')}
                  className={`w-4 h-4 rounded-full bg-blue-600 transition-transform ${coverTheme === 'navy' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  title="Giao diện Navy Blue"
                />
                <button
                  type="button"
                  onClick={() => setCoverTheme('emerald')}
                  className={`w-4 h-4 rounded-full bg-emerald-600 transition-transform ${coverTheme === 'emerald' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  title="Giao diện Emerald Forest"
                />
                <button
                  type="button"
                  onClick={() => setCoverTheme('amber')}
                  className={`w-4 h-4 rounded-full bg-amber-600 transition-transform ${coverTheme === 'amber' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  title="Giao diện Amber Gold"
                />
                <button
                  type="button"
                  onClick={() => setCoverTheme('slate')}
                  className={`w-4 h-4 rounded-full bg-slate-700 transition-transform ${coverTheme === 'slate' ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  title="Giao diện Titanium Slate"
                />
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                title="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slogan Text on Banner */}
          <div className="relative z-10 text-white/80 text-xs font-mono">
            ID: <span className="font-bold text-white">RMSA-{currentUser.id ? String(currentUser.id).padStart(2, '0') : 'NV01'}</span> • Running Man Real Estate Academy
          </div>
        </div>

        {/* HEADER PROFILE BAR & AVATAR (Overlapping Banner) */}
        <div className="relative px-5 sm:px-8 pb-3 border-b border-slate-200/80 dark:border-white/[0.08] shrink-0 bg-white dark:bg-[#18191c]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-14 sm:-mt-16 gap-4">
            
            {/* AVATAR KHỐI TRỌNG TÂM */}
            <div className="flex items-end space-x-4">
              <div className="relative group">
                {/* Vỏ bọc Avatar có viền danh dự */}
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden p-1 shadow-xl bg-white dark:bg-[#18191c] ring-4 ${
                  isAdmin 
                    ? 'ring-amber-500/80' 
                    : (progressPercent === 100 ? 'ring-emerald-500/80' : 'ring-blue-600/80')
                }`}>
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={fullName}
                      className="w-full h-full rounded-2xl object-cover bg-slate-100 dark:bg-slate-800"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-inner">
                      {initialChar}
                    </div>
                  )}
                </div>

                {/* NÚT THAY ĐỔI AVATAR (Nổi bật, mở menu chọn) */}
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(prev => !prev)}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg border-2 border-white dark:border-[#18191c] transition-all cursor-pointer flex items-center justify-center group-hover:scale-105"
                  title="Thay đổi ảnh đại diện (Tải ảnh từ máy tính hoặc máy ảnh điện thoại)"
                >
                  {isUploadingAvatar ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>

                {/* DROPDOWN MENU CHỌN NGUỒN TẢI AVATAR */}
                {isAvatarPickerOpen && (
                  <div className="absolute left-0 sm:left-full top-full sm:top-0 sm:ml-3 mt-2 sm:mt-0 w-72 rounded-2xl bg-white dark:bg-[#202124] border border-slate-200 dark:border-white/[0.12] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.08]">
                      <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-blue-500" />
                        Đổi Ảnh Đại Diện
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setIsAvatarPickerOpen(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Lựa chọn 1: Tải từ tệp máy tính / Thư viện ảnh điện thoại */}
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold">Tải lên từ Tệp / Thư viện</p>
                        <p className="text-[10px] text-slate-400 font-normal">Chọn ảnh từ máy tính hoặc album điện thoại</p>
                      </div>
                    </button>

                    {/* Lựa chọn 2: Chụp ảnh ngay từ Máy ảnh (Camera) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (cameraInputRef.current) cameraInputRef.current.click();
                      }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold">Chụp trực tiếp từ Máy ảnh</p>
                        <p className="text-[10px] text-slate-400 font-normal">Dùng camera điện thoại hoặc webcam</p>
                      </div>
                    </button>

                    {/* Lựa chọn 3: Bộ sưu tập Avatar Mascot 3D có sẵn */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.08]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Chọn Avatar Mascot RMSA 3D:
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_AVATARS.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectPresetAvatar(p.url)}
                            className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.1] hover:border-blue-500 hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer p-0.5"
                            title={p.label}
                          >
                            <img src={p.url} alt={p.label} className="w-full h-11 object-cover rounded-lg" />
                            <span className="block text-[9px] text-center font-bold truncate text-slate-600 dark:text-slate-300 mt-0.5">
                              {p.label.split(' ')[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lựa chọn 4: Xóa ảnh đại diện */}
                    {avatarUrl && (
                      <div className="pt-1.5 border-t border-slate-100 dark:border-white/[0.08]">
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Quay về ảnh chữ cái mặc định</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tên & Chức danh Header */}
              <div className="min-w-0 pb-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                    {fullName || currentUser.name}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isAdmin 
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' 
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  }`}>
                    {isAdmin ? 'Quản Trị Viên' : 'Học Viên Nội Bộ'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {title || 'Chuyên Viên Tư Vấn Thực Chiến'} • {branch}
                </p>
              </div>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex items-center space-x-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-white dark:bg-[#2a2b2f] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Hồ Sơ & Kỹ Năng
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('badge')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'badge'
                    ? 'bg-white dark:bg-[#2a2b2f] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Thẻ Số & Danh Hiệu</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'security'
                    ? 'bg-white dark:bg-[#2a2b2f] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Bảo Mật</span>
              </button>
            </div>

          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {feedback.msg && (
          <div className={`mx-5 sm:mx-8 mt-3 p-3 rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : feedback.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center space-x-2">
              {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedback.msg}</span>
            </div>
            <button type="button" onClick={() => setFeedback({ msg: '', type: '' })} className="opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MODAL BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">

          {/* TAB 1: HỒ SƠ & THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Họ và tên */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span>Họ và Tên Học Viên *</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="VD: Lê Minh Tài"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400">Tên này sẽ hiển thị xuyên suốt trên Chứng chỉ, Bảng Vàng và Diễn đàn.</p>
                </div>

                {/* Số điện thoại / Zalo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Số Điện Thoại / Zalo Kết Nối</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0901 234 567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400">Dùng để nhận OTP khôi phục mật khẩu và kết nối nội bộ.</p>
                </div>

                {/* Chi nhánh công tác */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Chi Nhánh / Cơ Sở Trực Thuộc</span>
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-slate-50 dark:bg-[#202124] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {BRANCH_OPTIONS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Chức danh / Vị trí */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                    <span>Chức Vụ / Vị Trí Thực Chiến</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Chuyên viên tư vấn Duplex cao cấp"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* Châm ngôn chốt deal / Bio cá nhân */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Châm Ngôn Thực Chiến / Giới Thiệu Bản Thân (Bio)</span>
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Chia sẻ mục tiêu đào tạo hoặc câu châm ngôn chốt deal tâm đắc của bạn..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Kỹ năng thế mạnh (Tag chips) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Kỹ Năng & Thế Mạnh Thực Chiến ({skills.length} kỹ năng đã chọn)</span>
                </label>
                
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_SUGGESTIONS.map(s => {
                    const isSelected = skills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleToggleSkill(s)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:border-blue-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{s}
                      </button>
                    );
                  })}
                </div>

                {/* Thêm kỹ năng tùy chỉnh */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Thêm kỹ năng khác..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.04] text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/[0.1] hover:bg-slate-300 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              {/* Nút Submit Lưu */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Lưu & Đồng Bộ Hồ Sơ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: THẺ NHÂN SỰ SỐ & HUY HIỆU DANH HIỆU */}
          {activeTab === 'badge' && (
            <div className="space-y-6">
              
              {/* SMART DIGITAL PASS / THẺ NHÂN SỰ SỐ RMSA (Phong cách Apple Wallet) */}
              <div className="relative mx-auto max-w-md p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950 text-white border border-white/[0.15] shadow-2xl overflow-hidden space-y-4">
                
                {/* Glow decor */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Pass Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                      RM
                    </div>
                    <div>
                      <h4 className="font-black text-xs tracking-wider">RUNNING MAN SALES ACADEMY</h4>
                      <p className="text-[9px] text-slate-400 uppercase font-mono">Official Membership Pass</p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${tierColor}`}>
                    {tierLevel}
                  </span>
                </div>

                {/* Pass Body */}
                <div className="relative z-10 flex items-center space-x-4 pt-2">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shrink-0 shadow-md">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-xl font-black">
                        {initialChar}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-base truncate">{fullName || currentUser.name}</h3>
                    <p className="text-xs text-slate-300 font-medium truncate">{title || 'Chuyên viên tư vấn'}</p>
                    <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                      RMSA-{currentUser.id ? String(currentUser.id).padStart(2, '0') : 'NV01'} • {branch}
                    </p>
                  </div>
                </div>

                {/* Pass Footer / QR Code Simulation */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-mono">Tiến độ đào tạo</p>
                    <p className="font-bold text-emerald-400">{passedLessonsCount}/{totalCourses} chuyên đề ({progressPercent}%)</p>
                  </div>

                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-[10px] font-mono">
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>VERIFIED STAFF</span>
                  </div>
                </div>

              </div>

              {/* TỦ HUY HIỆU THÀNH TÍCH THỰC CHIẾN (Gamification Achievements) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Bộ Huy Hiệu Thành Tích Đã Mở Khóa</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Badge 1: Kỷ luật */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Chiến Binh Kỷ Luật</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Duy trì thói quen rèn luyện tình huống thực tế mỗi ngày.</p>
                    </div>
                  </div>

                  {/* Badge 2: Sát hạch */}
                  <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 ${
                    passedLessonsCount >= 1 
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' 
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] opacity-60'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Bách Phát Bách Trúng</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {passedLessonsCount >= 1 ? `Đã vượt qua ${passedLessonsCount} bài sát hạch thực chiến!` : 'Cần vượt qua ít nhất 1 bài sát hạch.'}
                      </p>
                    </div>
                  </div>

                  {/* Badge 3: Master Tốt Nghiệp */}
                  <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 ${
                    passedLessonsCount === totalCourses 
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800' 
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] opacity-60'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Master Chốt Deal RMSA</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {passedLessonsCount === totalCourses ? 'Đã hoàn thành xuất sắc 8/8 chuyên đề cốt lõi!' : 'Hoàn thành 8/8 chuyên đề để mở khóa.'}
                      </p>
                    </div>
                  </div>

                  {/* Badge 4: Trợ Lý AI */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Chiến Lược Gia Công Nghệ</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Áp dụng công nghệ AI Running Rin giải quyết ca chốt khó.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: BẢO MẬT & ĐỔI MẬT KHẨU */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md mx-auto">
              
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Mật khẩu mã hóa HMAC-SHA256
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hệ thống bảo vệ tài khoản bằng Salted Pepper chống rò rỉ dữ liệu.
                </p>
              </div>

              {securityStatus.msg && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                  securityStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                }`}>
                  {securityStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{securityStatus.msg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mật khẩu hiện tại *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu đang dùng"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mật khẩu mới *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ít nhất 4 ký tự"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Xác nhận mật khẩu mới *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={securityStatus.loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
                >
                  {securityStatus.loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Xác Nhận Đổi Mật Khẩu</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#1a1b1e] flex items-center justify-between shrink-0 text-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Dữ liệu đồng bộ tức thì với cơ sở dữ liệu RMSA
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/[0.1] hover:bg-slate-300 dark:hover:bg-white/[0.15] text-slate-700 dark:text-slate-200 font-bold cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
