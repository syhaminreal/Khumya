import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "../ui";

interface HeroSectionProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
  onVendorSignup: () => void;
  onExploreVendors: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isAuthenticated,
  onGetStarted,
  onVendorSignup,
  onExploreVendors,
}) => {
  return (
    <View className="px-4 mb-8">
      <View className="mb-6">
        <Text className="text-4xl font-bold text-gray-900 leading-tight">
          Plan Your{"\n"}
          <Text className="text-blue-600">Perfect Event</Text>
        </Text>
        <Text className="text-base text-gray-600 mt-3">
          Connect with trusted vendors for weddings, parties, corporate events,
          and more.
        </Text>
        <View className="flex-row gap-3 mt-6">
          {!isAuthenticated ? (
            <>
              <Button title="Get Started" onPress={onGetStarted} size="md" />
              <Button
                title="I'm a Vendor"
                onPress={onVendorSignup}
                variant="outline"
                size="md"
              />
            </>
          ) : (
            <Button
              title="Explore Vendors"
              onPress={onExploreVendors}
              size="md"
              icon={<FontAwesome name="search" size={16} color="white" />}
            />
          )}
        </View>
      </View>
    </View>
  );
};
