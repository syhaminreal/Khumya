import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface StepItemProps {
  iconName: string;
  stepNumber: string;
  title: string;
  description: string;
  showConnector?: boolean;
}

const StepItem: React.FC<StepItemProps> = ({
  iconName,
  stepNumber,
  title,
  description,
  showConnector,
}) => (
  <View className="flex-1 items-center">
    <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-2">
      <FontAwesome name={iconName as any} size={20} color="#2563eb" />
    </View>
    <Text className="text-base font-bold text-blue-600 mb-1">{stepNumber}</Text>
    <Text className="text-sm font-semibold text-gray-900 mb-1">{title}</Text>
    <Text className="text-xs text-gray-400 text-center">{description}</Text>
  </View>
);

export const HowItWorksSection: React.FC = () => {
  return (
    <View className="px-4 mb-8">
      <Text className="text-xl font-bold text-gray-900 mb-6">How It Works</Text>
      <View className="flex-row items-start justify-between">
        <StepItem
          iconName="search"
          stepNumber="1"
          title="Search"
          description="Browse vendors by category"
        />
        <View className="w-4 h-px bg-gray-200 mt-6" />
        <StepItem
          iconName="comments"
          stepNumber="2"
          title="Connect"
          description="Contact & discuss details"
        />
        <View className="w-4 h-px bg-gray-200 mt-6" />
        <StepItem
          iconName="check-circle"
          stepNumber="3"
          title="Book"
          description="Confirm & manage bookings"
        />
      </View>
    </View>
  );
};

// Default export for expo-router compatibility
export default HowItWorksSection;
