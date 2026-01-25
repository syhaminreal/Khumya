import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../constants/theme";
import { AuthProvider } from "../context/AuthContext";
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="login" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
