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
          className={`mb-2 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-md text-xs font-bold text-slate-800 flex items-center space-x-1.5 cursor-pointer transition-all duration-300 hover:scale-105 ${
            isWaving ? 'animate-bounce' : ''
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Hỏi RIN Bot kịch bản sale!</span>
        </div>
      )}

      {/* Mascot Avatar Button */}
      <button
        onClick={onClick}
        aria-label="Trợ lý ảo RIN Bot"
        className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#007c5d] via-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-950/20 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
          
          {/* Mascot Face Icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#007c5d] flex items-center justify-center font-black">
              <Bot className="w-5 h-5 text-[#007c5d] group-hover:rotate-12 transition-transform" />
            </div>
            {/* Green Online Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300 animate-pulse"></span>
          </div>

        </div>
      </button>

    </div>
  );
}
