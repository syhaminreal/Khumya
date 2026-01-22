import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Slider from "../components/slider/slider";
import Navbar from "../components/navBar/navbar";
import About from "../components/about/about";
import Footer from "../components/footer/footer";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Dynamic Navbar */}
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Slider below */}
      <View style={styles.sliderContainer}>
        <Slider />
      </View>

      {/* About section as reusable component */}
      <About />

      <Footer />
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sliderContainer: {
    flex: 1,
    marginTop: 20,
  },
});
