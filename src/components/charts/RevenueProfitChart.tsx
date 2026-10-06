"use client";

import React, { useState } from "react";
import { TimeSeriesPoint } from "@/lib/analytics";
import { formatCurrency } from "@/lib/constants";

interface RevenueProfitChartProps {
  data: TimeSeriesPoint[];
}

export function RevenueProfitChart({ data }: RevenueProfitChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No sales data available.
      </div>
    );
  }

  const maxVal = Math.max(100, ...data.map((d) => Math.max(d.revenue, d.profit)));
  const height = 220;
  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingLeft = 45;
  const paddingRight = 15;
  const chartHeight = height - paddingTop - paddingBottom;
  const width = 500; // SVG viewBox coordinate width
  const chartWidth = width - paddingLeft - paddingRight;

  const pointsCount = data.length;
  const getX = (index: number) =>
    paddingLeft + (index / (pointsCount - 1 || 1)) * chartWidth;
  const getY = (val: number) =>
    paddingTop + chartHeight - (val / maxVal) * chartHeight;

  // Build SVG smooth path strings
  const buildSmoothPath = (values: number[]) => {
    if (values.length === 0) return "";
    const pts = values.map((v, i) => ({ x: getX(i), y: getY(v) }));
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const revenuePath = buildSmoothPath(data.map((d) => d.revenue));
  const profitPath = buildSmoothPath(data.map((d) => d.profit));

  const revenueAreaPath = revenuePath
    ? `${revenuePath} L ${getX(data.length - 1)} ${
        paddingTop + chartHeight
      } L ${getX(0)} ${paddingTop + chartHeight} Z`
    : "";

  const profitAreaPath = profitPath
    ? `${profitPath} L ${getX(data.length - 1)} ${
        paddingTop + chartHeight
      } L ${getX(0)} ${paddingTop + chartHeight} Z`
    : "";

  // 4 Horizontal Gridlines
  const gridLines = [0, 0.33, 0.66, 1].map((ratio) => {
    const val = maxVal * ratio;
    const y = paddingTop + chartHeight - ratio * chartHeight;
    return { val, y };
  });

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="relative">
      {/* Header Legend */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Revenue vs Profit Trajectory
          </h3>
          <p className="text-xs text-muted-foreground">
            Daily financial performance comparison
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-primary/20" />
            <span className="text-foreground">Gross Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-marigold ring-2 ring-marigold/20" />
            <span className="text-foreground">Net Profit</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative overflow-visible">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-56 w-full overflow-visible"
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--marigold)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--marigold)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines & Y-Axis Labels */}
          {gridLines.map((g, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={g.y}
                x2={width - paddingRight}
                y2={g.y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={g.y + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[10px] font-mono"
              >
                ₹{Math.round(g.val)}
              </text>
            </g>
          ))}

          {/* Fill Areas */}
          {revenueAreaPath && (
            <path d={revenueAreaPath} fill="url(#revenueGrad)" />
          )}
          {profitAreaPath && (
            <path d={profitAreaPath} fill="url(#profitGrad)" />
          )}

          {/* Stroke Lines */}
          {revenuePath && (
            <path
              d={revenuePath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {profitPath && (
            <path
              d={profitPath}
              fill="none"
              stroke="var(--marigold)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Vertical Hover Guide & Dots */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={paddingTop + chartHeight}
                stroke="var(--primary)"
                strokeOpacity="0.4"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].revenue)}
                r="4.5"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="2.5"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].profit)}
                r="4.5"
                fill="var(--card)"
                stroke="var(--marigold)"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* X-Axis Dates */}
          {data.map((d, i) => {
            // Show every 2nd or 3rd label if many points
            const shouldShow =
              pointsCount <= 7 ||
              i === 0 ||
              i === pointsCount - 1 ||
              i % Math.ceil(pointsCount / 6) === 0;
            if (!shouldShow) return null;

            return (
              <text
                key={i}
                x={getX(i)}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px] font-sans"
              >
                {d.shortDate || d.date}
              </text>
            );
          })}

          {/* Invisible Interactive Hover Triggers */}
          {data.map((_, i) => {
            const step = chartWidth / (pointsCount || 1);
            return (
              <rect
                key={i}
                x={getX(i) - step / 2}
                y={paddingTop}
                width={step}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && hoverIndex !== null && (
          <div
            className="pointer-events-none absolute -top-2 z-30 -translate-x-1/2 -translate-y-full rounded-xl border border-primary/20 bg-card p-2.5 text-xs shadow-xl shadow-primary/10 transition-all"
            style={{
              left: `${(getX(hoverIndex) / width) * 100}%`,
            }}
          >
            <div className="font-bold text-primary">{activePoint.date}</div>
            <div className="mt-1 space-y-0.5 font-mono text-[11px]">
              <div className="flex justify-between gap-3 text-primary">
                <span>Revenue:</span>
                <span className="font-bold">{formatCurrency(activePoint.revenue)}</span>
              </div>
              <div className="flex justify-between gap-3 text-marigold">
                <span>Profit:</span>
                <span className="font-bold">{formatCurrency(activePoint.profit)}</span>
              </div>
              <div className="flex justify-between gap-3 text-muted-foreground pt-1 border-t border-border">
                <span>Bills:</span>
                <span>{activePoint.bills}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
