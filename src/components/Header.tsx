"use client";

import React from "react";
import { ShopDetails, TabType } from "@/types/billing";

interface HeaderProps {
  shop: ShopDetails;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS: { id: TabType; label: string }[] = [
  { id: "dashboard", label: "dashboard" },
  { id: "bill", label: "bill" },
  { id: "items", label: "items" },
  { id: "shop", label: "Shop details" },
  { id: "sales", label: "sales" },
];

export function Header({ shop, activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-20 flex h-16 flex-wrap items-center justify-between gap-3 border-b border-primary/10 bg-card/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="font-display text-2xl uppercase tracking-tighter text-primary">
          EC BILL<span className="text-marigold">.</span>
        </span>
        <span className="rounded-full bg-secondary px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20">
          {shop.name}
        </span>
      </div>

      <nav className="flex items-center gap-1 rounded-2xl bg-secondary/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-primary hover:bg-card/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
