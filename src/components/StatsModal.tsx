import React from 'react';
import { TradeOrder } from '../types/trading';
import { X, TrendingUp, Award, DollarSign, Target } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface StatsModalProps {
  trades: TradeOrder[];
  demoBalance: number;
  realBalance: number;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  trades,
  demoBalance,
  realBalance,
  onClose,
}) => {
  const closed = trades.filter((t) => t.status !== 'OPEN');
  const won = closed.filter((t) => t.status === 'WON');
  const winRate = closed.length > 0 ? Math.round((won.length / closed.length) * 100) : 0;
  const netProfit = won.reduce((acc, t) => acc + t.profit, 0) - closed.filter(t => t.status === 'LOST').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900">Trading Stats</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Win Rate</span>
              <div className="text-2xl font-black text-indigo-600 font-mono-numbers">
                {winRate}%
              </div>
              <span className="text-[10px] text-slate-400">{won.length} of {closed.length} trades</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Net P&L</span>
              <div
                className={`text-2xl font-black font-mono-numbers ${
                  netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {netProfit >= 0 ? `+$${netProfit.toFixed(2)}` : `-$${Math.abs(netProfit).toFixed(2)}`}
              </div>
              <span className="text-[10px] text-slate-400">Total return</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-950">Trader Tier</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase">
                Expert Demo
              </span>
            </div>
            <div className="text-xs text-indigo-900/80 leading-relaxed">
              TradoWix algorithms provide offline and online order execution with 0-spread OTC quotes and up to 92% instantaneous fixed return.
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
              <span className="text-slate-500 font-medium">Demo Balance</span>
              <span className="font-extrabold font-mono-numbers text-slate-800">
                ${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
              <span className="text-slate-500 font-medium">Real Balance</span>
              <span className="font-extrabold font-mono-numbers text-slate-800">
                ${realBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
              <span className="text-slate-500 font-medium">Favorite Market</span>
              <span className="font-bold text-slate-800">EUR/USD (OTC)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
