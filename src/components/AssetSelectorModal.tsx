import React, { useState, useMemo } from 'react';
import { Asset } from '../types/trading';
import { AssetIcon } from './AssetIcon';
import { Search, X, Star, ChevronUp, ChevronDown, Clock, Heart, ChevronLeft } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface AssetSelectorModalProps {
  assets: Asset[];
  currentAssetId: string;
  onSelectAsset: (asset: Asset) => void;
  onClose: () => void;
  onToggleFavorite: (assetId: string) => void;
}

export const AssetSelectorModal: React.FC<AssetSelectorModalProps> = ({
  assets,
  currentAssetId,
  onSelectAsset,
  onClose,
  onToggleFavorite,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'favorites' | 'fixed_time'>('fixed_time');
  const [isCurrencyPairsOpen, setIsCurrencyPairsOpen] = useState(true);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
        asset.name.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (activeTab === 'favorites') {
        return !!asset.favorite;
      }
      return true;
    });
  }, [assets, search, activeTab]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Full Screen Glass Container */}
      <div className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        {/* Ambient glow orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header with Back & Close */}
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
                  Select Asset
                </h1>
                <p className="text-xs text-slate-400 font-medium">Choose an instrument to trade</p>
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

        {/* Search Bar & Tabs */}
        <div className="px-4 sm:px-8 pt-4 pb-2 bg-white/60 backdrop-blur-md border-b border-slate-200/60 shrink-0 max-w-5xl mx-auto w-full">
          <div className="relative flex items-center mb-3">
            <input
              type="text"
              placeholder="Search assets (e.g. EUR/USD, GBP/USD) . . ."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/90 border border-slate-200/80 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white shadow-xs transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
          </div>

          {/* Tabs: Favorites / Fixed Time */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('favorites');
              }}
              className={`py-2 px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors relative cursor-pointer ${
                activeTab === 'favorites'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-indigo-600 text-indigo-600' : ''}`} />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('fixed_time');
              }}
              className={`py-2 px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors relative cursor-pointer ${
                activeTab === 'fixed_time'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Fixed Time Options</span>
            </button>
          </div>
        </div>

        {/* Currency Pairs Collapsible Header */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs font-bold text-slate-500 shrink-0">
          <button
            onClick={() => setIsCurrencyPairsOpen(!isCurrencyPairsOpen)}
            className="flex items-center gap-2 text-indigo-600 font-extrabold cursor-pointer"
          >
            <span className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-[11px]">
              $
            </span>
            <span>Currency Pairs</span>
            <span className="text-slate-400 text-xs font-normal font-mono-numbers">
              ({filteredAssets.length})
            </span>
            {isCurrencyPairsOpen ? (
              <ChevronUp className="w-4 h-4 text-indigo-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-12 text-slate-400 font-semibold pr-4">
            <span>24h Trend</span>
            <span>Payout Rate</span>
          </div>
        </div>

        {/* Full Screen Scrollable Asset List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 space-y-2 max-w-5xl mx-auto w-full custom-scrollbar">
          {filteredAssets.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              No assets found matching your search.
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isSelected = asset.id === currentAssetId;
              const isPositive = asset.change24h >= 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    playClickSound();
                    onSelectAsset(asset);
                  }}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-200/80 shadow-xs'
                      : 'bg-white/60 hover:bg-white/95 border-slate-200/60 shadow-2xs'
                  }`}
                >
                  {/* Left: Flags & Symbol */}
                  <div className="flex items-center gap-3.5">
                    <AssetIcon flags={asset.flags} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                          {asset.symbol}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-600 text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  {/* Right: 24h change, Profit Pill, Star */}
                  <div className="flex items-center gap-4 sm:gap-8">
                    <span
                      className={`text-xs sm:text-sm font-mono-numbers font-bold ${
                        isPositive ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {isPositive ? `+${asset.change24h.toFixed(2)}%` : `${asset.change24h.toFixed(2)}%`}
                    </span>

                    {/* Green Profit Pill */}
                    <span className="px-3 py-1 bg-[#10b981] hover:bg-[#059669] text-white font-mono-numbers font-black text-xs sm:text-sm rounded-lg shadow-xs shadow-emerald-500/20">
                      +{asset.payoutPercent}%
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        onToggleFavorite(asset.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-amber-50/50 transition-colors cursor-pointer"
                      title="Favorite"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          asset.favorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
