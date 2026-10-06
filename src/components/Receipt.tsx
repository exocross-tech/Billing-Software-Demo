"use client";

import React from "react";
import { CalculatedLineItem, ShopDetails } from "@/types/billing";
import { formatCurrency } from "@/lib/constants";

interface ReceiptProps {
  shop: ShopDetails;
  billNo: number;
  dateTime: string;
  customer: string;
  lines: CalculatedLineItem[];
  byRate: Record<number, { taxable: number; tax: number }>;
  taxable: number;
  isIgst: boolean;
  disc: number;
  roundOff: number;
  total: number;
  updateQty: (id: string, qty: number) => void;
}

function ReceiptRow({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex justify-between">
      <span>{k}</span>
      <span>{v.toFixed(2)}</span>
    </div>
  );
}

export function Receipt({
  shop,
  billNo,
  dateTime,
  customer,
  lines,
  byRate,
  taxable,
  isIgst,
  disc,
  roundOff,
  total,
  updateQty,
}: ReceiptProps) {
  return (
    <div id="receipt" className="mx-auto w-full bg-paper font-mono text-xs shadow-sm rounded-xl border border-primary/15 overflow-hidden">
      <div className="p-5">
        <div className="text-center">
          <div className="font-display text-base uppercase">{shop.name}</div>
          <div>{shop.address}</div>
          {shop.phone && <div>Ph: {shop.phone}</div>}
          {shop.gstin && <div>GSTIN: {shop.gstin}</div>}
          <div className="mt-1 border-y border-foreground py-1 text-[10px] font-bold uppercase tracking-widest">
            Tax Invoice
          </div>
        </div>

        <div className="my-2 flex justify-between border-b border-dashed border-border pb-1">
          <span>Bill #{billNo}</span>
          <span>{dateTime}</span>
        </div>

        {customer && <div className="mb-1">Customer: {customer}</div>}

        <table className="w-full">
          <thead>
            <tr className="border-b border-dashed border-border text-left">
              <th className="pb-1">Item</th>
              <th className="pb-1 text-center">Qty</th>
              <th className="pb-1 text-right">Amt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-border/50">
            {lines.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="py-1.5 pr-2">
                  <div className="font-semibold leading-tight text-foreground">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    ₹{item.price} · GST {item.gst}%
                  </div>
                </td>
                <td className="py-1.5 text-center whitespace-nowrap">
                  <span className="no-print inline-flex items-center gap-1.5 bg-secondary/80 rounded-lg p-0.5 border border-primary/10">
                    <button
                      className="flex h-5 w-5 items-center justify-center rounded bg-card text-primary font-black shadow-2xs hover:bg-primary hover:text-white active:scale-90"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-[16px] text-center font-bold text-xs">{item.qty}</span>
                    <button
                      className="flex h-5 w-5 items-center justify-center rounded bg-card text-primary font-black shadow-2xs hover:bg-primary hover:text-white active:scale-90"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </span>
                  <span className="hidden print:inline font-bold">{item.qty}</span>
                </td>
                <td className="py-1.5 text-right font-bold text-foreground">
                  {item.gross.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!lines.length && (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-xs">No items added to invoice.</p>
            <p className="text-[10px] mt-1 text-muted-foreground/80">Tap products to add them to your bill</p>
          </div>
        )}

        <div className="mt-2 space-y-0.5 border-t border-dashed border-border pt-2">
          <ReceiptRow k="Taxable value" v={taxable} />
          {Object.entries(byRate)
            .filter(([rate]) => rate !== "0")
            .map(([rate, item]) =>
              isIgst ? (
                <ReceiptRow
                  key={rate}
                  k={`IGST ${rate}%`}
                  v={item.tax}
                />
              ) : (
                <div key={rate}>
                  <ReceiptRow
                    k={`CGST ${Number(rate) / 2}%`}
                    v={item.tax / 2}
                  />
                  <ReceiptRow
                    k={`SGST ${Number(rate) / 2}%`}
                    v={item.tax / 2}
                  />
                </div>
              )
            )}
          {disc > 0 && <ReceiptRow k="Discount" v={-disc} />}
          {Math.abs(roundOff) > 0.001 && (
            <ReceiptRow k="Round off" v={roundOff} />
          )}
          <div className="flex items-end justify-between border-t border-dashed border-border pt-1.5">
            <span className="font-display text-base uppercase">Total</span>
            <span className="font-display text-xl text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <p className="mt-3 text-center text-muted-foreground">
          Prices inclusive of GST · Thank you!
        </p>
      </div>
      <div className="receipt-edge"></div>
    </div>
  );
}
