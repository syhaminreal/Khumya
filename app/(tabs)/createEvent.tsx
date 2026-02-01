import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
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
import api from "../service/api";
import { useAuth } from "../../context/AuthContext";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../constants/theme";
import { Button, Input } from "../components/ui";

interface CreateEventForm {
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  budget?: number;
}

const CreateEvent: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You need to login to create an event.",
        [
          {
            text: "Login",
            onPress: () => router.replace("/auth/user-login"),
          },
          {
            text: "Cancel",
            onPress: () => router.back(),
          },
        ]
      );
    }
  }, [isAuthenticated, authLoading]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Checking authentication...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Don't render form if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const [formData, setFormData] = useState<CreateEventForm>({
    title: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    location: "",
    budget: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.type) {
      newErrors.type = "Event type is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || "",
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        budget: formData.budget || 0,
      };

      console.log("➡️ Creating event:", payload);

      const response = await api.post("/event", payload);

      console.log("✅ Event created:", response.data);

      Alert.alert(
        "Success",
        "Your event has been created successfully!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (error: any) {
      console.error("❌ Create Event Error:", error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || error.response?.data?.error || "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
              label="Event Title"
              placeholder="Enter event title"
              value={formData.title}
              onChangeText={(text) =>
                setFormData({ ...formData, title: text })
              }
              error={errors.title}
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
                    formData.type === type.id && styles.eventTypeButtonActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, type: type.id })
                  }
                >
                  <FontAwesome5
                    name={type.icon as any}
                    size={18}
                    color={
                      formData.type === type.id
                        ? Colors.white
                        : Colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.eventTypeLabel,
                      formData.type === type.id &&
                        styles.eventTypeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.type && (
              <Text style={styles.errorText}>{errors.type}</Text>
            )}

            <Input
              label="Start Date"
              placeholder="Select start date"
              value={formData.startDate}
              onChangeText={(text) => setFormData({ ...formData, startDate: text })}
              error={errors.startDate}
              leftIcon={
                <FontAwesome name="calendar" size={18} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="End Date"
              placeholder="Select end date"
              value={formData.endDate}
              onChangeText={(text) => setFormData({ ...formData, endDate: text })}
              error={errors.endDate}
              leftIcon={
                <FontAwesome name="calendar" size={18} color={Colors.gray400} />
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
              title={loading ? "Creating..." : "Create Event"}
              onPress={handleCreateEvent}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.lg }}
              disabled={loading}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
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
