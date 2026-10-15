export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: 'forex' | 'crypto' | 'commodities';
  isOtc: boolean;
  basePrice: number;
  decimals: number;
  payoutPercent: number; // e.g. 92 or 77
  change24h: number; // e.g. +0.09 or -0.10
  flags: [string, string] | [string]; // flag codes or icon names
  favorite?: boolean;
}

export interface Candle {
  time: number; // timestamp in seconds or ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TradeDirection = 'HIGHER' | 'LOWER';
export type TradeStatus = 'OPEN' | 'WON' | 'LOST' | 'DRAW';

export interface TradeOrder {
  id: string;
  assetId: string;
  assetSymbol: string;
  direction: TradeDirection;
  amount: number;
  entryPrice: number;
  exitPrice?: number;
  payoutPercent: number;
  startTime: number;
  durationSeconds: number;
  expireTime: number;
  status: TradeStatus;
  profit: number;
  accountType: 'DEMO' | 'REAL';
}

export interface TradingSignal {
  id: string;
  assetId: string;
  assetSymbol: string;
  direction: 'HIGHER' | 'LOWER';
  confidence: number; // e.g. 89%
  timeframe: string; // e.g. "1m", "5m"
  timestamp: number;
  expiresInSeconds: number;
}

export interface UserProfile {
  name: string;
  email: string;
  id: string;
  isVerified: boolean;
  demoBalance: number;
  realBalance: number;
  accountType: 'DEMO' | 'REAL';
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BONUS';
  amount: number;
  method: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  timestamp: number;
  accountType: 'DEMO' | 'REAL';
}
