import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { VendorCard } from "./VendorCard";

export const FeaturedVendorSection = () => {
  const featuredVendors = [
    {
      id: 1,
      name: "Premium Studio",
      category: "Photography",
      location: "Kathmandu",
      rating: "4.8",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6X0LWcQjZOcmdyHvaLvpqF8g-q2ZPhE-dg&s",
    },
    {
      id: 2,
      name: "Catering Experts",
      category: "Catering",
      location: "Lalitpur",
      rating: "4.7",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6X0LWcQjZOcmdyHvaLvpqF8g-q2ZPhE-dg&s",
    },
    {
      id: 3,
      name: "Decor Hub",
      category: "Decoration",
      location: "Bhaktapur",
      rating: "4.6",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6X0LWcQjZOcmdyHvaLvpqF8g-q2ZPhE-dg&s",
    },
    {
      id: 4,
      name: "Music Masters",
      category: "Music & Entertainment",
      location: "Kathmandu",
      rating: "4.9",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6X0LWcQjZOcmdyHvaLvpqF8g-q2ZPhE-dg&s",
    },
  ];
  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-4 px-4">
        <Text className="text-xl font-bold text-gray-900">
          Featured Vendors
        </Text>
        <TouchableOpacity>
          <Text className="text-sm text-blue-600 font-medium">See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4"
      >
        {featuredVendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            name={vendor.name}
            category={vendor.category}
            location={vendor.location}
            rating={vendor.rating}
            image={vendor.image}
          />
        ))}
      </ScrollView>
    </View>
  );
};
