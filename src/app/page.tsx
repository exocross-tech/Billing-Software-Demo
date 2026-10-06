"use client";

import React, { useState, useMemo } from "react";
import { TabType, Product, ShopDetails, SaleRecord, CartItem } from "@/types/billing";
import { DEFAULT_PRODUCTS, DEFAULT_SHOP } from "@/lib/constants";
import { generateSeedSales } from "@/lib/seedData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Sidebar } from "@/components/Sidebar";
import { BillTab } from "@/components/BillTab";
import { DashboardTab } from "@/components/DashboardTab";
import { ItemsTab } from "@/components/ItemsTab";
import { ShopDetailsTab } from "@/components/ShopDetailsTab";
import { SalesTab } from "@/components/SalesTab";

export default function HomePage() {
  const [products, setProducts] = useLocalStorage<Product[]>(
    "pos.products",
    DEFAULT_PRODUCTS
  );
  const [shop, setShop] = useLocalStorage<ShopDetails>(
    "pos.shop",
    DEFAULT_SHOP
  );
  const [sales, setSales] = useLocalStorage<SaleRecord[]>(
    "pos.sales",
    generateSeedSales()
  );

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const handleResetDemoData = () => {
    if (confirm("Load realistic sample sales and stock data?")) {
      setProducts(DEFAULT_PRODUCTS);
      setSales(generateSeedSales());
      setCart([]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Responsive Navigation: Fixed Desktop Sidebar + Mobile Top Header + Mobile Bottom Nav */}
      <Sidebar
        shop={shop}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemoData={handleResetDemoData}
        cartCount={cartTotalItems}
      />

      {/* Main Content Area (Full width on mobile, offset by pl-60 on desktop, pb-20 for mobile bottom nav) */}
      <div className="flex-1 w-full pl-0 md:pl-60 min-h-screen pb-20 md:pb-0 overflow-x-hidden">
        {activeTab === "bill" && (
          <BillTab
            products={products}
            setProducts={setProducts}
            shop={shop}
            sales={sales}
            setSales={setSales}
            cart={cart}
            setCart={setCart}
          />
        )}

        {activeTab === "dashboard" && (
          <DashboardTab
            sales={sales}
            products={products}
            onNewBillClick={() => setActiveTab("bill")}
          />
        )}

        {activeTab === "items" && (
          <ItemsTab products={products} setProducts={setProducts} />
        )}

        {activeTab === "shop" && (
          <ShopDetailsTab shop={shop} setShop={setShop} />
        )}

        {activeTab === "sales" && (
          <SalesTab sales={sales} setSales={setSales} />
        )}
      </div>
    </div>
  );
}

