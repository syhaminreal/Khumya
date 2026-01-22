import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Events With Ease</Text>

      <View style={styles.links}>
        <TouchableOpacity onPress={() => Linking.openURL("#")}>
          <Text style={styles.linkText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("#")}>
          <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("#")}>
          <Text style={styles.linkText}>Terms</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.copyText}>
        © {new Date().getFullYear()} Events with Ease. All rights reserved.
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0e0d0d",
    marginBottom: 10,
  },
  links: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  linkText: {
    color: "#111010",
    fontSize: 14,
  },
  copyText: {
    color: "#1c1a1a",
    fontSize: 12,
  },
});
