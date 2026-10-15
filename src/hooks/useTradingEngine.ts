import { useState, useEffect, useRef, useCallback } from 'react';
import { Asset, Candle, TradeOrder, TradeDirection, UserProfile, TradingSignal } from '../types/trading';
import { INITIAL_ASSETS } from '../data/assets';
import { playWinSound, playLossSound, playTickSound } from '../utils/audio';
import confetti from 'canvas-confetti';

const STORAGE_KEY_USER = 'tradowix_user_v1';
const STORAGE_KEY_TRADES = 'tradowix_trades_v1';

export function useTradingEngine() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [currentAssetId, setCurrentAssetId] = useState<string>('eurusd-otc');
  const [timeframeSeconds, setTimeframeSeconds] = useState<number>(5);
  const [durationSeconds, setDurationSeconds] = useState<number>(60);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(49); // matches screenshot 1: 00:49

  // User state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      name: 'Apex Store',
      email: 'ownerofapexstore@gmail.com',
      id: '1328493897',
      isVerified: false,
      demoBalance: 10000.00,
      realBalance: 0.00,
      accountType: 'DEMO',
    };
  });

  // Trades
  const [openTrades, setOpenTrades] = useState<TradeOrder[]>([]);
  const [closedTrades, setClosedTrades] = useState<TradeOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRADES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });
  const [lastFinishedTrade, setLastFinishedTrade] = useState<TradeOrder | null>(null);

  // Candles map per asset
  const [candlesMap, setCandlesMap] = useState<Record<string, Candle[]>>({});
  // Current live prices map
  const [pricesMap, setPricesMap] = useState<Record<string, number>>({});

  // Current active asset object
  const currentAsset = assets.find((a) => a.id === currentAssetId) || assets[0];
  const currentPrice = pricesMap[currentAssetId] || currentAsset.basePrice;

  // Signals
  const [signals, setSignals] = useState<TradingSignal[]>([
    {
      id: 'sig-1',
      assetId: 'eurusd-otc',
      assetSymbol: 'EUR/USD (OTC)',
      direction: 'HIGHER',
      confidence: 94,
      timeframe: '1m',
      timestamp: Date.now(),
      expiresInSeconds: 45,
    },
    {
      id: 'sig-2',
      assetId: 'euraud-otc',
      assetSymbol: 'EUR/AUD (OTC)',
      direction: 'LOWER',
      confidence: 89,
      timeframe: '2m',
      timestamp: Date.now(),
      expiresInSeconds: 80,
    },
    {
      id: 'sig-3',
      assetId: 'btcusd-otc',
      assetSymbol: 'BTC/USD (OTC)',
      direction: 'HIGHER',
      confidence: 91,
      timeframe: '1m',
      timestamp: Date.now(),
      expiresInSeconds: 30,
    },
    {
      id: 'sig-4',
      assetId: 'gbpjpy-otc',
      assetSymbol: 'GBP/JPY (OTC)',
      direction: 'LOWER',
      confidence: 86,
      timeframe: '5m',
      timestamp: Date.now(),
      expiresInSeconds: 150,
    },
  ]);

  // Persist user and closed trades
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRADES, JSON.stringify(closedTrades.slice(0, 50)));
  }, [closedTrades]);

  // Initialize historical candles for all assets
  useEffect(() => {
    const initialCandles: Record<string, Candle[]> = {};
    const initialPrices: Record<string, number> = {};
    const now = Date.now();

    assets.forEach((asset) => {
      let price = asset.basePrice;
      const history: Candle[] = [];
      const totalCandles = 40;
      const stepMs = timeframeSeconds * 1000;

      for (let i = totalCandles; i >= 0; i--) {
        const time = now - i * stepMs;
        const volatility = asset.basePrice * (asset.category === 'crypto' ? 0.0006 : 0.00008);
        const delta = (Math.random() - 0.49) * volatility;
        const open = price;
        const close = open + delta;
        const high = Math.max(open, close) + Math.random() * volatility * 0.6;
        const low = Math.min(open, close) - Math.random() * volatility * 0.6;
        price = close;

        history.push({
          time,
          open,
          high,
          low,
          close,
          volume: Math.floor(Math.random() * 50) + 10,
        });
      }

      initialCandles[asset.id] = history;
      initialPrices[asset.id] = price;
    });

    setCandlesMap(initialCandles);
    setPricesMap(initialPrices);
  }, [assets, timeframeSeconds]);

  // Live simulation tick generator (runs every 380ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      // Decrement countdown
      setCountdownSeconds((prev) => (prev <= 1 ? 59 : prev - 1));

      setPricesMap((prevPrices) => {
        const updated = { ...prevPrices };

        setCandlesMap((prevCandlesMap) => {
          const nextCandlesMap = { ...prevCandlesMap };

          assets.forEach((asset) => {
            const currentP = prevPrices[asset.id] || asset.basePrice;
            const volatility = asset.basePrice * (asset.category === 'crypto' ? 0.0003 : 0.00004);
            const delta = (Math.random() - 0.495) * volatility;
            const newPrice = Number((currentP + delta).toFixed(asset.decimals));

            updated[asset.id] = newPrice;

            const assetCandles = [...(prevCandlesMap[asset.id] || [])];
            if (assetCandles.length === 0) return;

            const lastCandle = { ...assetCandles[assetCandles.length - 1] };
            const candleAge = now - lastCandle.time;
            const candleDurationMs = timeframeSeconds * 1000;

            if (candleAge >= candleDurationMs) {
              // Start a new candle
              assetCandles.push({
                time: now,
                open: newPrice,
                high: newPrice,
                low: newPrice,
                close: newPrice,
                volume: 1,
              });
              if (assetCandles.length > 50) {
                assetCandles.shift();
              }
            } else {
              // Update current candle
              lastCandle.close = newPrice;
              lastCandle.high = Math.max(lastCandle.high, newPrice);
              lastCandle.low = Math.min(lastCandle.low, newPrice);
              lastCandle.volume += 1;
              assetCandles[assetCandles.length - 1] = lastCandle;
            }

            nextCandlesMap[asset.id] = assetCandles;
          });

          return nextCandlesMap;
        });

        return updated;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [assets, timeframeSeconds]);

  // Check open trades resolution
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();

      setOpenTrades((currentOpenTrades) => {
        const remaining: TradeOrder[] = [];
        const finished: TradeOrder[] = [];

        currentOpenTrades.forEach((trade) => {
          if (now >= trade.expireTime) {
            const finalPrice = pricesMap[trade.assetId] || trade.entryPrice;
            const isWon =
              (trade.direction === 'HIGHER' && finalPrice > trade.entryPrice) ||
              (trade.direction === 'LOWER' && finalPrice < trade.entryPrice);

            const isDraw = finalPrice === trade.entryPrice;
            const status = isWon ? 'WON' : isDraw ? 'DRAW' : 'LOST';
            const profit = isWon ? (trade.amount * trade.payoutPercent) / 100 : 0;

            const resolvedTrade: TradeOrder = {
              ...trade,
              exitPrice: finalPrice,
              status,
              profit,
            };

            finished.push(resolvedTrade);
          } else {
            remaining.push(trade);
          }
        });

        if (finished.length > 0) {
          // Process balance updates without blocking notifications
          finished.forEach((t) => {
            if (t.status === 'WON') {
              playWinSound();
              confetti({
                particleCount: 45,
                spread: 45,
                origin: { y: 0.65 },
              });
              setUser((prevUser) => {
                const totalPayout = t.amount + t.profit;
                if (t.accountType === 'DEMO') {
                  return { ...prevUser, demoBalance: prevUser.demoBalance + totalPayout };
                } else {
                  return { ...prevUser, realBalance: prevUser.realBalance + totalPayout };
                }
              });
            } else if (t.status === 'LOST') {
              playLossSound();
            } else if (t.status === 'DRAW') {
              setUser((prevUser) => {
                if (t.accountType === 'DEMO') {
                  return { ...prevUser, demoBalance: prevUser.demoBalance + t.amount };
                } else {
                  return { ...prevUser, realBalance: prevUser.realBalance + t.amount };
                }
              });
            }
          });

          setClosedTrades((prev) => [...finished, ...prev]);
          setLastFinishedTrade(finished[finished.length - 1]);
        }

        return remaining;
      });
    }, 250);

    return () => clearInterval(checkInterval);
  }, [pricesMap]);

  // Place trade handler
  const placeTrade = useCallback(
    (direction: TradeDirection, amount: number, durationSec: number) => {
      const activeBalance = user.accountType === 'DEMO' ? user.demoBalance : user.realBalance;
      if (amount > activeBalance) return;

      // Deduct investment upfront
      setUser((prev) => ({
        ...prev,
        demoBalance: prev.accountType === 'DEMO' ? prev.demoBalance - amount : prev.demoBalance,
        realBalance: prev.accountType === 'REAL' ? prev.realBalance - amount : prev.realBalance,
      }));

      const now = Date.now();
      const newTrade: TradeOrder = {
        id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        assetId: currentAsset.id,
        assetSymbol: currentAsset.symbol,
        direction,
        amount,
        entryPrice: currentPrice,
        payoutPercent: currentAsset.payoutPercent,
        startTime: now,
        durationSeconds: durationSec,
        expireTime: now + durationSec * 1000,
        status: 'OPEN',
        profit: 0,
        accountType: user.accountType,
      };

      setOpenTrades((prev) => [...prev, newTrade]);
    },
    [user, currentAsset, currentPrice]
  );

  const toggleFavorite = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, favorite: !a.favorite } : a))
    );
  };

  const switchAccountType = (type: 'DEMO' | 'REAL') => {
    setUser((prev) => ({ ...prev, accountType: type }));
  };

  const resetDemoBalance = () => {
    setUser((prev) => ({ ...prev, demoBalance: 10000.00 }));
  };

  const handleDepositSuccess = (amount: number, method: string) => {
    setUser((prev) => ({
      ...prev,
      realBalance: prev.realBalance + amount,
      accountType: 'REAL',
    }));
  };

  const verifyUser = () => {
    setUser((prev) => ({ ...prev, isVerified: true }));
  };

  return {
    assets,
    currentAsset,
    currentAssetId,
    setCurrentAssetId,
    currentPrice,
    candles: candlesMap[currentAssetId] || [],
    pricesMap,
    timeframeSeconds,
    setTimeframeSeconds,
    durationSeconds,
    setDurationSeconds,
    countdownSeconds,
    user,
    setUser,
    openTrades,
    closedTrades,
    lastFinishedTrade,
    setLastFinishedTrade,
    placeTrade,
    toggleFavorite,
    switchAccountType,
    resetDemoBalance,
    handleDepositSuccess,
    verifyUser,
    signals,
  };
}
