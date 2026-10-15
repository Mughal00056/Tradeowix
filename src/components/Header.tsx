import React, { useState } from 'react';
import { Asset, UserProfile, TradeOrder } from '../types/trading';
import { AssetIcon } from './AssetIcon';
import { ChevronDown, Briefcase, RefreshCw, Check } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  currentAsset: Asset;
  user: UserProfile;
  openTrades: TradeOrder[];
  currentPrice: number;
  onOpenAssetSelector: () => void;
  onOpenAssetInfo?: () => void;
  onOpenProfile: () => void;
  onOpenAccountModal?: () => void;
  onSwitchAccountType: (type: 'DEMO' | 'REAL') => void;
  onResetDemoBalance: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAsset,
  user,
  openTrades,
  currentPrice,
  onOpenAssetSelector,
  onOpenAssetInfo,
  onOpenProfile,
  onOpenAccountModal,
  onSwitchAccountType,
  onResetDemoBalance,
}) => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const activeBalance = user.accountType === 'DEMO' ? user.demoBalance : user.realBalance;

  // Active trade on current asset
  const activeTrade = openTrades.find((t) => t.assetId === currentAsset.id);
  const isWinning = activeTrade
    ? (activeTrade.direction === 'HIGHER' && currentPrice > activeTrade.entryPrice) ||
      (activeTrade.direction === 'LOWER' && currentPrice < activeTrade.entryPrice)
    : false;

  const currentTradePL = activeTrade
    ? isWinning
      ? `+$${((activeTrade.amount * activeTrade.payoutPercent) / 100).toFixed(1)}`
      : `-$${activeTrade.amount.toFixed(1)}`
    : null;

  return (
    <header className="h-14 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between select-none relative z-30">
      {/* LEFT: Asset Selector Button & Info "i" Button */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            playClickSound();
            onOpenAssetSelector();
          }}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-50/90 active:scale-98 transition-all shadow-xs cursor-pointer"
        >
          <AssetIcon flags={currentAsset.flags} size="sm" />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs text-slate-800 tracking-tight">
                {currentAsset.symbol.replace(' (OTC)', '')}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            <div className="flex items-center gap-1 leading-none">
              <span className="text-[10px] font-bold text-emerald-600 font-mono-numbers">
                {currentAsset.payoutPercent}%
              </span>

              {/* Live trade P/L in header (Screenshots 5 & 6) */}
              {currentTradePL && (
                <span
                  className={`text-[10px] font-mono-numbers font-black ${
                    isWinning ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {currentTradePL}
                </span>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* RIGHT CONTROLS: Balance Pill & User Avatar */}
      <div className="flex items-center gap-2">
        {/* Balance Pill Button (Opens Account Switcher Modal) */}
        <div className="relative">
          <button
            onClick={() => {
              playClickSound();
              if (onOpenAccountModal) {
                onOpenAccountModal();
              } else {
                setShowAccountDropdown(!showAccountDropdown);
              }
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-98 transition-all shadow-xs cursor-pointer"
            title="Trading Account & Balances"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono-numbers font-bold text-xs text-slate-800">
              ${activeBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                user.accountType === 'DEMO'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300/60'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
              }`}
            >
              {user.accountType}
            </span>
          </button>

          {/* Account Dropdown Switcher (Fallback if modal not used) */}
          {showAccountDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-2.5 z-40 animate-in fade-in duration-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Select Account
              </div>

              {/* Demo Account Option */}
              <button
                onClick={() => {
                  playClickSound();
                  onSwitchAccountType('DEMO');
                  setShowAccountDropdown(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors mb-1 ${
                  user.accountType === 'DEMO'
                    ? 'bg-amber-50/70 border border-amber-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">Demo Account</span>
                    <span className="text-[9px] font-bold px-1 rounded-sm bg-amber-200 text-amber-900">DEMO</span>
                  </div>
                  <div className="text-xs font-mono-numbers font-extrabold text-amber-700 mt-0.5">
                    ${user.demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                {user.accountType === 'DEMO' && <Check className="w-4 h-4 text-amber-600" />}
              </button>

              {/* Real Account Option */}
              <button
                onClick={() => {
                  playClickSound();
                  onSwitchAccountType('REAL');
                  setShowAccountDropdown(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors mb-2 ${
                  user.accountType === 'REAL'
                    ? 'bg-emerald-50/70 border border-emerald-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">Real Account</span>
                    <span className="text-[9px] font-bold px-1 rounded-sm bg-emerald-200 text-emerald-900">REAL</span>
                  </div>
                  <div className="text-xs font-mono-numbers font-extrabold text-emerald-700 mt-0.5">
                    ${user.realBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                {user.accountType === 'REAL' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* Reset Demo Balance button */}
              <button
                onClick={() => {
                  playClickSound();
                  onResetDemoBalance();
                  setShowAccountDropdown(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                Reset Demo to $10,000.00
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar Icon (Purple circle with bag and ! badge) */}
        <button
          onClick={() => {
            playClickSound();
            onOpenProfile();
          }}
          className="relative w-9 h-9 rounded-full bg-[#5b21b6] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
          title="Account Profile"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>

          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-slate-400 text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white">
            !
          </span>
        </button>
      </div>
    </header>
  );
};
