"use client";

import React, { useState, useMemo } from "react";
import { SaleRecord } from "@/types/billing";
import { formatCurrency } from "@/lib/constants";
import { CheckCircle2, Clock, AlertCircle, Search, X, Trash2 } from "lucide-react";

interface SalesTabProps {
  sales: SaleRecord[];
  setSales: React.Dispatch<React.SetStateAction<SaleRecord[]>>;
}

export function SalesTab({ sales, setSales }: SalesTabProps) {
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const totalCollected = useMemo(() => {
    return sales
      .filter((s) => s.paymentStatus !== "pending")
      .reduce((acc, s) => acc + s.total, 0);
  }, [sales]);

  const pendingTotal = useMemo(() => {
    return sales
      .filter((s) => s.paymentStatus === "pending")
      .reduce((acc, s) => acc + s.total, 0);
  }, [sales]);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (filter === "paid" && s.paymentStatus === "pending") return false;
      if (filter === "pending" && s.paymentStatus !== "pending") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNo = String(s.no).includes(q);
        const matchesCust = s.customer?.toLowerCase().includes(q);
        if (!matchesNo && !matchesCust) return false;
      }
      return true;
    });
  }, [sales, filter, searchQuery]);

  const handleToggleStatus = (saleNo: number, saleTs: number) => {
    setSales((prev) =>
      prev.map((s) => {
        if (s.no === saleNo && s.ts === saleTs) {
          const nextStatus = s.paymentStatus === "pending" ? "paid" : "pending";
          return { ...s, paymentStatus: nextStatus };
        }
        return s;
      })
    );
  };

  const handleClearHistory = () => {
    if (confirm("Clear all sales history? This action cannot be undone.")) {
      setSales([]);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-3.5 sm:p-4 lg:p-6 space-y-4">
      {/* Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg sm:text-2xl uppercase tracking-tight text-primary">
            Sales History &amp; Ledger
          </h2>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Complete transaction records, daily revenue, and customer dues
          </p>
        </div>

        {sales.length > 0 && (
          <button
            className="flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-white transition-all active:scale-95"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* 2 Stat Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        <div className="rounded-2xl border border-primary/20 bg-card p-3.5 sm:p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Collected
          </div>
          <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-primary">
            {formatCurrency(totalCollected)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {sales.filter((s) => s.paymentStatus !== "pending").length} paid bills
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/25 bg-card p-3.5 sm:p-4 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Pending Dues (Khata)
          </div>
          <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
            {formatCurrency(pendingTotal)}
          </div>
          <div className="text-[10px] text-amber-700/80 dark:text-amber-300 mt-0.5">
            {sales.filter((s) => s.paymentStatus === "pending").length} unpaid dues
          </div>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
        {/* Filter Tabs */}
        <div className="flex gap-1 rounded-xl border border-primary/10 bg-secondary/80 p-1 overflow-x-auto">
          {[
            ["all", `All (${sales.length})`],
            ["paid", `Paid (${sales.filter((s) => s.paymentStatus !== "pending").length})`],
            ["pending", `Dues (${sales.filter((s) => s.paymentStatus === "pending").length})`],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val as any)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filter === val
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <input
            className="w-full rounded-xl border border-border/80 bg-card px-3.5 py-1.5 pl-8 text-xs outline-none transition placeholder:text-muted-foreground focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20"
            placeholder="Search bill # or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary/70" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Bills List */}
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        {filteredSales.map((sale) => {
          const isPending = sale.paymentStatus === "pending";

          return (
            <div
              key={sale.no + "-" + sale.ts}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-2.5 hover:bg-secondary/20 transition-colors"
            >
              {/* Left Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary text-base">
                    #{sale.no}
                  </span>
                  <span className="font-bold text-foreground text-sm">
                    {sale.customer || "Walk-in Customer"}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-mono">
                  <Clock className="h-3 w-3" />
                  <span>{sale.date}</span>
                  {sale.items && (
                    <span>• {sale.items.reduce((acc, i) => acc + i.qty, 0)} items</span>
                  )}
                </div>
              </div>

              {/* Right: Payment Status Toggle + Amount */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-dashed border-border/40">
                <button
                  onClick={() => handleToggleStatus(sale.no, sale.ts)}
                  title={
                    isPending
                      ? "Click to mark this due as Paid"
                      : "Click to revert to Pending Due"
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95 ${
                    isPending
                      ? "bg-amber-600 hover:bg-emerald-600 text-white ring-2 ring-amber-400/40"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {isPending ? (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>Mark as Paid</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Paid</span>
                    </>
                  )}
                </button>

                <span className="font-mono font-black text-foreground text-base sm:text-lg min-w-[85px] text-right">
                  {formatCurrency(sale.total)}
                </span>
              </div>
            </div>
          );
        })}

        {!filteredSales.length && (
          <div className="p-8 text-center text-xs sm:text-sm text-muted-foreground">
            No bills found matching your filter criteria.
          </div>
        )}
      </div>
    </main>
  );
}

