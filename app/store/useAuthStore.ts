// app/store/useAuthStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Vendor, UserRole } from '@/types';
import { authAPI, SignupData, LoginData } from '../service/api';

interface AuthState {
  user: User | null;
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isVendor: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (data: LoginData, asVendor?: boolean) => Promise<boolean>;
  signup: (data: SignupData, asVendor?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  updateVendor: (vendorData: Partial<Vendor>) => void;
  setVendorProfile: (vendor: Vendor) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  vendor: null,
  isAuthenticated: false,
  isVendor: false,
  loading: false,
  error: null,

  // Initialize auth from AsyncStorage
  initializeAuth: async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      if (storedUser && token) {
        const user = JSON.parse(storedUser);
        set({
          user,
          isAuthenticated: true,
          isVendor: user.role === 'vendor',
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  },

  // Login action
  login: async (data: LoginData, asVendor: boolean = false) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.login(data);
      
      if (res.success) {
        const user = res.user || null;
        set({
          user: asVendor ? null : user,
          vendor: asVendor ? (user as unknown as Vendor) : null,
          isAuthenticated: true,
          isVendor: asVendor,
          loading: false,
        });
        return true;
      }
      
      set({ loading: false, error: res.message || 'Login failed' });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ loading: false, error: errorMessage });
      return false;
    }
  },

  // Signup action
  signup: async (data: SignupData, asVendor: boolean = false) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.signup(data);
      
      if (res.success) {
        const storedUser = await AsyncStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        set({
          user: asVendor ? null : user,
          vendor: asVendor ? (user as unknown as Vendor) : null,
          isAuthenticated: true,
          isVendor: asVendor,
          loading: false,
        });
        return true;
      }
      
      set({ loading: false, error: res.message || 'Signup failed' });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      set({ loading: false, error: errorMessage });
      return false;
    }
  },

  // Logout action
  logout: async () => {
    await authAPI.logout();
    set({
      user: null,
      vendor: null,
      isAuthenticated: false,
      isVendor: false,
      loading: false,
      error: null,
    });
  },

  // Update user
  updateUser: (userData: Partial<User>) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...userData } });
    }
  },

  // Update vendor
  updateVendor: (vendorData: Partial<Vendor>) => {
    const { vendor } = get();
    if (vendor) {
      set({ vendor: { ...vendor, ...vendorData } });
    }
  },

  // Set vendor profile
  setVendorProfile: (vendor: Vendor) => {
    set({ vendor });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
