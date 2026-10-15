import React, { useEffect, useState, useRef } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const completedRef = useRef(false);

  const finishLoading = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 250);
  };

  useEffect(() => {
    // Smooth progress counter from 0 to 100% over 1000ms
    const startTime = Date.now();
    const duration = 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          finishLoading();
        }, 150);
      }
    }, 30);

    // Hard fallback safety timeout - guaranteed to never get stuck!
    const safetyTimer = setTimeout(() => {
      finishLoading();
    }, 1300);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div
      onClick={finishLoading}
      onTouchStart={finishLoading}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white cursor-pointer select-none transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Container for Drawing Animation */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* SVG Path Draw of TradoWix dual-arrow loop logo */}
        <svg
          viewBox="0 0 100 100"
          className="w-28 h-28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle faint background path for outline guide */}
          <path
            d="M 38 46 L 56 46 C 68 46 76 52 76 62 C 76 72 68 80 56 80 L 46 80 L 58 66 L 36 66 L 36 78 C 36 82 40 85 46 85 L 58 85 C 72 85 82 75 82 62 C 82 48 71 40 56 40 L 38 40 Z"
            stroke="#e2e8f0"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M 62 54 L 44 54 C 32 54 24 48 24 38 C 24 28 32 20 44 20 L 54 20 L 42 34 L 64 34 L 64 22 C 64 18 60 15 54 15 L 42 15 C 28 15 18 25 18 38 C 18 52 29 60 44 60 L 62 60 Z"
            stroke="#e2e8f0"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Active drawing stroke top arrow - strokes in as progress increases */}
          <path
            d="M 38 46 L 56 46 C 68 46 76 52 76 62 C 76 72 68 80 56 80 L 46 80 L 58 66 L 36 66 L 36 78 C 36 82 40 85 46 85 L 58 85 C 72 85 82 75 82 62 C 82 48 71 40 56 40 L 38 40 Z"
            stroke="#0f172a"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{
              strokeDasharray: 260,
              strokeDashoffset: 260 - (260 * progress) / 100,
              transition: 'stroke-dashoffset 60ms linear',
            }}
          />

          {/* Active drawing stroke bottom arrow */}
          <path
            d="M 62 54 L 44 54 C 32 54 24 48 24 38 C 24 28 32 20 44 20 L 54 20 L 42 34 L 64 34 L 64 22 C 64 18 60 15 54 15 L 42 15 C 28 15 18 25 18 38 C 18 52 29 60 44 60 L 62 60 Z"
            stroke="#0f172a"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{
              strokeDasharray: 260,
              strokeDashoffset: 260 - (260 * progress) / 100,
              transition: 'stroke-dashoffset 60ms linear',
            }}
          />
        </svg>

        {/* Ambient pulse dot */}
        <div className="absolute inset-0 rounded-full border border-slate-200/50 animate-ping opacity-20 pointer-events-none" />
      </div>

      {/* Brand title */}
      <div className="mt-4 flex items-center gap-1.5 font-extrabold text-lg tracking-tight text-slate-900 font-sans">
        <span>Trado</span>
        <span className="text-indigo-600">Wix</span>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="mt-4 w-44 flex flex-col items-center">
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between w-full text-[11px] font-mono-numbers text-slate-400 font-semibold">
          <span>Loading market...</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Subtle skip indicator */}
      <div className="mt-8 text-[11px] text-slate-300 hover:text-slate-500 font-medium transition-colors">
        Tap anywhere to enter
      </div>
    </div>
  );
};
