import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../constants/theme";
import { Button, Input } from "../components/ui";

const CreateEvent: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    date: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required";
    }

    if (!formData.eventType) {
      newErrors.eventType = "Event type is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = () => {
    if (!validateForm()) return;

    // For demo, show success and navigate back
    Alert.alert(
      "Event Created",
      "Your event has been created successfully!",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const eventTypes = [
    { id: "wedding", label: "Wedding", icon: "heart" },
    { id: "birthday", label: "Birthday", icon: "birthday-cake" },
    { id: "corporate", label: "Corporate", icon: "briefcase" },
    { id: "conference", label: "Conference", icon: "users" },
    { id: "party", label: "Party", icon: "glass" },
    { id: "other", label: "Other", icon: "star" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome name="arrow-left" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Event</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Event Name"
              placeholder="Enter event name"
              value={formData.eventName}
              onChangeText={(text) =>
                setFormData({ ...formData, eventName: text })
              }
              error={errors.eventName}
              leftIcon={
                <FontAwesome name="calendar" size={18} color={Colors.gray400} />
              }
              required
            />

            <Text style={styles.label}>Event Type</Text>
            <View style={styles.eventTypeContainer}>
              {eventTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.eventTypeButton,
                    formData.eventType === type.id && styles.eventTypeButtonActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, eventType: type.id })
                  }
                >
                  <FontAwesome5
                    name={type.icon as any}
                    size={18}
                    color={
                      formData.eventType === type.id
                        ? Colors.white
                        : Colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.eventTypeLabel,
                      formData.eventType === type.id &&
                        styles.eventTypeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.eventType && (
              <Text style={styles.errorText}>{errors.eventType}</Text>
            )}

            <Input
              label="Date"
              placeholder="Select date"
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              error={errors.date}
              leftIcon={
                <FontAwesome name="calendar-o" size={18} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Location"
              placeholder="Enter event location"
              value={formData.location}
              onChangeText={(text) =>
                setFormData({ ...formData, location: text })
              }
              error={errors.location}
              leftIcon={
                <FontAwesome name="map-marker" size={18} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Description (Optional)"
              placeholder="Describe your event"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
              leftIcon={
                <FontAwesome name="info-circle" size={18} color={Colors.gray400} />
              }
            />

            <Button
              title="Create Event"
              onPress={handleCreateEvent}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.lg }}
            />
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Tips for a Great Event</Text>
            <View style={styles.tipItem}>
              <FontAwesome name="check" size={14} color={Colors.success} />
              <Text style={styles.tipText}>Add clear event details</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check" size={14} color={Colors.success} />
              <Text style={styles.tipText}>Set a realistic budget</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check" size={14} color={Colors.success} />
              <Text style={styles.tipText}>Book vendors in advance</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
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
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
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
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  eventTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  eventTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + "15",
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: Spacing.xs,
  },
  eventTypeButtonActive: {
    backgroundColor: Colors.primary,
  },
  eventTypeLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  eventTypeLabelActive: {
    color: Colors.white,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  tipsSection: {
    backgroundColor: Colors.gray50,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
  },
  tipsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  tipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default CreateEvent;
