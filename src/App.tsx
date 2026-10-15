/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTradingEngine } from './hooks/useTradingEngine';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { TradingChart } from './components/TradingChart';
import { TradeDock } from './components/TradeDock';
import { BottomNav } from './components/BottomNav';
import { AssetSelectorModal } from './components/AssetSelectorModal';
import { UserProfileModal } from './components/UserProfileModal';
import { MoreMenuModal } from './components/MoreMenuModal';
import { DepositModal } from './components/DepositModal';
import { TradesDrawer } from './components/TradesDrawer';
import { SignalsModal } from './components/SignalsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { StatsModal } from './components/StatsModal';
import { WithdrawModal } from './components/WithdrawModal';
import { KycModal } from './components/KycModal';
import { BonusModal } from './components/BonusModal';
import { ConfirmTradeModal } from './components/ConfirmTradeModal';
import { TradeDirection } from './types/trading';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trade' | 'trades' | 'signals' | 'deposit' | 'more'>('trade');

  // Modals state
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showTradesDrawer, setShowTradesDrawer] = useState(false);
  const [showSignals, setShowSignals] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showKyc, setShowKyc] = useState(false);
  const [showBonus, setShowBonus] = useState(false);

  // Trade confirmation sheet (Screenshot 5)
  const [oneClickEnabled, setOneClickEnabled] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<{
    direction: TradeDirection;
    amount: number;
    durationSeconds: number;
  } | null>(null);

  const {
    assets,
    currentAsset,
    currentAssetId,
    setCurrentAssetId,
    currentPrice,
    candles,
    pricesMap,
    timeframeSeconds,
    setTimeframeSeconds,
    durationSeconds,
    setDurationSeconds,
    countdownSeconds,
    user,
    openTrades,
    closedTrades,
    placeTrade,
    toggleFavorite,
    switchAccountType,
    resetDemoBalance,
    handleDepositSuccess,
    verifyUser,
    signals,
  } = useTradingEngine();

  // Handle trade button click from dock
  const handleInitiateTrade = (direction: TradeDirection, amount: number, durationSec: number) => {
    if (oneClickEnabled) {
      placeTrade(direction, amount, durationSec);
    } else {
      setPendingTrade({ direction, amount, durationSeconds: durationSec });
    }
  };

  const handleConfirmTrade = () => {
    if (!pendingTrade) return;
    placeTrade(pendingTrade.direction, pendingTrade.amount, pendingTrade.durationSeconds);
    setPendingTrade(null);
  };

  // Handle bottom navigation tabs
  const handleSelectBottomTab = (tab: 'trade' | 'trades' | 'signals' | 'deposit' | 'more') => {
    setActiveTab(tab);
    if (tab === 'trade') {
      setShowTradesDrawer(false);
      setShowSignals(false);
      setShowDeposit(false);
      setShowMoreMenu(false);
    } else if (tab === 'trades') {
      setShowTradesDrawer(true);
    } else if (tab === 'signals') {
      setShowSignals(true);
    } else if (tab === 'deposit') {
      setShowDeposit(true);
    } else if (tab === 'more') {
      setShowMoreMenu(true);
    }
  };

  // Handle navigation from Profile and More menu
  const handleNavigateFromMenu = (view: string) => {
    setShowMoreMenu(false);
    setShowProfile(false);
    switch (view) {
      case 'deposit':
        setShowDeposit(true);
        break;
      case 'withdraw':
        setShowWithdraw(true);
        break;
      case 'trades':
        setShowTradesDrawer(true);
        break;
      case 'signals':
        setShowSignals(true);
        break;
      case 'stats':
        setShowStats(true);
        break;
      case 'leaderboard':
        setShowLeaderboard(true);
        break;
      case 'bonus':
      case 'rewards':
        setShowBonus(true);
        break;
      case 'kyc':
        setShowKyc(true);
        break;
      case 'profile':
        setShowProfile(true);
        break;
      case 'transactions':
        setShowTradesDrawer(true);
        break;
      default:
        break;
    }
  };

  // Calculate user total profit for leaderboard
  const userProfit =
    closedTrades.filter((t) => t.status === 'WON').reduce((acc, t) => acc + t.profit, 0) -
    closedTrades.filter((t) => t.status === 'LOST').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex justify-center bg-slate-900 min-h-screen text-slate-800">
      {/* Loading Screen on Initial Load (Screenshot 1: minimalist line-drawn logo) */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Main Responsive Device Container (Screenshots 1, 5, 6, 8, 10, 11) */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <Header
          currentAsset={currentAsset}
          user={user}
          openTrades={openTrades}
          currentPrice={currentPrice}
          onOpenAssetSelector={() => setShowAssetSelector(true)}
          onOpenProfile={() => setShowProfile(true)}
          onSwitchAccountType={switchAccountType}
          onResetDemoBalance={resetDemoBalance}
        />

        {/* Main Chart Canvas */}
        <main className="flex-1 relative flex flex-col overflow-hidden bg-white min-h-[360px]">
          <TradingChart
            asset={currentAsset}
            candles={candles}
            currentPrice={currentPrice}
            openTrades={openTrades.filter((t) => t.assetId === currentAsset.id)}
            timeframeSeconds={timeframeSeconds}
            setTimeframeSeconds={setTimeframeSeconds}
            countdownSeconds={countdownSeconds}
          />
        </main>

        {/* Bottom Trade Execution Dock */}
        <TradeDock
          asset={currentAsset}
          onInitiateTrade={handleInitiateTrade}
          userBalance={user.accountType === 'DEMO' ? user.demoBalance : user.realBalance}
          durationSeconds={durationSeconds}
          setDurationSeconds={setDurationSeconds}
        />

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectBottomTab}
          openTradesCount={openTrades.length}
        />

        {/* MODAL: Confirm Trade Sheet (Screenshot 5) */}
        {pendingTrade && (
          <ConfirmTradeModal
            asset={currentAsset}
            direction={pendingTrade.direction}
            amount={pendingTrade.amount}
            openPrice={currentPrice}
            durationSeconds={pendingTrade.durationSeconds}
            oneClickEnabled={oneClickEnabled}
            setOneClickEnabled={setOneClickEnabled}
            onConfirm={handleConfirmTrade}
            onClose={() => setPendingTrade(null)}
          />
        )}

        {/* MODAL: Asset Selector Modal (Screenshot 6) */}
        {showAssetSelector && (
          <AssetSelectorModal
            assets={assets}
            currentAssetId={currentAssetId}
            onSelectAsset={(asset) => {
              setCurrentAssetId(asset.id);
              setShowAssetSelector(false);
            }}
            onClose={() => setShowAssetSelector(false)}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* MODAL: User Profile Popover / Drawer (Screenshot 2) */}
        {showProfile && (
          <UserProfileModal
            user={user}
            onClose={() => setShowProfile(false)}
            onNavigate={handleNavigateFromMenu}
          />
        )}

        {/* MODAL: More Menu Drawer (Screenshots 3 & 4) */}
        {showMoreMenu && (
          <MoreMenuModal
            onClose={() => setShowMoreMenu(false)}
            onNavigate={handleNavigateFromMenu}
          />
        )}

        {/* MODAL: Deposit / Top Up Page (Screenshot 5) */}
        {showDeposit && (
          <DepositModal
            onClose={() => {
              setShowDeposit(false);
              setActiveTab('trade');
            }}
            onTradeNow={() => {
              setShowDeposit(false);
              setActiveTab('trade');
            }}
            onDepositSuccess={handleDepositSuccess}
          />
        )}

        {/* MODAL: Portfolio / Trades Drawer (Screenshot 11) */}
        {showTradesDrawer && (
          <TradesDrawer
            openTrades={openTrades}
            closedTrades={closedTrades}
            assets={assets}
            currentPrices={pricesMap}
            onClose={() => {
              setShowTradesDrawer(false);
              setActiveTab('trade');
            }}
          />
        )}

        {/* MODAL: Live Trading Signals */}
        {showSignals && (
          <SignalsModal
            signals={signals}
            assets={assets}
            onSelectSignal={(assetId, direction) => {
              setCurrentAssetId(assetId);
              placeTrade(direction, 10, 60);
              setActiveTab('trade');
            }}
            onClose={() => {
              setShowSignals(false);
              setActiveTab('trade');
            }}
          />
        )}

        {/* MODAL: Weekly Leaderboard (Screenshot 10) */}
        {showLeaderboard && (
          <LeaderboardModal
            userName={user.name}
            userTradesCount={closedTrades.length + openTrades.length}
            userProfit={userProfit}
            onClose={() => setShowLeaderboard(false)}
          />
        )}

        {/* MODAL: Trading Stats */}
        {showStats && (
          <StatsModal
            trades={closedTrades}
            demoBalance={user.demoBalance}
            realBalance={user.realBalance}
            onClose={() => setShowStats(false)}
          />
        )}

        {/* MODAL: Withdrawals */}
        {showWithdraw && (
          <WithdrawModal
            realBalance={user.realBalance}
            demoBalance={user.demoBalance}
            onClose={() => setShowWithdraw(false)}
          />
        )}

        {/* MODAL: KYC Verification */}
        {showKyc && (
          <KycModal
            isVerified={user.isVerified}
            onVerify={verifyUser}
            onClose={() => setShowKyc(false)}
          />
        )}

        {/* MODAL: First Deposit Bonus +70% */}
        {showBonus && (
          <BonusModal
            onClose={() => setShowBonus(false)}
            onOpenDeposit={() => setShowDeposit(true)}
          />
        )}
      </div>
    </div>
  );
}
