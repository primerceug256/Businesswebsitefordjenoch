import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Gallery } from "./components/Gallery";
import { FreeDownloads } from "./components/FreeDownloads";
import { SoftwareSection } from "./components/SoftwareSection";
import { Shop } from "./components/Shop";
import { MoviesSection } from "./components/MoviesSection";
import { Services } from "./components/Services";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Cart } from "./components/Cart";
import { AdminAuthProvider } from "./components/AdminAuth";
import { AdminUploadPanel } from "./components/AdminUploadPanel";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product: any) => {
    setCartItems(prev => [...prev, { product, quantity: 1, id: Date.now() }]);
    setIsCartOpen(true);
  };

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-white text-black font-sans">
        <Header 
          cartCount={cartItems.length} 
          onCartClick={() => setIsCartOpen(true)} 
          onSearch={setSearchQuery} 
        />
        <main className="pt-20">
          <Hero />
          <About />
          <Gallery />
          <FreeDownloads searchQuery={searchQuery} />
          <SoftwareSection onAddToCart={handleAddToCart} />
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
          onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
          onClearCart={() => setCartItems([])}
        />
        
        <AdminUploadPanel />
      </div>
    </AdminAuthProvider>
  );
}