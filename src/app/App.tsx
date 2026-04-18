import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { FeaturedPlayer } from "@/app/components/FeaturedPlayer";
import { About } from "@/app/components/About";
import { Services } from "@/app/components/Services";
import { Shop, Product } from "@/app/components/Shop";
import { FreeDownloads } from "@/app/components/FreeDownloads";
import { MoviesSection } from "@/app/components/MoviesSection";
import { SoftwareSection } from "@/app/components/SoftwareSection";
import { Gallery } from "@/app/components/Gallery";
import { Contact } from "@/app/components/Contact";
import { Footer } from "@/app/components/Footer";
import { Cart } from "@/app/components/Cart";
import { AdminAuthProvider, AdminLogoutButton } from "@/app/components/AdminAuth";
import { AdminUploadPanel } from "@/app/components/AdminUploadPanel";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        onSearch={setSearchQuery} 
      />
      <Hero />
      <FeaturedPlayer />
      <About />
      <Services />
      <Shop onAddToCart={handleAddToCart} searchQuery={searchQuery} />
      <FreeDownloads searchQuery={searchQuery} />
      <MoviesSection searchQuery={searchQuery} />
      <SoftwareSection searchQuery={searchQuery} />
      <Gallery />
      <Contact />
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
      <AdminAuthProvider>
        <AdminUploadPanel />
        <AdminLogoutButton />
      </AdminAuthProvider>
    </div>
  );
}