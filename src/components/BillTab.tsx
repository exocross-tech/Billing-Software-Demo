"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product, CartItem, ShopDetails, SaleRecord, CalculatedLineItem } from "@/types/billing";
import { Receipt } from "./Receipt";
import { formatCurrency, getCostPrice } from "@/lib/constants";

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
    setBillTime(new Date().toLocaleString("en-IN"));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
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
      date: new Date().toLocaleString("en-IN"),
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
      {/* Product Catalog Column */}
      <section className="no-print space-y-4 lg:p-6">
        <div className="relative max-w-2xl">
          <input
            className="w-full rounded-2xl bg-card px-5 py-3.5 pl-11 text-base shadow-xs ring-1 ring-primary/10 outline-none transition-all focus:ring-2 focus:ring-primary"
            placeholder="Search items…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-bright"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
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
                    ? "shadow-md ring-2 ring-marigold"
                    : "shadow-xs ring-1 ring-primary/10 hover:ring-marigold"
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

      {/* Bill & Receipt Sidebar */}
      <aside className="space-y-3.5 self-start lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-primary/10 lg:bg-card lg:p-4">
        <div className="no-print space-y-2.5 rounded-2xl border border-primary/10 bg-secondary/50 p-3.5">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Customer details
            </span>
            <input
              className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs outline-none transition focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20"
              placeholder="Customer name / phone (optional)"
              value={customerDetails}
              onChange={(e) => setCustomerDetails(e.target.value)}
            />
          </label>

          <div className="flex items-end gap-2.5">
            <label className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Discount ₹
              </span>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs outline-none transition focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20"
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 pb-2 text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                checked={isIgst}
                onChange={(e) => setIsIgst(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />
              IGST sale
            </label>
          </div>

          {/* Payment Status Option */}
          <div className="flex items-center justify-between border-t border-primary/10 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Status:
            </span>
            <div className="flex rounded-lg bg-card p-0.5 border border-input text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentStatus("paid")}
                className={`rounded-md px-2.5 py-1 text-[11px] transition-all ${
                  paymentStatus === "paid"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus("pending")}
                className={`rounded-md px-2.5 py-1 text-[11px] transition-all ${
                  paymentStatus === "pending"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Due (Pending)
              </button>
            </div>
          </div>
        </div>

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

        <div className="no-print grid grid-cols-3 gap-2 pt-1">
          <button
            className="rounded-xl border border-primary/20 bg-secondary py-3 px-2 text-xs font-semibold text-primary transition-all hover:bg-primary/10 disabled:opacity-40"
            onClick={handleClear}
            disabled={!cart.length}
          >
            Clear
          </button>
          <button
            disabled={!cart.length}
            onClick={handlePrintAndSave}
            className="col-span-2 rounded-xl bg-marigold px-4 py-3 font-display text-xs uppercase tracking-wide text-accent-foreground shadow-md shadow-marigold/30 transition-all hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-40"
          >
            Print & save bill
          </button>
        </div>
      </aside>
    </main>
  );
}
