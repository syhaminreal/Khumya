import React from "react";
import { Text, View } from "react-native";

interface StatItemProps {
  number: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ number, label }) => (
  <View className="items-center">
    <Text className="text-xl font-bold text-blue-600">{number}</Text>
    <Text className="text-xs text-gray-500 mt-1">{label}</Text>
  </View>
);

export const StatsSection: React.FC = () => {
  return (
    <View className="flex-row items-center justify-around bg-white p-4 rounded-lg mx-4 mb-8 shadow-sm">
      <StatItem number="500+" label="Vendors" />
      <View className="h-8 w-px bg-gray-200" />
      <StatItem number="10K+" label="Happy Clients" />
      <View className="h-8 w-px bg-gray-200" />
      <StatItem number="50+" label="Cities" />
    </View>
  );
};
