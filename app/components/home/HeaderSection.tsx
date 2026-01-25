import { useAuth } from "@/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HeaderSection = () => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  return (
    <View className="flex-row justify-between items-center px-4 py-2">
      <View>
        <Text className="text-2xl font-bold text-gray-900">
          {isAuthenticated
            ? `Hello, ${user?.name?.split(" ")[0]}!`
            : "Welcome!"}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Find perfect vendors for your events
        </Text>
      </View>
      {isAuthenticated ? (
        <TouchableOpacity
          className="w-9 h-9 items-center justify-center"
          onPress={() => router.push("/(tabs)/profile")}
        >
          <FontAwesome name="user-circle" size={36} color="#2563eb" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-blue-600 px-5 py-2 rounded-lg"
          onPress={() => router.push("/auth/user-login")}
        >
          <Text className="text-white text-sm font-semibold">Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HeaderSection;
