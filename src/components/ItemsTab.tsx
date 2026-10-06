"use client";

import React, { useState } from "react";
import { Product } from "@/types/billing";
import { GST_RATES } from "@/lib/constants";

interface ItemsTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const inputClass =
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20";

export function ItemsTab({ products, setProducts }: ItemsTabProps) {
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    gst: 18,
    hsn: "",
  });

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim() || !Number(newItem.price)) return;

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());

    setProducts((prev) => [
      ...prev,
      {
        id,
        name: newItem.name.trim(),
        price: Number(newItem.price),
        cost: newItem.cost ? Number(newItem.cost) : undefined,
        stock: newItem.stock !== "" ? Number(newItem.stock) : 0,
        gst: newItem.gst,
        hsn: newItem.hsn.trim() || undefined,
      },
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

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl uppercase text-primary">
          Products & Inventory
        </h2>
        <span className="text-xs text-muted-foreground">
          {products.length} Products in catalog
        </span>
      </div>

      {/* Add New Item Form */}
      <form
        onSubmit={handleAdd}
        className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-4 shadow-xs sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]"
      >
        <input
          className={inputClass}
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          className={inputClass}
          type="number"
          step="any"
          placeholder="Price ₹"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          className={inputClass}
          type="number"
          step="any"
          placeholder="Cost ₹"
          value={newItem.cost}
          onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
        />
        <input
          className={inputClass}
          type="number"
          step="1"
          placeholder="Stock qty"
          value={newItem.stock}
          onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
        />
        <select
          className={inputClass}
          value={newItem.gst}
          onChange={(e) =>
            setNewItem({ ...newItem, gst: Number(e.target.value) })
          }
        >
          {GST_RATES.map((rate) => (
            <option key={rate} value={rate}>
              GST {rate}%
            </option>
          ))}
        </select>
        <input
          className={inputClass}
          placeholder="HSN"
          value={newItem.hsn}
          onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })}
        />
        <button
          type="submit"
          className="col-span-2 rounded-xl bg-marigold px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-xs shadow-marigold/30 transition-all hover:bg-accent/80 active:scale-[0.98] sm:col-span-1"
        >
          Add
        </button>
      </form>

      {/* Item List Header */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:grid">
        <span>Item Name</span>
        <span>Price ₹</span>
        <span>Cost ₹</span>
        <span>Stock</span>
        <span>GST Rate</span>
        <span>HSN</span>
        <span>Action</span>
      </div>

      {/* Item List with In-place Editing */}
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        {products.map((p) => {
          const stock = p.stock ?? 0;
          const isLow = stock > 0 && stock <= 10;
          const isOut = stock <= 0;

          return (
            <div
              key={p.id}
              className="grid grid-cols-2 items-center gap-2 p-3 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]"
            >
              <div className="relative">
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
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive transition-all hover:bg-secondary"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          );
        })}

        {!products.length && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No products defined yet.
          </div>
        )}
      </div>
    </main>
  );
}
