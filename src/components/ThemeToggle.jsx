import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Nút chuyển đổi Chế Độ Ngày & Đêm (Light/Dark Theme Toggle)
 * Lưu tự động vào localStorage và đồng bộ toàn hệ thống
 */
export default function ThemeToggle({ theme = 'light', onToggle, className = '' }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Chuyển sang chế độ Ngày' : 'Chuyển sang chế độ Đêm'}
      title={isDark ? 'Chuyển sang chế độ Ngày (Giao diện Sáng)' : 'Chuyển sang chế độ Đêm (Giao diện Tối)'}
      className={`p-2 sm:px-3 sm:py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer group active:scale-95 shrink-0 select-none ${className}`}
    >
      {isDark ? (
        <>
          <Moon className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20 group-hover:-rotate-12 transition-transform duration-300" />
          <span className="hidden md:inline text-xs font-bold text-slate-200 tracking-wide">Đêm</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 group-hover:rotate-45 transition-transform duration-300" />
          <span className="hidden md:inline text-xs font-bold text-slate-700 tracking-wide">Ngày</span>
        </>
      )}
    </button>
  );
}
