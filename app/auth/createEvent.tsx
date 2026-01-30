import { FontAwesome } from "@expo/vector-icons";
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
  Spacing,
  Typography,
} from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input, Select } from "../components/ui";

// Event type options
const EVENT_TYPES = [
  { label: "Wedding", value: "wedding" },
  { label: "Corporate Event", value: "corporate" },
  { label: "Birthday Party", value: "birthday" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Engagement", value: "engagement" },
  { label: "Baby Shower", value: "baby_shower" },
  { label: "Other", value: "other" },
];

// Theme suggestions based on event type
const THEME_SUGGESTIONS: Record<string, string[]> = {
  wedding: ["Garden Romance", "Classic Elegance", "Rustic Chic", "Modern Minimal", "Vintage Glamour"],
  corporate: ["Professional", "Modern Tech", "Creative Studio", "Traditional Boardroom"],
  birthday: ["Fun & Festive", "Elegant Dinner", "Pool Party", "Themed Adventure"],
  anniversary: ["Romantic Sunset", "Classic Romance", "Milestone Celebration"],
  engagement: ["Intimate Garden", "Rooftop Romance", "Beachside Promise"],
  baby_shower: ["Soft Pastels", "Gender Neutral", "Storybook Theme", "Floral Garden"],
  other: ["Custom Theme"],
};

// Budget ranges for suggestions
const BUDGET_RANGES = [
  { label: "Under $5,000", value: 5000 },
  { label: "$5,000 - $10,000", value: 10000 },
  { label: "$10,000 - $25,000", value: 25000 },
  { label: "$25,000 - $50,000", value: 50000 },
  { label: "$50,000 - $100,000", value: 100000 },
  { label: "$100,000+", value: 1000000 },
];

interface EventFormData {
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  budget: string;
  theme: string;
}

const CreateEvent = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string>("details");

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    location: "",
    budget: "",
    theme: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.type) {
      newErrors.type = "Please select an event type";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date and time is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date and time is required";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = "End time must be after start time";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = "Please enter a valid budget amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const eventData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        budget: formData.budget ? Number(formData.budget) : null,
        theme: formData.theme || null,
        organizer: user?.id,
      };

      console.log("Creating event:", eventData);

      Alert.alert(
        "Event Created! 🎉",
        "Your event has been created successfully.",
        [
          {
            text: "View Event",
            onPress: () => router.replace("/(tabs)/profile"),
          },
          {
            text: "Create Another",
            onPress: () => {
              setFormData({
                title: "",
                description: "",
                type: "",
                startDate: "",
                endDate: "",
                location: "",
                budget: "",
                theme: "",
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Create event error:", error);
      Alert.alert("Error", "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (sectionId: string, title: string, icon: string) => {
    const isActive = activeSection === sectionId;
    return (
      <TouchableOpacity
        style={[styles.sectionHeader, isActive && styles.sectionHeaderActive]}
        onPress={() => setActiveSection(isActive ? "" : sectionId)}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.sectionIcon, isActive && styles.sectionIconActive]}>
            <FontAwesome name={icon as any} size={16} color={isActive ? Colors.white : Colors.secondary} />
          </View>
          <Text style={[styles.sectionTitle, isActive && styles.sectionTitleActive]}>
            {title}
          </Text>
        </View>
        <FontAwesome
          name={isActive ? "chevron-up" : "chevron-down"}
          size={14}
          color={Colors.gray400}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Event</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "30%" }]} />
            </View>
            <Text style={styles.progressText}>Step 1 of 3 - Event Details</Text>
          </View>

          {/* Quick Tips Card */}
          <Card style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <FontAwesome name="lightbulb-o" size={18} color={Colors.warning} />
              <Text style={styles.tipsTitle}>Tips for a Great Event</Text>
            </View>
            <Text style={styles.tipsText}>
              • Choose a clear, descriptive title that captures the essence of your event
            </Text>
            <Text style={styles.tipsText}>
              • Set a realistic budget to help vendors provide accurate quotes
            </Text>
            <Text style={styles.tipsText}>
              • Book vendors early to secure your preferred date and services
            </Text>
          </Card>

          {/* Event Details Section */}
          {renderSection("details", "Event Details", "calendar")}
          {activeSection === "details" && (
            <View style={styles.sectionContent}>
              <Input
                label="Event Title"
                placeholder="e.g., Smith-Johnson Wedding"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                error={errors.title}
                leftIcon={<FontAwesome name="pencil" size={18} color={Colors.gray400} />}
                required
              />

              <Select
                label="Event Type"
                placeholder="Select event type"
                options={EVENT_TYPES}
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value })}
                error={errors.type}
                required
              />

              <Input
                label="Description"
                placeholder="Describe your event in detail..."
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
                inputStyle={{ height: 100, textAlignVertical: "top" }}
                hint="Include important details like guest count, style preferences, etc."
              />
            </View>
          )}

          {/* Date & Time Section */}
          {renderSection("datetime", "Date & Time", "clock-o")}
          {activeSection === "datetime" && (
            <View style={styles.sectionContent}>
              <Input
                label="Start Date & Time"
                placeholder="Select start date and time"
                value={formData.startDate}
                onChangeText={(text) => setFormData({ ...formData, startDate: text })}
                error={errors.startDate}
                leftIcon={<FontAwesome name="calendar" size={18} color={Colors.gray400} />}
                hint="When should your event begin?"
                required
              />

              <Input
                label="End Date & Time"
                placeholder="Select end date and time"
                value={formData.endDate}
                onChangeText={(text) => setFormData({ ...formData, endDate: text })}
                error={errors.endDate}
                leftIcon={<FontAwesome name="calendar-check-o" size={18} color={Colors.gray400} />}
                hint="When should your event conclude?"
                required
              />

              {/* Duration Preview */}
              {formData.startDate && formData.endDate && !errors.endDate && (
                <View style={styles.durationPreview}>
                  <FontAwesome name="hourglass-half" size={20} color={Colors.primary} />
                  <Text style={styles.durationText}>
                    Estimated Duration:{" "}
                    <Text style={styles.durationValue}>
                      {Math.round(
                        (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
                          (1000 * 60 * 60)
                      )}{" "}
                      hours
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Location Section */}
          {renderSection("location", "Location", "map-marker")}
          {activeSection === "location" && (
            <View style={styles.sectionContent}>
              <Input
                label="Event Location"
                placeholder="e.g., Grand Oak Gardens, California"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                error={errors.location}
                leftIcon={<FontAwesome name="map-marker" size={18} color={Colors.gray400} />}
                required
              />

              <View style={styles.locationHint}>
                <FontAwesome name="info-circle" size={16} color={Colors.info} />
                <Text style={styles.locationHintText}>
                  Be specific about the venue address. This helps vendors provide accurate pricing and directions.
                </Text>
              </View>
            </View>
          )}

          {/* Budget & Theme Section */}
          {renderSection("budget", "Budget & Theme", "dollar")}
          {activeSection === "budget" && (
            <View style={styles.sectionContent}>
              <Input
                label="Budget"
                placeholder="Enter your budget in USD"
                value={formData.budget}
                onChangeText={(text) => setFormData({ ...formData, budget: text })}
                error={errors.budget}
                keyboardType="numeric"
                leftIcon={<FontAwesome name="dollar" size={18} color={Colors.gray400} />}
                hint="This helps vendors customize packages for your budget"
              />

              {/* Budget Quick Select */}
              <View style={styles.budgetQuickSelect}>
                <Text style={styles.quickSelectLabel}>Quick Select:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {BUDGET_RANGES.map((range) => (
                    <TouchableOpacity
                      key={range.value}
                      style={[
                        styles.budgetChip,
                        formData.budget === range.value.toString() && styles.budgetChipActive,
                      ]}
                      onPress={() => setFormData({ ...formData, budget: range.value.toString() })}
                    >
                      <Text
                        style={[
                          styles.budgetChipText,
                          formData.budget === range.value.toString() && styles.budgetChipTextActive,
                        ]}
                      >
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Input
                label="Theme / Style"
                placeholder="e.g., Garden Romance"
                value={formData.theme}
                onChangeText={(text) => setFormData({ ...formData, theme: text })}
                leftIcon={<FontAwesome name="paint-brush" size={18} color={Colors.gray400} />}
                hint="Describe the visual style and atmosphere you envision"
              />

              {/* Theme Suggestions */}
              {formData.type && THEME_SUGGESTIONS[formData.type] && (
                <View style={styles.suggestionsContainer}>
                  <Text style={styles.suggestionsTitle}>Popular themes for {EVENT_TYPES.find(t => t.value === formData.type)?.label}:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {THEME_SUGGESTIONS[formData.type].map((theme) => (
                      <TouchableOpacity
                        key={theme}
                        style={styles.themeChip}
                        onPress={() => setFormData({ ...formData, theme })}
                      >
                        <Text style={styles.themeChipText}>{theme}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {/* Summary Card */}
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Event Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Type:</Text>
              <Text style={styles.summaryValue}>{EVENT_TYPES.find(t => t.value === formData.type)?.label || "Not selected"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "Not selected"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>{formData.location || "Not specified"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Budget:</Text>
              <Text style={styles.summaryValue}>
                {formData.budget ? `$${Number(formData.budget).toLocaleString()}` : "Not specified"}
              </Text>
            </View>
          </Card>

          {/* Create Button */}
          <Button
            title="Create Event"
            onPress={handleCreateEvent}
            loading={loading}
            fullWidth
            size="lg"
            style={{ marginTop: Spacing.lg }}
          />

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    paddingVertical: Spacing.md,
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
  progressContainer: {
    marginVertical: Spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  tipsCard: {
    backgroundColor: Colors.warning + "10",
    borderColor: Colors.warning + "30",
    marginBottom: Spacing.md,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  tipsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.warning,
    marginLeft: Spacing.sm,
  },
  tipsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.sm,
  },
  sectionHeaderActive: {
    backgroundColor: Colors.secondary + "10",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.secondary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  sectionIconActive: {
    backgroundColor: Colors.secondary,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  sectionTitleActive: {
    color: Colors.secondary,
  },
  sectionContent: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.sm,
  },
  durationPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.base,
    backgroundColor: Colors.primary + "10",
    borderRadius: BorderRadius.base,
    marginTop: Spacing.md,
  },
  durationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  durationValue: {
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
  },
  locationHint: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.base,
    backgroundColor: Colors.info + "10",
    borderRadius: BorderRadius.base,
    marginTop: Spacing.md,
  },
  locationHintText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    lineHeight: 20,
  },
  budgetQuickSelect: {
    marginVertical: Spacing.md,
  },
  quickSelectLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  budgetChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  budgetChipActive: {
    backgroundColor: Colors.secondary + "20",
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  budgetChipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  budgetChipTextActive: {
    color: Colors.secondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  suggestionsContainer: {
    marginTop: Spacing.md,
  },
  suggestionsTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  themeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + "10",
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  themeChipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
  },
  summaryCard: {
    marginTop: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
});

export default CreateEvent;
