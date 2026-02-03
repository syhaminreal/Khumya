// app/context/AuthContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isVendor: boolean;
  user: any;
  vendor: any;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isAuthenticated, 
    isVendor, 
    user, 
    vendor, 
    loading, 
    logout,
    initializeAuth 
  } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isVendor,
      user,
      vendor,
      loading,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
