// src/app/components/Shop.tsx
// ... existing imports
interface ShopProps {
  onAddToCart: (product: Product) => void;
  searchQuery?: string; // Add this
}

export function Shop({ onAddToCart, searchQuery = "" }: ShopProps) {
  const [filter, setFilter] = useState<"all" | "drop" | "software">("all");

  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === "all" || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ... rest of the component remains the same
}