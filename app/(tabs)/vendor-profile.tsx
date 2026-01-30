import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
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
import { Button, Card } from "../components/ui";
import { VENDOR_ROUTES, NAVIGATION_ROUTES } from "../auth/routes";

const VendorProfilePage = () => {
  const router = useRouter();
  const { isAuthenticated, user, vendor, isVendor, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(tabs)" as any);
        },
      },
    ]);
  };

  // If not authenticated or not a vendor, show not logged in state
  if (!isAuthenticated || !isVendor) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.notLoggedIn}>
          <View style={styles.iconContainer}>
            <FontAwesome name="briefcase" size={80} color={Colors.gray300} />
          </View>
          <Text style={styles.notLoggedInTitle}>Vendor Access Only</Text>
          <Text style={styles.notLoggedInText}>
            Sign in as a vendor to access your business profile
          </Text>
          <View style={styles.authButtons}>
            <Button
              title="Vendor Login"
              onPress={() => router.push(VENDOR_ROUTES.LOGIN)}
              fullWidth
              size="lg"
              variant="secondary"
            />
            <Button
              title="Create Vendor Account"
              onPress={() => router.push(VENDOR_ROUTES.SIGNUP)}
              variant="outline"
              fullWidth
              size="lg"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vendor Dashboard</Text>
        </View>

        {/* Vendor Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: Colors.secondary }]}>
              <FontAwesome name="briefcase" size={40} color={Colors.white} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <FontAwesome name="camera" size={12} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{vendor?.vendorName || user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: Colors.secondary + "15" }]}>
            <FontAwesome name="star" size={12} color={Colors.secondary} />
            <Text style={[styles.roleText, { color: Colors.secondary }]}>
              Verified Vendor
            </Text>
          </View>
        </View>

        {/* Business Information */}
        <Card title="Business Information" style={styles.section}>
          {vendor?.vendorName && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome name="building" size={16} color={Colors.gray400} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Business Name</Text>
                  <Text style={styles.infoValue}>{vendor.vendorName}</Text>
                </View>
              </View>
            </View>
          )}

          {vendor?.description && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome name="file-text" size={16} color={Colors.gray400} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{vendor.description}</Text>
                </View>
              </View>
            </View>
          )}

          {(vendor?.city || vendor?.nation) && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome name="map-marker" size={16} color={Colors.gray400} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>
                    {vendor.city}, {vendor.nation}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {vendor?.space && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome name="expand" size={16} color={Colors.gray400} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Space / Capacity</Text>
                  <Text style={styles.infoValue}>{vendor.space}</Text>
                </View>
              </View>
            </View>
          )}

          {vendor?.theme && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome name="paint-brush" size={16} color={Colors.gray400} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Theme Specialty</Text>
                  <Text style={styles.infoValue}>{vendor.theme}</Text>
                </View>
              </View>
            </View>
          )}

          {vendor?.culture && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome name="globe" size={16} color={Colors.gray400} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Culture / Style</Text>
                  <Text style={styles.infoValue}>{vendor.culture}</Text>
                </View>
              </View>
            </View>
          )}
        </Card>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Management</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.secondary + "15" }]}>
              <FontAwesome name="edit" size={18} color={Colors.secondary} />
            </View>
            <Text style={styles.menuText}>Edit Business Profile</Text>
            <FontAwesome name="chevron-right" size={14} color={Colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.secondary + "15" }]}>
              <FontAwesome name="calendar" size={18} color={Colors.secondary} />
            </View>
            <Text style={styles.menuText}>Manage Bookings</Text>
            <FontAwesome name="chevron-right" size={14} color={Colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.secondary + "15" }]}>
              <FontAwesome name="image" size={18} color={Colors.secondary} />
            </View>
            <Text style={styles.menuText}>Portfolio Gallery</Text>
            <FontAwesome name="chevron-right" size={14} color={Colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.secondary + "15" }]}>
              <FontAwesome name="cog" size={18} color={Colors.secondary} />
            </View>
            <Text style={styles.menuText}>Business Settings</Text>
            <FontAwesome name="chevron-right" size={14} color={Colors.gray400} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome name="question-circle" size={18} color={Colors.info} />
            </View>
            <Text style={styles.menuText}>Help Center</Text>
            <FontAwesome name="chevron-right" size={14} color={Colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome name="file-text-o" size={18} color={Colors.info} />
            </View>
            <Text style={styles.menuText}>Terms & Conditions</Text>
            <FontAwesome name="chevron-right" size={14} color={Colors.gray400} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome name="shield" size={18} color={Colors.info} />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <FontAwesome name="chevron-right" size={14} color={Colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            icon={
              <FontAwesome name="sign-out" size={18} color={Colors.white} />
            }
          />
        </View>

        {/* App Version */}
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  notLoggedInTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  notLoggedInText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  authButtons: {
    width: "100%",
    gap: Spacing.md,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
  },
  headerTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Spacing.base,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary + "15",
    borderRadius: BorderRadius.full,
  },
  roleText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  section: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  infoRow: {
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  logoutSection: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
  },
  appVersion: {
    textAlign: "center",
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
});
