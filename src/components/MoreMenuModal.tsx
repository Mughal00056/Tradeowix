import React from 'react';
import {
  X,
  Send,
  Coins,
  Gift,
  Trophy,
  Bell,
  Clock,
  Radio,
  User,
  Wallet,
  BarChart2,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  Settings,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface MoreMenuModalProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  onClose,
  onNavigate,
}) => {
  const menuItems = [
    {
      id: 'bonus',
      label: 'First Deposit Bonus',
      badge: '+70%',
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300/60',
      icon: Coins,
      iconBg: 'bg-amber-50 text-amber-500 border border-amber-200/50',
    },
    {
      id: 'rewards',
      label: 'Trading Rewards',
      icon: Gift,
      iconBg: 'bg-purple-50 text-purple-500 border border-purple-200/50',
    },
    {
      id: 'leaderboard',
      label: 'Trader Leaderboard',
      icon: Trophy,
      iconBg: 'bg-amber-50 text-amber-500 border border-amber-200/50',
    },
    {
      id: 'alerts',
      label: 'Price Alerts',
      icon: Bell,
      iconBg: 'bg-purple-50 text-purple-500 border border-purple-200/50',
    },
    {
      id: 'pending',
      label: 'Pending Orders',
      icon: Clock,
      iconBg: 'bg-indigo-50 text-indigo-500 border border-indigo-200/50',
    },
    {
      id: 'signals',
      label: 'AI Trading Signals',
      badge: 'PRO',
      badgeColor: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      icon: Radio,
      iconBg: 'bg-emerald-50 text-emerald-500 border border-emerald-200/50',
    },
    {
      id: 'profile',
      label: 'Profile & Account Details',
      icon: User,
      iconBg: 'bg-indigo-50 text-indigo-500 border border-indigo-200/50',
    },
    {
      id: 'finance',
      label: 'Deposit & Withdraw',
      icon: Wallet,
      iconBg: 'bg-emerald-50 text-emerald-500 border border-emerald-200/50',
    },
    {
      id: 'telegram',
      label: 'Official Telegram Channel',
      icon: Send,
      iconBg: 'bg-sky-50 text-sky-500 border border-sky-200/50',
    },
    {
      id: 'stats',
      label: 'Performance Statistics',
      icon: BarChart2,
      iconBg: 'bg-purple-50 text-purple-500 border border-purple-200/50',
    },
    {
      id: 'verification',
      label: 'Account Verification (KYC)',
      badge: 'Verified',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      icon: ShieldCheck,
      iconBg: 'bg-slate-100 text-slate-600 border border-slate-200/50',
    },
    {
      id: 'help',
      label: 'Help & Knowledge Center',
      icon: HelpCircle,
      iconBg: 'bg-sky-50 text-sky-500 border border-sky-200/50',
    },
    {
      id: 'report',
      label: 'Report an Issue',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-500 border border-amber-200/50',
    },
    {
      id: 'settings',
      label: 'Platform Settings',
      icon: Settings,
      iconBg: 'bg-slate-100 text-slate-600 border border-slate-200/50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Glow orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

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
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 font-bold">
                ≡
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Features & Tools
                </h1>
                <p className="text-xs text-slate-400 font-medium">Platform navigation & services</p>
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

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-5xl mx-auto w-full custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playClickSound();
                    if (item.id === 'telegram') {
                      window.open('https://t.me/tradowix', '_blank');
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-xl border border-white/80 hover:border-slate-200/80 shadow-2xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBg} shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Open {item.label.toLowerCase()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
