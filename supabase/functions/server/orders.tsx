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

// Generate delivery links for an order
export async function generateDeliveryLinks(items: OrderItem[]) {
  const deliveryLinks: { [productId: string]: string } = {};
  
  for (const item of items) {
    if (item.category === "software") {
      // Fetch dynamic metadata saved during admin upload
      const softwareData = await kv.get(`software:${item.productId}`);
      deliveryLinks[item.productId] = softwareData?.downloadUrl || "#";
    } else {
      // Fallback for other categories (like drops if stored as tracks)
      const trackData = await kv.get(`track:${item.productId}`);
      deliveryLinks[item.productId] = trackData?.audioUrl || "#";
    }
  }
  
  return deliveryLinks;
}
