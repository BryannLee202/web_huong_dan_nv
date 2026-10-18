import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-300">
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 font-semibold text-xs px-4 py-2 flex items-center justify-center space-x-2 shadow-md animate-in slide-in-from-top">
          <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
          <span>Mất kết nối Internet tạm thời. Hệ thống đang tự động lưu dữ liệu nội bộ và thử kết nối lại...</span>
          <button 
            onClick={() => window.location.reload()}
            className="ml-3 px-2 py-0.5 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-slate-800 transition-colors inline-flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Tải lại</span>
          </button>
        </div>
      )}

      {showReconnected && (
        <div className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2 flex items-center justify-center space-x-2 shadow-md animate-in slide-in-from-top">
          <Wifi className="w-4 h-4 text-white" />
          <span>Đã khôi phục kết nối mạng thành công! Dữ liệu đang được đồng bộ tự động.</span>
        </div>
      )}
    </div>
  );
}
