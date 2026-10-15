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
  LogOut,
  ChevronRight
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
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: Coins,
      iconBg: 'bg-amber-50 text-amber-500',
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: Gift,
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      iconBg: 'bg-amber-50 text-amber-500',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      id: 'signals',
      label: 'Signals',
      badge: 'LIVE',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      icon: Radio,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'telegram',
      label: 'Join Us',
      icon: Send,
      iconBg: 'bg-sky-50 text-sky-500',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      iconBg: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'deposit',
      label: 'Top Up',
      icon: Wallet,
      iconBg: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'stats',
      label: 'Trading Stats',
      icon: BarChart2,
      iconBg: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'withdraw',
      label: 'Withdrawals',
      icon: ShieldCheck,
      iconBg: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      iconBg: 'bg-sky-50 text-sky-500',
    },
    {
      id: 'report',
      label: 'Report Issue',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-500',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      iconBg: 'bg-slate-100 text-slate-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header (Screenshot 3: [≡] More   ✕) */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
              ≡
            </div>
            <span className="font-bold text-base text-slate-900">More</span>
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

        {/* Menu list (Screenshots 3 & 4) */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  if (item.id === 'telegram') {
                    alert('Connecting to TradoWix official trading channel: @TradoWixOfficial');
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconBg}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-800">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </button>
            );
          })}

          {/* Log Out option */}
          <button
            onClick={() => {
              playClickSound();
              alert('Session closed. No account creation needed in TradoWix demo mode!');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 text-red-500">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Log Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
