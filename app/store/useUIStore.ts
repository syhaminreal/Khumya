// app/store/useUIStore.ts
import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface UIState {
  // Theme
  theme: ThemeMode;
  
  // Modal states
  isModalVisible: boolean;
  modalType: string | null;
  
  // Loading overlay
  isLoading: boolean;
  loadingMessage: string;
  
  // Toast notifications
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning';
  
  // Search
  searchQuery: string;
  isSearchActive: boolean;
  
  // Sidebar / Drawer
  isSidebarOpen: boolean;
}

interface UIActions {
  // Theme
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  // Modal
  showModal: (type: string) => void;
  hideModal: () => void;
  
  // Loading
  setLoading: (isLoading: boolean, message?: string) => void;
  
  // Toast
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
  
  // Search
  setSearchQuery: (query: string) => void;
  setSearchActive: (isActive: boolean) => void;
  
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  // Initial state
  theme: 'light',
  isModalVisible: false,
  modalType: null,
  isLoading: false,
  loadingMessage: '',
  toastMessage: null,
  toastType: 'info',
  searchQuery: '',
  isSearchActive: false,
  isSidebarOpen: false,

  // Theme actions
  setTheme: (theme: ThemeMode) => {
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
  },

  // Modal actions
  showModal: (type: string) => {
    set({ isModalVisible: true, modalType: type });
  },
  hideModal: () => {
    set({ isModalVisible: false, modalType: null });
  },

  // Loading actions
  setLoading: (isLoading: boolean, message: string = '') => {
    set({ isLoading, loadingMessage: message });
  },

  // Toast actions
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    set({ toastMessage: message, toastType: type });
  },
  hideToast: () => {
    set({ toastMessage: null });
  },

  // Search actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  setSearchActive: (isActive: boolean) => {
    set({ isSearchActive: isActive });
  },

  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },
  setSidebarOpen: (isOpen: boolean) => {
    set({ isSidebarOpen: isOpen });
  },
}));
