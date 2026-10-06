import { Product, SaleRecord, InventoryStats } from "@/types/billing";
import { getCostPrice } from "./constants";

export interface TimeSeriesPoint {
  date: string;
  shortDate: string;
  revenue: number;
  profit: number;
  bills: number;
}

export interface HourlyTrafficPoint {
  hourLabel: string;
  hour: number;
  revenue: number;
  bills: number;
}

export interface StockSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export function getRevenueProfitTimeSeries(
  sales: SaleRecord[],
  days: number = 7
): TimeSeriesPoint[] {
  const result: TimeSeriesPoint[] = [];
  const count = days === 0 ? 14 : days; // If all time, show last 14 days by day

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const dayStart = d.getTime();
    const dayEnd = dayStart + 86400000;

    const daySales = sales.filter(
      (s) => (s.ts ?? 0) >= dayStart && (s.ts ?? 0) < dayEnd
    );

    const revenue = daySales.reduce((sum, s) => sum + s.total, 0);
    const profit = daySales.reduce((sum, s) => sum + (s.profit ?? 0), 0);

    result.push({
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      shortDate: d.toLocaleDateString("en-IN", { weekday: "short" }),
      revenue,
      profit,
      bills: daySales.length,
    });
  }

  return result;
}

export function getInventoryStats(products: Product[]): {
  stats: InventoryStats;
  segments: StockSegment[];
  criticalItems: Product[];
} {
  let inStockCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalUnits = 0;
  let totalRetailValue = 0;
  let totalCostValue = 0;

  products.forEach((p) => {
    const stock = p.stock ?? 0;
    totalUnits += stock;
    totalRetailValue += p.price * stock;
    totalCostValue += getCostPrice(p) * stock;

    if (stock <= 0) {
      outOfStockCount++;
    } else if (stock <= 10) {
      lowStockCount++;
    } else {
      inStockCount++;
    }
  });

  const total = products.length || 1;

  const segments: StockSegment[] = [
    {
      name: "In Stock (>10)",
      count: inStockCount,
      percentage: Math.round((inStockCount / total) * 100),
      color: "var(--teal-bright)",
    },
    {
      name: "Low Stock (1-10)",
      count: lowStockCount,
      percentage: Math.round((lowStockCount / total) * 100),
      color: "var(--marigold)",
    },
    {
      name: "Out of Stock",
      count: outOfStockCount,
      percentage: Math.round((outOfStockCount / total) * 100),
      color: "var(--destructive)",
    },
  ];

  const criticalItems = [...products]
    .filter((p) => (p.stock ?? 0) <= 10)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));

  return {
    stats: {
      totalItems: products.length,
      totalUnits,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      totalRetailValue,
      totalCostValue,
    },
    segments,
    criticalItems,
  };
}

export function getHourlyTraffic(sales: SaleRecord[]): HourlyTrafficPoint[] {
  // Operating hours from 8 AM to 10 PM
  const hoursMap: Record<number, { revenue: number; bills: number }> = {};
  for (let h = 8; h <= 22; h++) {
    hoursMap[h] = { revenue: 0, bills: 0 };
  }

  sales.forEach((s) => {
    const saleDate = new Date(s.ts || Date.now());
    const h = saleDate.getHours();
    if (hoursMap[h]) {
      hoursMap[h].revenue += s.total;
      hoursMap[h].bills += 1;
    }
  });

  return Object.entries(hoursMap).map(([hStr, data]) => {
    const h = Number(hStr);
    const label =
      h === 12
        ? "12 PM"
        : h > 12
        ? `${h - 12} PM`
        : `${h} AM`;
    return {
      hour: h,
      hourLabel: label,
      revenue: data.revenue,
      bills: data.bills,
    };
  });
}
