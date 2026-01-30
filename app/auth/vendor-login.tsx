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
import { Button, Input } from "../components/ui";
import { VENDOR_ROUTES, NAVIGATION_ROUTES } from "./routes";

const VendorLogin = () => {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const success = await login(formData, true);

    if (success) {
      router.replace(NAVIGATION_ROUTES.TABS.VENDOR_PROFILE);
    } else {
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again.",
      );
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

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome
                name="briefcase"
                size={32}
                color={Colors.secondary}
              />
            </View>
            <Text style={styles.title}>Vendor Portal</Text>
            <Text style={styles.subtitle}>Sign in to manage your services</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Business Email"
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
              label="Password"
              placeholder="Enter your password"
              isPassword
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              error={errors.password}
              leftIcon={
                <FontAwesome name="lock" size={20} color={Colors.gray400} />
              }
              required
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In as Vendor"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
              variant="secondary"
            />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have a vendor account? </Text>
            <TouchableOpacity
              onPress={() => router.push(VENDOR_ROUTES.SIGNUP)}
            >
              <Text style={styles.signupLink}>Register Now</Text>
            </TouchableOpacity>
          </View>

          {/* User Login Link */}
          <TouchableOpacity
            style={styles.userLink}
            onPress={() => router.push(NAVIGATION_ROUTES.AUTH.USER_LOGIN)}
          >
            <Text style={styles.userLinkText}>
              Not a vendor?{" "}
              <Text style={styles.userLinkBold}>Login as User</Text>
            </Text>
          </TouchableOpacity>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Why join as a Vendor?</Text>
            <View style={styles.benefitItem}>
              <FontAwesome
                name="check-circle"
                size={16}
                color={Colors.success}
              />
              <Text style={styles.benefitText}>
                Reach thousands of potential clients
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <FontAwesome
                name="check-circle"
                size={16}
                color={Colors.success}
              />
              <Text style={styles.benefitText}>
                Easy booking management system
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <FontAwesome
                name="check-circle"
                size={16}
                color={Colors.success}
              />
              <Text style={styles.benefitText}>
                Showcase your portfolio & services
              </Text>
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
    marginTop: Spacing["2xl"],
    marginBottom: Spacing["2xl"],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary + "15",
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
    marginBottom: Spacing.xl,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  forgotPasswordText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  signupText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  signupLink: {
    fontSize: Typography.fontSize.base,
    color: Colors.secondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  userLink: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary + "10",
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.xl,
  },
  userLinkText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  userLinkBold: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  benefitsSection: {
    backgroundColor: Colors.gray50,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
  },
  benefitsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default VendorLogin;
