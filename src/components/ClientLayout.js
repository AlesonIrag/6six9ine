'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import BackButton from '@/components/BackButton';

export default function ClientLayout({ children }) {
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          {!isAdminPage && <Navbar onAuthClick={() => setAuthOpen(true)} />}
          {!isAdminPage && <BackButton />}
          <main>{children}</main>
          {!isAdminPage && <Footer />}
          {!isAdminPage && <CartDrawer />}
          {!isAdminPage && <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />}
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
