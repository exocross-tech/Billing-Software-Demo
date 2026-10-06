"use client";

import React, { useState } from "react";
import { HourlyTrafficPoint } from "@/lib/analytics";
import { formatCurrency } from "@/lib/constants";

interface HourlyTrafficChartProps {
  data: HourlyTrafficPoint[];
}

export function HourlyTrafficChart({ data }: HourlyTrafficChartProps) {
  const [hoverHour, setHoverHour] = useState<number | null>(null);

  const maxRevenue = Math.max(1, ...data.map((d) => d.revenue));
  const peakPoint = [...data].sort((a, b) => b.revenue - a.revenue)[0];
  const hasActivity = data.some((d) => d.revenue > 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Counter Rush Hours
          </h3>
          <p className="text-xs text-muted-foreground">
            Customer checkout traffic by hour (8 AM – 10 PM)
          </p>
        </div>
        {hasActivity && peakPoint && peakPoint.revenue > 0 && (
          <span className="rounded-full bg-marigold/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 dark:text-amber-200 ring-1 ring-marigold/40">
            🔥 Peak: {peakPoint.hourLabel} ({formatCurrency(peakPoint.revenue)})
          </span>
        )}
      </div>

      {/* Hourly Bars */}
      <div className="relative">
        <div className="flex h-44 items-end gap-1.5 sm:gap-2">
          {data.map((item) => {
            const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            const isHovered = hoverHour === item.hour;
            const isPeak = hasActivity && peakPoint?.hour === item.hour && item.revenue > 0;

            return (
              <div
                key={item.hour}
                className="group relative flex flex-1 flex-col items-center"
                onMouseEnter={() => setHoverHour(item.hour)}
                onMouseLeave={() => setHoverHour(null)}
              >
                {/* Bar Value above bar if active */}
                <span className="mb-1 text-[9px] font-mono text-muted-foreground transition-opacity">
                  {item.revenue > 0 ? `₹${Math.round(item.revenue)}` : ""}
                </span>

                {/* Bar Track & Fill */}
                <div className="relative flex h-32 w-full flex-col justify-end rounded-t-md bg-secondary/50">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isPeak
                        ? "bg-gradient-to-t from-marigold to-amber-300 shadow-md shadow-marigold/30"
                        : "bg-gradient-to-t from-primary to-teal-bright"
                    } ${isHovered ? "brightness-110 ring-2 ring-primary" : ""}`}
                    style={{
                      height: `${Math.max(item.revenue > 0 ? 6 : 2, (heightPercent * 128) / 100)}px`,
                    }}
                  />
                </div>

                {/* X Axis Label */}
                <span
                  className={`mt-2 text-[9px] sm:text-[10px] whitespace-nowrap transition-colors ${
                    isHovered
                      ? "font-bold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.hourLabel}
                </span>

                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="pointer-events-none absolute -top-12 z-30 whitespace-nowrap rounded-lg border border-primary/20 bg-card px-2.5 py-1 text-xs shadow-lg shadow-primary/10">
                    <span className="font-bold text-primary">
                      {item.hourLabel}:{" "}
                    </span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(item.revenue)}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      ({item.bills} {item.bills === 1 ? "bill" : "bills"})
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!hasActivity && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            No sales recorded during these hours yet.
          </p>
        )}
      </div>
    </div>
  );
}
