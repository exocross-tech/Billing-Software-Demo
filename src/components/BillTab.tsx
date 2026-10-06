"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product, CartItem, ShopDetails, SaleRecord, CalculatedLineItem } from "@/types/billing";
import { Receipt } from "./Receipt";
import { formatCurrency, getCostPrice } from "@/lib/constants";
import {
  Search,
  User,
  Printer,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";

interface BillTabProps {
  products: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  shop: ShopDetails;
  sales: SaleRecord[];
  setSales: React.Dispatch<React.SetStateAction<SaleRecord[]>>;
}

export function BillTab({
  products,
  setProducts,
  shop,
  sales,
  setSales,
}: BillTabProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerDetails, setCustomerDetails] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [isIgst, setIsIgst] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">("paid");
  const [billTime, setBillTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setBillTime(
        new Date().toLocaleString("en-IN", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const addToCart = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (prod && prod.stock !== undefined && prod.stock <= 0) {
      alert(`"${prod.name}" is currently out of stock!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        if (prod && prod.stock !== undefined && existing.qty >= prod.stock) {
          alert(`Cannot add more than available stock (${prod.stock} units)`);
          return prev;
        }
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    const prod = products.find((p) => p.id === id);
    if (prod && prod.stock !== undefined && qty > prod.stock) {
      alert(`Cannot exceed available stock of ${prod.stock} units`);
      return;
    }

    setCart((prev) => {
      if (qty <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, qty } : item
      );
    });
  };

  const calculations = useMemo(() => {
    const lines: CalculatedLineItem[] = cart
      .map((item) => {
        const prod = products.find((p) => p.id === item.id);
        if (!prod) return null;
        const gross = prod.price * item.qty;
        const taxable = gross / (1 + prod.gst / 100);
        const tax = gross - taxable;
        return {
          ...prod,
          qty: item.qty,
          gross,
          taxable,
          tax,
        };
      })
      .filter(Boolean) as CalculatedLineItem[];

    const byRate: Record<number, { taxable: number; tax: number }> = {};
    lines.forEach((item) => {
      if (!byRate[item.gst]) {
        byRate[item.gst] = { taxable: 0, tax: 0 };
      }
      byRate[item.gst].taxable += item.taxable;
      byRate[item.gst].tax += item.tax;
    });

    const gross = lines.reduce((acc, item) => acc + item.gross, 0);
    const taxable = lines.reduce((acc, item) => acc + item.taxable, 0);
    const tax = gross - taxable;
    const disc = Math.min(discount, gross);
    const total = Math.round(gross - disc);
    const roundOff = total - (gross - disc);

    return {
      lines,
      byRate,
      gross,
      taxable,
      tax,
      disc,
      total,
      roundOff,
    };
  }, [cart, products, discount]);

  const currentBillNo = sales.length + 1;

  const handleClear = () => {
    setCart([]);
    setDiscount(0);
    setCustomerDetails("");
  };

  const handlePrintAndSave = () => {
    if (!calculations.lines.length) return;

    window.print();

    // Deduct stock for purchased items
    if (setProducts) {
      setProducts((prev) =>
        prev.map((p) => {
          const itemInCart = cart.find((c) => c.id === p.id);
          if (itemInCart && p.stock !== undefined) {
            return {
              ...p,
              stock: Math.max(0, p.stock - itemInCart.qty),
            };
          }
          return p;
        })
      );
    }

    const newSale: SaleRecord = {
      no: currentBillNo,
      date: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      total: calculations.total,
      customer: customerDetails.trim() || undefined,
      ts: Date.now(),
      tax: calculations.tax,
      profit:
        calculations.taxable -
        calculations.disc -
        calculations.lines.reduce(
          (acc, item) => acc + getCostPrice(item) * item.qty,
          0
        ),
      paymentStatus,
      items: calculations.lines.map((item) => ({
        name: item.name,
        qty: item.qty,
        gross: item.gross,
      })),
    };

    setSales((prev) => [newSale, ...prev]);
    setCart([]);
    setCustomerDetails("");
    setDiscount(0);
    setPaymentStatus("paid");
  };

  return (
    <main className="grid gap-6 p-4 lg:grid-cols-[1fr_390px] lg:gap-0 lg:p-0">
      {/* Left: Product Catalog */}
      <section className="no-print space-y-4 lg:p-6">
        <div className="relative max-w-2xl">
          <input
            className="w-full rounded-2xl border border-border/50 bg-card px-5 py-3.5 pl-11 text-base shadow-xs outline-none transition-all focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20"
            placeholder="Search items…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-bright" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => {
            const inCart = cart.some((c) => c.id === p.id);
            const stock = p.stock ?? 0;
            const isOut = stock <= 0;
            const isLow = stock > 0 && stock <= 10;

            return (
              <button
                key={p.id}
                onClick={() => addToCart(p.id)}
                className={`group relative flex flex-col items-start rounded-2xl bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  inCart
                    ? "shadow-md ring-2 ring-marigold border border-transparent"
                    : "shadow-xs border border-border/40 hover:border-marigold/60"
                }`}
              >
                <div className="mb-2 flex w-full items-start justify-between gap-1.5">
                  <div className="font-bold text-sm leading-tight text-foreground">
                    {p.name}
                  </div>
                  <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-primary">
                    GST {p.gst}%
                  </span>
                </div>

                {/* Stock Indicator Badge */}
                <div className="mb-2">
                  {isOut ? (
                    <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                      Out of stock
                    </span>
                  ) : isLow ? (
                    <span className="rounded bg-marigold/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 dark:text-amber-200">
                      Only {stock} left
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {stock} in stock
                    </span>
                  )}
                </div>

                <div className="mt-auto text-lg font-black text-primary">
                  {formatCurrency(p.price)}
                </div>

                {inCart && (
                  <div className="absolute -right-1.5 -top-1.5 rounded-full bg-marigold p-1 text-white shadow-xs">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
          {!filteredProducts.length && (
            <p className="text-sm text-muted-foreground">No items found.</p>
          )}
        </div>
      </section>

      {/* Right: Unified POS Register Card */}
      <aside className="space-y-3 self-start lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-primary/10 lg:bg-card lg:p-4">
        {/* Panel Header */}
        <div className="no-print flex items-center justify-between pb-1 border-b border-primary/10">
          <div>
            <span className="font-display text-sm uppercase tracking-wider text-primary">
              Current Invoice
            </span>
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              #{currentBillNo}
            </span>
          </div>
        </div>

        {/* Customer Input Field */}
        <div className="no-print relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-xl border border-input bg-card pl-9 pr-3 py-2 text-xs outline-none transition focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20"
            placeholder="Customer name / mobile (optional)"
            value={customerDetails}
            onChange={(e) => setCustomerDetails(e.target.value)}
          />
        </div>

        {/* Live Thermal Receipt Preview */}
        <Receipt
          shop={shop}
          billNo={currentBillNo}
          dateTime={billTime}
          customer={customerDetails}
          lines={calculations.lines}
          byRate={calculations.byRate}
          taxable={calculations.taxable}
          isIgst={isIgst}
          disc={calculations.disc}
          roundOff={calculations.roundOff}
          total={calculations.total}
          updateQty={updateQty}
        />

        {/* Checkout Options: Discount & IGST */}
        <div className="no-print rounded-xl border border-primary/10 bg-secondary/40 p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs">
            {/* Inline Discount */}
            <div className="flex items-center gap-1.5 flex-1">
              <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-[11px] font-bold text-foreground">Discount ₹:</span>
              <input
                type="number"
                min={0}
                placeholder="0"
                className="w-16 rounded-lg border border-input bg-card px-2 py-1 text-xs font-mono text-right outline-none focus:border-teal-bright focus:ring-1 focus:ring-teal-bright/20"
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />
            </div>

            {/* IGST Pill Toggle */}
            <label className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold select-none">
              <input
                type="checkbox"
                checked={isIgst}
                onChange={(e) => setIsIgst(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary rounded cursor-pointer"
              />
              <span className="text-[11px] text-foreground">IGST Sale</span>
            </label>
          </div>

          {/* Payment Status Segmented Control */}
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-card p-1 border border-input text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPaymentStatus("paid")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all ${
                paymentStatus === "paid"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Paid</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentStatus("pending")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all ${
                paymentStatus === "pending"
                  ? "bg-amber-600 text-white shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Due (Khata)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons: Clear + Compact Print & Save Bill */}
        <div className="no-print grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={handleClear}
            disabled={!cart.length}
            className="rounded-xl border border-primary/20 bg-secondary py-2.5 px-3 text-xs font-semibold text-primary transition-all hover:bg-primary/10 disabled:opacity-40"
          >
            Clear
          </button>
          <button
            disabled={!cart.length}
            onClick={handlePrintAndSave}
            className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-marigold px-4 py-2.5 font-display text-xs uppercase tracking-wider text-accent-foreground shadow-xs shadow-marigold/30 transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98] disabled:opacity-40"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print &amp; Save Bill</span>
          </button>
        </div>
      </aside>
    </main>
  );
}
