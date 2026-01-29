// services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: any;
  error?: string;
  success: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  info?: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const userData = {
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone || "9874563210",
        info: data.info || "sdsdfdsf",
        role: data.role || "client"
      };

      console.log('Sending signup data:', userData);
      
      const response = await api.post('/user', userData);
      console.log('Signup response:', response.data);
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        message: response.data.message || 'Signup successful',
        ...response.data
      };
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || error.response.data.error || 'Signup failed',
          error: error.response.data.error
        };
      }
      
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        error: error.message
      };
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('Sending login data:', data);
      
      const response = await api.post('/user/login', data);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        message: response.data.message || 'Login successful',
        ...response.data
      };
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || error.response.data.error || 'Login failed',
          error: error.response.data.error
        };
      }
      
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        error: error.message
      };
    }
  },

  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch {
      return false;
    }
  }
};

export default api;