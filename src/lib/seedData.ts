import { SaleRecord } from "@/types/billing";

export function generateSeedSales(): SaleRecord[] {
  const now = new Date();
  
  // Helper for generating relative timestamps
  const getTime = (daysAgo: number, hours: number, minutes: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, minutes, 0, 0);
    return d.getTime();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const seed: SaleRecord[] = [
    // Today's Sales (6 bills)
    {
      no: 32,
      ts: getTime(0, 16, 20),
      date: formatDate(getTime(0, 16, 20)),
      total: 320,
      tax: 32.5,
      profit: 85,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Sunflower Oil 1L", qty: 2, gross: 290 },
        { name: "Biscuits Pack", qty: 1, gross: 30 },
      ],
    },
    {
      no: 31,
      ts: getTime(0, 15, 10),
      date: formatDate(getTime(0, 15, 10)),
      total: 240,
      tax: 28,
      profit: 62,
      customer: "Vikram Singh (Khata)",
      paymentStatus: "pending",
      items: [
        { name: "Basmati Rice 1kg", qty: 2, gross: 240 },
      ],
    },
    {
      no: 30,
      ts: getTime(0, 14, 5),
      date: formatDate(getTime(0, 14, 5)),
      total: 580,
      tax: 58.4,
      profit: 148,
      customer: "Anita Verma (Due)",
      paymentStatus: "pending",
      items: [
        { name: "Ghee 500ml", qty: 1, gross: 310 },
        { name: "Sunflower Oil 1L", qty: 1, gross: 145 },
        { name: "Toothpaste 150g", qty: 1, gross: 95 },
        { name: "Biscuits Pack", qty: 1, gross: 30 },
      ],
    },
    {
      no: 29,
      ts: getTime(0, 12, 45),
      date: formatDate(getTime(0, 12, 45)),
      total: 485,
      tax: 42,
      profit: 125,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Toor Dal 1kg", qty: 2, gross: 320 },
        { name: "Sunflower Oil 1L", qty: 1, gross: 145 },
        { name: "Bath Soap", qty: 1, gross: 45 },
      ],
    },
    {
      no: 28,
      ts: getTime(0, 11, 15),
      date: formatDate(getTime(0, 11, 15)),
      total: 760,
      tax: 72.8,
      profit: 195,
      customer: "Rahul Sharma",
      paymentStatus: "paid",
      items: [
        { name: "Ghee 500ml", qty: 2, gross: 620 },
        { name: "Biscuits Pack", qty: 3, gross: 90 },
        { name: "Cold Drink 750ml", qty: 1, gross: 40 },
      ],
    },
    {
      no: 27,
      ts: getTime(0, 9, 30),
      date: formatDate(getTime(0, 9, 30)),
      total: 420,
      tax: 36.2,
      profit: 108,
      customer: "Pooja Patel",
      paymentStatus: "paid",
      items: [
        { name: "Basmati Rice 1kg", qty: 2, gross: 240 },
        { name: "Toor Dal 1kg", qty: 1, gross: 160 },
      ],
    },

    // Yesterday's Sales (5 bills)
    {
      no: 26,
      ts: getTime(1, 19, 10),
      date: formatDate(getTime(1, 19, 10)),
      total: 650,
      tax: 62,
      profit: 168,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Sunflower Oil 1L", qty: 2, gross: 290 },
        { name: "Basmati Rice 1kg", qty: 3, gross: 360 },
      ],
    },
    {
      no: 25,
      ts: getTime(1, 17, 45),
      date: formatDate(getTime(1, 17, 45)),
      total: 410,
      tax: 40.5,
      profit: 105,
      customer: "Amit Kumar",
      paymentStatus: "paid",
      items: [
        { name: "Ghee 500ml", qty: 1, gross: 310 },
        { name: "Toothpaste 150g", qty: 1, gross: 95 },
      ],
    },
    {
      no: 24,
      ts: getTime(1, 15, 20),
      date: formatDate(getTime(1, 15, 20)),
      total: 320,
      tax: 28,
      profit: 80,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [{ name: "Toor Dal 1kg", qty: 2, gross: 320 }],
    },
    {
      no: 23,
      ts: getTime(1, 12, 10),
      date: formatDate(getTime(1, 12, 10)),
      total: 510,
      tax: 48,
      profit: 130,
      customer: "Deepak S.",
      paymentStatus: "paid",
      items: [
        { name: "Basmati Rice 1kg", qty: 3, gross: 360 },
        { name: "Sunflower Oil 1L", qty: 1, gross: 145 },
      ],
    },
    {
      no: 22,
      ts: getTime(1, 10, 0),
      date: formatDate(getTime(1, 10, 0)),
      total: 280,
      tax: 25,
      profit: 72,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Bath Soap", qty: 4, gross: 180 },
        { name: "Toothpaste 150g", qty: 1, gross: 95 },
      ],
    },

    // 2 Days Ago (4 bills)
    {
      no: 21,
      ts: getTime(2, 18, 30),
      date: formatDate(getTime(2, 18, 30)),
      total: 820,
      tax: 78,
      profit: 210,
      customer: "Ramesh Sharma",
      paymentStatus: "paid",
      items: [
        { name: "Ghee 500ml", qty: 2, gross: 620 },
        { name: "Toor Dal 1kg", qty: 1, gross: 160 },
        { name: "Cold Drink 750ml", qty: 1, gross: 40 },
      ],
    },
    {
      no: 20,
      ts: getTime(2, 14, 15),
      date: formatDate(getTime(2, 14, 15)),
      total: 380,
      tax: 35,
      profit: 96,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Sunflower Oil 1L", qty: 2, gross: 290 },
        { name: "Biscuits Pack", qty: 3, gross: 90 },
      ],
    },
    {
      no: 19,
      ts: getTime(2, 11, 40),
      date: formatDate(getTime(2, 11, 40)),
      total: 440,
      tax: 38,
      profit: 112,
      customer: "Kiran Devi",
      paymentStatus: "paid",
      items: [
        { name: "Basmati Rice 1kg", qty: 2, gross: 240 },
        { name: "Toothpaste 150g", qty: 2, gross: 190 },
      ],
    },
    {
      no: 18,
      ts: getTime(2, 9, 50),
      date: formatDate(getTime(2, 9, 50)),
      total: 290,
      tax: 24,
      profit: 75,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [{ name: "Sunflower Oil 1L", qty: 2, gross: 290 }],
    },

    // 3 Days Ago (3 bills)
    {
      no: 17,
      ts: getTime(3, 17, 10),
      date: formatDate(getTime(3, 17, 10)),
      total: 940,
      tax: 91,
      profit: 240,
      customer: "Sanjay Joshi",
      paymentStatus: "paid",
      items: [
        { name: "Ghee 500ml", qty: 2, gross: 620 },
        { name: "Toor Dal 1kg", qty: 2, gross: 320 },
      ],
    },
    {
      no: 16,
      ts: getTime(3, 13, 20),
      date: formatDate(getTime(3, 13, 20)),
      total: 310,
      tax: 28,
      profit: 80,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [{ name: "Ghee 500ml", qty: 1, gross: 310 }],
    },
    {
      no: 15,
      ts: getTime(3, 10, 30),
      date: formatDate(getTime(3, 10, 30)),
      total: 420,
      tax: 38,
      profit: 105,
      customer: "Neelam P.",
      paymentStatus: "paid",
      items: [
        { name: "Basmati Rice 1kg", qty: 2, gross: 240 },
        { name: "Bath Soap", qty: 4, gross: 180 },
      ],
    },

    // 4 Days Ago (3 bills)
    {
      no: 14,
      ts: getTime(4, 18, 0),
      date: formatDate(getTime(4, 18, 0)),
      total: 710,
      tax: 68,
      profit: 180,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Sunflower Oil 1L", qty: 2, gross: 290 },
        { name: "Toor Dal 1kg", qty: 2, gross: 320 },
        { name: "Toothpaste 150g", qty: 1, gross: 95 },
      ],
    },
    {
      no: 13,
      ts: getTime(4, 14, 40),
      date: formatDate(getTime(4, 14, 40)),
      total: 360,
      tax: 32,
      profit: 90,
      customer: "Rajesh K.",
      paymentStatus: "paid",
      items: [{ name: "Basmati Rice 1kg", qty: 3, gross: 360 }],
    },
    {
      no: 12,
      ts: getTime(4, 11, 15),
      date: formatDate(getTime(4, 11, 15)),
      total: 450,
      tax: 42,
      profit: 115,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Toor Dal 1kg", qty: 2, gross: 320 },
        { name: "Biscuits Pack", qty: 4, gross: 120 },
      ],
    },

    // 5 Days Ago (3 bills)
    {
      no: 11,
      ts: getTime(5, 17, 30),
      date: formatDate(getTime(5, 17, 30)),
      total: 620,
      tax: 58,
      profit: 155,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Ghee 500ml", qty: 1, gross: 310 },
        { name: "Sunflower Oil 1L", qty: 2, gross: 290 },
      ],
    },
    {
      no: 10,
      ts: getTime(5, 12, 10),
      date: formatDate(getTime(5, 12, 10)),
      total: 480,
      tax: 44,
      profit: 120,
      customer: "Sunil Mehra",
      paymentStatus: "paid",
      items: [
        { name: "Basmati Rice 1kg", qty: 4, gross: 480 },
      ],
    },
    {
      no: 9,
      ts: getTime(5, 9, 45),
      date: formatDate(getTime(5, 9, 45)),
      total: 335,
      tax: 30,
      profit: 85,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Sunflower Oil 1L", qty: 1, gross: 145 },
        { name: "Toothpaste 150g", qty: 1, gross: 95 },
        { name: "Toothpaste 150g", qty: 1, gross: 95 },
      ],
    },

    // 6 Days Ago (3 bills)
    {
      no: 8,
      ts: getTime(6, 18, 15),
      date: formatDate(getTime(6, 18, 15)),
      total: 800,
      tax: 75,
      profit: 205,
      customer: "Harish V.",
      paymentStatus: "paid",
      items: [
        { name: "Toor Dal 1kg", qty: 3, gross: 480 },
        { name: "Basmati Rice 1kg", qty: 2, gross: 240 },
        { name: "Biscuits Pack", qty: 2, gross: 60 },
      ],
    },
    {
      no: 7,
      ts: getTime(6, 14, 0),
      date: formatDate(getTime(6, 14, 0)),
      total: 455,
      tax: 41,
      profit: 115,
      customer: "Walk-in",
      paymentStatus: "paid",
      items: [
        { name: "Ghee 500ml", qty: 1, gross: 310 },
        { name: "Sunflower Oil 1L", qty: 1, gross: 145 },
      ],
    },
    {
      no: 6,
      ts: getTime(6, 10, 20),
      date: formatDate(getTime(6, 10, 20)),
      total: 380,
      tax: 34,
      profit: 95,
      customer: "Priya S.",
      paymentStatus: "paid",
      items: [
        { name: "Basmati Rice 1kg", qty: 2, gross: 240 },
        { name: "Toothpaste 150g", qty: 1, gross: 95 },
        { name: "Bath Soap", qty: 1, gross: 45 },
      ],
    },
  ];

  return seed;
}
