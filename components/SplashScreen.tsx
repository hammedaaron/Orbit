import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Stars Overlay */}
      <div className="absolute inset-0 stars-bg opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Main Container */}
      <div className="relative flex flex-col items-center z-10">
        
        {/* Orb Animation */}
        <div className="relative animate-moon-rise mb-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-300 animate-orb-glow relative z-10 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)]">
            <div className="w-28 h-28 rounded-full bg-black relative flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-transparent" />
               <div className="w-full h-1/2 absolute bottom-0 bg-blue-500/20 blur-xl" />
            </div>
          </div>
          
          {/* Glow behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] animate-pulse" />
        </div>

        {/* Text Reveal */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-forwards opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-[0.2em] mb-4 drop-shadow-2xl">
            ORBIT
          </h1>
          
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-5" />
          
          <p className="text-xs md:text-sm text-zinc-500 font-mono tracking-[0.3em] uppercase opacity-80">
            Powered by <span className="text-blue-400 font-bold glow-text">HAMSTAR</span>
          </p>
        </div>
      </div>
    </div>
  );
};