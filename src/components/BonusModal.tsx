import React from 'react';
import { X, Coins, Gift, Check, Sparkles, Copy } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface BonusModalProps {
  onClose: () => void;
  onOpenDeposit: () => void;
}

export const BonusModal: React.FC<BonusModalProps> = ({
  onClose,
  onOpenDeposit,
}) => {
  const code = 'TRADOBONUS70';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Bonus promo code TRADOBONUS70 copied!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <Coins className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900">First Deposit Bonus</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
              +70%
            </span>
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

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Banner */}
          <div className="p-5 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white rounded-2xl shadow-md text-center relative overflow-hidden">
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-200 animate-bounce" />
              <h3 className="text-xl font-black tracking-tight">Boost Your Balance +70%</h3>
              <p className="text-xs text-amber-100 mt-1 max-w-xs mx-auto">
                Get up to $700 in extra trading funds on your first deposit with instant zero-commission payout.
              </p>
            </div>
          </div>

          {/* Promo code box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Promo Code</span>
              <div className="font-black text-sm font-mono-numbers text-indigo-600 tracking-wider">
                {code}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 active:scale-95 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Applicable on USDT, BNB, TRX, and ETH deposits</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No trade turnover lock on real capital</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Usable on all 92% payout OTC currency pairs</span>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
              onOpenDeposit();
            }}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            Claim +70% Bonus & Top Up
          </button>
        </div>
      </div>
    </div>
  );
};
