import React from "react";
import { Text, View } from "react-native";
import { Button, Card } from "../ui";

interface CTASectionProps {
  onRegister: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onRegister }) => {
  return (
    <View className="px-4 mb-8 ">
      <Card className="bg-pink-200">
        <Text className="text-xl font-bold text-gray-900 text-center mb-2">
          Are you a vendor?
        </Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          Join thousands of successful vendors on our platform
        </Text>
        <Button
          title="Register as Vendor"
          onPress={onRegister}
          variant="secondary"
          size="lg"
          fullWidth
        />
      </Card>
    </View>
  );
};

// Default export for expo-router compatibility
export default CTASection;
