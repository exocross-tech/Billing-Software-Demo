import { Product, ShopDetails } from "@/types/billing";

export const DEFAULT_PRODUCTS: Product[] = [
  { id: "1", name: "Basmati Rice 1kg", price: 120, cost: 95, gst: 5, hsn: "1006", stock: 45 },
  { id: "2", name: "Toor Dal 1kg", price: 160, cost: 130, gst: 5, hsn: "0713", stock: 28 },
  { id: "3", name: "Sunflower Oil 1L", price: 145, cost: 115, gst: 5, hsn: "1512", stock: 18 },
  { id: "4", name: "Bath Soap", price: 45, cost: 35, gst: 18, hsn: "3401", stock: 8 },
  { id: "5", name: "Toothpaste 150g", price: 95, cost: 75, gst: 18, hsn: "3306", stock: 14 },
  { id: "6", name: "Biscuits Pack", price: 30, cost: 22, gst: 18, hsn: "1905", stock: 4 },
  { id: "7", name: "Ghee 500ml", price: 310, cost: 250, gst: 12, hsn: "0405", stock: 12 },
  { id: "8", name: "Cold Drink 750ml", price: 40, cost: 30, gst: 28, hsn: "2202", stock: 0 },
];

export const DEFAULT_SHOP: ShopDetails = {
  name: "My Shop",
  address: "Main Road, City",
  gstin: "",
  phone: "",
};

export const GST_RATES = [0, 5, 12, 18, 28];

export const formatCurrency = (val: number): string =>
  "₹" +
  val.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const getCostPrice = (product: { cost?: number; price: number }): number =>
  product.cost ?? product.price * 0.8;
