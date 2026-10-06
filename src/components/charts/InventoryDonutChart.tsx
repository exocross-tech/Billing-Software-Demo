"use client";

import React from "react";
import { StockSegment } from "@/lib/analytics";
import { InventoryStats, Product } from "@/types/billing";
import { formatCurrency } from "@/lib/constants";

interface InventoryDonutChartProps {
  stats: InventoryStats;
  segments: StockSegment[];
  criticalItems: Product[];
}

export function InventoryDonutChart({
  stats,
  segments,
  criticalItems,
}: InventoryDonutChartProps) {
  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div>
      {/* Title & Valuation Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Inventory & Stock Availability
          </h3>
          <p className="text-xs text-muted-foreground">
            Current catalog stock health & valuation
          </p>
        </div>
        <div className="rounded-xl border border-primary/10 bg-secondary/60 px-3 py-1 text-right">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Stock Retail Value
          </div>
          <div className="font-display text-sm text-primary">
            {formatCurrency(stats.totalRetailValue)}
          </div>
        </div>
      </div>

      <div className="grid items-center gap-6 sm:grid-cols-[160px_1fr]">
        {/* Donut Graphic */}
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
          <svg
            className="h-full w-full -rotate-90 transform"
            viewBox="0 0 160 160"
          >
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="var(--secondary)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Segments */}
            {segments.map((seg) => {
              if (seg.percentage <= 0) return null;
              const strokeDasharray = `${
                (seg.percentage / 100) * circumference
              } ${circumference}`;
              const strokeDashoffset = -(accumulatedPercent / 100) * circumference;
              accumulatedPercent += seg.percentage;

              return (
                <circle
                  key={seg.name}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
          </svg>

          {/* Donut Center Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-display text-2xl text-primary">
              {stats.totalUnits}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Units In Stock
            </span>
          </div>
        </div>

        {/* Breakdown Badges */}
        <div className="space-y-3">
          {segments.map((seg) => (
            <div
              key={seg.name}
              className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-2.5 text-xs shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="font-semibold">{seg.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-foreground">
                  {seg.count} {seg.count === 1 ? "item" : "items"}
                </span>
                <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {seg.percentage}%
                </span>
              </div>
            </div>
          ))}

          <div className="flex justify-between border-t border-dashed border-border pt-2 text-[11px] text-muted-foreground">
            <span>Catalog Items: <strong>{stats.totalItems}</strong></span>
            <span>Cost Valuation: <strong>{formatCurrency(stats.totalCostValue)}</strong></span>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert List if any */}
      {criticalItems.length > 0 && (
        <div className="mt-4 border-t border-dashed border-border pt-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-destructive">
              ⚠️ Attention Needed ({criticalItems.length})
            </span>
            <span className="text-[10px] text-muted-foreground">Low or 0 Stock</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {criticalItems.slice(0, 5).map((item) => {
              const stock = item.stock ?? 0;
              const isOut = stock <= 0;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold ${
                    isOut
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-marigold/30 bg-marigold/10 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="rounded px-1 text-[10px] font-bold bg-card shadow-xs">
                    {isOut ? "Out of Stock" : `${stock} left`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
