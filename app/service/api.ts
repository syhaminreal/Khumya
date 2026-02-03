// services/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Configure API URL based on platform
// IMPORTANT: Make sure your backend is running on port 9000!
// For web: localhost
// For Android emulator: 10.0.2.2 (special alias for host machine)
// For iOS simulator: localhost
// For physical devices: Replace with your actual machine IP (find with: ifconfig | grep "inet ")
const getAPIBaseURL = () => {
  if (Platform.OS === "web") {
    return "http://localhost:9000/api";
  }

  // For native (iOS/Android)
  if (Platform.OS === "ios") {
    // iOS simulator can use localhost
    return "http://localhost:9000/api";
  }

  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to access host machine
    // If using physical device or different setup, change this to your machine IP (e.g., 192.168.x.x)
    return "http://10.0.2.2:9000/api";
  }

  // Fallback
  return "http://localhost:9000/api";
};

let API_BASE_URL = getAPIBaseURL();

// If the developer set an environment variable in Expo (EXPO_PUBLIC_API_URL), prefer it.
const EXPO_PUBLIC_API_URL = (process.env.EXPO_PUBLIC_API_URL ||
  (global as any).EXPO_PUBLIC_API_URL) as string | undefined;

/**
 * Try to detect API base URL from debuggerHost and set it on api.defaults.baseURL.
 */
const detectAndSetBaseURL = async () => {
  try {
    if (EXPO_PUBLIC_API_URL) {
      API_BASE_URL = EXPO_PUBLIC_API_URL;
      console.log("🔧 Using EXPO_PUBLIC_API_URL:", API_BASE_URL);
      return;
    }

    // Try to detect from debuggerHost first (for Expo/Metro)
    const debuggerHost =
      (Constants.manifest as any)?.debuggerHost ||
      (Constants.manifest2?.debuggerHost as any);
    if (debuggerHost && typeof debuggerHost === "string") {
      const host = debuggerHost.split(":")[0];
      if (host) {
        const candidateUrl = `http://${host}:9000/api`;
        try {
          await axios.get(`${candidateUrl}/health`, { timeout: 1000 });
          API_BASE_URL = candidateUrl;
          console.log("✅ Resolved API base URL:", API_BASE_URL);
          return;
        } catch (e) {
          // Continue with platform-specific default
        }
      }
    }

    // Use platform-specific default
    console.log("📡 Using platform-specific API URL:", API_BASE_URL);
  } catch (err) {
    // Fall back to default without warning
    console.log("📡 Using default API URL:", API_BASE_URL);
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Run detection after api is initialized
detectAndSetBaseURL();

console.log("🔧 API Configuration:", {
  apiUrl: API_BASE_URL,
  platform: Platform.OS,
  timestamp: new Date().toISOString(),
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📡 API Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      hasToken: !!token,
      timestamp: new Date().toISOString(),
    });

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
    }

    return Promise.reject(error);
  },
);

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
  error?: string;
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

export interface VendorProfileData {
  owner: number;
  vendorName: string;
  description: string;
  city: string;
  nation: string;
  culture?: string;
  theme?: string;
  space?: string;
  infos?: {
    question: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export const authAPI = {
  signup: async (data: SignupData, asVendor: boolean = false): Promise<AuthResponse> => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        info: data.info || "",
        role: asVendor ? "vendor" : (data.role || "client"),
      };

      console.log("➡️ Signup payload:", payload);
      console.log("📡 API Base URL:", API_BASE_URL);

      const res = await api.post("/user", payload);
      console.log("✅ Signup response:", res.data);

      // Store token and user (backend returns user directly in res.data.data)
      if (res.data.data.token)
        await AsyncStorage.setItem("token", res.data.data.token);
      
      // The user object is directly in res.data.data, not in res.data.data.user
      const userData = res.data.data.user || res.data.data;
      if (userData)
        await AsyncStorage.setItem("user", JSON.stringify(userData));

      return {
        success: true,
        message: res.data.data.message || "Signup successful",
        token: res.data.data.token,
        user: userData,
      };
    } catch (error: any) {
      console.error("❌ Signup API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
      });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Signup failed",
        error: error.message,
      };
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log("➡️ Login payload:", data);
      console.log("📡 API Base URL:", API_BASE_URL);
      console.log("🌐 Platform:", Platform.OS);

      const res = await api.post("/user/login", data);

      console.log("✅ Login response:", res.data);

      // Store token and user
      if (res.data.data.token)
        await AsyncStorage.setItem("token", res.data.data.token);
      if (res.data.data.user)
        await AsyncStorage.setItem("user", JSON.stringify(res.data.data.user));

      return {
        success: true,
        message: res.data.message || "Login successful",
        token: res.data.data.token,
        user: res.data.data.user,
      };
    } catch (error: any) {
      console.error("❌ Login API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
        platform: Platform.OS,
        apiUrl: API_BASE_URL,
      });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Login failed",
        error: error.message,
      };
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  },

  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get("/health");
      return true;
    } catch {
      return false;
    }
  },
};

export const vendorAPI = {
  saveProfile: async (data: VendorProfileData): Promise<AuthResponse> => {
    try {
      console.log("➡️ Save vendor profile payload:", data);
      console.log("📡 API Base URL:", API_BASE_URL);

      const res = await api.post("/vendors/save-profile", data);
      console.log("✅ Save profile response:", res.data);

      return {
        success: true,
        message: res.data.message || "Profile saved successfully",
        user: res.data.data,
      };
    } catch (error: any) {
      console.error("❌ Save Profile API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
      });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to save profile",
        error: error.message,
      };
    }
  },
};

export default api;
