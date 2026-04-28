import React from 'react';

export const LandingPage: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  return (
    <div id="hero" className="min-h-screen relative flex items-center justify-center text-center overflow-hidden z-10 px-6 py-32">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[rgba(201,168,76,0.06)] pointer-events-none animate-[spin_80s_linear_infinite]" />
      
      <div className="relative max-w-4xl mx-auto z-10">
        <div className="inline-flex items-center gap-3 mb-9 text-[11px] font-medium tracking-[3px] uppercase text-gold">
          <div className="w-8 h-[1px] bg-gold opacity-60"></div>
          Unsmart Pro Protocol
          <div className="w-8 h-[1px] bg-gold opacity-60"></div>
        </div>

        <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-light leading-none tracking-tight mb-6">
          <span className="block text-text-main">The Architecture of</span>
          <span className="block italic font-semibold text-transparent bg-clip-text bg-gradient-to-br from-gold via-gold3 to-ice2">
            Intelligence.
          </span>
        </h1>

        <p className="text-lg font-light text-text2 max-w-xl mx-auto mb-12 leading-relaxed">
          Bypass the noise. Connect directly to the <strong>Core-4 Engine</strong> for hyper-focused, university-specific exam logistics and pattern prediction.
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <button 
            onClick={onLaunch}
            className="bg-gradient-to-br from-gold to-gold2 text-ink px-9 py-4 rounded-full text-sm font-bold shadow-[0_0_48px_rgba(201,168,76,0.3)] hover:-translate-y-1 hover:shadow-[0_0_80px_rgba(201,168,76,0.45)] transition-all font-cabinet tracking-wide logic-pulse"
          >
            Initialize Engine
          </button>
        </div>
      </div>
    </div>
  );
};
