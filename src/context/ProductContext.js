'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { sampleProducts } from '@/data/seed';

const ProductContext = createContext(undefined);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load products from API on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            console.log('🚀 Products loaded from Firebase:', data.length);
            
            // Clean up data: Remove 'image' property from colorVariants if it exists
            // Also convert object format to string format for consistency
            const cleanedData = data.map(product => {
              if (product.colorVariants && Array.isArray(product.colorVariants)) {
                const cleanedVariants = product.colorVariants.map(variant => {
                  // If variant is an object, extract the color string
                  if (typeof variant === 'object' && variant !== null) {
                    // Return just the color string, removing any other properties
                    return variant.color || '';
                  }
                  // If it's already a string, return as-is
                  return variant;
                });
                return { ...product, colorVariants: cleanedVariants };
              }
              return product;
            });
            
            setProducts(cleanedData);
            
            // If we cleaned any data, save it back to Firebase
            const needsCleaning = data.some(p => 
              p.colorVariants?.some(v => typeof v === 'object' && v !== null)
            );
            if (needsCleaning) {
              console.log('💾 Saving cleaned data back to Firebase...');
              await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData)
              });
              console.log('✅ Cleaned data saved to Firebase');
            }
          } else {
            // First time - use sample products
            console.log('🆕 First time load - Using sample products');
            setProducts(sampleProducts);
            // Save sample products to Firebase
            await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(sampleProducts)
            });
          }
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts(sampleProducts);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadProducts();
  }, []);

  // Save products to API when they change
  useEffect(() => {
    if (!isInitialized || products.length === 0) return;

    const saveProducts = async () => {
      try {
        console.log('💾 Saving products to Firebase...', products.length, 'products');
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
        console.log('✅ Products saved to Firebase:', result);
      } catch (error) {
        console.error('❌ Failed to save products:', error);
        console.error('Error details:', error.message);
      }
    };

    saveProducts();
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

