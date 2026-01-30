import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors, Typography } from '../../constants/theme';

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: Typography.fontSize.xs,
          fontWeight: Typography.fontWeight.medium,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="invite"
        options={{
          title: 'Invite',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-plus" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="vendor-profile"
        options={{
          title: 'Vendor',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="briefcase" color={color} size={20} />
          ),
          // Hide this tab by default, can be shown based on user role
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={20} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
