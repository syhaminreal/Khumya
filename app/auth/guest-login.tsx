// app/auth/guest-login.tsx
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
import { useAuth } from "../../context/AuthContext";
import { Button, Input } from "../components/ui";
import { NAVIGATION_ROUTES } from "./routes";

const GuestLogin: React.FC = () => {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!otp) {
      newErrors.otp = "OTP is required";
    } else if (otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    } else if (otp !== generatedOtp) {
      newErrors.otp = "Invalid OTP";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = () => {
    if (!validatePhone()) return;

    // Generate mock OTP (in production, this would come from the API)
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);

    // Show the OTP to the user (for demo purposes)
    console.log("Generated OTP:", mockOtp);
    
    Alert.alert(
      "OTP Sent",
      `Your OTP is: ${mockOtp}\n\nIn production, this will be sent to your phone via SMS.`,
      [{ text: "OK" }]
    );
  };

  const verifyOtp = async () => {
    if (!validateOtp()) return;

    // For demo, simulate successful OTP verification
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to home page (same as user)
      router.replace(NAVIGATION_ROUTES.TABS.HOME);
    } catch (error: any) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
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
              <FontAwesome5 name="user-secret" size={28} color={Colors.info} />
            </View>
            <Text style={styles.title}>Guest Login</Text>
            <Text style={styles.subtitle}>
              Enter your phone number and the OTP we send you
            </Text>
          </View>

          {/* Phone Input */}
          <View style={styles.form}>
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                const filtered = text.replace(/\D/g, "");
                setPhone(filtered);
              }}
              error={errors.phone}
              leftIcon={
                <FontAwesome name="phone" size={18} color={Colors.gray400} />
              }
              required
              maxLength={10}
            />

            <TouchableOpacity style={styles.sendOtpButton} onPress={sendOtp}>
              <Text style={styles.sendOtpButtonText}>Send OTP</Text>
            </TouchableOpacity>

            {/* OTP Input */}
            <Input
              label="Enter OTP"
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={(text) => {
                const filtered = text.replace(/\D/g, "").slice(0, 6);
                setOtp(filtered);
              }}
              error={errors.otp}
              leftIcon={
                <FontAwesome name="lock" size={20} color={Colors.gray400} />
              }
              required
              maxLength={6}
            />

            <Button
              title="Continue"
              onPress={verifyOtp}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.base }}
            />
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>As a Guest, you can:</Text>
            <View style={styles.benefitItem}>
              <FontAwesome name="check" size={14} color={Colors.success} />
              <Text style={styles.benefitText}>Browse event vendors</Text>
            </View>
            <View style={styles.benefitItem}>
              <FontAwesome name="check" size={14} color={Colors.success} />
              <Text style={styles.benefitText}>View vendor profiles & portfolios</Text>
            </View>
            <View style={styles.benefitItem}>
              <FontAwesome name="check" size={14} color={Colors.success} />
              <Text style={styles.benefitText}>Get event invitations</Text>
            </View>
            <View style={styles.benefitItem}>
              <FontAwesome name="check" size={14} color={Colors.success} />
              <Text style={styles.benefitText}>Create your own events</Text>
            </View>
          </View>

          {/* Signup Link */}
          {/* <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Want full access? </Text>
            <TouchableOpacity
              onPress={() => router.push(NAVIGATION_ROUTES.AUTH.USER_SIGNUP)}
            >
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View> */}
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
    backgroundColor: Colors.info + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.base,
    ...Shadows.md,
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
    paddingHorizontal: Spacing.xl,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  sendOtpButton: {
    alignSelf: "flex-end",
    marginBottom: Spacing.md,
    marginTop: -Spacing.sm,
  },
  sendOtpButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.info,
    fontWeight: Typography.fontWeight.semiBold,
  },
  benefitsSection: {
    backgroundColor: Colors.gray50,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
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
});

export default GuestLogin;
