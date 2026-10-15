import React, { useState } from 'react';
import { TradoWixLogo } from './TradoWixLogo';
import {
  X,
  Zap,
  AlertTriangle,
  ChevronRight,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { playClickSound, playWinSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DepositModalProps {
  onClose: () => void;
  onTradeNow: () => void;
  onDepositSuccess: (amount: number, method: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  onClose,
  onTradeNow,
  onDepositSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [applyBonus, setApplyBonus] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mockAddress = 'TQ3aK9x8LmZ2vPbYw1e9D8R4sK0tF6xJ';

  const handleCopy = () => {
    navigator.clipboard.writeText(mockAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      playWinSound();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      const bonusAmount = applyBonus ? depositAmount * 0.7 : 0;
      onDepositSuccess(depositAmount + bonusAmount, selectedMethod || 'USDT');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Top Header matching Screenshot 5 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white sticky top-0 z-20">
          <TradoWixLogo size="sm" showText={true} />

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                onTradeNow();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Trade Now</span>
            </button>

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
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {!selectedMethod ? (
            <>
              {/* Heading & Subheading (Exact match to Screenshot 5) */}
              <div className="mb-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Deposit
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  Add funds to your account with crypto or a local payment method
                </p>
              </div>

              {/* Section Header */}
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                CHOOSE A METHOD
              </div>

              {/* List of Payment Methods (Exact match to Screenshot 5) */}
              <div className="space-y-2.5">
                {/* USDT (RECOMMENDED) */}
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedMethod('USDT');
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 active:scale-[0.99] transition-all text-left bg-white shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200">
                      ₮
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">USDT</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider">
                          RECOMMENDED
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mt-0.5">
                        <Zap className="w-3 h-3 fill-amber-500" />
                        <span>Instant</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>

                {/* Raast (PKR) (MAINTENANCE) */}
                <div className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 opacity-80 cursor-not-allowed text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex flex-col items-center justify-center text-teal-700 font-bold border border-teal-200 text-[10px]">
                      <span>🏛️</span>
                      <span className="text-[8px]">Raast</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-700">Raast (PKR)</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          MAINTENANCE
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-600 font-medium mt-0.5">
                        Temporarily unavailable
                      </div>
                    </div>
                  </div>
                </div>

                {/* BNB */}
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedMethod('BNB');
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 active:scale-[0.99] transition-all text-left bg-white shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black border border-amber-200">
                      BNB
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">BNB</span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mt-0.5">
                        <Zap className="w-3 h-3 fill-amber-500" />
                        <span>Instant</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>

                {/* Tron (TRX) */}
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedMethod('Tron (TRX)');
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 active:scale-[0.99] transition-all text-left bg-white shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-black border border-red-200 text-xs">
                      TRX
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">Tron (TRX)</span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mt-0.5">
                        <Zap className="w-3 h-3 fill-amber-500" />
                        <span>Instant</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>

                {/* Ethereum */}
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedMethod('Ethereum');
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 active:scale-[0.99] transition-all text-left bg-white shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black border border-indigo-200">
                      Ξ
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">Ethereum</span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mt-0.5">
                        <Zap className="w-3 h-3 fill-amber-500" />
                        <span>Instant</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </>
          ) : (
            /* Selected Crypto Deposit Checkout Flow */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  onClick={() => setSelectedMethod(null)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  ← Back to methods
                </button>
                <span className="text-xs font-bold text-slate-700">{selectedMethod} Deposit</span>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Deposit Amount
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2 font-mono-numbers">
                  {[20, 50, 100, 500].map((val) => (
                    <button
                      key={val}
                      onClick={() => setDepositAmount(val)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        depositAmount === val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Math.max(10, Number(e.target.value) || 10))}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-sm font-bold font-mono-numbers text-slate-800"
                  />
                </div>
              </div>

              {/* First Deposit Bonus +70% Banner */}
              <div
                onClick={() => setApplyBonus(!applyBonus)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  applyBonus
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-900">FIRST DEPOSIT BONUS</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                      +70%
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                    Receive extra +${(depositAmount * 0.7).toFixed(2)} trading balance free
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={applyBonus}
                  onChange={() => {}}
                  className="w-4 h-4 text-indigo-600 rounded-sm"
                />
              </div>

              {/* Simulated QR & Address */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-xs border border-slate-200 mb-3 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900 rounded-lg">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-xs ${
                          (i * 3) % 2 === 0 ? 'bg-white' : 'bg-indigo-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-medium mb-1">
                  Network: TRC20 (Fast & Zero Gas)
                </span>

                <div className="flex items-center gap-2 w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono-numbers">
                  <span className="truncate flex-1 text-slate-700 text-left">{mockAddress}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-slate-100 rounded-lg text-indigo-600 shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm / Simulate Button */}
              <button
                onClick={handleCompleteDeposit}
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 text-xs">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing blockchain verification...
                  </span>
                ) : (
                  <>
                    <span>Confirm & Credit ${applyBonus ? (depositAmount * 1.7).toFixed(2) : depositAmount.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
