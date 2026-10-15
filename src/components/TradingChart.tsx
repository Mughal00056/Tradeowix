import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Asset, Candle, TradeOrder } from '../types/trading';
import { SlidersHorizontal, TrendingUp, BarChart2, Layers } from 'lucide-react';

interface TradingChartProps {
  asset: Asset;
  candles: Candle[];
  currentPrice: number;
  openTrades: TradeOrder[];
  timeframeSeconds: number;
  setTimeframeSeconds: (seconds: number) => void;
  countdownSeconds: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  asset,
  candles,
  currentPrice,
  openTrades,
  timeframeSeconds,
  setTimeframeSeconds,
  countdownSeconds,
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

      {/* TOP CHART INFO (Beginning of trade / End of trade - Screenshot 1 & 6) */}
      <div className="absolute top-2 left-10 right-18 flex items-center justify-between text-[11px] text-slate-400 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-bold">
            i
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono-numbers text-slate-600 font-semibold">12:06:18</span>
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

        {/* ACTIVE OPEN TRADES ON CHART (Screenshots 5, 6, 8, 9) */}
        {openTrades.map((trade) => {
          const tradeY = priceToY(trade.entryPrice);
          const now = Date.now();
          const remainingSec = Math.max(0, Math.ceil((trade.expireTime - now) / 1000));
          const isWinning =
            (trade.direction === 'HIGHER' && currentPrice > trade.entryPrice) ||
            (trade.direction === 'LOWER' && currentPrice < trade.entryPrice);

          const badgeX = Math.max(40, chartWidth - 110);

          return (
            <g key={trade.id}>
              {/* Horizontal entry level dashed line */}
              <line
                x1="20"
                y1={tradeY}
                x2={chartWidth + 6}
                y2={tradeY}
                stroke={trade.direction === 'HIGHER' ? '#26a69a' : '#ef5350'}
                strokeDasharray="4,4"
                strokeWidth="1.8"
              />

              {/* Start trade entry dot & connecting circle */}
              <circle
                cx={badgeX - 10}
                cy={tradeY}
                r="4.5"
                fill="#ffffff"
                stroke={trade.direction === 'HIGHER' ? '#26a69a' : '#ef5350'}
                strokeWidth="2.5"
              />

              {/* Trade Pill Badge attached to line (Screenshot 6 & 8: ↑ $1 00:25) */}
              <rect
                x={badgeX}
                y={tradeY - 11}
                width="74"
                height="22"
                rx="6"
                fill={isWinning ? '#10b981' : '#ef4444'}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
              />

              <text
                x={badgeX + 37}
                y={tradeY + 4}
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
              >
                {trade.direction === 'HIGHER' ? '↑' : '↓'} ${trade.amount} 00:{remainingSec.toString().padStart(2, '0')}
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

      {/* FLOATING DIRECT DIRECTIONAL ARROW (Screenshots 6 & 8: prominent green ↗ or red ↘) */}
      {latestOpenTrade && (
        <div
          className="absolute z-20 pointer-events-none transition-all duration-300"
          style={{
            top: `${Math.max(60, Math.min(chartHeight - 60, currentY - 30))}px`,
            left: `${chartWidth * 0.65}px`,
          }}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xl animate-bounce ${
              latestOpenTrade.direction === 'HIGHER'
                ? 'bg-[#10b981] shadow-emerald-500/40'
                : 'bg-[#ef4444] shadow-red-500/40'
            }`}
          >
            {latestOpenTrade.direction === 'HIGHER' ? (
              <span className="text-xl font-black">↗</span>
            ) : (
              <span className="text-xl font-black">↘</span>
            )}
          </div>
        </div>
      )}

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
