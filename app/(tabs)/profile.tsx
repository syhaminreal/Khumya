import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
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
import { USER_ROUTES, NAVIGATION_ROUTES } from "../auth/routes";

const ProfilePage = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    vendor,
    isVendor,
    isGuest,
    invitedEvents,
    logout,
    fetchInvitedEvents,
    acceptEventInvite,
    declineEventInvite,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchInvitedEvents();
    }
  }, [isAuthenticated]);

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

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.notLoggedIn}>
          <View style={styles.iconContainer}>
            <FontAwesome name="user-circle" size={80} color={Colors.gray300} />
          </View>
          <Text style={styles.notLoggedInTitle}>Not Logged In</Text>
          <Text style={styles.notLoggedInText}>
            Sign in to access your profile and manage your account
          </Text>
          <View style={styles.authButtons}>
            <Button
              title="Sign In"
              onPress={() => router.push(USER_ROUTES.LOGIN)}
              fullWidth
              size="lg"
            />
            <Button
              title="Create Account"
              onPress={() => router.push(USER_ROUTES.SIGNUP)}
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
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome
                name={isVendor ? "briefcase" : "user"}
                size={40}
                color={Colors.white}
              />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <FontAwesome name="camera" size={12} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <FontAwesome
              name={isVendor ? "star" : "user"}
              size={12}
              color={isVendor ? Colors.secondary : Colors.primary}
            />
            <Text
              style={[styles.roleText, isVendor && { color: Colors.secondary }]}
            >
              {isVendor ? "Vendor" : "Client"}
            </Text>
          </View>
        </View>

        {/* Guest Event Invitations CTA */}
        {isGuest && invitedEvents.length > 0 && (
          <Card style={styles.guestCTACard}>
            <View style={styles.guestCTAHeader}>
              <View style={styles.guestCTAIcon}>
                <FontAwesome name="calendar-check-o" size={24} color={Colors.white} />
              </View>
              <View style={styles.guestCTATitleContainer}>
                <Text style={styles.guestCTATitle}>You're Invited! 🎉</Text>
                <Text style={styles.guestCTASubtitle}>
                  You've been invited to an event
                </Text>
              </View>
            </View>

            {invitedEvents
              .filter((inv) => inv.status === "pending")
              .map((invitation) => (
                <View key={invitation.eventId} style={styles.invitationCard}>
                  <View style={styles.invitationInfo}>
                    <Text style={styles.invitationEventTitle}>
                      {invitation.eventTitle}
                    </Text>
                    <View style={styles.invitationDetails}>
                      <FontAwesome
                        name="calendar"
                        size={14}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.invitationDetailText}>
                        {new Date(invitation.eventDate).toLocaleDateString()}
                      </Text>
                    </View>
                    {invitation.eventLocation && (
                      <View style={styles.invitationDetails}>
                        <FontAwesome
                          name="map-marker"
                          size={14}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.invitationDetailText}>
                          {invitation.eventLocation}
                        </Text>
                      </View>
                    )}
                    {invitation.organizerName && (
                      <View style={styles.invitationDetails}>
                        <FontAwesome
                          name="user"
                          size={14}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.invitationDetailText}>
                          Organized by {invitation.organizerName}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.invitationActions}>
                    <TouchableOpacity
                      style={[styles.invitationButton, styles.acceptButton]}
                      onPress={() => acceptEventInvite(invitation.eventId)}
                    >
                      <FontAwesome name="check" size={16} color={Colors.white} />
                      <Text style={styles.invitationButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.invitationButton, styles.declineButton]}
                      onPress={() => declineEventInvite(invitation.eventId)}
                    >
                      <FontAwesome name="times" size={16} color={Colors.error} />
                      <Text
                        style={[styles.invitationButtonText, { color: Colors.error }]}
                      >
                        Decline
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

            <View style={styles.guestCTAFooter}>
              <Text style={styles.guestCTAFooterText}>
                Or create your own event and invite others!
              </Text>
              <Button
                title="Create Event"
                onPress={() => router.push("/auth/createEvent")}
                variant="secondary"
                fullWidth
                style={{ marginTop: Spacing.sm }}
                icon={
                  <FontAwesome name="plus" size={16} color={Colors.white} />
                }
              />
            </View>
          </Card>
        )}

        {/* Quick Actions for Non-Vendors */}
        {!isVendor && (
          <Card style={styles.quickActionsCard}>
            <Text style={styles.quickActionsTitle}>Get Started</Text>
            <Text style={styles.quickActionsSubtitle}>
              Create your first event or explore vendors
            </Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => router.push("/auth/createEvent")}
              >
                <FontAwesome name="calendar-plus-o" size={24} color={Colors.primary} />
                <Text style={styles.quickActionText}>Create Event</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => router.push("/(tabs)/explore")}
              >
                <FontAwesome name="search" size={24} color={Colors.secondary} />
                <Text style={styles.quickActionText}>Explore Vendors</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Vendor Info (if vendor) */}
        {isVendor && vendor && (
          <Card title="Business Information" style={styles.section}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome name="building" size={16} color={Colors.gray400} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Business Name</Text>
                  <Text style={styles.infoValue}>{vendor.vendorName}</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome
                  name="map-marker"
                  size={16}
                  color={Colors.gray400}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>
                    {vendor.city}, {vendor.nation}
                  </Text>
                </View>
              </View>
            </View>
            {vendor.theme && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <FontAwesome
                    name="paint-brush"
                    size={16}
                    color={Colors.gray400}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Theme Specialty</Text>
                    <Text style={styles.infoValue}>{vendor.theme}</Text>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome
                  name="file-text"
                  size={16}
                  color={Colors.gray400}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{vendor.description}</Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome name="user" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <FontAwesome
              name="chevron-right"
              size={14}
              color={Colors.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome name="lock" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Change Password</Text>
            <FontAwesome
              name="chevron-right"
              size={14}
              color={Colors.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome name="bell" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <FontAwesome
              name="chevron-right"
              size={14}
              color={Colors.gray400}
            />
          </TouchableOpacity>

          {isVendor && (
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <FontAwesome name="cog" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.menuText}>Business Settings</Text>
              <FontAwesome
                name="chevron-right"
                size={14}
                color={Colors.gray400}
              />
            </TouchableOpacity>
          )}

          {!isVendor && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/auth/vendor-signup")}
            >
              <View style={[styles.menuIcon, { backgroundColor: Colors.secondary + "15" }]}>
                <FontAwesome name="briefcase" size={18} color={Colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>Become a Vendor</Text>
                <Text style={styles.menuSubtext}>Start offering your services</Text>
              </View>
              <FontAwesome
                name="chevron-right"
                size={14}
                color={Colors.gray400}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome
                name="question-circle"
                size={18}
                color={Colors.info}
              />
            </View>
            <Text style={styles.menuText}>Help Center</Text>
            <FontAwesome
              name="chevron-right"
              size={14}
              color={Colors.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome name="file-text-o" size={18} color={Colors.info} />
            </View>
            <Text style={styles.menuText}>Terms & Conditions</Text>
            <FontAwesome
              name="chevron-right"
              size={14}
              color={Colors.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <FontAwesome name="shield" size={18} color={Colors.info} />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <FontAwesome
              name="chevron-right"
              size={14}
              color={Colors.gray400}
            />
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

export default ProfilePage;

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
  menuSubtext: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
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
  
  // Guest CTA Styles
  guestCTACard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary + "08",
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  guestCTAHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  guestCTAIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  guestCTATitleContainer: {
    flex: 1,
  },
  guestCTATitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  guestCTASubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  guestCTAFooter: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  guestCTAFooterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  
  // Invitation Card Styles
  invitationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.base,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  invitationInfo: {
    marginBottom: Spacing.md,
  },
  invitationEventTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  invitationDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  invitationDetailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  invitationActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  invitationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.base,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: Colors.success,
  },
  declineButton: {
    backgroundColor: Colors.error + "15",
    borderWidth: 1,
    borderColor: Colors.error,
  },
  invitationButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  
  // Quick Actions Styles
  quickActionsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quickActionsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  quickActionsSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.base,
    ...Shadows.sm,
  },
  quickActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
});
