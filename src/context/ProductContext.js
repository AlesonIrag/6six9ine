'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { sampleProducts } from '@/data/seed';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

const ProductContext = createContext(undefined);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Real-time listener for products from Firestore
  useEffect(() => {
    console.log('🔥 Setting up real-time Firestore listener...');
    
    const productsRef = doc(db, 'settings', 'products');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      productsRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const productsData = data.items || [];
          
          console.log('🔄 Real-time update: Products loaded from Firestore:', productsData.length);
          
          // Clean up data: Remove 'image' property from colorVariants if it exists
          const cleanedData = productsData.map(product => {
            if (product.colorVariants && Array.isArray(product.colorVariants)) {
              const cleanedVariants = product.colorVariants.map(variant => {
                if (typeof variant === 'object' && variant !== null) {
                  return variant.color || '';
                }
                return variant;
              });
              return { ...product, colorVariants: cleanedVariants };
            }
            return product;
          });
          
          setProducts(cleanedData);
          setIsLoading(false);
          setIsInitialized(true);
        } else {
          // First time - use sample products
          console.log('🆕 First time load - Using sample products');
          setProducts(sampleProducts);
          setIsLoading(false);
          setIsInitialized(true);
          
          // Save sample products to Firestore
          setDoc(productsRef, { items: sampleProducts, updatedAt: new Date().toISOString() })
            .then(() => console.log('✅ Sample products saved to Firestore'))
            .catch(err => console.error('❌ Failed to save sample products:', err));
        }
      },
      (error) => {
        console.error('❌ Firestore listener error:', error);
        setProducts(sampleProducts);
        setIsLoading(false);
        setIsInitialized(true);
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log('🔌 Disconnecting Firestore listener');
      unsubscribe();
    };
  }, []);

  // Save products to Firestore when they change (but not on initial load)
  useEffect(() => {
    if (!isInitialized || products.length === 0) return;

    const saveProducts = async () => {
      try {
        console.log('💾 Saving products to Firestore...', products.length, 'products');
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(products)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || 'Failed to save');
        }
        
        const result = await response.json();
        console.log('✅ Products saved to Firestore:', result);
      } catch (error) {
        console.error('❌ Failed to save products:', error);
        console.error('Error details:', error.message);
      }
    };

    // Debounce saves to avoid too many writes
    const timeoutId = setTimeout(saveProducts, 500);
    return () => clearTimeout(timeoutId);
  }, [products, isInitialized]);

  const updateProduct = (slug, updates) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.slug === slug ? { ...p, ...updates } : p))
    );
  };

  const updateProductStock = (slug, quantityChange) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.slug === slug) {
          const newQuantity = Math.max(0, (p.quantity || 0) + quantityChange);
          return {
            ...p,
            quantity: newQuantity,
            inStock: newQuantity > 0
          };
        }
        return p;
      })
    );
  };

  const getProduct = (slug) => {
    return products.find(p => p.slug === slug);
  };

  const setAllProducts = (newProducts) => {
    // Ensure inStock flag matches quantity
    const syncedProducts = newProducts.map(p => ({
      ...p,
      inStock: (p.quantity || 0) > 0
    }));
    console.log('📦 setAllProducts called, syncing inStock flags');
    setProducts(syncedProducts);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        updateProduct,
        updateProductStock,
        getProduct,
        setAllProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider. Make sure your component is wrapped with <ProductProvider>.');
  }
  return context;
}
