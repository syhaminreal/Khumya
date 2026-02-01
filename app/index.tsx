import { FontAwesome5, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Linking,
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
} from "../constants/theme";
import { NAVIGATION_ROUTES } from "./auth/routes";

const { width } = Dimensions.get("window");

type RoleType = "user" | "guest" | "vendor";

interface RoleButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  backgroundColor: string;
  borderColor: string;
  onPress: () => void;
}

const RoleButton: React.FC<RoleButtonProps> = ({
  icon,
  title,
  subtitle,
  backgroundColor,
  borderColor,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.roleButton, { backgroundColor, borderColor }]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.roleContent}>
      <View style={[styles.roleIconContainer, { backgroundColor: borderColor + "20" }]}>
        {icon}
      </View>
      <View style={styles.roleTextContainer}>
        <Text style={styles.roleButtonTitle}>{title}</Text>
        <Text style={styles.roleButtonSubtitle}>{subtitle}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color={Colors.white} />
    </View>
  </TouchableOpacity>
);

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleRoleSelect = (role: RoleType) => {
    switch (role) {
      case "user":
        router.push(NAVIGATION_ROUTES.AUTH.USER_LOGIN);
        break;
      case "vendor":
        router.push(NAVIGATION_ROUTES.AUTH.VENDOR_LOGIN);
        break;
      case "guest":
        router.push(NAVIGATION_ROUTES.AUTH.GUEST_LOGIN);
        break;
    }
  };

  const handleSignup = () => {
    router.push(NAVIGATION_ROUTES.AUTH.USER_SIGNUP);
  };

  const handleVendorSignup = () => {
    router.push("/auth/vendor-signup");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header/Logo Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <FontAwesome5 name="calendar-alt" size={36} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.appName}>Khumya</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Events, Redefined.</Text>
          <Text style={styles.heroSubtitle}>
            The ultimate platform for seamless event planning and vendor
            discovery.
          </Text>
        </View>

        {/* Decorative Visual */}
        <View style={styles.decorativeContainer}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <Image
            source={require("../assets/images/splashScreen.png")}
            style={styles.decorativeImage}
            resizeMode="contain"
          />
        </View>

        {/* Role Selection Section */}
        <View style={styles.roleSection}>
          <Text style={styles.sectionTitle}>Select Your Role</Text>
          <Text style={styles.sectionSubtitle}>
            Choose how you want to use Khumya
          </Text>

          <View style={styles.roleButtonsContainer}>
            <RoleButton
              icon={<FontAwesome name="user" size={24} color={Colors.primary} />}
              title="User"
              subtitle="Browse & Book Events"
              backgroundColor={Colors.primary + "15"}
              borderColor={Colors.primary}
              onPress={() => handleRoleSelect("user")}
            />

            <RoleButton
              icon={<FontAwesome5 name="eye" size={22} color={Colors.info} />}
              title="Guest"
              subtitle="Explore Vendors (No Login)"
              backgroundColor={Colors.info + "15"}
              borderColor={Colors.info}
              onPress={() => handleRoleSelect("guest")}
            />

            <RoleButton
              icon={
                <MaterialIcons name="storefront" size={24} color={Colors.secondary} />
              }
              title="Vendor"
              subtitle="List Your Services"
              backgroundColor={Colors.secondary + "15"}
              borderColor={Colors.secondary}
              onPress={() => handleRoleSelect("vendor")}
            />
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupSection}>
          <Text style={styles.signupText}>New to Khumya?</Text>
          <TouchableOpacity onPress={handleSignup} activeOpacity={0.7}>
            <Text style={styles.signupLink}> Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Vendor Signup CTA */}
        <View style={styles.vendorCta}>
          <Text style={styles.vendorCtaText}>Are you a business? </Text>
          <TouchableOpacity onPress={handleVendorSignup} activeOpacity={0.7}>
            <Text style={styles.vendorCtaLink}>Become a Vendor</Text>
          </TouchableOpacity>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View
              style={[styles.featureIcon, { backgroundColor: Colors.primary + "15" }]}
            >
              <FontAwesome name="search" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.featureText}>Find Vendors</Text>
          </View>
          <View style={styles.featureItem}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: Colors.secondary + "15" },
              ]}
            >
              <FontAwesome5 name="calendar-check" size={16} color={Colors.secondary} />
            </View>
            <Text style={styles.featureText}>Plan Events</Text>
          </View>
          <View style={styles.featureItem}>
            <View
              style={[styles.featureIcon, { backgroundColor: Colors.success + "15" }]}
            >
              <FontAwesome name="star" size={16} color={Colors.success} />
            </View>
            <Text style={styles.featureText}>Read Reviews</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{" "}
            <Text
              style={styles.footerLink}
              onPress={() => Linking.openURL("#")}
            >
              Terms
            </Text>{" "}
            and{" "}
            <Text
              style={styles.footerLink}
              onPress={() => Linking.openURL("#")}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
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
  // Header/Logo
  headerSection: {
    alignItems: "center",
    marginTop: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.sm,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  appName: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  // Hero
  heroSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  heroTitle: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.md,
    lineHeight: Typography.fontSize["3xl"] * Typography.lineHeight.tight,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: "center",
    maxWidth: width - Spacing["2xl"] * 2,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  // Decorative
  decorativeContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    position: "relative",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + "08",
    top: -20,
    left: 20,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary + "08",
    bottom: -10,
    right: 30,
  },
  decorativeImage: {
    width: width * 0.4,
    height: 80,
    opacity: 0.6,
  },
  // Role Section
  roleSection: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  roleButtonsContainer: {
    gap: Spacing.md,
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    ...Shadows.base,
  },
  roleContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleButtonTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  roleButtonSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  // Signup
  signupSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
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
  // Vendor CTA
  vendorCta: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.base,
  },
  vendorCtaText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  vendorCtaLink: {
    fontSize: Typography.fontSize.sm,
    color: Colors.secondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  // Features
  featuresSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  featureText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  // Footer
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: 18,
  },
  footerLink: {
    color: Colors.primary,
  },
});

export default LandingPage;
