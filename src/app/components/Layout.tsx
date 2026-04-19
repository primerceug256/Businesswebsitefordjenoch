// src/app/components/Layout.tsx

import { Outlet, Link, useNavigate } from 'react-router';
import { ShoppingCart, User, LogOut, Home, Music, Film, Download, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Ensure "export default" is right here!
export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  // ... the rest of your layout code