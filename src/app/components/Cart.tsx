import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, Trash2, Download, CheckCircle } from "lucide-react";
import { useState } from "react";
import { projectId, publicAnonKey } from '@utils/supabase/info';

interface Product {
  id: string;
  name: string;
  price: number;
  category: "drop" | "software";
  description: string;
  features: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    alert(`Thank you for your order!\n\nTotal: ${total.toLocaleString()} UGX\n\nWe'll send your digital products to ${checkoutForm.email} shortly.`);
    onClearCart();
    setIsCheckingOut(true);
    setCheckoutForm({ name: "", email: "", phone: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-gradient-to-b from-gray-900 to-black border-l border-purple-500/30 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">
                  Shopping Cart ({itemCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                  <p className="text-gray-500 mt-2">Add some products to get started!</p>
                </div>
              ) : isCheckingOut ? (
                // Checkout Form
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">Checkout Information</h3>
                  </div>

                  <div>
                    <label htmlFor="checkout-name" className="block text-white mb-2">Full Name *</label>
                    <input
                      type="text"
                      id="checkout-name"
                      required
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-email" className="block text-white mb-2">Email *</label>
                    <input
                      type="email"
                      id="checkout-email"
                      required
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                    <p className="text-sm text-gray-400 mt-1">Products will be sent to this email</p>
                  </div>

                  <div>
                    <label htmlFor="checkout-phone" className="block text-white mb-2">Phone (Mobile Money) *</label>
                    <input
                      type="tel"
                      id="checkout-phone"
                      required
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="+256..."
                    />
                    <p className="text-sm text-gray-400 mt-1">For mobile money payment</p>
                  </div>

                  {/* Mobile Money Payment Instructions */}
                  <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg p-6 border border-red-500/30">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                      </svg>
                      Airtel Money Payment
                    </h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="font-semibold text-white">Send {total.toLocaleString()} UGX to:</p>
                      <div className="bg-black/40 rounded p-3 border border-red-500/20">
                        <p className="text-lg font-bold text-red-300">+256 747 816 444</p>
                        <p className="text-xs text-gray-400 mt-1">Airtel Money</p>
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="font-semibold text-white">Steps:</p>
                        <p>1. Dial *185*1*1# on your Airtel line</p>
                        <p>2. Select "Send Money"</p>
                        <p>3. Enter: <span className="text-red-300 font-semibold">+256747816444</span></p>
                        <p>4. Enter amount: <span className="text-red-300 font-semibold">{total.toLocaleString()} UGX</span></p>
                        <p>5. Confirm payment</p>
                      </div>
                      <p className="mt-3 text-yellow-300 text-xs">
                          After payment, submit this form and we'll deliver your products via email within 10 minutes.
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                    <h4 className="text-white font-semibold mb-2">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-gray-300">
                          <span>{item.product.name} x{item.quantity}</span>
                          <span>{(item.product.price * item.quantity).toLocaleString()} UGX</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between text-white font-bold">
                        <span>Total</span>
                        <span>{total.toLocaleString()} UGX</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      Complete Order
                    </button>
                  </div>
                </form>
              ) : (
                // Cart Items
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{item.product.name}</h3>
                          <p className="text-sm text-gray-400">{item.product.category === "drop" ? "DJ Drop" : "Software"}</p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                            className="p-2 hover:bg-gray-800 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-400" />
                          </button>
                          <span className="text-white w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-800 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-white">
                            {(item.product.price * item.quantity).toLocaleString()} UGX
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.product.price.toLocaleString()} UGX each
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && !isCheckingOut && (
              <div className="border-t border-gray-800 p-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-white">{total.toLocaleString()} <span className="text-gray-400">UGX</span></span>
                </div>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={onClearCart}
                  className="w-full border border-gray-700 text-gray-400 px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}