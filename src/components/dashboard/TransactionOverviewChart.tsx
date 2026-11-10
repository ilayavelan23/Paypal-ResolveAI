import React, { useState } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';

interface DataPoint {
  date: string;
  count: number;
}

const CHART_DATA: DataPoint[] = [
  { date: 'Oct 10', count: 1 },
  { date: 'Oct 14', count: 6 },
  { date: 'Oct 18', count: 5 },
  { date: 'Oct 22', count: 3 },
  { date: 'Oct 26', count: 6 },
  { date: 'Oct 30', count: 7 },
  { date: 'Nov 03', count: 12 },
  { date: 'Nov 07', count: 6 }
];

export const TransactionOverviewChart: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // SVG viewBox coordinates
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;
  const maxVal = 15;

  const points = CHART_DATA.map((d, index) => {
    const x = paddingX + (index / (CHART_DATA.length - 1)) * graphWidth;
    const y = height - paddingY - (d.count / maxVal) * graphHeight;
    return { x, y, data: d };
  });

  // Generate SVG path cubic bezier curve
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Transaction Overview</h3>
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="relative w-full h-44 sm:h-52">
        {/* Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-md shadow-md pointer-events-none">
            <span className="text-slate-400">{hoveredPoint.date}:</span> <span className="font-bold text-cyan-300">{hoveredPoint.count} transactions</span>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0070BA" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0070BA" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 3, 6, 9, 12, 15].map((val) => {
            const y = height - paddingY - (val / maxVal) * graphHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  fill="#94A3B8"
                  fontSize="9"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#0070BA"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, index) => (
            <g
              key={index}
              onMouseEnter={() => setHoveredPoint(pt.data)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#FFFFFF"
                stroke="#0070BA"
                strokeWidth="2"
                className="transition-transform duration-150 hover:scale-150"
              />
              {/* X Axis labels */}
              <text
                x={pt.x}
                y={height - 6}
                fill="#64748B"
                fontSize="9"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {pt.data.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
