import React from 'react';
import { TradingSignal, Asset } from '../types/trading';
import { X, Radio, ArrowUpRight, ArrowDownRight, Zap, ChevronLeft } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Glow orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Header with Back button and Close */}
        <div className="h-16 px-4 sm:px-8 border-b border-slate-200/70 flex items-center justify-between bg-white/75 backdrop-blur-xl shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-10 h-10 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs border border-slate-200/60"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200/60">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Trading Signals
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200/60">
                    LIVE FEED
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Algorithmic probability indicators</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95 cursor-pointer border border-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Signals feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 max-w-5xl mx-auto w-full custom-scrollbar">
          <div className="p-4 bg-indigo-50/80 backdrop-blur-md rounded-2xl border border-indigo-200/60 text-xs sm:text-sm text-indigo-950 flex items-center gap-3 shadow-xs">
            <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>High-frequency algorithmic signals updated every 30 seconds for OTC and Forex pairs with confidence scores.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {signals.map((sig) => {
              const isHigher = sig.direction === 'HIGHER';
              const assetObj = assets.find((a) => a.id === sig.assetId);
              return (
                <div
                  key={sig.id}
                  className="p-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-black ${
                        isHigher
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {isHigher ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                        {sig.assetSymbol}
                      </div>
                      <div className="text-xs text-slate-400 font-mono-numbers mt-0.5">
                        Duration: {sig.timeframe} • Probability: <span className="font-bold text-slate-700">{sig.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      onSelectSignal(sig.assetId, sig.direction);
                    }}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs text-white shadow-md active:scale-95 transition-all cursor-pointer ${
                      isHigher
                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                        : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                    }`}
                  >
                    TRADE {sig.direction}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
