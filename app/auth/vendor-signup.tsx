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
import { Question, Vendor } from "../../types";
import {
  CITIES,
  CULTURES,
  MOCK_CATEGORIES,
  NATIONS,
  THEMES,
} from "../../types/mockData";
import { Button, Card, Input, Select } from "../components/ui";
import { VENDOR_ROUTES, USER_ROUTES, NAVIGATION_ROUTES } from "./routes";

const SECTIONS = [
  { title: "Account Info", subtitle: "Create your account" },
  { title: "Business Info", subtitle: "Tell us about your business" },
  { title: "Location", subtitle: "Where are you located?" },
  { title: "Category", subtitle: "Select your service category" },
];

const VendorSignup = () => {
  const router = useRouter();
  const { signup, setVendorProfile, loading, user } = useAuth();

  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // All fields in one state
  const [formData, setFormData] = useState({
    // Account Info
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    // Business Info
    vendorName: "",
    description: "",
    space: "",
    // Location Info
    city: "",
    nation: "",
    culture: "",
    theme: "",
    // Category Info
    selectedCategory: "",
    answers: {} as Record<string, string>,
  });

  const selectedCategoryObj = MOCK_CATEGORIES.find(
    (c) => c.id.toString() === formData.selectedCategory,
  );

  const validateSection = (section: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (section) {
      case 0: // Account
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone) newErrors.phone = "Phone number is required";
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;

      case 1: // Business
        if (!formData.vendorName.trim()) {
          newErrors.vendorName = "Business name is required";
        }
        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
        }
        break;

      case 2: // Location
        if (!formData.nation) newErrors.nation = "Please select your country";
        if (!formData.city) newErrors.city = "Please select your city";
        break;

      case 3: // Category
        if (!formData.selectedCategory) {
          newErrors.category = "Please select a category";
        }
        if (selectedCategoryObj) {
          selectedCategoryObj.question.forEach((q, idx) => {
            if (!formData.answers[`q_${idx}`]?.trim()) {
              newErrors[`q_${idx}`] = "This question is required";
            }
          });
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateSection(currentSection)) return;

    try {
      // Step 1: Create user account
      const signupSuccess = await signup(
        {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
        },
        true, // isVendor
      );

      if (!signupSuccess) {
        Alert.alert("Error", "Failed to create account. Please try again.");
        return;
      }

      // Step 2: Create vendor profile
      const categoryAnswers: Question[] = selectedCategoryObj
        ? selectedCategoryObj.question.map((q, idx) => ({
            question: q.question,
            answer: formData.answers[`q_${idx}`] || "",
          }))
        : [];

      const vendorProfile: Vendor = {
        id: Date.now(),
        vendorName: formData.vendorName,
        description: formData.description,
        owner: user?.id || 1,
        city: formData.city,
        nation: formData.nation,
        culture: formData.culture,
        theme: formData.theme,
        space: formData.space,
        infos: { question: categoryAnswers },
        createdAt: new Date().toISOString(),
      };

      await setVendorProfile(vendorProfile);

      Alert.alert(
        "Registration Complete!",
        "Your vendor account has been created successfully.",
        [{ text: "Go to Dashboard", onPress: () => router.replace(NAVIGATION_ROUTES.TABS.HOME) }],
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again.",
      );
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Account Info
        return (
          <Card style={styles.card}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              error={errors.name}
              leftIcon={
                <FontAwesome name="user" size={18} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Email Address"
              placeholder="Enter your business email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              error={errors.email}
              leftIcon={
                <FontAwesome name="envelope" size={18} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              error={errors.phone}
              leftIcon={
                <FontAwesome name="phone" size={18} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Username"
              placeholder="Choose a username"
              autoCapitalize="none"
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text })
              }
              error={errors.username}
              leftIcon={
                <FontAwesome name="at" size={18} color={Colors.gray400} />
              }
              hint="This will be your unique identifier"
              required
            />

            <Input
              label="Password"
              placeholder="Create a strong password"
              isPassword
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              error={errors.password}
              hint="Must be at least 8 characters"
              leftIcon={
                <FontAwesome name="lock" size={20} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              isPassword
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              error={errors.confirmPassword}
              leftIcon={
                <FontAwesome name="lock" size={20} color={Colors.gray400} />
              }
              required
            />
          </Card>
        );

      case 1: // Business Info
        return (
          <Card style={styles.card}>
            <Input
              label="Business Name"
              placeholder="Enter your business name"
              value={formData.vendorName}
              onChangeText={(text) =>
                setFormData({ ...formData, vendorName: text })
              }
              error={errors.vendorName}
              leftIcon={
                <FontAwesome name="building" size={18} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Business Description"
              placeholder="Describe your services..."
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              error={errors.description}
              inputStyle={{ height: 100, textAlignVertical: "top" }}
              required
            />

            <Input
              label="Space / Capacity"
              placeholder="e.g., Studio, 100 guests, etc."
              value={formData.space}
              onChangeText={(text) =>
                setFormData({ ...formData, space: text })
              }
              hint="Describe your workspace or capacity"
              leftIcon={
                <FontAwesome name="expand" size={18} color={Colors.gray400} />
              }
            />
          </Card>
        );

      case 2: // Location
        return (
          <Card style={styles.card}>
            <Select
              label="Country"
              placeholder="Select your country"
              options={NATIONS.map((n) => ({ label: n, value: n }))}
              value={formData.nation}
              onChange={(value) =>
                setFormData({ ...formData, nation: value })
              }
              error={errors.nation}
              required
            />

            <Select
              label="City"
              placeholder="Select your city"
              options={CITIES.map((c) => ({ label: c, value: c }))}
              value={formData.city}
              onChange={(value) =>
                setFormData({ ...formData, city: value })
              }
              error={errors.city}
              required
            />

            <Select
              label="Culture / Style"
              placeholder="Select cultural style (optional)"
              options={CULTURES.map((c) => ({ label: c, value: c }))}
              value={formData.culture}
              onChange={(value) =>
                setFormData({ ...formData, culture: value })
              }
            />

            <Select
              label="Theme Specialty"
              placeholder="Select your theme specialty (optional)"
              options={THEMES.map((t) => ({ label: t, value: t }))}
              value={formData.theme}
              onChange={(value) =>
                setFormData({ ...formData, theme: value })
              }
            />
          </Card>
        );

      case 3: // Category
        return (
          <Card style={styles.card}>
            <Select
              label="Service Category"
              placeholder="Select your service category"
              options={MOCK_CATEGORIES.map((c) => ({
                label: c.title,
                value: c.id.toString(),
              }))}
              value={formData.selectedCategory}
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  selectedCategory: value,
                  answers: {},
                }));
              }}
              error={errors.category}
              required
            />

            {selectedCategoryObj && (
              <View style={styles.categoryQuestions}>
                <Text style={styles.categoryQuestionsTitle}>
                  {selectedCategoryObj.title} Questions
                </Text>
                <Text style={styles.categoryQuestionsSubtitle}>
                  Please answer the following questions
                </Text>
                {selectedCategoryObj.question.map((q, idx) => (
                  <Input
                    key={idx}
                    label={q.question}
                    placeholder="Enter your answer"
                    value={formData.answers[`q_${idx}`] || ""}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        answers: {
                          ...formData.answers,
                          [`q_${idx}`]: text,
                        },
                      })
                    }
                    error={errors[`q_${idx}`]}
                    required
                  />
                ))}
              </View>
            )}
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={currentSection === 0 ? () => router.back() : handleBack}
          >
            <FontAwesome
              name={currentSection === 0 ? "times" : "arrow-left"}
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vendor Registration</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {SECTIONS.map((section, index) => (
            <View key={index} style={styles.progressItem}>
              <View
                style={[
                  styles.progressCircle,
                  index <= currentSection && styles.progressCircleActive,
                ]}
              >
                {index < currentSection ? (
                  <FontAwesome name="check" size={14} color={Colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.progressNumber,
                      index <= currentSection && styles.progressNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  index <= currentSection && styles.progressLabelActive,
                ]}
              >
                {section.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {SECTIONS[currentSection].title}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {SECTIONS[currentSection].subtitle}
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderSection()}

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentSection < SECTIONS.length - 1 ? (
              <Button
                title="Next"
                onPress={handleNext}
                size="lg"
                icon={<FontAwesome name="arrow-right" size={18} color={Colors.white} />}
                iconPosition="right"
              />
            ) : (
              <Button
                title="Submit"
                onPress={handleSubmit}
                loading={loading}
                size="lg"
                style={{ backgroundColor: Colors.success }}
                icon={<FontAwesome name="check" size={18} color={Colors.white} />}
                iconPosition="right"
              />
            )}
          </View>

          {/* Login Link */}
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push(NAVIGATION_ROUTES.AUTH.VENDOR_LOGIN)}
            >
              <Text style={styles.loginLinkText}> Sign In</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gray50,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  progressItem: {
    alignItems: "center",
    flex: 1,
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  progressCircleActive: {
    backgroundColor: Colors.primary,
  },
  progressNumber: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray500,
  },
  progressNumberActive: {
    color: Colors.white,
  },
  progressLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray400,
    textAlign: "center",
  },
  progressLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  card: {
    marginBottom: Spacing.lg,
  },
  categoryQuestions: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  categoryQuestionsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  categoryQuestionsSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  buttonContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  loginText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  loginLinkText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default VendorSignup;
