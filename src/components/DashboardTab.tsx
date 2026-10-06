"use client";

import React from "react";
import { Product, SaleRecord } from "@/types/billing";
import { formatCurrency } from "@/lib/constants";
import {
  TrendingUp,
  Receipt,
  AlertCircle,
  Banknote,
  ArrowUpRight,
  PackageCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface DashboardTabProps {
  sales: SaleRecord[];
  products: Product[];
  onNewBillClick?: () => void;
}

export function DashboardTab({
  sales,
  products,
  onNewBillClick,
}: DashboardTabProps) {
  // Start of today timestamp
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartTime = todayStart.getTime();

  // Filter today's sales
  const todaySales = sales.filter((s) => (s.ts ?? 0) >= todayStartTime);
  const todayRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);
  const todayProfit = todaySales.reduce((acc, s) => acc + (s.profit ?? 0), 0);
  const todayMargin =
    todayRevenue > 0 ? ((todayProfit / todayRevenue) * 100).toFixed(1) : "0.0";

  // Pending Payments (across all sales or today)
  const pendingSales = sales.filter((s) => s.paymentStatus === "pending");
  const pendingAmount = pendingSales.reduce((acc, s) => acc + s.total, 0);

  // Total Bills
  const totalBillsCount = sales.length;

  // 7-Day Daily Trend (Compact 130px bar chart)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const start = d.getTime();
    const end = start + 86400000;
    const daySales = sales.filter(
      (s) => (s.ts ?? 0) >= start && (s.ts ?? 0) < end
    );
    const rev = daySales.reduce((sum, s) => sum + s.total, 0);
    const isToday = i === 6;

    return {
      dayLabel: d.toLocaleDateString("en-IN", { weekday: "short" }),
      dateLabel: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenue: rev,
      bills: daySales.length,
      isToday,
    };
  });

  const maxDailyRevenue = Math.max(100, ...last7Days.map((d) => d.revenue));

  // Inventory Health
  const totalItems = products.length || 1;
  const inStock = products.filter((p) => (p.stock ?? 0) > 10).length;
  const lowStock = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length;
  const outOfStock = products.filter((p) => (p.stock ?? 0) <= 0).length;

  const lowStockItems = products.filter((p) => (p.stock ?? 0) <= 10).slice(0, 3);

  // Fast Movers Today
  const productAggregates: Record<string, { qty: number; gross: number }> = {};
  todaySales.forEach((s) => {
    s.items?.forEach((item) => {
      if (!productAggregates[item.name]) {
        productAggregates[item.name] = { qty: 0, gross: 0 };
      }
      productAggregates[item.name].qty += item.qty;
      productAggregates[item.name].gross += item.gross;
    });
  });

  const topSellingList = Object.entries(productAggregates)
    .sort((a, b) => b[1].gross - a[1].gross)
    .slice(0, 3);
  const maxTopGross = Math.max(1, ...topSellingList.map(([, data]) => data.gross));

  // Recent 4 bills
  const recentBills = sales.slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-3.5 sm:p-4 lg:p-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h1 className="font-display text-lg sm:text-xl uppercase tracking-tight text-primary leading-tight">
            Store Dashboard
          </h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Today&apos;s counter performance &amp; inventory summary
          </p>
        </div>

        {onNewBillClick && (
          <button
            onClick={onNewBillClick}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-95"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>+ New Bill</span>
          </button>
        )}
      </div>

      {/* 4 CORE KPI CARDS */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
        {/* Card 1: Today's Sales */}
        <div className="rounded-2xl border border-primary/15 bg-card p-3 sm:p-4 shadow-xs transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Sales
            </span>
            <span className="rounded-lg bg-primary/10 p-1 text-primary">
              <Banknote className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-1.5 font-display text-lg sm:text-2xl text-primary font-bold">
            {formatCurrency(todayRevenue)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground font-semibold">
            <span className="text-primary">{todaySales.length} bills today</span>
          </div>
        </div>

        {/* Card 2: Today's Profit */}
        <div className="rounded-2xl border border-marigold/30 bg-card p-3 sm:p-4 shadow-xs transition-all hover:border-marigold/60">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Profit
            </span>
            <span className="rounded-lg bg-marigold/20 p-1 text-amber-900 dark:text-amber-200">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-1.5 font-display text-lg sm:text-2xl text-foreground font-bold">
            {formatCurrency(todayProfit)}
          </div>
          <div className="mt-1 flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-3 w-3 shrink-0" />
            <span className="truncate">{todayMargin}% margin</span>
          </div>
        </div>

        {/* Card 3: Pending Payments */}
        <div className="rounded-2xl border border-amber-500/20 bg-card p-3 sm:p-4 shadow-xs transition-all hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Pending Dues
            </span>
            <span className="rounded-lg bg-amber-500/10 p-1 text-amber-600">
              <AlertCircle className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-1.5 font-display text-lg sm:text-2xl text-amber-700 dark:text-amber-400 font-bold">
            {formatCurrency(pendingAmount)}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] font-semibold text-amber-700/80 dark:text-amber-300 truncate">
            {pendingSales.length} unpaid dues
          </div>
        </div>

        {/* Card 4: Total Bills */}
        <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xs transition-all hover:border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Bills
            </span>
            <span className="rounded-lg bg-secondary p-1 text-primary">
              <Receipt className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-1.5 font-display text-lg sm:text-2xl text-primary font-bold">
            {totalBillsCount}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground font-semibold">
            All-time count
          </div>
        </div>
      </div>

      {/* COMPACT 2-COLUMN VIEW */}
      <div className="grid gap-3.5 sm:gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* Left Column: 7-Day Chart & Recent Transactions */}
        <div className="space-y-3.5 sm:space-y-4">
          {/* Compact 7-Day Sales Trend Bar Chart */}
          <section className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  7-Day Sales Trajectory
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  Daily billing volume (past week)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Past
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-marigold" /> Today
                </span>
              </div>
            </div>

            {/* Compact Bar Chart */}
            <div className="flex h-28 items-end gap-1.5 sm:gap-2 pt-2">
              {last7Days.map((d) => {
                const heightPercent =
                  maxDailyRevenue > 0 ? (d.revenue / maxDailyRevenue) * 100 : 0;

                return (
                  <div
                    key={d.dateLabel}
                    className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                  >
                    {/* Tooltip on Hover / Active */}
                    <div className="pointer-events-none absolute -top-9 z-20 hidden whitespace-nowrap rounded-md border border-border bg-card px-2 py-0.5 text-[10px] font-semibold shadow-md group-hover:block group-active:block">
                      <span className="font-bold text-primary">{d.dayLabel}: </span>
                      {formatCurrency(d.revenue)} ({d.bills} bills)
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        d.isToday
                          ? "bg-marigold shadow-xs shadow-marigold/30"
                          : "bg-primary/80 hover:bg-primary"
                      }`}
                      style={{
                        height: `${Math.max(d.revenue > 0 ? 8 : 4, (heightPercent * 80) / 100)}px`,
                      }}
                    />

                    {/* Day Label */}
                    <span
                      className={`mt-1.5 text-[9px] sm:text-[10px] font-semibold truncate ${
                        d.isToday ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {d.isToday ? "Today" : d.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Compact Recent Bills (Last 4 checkouts) */}
          <section className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs">
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Recent Counter Bills
              </h3>
              <span className="text-[10px] text-muted-foreground font-mono">
                Latest 4 records
              </span>
            </div>

            <div className="divide-y divide-border/60">
              {recentBills.map((bill) => {
                const isPending = bill.paymentStatus === "pending";

                return (
                  <div
                    key={bill.no + "-" + bill.ts}
                    className="flex items-center justify-between py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <span className="font-mono font-bold text-primary shrink-0">
                        #{bill.no}
                      </span>
                      <span className="font-medium text-foreground truncate max-w-[110px] sm:max-w-[160px]">
                        {bill.customer || "Walk-in"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          isPending
                            ? "bg-amber-600 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {isPending ? "Due" : "Paid"}
                      </span>

                      <span className="font-mono font-bold text-foreground">
                        {formatCurrency(bill.total)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {!recentBills.length && (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  No bills recorded yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Inventory Quick Health & Top Sellers */}
        <div className="space-y-4">
          {/* Stock Health Strip */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Inventory Quick Status
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {products.length} Products
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="bg-teal-bright transition-all"
                style={{ width: `${(inStock / totalItems) * 100}%` }}
                title={`In Stock: ${inStock}`}
              />
              <div
                className="bg-marigold transition-all"
                style={{ width: `${(lowStock / totalItems) * 100}%` }}
                title={`Low Stock: ${lowStock}`}
              />
              <div
                className="bg-destructive transition-all"
                style={{ width: `${(outOfStock / totalItems) * 100}%` }}
                title={`Out of Stock: ${outOfStock}`}
              />
            </div>

            {/* Legend Counts */}
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-medium">
                <PackageCheck className="h-3 w-3" />
                {inStock} In Stock
              </span>
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-medium">
                <AlertTriangle className="h-3 w-3" />
                {lowStock} Low
              </span>
              <span className="flex items-center gap-1 text-destructive font-medium">
                <AlertCircle className="h-3 w-3" />
                {outOfStock} Out
              </span>
            </div>

            {/* Low-Stock Alert Pills */}
            {lowStockItems.length > 0 && (
              <div className="mt-3 border-t border-dashed border-border pt-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Restock Priority
                </div>
                <div className="flex flex-wrap gap-1">
                  {lowStockItems.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-md border border-amber-500/20 bg-secondary/80 px-2 py-0.5 text-[10px] font-medium"
                    >
                      {item.name}:{" "}
                      <strong className="text-destructive">
                        {item.stock ?? 0} left
                      </strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Top Sellers Today */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Top Sellers Today
              </h3>
              <span className="text-[10px] text-muted-foreground">Fast movers</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {topSellingList.map(([name, data], idx) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground truncate max-w-[160px]">
                      #{idx + 1} {name}
                    </span>
                    <span className="font-mono text-primary font-bold">
                      {formatCurrency(data.gross)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-marigold"
                        style={{
                          width: `${(data.gross / maxTopGross) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {data.qty} sold
                    </span>
                  </div>
                </div>
              ))}

              {!topSellingList.length && (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  Complete bills today to view fast movers.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
