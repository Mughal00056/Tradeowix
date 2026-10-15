import React from 'react';
import { UserProfile } from '../types/trading';
import {
  X,
  User,
  Wallet,
  ArrowDownLeft,
  Receipt,
  BarChart3,
  TrendingUp,
  HelpCircle,
  ShieldAlert,
  LogOut,
  ChevronRight,
  AlertCircle,
  Edit2
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface UserProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onUpdateName?: (name: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onNavigate,
  onUpdateName,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-150 select-none">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Profile Card Container (Glass UI Blur & Mobile Dimensions) */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-3xl h-full sm:h-auto sm:max-h-[92vh] sm:my-3 sm:mr-3 rounded-l-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-y-auto border border-white/70 z-10 animate-in slide-in-from-right duration-200">
        {/* Close button header */}
        <div className="flex items-center justify-end p-3 pb-0">
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

        {/* User Profile Header (Screenshot 2) */}
        <div className="px-5 pt-1 pb-4 flex flex-col items-start border-b border-slate-100">
          <div className="flex items-center gap-3.5 mb-3">
            {/* Purple Bag Avatar */}
            <div className="relative w-12 h-12 rounded-full bg-[#5b21b6] text-white flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5"
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
              {/* Exclamation badge */}
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-slate-400 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                !
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 tracking-tight">
                  {user.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                {user.email}
              </span>
            </div>
          </div>

          {/* Not Verified Banner (Screenshot 2) */}
          <button
            onClick={() => {
              playClickSound();
              onNavigate('kyc');
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition-colors mb-2 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold text-xs">!</span>
              <span className="text-xs font-semibold text-slate-700">
                {user.isVerified ? 'Verified Account' : 'Not Verified'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* User ID */}
          <div className="text-[11px] text-slate-400 font-mono-numbers">
            ID: <span className="text-slate-600 font-semibold">{user.id}</span>
          </div>
        </div>

        {/* ACCOUNT LIST (Exact match to Screenshot 2) */}
        <div className="flex-1 px-3 py-2 space-y-0.5">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            ACCOUNT
          </div>

          <button
            onClick={() => {
              playClickSound();
              onNavigate('profile');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>Personal Area</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigate('deposit');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
          >
            <Wallet className="w-4 h-4 text-slate-400" />
            <span>Top Up</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigate('withdraw');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
          >
            <ArrowDownLeft className="w-4 h-4 text-slate-400" />
            <span>Withdrawals</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigate('transactions');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
          >
            <Receipt className="w-4 h-4 text-slate-400" />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigate('trades');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
          >
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span>Trades</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigate('stats');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
          >
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span>Trading Stats</span>
          </button>

          <div className="h-px bg-slate-100 my-1.5" />

          <button
            onClick={() => {
              playClickSound();
              onNavigate('help');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help Center</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigate('kyc');
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>KYC Verification</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </button>

          <button
            onClick={() => {
              playClickSound();
              alert('Logged out demo session. You can continue trading anytime without an account.');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-xs font-semibold"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
