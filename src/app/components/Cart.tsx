import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, Trash2, Loader } from "lucide-react";
import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// ... interfaces

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", phone: "" });

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          customerName: checkoutForm.name,
          customerEmail: checkoutForm.email,
          customerPhone: checkoutForm.phone,
          items: items.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
            category: i.product.category
          })),
          total,
          paymentMethod: "Airtel Money",
          paymentPhone: checkoutForm.phone
        })
      });

      if (response.ok) {
        alert(`Order Submitted! Please ensure you have sent ${total.toLocaleString()} UGX to +256747816444 via Airtel Money. Your downloads will be sent to ${checkoutForm.email} once verified.`);
        onClearCart();
        onClose();
        setIsCheckingOut(false);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (err) {
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... render logic remains similar but uses isSubmitting for the button state
}