import React from 'react';

interface TradoWixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightMode?: boolean;
}

export const TradoWixLogo: React.FC<TradoWixLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightMode = false,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Exact TradoWix icon - interlocking curved exchange arrows */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Upper left curved loop arrow */}
          <path
            d="M72 32H36C26 32 18 40 18 50C18 52 18.5 54 19.5 56"
            stroke={lightMode ? '#ffffff' : '#0f172a'}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M58 18L74 32L58 46"
            stroke={lightMode ? '#ffffff' : '#0f172a'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lower right reversed curved loop arrow */}
          <path
            d="M28 68H64C74 68 82 60 82 50C82 48 81.5 46 80.5 44"
            stroke={lightMode ? '#818cf8' : '#4f46e5'}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M42 82L26 68L42 54"
            stroke={lightMode ? '#818cf8' : '#4f46e5'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className={`flex items-baseline ${textSizes[size]}`}>
          <span className={lightMode ? 'text-white font-extrabold' : 'text-slate-900 font-extrabold'}>
            Trado
          </span>
          <span className={lightMode ? 'text-indigo-400 font-black' : 'text-slate-900 font-black'}>
            Wix
          </span>
        </div>
      )}
    </div>
  );
};
