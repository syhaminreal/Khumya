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
  Shadows,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { Button, Input } from "../components/ui";

const UserLogin = () => {
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

    const success = await login(formData.email, formData.password, false);

    if (success) {
      router.replace("/(tabs)");
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
              <FontAwesome name="user" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue exploring events
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
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
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={20} color={Colors.error} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={20} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/user-signup")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Vendor Login Link */}
          <TouchableOpacity
            style={styles.vendorLink}
            onPress={() => router.push("/auth/vendor-login")}
          >
            <Text style={styles.vendorLinkText}>
              Are you a vendor?{" "}
              <Text style={styles.vendorLinkBold}>Login here</Text>
            </Text>
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  forgotPasswordText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    ...Shadows.sm,
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

export default UserLogin;
