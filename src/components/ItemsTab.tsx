"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/billing";
import { GST_RATES, formatCurrency } from "@/lib/constants";
import {
  Plus,
  Trash2,
  Search,
  Package,
  AlertTriangle,
  AlertCircle,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ItemsTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const inputClass =
  "w-full rounded-xl border border-input bg-card px-3 py-2 text-xs sm:text-sm outline-none transition focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20";

export function ItemsTab({ products, setProducts }: ItemsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(true);

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    gst: 18,
    hsn: "",
  });

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.hsn && p.hsn.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim() || !Number(newItem.price)) {
      alert("Please enter a valid product name and price");
      return;
    }

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());

    setProducts((prev) => [
      {
        id,
        name: newItem.name.trim(),
        price: Number(newItem.price),
        cost: newItem.cost ? Number(newItem.cost) : undefined,
        stock: newItem.stock !== "" ? Number(newItem.stock) : 0,
        gst: newItem.gst,
        hsn: newItem.hsn.trim() || undefined,
      },
      ...prev,
    ]);

    setNewItem({
      name: "",
      price: "",
      cost: "",
      stock: "",
      gst: 18,
      hsn: "",
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}" from catalog?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-3.5 sm:p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg sm:text-xl uppercase tracking-tight text-primary">
            Products &amp; Stock Inventory
          </h2>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Manage catalog items, prices, GST rates, and stock levels
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
          {products.length} Products
        </span>
      </div>

      {/* Add New Item Accordion Form */}
      <div className="rounded-2xl border border-primary/15 bg-card p-3.5 sm:p-4 shadow-xs">
        <div
          className="flex cursor-pointer items-center justify-between pb-2 border-b border-primary/10"
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              Add New Product
            </span>
          </div>
          <button className="text-muted-foreground">
            {isAddFormOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {isAddFormOpen && (
          <form onSubmit={handleAdd} className="mt-3 space-y-3">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Product Name *
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. Masala Tea 250g"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Price ₹ *
                </label>
                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Cost ₹
                </label>
                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  placeholder="Optional"
                  value={newItem.cost}
                  onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Stock Qty
                </label>
                <input
                  className={inputClass}
                  type="number"
                  step="1"
                  placeholder="0"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  GST Rate
                </label>
                <select
                  className={inputClass}
                  value={newItem.gst}
                  onChange={(e) =>
                    setNewItem({ ...newItem, gst: Number(e.target.value) })
                  }
                >
                  {GST_RATES.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}% GST
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex-1 max-w-xs">
                <input
                  className={inputClass}
                  placeholder="HSN code (optional)"
                  value={newItem.hsn}
                  onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-marigold px-5 py-2 text-xs sm:text-sm font-bold text-accent-foreground shadow-xs shadow-marigold/30 transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Save Product</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Search and Filter */}
      <div className="relative">
        <input
          className="w-full rounded-2xl border border-border/80 bg-card px-4 py-2.5 pl-10 text-xs sm:text-sm shadow-xs outline-none transition-all placeholder:text-muted-foreground focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20"
          placeholder="Filter products catalog by name or HSN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW: PRODUCT CARDS (< md screens)                             */}
      {/* ========================================================================= */}
      <div className="space-y-3 md:hidden">
        {filteredProducts.map((p) => {
          const stock = p.stock ?? 0;
          const isLow = stock > 0 && stock <= 10;
          const isOut = stock <= 0;

          return (
            <div
              key={p.id}
              className="rounded-2xl border border-border/70 bg-card p-3.5 shadow-xs space-y-3"
            >
              {/* Card Top: Name + GST Badge + Delete */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <input
                    className="w-full font-bold text-sm text-foreground bg-transparent border-b border-dashed border-border/70 pb-0.5 outline-none focus:border-teal-bright"
                    value={p.name}
                    onChange={(e) => updateProduct(p.id, { name: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    className="rounded-lg bg-secondary px-2 py-1 text-[11px] font-bold text-primary outline-none border border-primary/10"
                    value={p.gst}
                    onChange={(e) =>
                      updateProduct(p.id, { gst: Number(e.target.value) })
                    }
                  >
                    {GST_RATES.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}%
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-destructive/80 hover:bg-destructive/10 hover:text-destructive active:scale-95"
                    title="Delete product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Card Inputs Grid: Price, Cost, Stock, HSN */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                    Price ₹
                  </span>
                  <input
                    className={inputClass}
                    type="number"
                    step="any"
                    value={p.price}
                    onChange={(e) =>
                      updateProduct(p.id, { price: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                    Cost ₹
                  </span>
                  <input
                    className={inputClass}
                    type="number"
                    step="any"
                    placeholder="—"
                    value={p.cost ?? ""}
                    onChange={(e) =>
                      updateProduct(p.id, {
                        cost:
                          e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Stock
                    </span>
                    {isOut ? (
                      <span className="text-[9px] font-black text-destructive">
                        Out
                      </span>
                    ) : isLow ? (
                      <span className="text-[9px] font-black text-amber-700">
                        Low
                      </span>
                    ) : null}
                  </div>
                  <input
                    className={`${inputClass} font-bold ${
                      isOut
                        ? "border-destructive/60 text-destructive"
                        : isLow
                        ? "border-amber-500/60 text-amber-700"
                        : ""
                    }`}
                    type="number"
                    step="1"
                    value={p.stock ?? 0}
                    onChange={(e) =>
                      updateProduct(p.id, {
                        stock: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              {/* Bottom HSN line */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-dashed border-border/50 text-[11px] text-muted-foreground">
                <span className="font-mono">
                  HSN:{" "}
                  <input
                    className="w-24 bg-transparent outline-none text-foreground border-b border-border/40 focus:border-teal-bright"
                    placeholder="None"
                    value={p.hsn ?? ""}
                    onChange={(e) => updateProduct(p.id, { hsn: e.target.value })}
                  />
                </span>
                <span className="text-[10px] font-mono">ID: {p.id.slice(0, 6)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW: SPREADSHEET TABLE (md: and above)                         */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>Item Name</span>
          <span>Price ₹</span>
          <span>Cost ₹</span>
          <span>Stock</span>
          <span>GST Rate</span>
          <span>HSN</span>
          <span>Action</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          {filteredProducts.map((p) => {
            const stock = p.stock ?? 0;
            const isLow = stock > 0 && stock <= 10;
            const isOut = stock <= 0;

            return (
              <div
                key={p.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 p-3 hover:bg-secondary/30 transition-colors"
              >
                <div>
                  <input
                    className={inputClass}
                    value={p.name}
                    onChange={(e) => updateProduct(p.id, { name: e.target.value })}
                  />
                </div>

                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  value={p.price}
                  onChange={(e) =>
                    updateProduct(p.id, { price: Number(e.target.value) })
                  }
                />

                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  placeholder="Cost"
                  title="Cost price"
                  value={p.cost ?? ""}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      cost:
                        e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                />

                <div className="relative">
                  <input
                    className={`${inputClass} ${
                      isOut
                        ? "border-destructive/50 text-destructive font-bold"
                        : isLow
                        ? "border-marigold/50 text-amber-700 font-bold"
                        : ""
                    }`}
                    type="number"
                    step="1"
                    placeholder="Stock"
                    title="Current stock quantity"
                    value={p.stock ?? 0}
                    onChange={(e) =>
                      updateProduct(p.id, { stock: Number(e.target.value) || 0 })
                    }
                  />
                  {isOut ? (
                    <span className="absolute -top-1.5 right-1 rounded bg-destructive px-1 text-[9px] font-bold text-white">
                      0
                    </span>
                  ) : isLow ? (
                    <span className="absolute -top-1.5 right-1 rounded bg-marigold px-1 text-[9px] font-bold text-accent-foreground">
                      Low
                    </span>
                  ) : null}
                </div>

                <select
                  className={inputClass}
                  value={p.gst}
                  onChange={(e) =>
                    updateProduct(p.id, { gst: Number(e.target.value) })
                  }
                >
                  {GST_RATES.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}%
                    </option>
                  ))}
                </select>

                <input
                  className={inputClass}
                  placeholder="HSN"
                  value={p.hsn ?? ""}
                  onChange={(e) => updateProduct(p.id, { hsn: e.target.value })}
                />

                <button
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-destructive transition-all hover:bg-destructive/10"
                  onClick={() => handleDelete(p.id, p.name)}
                  title="Delete product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {!filteredProducts.length && (
        <div className="p-8 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border bg-card/50">
          No products found matching your search.
        </div>
      )}
    </main>
  );
}

