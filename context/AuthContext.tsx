// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Vendor, AuthState } from '../types';
import { authAPI, SignupData, LoginData } from '../app/service/api';

interface AuthContextType extends AuthState {
  login: (data: LoginData, asVendor?: boolean) => Promise<boolean>;
  signup: (data: SignupData, asVendor?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
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

  // ---------------- LOGIN ----------------
  const login = async (data: LoginData, asVendor: boolean = false): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await authAPI.login(data);
      console.log("Login response:", res);
      
      if (res.success) {
        // Get user from response or from AsyncStorage
        const user = res.user || null;
        
        setState({
          user: asVendor ? null : user,
          vendor: asVendor ? user : null,
          isAuthenticated: true,
          isVendor: asVendor,
          loading: false,
        });
        return true;
      }
      setState((prev) => ({ ...prev, loading: false }));
      return false;
    } catch (error) {
      console.error('Login Error:', error);
      setState((prev) => ({ ...prev, loading: false }));
      return false;
    }
  };

  // ---------------- SIGNUP ----------------
  const signup = async (data: SignupData, asVendor: boolean = false): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await authAPI.signup(data);
      console.log("This is the response", res);
      // Check for success - the API returns user data from AsyncStorage, not from response
      if (res.success) {
        // Get user from AsyncStorage since the backend doesn't return user in signup response
        const storedUser = await AsyncStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        setState({
          user: asVendor ? null : user,
          vendor: asVendor ? user : null,
          isAuthenticated: true,
          isVendor: asVendor,
          loading: false,
        });
        return true;
      }
      setState((prev) => ({ ...prev, loading: false }));
      return false;
    } catch (error) {
      console.error("Signup Error:", error);
      setState((prev) => ({ ...prev, loading: false }));
      return false;
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    await authAPI.logout();
    setState(defaultAuthState);
  };

  // ---------------- UPDATE USER ----------------
  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      setState((prev) => ({
        ...prev,
        user: { ...prev.user!, ...userData },
      }));
    }
  };

  const updateVendor = (vendorData: Partial<Vendor>) => {
    if (state.vendor) {
      setState((prev) => ({
        ...prev,
        vendor: { ...prev.vendor!, ...vendorData },
      }));
    }
  };

  const setVendorProfile = (vendor: Vendor) => {
    setState((prev) => ({ ...prev, vendor }));
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
