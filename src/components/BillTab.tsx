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
  ShoppingBag,
  ReceiptText,
  X,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface BillTabProps {
  products: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  shop: ShopDetails;
  sales: SaleRecord[];
  setSales: React.Dispatch<React.SetStateAction<SaleRecord[]>>;
  cart?: CartItem[];
  setCart?: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function BillTab({
  products,
  setProducts,
  shop,
  sales,
  setSales,
  cart: externalCart,
  setCart: setExternalCart,
}: BillTabProps) {
  // Use lifted cart state or internal fallback
  const [internalCart, setInternalCart] = useState<CartItem[]>([]);
  const cart = externalCart ?? internalCart;
  const setCart = setExternalCart ?? setInternalCart;

  const [searchQuery, setSearchQuery] = useState("");
  const [customerDetails, setCustomerDetails] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [isIgst, setIsIgst] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">("paid");
  const [billTime, setBillTime] = useState("");
  const [mobileView, setMobileView] = useState<"catalog" | "invoice">("catalog");

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
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.hsn && p.hsn.toLowerCase().includes(query))
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
    const totalUnits = lines.reduce((acc, item) => acc + item.qty, 0);

    return {
      lines,
      byRate,
      gross,
      taxable,
      tax,
      disc,
      total,
      roundOff,
      totalUnits,
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
    setMobileView("catalog");
  };

  return (
    <main className="min-h-full pb-6 lg:pb-0">
      {/* ========================================================================= */}
      {/* MOBILE SEGMENT SWITCHER (< lg screens)                                    */}
      {/* ========================================================================= */}
      <div className="no-print sticky top-14 z-20 flex bg-background/95 p-3 backdrop-blur-md lg:hidden border-b border-border/50">
        <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-secondary/80 p-1">
          <button
            onClick={() => setMobileView("catalog")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
              mobileView === "catalog"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Items Catalog</span>
          </button>
          <button
            onClick={() => setMobileView("invoice")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all relative ${
              mobileView === "invoice"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ReceiptText className="h-3.5 w-3.5" />
            <span>Invoice Preview</span>
            {calculations.totalUnits > 0 && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                  mobileView === "invoice"
                    ? "bg-marigold text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {calculations.totalUnits}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px]">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PRODUCT SEARCH & CATALOG                                     */}
        {/* ========================================================================= */}
        <section
          className={`no-print space-y-4 p-4 lg:p-6 ${
            mobileView === "invoice" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Search Header */}
          <div className="relative max-w-2xl">
            <input
              className="w-full rounded-2xl border border-border/60 bg-card px-4 py-3 pl-10 pr-10 text-sm shadow-xs outline-none transition-all placeholder:text-muted-foreground focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20"
              placeholder="Search products by name or HSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4 sm:gap-3">
            {filteredProducts.map((p) => {
              const itemInCart = cart.find((c) => c.id === p.id);
              const inCart = Boolean(itemInCart);
              const stock = p.stock ?? 0;
              const isOut = stock <= 0;
              const isLow = stock > 0 && stock <= 10;

              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p.id)}
                  className={`group relative flex flex-col items-start justify-between rounded-2xl bg-card p-3.5 sm:p-4 text-left transition-all duration-150 active:scale-[0.98] ${
                    inCart
                      ? "ring-2 ring-marigold bg-marigold/5 border-transparent shadow-md"
                      : "border border-border/60 hover:border-marigold/60 shadow-xs"
                  }`}
                >
                  <div className="w-full">
                    <div className="flex w-full items-start justify-between gap-1.5">
                      <div className="font-bold text-xs sm:text-sm leading-snug text-foreground line-clamp-2">
                        {p.name}
                      </div>
                      <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-primary">
                        {p.gst}%
                      </span>
                    </div>

                    {/* Stock Indicator Badge */}
                    <div className="mt-1.5">
                      {isOut ? (
                        <span className="inline-block rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                          Out of stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-block rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                          {stock} left
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {stock} in stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex w-full items-end justify-between">
                    <div className="font-display text-base sm:text-lg font-black text-primary">
                      {formatCurrency(p.price)}
                    </div>
                    {itemInCart && (
                      <div className="flex items-center gap-1 rounded-full bg-marigold px-2 py-0.5 text-[10px] font-black text-accent-foreground shadow-2xs">
                        <span>×{itemInCart.qty}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
            {!filteredProducts.length && (
              <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                <p>No products match &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REGISTER CARD & LIVE THERMAL RECEIPT                         */}
        {/* ========================================================================= */}
        <aside
          className={`space-y-3 p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-primary/10 lg:bg-card/50 lg:p-4 ${
            mobileView === "catalog" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Panel Header */}
          <div className="no-print flex items-center justify-between pb-2 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm uppercase tracking-wider text-primary">
                Current Invoice
              </span>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-bold text-primary">
                #{currentBillNo}
              </span>
            </div>
            {calculations.totalUnits > 0 && (
              <span className="text-xs font-semibold text-muted-foreground">
                {calculations.totalUnits} item{calculations.totalUnits > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Customer Input Field */}
          <div className="no-print relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-xl border border-border/80 bg-card pl-9 pr-3 py-2.5 text-xs outline-none transition focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20"
              placeholder="Customer Name / Mobile (optional)"
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

          {/* Checkout Controls: Discount & IGST */}
          <div className="no-print rounded-xl border border-primary/10 bg-secondary/50 p-3 space-y-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              {/* Inline Discount */}
              <div className="flex items-center gap-2 flex-1">
                <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs font-bold text-foreground">Discount ₹:</span>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  className="w-20 rounded-lg border border-input bg-card px-2.5 py-1.5 text-xs font-mono text-right outline-none focus:border-teal-bright focus:ring-1 focus:ring-teal-bright/20"
                  value={discount || ""}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                />
              </div>

              {/* IGST Toggle */}
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold select-none">
                <input
                  type="checkbox"
                  checked={isIgst}
                  onChange={(e) => setIsIgst(e.target.checked)}
                  className="h-4 w-4 accent-primary rounded cursor-pointer"
                />
                <span className="text-xs text-foreground">IGST Sale</span>
              </label>
            </div>

            {/* Payment Status Segmented Control */}
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-card p-1 border border-border/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentStatus("paid")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-md transition-all ${
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
                className={`flex items-center justify-center gap-1.5 py-2 rounded-md transition-all ${
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

          {/* Action Buttons: Clear + Print & Save */}
          <div className="no-print grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleClear}
              disabled={!cart.length}
              className="rounded-xl border border-primary/20 bg-secondary py-3 px-3 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95 disabled:opacity-40"
            >
              Clear
            </button>
            <button
              disabled={!cart.length}
              onClick={handlePrintAndSave}
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-marigold px-4 py-3 font-display text-xs uppercase tracking-wider text-accent-foreground shadow-md shadow-marigold/30 transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98] disabled:opacity-40"
            >
              <Printer className="h-4 w-4" />
              <span>Print &amp; Save Bill</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FLOATING CHECKOUT BAR (Shown when items exist & on Catalog tab)    */}
      {/* ========================================================================= */}
      {cart.length > 0 && mobileView === "catalog" && (
        <div className="no-print fixed bottom-18 left-3 right-3 z-30 lg:hidden animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => setMobileView("invoice")}
            className="flex w-full items-center justify-between rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground shadow-xl shadow-primary/30 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-marigold text-xs font-black text-accent-foreground">
                {calculations.totalUnits}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-medium opacity-90 leading-tight">
                  {cart.length} item{cart.length > 1 ? "s" : ""} in cart
                </span>
                <span className="font-display text-base font-bold leading-tight">
                  {formatCurrency(calculations.total)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-card/20 px-3 py-1.5 text-xs font-bold backdrop-blur-xs">
              <span>View Invoice</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>
      )}
    </main>
  );
}

