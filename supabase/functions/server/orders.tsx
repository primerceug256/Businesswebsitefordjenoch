import * as kv from "./kv_store.tsx";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentPhone: string;
  status: "pending" | "paid" | "delivered";
  createdAt: string;
  deliveryLinks?: { [productId: string]: string };
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  category: "drop" | "software";
}

// Create new order
export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "status">) {
  const orderId = `order-${Date.now()}`;
  const order: Order = {
    ...orderData,
    id: orderId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  
  await kv.set(`order:${orderId}`, order);
  return order;
}

// Get order by ID
export async function getOrder(orderId: string) {
  return await kv.get(`order:${orderId}`);
}

// Update order status and add delivery links
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "delivered",
  deliveryLinks?: { [productId: string]: string }
) {
  const order = await kv.get(`order:${orderId}`) as Order;
  if (!order) {
    throw new Error("Order not found");
  }

  const updatedOrder = {
    ...order,
    status,
    deliveryLinks: deliveryLinks || order.deliveryLinks,
  };

  await kv.set(`order:${orderId}`, updatedOrder);
  return updatedOrder;
}

// Get all orders
export async function getAllOrders() {
  const orders = await kv.getByPrefix("order:");
  return orders;
}

// Software download links (in a real app, these would be in Supabase Storage)
export const SOFTWARE_LINKS = {
  "software-1": "https://drive.google.com/file/d/YOUR_SONY_ACID_PRO_LINK/view?usp=sharing",
  "software-2": "https://drive.google.com/file/d/YOUR_SONY_VEGAS_PRO_LINK/view?usp=sharing",
  "software-3": "https://drive.google.com/file/d/YOUR_VIRTUAL_DJ_LINK/view?usp=sharing",
};

// DJ Drop download links (in a real app, these would be in Supabase Storage)
export const DROP_LINKS = {
  "drop-1": "https://drive.google.com/file/d/YOUR_SIGNATURE_DROP_LINK/view?usp=sharing",
  "drop-2": "https://drive.google.com/file/d/YOUR_PARTY_DROP_LINK/view?usp=sharing",
  "drop-3": "https://drive.google.com/file/d/YOUR_CLUB_DROP_LINK/view?usp=sharing",
};

// Generate delivery links for an order
export function generateDeliveryLinks(items: OrderItem[]) {
  const deliveryLinks: { [productId: string]: string } = {};
  
  items.forEach(item => {
    if (item.category === "software") {
      deliveryLinks[item.productId] = SOFTWARE_LINKS[item.productId as keyof typeof SOFTWARE_LINKS] || "#";
    } else if (item.category === "drop") {
      deliveryLinks[item.productId] = DROP_LINKS[item.productId as keyof typeof DROP_LINKS] || "#";
    }
  });
  
  return deliveryLinks;
}
