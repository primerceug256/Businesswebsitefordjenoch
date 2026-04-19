import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <SpeedInsights />
      </CartProvider>
    </AuthProvider>
  );
}
