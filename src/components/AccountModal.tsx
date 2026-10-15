import React from 'react';
import { UserProfile } from '../types/trading';
import {
  X,
  Briefcase,
  Check,
  RefreshCw,
  Wallet,
  ArrowDownLeft,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Receipt,
  LogOut,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface AccountModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSwitchAccountType: (type: 'DEMO' | 'REAL') => void;
  onResetDemoBalance: () => void;
  onNavigate: (view: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  user,
  isOpen,
  onClose,
  onSwitchAccountType,
  onResetDemoBalance,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Glass Modal Container (Mobile Size: max-w-md w-full) */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/60 z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-250">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 border border-purple-200/60 shadow-2xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">Trading Account</h2>
              <p className="text-[11px] text-slate-400 font-medium">Switch account or manage wallet</p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95 cursor-pointer border border-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {/* User Profile Mini Card */}
          <div className="p-3.5 bg-linear-to-r from-purple-50 to-indigo-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-[#5b21b6] text-white flex items-center justify-center shadow-md shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-slate-400 text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white">
                  !
                </span>
              </div>
              <div className="overflow-hidden">
                <div className="font-extrabold text-sm text-slate-900 truncate">{user.name}</div>
                <div className="text-[11px] text-slate-500 font-mono-numbers">ID: {user.id}</div>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
                onNavigate('kyc');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 hover:bg-white rounded-xl border border-purple-200/70 shadow-2xs text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
            >
              {user.isVerified ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Verified</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-amber-700">Verify</span>
                </>
              )}
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Account Selection Section */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Select Active Account
            </div>

            {/* DEMO / PRACTICE ACCOUNT */}
            <div
              onClick={() => {
                playClickSound();
                onSwitchAccountType('DEMO');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                user.accountType === 'DEMO'
                  ? 'bg-amber-50/80 border-amber-300 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white/80 border-slate-200 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                      user.accountType === 'DEMO'
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {user.accountType === 'DEMO' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">Practice Demo Account</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-200/80 text-amber-900">
                        DEMO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Risk-free virtual balance for practice</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-numbers font-black text-base text-amber-700">
                    ${user.demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Reset Demo Balance Button */}
              <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-[11px] text-amber-800 font-medium">Refill virtual practice funds:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onResetDemoBalance();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-amber-100/70 border border-amber-300 rounded-xl text-xs font-bold text-amber-800 transition-all active:scale-95 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3 text-amber-600" />
                  <span>Reset to $10,000</span>
                </button>
              </div>
            </div>

            {/* REAL ACCOUNT */}
            <div
              onClick={() => {
                playClickSound();
                onSwitchAccountType('REAL');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                user.accountType === 'REAL'
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-white/80 border-slate-200 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                      user.accountType === 'REAL'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {user.accountType === 'REAL' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">Real Money Account</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900">
                        REAL
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Live profit withdrawals & trading</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-numbers font-black text-base text-emerald-700">
                    ${user.realBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Deposit CTA */}
              <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  +70% Bonus on 1st Deposit
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onClose();
                    onNavigate('deposit');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <Wallet className="w-3 h-3" />
                  <span>Deposit Funds</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => {
                playClickSound();
                onClose();
                onNavigate('deposit');
              }}
              className="p-3 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-200 rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">Deposit</div>
                <div className="text-[10px] text-slate-400">Instant top-up</div>
              </div>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onClose();
                onNavigate('withdraw');
              }}
              className="p-3 bg-white hover:bg-purple-50/60 border border-slate-200 hover:border-purple-200 rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-105 transition-transform">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">Withdraw</div>
                <div className="text-[10px] text-slate-400">Cash out profit</div>
              </div>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onClose();
                onNavigate('trades');
              }}
              className="p-3 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">Trade History</div>
                <div className="text-[10px] text-slate-400">Settlements</div>
              </div>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onClose();
                onNavigate('stats');
              }}
              className="p-3 bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-200 rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">Trading Stats</div>
                <div className="text-[10px] text-slate-400">Win rate & P/L</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
