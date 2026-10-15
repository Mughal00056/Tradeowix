import React from 'react';
import { BarChart2, Radio, Wallet, Menu } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface BottomNavProps {
  activeTab: 'trade' | 'trades' | 'signals' | 'deposit' | 'more';
  onSelectTab: (tab: 'trade' | 'trades' | 'signals' | 'deposit' | 'more') => void;
  openTradesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  openTradesCount,
}) => {
  return (
    <nav className="h-14 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around px-2 select-none shrink-0 z-30">
      {/* 1. Trade (Active) */}
      <button
        onClick={() => {
          playClickSound();
          onSelectTab('trade');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
          activeTab === 'trade' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {activeTab === 'trade' && (
          <span className="absolute top-0 inset-x-5 h-1 bg-[#6366f1] rounded-b-full shadow-xs" />
        )}
        <BarChart2 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Trade</span>
      </button>

      {/* 2. Portfolio / Orders with purple badge (Screenshots 5, 6, 8, 11) */}
      <button
        onClick={() => {
          playClickSound();
          onSelectTab('trades');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
          activeTab === 'trades' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {openTradesCount > 0 && (
            <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-[#6366f1] text-white rounded-full flex items-center justify-center text-[9px] font-bold font-mono-numbers shadow-xs">
              {openTradesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Portfolio</span>
      </button>

      {/* 3. Signals */}
      <button
        onClick={() => {
          playClickSound();
          onSelectTab('signals');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
          activeTab === 'signals' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <Radio className="w-5 h-5 mb-0.5" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </div>
        <span className="text-[10px] tracking-tight">Signals</span>
      </button>

      {/* 4. Top Up / Deposit */}
      <button
        onClick={() => {
          playClickSound();
          onSelectTab('deposit');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
          activeTab === 'deposit' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Wallet className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Top Up</span>
      </button>

      {/* 5. More */}
      <button
        onClick={() => {
          playClickSound();
          onSelectTab('more');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
          activeTab === 'more' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">More</span>
      </button>
    </nav>
  );
};
