import React from 'react';
import { Asset, TradeDirection } from '../types/trading';
import { X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ConfirmTradeModalProps {
  asset: Asset;
  direction: TradeDirection;
  amount: number;
  openPrice: number;
  durationSeconds: number;
  oneClickEnabled: boolean;
  setOneClickEnabled: (val: boolean) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmTradeModal: React.FC<ConfirmTradeModalProps> = ({
  asset,
  direction,
  amount,
  openPrice,
  durationSeconds,
  oneClickEnabled,
  setOneClickEnabled,
  onConfirm,
  onClose,
}) => {
  const isHigher = direction === 'HIGHER';

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec} sec`;
    const min = Math.round(sec / 60);
    return `${min} min`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-4 animate-in slide-in-from-bottom-4 duration-200">
        {/* Header (Screenshot Capture+_2026-10-15-12-01-43.png) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-900 tracking-tight">
              {asset.symbol.replace(' (OTC)', '')}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                isHigher ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isHigher ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{isHigher ? 'Higher' : 'Lower'}</span>
            </span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trade Details Rows (Screenshot 5) */}
        <div className="py-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Open price</span>
            <span className="font-mono-numbers font-bold text-slate-800 text-sm">
              {openPrice.toFixed(asset.decimals)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Invest</span>
            <span className="font-mono-numbers font-black text-slate-900 text-sm">
              ${amount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Expiration</span>
            <span className="font-bold text-slate-800 font-mono-numbers">
              {formatDuration(durationSeconds)}
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => {
            playClickSound();
            onConfirm();
          }}
          className={`w-full py-3 rounded-xl text-white font-extrabold text-sm tracking-wide shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer mb-3 ${
            isHigher
              ? 'bg-[#10b981] hover:bg-[#059669] shadow-emerald-500/25'
              : 'bg-[#ef4444] hover:bg-[#dc2626] shadow-red-500/25'
          }`}
        >
          {isHigher ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>Confirm {isHigher ? 'Higher' : 'Lower'}</span>
        </button>

        {/* Always purchase in one click toggle (Screenshot 5) */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-500 hover:text-slate-700 transition-colors px-1">
          <input
            type="checkbox"
            checked={oneClickEnabled}
            onChange={(e) => setOneClickEnabled(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-0 cursor-pointer"
          />
          <span>Always purchase in one click</span>
        </label>
      </div>
    </div>
  );
};
