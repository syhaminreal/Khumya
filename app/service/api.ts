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
 * Try a list of candidate base URLs and set the first reachable one on `api.defaults.baseURL`.
 * This helps handle emulator vs simulator vs physical device differences.
 */
const detectAndSetBaseURL = async () => {
  try {
    if (EXPO_PUBLIC_API_URL) {
      API_BASE_URL = EXPO_PUBLIC_API_URL;
      console.log("🔧 Using EXPO_PUBLIC_API_URL:", API_BASE_URL);
      api.defaults.baseURL = API_BASE_URL;
      return;
    }

    const candidates: string[] = [];

    // If running under Expo/Metro, debuggerHost often contains the machine IP (e.g. 192.168.x.x:19000)
    const debuggerHost =
      (Constants.manifest as any)?.debuggerHost ||
      (Constants.manifest2?.debuggerHost as any);
    if (debuggerHost && typeof debuggerHost === "string") {
      const host = debuggerHost.split(":")[0];
      if (host) candidates.push(`http://${host}:9000/api`);
    }

    // Common emulator hostnames
    candidates.push("http://10.0.2.2:9000/api"); // Android emulator
    candidates.push("http://10.0.3.2:9000/api"); // Genymotion
    candidates.push("http://localhost:9000/api");

    // Deduplicate
    const uniqueCandidates = Array.from(new Set(candidates));

    for (const base of uniqueCandidates) {
      try {
        // quick health check with short timeout
        await axios.get(`${base.replace(/\/$/, "")}/health`, { timeout: 2500 });
        API_BASE_URL = base;
        api.defaults.baseURL = API_BASE_URL;
        console.log("✅ Resolved API base URL:", API_BASE_URL);
        return;
      } catch (e) {
        // continue
      }
    }

    console.warn(
      "⚠️ Could not resolve API base URL from candidates, falling back to:",
      API_BASE_URL,
    );
  } catch (err) {
    console.warn("⚠️ Error while detecting API base URL:", err);
  }
};

// Run detection but do not block module load. This will update axios' baseURL when complete.
detectAndSetBaseURL();

console.log("🔧 API Configuration:", {
  apiUrl: API_BASE_URL,
  platform: Platform.OS,
  timestamp: new Date().toISOString(),
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
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

export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        info: data.info || "",
        role: data.role || "client",
      };

      console.log("➡️ Signup payload:", payload);
      console.log("📡 API Base URL:", API_BASE_URL);

      const res = await api.post("/user", payload);
      console.log("✅ Signup response:", res.data);

      // Store token and user
      if (res.data.data.token)
        await AsyncStorage.setItem("token", res.data.data.token);
      if (res.data.data.user)
        await AsyncStorage.setItem("user", JSON.stringify(res.data.data.user));

      return {
        success: true,
        message: res.data.data.message || "Signup successful",
        token: res.data.data.token,
        user: res.data.data.user,
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
  vendorcreate: async (data: any): Promise<any> => {
    try {
      const res = await api.post("/vendors", data);
      console.log('THis is the vendor info in the api call ', res.data);
      return res.data;
    } catch (error: any) {
      console.error("❌ Vendor API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
        platform: Platform.OS,
        apiUrl: API_BASE_URL,
      });
      return error;
    }
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

export default api;
