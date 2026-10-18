import React, { useState, useEffect } from 'react';

export function RinMascotIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Headset Band */}
      <path d="M14 32C14 20 22 14 32 14C42 14 50 20 50 32" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"/>
      
      {/* Antenna */}
      <line x1="32" y1="14" x2="32" y2="7" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="6" r="3.5" fill="#FBBF24" />
      <circle cx="32" cy="6" r="1.5" fill="#FFF" />

      {/* Head Capsule */}
      <rect x="15" y="19" width="34" height="30" rx="15" fill="url(#botGrad)" stroke="#F59E0B" strokeWidth="2.5" />

      {/* Screen / Visor */}
      <rect x="19" y="24" width="26" height="18" rx="9" fill="#0F172A" />

      {/* Smiling Cyber Eyes */}
      <path d="M23 32C24 30 26 30 27 32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M37 32C38 30 40 30 41 32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cheerful Mouth */}
      <path d="M30 36.5C31 38 33 38 34 36.5" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

      {/* Cute Blush */}
      <circle cx="21" cy="36" r="1.5" fill="#F43F5E" opacity="0.8" />
      <circle cx="43" cy="36" r="1.5" fill="#F43F5E" opacity="0.8" />

      {/* Headset Earcups */}
      <rect x="11" y="27" width="5" height="12" rx="2.5" fill="#F59E0B" />
      <rect x="48" y="27" width="5" height="12" rx="2.5" fill="#F59E0B" />

      {/* Microphone Boom */}
      <path d="M48 35C48 42 42 46 36 46" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="34" cy="46" r="2.5" fill="#FBBF24" />

      {/* Gradients */}
      <defs>
        <linearGradient id="botGrad" x1="15" y1="19" x2="49" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function MascotBot({ onClick }) {
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    // Gentle auto-greeting bounce every 14 seconds
    const interval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1500);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
      
      {/* Mascot Avatar Button - Báo Gấm Running Rin 3D (Không có bong bóng chữ) */}
      <button
        onClick={onClick}
        title="Running Rin - Trợ lý AI Bán Hàng Running Man"
        aria-label="Running Rin - Trợ lý AI Bán Hàng Running Man"
        className={`group relative w-15 h-15 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-2xl shadow-amber-950/40 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center ring-2 ring-amber-400/30 hover:ring-amber-400/80 ${
          isWaving ? 'animate-bounce' : ''
        }`}
      >
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden shadow-inner">
          
          {/* Running Rin Mascot Image */}
          <img 
            src="/mascot-running-rin.jpg" 
            alt="Running Rin Mascot" 
            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Green Online Dot */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1a1715] ring-1 ring-emerald-300 animate-pulse shadow-xs"></span>

        </div>
      </button>

    </div>
  );
}
