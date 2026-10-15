import React, { useState } from 'react';
import { Asset, TradeDirection } from '../types/trading';
import { Clock, ArrowUpDown, ChevronDown, Plus, Minus } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TradeDockProps {
  asset: Asset;
  onInitiateTrade: (direction: TradeDirection, amount: number, durationSeconds: number) => void;
  userBalance: number;
  durationSeconds: number;
  setDurationSeconds: (duration: number) => void;
}

export const TradeDock: React.FC<TradeDockProps> = ({
  asset,
  onInitiateTrade,
  userBalance,
  durationSeconds,
  setDurationSeconds,
}) => {
  const [amount, setAmount] = useState<number>(1);
  const [pendingTrade, setPendingTrade] = useState(false);
  const [showExpirationPicker, setShowExpirationPicker] = useState(false);
  const [showAmountQuickPicker, setShowAmountQuickPicker] = useState(false);

  // Profit calculation
  const profitAmount = amount * (asset.payoutPercent / 100);

  const handleButtonClick = (direction: TradeDirection) => {
    if (amount <= 0) return;
    onInitiateTrade(direction, amount, durationSeconds);
  };

  const expirationOptions = [
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '2m', value: 120 },
    { label: '5m', value: 300 },
  ];

  // Format current expiration clock
  const now = new Date();
  const expireDate = new Date(now.getTime() + durationSeconds * 1000);
  const formattedTime = `${expireDate.getHours().toString().padStart(2, '0')}:${expireDate.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3.5 pt-2 pb-3.5 shadow-xs select-none relative z-20">
      {/* Row 1: Investment & Expiration Inputs (Exact layout from Screenshot 1 & 5) */}
      <div className="grid grid-cols-2 gap-2.5 mb-2">
        {/* Investments Input Box */}
        <div className="relative">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1 px-0.5">
            <span>Investments</span>
            <button
              onClick={() => {
                playClickSound();
                setShowAmountQuickPicker(!showAmountQuickPicker);
              }}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-0.5 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3 h-3 text-[#6366f1]" />
              <span>$</span>
            </button>
          </div>

          <div className="relative flex items-center bg-[#f1f5f9] rounded-xl border border-slate-200 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <button
              onClick={() => {
                playClickSound();
                setAmount((prev) => Math.max(1, prev - 1));
              }}
              className="w-7 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 active:bg-slate-200 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <input
              type="number"
              min="1"
              max="50000"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
              className="w-full bg-transparent text-center font-extrabold text-base text-slate-800 focus:outline-hidden py-2 font-mono-numbers"
            />

            <span className="text-slate-400 font-bold text-sm pr-1">$</span>

            <button
              onClick={() => {
                playClickSound();
                setAmount((prev) => prev + 1);
              }}
              className="w-7 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 active:bg-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Amount Chooser popup */}
          {showAmountQuickPicker && (
            <div className="absolute bottom-full left-0 mb-1.5 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-2 z-30 grid grid-cols-4 gap-1 text-center font-mono-numbers text-xs font-bold text-slate-700 animate-in fade-in duration-100">
              {[1, 5, 10, 25, 50, 100, 250, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    playClickSound();
                    setAmount(val);
                    setShowAmountQuickPicker(false);
                  }}
                  className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                    amount === val
                      ? 'bg-[#6366f1] text-white border-[#6366f1]'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Expiration Input Box */}
        <div className="relative">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1 px-0.5">
            <span>Expiration</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                Pending
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  setPendingTrade(!pendingTrade);
                }}
                className={`w-6 h-3.5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                  pendingTrade ? 'bg-[#6366f1]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                    pendingTrade ? 'translate-x-2.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setShowExpirationPicker(!showExpirationPicker);
            }}
            className="w-full flex items-center justify-between bg-[#f1f5f9] rounded-xl border border-slate-200 px-3 py-2 text-slate-800 font-bold text-base font-mono-numbers hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>{formattedTime}</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </button>

          {/* Expiration Picker Dropdown */}
          {showExpirationPicker && (
            <div className="absolute bottom-full right-0 mb-1.5 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-2 z-30 flex flex-col gap-1 text-xs font-semibold animate-in fade-in duration-100">
              <div className="text-[10px] text-slate-400 px-1 py-0.5 font-bold uppercase">
                Trade Expiry
              </div>
              {expirationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    playClickSound();
                    setDurationSeconds(opt.value);
                    setShowExpirationPicker(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    durationSeconds === opt.value
                      ? 'bg-indigo-50 text-indigo-600 font-bold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="font-mono-numbers text-[11px] text-slate-400">
                    +{opt.value}s
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Profit Line (Screenshot 1 & 5) */}
      <div className="flex items-center justify-between text-xs font-semibold px-1 mb-2.5">
        <div className="text-emerald-600 font-bold">
          Profit: <span className="font-mono-numbers">+{asset.payoutPercent}%</span>
        </div>
        <div className="text-emerald-600 font-mono-numbers font-bold text-sm">
          +${profitAmount.toFixed(2)}
        </div>
      </div>

      {/* Row 3: Action Buttons (LOWER & HIGHER - Authentic TradoWix Buttons) */}
      <div className="grid grid-cols-2 gap-3">
        {/* LOWER (Red) */}
        <button
          onClick={() => handleButtonClick('LOWER')}
          className="group relative flex items-center justify-between bg-linear-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] active:scale-[0.97] text-white px-4 py-3 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-red-500/25 transition-all cursor-pointer overflow-hidden border border-red-400/30"
        >
          <div className="flex flex-col text-left">
            <span className="tracking-wider text-sm font-black drop-shadow-xs">LOWER</span>
            <span className="text-[10px] font-mono-numbers font-bold text-red-100 opacity-90">
              ${amount.toFixed(0)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg font-black leading-none">↘</span>
          </div>
        </button>

        {/* HIGHER (Green) */}
        <button
          onClick={() => handleButtonClick('HIGHER')}
          className="group relative flex items-center justify-between bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] active:scale-[0.97] text-white px-4 py-3 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all cursor-pointer overflow-hidden border border-emerald-400/30"
        >
          <div className="flex flex-col text-left">
            <span className="tracking-wider text-sm font-black drop-shadow-xs">HIGHER</span>
            <span className="text-[10px] font-mono-numbers font-bold text-emerald-100 opacity-90">
              +${profitAmount.toFixed(2)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg font-black leading-none">↗</span>
          </div>
        </button>
      </div>
    </div>
  );
};
