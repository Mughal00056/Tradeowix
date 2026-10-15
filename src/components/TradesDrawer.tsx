import React, { useState } from 'react';
import { TradeOrder, Asset } from '../types/trading';
import { AssetIcon } from './AssetIcon';
import { X, ChevronDown, Clock, CheckCircle2, XCircle, ChevronLeft, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TradesDrawerProps {
  openTrades: TradeOrder[];
  closedTrades: TradeOrder[];
  assets: Asset[];
  currentPrices: Record<string, number>;
  onClose: () => void;
  onSelectTrade?: (trade: TradeOrder) => void;
}

export const TradesDrawer: React.FC<TradesDrawerProps> = ({
  openTrades,
  closedTrades,
  assets,
  currentPrices,
  onClose,
  onSelectTrade,
}) => {
  const [tab, setTab] = useState<'open' | 'closed'>('open');

  const totalPL = openTrades.reduce((acc, t) => {
    const cur = currentPrices[t.assetId] || t.entryPrice;
    const isWinning =
      (t.direction === 'HIGHER' && cur > t.entryPrice) ||
      (t.direction === 'LOWER' && cur < t.entryPrice);
    const returnAmount = isWinning ? (t.amount * t.payoutPercent) / 100 : -t.amount;
    return acc + returnAmount;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Soft pastel ambient background orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
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
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-200/60">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Trades & Portfolio
                  </h1>
                  {openTrades.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-[10px] font-bold font-mono-numbers">
                      {openTrades.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">Active positions & historical settlements</p>
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

        {/* P/L Status Bar */}
        {openTrades.length > 0 && (
          <div className="px-4 sm:px-8 py-3 bg-white/60 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between shrink-0 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Total Active P/L:</span>
              <span
                className={`font-mono-numbers font-black text-base ${
                  totalPL >= 0 ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {totalPL >= 0 ? `+$${totalPL.toFixed(2)}` : `-$${Math.abs(totalPL).toFixed(2)}`}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Real-time calculations</span>
          </div>
        )}

        {/* Tabs: Active vs Closed */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 border-b border-slate-200/70 bg-white/70 backdrop-blur-md shrink-0 flex items-center gap-6">
          <button
            onClick={() => {
              playClickSound();
              setTab('open');
            }}
            className={`py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative cursor-pointer ${
              tab === 'open' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-700 border-b-2 border-transparent'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Active Positions ({openTrades.length})</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setTab('closed');
            }}
            className={`py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative cursor-pointer ${
              tab === 'closed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-700 border-b-2 border-transparent'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Closed History ({closedTrades.length})</span>
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-3 max-w-5xl mx-auto w-full custom-scrollbar">
          {tab === 'open' ? (
            openTrades.length === 0 ? (
              <div className="py-24 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-1" />
                <p className="text-sm text-slate-600 font-bold">No active trades in portfolio</p>
                <p className="text-xs text-slate-400 mt-1">Execute HIGHER or LOWER on the chart to start a live trade</p>
              </div>
            ) : (
              openTrades.map((t) => {
                const now = Date.now();
                const remainingSec = Math.max(0, Math.ceil((t.expireTime - now) / 1000));
                const curPrice = currentPrices[t.assetId] || t.entryPrice;
                const isWinning =
                  (t.direction === 'HIGHER' && curPrice > t.entryPrice) ||
                  (t.direction === 'LOWER' && curPrice < t.entryPrice);
                const plAmount = isWinning
                  ? (t.amount * t.payoutPercent) / 100
                  : -t.amount;

                const assetObj = assets.find((a) => a.id === t.assetId);
                const flags = assetObj ? assetObj.flags : (['eu', 'us'] as [string, string]);

                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      playClickSound();
                      onSelectTrade?.(t);
                      onClose();
                    }}
                    className="p-4 bg-white/75 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex items-center justify-between cursor-pointer group"
                    title="Tap to show on chart"
                  >
                    <div className="flex items-center gap-3.5">
                      <AssetIcon flags={flags} size="md" />
                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                          {t.assetSymbol}
                        </div>
                        <div className="text-xs font-mono-numbers text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1 font-semibold text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            00:{remainingSec.toString().padStart(2, '0')}
                          </span>
                          <span>•</span>
                          <span>Strike: {t.entryPrice.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={`font-mono-numbers font-black text-sm sm:text-base ${
                            isWinning ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {isWinning ? `+$${plAmount.toFixed(2)}` : `-$${t.amount.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono-numbers mt-0.5 font-bold flex items-center justify-end gap-1">
                        <span>${t.amount.toFixed(2)}</span>
                        <span className={t.direction === 'HIGHER' ? 'text-emerald-600' : 'text-red-500'}>
                          {t.direction === 'HIGHER' ? '▲ HIGHER' : '▼ LOWER'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : closedTrades.length === 0 ? (
            <div className="py-24 text-center text-sm text-slate-400">
              No closed trades recorded yet. Completed trades will automatically appear here.
            </div>
          ) : (
            closedTrades.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  playClickSound();
                  onSelectTrade?.(t);
                  onClose();
                }}
                className="p-4 bg-white/75 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex items-center justify-between cursor-pointer group"
                title="Tap to show trade on graph"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${
                      t.status === 'WON'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {t.status === 'WON' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </span>
                  <div>
                    <div className="text-sm font-extrabold text-slate-800">{t.assetSymbol}</div>
                    <div className="text-xs text-slate-400 font-mono-numbers mt-0.5">
                      {new Date(t.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · {t.direction}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono-numbers">
                  <div
                    className={`text-sm sm:text-base font-black ${
                      t.status === 'WON' ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {t.status === 'WON' ? `+$${t.profit.toFixed(2)}` : `-$${t.amount.toFixed(2)}`}
                  </div>
                  <div className="text-xs text-slate-400">
                    Exit: {t.exitPrice?.toFixed(4) || '--'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
