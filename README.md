# EC BILL — GST Shop Billing Software

A fast, modern counter billing software built with **React / Next.js (App Router)** and **Tailwind CSS**, designed specifically for Indian retail shops and counters with GST calculation, thermal receipt formatting, real-time inventory management, and a compact, at-a-glance store dashboard.

- **No Database required** — all data is saved locally on device in `localStorage`.
- **No Authentication / No Sign up** — ready to bill immediately out of the box.

---

## ✨ Features

### 1. Left Fixed Sidebar Navigation
- Sleek, fixed desktop navigation sidebar (`w-60`) giving full vertical space to billing and analytics.
- Instant tab switching:
  - 🧾 **Bill Counter**: fast item addition, discount, thermal receipt preview, and one-click print & save.
  - 📊 **Dashboard**: compact single-screen overview with 4 core KPI cards and analytics.
  - 📦 **Items & Stock**: product catalog with in-place price, cost, and stock editing.
  - 📜 **Sales History**: complete transaction ledger with payment status filters (`Paid` vs `Pending / Due`).
  - ⚙️ **Shop Details**: store name, address, phone number, and GSTIN customization.
- **Load Sample Data**: 1-click button to load realistic sales, stock, and pending dues for testing.

---

### 2. Compact Store Dashboard (Zero Heavy Scrolling)
Designed to fit comfortably on screen at a glance:
- **The 4 Focused KPI Cards**:
  1. **Today's Sales**: live total revenue collected today with bill count.
  2. **Today's Profit**: estimated net profit today with gross profit margin %.
  3. **Pending Payments**: total counter dues with pending bill counts.
  4. **Total Bills**: lifetime bills generated.
- **7-Day Sales Trajectory (Compact 110px Mini-Bar Chart)**:
  - Clean day-by-day sales volume.
  - **Today's bar accented in Marigold** for quick orientation.
  - Hover tooltips showing exact daily revenue and bills.
- **Recent Counter Bills**:
  - Latest 4 checkout records with customer/walk-in tags, payment status badges (`Paid` or `Due`), and totals.
- **Inventory Quick Status**:
  - Segmented progress bar showing In Stock, Low Stock, and Out of Stock.
  - Restock priority chips highlighting critical items (e.g. `Bath Soap: 4 left`).
- **Top Sellers Today**:
  - Top 3 fast-moving items of the day with progress bars and units sold count.

---

### 3. Instant Counter Billing (`Bill Counter` tab)
- Searchable catalog of items with real-time stock indicators (*In Stock*, *Only X left*, *Out of stock*).
- Auto-deducts stock upon finalizing each bill.
- Payment status selector: choose between **Paid** and **Due (Pending Khata)**.
- 80mm thermal receipt preview with realistic jagged edges (`receipt-edge`) and `@media print` rules.
- IGST vs CGST/SGST 50/50 split toggle.
- Discount in ₹ and automatic mathematical round-off.

---

### 4. Sales History & Khata Tracking (`Sales History` tab)
- Filter transactions by **All**, **Paid**, or **Pending Dues**.
- 1-click **"Mark as Paid"** action when a customer clears their counter due.

---

## 🚀 Running the App

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
*(Build command remains on hold per instruction).*
