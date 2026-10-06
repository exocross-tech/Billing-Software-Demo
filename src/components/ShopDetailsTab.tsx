"use client";

import React, { useState } from "react";
import { ShopDetails } from "@/types/billing";
import { Store, CheckCircle, MapPin, Phone, FileText } from "lucide-react";

interface ShopDetailsTabProps {
  shop: ShopDetails;
  setShop: React.Dispatch<React.SetStateAction<ShopDetails>>;
}

const inputClass =
  "w-full rounded-xl border border-border/80 bg-card px-3.5 py-2.5 text-xs sm:text-sm outline-none transition placeholder:text-muted-foreground focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20";

export function ShopDetailsTab({ shop, setShop }: ShopDetailsTabProps) {
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const handleChange = (key: keyof ShopDetails, value: string) => {
    setShop((prev) => ({ ...prev, [key]: value }));
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2000);
  };

  return (
    <main className="mx-auto max-w-xl p-3.5 sm:p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg sm:text-2xl uppercase tracking-tight text-primary">
            Store &amp; Invoice Settings
          </h2>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Customize store identity printed on customer thermal invoices
          </p>
        </div>
        {showSavedNotification && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-150">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-primary/15 bg-card p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Store className="h-3 w-3 text-primary" />
            <span>Store / Business Name *</span>
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Sri Lakshmi Supermarket"
            value={shop.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary" />
            <span>Store Address</span>
          </label>
          <input
            className={inputClass}
            placeholder="e.g. 12, Bazaar Main Road, Madurai - 625001"
            value={shop.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <Phone className="h-3 w-3 text-primary" />
              <span>Contact Phone Number</span>
            </label>
            <input
              className={inputClass}
              placeholder="e.g. +91 98765 43210"
              value={shop.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3 text-primary" />
              <span>GSTIN Number</span>
            </label>
            <input
              className={inputClass}
              placeholder="e.g. 33AAAAA0000A1Z5"
              value={shop.gstin || ""}
              onChange={(e) => handleChange("gstin", e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-border/60 text-center">
          <p className="text-[11px] text-muted-foreground font-mono">
            All details are automatically stored locally on this device.
          </p>
        </div>
      </div>
    </main>
  );
}

