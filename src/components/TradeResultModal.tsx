import React, { useEffect, useState } from 'react';
import { TradeOrder } from '../types/trading';
import { CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, X, TrendingUp, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TradeResultModalProps {
  trade: TradeOrder;
  onClose: () => void;
}

export const TradeResultModal: React.FC<TradeResultModalProps> = ({
  trade,
  onClose,
}) => {
  const isWon = trade.status === 'WON';
  const isDraw = trade.status === 'DRAW';
  const [timeLeft, setTimeLeft] = useState(4); // 4 second auto-dismiss

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const totalReturn = isWon ? trade.amount + trade.profit : isDraw ? trade.amount : 0;
  const netProfit = isWon ? trade.profit : isDraw ? 0 : -trade.amount;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden text-center p-5 animate-in zoom-in-95 duration-200 relative"
        style={{
          boxShadow: isWon
            ? '0 20px 40px -15px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)'
            : '0 20px 40px -15px rgba(239, 68, 68, 0.2), 0 0 0 1px rgba(239, 68, 68, 0.1)',
        }}
      >
        {/* Top Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Header Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {trade.accountType} Account
          </span>
          <span
            className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full ${
              isWon
                ? 'bg-emerald-100/80 text-emerald-700'
                : isDraw
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100/80 text-red-700'
            }`}
          >
            {isWon ? 'Trade Won' : isDraw ? 'Draw' : 'Trade Closed'}
          </span>
        </div>

        {/* Big Profit Return Box with Glass Effect */}
        <div
          className={`relative my-3 p-4 rounded-2xl border transition-all ${
            isWon
              ? 'bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 border-emerald-400/40 shadow-xs'
              : isDraw
              ? 'bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-amber-400/40'
              : 'bg-gradient-to-b from-red-500/10 to-red-500/5 border-red-400/40'
          }`}
        >
          {isWon && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}

          <div className="text-xs font-semibold text-slate-500 mb-0.5">
            {isWon ? 'Payout Received' : 'Settlement Outcome'}
          </div>

          <div
            className={`font-mono-numbers font-black text-3xl tracking-tight ${
              isWon ? 'text-emerald-600' : isDraw ? 'text-amber-600' : 'text-slate-700'
            }`}
          >
            {isWon ? `+$${totalReturn.toFixed(2)}` : isDraw ? `$${totalReturn.toFixed(2)}` : '$0.00'}
          </div>

          {isWon ? (
            <div className="mt-1 text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
              <span>+${netProfit.toFixed(2)} Net Profit</span>
              <span className="opacity-75 font-mono-numbers">(+{trade.payoutPercent}%)</span>
            </div>
          ) : (
            <div className="mt-1 text-[11px] font-semibold text-slate-400">
              {isDraw ? 'Investment Returned' : `-$${trade.amount.toFixed(2)} Investment`}
            </div>
          )}
        </div>

        {/* Detailed Trade Parameters Table */}
        <div className="bg-slate-50/80 rounded-2xl p-3 mb-4 text-[11px] space-y-1.5 font-mono-numbers text-slate-700 text-left border border-slate-100">
          <div className="flex items-center justify-between font-sans">
            <span className="text-slate-400 font-medium">Asset & Direction:</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 font-mono-numbers">
              {trade.assetSymbol}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-sans font-extrabold ${
                  trade.direction === 'HIGHER'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {trade.direction === 'HIGHER' ? '↑ HIGHER' : '↓ LOWER'}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-sans font-medium">Opening Price:</span>
            <span className="font-semibold text-slate-700">{trade.entryPrice.toFixed(5)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-sans font-medium">Closing Price:</span>
            <span
              className={`font-semibold ${
                isWon ? 'text-emerald-600 font-bold' : 'text-slate-800'
              }`}
            >
              {trade.exitPrice?.toFixed(5) || '--'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-sans">
            <span className="text-slate-400 font-medium">Investment:</span>
            <span className="font-bold text-slate-900 font-mono-numbers">
              ${trade.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Button & Auto Dismiss indicator */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className={`w-full py-2.5 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-98 transition-all cursor-pointer ${
            isWon
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
              : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/25'
          }`}
        >
          <span>Continue Trading</span>
          <span className="ml-1 opacity-70 text-[10px] font-mono-numbers font-normal">
            ({timeLeft}s)
          </span>
        </button>
      </div>
    </div>
  );
};
