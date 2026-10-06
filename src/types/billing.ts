export interface Product {
  id: string;
  name: string;
  price: number;
  cost?: number;
  gst: number;
  hsn?: string;
  stock?: number;
  category?: string;
}

export interface CartItem {
  id: string;
  qty: number;
}

export interface CalculatedLineItem extends Product {
  qty: number;
  gross: number;
  taxable: number;
  tax: number;
}

export interface ShopDetails {
  name: string;
  address: string;
  phone: string;
  gstin: string;
}

export interface SaleItem {
  name: string;
  qty: number;
  gross: number;
}

export interface SaleRecord {
  no: number;
  date: string;
  total: number;
  customer?: string;
  ts: number;
  tax: number;
  profit: number;
  paymentStatus?: 'paid' | 'pending';
  items: SaleItem[];
}

export interface InventoryStats {
  totalItems: number;
  totalUnits: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalRetailValue: number;
  totalCostValue: number;
}

export type TabType = 'dashboard' | 'bill' | 'items' | 'shop' | 'sales';
