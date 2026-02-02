// app/profile/notifications.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "../../constants/theme";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const NotificationsPage: React.FC = () => {
  const router = useRouter();

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "push",
      title: "Push Notifications",
      description: "Receive notifications about events and updates",
      icon: "bell",
      enabled: true,
    },
    {
      id: "email",
      title: "Email Notifications",
      description: "Receive emails about new events and promotions",
      icon: "envelope",
      enabled: true,
    },
    {
      id: "event_invites",
      title: "Event Invites",
      description: "Get notified when you're invited to events",
      icon: "calendar",
      enabled: true,
    },
    {
      id: "vendor_updates",
      title: "Vendor Updates",
      description: "Updates from vendors you follow",
      icon: "briefcase",
      enabled: false,
    },
    {
      id: "marketing",
      title: "Marketing & Promotions",
      description: "Receive offers and promotional content",
      icon: "tags",
      enabled: false,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      Alert.alert("Success", "Your notification preferences have been saved.");
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome
              name="arrow-left"
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Info Text */}
        <View style={styles.infoSection}>
          <FontAwesome name="info-circle" size={18} color={Colors.info} />
          <Text style={styles.infoText}>
            Manage how and when you receive notifications
          </Text>
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsSection}>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <FontAwesome
                    name={setting.icon as any}
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>
                    {setting.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{
                  false: Colors.gray200,
                  true: Colors.primary + "60",
                }}
                thumbColor={
                  setting.enabled ? Colors.primary : Colors.gray400
                }
              />
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>

        {/* Clear All */}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            Alert.alert(
              "Clear Notifications",
              "Are you sure you want to clear all notifications?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: () => {} },
              ]
            );
          }}
        >
          <FontAwesome name="trash" size={18} color={Colors.error} />
          <Text style={styles.clearButtonText}>Clear All Notifications</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.base,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.info + "15",
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  settingsSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.base,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  saveButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.base,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  clearButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.error,
  },
});

export default NotificationsPage;
