import React from 'react';

interface AssetIconProps {
  flags: [string, string] | [string];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AssetIcon: React.FC<AssetIconProps> = ({
  flags,
  size = 'md',
  className = '',
}) => {
  const containerSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const flagSize = {
    sm: 'w-4 h-4 text-[9px]',
    md: 'w-5 h-5 text-[11px]',
    lg: 'w-6 h-6 text-xs',
  }[size];

  const renderSingleFlag = (code: string) => {
    switch (code) {
      case 'eu':
        return (
          <div className={`${flagSize} rounded-full bg-[#003399] flex items-center justify-center text-yellow-300 font-bold border border-white shadow-xs overflow-hidden`}>
            ★
          </div>
        );
      case 'us':
        return (
          <div className={`${flagSize} rounded-full bg-[#B22234] flex flex-col items-center justify-center border border-white shadow-xs overflow-hidden relative`}>
            <div className="absolute inset-x-0 top-0 h-1/2 bg-[#3C3B6E] flex items-center justify-center text-[7px] text-white">★</div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white flex flex-col justify-between py-[1px]">
              <div className="h-[1px] bg-[#B22234]" />
              <div className="h-[1px] bg-[#B22234]" />
            </div>
          </div>
        );
      case 'gb':
        return (
          <div className={`${flagSize} rounded-full bg-[#00247D] flex items-center justify-center border border-white shadow-xs overflow-hidden relative`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[3px] bg-red-600 border-y border-white" />
              <div className="h-full w-[3px] bg-red-600 border-x border-white absolute" />
            </div>
          </div>
        );
      case 'au':
        return (
          <div className={`${flagSize} rounded-full bg-[#00008B] flex items-center justify-center border border-white shadow-xs overflow-hidden relative`}>
            <div className="absolute top-0 left-0 text-[6px] text-white font-bold">🇬🇧</div>
            <span className="text-[7px] text-white font-bold ml-1">★</span>
          </div>
        );
      case 'ca':
        return (
          <div className={`${flagSize} rounded-full bg-white flex items-center justify-center border border-white shadow-xs overflow-hidden relative`}>
            <div className="w-1.5 h-full bg-[#FF0000] absolute left-0" />
            <div className="w-1.5 h-full bg-[#FF0000] absolute right-0" />
            <span className="text-[9px] text-[#FF0000]">🍁</span>
          </div>
        );
      case 'ch':
        return (
          <div className={`${flagSize} rounded-full bg-[#D52B1E] flex items-center justify-center border border-white shadow-xs overflow-hidden text-white font-black text-[10px]`}>
            +
          </div>
        );
      case 'jp':
        return (
          <div className={`${flagSize} rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-xs overflow-hidden`}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#BC002D]" />
          </div>
        );
      case 'nz':
        return (
          <div className={`${flagSize} rounded-full bg-[#00247D] flex items-center justify-center border border-white shadow-xs overflow-hidden`}>
            <span className="text-[8px] text-red-500 font-bold">✦</span>
          </div>
        );
      case 'sg':
        return (
          <div className={`${flagSize} rounded-full bg-[#ED2939] flex flex-col items-center justify-center border border-white shadow-xs overflow-hidden relative`}>
            <div className="w-full h-1/2 bg-[#ED2939] flex items-center justify-center text-[7px] text-white">☪</div>
            <div className="w-full h-1/2 bg-white" />
          </div>
        );
      case 'btc':
        return (
          <div className={`${flagSize} rounded-full bg-[#F7931A] flex items-center justify-center text-white font-black border border-white shadow-xs`}>
            ₿
          </div>
        );
      case 'eth':
        return (
          <div className={`${flagSize} rounded-full bg-[#627EEA] flex items-center justify-center text-white font-bold border border-white shadow-xs text-[10px]`}>
            ♦
          </div>
        );
      case 'gold':
        return (
          <div className={`${flagSize} rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-amber-950 font-black border border-white shadow-xs text-[10px]`}>
            AU
          </div>
        );
      default:
        return (
          <div className={`${flagSize} rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border border-white shadow-xs`}>
            {code.toUpperCase().slice(0, 2)}
          </div>
        );
    }
  };

  return (
    <div className={`relative flex items-center ${containerSize} ${className}`}>
      {flags.length === 1 ? (
        <div className="w-full h-full flex items-center justify-center">
          {renderSingleFlag(flags[0])}
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center">
          <div className="absolute left-0 z-10 transition-transform hover:scale-105">
            {renderSingleFlag(flags[0])}
          </div>
          <div className="absolute right-0 z-20 -ml-2 transition-transform hover:scale-105">
            {renderSingleFlag(flags[1])}
          </div>
        </div>
      )}
    </div>
  );
};
