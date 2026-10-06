"use client";

import React, { useState } from "react";
import { ShopDetails, TabType } from "@/types/billing";
import {
  Receipt,
  LayoutDashboard,
  Package,
  History,
  Store,
  Sparkles,
  Menu,
  X,
  Store as StoreIcon,
} from "lucide-react";

interface SidebarProps {
  shop: ShopDetails;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onResetDemoData: () => void;
  cartCount?: number;
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
  cartCount = 0,
}: SidebarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE TOP APP BAR (Visible only on < md screens)                       */}
      {/* ========================================================================= */}
      <header className="no-print sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-primary/10 bg-card/90 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/80 text-primary transition-all active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <span className="font-display text-lg tracking-tight text-primary leading-none">
              EC BILL<span className="text-marigold">.</span>
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate text-[11px] font-semibold text-foreground/80 max-w-[150px]">
                {shop.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDemoData}
            title="Reset sample data"
            className="flex items-center gap-1 rounded-lg border border-primary/20 bg-secondary/80 px-2.5 py-1.5 text-[11px] font-semibold text-primary shadow-2xs active:scale-95"
          >
            <Sparkles className="h-3 w-3 text-marigold" />
            <span className="hidden xs:inline">Sample Data</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OUT DRAWER OVERLAY & PANEL (for < md screens)            */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="no-print fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-card p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl uppercase tracking-tight text-primary">
                  EC BILL<span className="text-marigold">.</span>
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Shop Info Card */}
            <div className="my-4 rounded-xl border border-primary/15 bg-secondary/50 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <StoreIcon className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="truncate text-xs font-bold text-foreground">
                    {shop.name}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {shop.gstin ? `GST: ${shop.gstin}` : shop.address || "Counter POS"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation in Drawer */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto py-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-foreground/80 hover:bg-secondary active:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-primary-foreground" : "text-primary/70"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.id === "bill" && cartCount > 0 && (
                      <span className="rounded-full bg-marigold px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        {cartCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="border-t border-primary/10 pt-4 space-y-2">
              <button
                onClick={() => {
                  onResetDemoData();
                  setMobileDrawerOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-secondary px-3 py-2.5 text-xs font-bold text-primary active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-marigold" />
                <span>Load Sample Data</span>
              </button>
              <div className="text-center text-[10px] text-muted-foreground font-mono">
                Offline POS · 100% On-Device
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DESKTOP FIXED SIDEBAR (Visible on md: and above)                        */}
      {/* ========================================================================= */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden md:flex w-60 flex-col border-r border-primary/10 bg-card/95 backdrop-blur-md shadow-xs">
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
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/80 hover:bg-secondary hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-primary-foreground" : "text-primary/70"
                    }`}
                  />
                  <span className="capitalize">{item.label}</span>
                </div>
                {item.id === "bill" && cartCount > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-marigold text-accent-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
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

      {/* ========================================================================= */}
      {/* 4. MOBILE BOTTOM NAVIGATION BAR (Fixed bottom for < md screens)            */}
      {/* ========================================================================= */}
      <nav className="no-print fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-primary/15 bg-card/95 px-1 backdrop-blur-lg pb-safe md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isBill = item.id === "bill";

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all active:scale-95 ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <div
                  className={`flex h-8 w-11 items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary shadow-2xs"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {isBill && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-marigold text-[9px] font-black text-accent-foreground shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight line-clamp-1">
                {item.id === "bill"
                  ? "Bill"
                  : item.id === "dashboard"
                  ? "Dashboard"
                  : item.id === "items"
                  ? "Stock"
                  : item.id === "sales"
                  ? "Sales"
                  : "Shop"}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

