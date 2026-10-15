import React, { useState } from 'react';
import { Asset } from '../types/trading';
import { AssetIcon } from './AssetIcon';
import {
  X,
  TrendingUp,
  Clock,
  Zap,
  Calendar,
  Sliders,
  Info,
  ShieldCheck,
  ChevronLeft,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface AssetInfoModalProps {
  asset: Asset;
  currentPrice: number;
  onClose: () => void;
}

export const AssetInfoModal: React.FC<AssetInfoModalProps> = ({
  asset,
  currentPrice,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'conditions'>('info');

  const pairParts = asset.symbol.replace(' (OTC)', '').split('/');
  const baseCurrency = pairParts[0] || 'EUR';
  const quoteCurrency = pairParts[1] || 'USD';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Ambient Glass Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200/35 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Navigation Bar with Back button & Close */}
        <div className="h-16 px-4 sm:px-8 border-b border-slate-200/70 flex items-center justify-between bg-white/75 backdrop-blur-xl shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-10 h-10 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs border border-slate-200/60"
              title="Back to Chart"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <AssetIcon flags={asset.flags} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {asset.symbol}
                  </h1>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Market Open
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {asset.name} • {asset.category === 'forex' ? 'Currency Pairs' : asset.category.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95 cursor-pointer border border-slate-200/60"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Ticker Bar */}
        <div className="px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-white/60 backdrop-blur-md border-b border-slate-200/50 shrink-0">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Price:</span>
            <span className="text-2xl sm:text-3xl font-black font-mono-numbers text-slate-900 tracking-tight">
              {currentPrice.toFixed(asset.decimals)}
            </span>
            <span
              className={`text-xs font-extrabold px-2.5 py-1 rounded-lg font-mono-numbers flex items-center gap-1 ${
                asset.change24h >= 0
                  ? 'bg-emerald-100/90 text-emerald-700 border border-emerald-200'
                  : 'bg-red-100/90 text-red-700 border border-red-200'
              }`}
            >
              {asset.change24h >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {asset.change24h >= 0 ? `+${asset.change24h}%` : `${asset.change24h}%`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Payout:</span>
            <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/80 font-mono-numbers">
              +{asset.payoutPercent}%
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200/70 bg-white/80 backdrop-blur-md shrink-0 px-4 sm:px-8">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('info');
            }}
            className={`py-3.5 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'border-indigo-600 text-indigo-600 shadow-xs'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Information</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('conditions');
            }}
            className={`py-3.5 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'conditions'
                ? 'border-indigo-600 text-indigo-600 shadow-xs'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Trading Conditions</span>
          </button>
        </div>

        {/* Full Screen Scrollable Body with Glass Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full custom-scrollbar">
          {activeTab === 'info' ? (
            <div className="space-y-6">
              {/* Traders Sentiment Glass Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                      Traders Sentiment
                    </h3>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Market
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm font-black font-mono-numbers mb-2">
                  <span className="text-emerald-600 flex items-center gap-1">
                    ▲ 48% <span className="font-sans text-xs font-semibold text-slate-400">Buyers (Higher)</span>
                  </span>
                  <span className="text-red-500 flex items-center gap-1">
                    <span className="font-sans text-xs font-semibold text-slate-400">Sellers (Lower)</span> 52% ▼
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full flex overflow-hidden p-0.5 border border-slate-200/60">
                  <div className="w-[48%] bg-emerald-500 h-full rounded-l-full shadow-xs" />
                  <div className="w-[52%] bg-red-500 h-full rounded-r-full shadow-xs" />
                </div>
              </div>

              {/* Price Information Grid */}
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-1">
                  Price Statistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">24h Net Change</div>
                      <div className="font-mono-numbers font-extrabold text-sm text-emerald-600">
                        +0.00253 (+0.16%)
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100/80 flex items-center justify-center text-indigo-600 shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">24h High / Low</div>
                      <div className="font-mono-numbers font-extrabold text-sm text-slate-800">
                        {(currentPrice * 1.002).toFixed(asset.decimals)} / {(currentPrice * 0.998).toFixed(asset.decimals)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-600 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Trading Volatility</div>
                      <div className="font-mono-numbers font-extrabold text-sm text-amber-600">
                        Moderate (High Liquidity)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Specifications Table */}
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-1">
                  Asset Specifications
                </h3>
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/80 shadow-sm divide-y divide-slate-100 text-sm">
                  <div className="flex items-center justify-between py-2.5 first:pt-0">
                    <span className="text-slate-400 font-medium">Instrument Type</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                      Binary Options (OTC)
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-400 font-medium">Market Group</span>
                    <span className="font-semibold text-slate-800">Currency Pairs</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-400 font-medium">Currency Pair</span>
                    <span className="font-bold text-slate-900 font-mono-numbers">
                      {baseCurrency} / {quoteCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-400 font-medium">Price Precision</span>
                    <span className="font-semibold text-slate-800">{asset.decimals} decimal places</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-400 font-medium">Quote Source</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Interbank Aggregated Feed
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 last:pb-0">
                    <span className="text-slate-400 font-medium">Trading Commission</span>
                    <span className="font-bold text-emerald-600 font-mono-numbers">0.00% (Zero Fee)</span>
                  </div>
                </div>
              </div>

              {/* Market Trading Hours */}
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-1">
                  Operating Hours
                </h3>
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/80 shadow-sm divide-y divide-slate-100 text-sm">
                  <div className="flex items-center justify-between py-2.5 first:pt-0">
                    <span className="text-slate-400 font-medium">Market Availability</span>
                    <span className="font-bold text-emerald-600">24 Hours / 7 Days (Weekend OTC)</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 last:pb-0">
                    <span className="text-slate-400 font-medium">Active Days</span>
                    <span className="font-semibold text-slate-700 text-xs sm:text-sm">
                      Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Turbo Mode Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/80 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Turbo Mode (Clock-based)</h4>
                      <p className="text-xs text-slate-400">Fixed candle expiration cycles</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">
                    Standard
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400">Profit Rate</span>
                    <div className="text-lg font-black font-mono-numbers text-emerald-600">
                      +{asset.payoutPercent}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400">Min Investment</span>
                    <div className="text-lg font-black font-mono-numbers text-slate-800">$1</div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400">Max Investment</span>
                    <div className="text-lg font-black font-mono-numbers text-slate-800">$5,000</div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400">Durations</span>
                    <div className="text-sm font-bold font-mono-numbers text-slate-800 mt-0.5">
                      1m, 2m, 3m, 5m
                    </div>
                  </div>
                </div>
              </div>

              {/* Blitz Mode Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/80 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Blitz Mode (Timer-based)</h4>
                      <p className="text-xs text-slate-400">High speed sub-minute contracts</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                    Fast Expiry
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400">Profit Rate</span>
                    <div className="text-lg font-black font-mono-numbers text-emerald-600">
                      +{Math.max(85, asset.payoutPercent - 4)}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400">Min Investment</span>
                    <div className="text-lg font-black font-mono-numbers text-slate-800">$1</div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400">Max Investment</span>
                    <div className="text-lg font-black font-mono-numbers text-slate-800">$2,000</div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-400">Durations</span>
                    <div className="text-sm font-bold font-mono-numbers text-slate-800 mt-0.5">
                      5s, 15s, 30s
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules & Fair Execution */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Fair Execution Guarantee</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Trades are settled strictly at the exact timestamp millisecond against verified market feeds. Profit is instantly credited to your balance upon expiry.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 sm:px-8 border-t border-slate-200/70 bg-white/80 backdrop-blur-xl flex items-center justify-between shrink-0">
          <div className="hidden sm:block">
            <span className="text-xs text-slate-400 font-medium">Ready to trade {asset.symbol}?</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm tracking-wide shadow-md shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer"
          >
            Return to Trading
          </button>
        </div>
      </div>
    </div>
  );
};
