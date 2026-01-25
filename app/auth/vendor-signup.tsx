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
import { Button, Card, Input, Select, StepIndicator } from "../components/ui";

const STEPS = ["Account", "Business", "Location", "Category", "Complete"];

const VendorSignup = () => {
  const router = useRouter();
  const { signup, setVendorProfile, loading, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Account Info
  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Step 2: Business Info
  const [businessData, setBusinessData] = useState({
    vendorName: "",
    description: "",
    space: "",
  });

  // Step 3: Location Info
  const [locationData, setLocationData] = useState({
    city: "",
    nation: "",
    culture: "",
    theme: "",
  });

  // Step 4: Category & Questions
  const [categoryData, setCategoryData] = useState({
    selectedCategory: "",
    answers: {} as Record<string, string>,
  });

  const selectedCategoryObj = MOCK_CATEGORIES.find(
    (c) => c.id.toString() === categoryData.selectedCategory,
  );

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Account
        if (!accountData.name.trim()) newErrors.name = "Name is required";
        if (!accountData.email) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(accountData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!accountData.password) {
          newErrors.password = "Password is required";
        } else if (accountData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        if (accountData.password !== accountData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;

      case 1: // Business
        if (!businessData.vendorName.trim()) {
          newErrors.vendorName = "Business name is required";
        }
        if (!businessData.description.trim()) {
          newErrors.description = "Description is required";
        }
        break;

      case 2: // Location
        if (!locationData.nation)
          newErrors.nation = "Please select your country";
        if (!locationData.city) newErrors.city = "Please select your city";
        break;

      case 3: // Category
        if (!categoryData.selectedCategory) {
          newErrors.category = "Please select a category";
        }
        // Validate all category questions are answered
        if (selectedCategoryObj) {
          selectedCategoryObj.question.forEach((q, idx) => {
            if (!categoryData.answers[`q_${idx}`]?.trim()) {
              newErrors[`q_${idx}`] = "This question is required";
            }
          });
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 0) {
      // Create user account first
      const success = await signup(
        {
          email: accountData.email,
          name: accountData.name,
          password: accountData.password,
        },
        true,
      );
      if (!success) {
        Alert.alert("Error", "Failed to create account. Please try again.");
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Create vendor profile object
    const categoryAnswers: Question[] = selectedCategoryObj
      ? selectedCategoryObj.question.map((q, idx) => ({
          question: q.question,
          answer: categoryData.answers[`q_${idx}`] || "",
        }))
      : [];

    const vendorProfile: Vendor = {
      id: Date.now(),
      vendorName: businessData.vendorName,
      description: businessData.description,
      owner: user?.id || 1,
      city: locationData.city,
      nation: locationData.nation,
      culture: locationData.culture,
      theme: locationData.theme,
      space: businessData.space,
      infos: { question: categoryAnswers },
      createdAt: new Date().toISOString(),
    };

    setVendorProfile(vendorProfile);

    Alert.alert(
      "Registration Complete! 🎉",
      "Your vendor account has been created successfully.",
      [{ text: "Go to Dashboard", onPress: () => router.replace("/(tabs)") }],
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Create Your Account</Text>
            <Text style={styles.stepDescription}>
              Let's start with your personal information
            </Text>

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={accountData.name}
              onChangeText={(text) =>
                setAccountData({ ...accountData, name: text })
              }
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
              value={accountData.email}
              onChangeText={(text) =>
                setAccountData({ ...accountData, email: text })
              }
              error={errors.email}
              leftIcon={
                <FontAwesome name="envelope" size={18} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Password"
              placeholder="Create a strong password"
              isPassword
              value={accountData.password}
              onChangeText={(text) =>
                setAccountData({ ...accountData, password: text })
              }
              error={errors.password}
              hint="Must be at least 6 characters"
              leftIcon={
                <FontAwesome name="lock" size={20} color={Colors.gray400} />
              }
              required
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              isPassword
              value={accountData.confirmPassword}
              onChangeText={(text) =>
                setAccountData({ ...accountData, confirmPassword: text })
              }
              error={errors.confirmPassword}
              leftIcon={
                <FontAwesome name="lock" size={20} color={Colors.gray400} />
              }
              required
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Business Information</Text>
            <Text style={styles.stepDescription}>
              Tell us about your business
            </Text>

            <Input
              label="Business Name"
              placeholder="Enter your business name"
              value={businessData.vendorName}
              onChangeText={(text) =>
                setBusinessData({ ...businessData, vendorName: text })
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
              value={businessData.description}
              onChangeText={(text) =>
                setBusinessData({ ...businessData, description: text })
              }
              error={errors.description}
              inputStyle={{ height: 100, textAlignVertical: "top" }}
              required
            />

            <Input
              label="Space / Capacity"
              placeholder="e.g., Studio, 100 guests, etc."
              value={businessData.space}
              onChangeText={(text) =>
                setBusinessData({ ...businessData, space: text })
              }
              hint="Describe your workspace or capacity"
              leftIcon={
                <FontAwesome name="expand" size={18} color={Colors.gray400} />
              }
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Location Details</Text>
            <Text style={styles.stepDescription}>
              Where is your business located?
            </Text>

            <Select
              label="Country"
              placeholder="Select your country"
              options={NATIONS.map((n) => ({ label: n, value: n }))}
              value={locationData.nation}
              onChange={(value) =>
                setLocationData({ ...locationData, nation: value })
              }
              error={errors.nation}
              required
            />

            <Select
              label="City"
              placeholder="Select your city"
              options={CITIES.map((c) => ({ label: c, value: c }))}
              value={locationData.city}
              onChange={(value) =>
                setLocationData({ ...locationData, city: value })
              }
              error={errors.city}
              required
            />

            <Select
              label="Culture / Style"
              placeholder="Select cultural style (optional)"
              options={CULTURES.map((c) => ({ label: c, value: c }))}
              value={locationData.culture}
              onChange={(value) =>
                setLocationData({ ...locationData, culture: value })
              }
            />

            <Select
              label="Theme Specialty"
              placeholder="Select your theme specialty (optional)"
              options={THEMES.map((t) => ({ label: t, value: t }))}
              value={locationData.theme}
              onChange={(value) =>
                setLocationData({ ...locationData, theme: value })
              }
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Service Category</Text>
            <Text style={styles.stepDescription}>
              Select your category and answer related questions
            </Text>

            <Select
              label="Service Category"
              placeholder="Select your service category"
              options={MOCK_CATEGORIES.map((c) => ({
                label: c.title,
                value: c.id.toString(),
              }))}
              value={categoryData.selectedCategory}
              onChange={(value) => {
                setCategoryData({ selectedCategory: value, answers: {} });
              }}
              error={errors.category}
              required
            />

            {selectedCategoryObj && (
              <Card
                title={`${selectedCategoryObj.title} Questions`}
                subtitle="Please answer the following questions"
                style={{ marginTop: Spacing.base }}
              >
                {selectedCategoryObj.question.map((q, idx) => (
                  <Input
                    key={idx}
                    label={q.question}
                    placeholder="Enter your answer"
                    value={categoryData.answers[`q_${idx}`] || ""}
                    onChangeText={(text) =>
                      setCategoryData({
                        ...categoryData,
                        answers: {
                          ...categoryData.answers,
                          [`q_${idx}`]: text,
                        },
                      })
                    }
                    error={errors[`q_${idx}`]}
                    required
                  />
                ))}
              </Card>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.completeIcon}>
              <FontAwesome
                name="check-circle"
                size={80}
                color={Colors.success}
              />
            </View>
            <Text style={styles.completeTitle}>You're All Set!</Text>
            <Text style={styles.completeDescription}>
              Review your information below and complete your registration
            </Text>

            <Card title="Summary" style={{ marginTop: Spacing.lg }}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Business Name</Text>
                <Text style={styles.summaryValue}>
                  {businessData.vendorName}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>
                  {locationData.city}, {locationData.nation}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Category</Text>
                <Text style={styles.summaryValue}>
                  {selectedCategoryObj?.title || "N/A"}
                </Text>
              </View>
              {locationData.theme && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Theme</Text>
                  <Text style={styles.summaryValue}>{locationData.theme}</Text>
                </View>
              )}
            </Card>
          </View>
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
            onPress={currentStep === 0 ? () => router.back() : handleBack}
          >
            <FontAwesome
              name="arrow-left"
              size={20}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vendor Registration</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          {currentStep > 0 && currentStep < 4 && (
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              style={{ flex: 1, marginRight: Spacing.sm }}
            />
          )}
          {currentStep < 4 ? (
            <Button
              title={currentStep === 3 ? "Review" : "Continue"}
              onPress={handleNext}
              loading={loading && currentStep === 0}
              variant="secondary"
              style={{ flex: currentStep > 0 ? 1 : undefined }}
              fullWidth={currentStep === 0}
            />
          ) : (
            <Button
              title="Complete Registration"
              onPress={handleComplete}
              variant="secondary"
              fullWidth
              size="lg"
            />
          )}
        </View>
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
    paddingHorizontal: Spacing.base,
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
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  stepDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  bottomButtons: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  completeIcon: {
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  completeTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  completeDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
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
});

export default VendorSignup;
