// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, AuthResponse, SignupData, LoginData } from '../service/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any;
  loading: boolean;
  vendorProfile: any | null;
  login: (email: string, password: string, isVendor?: boolean) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  setVendorProfile: (profile: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [vendorProfile, setVendorProfileState] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      const vendorData = await AsyncStorage.getItem('vendorProfile');
      
      if (token && userData) setUser(JSON.parse(userData));
      if (vendorData) setVendorProfileState(JSON.parse(vendorData));
    } catch (error) {
      console.error('Auth status check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, isVendor: boolean = false): Promise<boolean> => {
    try {
      setLoading(true);
      const loginData: LoginData = { email, password };
      const response: AuthResponse = await authAPI.login(loginData);

      if (response.success && response.token && response.user) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setLoading(true);

      // Set default role if not provided
      const signupData: SignupData = {
        ...data,
        role: data.role || 'client',
      };

      const response: AuthResponse = await authAPI.signup(signupData);

      if (response.success && response.token && response.user) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setVendorProfile = async (profile: any) => {
    try {
      await AsyncStorage.setItem('vendorProfile', JSON.stringify(profile));
      setVendorProfileState(profile);
    } catch (error) {
      console.error('Error saving vendor profile:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('vendorProfile');
      setUser(null);
      setVendorProfileState(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    vendorProfile,
    login,
    signup,
    logout,
    setVendorProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
