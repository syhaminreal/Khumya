import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const FooterSection = () => {
  const navLinks = [
    { label: "About", route: "/about" },
    { label: "Contact", route: "/contact" },
    { label: "Terms", route: "/terms" },
    { label: "Privacy", route: "/privacy" },
  ];
  return (
    <View className="items-center py-8 px-4 bg-gray-100 mt-4">
      <Text className="text-2xl font-bold text-blue-600">Khumya</Text>
      <Text className="text-xs text-gray-500 mt-1">
        Your trusted event planning partner
      </Text>
      <View className="flex-row gap-4 mt-4 mb-4">
        {navLinks.map((item) => (
          <TouchableOpacity key={item.label}>
            <Text className="text-sm text-gray-600">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-xs text-gray-400">
        © 2026 Khumya. All rights reserved.
      </Text>
    </View>
  );
};

export default FooterSection;
