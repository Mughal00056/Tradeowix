import React, { useState, useMemo } from 'react';
import { Asset } from '../types/trading';
import { AssetIcon } from './AssetIcon';
import { Search, X, Star, ChevronUp, ChevronDown, Clock, Heart, DollarSign } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header (Screenshot 6: [≡] Select Asset   ✕) */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <span className="text-sm font-bold">≡</span>
            </div>
            <span className="font-bold text-base text-slate-900">Select Asset</span>
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

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search assets . . ."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl pl-3 pr-9 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Tabs: Favorites / Fixed Time */}
        <div className="flex items-center border-b border-slate-200 px-4">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('favorites');
            }}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors relative ${
              activeTab === 'favorites'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-indigo-600 text-indigo-600' : ''}`} />
            <span>Favorites</span>
            {activeTab === 'favorites' && (
              <span className="absolute bottom-0 inset-x-4 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('fixed_time');
            }}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors relative ${
              activeTab === 'fixed_time'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Fixed Time</span>
            {activeTab === 'fixed_time' && (
              <span className="absolute bottom-0 inset-x-4 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Currency Pairs Collapsible Header */}
        <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={() => setIsCurrencyPairsOpen(!isCurrencyPairsOpen)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600"
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px]">
              $
            </span>
            <span>Currency pairs</span>
            <span className="text-slate-400 text-[11px] font-normal font-mono-numbers">
              {filteredAssets.length}
            </span>
            {isCurrencyPairsOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-indigo-600 ml-1" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-indigo-600 ml-1" />
            )}
          </button>
        </div>

        {/* Table Column Headers */}
        <div className="flex items-center justify-between px-4 py-1.5 text-[11px] text-slate-400 font-semibold border-b border-slate-100">
          <span className="w-1/2">Asset</span>
          <div className="w-1/2 flex items-center justify-end gap-6 pr-2">
            <span>24h</span>
            <span className="flex items-center gap-0.5">
              Profit <span className="text-[10px]">˅</span>
            </span>
          </div>
        </div>

        {/* Asset List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No assets found matching your search
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Left: Flags & Symbol */}
                  <div className="flex items-center gap-3">
                    <AssetIcon flags={asset.flags} size="sm" />
                    <div>
                      <div className="font-bold text-xs text-slate-900 tracking-tight">
                        {asset.symbol}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  {/* Right: 24h change, Profit Pill, Star */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-mono-numbers font-bold ${
                        isPositive ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {isPositive ? `+${asset.change24h.toFixed(2)}%` : `${asset.change24h.toFixed(2)}%`}
                    </span>

                    {/* Exact Screenshot 6 Green Profit Pill */}
                    <span className="px-2 py-0.5 bg-[#10b981] text-white font-mono-numbers font-bold text-xs rounded-md shadow-xs">
                      {asset.payoutPercent}%
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        onToggleFavorite(asset.id);
                      }}
                      className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
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
