import type { Order } from "../../../types";
import type { Db } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

interface DemoOrderSeed {
  daysAgo: number;
  customer_name: string;
  customer_email: string;
  city: string;
  country: string;
  currency: string;
  status: Order["status"];
  sales_channel: Order["sales_channel"];
  items: { title: string; price: number; quantity: number }[];
  tracking_number?: string;
}

const seeds: DemoOrderSeed[] = [
  {
    daysAgo: 1,
    customer_name: "Claire Dubois",
    customer_email: "claire.dubois@example.com",
    city: "Paris",
    country: "FR",
    currency: "EUR",
    status: "paid",
    sales_channel: "direct",
    items: [{ title: "Atlas Kilim Duffle", price: 68000, quantity: 1 }],
  },
  {
    daysAgo: 2,
    customer_name: "James Whitford",
    customer_email: "j.whitford@example.com",
    city: "London",
    country: "GB",
    currency: "GBP",
    status: "shipped",
    sales_channel: "direct",
    items: [{ title: "Expedition Rolltop — Cognac", price: 54000, quantity: 1 }],
    tracking_number: "DHL-7724019583",
  },
  {
    daysAgo: 4,
    customer_name: "Sofia Marchetti",
    customer_email: "sofia.marchetti@example.com",
    city: "Milan",
    country: "IT",
    currency: "EUR",
    status: "delivered",
    sales_channel: "direct",
    items: [
      { title: "Saddle Crossbody — Noir", price: 32000, quantity: 1 },
      { title: "Travel Dopp Kit", price: 14500, quantity: 1 },
    ],
    tracking_number: "DHL-7724016710",
  },
  {
    daysAgo: 6,
    customer_name: "Daniel Okafor",
    customer_email: "d.okafor@example.com",
    city: "New York",
    country: "US",
    currency: "USD",
    status: "paid",
    sales_channel: "direct",
    items: [{ title: "Weekender Tote — Saddle Tan", price: 49500, quantity: 1 }],
  },
  {
    daysAgo: 9,
    customer_name: "Emma Lindqvist",
    customer_email: "emma.lindqvist@example.com",
    city: "Stockholm",
    country: "SE",
    currency: "EUR",
    status: "delivered",
    sales_channel: "etsy",
    items: [{ title: "Card Holder — Chestnut", price: 9500, quantity: 2 }],
    tracking_number: "POSTNORD-99105532",
  },
  {
    daysAgo: 12,
    customer_name: "Marcus Bell",
    customer_email: "marcus.bell@example.com",
    city: "San Francisco",
    country: "US",
    currency: "USD",
    status: "shipped",
    sales_channel: "direct",
    items: [{ title: "Briefcase — Ebène", price: 72000, quantity: 1 }],
    tracking_number: "DHL-7723998841",
  },
  {
    daysAgo: 15,
    customer_name: "Claire Dubois",
    customer_email: "claire.dubois@example.com",
    city: "Paris",
    country: "FR",
    currency: "EUR",
    status: "delivered",
    sales_channel: "direct",
    items: [{ title: "Belt — Hand-burnished Tan", price: 12500, quantity: 1 }],
    tracking_number: "DHL-7723984412",
  },
  {
    daysAgo: 19,
    customer_name: "Hannah Reiss",
    customer_email: "hannah.reiss@example.com",
    city: "Berlin",
    country: "DE",
    currency: "EUR",
    status: "pending",
    sales_channel: "direct",
    items: [{ title: "Market Tote — Natural", price: 38000, quantity: 1 }],
  },
  {
    daysAgo: 24,
    customer_name: "Oliver Grant",
    customer_email: "oliver.grant@example.com",
    city: "Chicago",
    country: "US",
    currency: "USD",
    status: "delivered",
    sales_channel: "etsy",
    items: [{ title: "Travel Journal Cover", price: 11000, quantity: 1 }],
    tracking_number: "USPS-94001118822",
  },
  {
    daysAgo: 31,
    customer_name: "Yuki Tanaka",
    customer_email: "yuki.tanaka@example.com",
    city: "Tokyo",
    country: "JP",
    currency: "USD",
    status: "delivered",
    sales_channel: "direct",
    items: [
      { title: "Expedition Rolltop — Olive", price: 54000, quantity: 1 },
      { title: "Luggage Tag", price: 4500, quantity: 1 },
    ],
    tracking_number: "DHL-7723871190",
  },
];

export const generateOrders = (_: Db): Order[] => {
  const now = Date.now();
  return seeds.map((seed, index) => {
    const created = new Date(now - seed.daysAgo * DAY_MS).toISOString();
    const items = seed.items.map((item, itemIndex) => ({
      product_id: `demo-${index}-${itemIndex}`,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return {
      id: index + 1,
      order_number: `MT-${String(100200 + index * 137).padStart(6, "0")}`,
      sales_channel: seed.sales_channel,
      stripe_payment_intent_id:
        seed.sales_channel === "direct" ? `pi_demo${1000 + index}` : undefined,
      etsy_order_id:
        seed.sales_channel === "etsy" ? `demo-etsy-${2000 + index}` : undefined,
      customer_email: seed.customer_email,
      customer_name: seed.customer_name,
      shipping_address: {
        line1: "12 Demo Street",
        city: seed.city,
        postal_code: "00000",
        country: seed.country,
      },
      items,
      subtotal,
      shipping_cost: 0,
      total: subtotal,
      currency: seed.currency,
      status: seed.status,
      tracking_number: seed.tracking_number,
      shipping_email_sent_at: seed.tracking_number ? created : undefined,
      created_at: created,
      updated_at: created,
    };
  });
};
