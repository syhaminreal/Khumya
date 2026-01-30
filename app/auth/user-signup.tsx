// app/auth/user-signup.tsx
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
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { Button, Input } from "../components/ui";
import { USER_ROUTES, VENDOR_ROUTES, NAVIGATION_ROUTES } from "./routes";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  info: string;
}

const UserSignup: React.FC = () => {
  const router = useRouter();
  const { signup, loading } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    info: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Please enter a valid 10-digit phone number";

    if (!agreedToTerms) newErrors.terms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      Alert.alert("Invalid Input", "Please fill all required fields correctly.");
      return;
    }

    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || "",
        info: formData.info || "",
        role: "client", // default role
      };

      const success = await signup(signupData);
      console.log("Signup result:", success);

      if (success) {
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          try {
            // Redirect to login page after successful signup
            router.replace(USER_ROUTES.LOGIN);
          } catch (navError) {
            console.error("Navigation error:", navError);
          }
        }, 100);
      } else {
        Alert.alert("Signup Failed", "Unable to create account. Please try again.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
      Alert.alert("Error", message);
    }
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome name="user-plus" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us to discover amazing events</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              error={errors.name}
              leftIcon={<FontAwesome name="user" size={18} color={Colors.gray400} />}
              required
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              error={errors.email}
              leftIcon={<FontAwesome name="envelope" size={18} color={Colors.gray400} />}
              required
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              error={errors.phone}
              leftIcon={<FontAwesome name="phone" size={18} color={Colors.gray400} />}
            />

            <Input
              label="About You (In brief)"
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              value={formData.info}
              onChangeText={(text) => setFormData({ ...formData, info: text })}
              leftIcon={<FontAwesome name="info-circle" size={18} color={Colors.gray400} />}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              isPassword
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              error={errors.password}
              hint="Must be at least 6 characters"
              leftIcon={<FontAwesome name="lock" size={20} color={Colors.gray400} />}
              required
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              isPassword
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              error={errors.confirmPassword}
              leftIcon={<FontAwesome name="lock" size={20} color={Colors.gray400} />}
              required
            />

            {/* Terms Agreement */}
            <TouchableOpacity style={styles.termsContainer} onPress={() => setAgreedToTerms(!agreedToTerms)}>
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <FontAwesome name="check" size={12} color={Colors.white} />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

            <Button title="Create Account" onPress={handleSignup} loading={loading} fullWidth size="lg" style={{ marginTop: Spacing.base }} />

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push(USER_ROUTES.LOGIN)}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Vendor Signup Link */}
            <TouchableOpacity style={styles.vendorLink} onPress={() => router.push(VENDOR_ROUTES.SIGNUP)}>
              <Text style={styles.vendorLinkText}>
                Want to offer services? <Text style={styles.vendorLinkBold}>Register as Vendor</Text>
              </Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  header: {
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  form: {
    marginBottom: Spacing.lg,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: Spacing.sm,
    marginBottom: Spacing.base,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xl,
    marginBottom: Spacing.base,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  loginText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  vendorLink: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.secondary + "10",
    borderRadius: BorderRadius.base,
  },
  vendorLinkText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  vendorLinkBold: {
    color: Colors.secondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default UserSignup;
