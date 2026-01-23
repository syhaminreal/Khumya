import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Vendor, AuthState } from '../types';
import { MOCK_USER, MOCK_VENDOR } from '../types/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, asVendor?: boolean) => Promise<boolean>;
  signup: (data: { email: string; name: string; password: string }, asVendor?: boolean) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateVendor: (vendor: Partial<Vendor>) => void;
  setVendorProfile: (vendor: Vendor) => void;
}

const defaultAuthState: AuthState = {
  user: null,
  vendor: null,
  isAuthenticated: false,
  isVendor: false,
  loading: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(defaultAuthState);

  // Mock login - replace with actual API call later
  const login = async (email: string, password: string, asVendor: boolean = false): Promise<boolean> => {
    setState((prev: AuthState) => ({ ...prev, loading: true }));

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful login
    if (email && password) {
      const mockUser: User = {
        ...MOCK_USER,
        email,
        role: asVendor ? 'vendor' : 'client',
      };

      setState({
        user: mockUser,
        vendor: asVendor ? MOCK_VENDOR : null,
        isAuthenticated: true,
        isVendor: asVendor,
        loading: false,
      });
      return true;
    }

    setState((prev: AuthState) => ({ ...prev, loading: false }));
    return false;
  };

  // Mock signup - replace with actual API call later
  const signup = async (
    data: { email: string; name: string; password: string },
    asVendor: boolean = false
  ): Promise<boolean> => {
    setState((prev: AuthState) => ({ ...prev, loading: true }));

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful signup
    if (data.email && data.name && data.password) {
      const newUser: User = {
        id: Date.now(),
        email: data.email,
        name: data.name,
        role: asVendor ? 'vendor' : 'client',
        createdAt: new Date().toISOString(),
      };

      setState({
        user: newUser,
        vendor: null, // Vendor profile needs to be set separately
        isAuthenticated: true,
        isVendor: asVendor,
        loading: false,
      });
      return true;
    }

    setState((prev: AuthState) => ({ ...prev, loading: false }));
    return false;
  };

  const logout = () => {
    setState(defaultAuthState);
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      setState((prev: AuthState) => ({
        ...prev,
        user: { ...prev.user!, ...userData },
      }));
    }
  };

  const updateVendor = (vendorData: Partial<Vendor>) => {
    if (state.vendor) {
      setState((prev: AuthState) => ({
        ...prev,
        vendor: { ...prev.vendor!, ...vendorData },
      }));
    }
  };

  const setVendorProfile = (vendor: Vendor) => {
    setState((prev: AuthState) => ({
      ...prev,
      vendor,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateUser,
        updateVendor,
        setVendorProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
