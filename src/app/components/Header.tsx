// src/app/components/Header.tsx
// Add this import:
import { useAuth, AuthModal } from "./AdminAuth";

export function Header({ cartCount, onCartClick, onSearch }: HeaderProps) {
  const { user, signOut } = useAuth(); // Get auth state
  const [showAuth, setShowAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* ... top bar ... */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
         {/* ... logo ... */}
         
         <div className="flex gap-4 items-center">
           {user ? (
             <div className="hidden md:flex items-center gap-3">
               <span className="text-[10px] font-bold text-gray-400 uppercase">{user.email}</span>
               <button onClick={() => signOut()} className="text-xs font-black text-red-600 uppercase">Logout</button>
             </div>
           ) : (
             <button onClick={() => setShowAuth(true)} className="text-xs font-black uppercase hover:text-orange-600">Login</button>
           )}

           <button onClick={onCartClick} className="relative">
             <ShoppingCart size={24} />
             {/* ... cart count badge ... */}
           </button>
         </div>
      </div>
      
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  );
}