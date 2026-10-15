import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Asset, Candle, TradeOrder } from '../types/trading';
import { SlidersHorizontal, TrendingUp, BarChart2, Layers } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TradingChartProps {
  asset: Asset;
  candles: Candle[];
  currentPrice: number;
  openTrades: TradeOrder[];
  closedTrades?: TradeOrder[];
  inspectedTrade?: TradeOrder | null;
  onSelectTrade?: (trade: TradeOrder | null) => void;
  timeframeSeconds: number;
  setTimeframeSeconds: (seconds: number) => void;
  countdownSeconds: number;
  onOpenAssetInfo?: () => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  asset,
  candles,
  currentPrice,
  openTrades,
  closedTrades = [],
  inspectedTrade,
  onSelectTrade,
  timeframeSeconds,
  setTimeframeSeconds,
  countdownSeconds,
  onOpenAssetInfo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 380, height: 420 });
  const [chartType, setChartType] = useState<'candles' | 'area'>('candles');
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showIndicators, setShowIndicators] = useState(true);
  const [sentimentBuy, setSentimentBuy] = useState(28);

  // Measure container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 380,
          height: containerRef.current.clientHeight || 420,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Fluctuating sentiment
  useEffect(() => {
    const timer = setInterval(() => {
      setSentimentBuy((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        return Math.min(80, Math.max(20, Math.round(prev + delta)));
      });
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Calculate price bounds
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return {
        minPrice: currentPrice * 0.9995,
        maxPrice: currentPrice * 1.0005,
        priceRange: currentPrice * 0.001,
      };
    }
    const recent = candles.slice(-32);
    let min = Math.min(...recent.map((c) => c.low), currentPrice);
    let max = Math.max(...recent.map((c) => c.high), currentPrice);

    // Add margin
    const diff = max - min || currentPrice * 0.0005;
    min -= diff * 0.2;
    max += diff * 0.2;
    return { minPrice: min, maxPrice: max, priceRange: max - min };
  }, [candles, currentPrice]);

  // Geometry
  const chartWidth = Math.max(260, dimensions.width - 68); // right margin for price scale
  const chartHeight = Math.max(200, dimensions.height - 28); // bottom margin for time scale

  const priceToY = (price: number) => {
    if (priceRange <= 0) return chartHeight / 2;
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  const visibleCandles = useMemo(() => {
    return candles.slice(-26);
  }, [candles]);

  const candleSpacing =
    visibleCandles.length > 1
      ? (chartWidth - 50) / Math.max(visibleCandles.length - 1, 1)
      : 18;
  const candleBodyWidth = Math.max(6, Math.min(18, candleSpacing * 0.72));

  // Current price position
  const currentY = priceToY(currentPrice);

  // Indicators: SMA
  const smaPoints = useMemo(() => {
    if (!showIndicators || candles.length < 5) return '';
    const points: string[] = [];
    const period = 7;
    for (let i = 0; i < visibleCandles.length; i++) {
      const globalIdx = candles.length - visibleCandles.length + i;
      if (globalIdx < period - 1) continue;
      const slice = candles.slice(globalIdx - period + 1, globalIdx + 1);
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / period;
      const x = i * candleSpacing + 20;
      const y = priceToY(avg);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }, [candles, visibleCandles, candleSpacing, minPrice, priceRange, chartHeight, showIndicators]);

  // Area chart path
  const areaPath = useMemo(() => {
    if (visibleCandles.length === 0) return '';
    const points = visibleCandles.map((c, i) => {
      const x = i * candleSpacing + 20;
      const y = priceToY(c.close);
      return `${x},${y}`;
    });
    const lastX = (visibleCandles.length - 1) * candleSpacing + 20;
    points.push(`${lastX + 15},${currentY}`);

    const line = `M ${points.join(' L ')}`;
    const area = `${line} L ${lastX + 15},${chartHeight} L 20,${chartHeight} Z`;
    return { line, area };
  }, [visibleCandles, candleSpacing, currentY, chartHeight, minPrice, priceRange]);

  // Price scale ticks
  const priceTicks = useMemo(() => {
    const ticks = [];
    const count = 7;
    for (let i = 0; i <= count; i++) {
      const price = minPrice + (priceRange * i) / count;
      const y = priceToY(price);
      ticks.push({ price, y });
    }
    return ticks;
  }, [minPrice, priceRange, chartHeight]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const endOfTradeX = Math.min(chartWidth - 25, (visibleCandles.length - 1) * candleSpacing + 45);
  const startOfTradeX = Math.max(30, endOfTradeX - 90);

  // Active trade for floating arrow badge
  const latestOpenTrade = openTrades[openTrades.length - 1];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-white select-none overflow-hidden flex flex-col"
    >
      {/* LEFT SENTIMENT GAUGE (Exact match to screenshots: 28% green / 72% red) */}
      <div className="absolute left-1.5 top-6 bottom-7 w-1 flex flex-col z-20 pointer-events-none">
        <span className="text-[10px] font-bold text-emerald-600 mb-1 -ml-0.5">
          {sentimentBuy}%
        </span>
        <div className="flex-1 w-1 bg-slate-100 rounded-full flex flex-col overflow-hidden">
          <div
            className="bg-[#26a69a] rounded-t-full transition-all duration-700"
            style={{ height: `${sentimentBuy}%` }}
          />
          <div
            className="bg-[#ef5350] rounded-b-full transition-all duration-700"
            style={{ height: `${100 - sentimentBuy}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-red-500 mt-1 -ml-0.5">
          {100 - sentimentBuy}%
        </span>
      </div>

      {/* Floating Inspected Trade History Banner */}
      {inspectedTrade && (
        <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-xl text-white shadow-lg border border-slate-700/60 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 overflow-hidden text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                inspectedTrade.status === 'WON'
                  ? 'bg-emerald-400 animate-pulse'
                  : inspectedTrade.status === 'LOST'
                  ? 'bg-red-400'
                  : 'bg-amber-400'
              }`}
            />
            <span className="font-extrabold tracking-tight">{inspectedTrade.assetSymbol}</span>
            <span
              className={`font-black px-1.5 py-0.5 rounded-md text-[10px] ${
                inspectedTrade.direction === 'HIGHER' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-500/30 text-red-300'
              }`}
            >
              {inspectedTrade.direction === 'HIGHER' ? '↗ HIGHER' : '↘ LOWER'} ${inspectedTrade.amount}
            </span>
            <span className="font-mono-numbers text-[11px] text-slate-300">
              Entry: {inspectedTrade.entryPrice.toFixed(asset.decimals)} → Exit: {inspectedTrade.exitPrice?.toFixed(asset.decimals) || '--'}
            </span>
            {inspectedTrade.status && (
              <span
                className={`font-mono-numbers font-black text-xs ${
                  inspectedTrade.status === 'WON' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {inspectedTrade.status === 'WON' ? `+$${inspectedTrade.profit.toFixed(2)}` : `-$${inspectedTrade.amount.toFixed(2)}`}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              playClickSound();
              onSelectTrade?.(null);
            }}
            className="ml-2 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            Clear ✕
          </button>
        </div>
      )}

      {/* TOP CHART INFO (Beginning of trade / End of trade - clean without i button) */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono-numbers text-slate-600 font-semibold">12:30:43</span>
          <span className="text-[10px] text-slate-400">GMT+5 »</span>
          <span className="hidden sm:inline text-slate-400 text-[10px]">Beginning of trade</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <span className="text-[10px] text-slate-400">« End of trade</span>
          <span className="font-mono-numbers font-bold text-slate-700">
            {formatCountdown(countdownSeconds)}
          </span>
        </div>
      </div>

      {/* MAIN SVG CHART CANVAS */}
      <svg className="w-full flex-1" style={{ height: chartHeight + 28 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26a69a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#26a69a" stopOpacity="0.0" />
          </linearGradient>

          <pattern id="gridPattern" width="45" height="45" patternUnits="userSpaceOnUse">
            <path d="M 45 0 L 0 0 0 45" fill="none" stroke="#f8fafc" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={chartWidth} height={chartHeight} fill="url(#gridPattern)" />

        {/* Horizontal grid lines */}
        {priceTicks.map((tick, idx) => (
          <line
            key={idx}
            x1="20"
            y1={tick.y}
            x2={chartWidth}
            y2={tick.y}
            stroke="#f1f5f9"
            strokeDasharray="2,2"
            strokeWidth="1"
          />
        ))}

        {/* Vertical Beginning of Trade dotted line */}
        <line
          x1={startOfTradeX}
          y1="8"
          x2={startOfTradeX}
          y2={chartHeight}
          stroke="#cbd5e1"
          strokeDasharray="3,3"
          strokeWidth="1.2"
        />

        {/* Vertical End of Trade red dotted line (Screenshot 1 & 6) */}
        <line
          x1={endOfTradeX}
          y1="8"
          x2={endOfTradeX}
          y2={chartHeight}
          stroke="#ef5350"
          strokeDasharray="3,3"
          strokeWidth="1.5"
        />

        {/* SMA Line */}
        {showIndicators && smaPoints && (
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3,3"
            points={smaPoints}
            opacity="0.8"
          />
        )}

        {/* Chart render: Area or Candlesticks */}
        {chartType === 'area' && typeof areaPath === 'object' && (
          <>
            <path d={areaPath.area} fill="url(#areaGradient)" />
            <path
              d={areaPath.line}
              fill="none"
              stroke="#26a69a"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {chartType === 'candles' && (
          <g>
            {visibleCandles.map((c, i) => {
              const x = i * candleSpacing + 20;
              const isBull = c.close >= c.open;
              const openY = priceToY(c.open);
              const closeY = priceToY(c.close);
              const highY = priceToY(c.high);
              const lowY = priceToY(c.low);

              const bodyY = Math.min(openY, closeY);
              const bodyHeight = Math.max(2, Math.abs(openY - closeY));
              // Authentic TradoWix candle colors: #26a69a (teal/green) & #ef5350 (coral red)
              const color = isBull ? '#26a69a' : '#ef5350';

              return (
                <g key={c.time}>
                  {/* Top wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={bodyY}
                    stroke={color}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  {/* Bottom wick */}
                  <line
                    x1={x}
                    y1={bodyY + bodyHeight}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  {/* Candle body */}
                  <rect
                    x={x - candleBodyWidth / 2}
                    y={bodyY}
                    width={candleBodyWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1.5"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* ACTIVE OPEN TRADES ON CHART (Square Arrow Badge & Continuously Flowing SVG Dashed Line) */}
        {openTrades.map((trade, idx) => {
          const tradeY = priceToY(trade.entryPrice);
          const now = Date.now();
          const remainingSec = Math.max(0, Math.ceil((trade.expireTime - now) / 1000));
          const isHigher = trade.direction === 'HIGHER';
          const isWinning =
            (isHigher && currentPrice > trade.entryPrice) ||
            (!isHigher && currentPrice < trade.entryPrice);

          // Find candle closest to trade start time
          const candleIdx = visibleCandles.findIndex(
            (c) => Math.abs(c.time - trade.startTime) < timeframeSeconds * 1200
          );
          const currentCandleX = (visibleCandles.length - 1) * candleSpacing + 20;
          const tradeEntryX =
            candleIdx !== -1
              ? candleIdx * candleSpacing + 20
              : Math.max(40, currentCandleX - 80);

          const tradeColor = isHigher ? '#10b981' : '#ef4444';
          const profitAmt = (trade.amount * (trade.payoutPercent / 100)).toFixed(2);
          const totalReturn = (trade.amount * (1 + trade.payoutPercent / 100)).toFixed(2);
          const positionColor = isWinning ? '#10b981' : '#ef4444';

          return (
            <g
              key={trade.id}
              onClick={() => {
                playClickSound();
                onSelectTrade?.(trade);
              }}
              className="cursor-pointer"
            >
              {/* Horizontal strike line across the chart at entry strike price */}
              <line
                x1={tradeEntryX}
                y1={tradeY}
                x2={currentCandleX}
                y2={tradeY}
                stroke={tradeColor}
                strokeWidth="1.8"
                strokeOpacity="0.8"
              />

              {/* CONTINUOUSLY FLOWING SVG DASHED LINE: connecting entry strike level to live candle & price level */}
              <path
                d={`M ${tradeEntryX} ${tradeY} L ${currentCandleX} ${tradeY} L ${currentCandleX} ${currentY}`}
                fill="none"
                stroke={tradeColor}
                strokeWidth="2.5"
                strokeDasharray="5,5"
                className="animate-dash-flow"
              />

              {/* Direct flowing connection line from entry point to live candle price */}
              <line
                x1={tradeEntryX}
                y1={tradeY}
                x2={currentCandleX}
                y2={currentY}
                stroke={tradeColor}
                strokeWidth="2"
                strokeDasharray="5,5"
                strokeOpacity="0.75"
                className="animate-dash-flow"
              />

              {/* Flowing dashed line continuing to chart right edge */}
              <line
                x1={currentCandleX}
                y1={currentY}
                x2={chartWidth + 6}
                y2={currentY}
                stroke={positionColor}
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-dash-flow"
              />

              {/* Entry point pulsing ring */}
              <circle
                cx={tradeEntryX}
                cy={tradeY}
                r="6"
                fill="none"
                stroke={tradeColor}
                strokeWidth="1.5"
                opacity="0.6"
              />

              {/* SQUARE ARROW BADGE AT ENTRY (Matching TradoWix size, arrow & color) */}
              <g transform={`translate(${tradeEntryX - 11}, ${tradeY - 11})`}>
                <rect
                  width="22"
                  height="22"
                  rx="6"
                  fill={tradeColor}
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                />
                <text
                  x="11"
                  y="15.5"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  {isHigher ? '↗' : '↘'}
                </text>
              </g>

              {/* Compact Amount & Timer Tag right next to the square (Compact Size - not oversized) */}
              <g transform={`translate(${tradeEntryX + 14}, ${tradeY - 10})`}>
                <rect
                  width="62"
                  height="20"
                  rx="5"
                  fill="#0f172a"
                  fillOpacity="0.9"
                  filter="drop-shadow(0 1px 3px rgba(0,0,0,0.2))"
                />
                <text
                  x="31"
                  y="14"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ${trade.amount} · 00:{remainingSec.toString().padStart(2, '0')}
                </text>
              </g>

              {/* Strike Price Pill Badge */}
              <g transform={`translate(${Math.max(5, tradeEntryX - 60)}, ${tradeY - 9})`}>
                <rect
                  width="46"
                  height="18"
                  rx="4"
                  fill="#ffffff"
                  stroke={tradeColor}
                  strokeWidth="1"
                  filter="drop-shadow(0 1px 3px rgba(0,0,0,0.06))"
                />
                <text
                  x="23"
                  y="13"
                  fill="#1e293b"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {trade.entryPrice.toFixed(asset.decimals)}
                </text>
              </g>

              {/* Live Target Point Dot */}
              <circle
                cx={currentCandleX}
                cy={currentY}
                r="4.5"
                fill={positionColor}
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Compact Live P/L Badge at Current Candle */}
              <g
                transform={`translate(${Math.min(chartWidth - 95, currentCandleX + 12)}, ${
                  currentY - 16
                })`}
              >
                <rect
                  width="80"
                  height="30"
                  rx="7"
                  fill="#ffffff"
                  stroke={positionColor}
                  strokeWidth="1.4"
                  filter="drop-shadow(0 3px 8px rgba(0,0,0,0.12))"
                />
                <text
                  x="40"
                  y="13"
                  fill={positionColor}
                  fontSize="11"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {isWinning ? `+$${profitAmt}` : `-$${trade.amount.toFixed(2)}`}
                </text>
                <text
                  x="40"
                  y="25"
                  fill="#64748b"
                  fontSize="8.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {isWinning ? `Payout $${totalReturn}` : 'Out of Money'}
                </text>
              </g>
            </g>
          );
        })}

        {/* INSPECTED TRADE FROM HISTORY (Showing exact flowing line from entry strike level to exit candle & price) */}
        {inspectedTrade && inspectedTrade.status && (
          <g key={`inspected-${inspectedTrade.id}`} className="z-20">
            {(() => {
              const entryY = priceToY(inspectedTrade.entryPrice);
              const exitY = priceToY(inspectedTrade.exitPrice || inspectedTrade.entryPrice);
              const isHigher = inspectedTrade.direction === 'HIGHER';
              const isWon = inspectedTrade.status === 'WON';
              const outcomeColor = isWon ? '#10b981' : '#ef4444';
              const tradeColor = isHigher ? '#10b981' : '#ef4444';

              // Approximate candles for entry and exit
              const entryIdx = visibleCandles.findIndex(
                (c) => Math.abs(c.time - inspectedTrade.startTime) < timeframeSeconds * 2000
              );
              const exitIdx = visibleCandles.findIndex(
                (c) => Math.abs(c.time - inspectedTrade.expireTime) < timeframeSeconds * 2000
              );

              const entryX =
                entryIdx !== -1
                  ? entryIdx * candleSpacing + 20
                  : Math.max(30, chartWidth - 160);
              const exitX =
                exitIdx !== -1
                  ? exitIdx * candleSpacing + 20
                  : Math.min(chartWidth - 25, entryX + 80);

              return (
                <g>
                  {/* Strike level line across entry and exit */}
                  <line
                    x1={entryX}
                    y1={entryY}
                    x2={exitX}
                    y2={entryY}
                    stroke={tradeColor}
                    strokeWidth="1.8"
                    strokeDasharray="3,3"
                    strokeOpacity="0.85"
                  />

                  {/* CONTINUOUSLY FLOWING SVG DASHED LINE (Entry strike to exit candle & price level) */}
                  <path
                    d={`M ${entryX} ${entryY} L ${exitX} ${entryY} L ${exitX} ${exitY}`}
                    fill="none"
                    stroke={outcomeColor}
                    strokeWidth="2.5"
                    strokeDasharray="5,5"
                    className="animate-dash-flow"
                  />

                  {/* Direct connecting diagonal dashed line from entry to exit */}
                  <line
                    x1={entryX}
                    y1={entryY}
                    x2={exitX}
                    y2={exitY}
                    stroke={outcomeColor}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    strokeOpacity="0.85"
                    className="animate-dash-flow"
                  />

                  {/* Entry Square Badge */}
                  <g transform={`translate(${entryX - 11}, ${entryY - 11})`}>
                    <rect
                      width="22"
                      height="22"
                      rx="6"
                      fill={tradeColor}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                    />
                    <text
                      x="11"
                      y="15.5"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      {isHigher ? '↗' : '↘'}
                    </text>
                  </g>

                  {/* Entry Strike Label */}
                  <g transform={`translate(${Math.max(5, entryX - 58)}, ${entryY - 9})`}>
                    <rect
                      width="46"
                      height="18"
                      rx="4"
                      fill="#ffffff"
                      stroke={tradeColor}
                      strokeWidth="1"
                    />
                    <text
                      x="23"
                      y="13"
                      fill="#0f172a"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {inspectedTrade.entryPrice.toFixed(asset.decimals)}
                    </text>
                  </g>

                  {/* Exit Settlement Circle */}
                  <circle
                    cx={exitX}
                    cy={exitY}
                    r="5"
                    fill={outcomeColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Exit Settlement Result Badge */}
                  <g transform={`translate(${Math.max(10, Math.min(chartWidth - 90, exitX - 42))}, ${exitY - 26})`}>
                    <rect
                      width="84"
                      height="22"
                      rx="6"
                      fill={outcomeColor}
                      filter="drop-shadow(0 2px 6px rgba(0,0,0,0.2))"
                    />
                    <text
                      x="42"
                      y="15"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="900"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {isWon ? `WON +$${inspectedTrade.profit.toFixed(2)}` : `LOST -$${inspectedTrade.amount.toFixed(2)}`}
                    </text>
                  </g>
                </g>
              );
            })()}
          </g>
        )}

        {/* RECENT CLOSED TRADES SETTLEMENT MARKERS ON CHART (Clickable to inspect on graph) */}
        {closedTrades
          .filter((t) => t.assetId === asset.id)
          .slice(0, 4)
          .map((trade) => {
            const exitY = priceToY(trade.exitPrice || trade.entryPrice);
            const isWon = trade.status === 'WON';
            // Find candle around expiry time
            const candleIdx = visibleCandles.findIndex(
              (c) => Math.abs(c.time - trade.expireTime) < timeframeSeconds * 2000
            );
            if (candleIdx === -1 && visibleCandles.length < 5) return null;
            const markerX =
              candleIdx !== -1
                ? candleIdx * candleSpacing + 20
                : Math.max(30, chartWidth - 140);

            return (
              <g
                key={`closed-${trade.id}`}
                transform={`translate(${markerX - 35}, ${exitY - 10})`}
                onClick={() => {
                  playClickSound();
                  onSelectTrade?.(trade);
                }}
                className="cursor-pointer hover:opacity-100 transition-opacity"
              >
                <rect
                  width="70"
                  height="20"
                  rx="5"
                  fill={isWon ? '#10b981' : '#64748b'}
                  opacity="0.9"
                  filter="drop-shadow(0 1px 3px rgba(0,0,0,0.15))"
                />
                <text
                  x="35"
                  y="14"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {isWon ? `+$${(trade.amount + trade.profit).toFixed(1)}` : `-$${trade.amount}`}
                </text>
              </g>
            );
          })}

        {/* Horizontal Current Price Dotted Line (Screenshot 1 & 6) */}
        <line
          x1="20"
          y1={currentY}
          x2={chartWidth + 6}
          y2={currentY}
          stroke="#26a69a"
          strokeDasharray="3,3"
          strokeWidth="1.8"
        />

        {/* Current price pulse dot */}
        <circle
          cx={chartWidth}
          cy={currentY}
          r="4.5"
          fill="#26a69a"
          className="animate-pulse"
        />

        {/* Bottom Time labels */}
        {visibleCandles.map((c, i) => {
          if (i % 6 !== 0) return null;
          const x = i * candleSpacing + 20;
          const date = new Date(c.time);
          const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          return (
            <text
              key={`t-${c.time}`}
              x={x}
              y={chartHeight + 17}
              fill="#94a3b8"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              textAnchor="middle"
            >
              {timeStr}
            </text>
          );
        })}
      </svg>

      {/* RIGHT PRICE SCALE BAR */}
      <div
        className="absolute right-0 top-0 bottom-6 w-17 border-l border-slate-100 flex flex-col justify-between py-2 pointer-events-none"
        style={{ height: chartHeight }}
      >
        {priceTicks.map((tick, i) => (
          <div
            key={i}
            className="text-[10px] font-mono-numbers text-slate-400 pl-1.5 transition-all"
            style={{
              position: 'absolute',
              top: `${Math.max(4, Math.min(chartHeight - 16, tick.y - 7))}px`,
            }}
          >
            {tick.price.toFixed(asset.decimals)}
          </div>
        ))}

        {/* CURRENT PRICE BADGE WITH COUNTDOWN (Screenshots 1, 6: teal or red box) */}
        <div
          className="absolute right-0 z-30 flex flex-col items-center shadow-lg transition-transform duration-75"
          style={{
            top: `${Math.max(8, Math.min(chartHeight - 34, currentY - 18))}px`,
          }}
        >
          <div className="bg-[#26a69a] text-white px-2 py-0.5 rounded-l-md font-mono-numbers text-right shadow-sm border border-[#208a80]">
            <div className="text-[11px] font-bold tracking-tight leading-tight">
              {currentPrice.toFixed(asset.decimals)}
            </div>
            <div className="text-[10px] font-medium opacity-90 leading-tight">
              {formatCountdown(countdownSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM-LEFT CHART TOOL BUTTON */}
      <div className="absolute left-6 bottom-3.5 z-20">
        <button
          onClick={() => setShowToolsMenu(!showToolsMenu)}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-sm transition-all active:scale-95 ${
            showToolsMenu
              ? 'bg-indigo-600 border-indigo-700 text-white'
              : 'bg-white/95 border-slate-200/90 text-slate-700 hover:bg-slate-50'
          }`}
          title="Chart Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Tools Menu Drawer with Glassmorphism */}
        {showToolsMenu && (
          <div className="absolute bottom-11 left-0 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-3 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Chart Settings</span>
              <button
                onClick={() => setShowToolsMenu(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-3">
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Chart Type</span>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setChartType('candles')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'candles'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  Candles
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'area'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Area
                </button>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Timeframe</span>
              <div className="grid grid-cols-5 gap-1 text-center font-mono-numbers">
                {[5, 10, 15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setTimeframeSeconds(sec)}
                    className={`py-1 rounded-lg text-xs font-semibold transition-all ${
                      timeframeSeconds === sec
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sec < 60 ? `${sec}s` : '1m'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-slate-700 font-medium">SMA Indicator</span>
              </div>
              <input
                type="checkbox"
                checked={showIndicators}
                onChange={(e) => setShowIndicators(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
