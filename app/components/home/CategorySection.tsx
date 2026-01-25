import { MOCK_CATEGORIES } from "@/types/mockData";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CategoryCard } from "./CategoryCard";

export const CategorySection = () => {
  const categoryIcons: Record<string, string> = {
    Photography: "camera",
    Catering: "cutlery",
    Decoration: "paint-brush",
    Venue: "building",
    "Music & Entertainment": "music",
    "Event Planning": "calendar",
  };
  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-4 px-4">
        <Text className="text-xl font-bold text-gray-900">Categories</Text>
        <TouchableOpacity>
          <Text className="text-sm text-blue-600 font-medium">See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4"
      >
        {MOCK_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            iconName={categoryIcons[category.title] || "star"}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
}
