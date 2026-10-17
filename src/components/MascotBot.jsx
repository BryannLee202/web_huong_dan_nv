import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

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

      {/* Mascot Avatar Button - Warm Amber Luxury Style */}
      <button
        onClick={onClick}
        aria-label="Tra cứu kịch bản nghiệp vụ"
        className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-0.5 shadow-xl shadow-amber-950/20 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
      >
        <div className="w-full h-full rounded-full bg-white dark:bg-[#1f1c1a] flex items-center justify-center relative overflow-hidden">
          
          {/* Script Consultant Icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-[#1f232e] text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            {/* Green Online Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#14161d] ring-1 ring-emerald-300 animate-pulse"></span>
          </div>

        </div>
      </button>

    </div>
  );
}
