import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, Trash2, Loader } from "lucide-react";
import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Product { id: string; name: string; price: number; category: "drop" | "software"; }
interface CartItem { product: Product; quantity: number; }
interface CartProps { isOpen: boolean; onClose: () => void; items: CartItem[]; onUpdateQuantity: (productId: string, quantity: number) => void; onRemoveItem: (productId: string) => void; onClearCart: () => void; }

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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
        body: JSON.stringify({
          customerName: checkoutForm.name,
          customerEmail: checkoutForm.email,
          customerPhone: checkoutForm.phone,
          items: items.map(i => ({ productId: i.product.id, productName: i.product.name, quantity: i.quantity, price: i.product.price, category: i.product.category })),
          total,
          paymentMethod: "Airtel Money",
          paymentPhone: checkoutForm.phone
        })
      });

      if (response.ok) {
        alert(`Order Placed! Please send ${total.toLocaleString()} UGX to +256747816444 via Airtel Money. Your downloads will be sent to ${checkoutForm.email} once payment is verified.`);
        onClearCart();
        onClose();
        setIsCheckingOut(false);
      } else {
        throw new Error();
      }
    } catch {
      alert("Error processing order. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div onClick={onClose} className="fixed inset-0 bg-black/60 z-50" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-gray-900 z-50 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Cart ({items.length})</h2>
              <button onClick={onClose}><X className="text-white" /></button>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : isCheckingOut ? (
              <form onSubmit={handleCheckout} className="space-y-4">
                <input required placeholder="Your Name" className="w-full p-3 bg-gray-800 text-white rounded" onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} />
                <input required type="email" placeholder="Your Email" className="w-full p-3 bg-gray-800 text-white rounded" onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})} />
                <input required placeholder="Airtel Money Number" className="w-full p-3 bg-gray-800 text-white rounded" onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} />
                <div className="bg-orange-600/20 p-4 border border-orange-600 rounded text-white text-sm">
                  Send {total.toLocaleString()} UGX to +256 747 816 444
                </div>
                <button disabled={isSubmitting} className="w-full bg-orange-600 py-4 rounded font-bold text-white flex justify-center">
                  {isSubmitting ? <Loader className="animate-spin" /> : "Confirm & Pay"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.product.id} className="bg-gray-800 p-4 rounded flex justify-between">
                    <div>
                      <h4 className="text-white font-bold">{item.product.name}</h4>
                      <p className="text-gray-400">{item.product.price} UGX</p>
                    </div>
                    <button onClick={() => onRemoveItem(item.product.id)}><Trash2 className="text-red-500 w-4"/></button>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-white text-xl font-bold">Total: {total.toLocaleString()} UGX</p>
                  <button onClick={() => setIsCheckingOut(true)} className="w-full bg-orange-600 py-4 mt-4 rounded text-white font-bold">Proceed to Checkout</button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}