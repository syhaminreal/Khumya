import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Button, Card } from "../ui";
import { useRouter } from "expo-router";

interface EventInvitesCTAProps {
  inviteCount?: number;
}

export const EventInvitesCTA: React.FC<EventInvitesCTAProps> = ({
  inviteCount = 3,
}) => {
  const router = useRouter();

  return (
    <View className="px-4 mb-6">
      <Card className="bg-blue-50 border-l-4 border-blue-500">
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-3 rounded-full mr-4">
            <FontAwesome5 name="envelope-open-text" size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Event Invites 🎉
            </Text>
            <Text className="text-sm text-gray-600 mb-3">
              You have {inviteCount} pending event invite
              {inviteCount !== 1 ? "s" : ""}
            </Text>
            <Button
              title="View Invites"
              onPress={() => router.push("/(tabs)/explore")}
              size="sm"
            />
          </View>
        </View>
      </Card>
    </View>
  );
};
