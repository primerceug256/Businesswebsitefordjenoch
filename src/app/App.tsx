import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { About } from "@/app/components/About";
import { Gallery } from "@/app/components/Gallery";
import { FreeDownloads } from "@/app/components/FreeDownloads";
import { SoftwareSection } from "@/app/components/SoftwareSection";
import { Shop } from "@/app/components/Shop";
import { MoviesSection } from "@/app/components/MoviesSection";
import { Services } from "@/app/components/Services";
import { Contact } from "@/app/components/Contact";
import { Footer } from "@/app/components/Footer";
import { Cart } from "@/app/components/Cart";
import { AdminAuthProvider } from "@/app/components/AdminAuth";
import { AdminUploadPanel } from "@/app/components/AdminUploadPanel";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product: any) => {
    setCartItems(prev => [...prev, { product, quantity: 1, id: Date.now().toString() }]);
    setIsCartOpen(true);
  };

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-white text-black selection:bg-orange-500 selection:text-white">
        <Header 
          cartCount={cartItems.length} 
          onCartClick={() => setIsCartOpen(true)} 
          onSearch={setSearchQuery} 
        />
        <main>
          <Hero />
          <About />
          <Gallery />
          <FreeDownloads searchQuery={searchQuery} />
          <SoftwareSection onAddToCart={handleAddToCart} searchQuery={searchQuery} />
          <Shop onAddToCart={handleAddToCart} />
          <MoviesSection searchQuery={searchQuery} />
          <Services />
          <Contact />
        </main>
        <Footer />
        
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={() => {}}
          onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.product.id !== id))}
          onClearCart={() => setCartItems([])}
        />
        
        <AdminUploadPanel />
      </div>
    </AdminAuthProvider>
  );
}