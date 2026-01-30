import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { Button, Card } from "../components/ui";

interface InviteEntry {
  id: number;
  type: "email" | "phone";
  value: string;
}

const InvitePage = () => {
  const [invites, setInvites] = useState<InviteEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [inputType, setInputType] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(
    "You're invited to join me on Khumya! Create amazing events together."
  );

  const validateInput = (value: string, type: string): boolean => {
    if (type === "email") {
      const emailRegex = /\S+@\S+\.\S+/;
      return emailRegex.test(value);
    } else {
      const phoneRegex = /^\d{10,15}$/;
      return phoneRegex.test(value.replace(/\D/g, ""));
    }
  };

  const addInvite = () => {
    if (!currentInput.trim()) {
      Alert.alert("Error", "Please enter an email or phone number");
      return;
    }

    if (!validateInput(currentInput, inputType)) {
      Alert.alert(
        "Invalid Input",
        inputType === "email"
          ? "Please enter a valid email address"
          : "Please enter a valid phone number (10-15 digits)"
      );
      return;
    }

    // Check for duplicates
    const isDuplicate = invites.some(
      (invite) =>
        invite.type === inputType &&
        invite.value.toLowerCase() === currentInput.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert("Duplicate", "This contact has already been added");
      return;
    }

    setInvites([
      ...invites,
      { id: Date.now(), type: inputType, value: currentInput.trim() },
    ]);
    setCurrentInput("");
  };

  const removeInvite = (id: number) => {
    setInvites(invites.filter((invite) => invite.id !== id));
  };

  const sendInvites = async () => {
    if (invites.length === 0) {
      Alert.alert("No Invites", "Please add at least one contact to invite");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const emails = invites
        .filter((inv) => inv.type === "email")
        .map((inv) => inv.value);
      const phones = invites
        .filter((inv) => inv.type === "phone")
        .map((inv) => inv.value);

      console.log("Sending invites:", { emails, phones, message: inviteMessage });

      Alert.alert(
        "Invites Sent! 🎉",
        `Successfully sent ${invites.length} invitation${invites.length > 1 ? "s" : ""}.`,
        [{ text: "OK", onPress: () => setInvites([]) }]
      );
    } catch (error) {
      console.error("Send invites error:", error);
      Alert.alert("Error", "Failed to send invites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickInvites = [
    { label: "Family Member", email: "family@example.com" },
    { label: "Best Friend", email: "friend@example.com" },
    { label: "Colleague", email: "colleague@example.com" },
  ];

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
            <Text style={styles.headerTitle}>Invite Friends</Text>
            <Text style={styles.headerSubtitle}>
              Share Khumya with your network and plan events together
            </Text>
          </View>

          {/* Stats Card */}
          <Card style={styles.statsCard}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.primary + "15" }]}>
                <FontAwesome name="users" size={20} color={Colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{invites.length}</Text>
                <Text style={styles.statLabel}>Invites Ready</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.success + "15" }]}>
                <FontAwesome name="check-circle" size={20} color={Colors.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Sent Today</Text>
              </View>
            </View>
          </Card>

          {/* Invite Method Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                inputType === "email" && styles.toggleButtonActive,
              ]}
              onPress={() => setInputType("email")}
            >
              <FontAwesome
                name="envelope"
                size={16}
                color={inputType === "email" ? Colors.white : Colors.gray400}
              />
              <Text
                style={[
                  styles.toggleText,
                  inputType === "email" && styles.toggleTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                inputType === "phone" && styles.toggleButtonActive,
              ]}
              onPress={() => setInputType("phone")}
            >
              <FontAwesome
                name="phone"
                size={16}
                color={inputType === "phone" ? Colors.white : Colors.gray400}
              />
              <Text
                style={[
                  styles.toggleText,
                  inputType === "phone" && styles.toggleTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <FontAwesome
                name={inputType === "email" ? "envelope" : "phone"}
                size={18}
                color={Colors.gray400}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder={
                  inputType === "email"
                    ? "Enter email address"
                    : "Enter phone number"
                }
                value={currentInput}
                onChangeText={setCurrentInput}
                keyboardType={inputType === "email" ? "email-address" : "phone-pad"}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.addButton} onPress={addInvite}>
                <FontAwesome name="plus" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Invite Suggestions */}
          {invites.length === 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Quick Invite</Text>
              <View style={styles.suggestionsList}>
                {quickInvites.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => {
                      setInputType("email");
                      setCurrentInput(suggestion.email);
                    }}
                  >
                    <FontAwesome name="user-o" size={14} color={Colors.primary} />
                    <Text style={styles.suggestionText}>{suggestion.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Added Invites List */}
          {invites.length > 0 && (
            <View style={styles.invitesList}>
              <Text style={styles.invitesListTitle}>
                Invites ({invites.length})
              </Text>
              {invites.map((invite) => (
                <View key={invite.id} style={styles.inviteItem}>
                  <View style={styles.inviteInfo}>
                    <View
                      style={[
                        styles.inviteIcon,
                        invite.type === "email"
                          ? { backgroundColor: Colors.primary + "15" }
                          : { backgroundColor: Colors.secondary + "15" },
                      ]}
                    >
                      <FontAwesome
                        name={invite.type === "email" ? "envelope" : "phone"}
                        size={14}
                        color={invite.type === "email" ? Colors.primary : Colors.secondary}
                      />
                    </View>
                    <View>
                      <Text style={styles.inviteValue}>{invite.value}</Text>
                      <Text style={styles.inviteType}>
                        {invite.type === "email" ? "Email" : "Phone"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeInvite(invite.id)}
                  >
                    <FontAwesome name="times" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Custom Message */}
          <Card style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <FontAwesome name="edit" size={16} color={Colors.primary} />
              <Text style={styles.messageTitle}>Custom Message (Optional)</Text>
            </View>
            <TextInput
              style={styles.messageInput}
              placeholder="Add a personal message to your invitation..."
              value={inviteMessage}
              onChangeText={setInviteMessage}
              multiline
              numberOfLines={3}
            />
          </Card>

          {/* Share Options */}
          <View style={styles.shareOptions}>
            <Text style={styles.shareOptionsTitle}>Or share via</Text>
            <View style={styles.shareIcons}>
              <TouchableOpacity style={styles.shareIcon}>
                <FontAwesome name="whatsapp" size={24} color="#25D366" />
                <Text style={styles.shareIconText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIcon}>
                <FontAwesome name="envelope-o" size={24} color={Colors.primary} />
                <Text style={styles.shareIconText}>Mail</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIcon}>
                <FontAwesome name="comment-o" size={24} color={Colors.secondary} />
                <Text style={styles.shareIconText}>SMS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIcon}>
                <FontAwesome name="copy" size={24} color={Colors.gray500} />
                <Text style={styles.shareIconText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Send Button */}
          <Button
            title={invites.length > 0 ? `Send ${invites.length} Invite${invites.length > 1 ? "s" : ""}` : "Add Contacts to Invite"}
            onPress={sendInvites}
            loading={loading}
            disabled={invites.length === 0 || loading}
            fullWidth
            size="lg"
            style={{ marginTop: Spacing.lg }}
          />

          {/* Referral Code */}
          <View style={styles.referralSection}>
            <Text style={styles.referralTitle}>Your Referral Code</Text>
            <View style={styles.referralCodeContainer}>
              <Text style={styles.referralCode}>KHM-2024-ABC</Text>
              <TouchableOpacity
                style={styles.copyReferralButton}
                onPress={() => {
                  Alert.alert("Copied!", "Referral code copied to clipboard");
                }}
              >
                <FontAwesome name="copy" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.referralHint}>
              Share your code and earn rewards when friends join!
            </Text>
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
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.base,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.base,
    padding: 4,
    marginBottom: Spacing.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray400,
    fontWeight: Typography.fontWeight.medium,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionsContainer: {
    marginBottom: Spacing.md,
  },
  suggestionsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  suggestionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  suggestionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
  },
  invitesList: {
    marginBottom: Spacing.md,
  },
  invitesListTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  inviteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.sm,
  },
  inviteInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inviteIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  inviteValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  inviteType: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  removeButton: {
    padding: Spacing.sm,
  },
  messageCard: {
    marginBottom: Spacing.md,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  messageTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  messageInput: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    textAlignVertical: "top",
  },
  shareOptions: {
    marginBottom: Spacing.lg,
  },
  shareOptionsTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  shareIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xl,
  },
  shareIcon: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  shareIconText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  referralSection: {
    alignItems: "center",
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.primary + "10",
    borderRadius: BorderRadius.lg,
  },
  referralTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  referralCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.base,
    gap: Spacing.sm,
  },
  referralCode: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  copyReferralButton: {
    padding: Spacing.xs,
  },
  referralHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
});

export default InvitePage;
