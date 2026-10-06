"use client";

import React from "react";
import { ShopDetails, TabType } from "@/types/billing";
import {
  Receipt,
  LayoutDashboard,
  Package,
  History,
  Store,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  shop: ShopDetails;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onResetDemoData: () => void;
}

const NAV_ITEMS: {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "bill", label: "Bill Counter", icon: Receipt },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "items", label: "Items & Stock", icon: Package },
  { id: "sales", label: "Sales History", icon: History },
  { id: "shop", label: "Shop Details", icon: Store },
];

export function Sidebar({
  shop,
  activeTab,
  setActiveTab,
  onResetDemoData,
}: SidebarProps) {
  return (
    <aside className="no-print fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-primary/10 bg-card/95 backdrop-blur-md shadow-xs">
      {/* Top Brand Header */}
      <div className="flex flex-col gap-2 border-b border-primary/10 p-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl uppercase tracking-tighter text-primary">
            EC BILL<span className="text-marigold">.</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate text-xs font-semibold text-foreground">
            {shop.name}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-foreground/80 hover:bg-secondary hover:text-primary"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-primary-foreground" : "text-primary/70"
                }`}
              />
              <span className="capitalize">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="border-t border-primary/10 p-3 space-y-2">
        <button
          onClick={onResetDemoData}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/20 bg-secondary/70 px-2.5 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          title="Reload realistic sample sales and stock data"
        >
          <Sparkles className="h-3.5 w-3.5 text-marigold" />
          <span>Load Sample Data</span>
        </button>

        <div className="px-2 py-1 text-center">
          <span className="text-[10px] text-muted-foreground font-mono">
            Offline POS · 100% Local
          </span>
        </div>
      </div>
    </aside>
  );
}
