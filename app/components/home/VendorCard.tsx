import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface VendorCardProps {
  name: string;
  category: string;
  location: string;
  rating: string;
  image?: string | ImageSourcePropType;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  name,
  category,
  location,
  rating,
  image,
}) => {
  return (
    <View className="w-[200px] mr-4 rounded-lg overflow-hidden bg-white shadow-sm">
      <View className="h-[120px] bg-gray-100 relative">
        <View className="flex-1 items-center justify-center">
          {image ? (
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <FontAwesome name="image" size={32} color="#d1d5db" />
          )}
        </View>
        <View className="absolute top-2 right-2 flex-row items-center bg-white px-2 py-1 rounded-full">
          <FontAwesome name="star" size={10} color="#f59e0b" />
          <Text className="text-xs text-gray-900 ml-1 font-semibold">
            {rating}
          </Text>
        </View>
      </View>
      <View className="p-3">
        <Text className="text-sm font-bold text-gray-900">{name}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">{category}</Text>
        <View className="flex-row items-center gap-1 mt-2">
          <FontAwesome name="map-marker" size={12} color="#9ca3af" />
          <Text className="text-xs text-gray-400">{location}</Text>
        </View>
      </View>
    </View>
  );
};

// Default export for expo-router compatibility
export default VendorCard;
