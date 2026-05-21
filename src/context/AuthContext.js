'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, logOut } from '@/lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      unsubscribe = onAuthChange((user) => {
        setUser(user);
        setLoading(false);
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
    }
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
