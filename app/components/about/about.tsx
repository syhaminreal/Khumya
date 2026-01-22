import React from "react";
import { View, Text, StyleSheet } from "react-native";

type AboutProps = {
  title?: string;       // optional, default title
  description?: string; // optional, default description
};

const About: React.FC<AboutProps> = ({
  title = "About Us",
  description = `Welcome to our Event Management App! 🎉
This platform is designed to make planning events hassle-free.
You can easily find vendors and various items likely needed for any event.
Whether you are organizing a wedding, birthday, corporate event, or a small gathering,
our app connects you to trusted vendors and streamlines the process,
saving your time and effort.
Explore, choose, and manage all your event needs from one place!`,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
  },
});
