// app/store/useAuthStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Vendor, UserRole } from '@/types';
import { authAPI, vendorAPI, SignupData, LoginData, VendorProfileData } from '../service/api';

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
  saveVendorProfile: (data: VendorProfileData) => Promise<boolean>;
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
    set({ loading: true });
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      if (storedUser && token) {
        const user = JSON.parse(storedUser);
        // Determine if user is vendor based on role field
        const userRole = user.role || (user as any).role;
        const isVendorUser = userRole === 'vendor';
        
        set({
          user: isVendorUser ? null : user,
          vendor: isVendorUser ? user : null,
          isAuthenticated: true,
          isVendor: isVendorUser,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ loading: false });
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
      const res = await authAPI.signup(data, asVendor);
      
      if (res.success) {
        // Wait for user data to be stored and retrieved
        const storedUser = await AsyncStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        // Force a small delay to ensure data is properly stored
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Re-read from AsyncStorage to ensure we have the latest user data
        const reReadUser = await AsyncStorage.getItem('user');
        const freshUser = reReadUser ? JSON.parse(reReadUser) : user;
        
        set({
          user: asVendor ? null : freshUser,
          vendor: asVendor ? freshUser : null,
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

  // Set vendor profile (local state only - use saveVendorProfile for API)
  setVendorProfile: (vendor: Vendor) => {
    set({ vendor });
  },

  // Save vendor profile to backend
  saveVendorProfile: async (data: VendorProfileData) => {
    set({ loading: true, error: null });
    try {
      const res = await vendorAPI.saveProfile(data);
      
      if (res.success) {
        set({
          vendor: res.user as unknown as Vendor,
          loading: false,
        });
        return true;
      }
      
      set({ loading: false, error: res.message || 'Failed to save profile' });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile';
      set({ loading: false, error: errorMessage });
      return false;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
