"use client";

import React, { useState } from "react";
import { SaleRecord } from "@/types/billing";
import { formatCurrency } from "@/lib/constants";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface SalesTabProps {
  sales: SaleRecord[];
  setSales: React.Dispatch<React.SetStateAction<SaleRecord[]>>;
}

export function SalesTab({ sales, setSales }: SalesTabProps) {
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");

  const totalCollected = sales
    .filter((s) => s.paymentStatus !== "pending")
    .reduce((acc, s) => acc + s.total, 0);

  const pendingTotal = sales
    .filter((s) => s.paymentStatus === "pending")
    .reduce((acc, s) => acc + s.total, 0);

  const filteredSales = sales.filter((s) => {
    if (filter === "paid") return s.paymentStatus !== "pending";
    if (filter === "pending") return s.paymentStatus === "pending";
    return true;
  });

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
    if (confirm("Clear all sales history?")) {
      setSales([]);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header Summary */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-tight text-primary">
            Sales History
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete transaction records and counter dues
          </p>
        </div>

        <div className="flex gap-5 text-right">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Total Collected
            </div>
            <div className="font-display text-2xl text-primary">
              {formatCurrency(totalCollected)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
              Pending Dues
            </div>
            <div className="font-display text-2xl text-amber-600">
              {formatCurrency(pendingTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-1.5 rounded-xl border border-primary/10 bg-secondary/70 p-1">
        {[
          ["all", `All (${sales.length})`],
          ["paid", `Paid (${sales.filter((s) => s.paymentStatus !== "pending").length})`],
          ["pending", `Pending Dues (${sales.filter((s) => s.paymentStatus === "pending").length})`],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val as any)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
              filter === val
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-primary hover:bg-card"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bills List */}
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        {filteredSales.map((sale) => {
          const isPending = sale.paymentStatus === "pending";

          return (
            <div
              key={sale.no + "-" + sale.ts}
              className="flex items-center justify-between p-4 text-sm hover:bg-secondary/20 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary text-base">
                    #{sale.no}
                  </span>
                  <span className="font-semibold text-foreground text-sm">
                    {sale.customer || "Walk-in"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {sale.date}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* HIGH-CONTRAST SOLID BUTTONS */}
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

                <span className="font-mono font-bold text-foreground text-base min-w-[85px] text-right">
                  {formatCurrency(sale.total)}
                </span>
              </div>
            </div>
          );
        })}

        {!filteredSales.length && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No bills found under this filter.
          </p>
        )}
      </div>

      {sales.length > 0 && (
        <button
          className="mt-3 rounded-xl border border-primary/20 bg-secondary px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
          onClick={handleClearHistory}
        >
          Clear history
        </button>
      )}
    </main>
  );
}
