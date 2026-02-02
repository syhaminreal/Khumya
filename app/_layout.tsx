import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { Colors } from "../constants/theme";
import { AuthProvider } from "../context/AuthContext";
import { useAuthStore } from "./store/useAuthStore";
import "./global.css";

// Initialize auth state on app start
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return children;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "right", "left"]}>
        <StatusBar barStyle="dark-content" />
        <AuthProvider>
          <AuthInitializer>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: Colors.background },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" />
            </Stack>
          </AuthInitializer>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
