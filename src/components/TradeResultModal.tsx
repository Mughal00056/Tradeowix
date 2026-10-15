import React from 'react';
import { TradeOrder } from '../types/trading';
import { CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon status */}
        <div
          className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center shadow-md ${
            isWon ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {isWon ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {isWon ? 'Trade Won!' : 'Trade Expired'}
        </h3>

        <div className="text-xs text-slate-500 font-medium mt-1">
          {trade.assetSymbol} · {trade.direction}
        </div>

        {/* Profit banner */}
        <div
          className={`my-4 p-3 rounded-2xl font-mono-numbers font-black text-2xl ${
            isWon
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {isWon ? `+$${(trade.amount + trade.profit).toFixed(2)}` : `-$${trade.amount.toFixed(2)}`}
          {isWon && (
            <span className="block text-[11px] font-bold text-emerald-700 font-sans mt-0.5">
              +{trade.payoutPercent}% Profit Return
            </span>
          )}
        </div>

        {/* Details */}
        <div className="text-left text-[11px] bg-slate-50 rounded-xl p-2.5 mb-4 space-y-1 font-mono-numbers text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Investment:</span>
            <span className="font-bold">${trade.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Entry Price:</span>
            <span>{trade.entryPrice.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Exit Price:</span>
            <span>{trade.exitPrice?.toFixed(4) || '--'}</span>
          </div>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className={`w-full py-2.5 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer ${
            isWon ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-900'
          }`}
        >
          Continue Trading
        </button>
      </div>
    </div>
  );
};
