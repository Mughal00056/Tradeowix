import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Fast authentic load transition
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 400);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-400 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Exact TradoWix minimalist line-drawn logo from screenshot Capture+_2026-10-15-12-04-30.png */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-slate-800 drop-shadow-xs animate-pulse"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-right looping arrow outline */}
          <path
            d="M 40 46 L 56 46 C 68 46 76 52 76 62 C 76 72 68 80 56 80 L 46 80 L 58 66 L 36 66 L 36 78 C 36 82 40 85 46 85 L 58 85 C 72 85 82 75 82 62 C 82 48 71 40 56 40 L 40 40 Z"
            stroke="#1e293b"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="opacity-80"
          />
          {/* Bottom-left looping arrow outline */}
          <path
            d="M 60 54 L 44 54 C 32 54 24 48 24 38 C 24 28 32 20 44 20 L 54 20 L 42 34 L 64 34 L 64 22 C 64 18 60 15 54 15 L 42 15 C 28 15 18 25 18 38 C 18 52 29 60 44 60 L 60 60 Z"
            stroke="#1e293b"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="opacity-80"
          />
        </svg>

        {/* Subtle breathing ring */}
        <div className="absolute inset-0 rounded-full border border-slate-200/50 animate-ping opacity-30 pointer-events-none" />
      </div>
    </div>
  );
};
