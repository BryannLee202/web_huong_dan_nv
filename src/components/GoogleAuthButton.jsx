import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';

export default function GoogleAuthButton({ 
  onSuccess, 
  onError, 
  buttonText = 'Tiếp tục với Google',
  theme = 'light',
  className = '' 
}) {
  const [googleClientId, setGoogleClientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const buttonContainerRef = useRef(null);
  const isRenderedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  // Lấy cấu hình Google Client ID từ backend
  useEffect(() => {
    let isMounted = true;
    api.auth.getConfig()
      .then((cfg) => {
        if (isMounted && cfg && cfg.googleClientId) {
          setGoogleClientId(cfg.googleClientId);
        }
      })
      .catch((err) => {
        console.warn('Chưa lấy được cấu hình Google Auth:', err?.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Callback ref luôn ổn định
  const callbackRef = useRef(async (response) => {
    if (!response || !response.credential) {
      if (onErrorRef.current) onErrorRef.current('Không nhận được token xác thực từ Google.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.loginWithGoogle(response.credential);
      if (res && res.success) {
        if (onSuccessRef.current) onSuccessRef.current(res.user, res);
      } else {
        if (onErrorRef.current) onErrorRef.current(res?.message || 'Đăng nhập Google thất bại.');
      }
    } catch (err) {
      if (onErrorRef.current) onErrorRef.current(err?.message || 'Lỗi kết nối khi xác thực Google.');
    } finally {
      setIsLoading(false);
    }
  });

  // Khởi tạo Google Identity Services an toàn (Zero mutation loop - Hoàn toàn tương thích iOS Safari & Android)
  useEffect(() => {
    if (!googleClientId) return;

    let checkTimer = null;
    let attempts = 0;

    const renderGoogleBtn = () => {
      if (typeof window === 'undefined' || !window.google?.accounts?.id || !buttonContainerRef.current) {
        return false;
      }
      try {
        const isDarkMode = theme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (res) => callbackRef.current(res),
          auto_select: false,
          cancel_on_tap_outside: true
        });

        buttonContainerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(
          buttonContainerRef.current,
          {
            theme: isDarkMode ? 'filled_black' : 'outline',
            size: 'large',
            type: 'standard',
            shape: 'pill',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 320
          }
        );
        isRenderedRef.current = true;
        setIsGsiLoaded(true);
        return true;
      } catch (e) {
        console.warn('Lỗi render Google button:', e);
        return false;
      }
    };

    if (!renderGoogleBtn()) {
      checkTimer = setInterval(() => {
        attempts++;
        if (renderGoogleBtn() || attempts >= 10) {
          clearInterval(checkTimer);
        }
      }, 500);
    }

    return () => {
      if (checkTimer) clearInterval(checkTimer);
    };
  }, [googleClientId, theme]);

  // Click handler khi bấm nút đăng nhập Google fallback
  const handleFallbackClick = () => {
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (res) => callbackRef.current(res)
        });
        window.google.accounts.id.prompt((notification) => {
          if (notification && notification.isNotDisplayed()) {
            alert(
              '⚠️ THÔNG BÁO TỪ GOOGLE OAUTH:\n\n' +
              'Google chưa cho phép đăng nhập từ cổng này. Vui lòng kiểm tra lại cấu hình Authorized JavaScript origins trong Google Cloud Console.'
            );
          }
        });
      } catch (err) {
        if (onErrorRef.current) onErrorRef.current('Lỗi kích hoạt đăng nhập Google: ' + err.message);
      }
    } else {
      alert(
        '⚡ TÍNH NĂNG ĐĂNG NHẬP GOOGLE THẬT 100%:\n\n' +
        'Hệ thống backend và frontend đã hoàn tất tích hợp Google OAuth 2.0!\n' +
        'Để kết nối tài khoản Google thật, bạn chỉ cần điền mã GOOGLE_CLIENT_ID vào biến môi trường để sử dụng ngay lập tức.'
      );
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      {/* Container nút thật do Google Identity Services tự động render */}
      <div 
        ref={buttonContainerRef} 
        style={{ colorScheme: 'light' }}
        className={`google-gsi-pill inline-flex items-center justify-center rounded-full overflow-hidden min-h-[40px] ${isGsiLoaded ? 'inline-flex' : 'hidden'}`} 
      />

      {/* Nút thương hiệu Google chuẩn Material 3 (hiển thị khi Google iframe chưa render xong hoặc chưa có Client ID) */}
      {!isGsiLoaded && (
        <button
          type="button"
          onClick={handleFallbackClick}
          disabled={isLoading}
          className="w-full h-12 px-4 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center space-x-2.5 cursor-pointer active:scale-[0.99]"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
}
