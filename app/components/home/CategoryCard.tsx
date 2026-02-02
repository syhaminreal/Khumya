import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  title: string;
  iconName: string;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="items-center mr-4 w-20"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="w-16 h-16 rounded-lg bg-blue-50 items-center justify-center mb-2">
        <FontAwesome name={iconName as any} size={24} color="#2563eb" />
      </View>
      <Text className="text-xs text-gray-900 font-medium text-center">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Default export for expo-router compatibility
export default CategoryCard;
