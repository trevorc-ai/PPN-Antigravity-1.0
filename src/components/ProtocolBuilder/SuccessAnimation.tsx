import React, { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  onComplete: () => void;
  message?: string;
  subMessage?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ onComplete, message = "Success", subMessage = "Recorded" }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // 1. Zoom In
    setTimeout(() => setStage(1), 100);
    // 2. Pulse
    setTimeout(() => setStage(2), 600);
    // 3. Fade Out / Done
    setTimeout(() => {
      setStage(3);
      onComplete();
    }, 2000);
  }, [onComplete]);

  if (stage === 3) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`relative flex flex-col items-center justify-center transition-all duration-500 transform ${stage === 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>

        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-ping duration-1000" />

          {/* Inner Ring */}
          <div className={`w-24 h-24 bg-emerald-500 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all duration-300 ${stage === 2 ? 'scale-110' : 'scale-100'}`}>
            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-300 mt-8 tracking-tighter uppercase">{message}</h2>
        <p className="text-emerald-400 font-mono tracking-widest text-xs mt-2">{subMessage}</p>

      </div>
    </div>
  );
};
