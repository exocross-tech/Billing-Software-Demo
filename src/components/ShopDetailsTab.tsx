"use client";

import React from "react";
import { ShopDetails } from "@/types/billing";

interface ShopDetailsTabProps {
  shop: ShopDetails;
  setShop: React.Dispatch<React.SetStateAction<ShopDetails>>;
}

const inputClass =
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-bright focus:ring-2 focus:ring-teal-bright/20";

const FIELDS: { key: keyof ShopDetails; label: string }[] = [
  { key: "name", label: "name" },
  { key: "address", label: "address" },
  { key: "phone", label: "phone" },
  { key: "gstin", label: "GSTIN" },
];

export function ShopDetailsTab({ shop, setShop }: ShopDetailsTabProps) {
  const handleChange = (key: keyof ShopDetails, value: string) => {
    setShop((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="mx-auto max-w-lg space-y-3 p-6">
      <h2 className="font-display text-xl uppercase text-primary">
        Shop details
      </h2>

      {FIELDS.map(({ key, label }) => (
        <label key={key} className="block text-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <input
            className={`${inputClass} mt-1`}
            value={shop[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </label>
      ))}

      <p className="text-xs text-muted-foreground">
        Saved automatically on this device.
      </p>
    </main>
  );
}
