import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true, // show top header
        tabBarActiveTintColor: "#007AFF", // active tab color
      }}
    >
      <Tabs.Screen
        name="index" // corresponds to (tabs)/index.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore" // corresponds to (tabs)/explore.tsx
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // corresponds to (tabs)/profile.tsx
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
