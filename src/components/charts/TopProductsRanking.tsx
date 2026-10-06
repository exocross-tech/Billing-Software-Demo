"use client";

import React from "react";
import { formatCurrency } from "@/lib/constants";

interface ProductSaleData {
  name: string;
  qty: number;
  gross: number;
}

interface TopProductsRankingProps {
  topProducts: ProductSaleData[];
  totalSalesRevenue: number;
}

export function TopProductsRanking({
  topProducts,
  totalSalesRevenue,
}: TopProductsRankingProps) {
  const maxGross = Math.max(1, ...topProducts.map((p) => p.gross));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Top Performing Products
          </h3>
          <p className="text-xs text-muted-foreground">
            Ranked by gross sales revenue
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          Top {topProducts.length} Contributors
        </span>
      </div>

      <div className="space-y-3.5">
        {topProducts.map((item, idx) => {
          const sharePercent =
            totalSalesRevenue > 0
              ? Math.round((item.gross / totalSalesRevenue) * 100)
              : 0;

          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-primary">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-foreground">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    ×{item.qty} units
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-primary">
                    {formatCurrency(item.gross)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({sharePercent}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-bright to-marigold transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(4, (item.gross / maxGross) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {!topProducts.length && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-2xl">📦</span>
            <p className="mt-2 text-sm text-muted-foreground">
              No sales recorded yet. Printed bills will appear here in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
