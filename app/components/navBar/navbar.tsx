
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type NavbarProps = {
  isLoggedIn: boolean;      // controls login/logout
  onLogout?: () => void;     // optional logout handler
};

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/login/vendor")}
          >
            <Text style={styles.buttonText}>Login as Vendor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.userButton]}
            onPress={() => router.push("/login/user")}
          >
            <Text style={styles.buttonText}>Login as User</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  userButton: {
    backgroundColor: "#34C759",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
