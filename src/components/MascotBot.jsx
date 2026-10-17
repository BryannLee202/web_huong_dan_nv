import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Bot } from 'lucide-react';

export default function MascotBot({ onClick, isOpen }) {
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    // Gentle auto-greeting bounce every 12 seconds
    const interval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
      
      {/* Speech Bubble Tooltip */}
      {!isOpen && (
        <div 
          onClick={onClick}
          className={`mb-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#16181f] border border-slate-200 dark:border-white/[0.1] shadow-lg text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5 cursor-pointer transition-all duration-300 hover:scale-105 ${
            isWaving ? 'animate-bounce' : ''
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Tra cứu kịch bản dẫn phòng!</span>
        </div>
      )}

      {/* Mascot Avatar Button - Minimalist Notion Style */}
      <button
        onClick={onClick}
        aria-label="Tra cứu kịch bản nghiệp vụ"
        className="group relative w-12 h-12 rounded-full bg-slate-900 dark:bg-[#252525] hover:bg-slate-800 dark:hover:bg-[#303030] shadow-lg border border-slate-700/40 dark:border-white/[0.12] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center text-white dark:text-zinc-200"
      >
        <MessageSquare className="w-5 h-5 text-white dark:text-zinc-200 group-hover:scale-110 transition-transform" />
        {/* Green Online Dot */}
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#191919] ring-1 ring-emerald-400/50 animate-pulse"></span>
      </button>

    </div>
  );
}
