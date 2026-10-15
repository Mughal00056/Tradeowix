import React, { useState } from 'react';
import { TradeOrder, Asset } from '../types/trading';
import { AssetIcon } from './AssetIcon';
import { X, ChevronDown, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TradesDrawerProps {
  openTrades: TradeOrder[];
  closedTrades: TradeOrder[];
  assets: Asset[];
  currentPrices: Record<string, number>;
  onClose: () => void;
}

export const TradesDrawer: React.FC<TradesDrawerProps> = ({
  openTrades,
  closedTrades,
  assets,
  currentPrices,
  onClose,
}) => {
  const [tab, setTab] = useState<'open' | 'closed'>('open');

  // Total current P/L
  const totalPL = openTrades.reduce((acc, t) => {
    const cur = currentPrices[t.assetId] || t.entryPrice;
    const isWinning =
      (t.direction === 'HIGHER' && cur > t.entryPrice) ||
      (t.direction === 'LOWER' && cur < t.entryPrice);
    const returnAmount = isWinning ? (t.amount * t.payoutPercent) / 100 : -t.amount;
    return acc + returnAmount;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/35 backdrop-blur-md animate-in fade-in duration-150">
      {/* Frosted Glass Container (Screenshot Capture+_2026-10-15-12-01-48.png) */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-t-3xl sm:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl border border-white/60 overflow-hidden">
        {/* Soft pastel ambient background orbs */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Header matching Screenshot 11: 💼 Portfolio  (1)   ✕ */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3.5 border-b border-slate-100/80 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-200/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight">Portfolio</span>
            {openTrades.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-[10px] font-bold font-mono-numbers">
                {openTrades.length}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top P/L Status Bar (Screenshot 11: P/L +$0.81) */}
        {openTrades.length > 0 && (
          <div className="relative z-10 px-4 py-2 border-b border-slate-100/60 bg-white/40 flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400">P/L</span>
            <span
              className={`font-mono-numbers font-bold text-sm ${
                totalPL >= 0 ? 'text-[#10b981]' : 'text-red-500'
              }`}
            >
              {totalPL >= 0 ? `+$${totalPL.toFixed(2)}` : `-$${Math.abs(totalPL).toFixed(2)}`}
            </span>
          </div>
        )}

        {/* Tabs: Active vs Closed */}
        <div className="relative z-10 flex border-b border-slate-100/80 px-4 pt-1 bg-white/30">
          <button
            onClick={() => {
              playClickSound();
              setTab('open');
            }}
            className={`flex-1 py-2 text-xs font-bold transition-all relative ${
              tab === 'open' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Active ({openTrades.length})
            {tab === 'open' && (
              <span className="absolute bottom-0 inset-x-4 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => {
              playClickSound();
              setTab('closed');
            }}
            className={`flex-1 py-2 text-xs font-bold transition-all relative ${
              tab === 'closed' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Closed History ({closedTrades.length})
            {tab === 'closed' && (
              <span className="absolute bottom-0 inset-x-4 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* List of trades (Screenshot 11 layout) */}
        <div className="relative z-10 flex-1 overflow-y-auto divide-y divide-slate-100/80 p-2">
          {tab === 'open' ? (
            openTrades.length === 0 ? (
              <div className="py-14 text-center">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2 stroke-1" />
                <p className="text-xs text-slate-500 font-semibold">No active trades in portfolio</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Execute HIGHER or LOWER to begin</p>
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
                    className="p-3 hover:bg-slate-50/50 rounded-2xl transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <AssetIcon flags={flags} size="sm" />
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 tracking-tight">
                          {t.assetSymbol.replace(' (OTC)', '')}
                        </div>
                        <div className="text-[11px] font-mono-numbers text-slate-400 mt-0.5">
                          0:{remainingSec.toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span
                          className={`font-mono-numbers font-black text-xs ${
                            isWinning ? 'text-[#10b981]' : 'text-red-500'
                          }`}
                        >
                          {isWinning ? `+$${plAmount.toFixed(2)}` : `-$${t.amount.toFixed(2)}`}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-numbers mt-0.5">
                        ${t.amount.toFixed(2)} {t.direction === 'HIGHER' ? '↗' : '↘'}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : closedTrades.length === 0 ? (
            <div className="py-14 text-center text-xs text-slate-400">
              No closed trades recorded yet
            </div>
          ) : (
            closedTrades.map((t) => (
              <div
                key={t.id}
                className="p-3 hover:bg-slate-50/50 rounded-xl transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      t.status === 'WON'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {t.status === 'WON' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.assetSymbol}</div>
                    <div className="text-[10px] text-slate-400 font-mono-numbers">
                      {new Date(t.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {t.direction}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono-numbers">
                  <div
                    className={`text-xs font-bold ${
                      t.status === 'WON' ? 'text-[#10b981]' : 'text-red-500'
                    }`}
                  >
                    {t.status === 'WON' ? `+$${t.profit.toFixed(2)}` : `-$${t.amount.toFixed(2)}`}
                  </div>
                  <div className="text-[10px] text-slate-400">
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
