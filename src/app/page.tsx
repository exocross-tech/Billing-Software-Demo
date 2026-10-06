"use client";

import React, { useState } from "react";
import { TabType, Product, ShopDetails, SaleRecord } from "@/types/billing";
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

  const handleResetDemoData = () => {
    if (confirm("Load realistic sample sales and stock data?")) {
      setProducts(DEFAULT_PRODUCTS);
      setSales(generateSeedSales());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Left Sidebar */}
      <Sidebar
        shop={shop}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemoData={handleResetDemoData}
      />

      {/* Main Content Area (Offset by sidebar width w-60) */}
      <div className="pl-60 min-h-screen">
        {activeTab === "bill" && (
          <BillTab
            products={products}
            setProducts={setProducts}
            shop={shop}
            sales={sales}
            setSales={setSales}
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
