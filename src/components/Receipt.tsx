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
              <th>Item</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Amt</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="py-1">
                  {item.name}
                  <div className="text-muted-foreground">
                    @{item.price} · {item.gst}%
                  </div>
                </td>
                <td className="py-1 text-center">
                  <span className="no-print inline-flex items-center gap-1">
                    <button
                      className="px-1 text-primary hover:font-bold"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      className="px-1 text-primary hover:font-bold"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </span>
                  <span className="hidden print:inline">{item.qty}</span>
                </td>
                <td className="py-1 text-right">{item.gross.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!lines.length && (
          <p className="py-6 text-center text-muted-foreground">
            Tap items to add them
          </p>
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
