// services/api.ts
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* -------------------------------------------------------------------------- */
/*                              BASE URL SETUP                                */
/* -------------------------------------------------------------------------- */

const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:9000/api"
    : "http://10.0.2.2:9000/api"; // Android emulator, use your LAN IP if needed

/* -------------------------------------------------------------------------- */
/*                              AXIOS INSTANCE                                */
/* -------------------------------------------------------------------------- */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/* -------------------------------------------------------------------------- */
/*                           REQUEST INTERCEPTOR                               */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔍 DEBUG LOG
    console.log("📡 AXIOS REQUEST:", {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      data: config.data,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------------------------------------------------- */
/*                           RESPONSE INTERCEPTOR                              */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (response) => {
    console.log("✅ AXIOS RESPONSE:", response.data);
    return response;
  },
  async (error) => {
    console.error("❌ AXIOS ERROR:", error.response?.data || error.message);

    // Auto logout on 401
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                AUTH API                                    */
/* -------------------------------------------------------------------------- */

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

      const res = await api.post("/user", payload);
      console.log(res)
console.log( " theis is res ",res.data.data)
      // Store token and user
      if (res.data.data.token) await AsyncStorage.setItem("token", res.data.data.token);
      if (res.data.data.user) await AsyncStorage.setItem("user", JSON.stringify(res.data.data.user));

      return {
        success: true,
        message: res.data.data.message || "Signup successful",
        token: res.data.data.token,
        user: res.data.data.user,
      
      };
    } catch (error: any) {
      console.error("Signup API Error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || "Signup failed",
        error: error.message,
      };
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log("➡️ Login payload:", data);

      const res = await api.post("/user/login", data);

      // Store token and user
      if (res.data.token) await AsyncStorage.setItem("token", res.data.token);
      if (res.data.user) await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      return {
        success: true,
        message: res.data.message || "Login successful",
        token: res.data.token,
        user: res.data.user,
      };
    } catch (error: any) {
      console.error("Login API Error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || "Login failed",
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

export default api;
