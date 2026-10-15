import React from 'react';
import { X, Trophy, Shield, Info } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface LeaderboardModalProps {
  onClose: () => void;
  userName?: string;
  userTradesCount?: number;
  userProfit?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  userName = 'Apex Store',
  userTradesCount = 0,
  userProfit = 0,
}) => {
  const leaders = [
    { rank: 1, name: 'Ishara Palihawadana', flag: '', shield: 'purple', profit: '+$30k+' },
    { rank: 2, name: 'Kabir Verma', flag: '', shield: 'purple', profit: '+$28,415' },
    { rank: 3, name: 'Jawahir Al-Marzouq', flag: '', shield: 'purple', profit: '+$25,394' },
    { rank: 4, name: 'Fatima Shah', flag: '🇵🇰', shield: 'purple', profit: '+$24,591' },
    { rank: 5, name: 'Valeria Mendoza', flag: '🇲🇽', shield: 'purple', profit: '+$20,255' },
    { rank: 6, name: 'Zephyr Lee', flag: '🇦🇺', shield: 'purple', profit: '+$19,574' },
    { rank: 7, name: 'Sara Hayat', flag: '🇵🇰', shield: 'purple', profit: '+$17,015' },
    { rank: 8, name: 'Nadia Akhtar', flag: '🇵🇰', shield: 'purple', profit: '+$14,923' },
    { rank: 9, name: 'Aarav Sharma', flag: '🇮🇳', shield: 'amber', profit: '+$11,946' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Soft pastel ambient background orbs */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Header (Screenshot Capture+_2026-10-15-12-05-18.png) */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3.5 border-b border-slate-100/80 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-200/60 shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight">Leaderboard</span>
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

        {/* Content */}
        <div className="relative z-10 p-4 overflow-y-auto space-y-3">
          {/* User top rating card (Screenshot 10) */}
          <div className="p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6366f1] text-white flex items-center justify-center font-black text-lg shadow-sm">
                  ··
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🇵🇰</span>
                    <span className="font-extrabold text-xs text-slate-900">{userName}</span>
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {userTradesCount} trades today
                  </div>
                </div>
              </div>

              <div className="text-right font-mono-numbers">
                <div className="text-xs font-black text-[#10b981]">
                  {userProfit >= 0 ? `+$${userProfit.toFixed(2)}` : `-$${Math.abs(userProfit).toFixed(2)}`}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                  {userTradesCount} trades
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer pt-1 border-t border-slate-100/60">
              <Info className="w-3.5 h-3.5" />
              <span>How does this rating work?</span>
            </div>
          </div>

          {/* Table Header Row */}
          <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 font-semibold">
            <div className="flex items-center gap-4">
              <span className="w-6">Rank</span>
              <span>Trader</span>
            </div>
            <span>P&L</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-slate-100/60 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 overflow-hidden">
            {leaders.map((leader) => {
              return (
                <div
                  key={leader.rank}
                  className="flex items-center justify-between px-3 py-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank indicator */}
                    <div className="w-6 flex items-center justify-center font-bold text-xs text-slate-500 font-mono-numbers">
                      {leader.rank === 1 ? (
                        <span className="text-base text-amber-500">🥇</span>
                      ) : leader.rank === 2 ? (
                        <span className="text-base text-slate-400">🥈</span>
                      ) : leader.rank === 3 ? (
                        <span className="text-base text-amber-700">🥉</span>
                      ) : (
                        leader.rank
                      )}
                    </div>

                    {/* Avatar / Flag */}
                    <div className="w-7 h-7 rounded-full bg-slate-200/80 flex items-center justify-center text-xs text-slate-500 font-bold overflow-hidden">
                      {leader.flag ? (
                        <span className="text-sm">{leader.flag}</span>
                      ) : (
                        <span>👤</span>
                      )}
                    </div>

                    {/* Name + Shield */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-slate-800">
                        {leader.name}
                      </span>
                      <Shield
                        className={`w-3.5 h-3.5 ${
                          leader.shield === 'purple'
                            ? 'text-purple-500 fill-purple-100'
                            : 'text-amber-500 fill-amber-100'
                        }`}
                      />
                    </div>
                  </div>

                  {/* P&L */}
                  <div className="text-xs font-black font-mono-numbers text-[#10b981]">
                    {leader.profit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
