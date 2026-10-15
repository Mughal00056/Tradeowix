import React from 'react';
import { TradingSignal, Asset } from '../types/trading';
import { X, Radio, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface SignalsModalProps {
  signals: TradingSignal[];
  assets: Asset[];
  onSelectSignal: (assetId: string, direction: 'HIGHER' | 'LOWER') => void;
  onClose: () => void;
}

export const SignalsModal: React.FC<SignalsModalProps> = ({
  signals,
  assets,
  onSelectSignal,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <span className="font-extrabold text-base text-slate-900">Trading Signals</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              LIVE
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

        {/* Signals feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-950 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>High-frequency algorithmic signals updated every 30 seconds for OTC and Forex markets.</span>
          </div>

          {signals.map((sig) => {
            const isHigher = sig.direction === 'HIGHER';
            return (
              <div
                key={sig.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                      isHigher ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  >
                    {isHigher ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{sig.assetSymbol}</span>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono-numbers">
                        {sig.timeframe}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[11px] font-bold ${
                          isHigher ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {sig.direction}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        Accuracy: <span className="text-indigo-600 font-mono-numbers">{sig.confidence}%</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    onSelectSignal(sig.assetId, sig.direction);
                    onClose();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs active:scale-95 transition-all ${
                    isHigher ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Trade {sig.direction}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
