import { useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import {
  CategorySection,
  CTASection,
  EventInvitesCTA,
  FeaturedVendorSection,
  FooterSection,
  HeaderSection,
  HeroSection,
  HowItWorksSection,
  StatsSection,
} from "../components/home";

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, isVendor } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <HeaderSection />

        {/* Hero Section - Only show for non-authenticated users */}
        {!isAuthenticated && (
          <HeroSection
            isAuthenticated={isAuthenticated}
            onGetStarted={() => router.push("/auth/user-signup")}
            onVendorSignup={() => router.push("/auth/vendor-signup")}
            onExploreVendors={() => router.push("/(tabs)/explore")}
          />
        )}

        {/* Event Invites CTA - Show for authenticated users (User and Guest) */}
        {isAuthenticated && <EventInvitesCTA inviteCount={3} />}

        {/* Stats */}
        <StatsSection />

        {/* Categories Section */}
        <CategorySection />

        {/* Featured Vendors Section */}
        <FeaturedVendorSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* CTA Section - For non-vendors */}
        {!isVendor && (
          <CTASection onRegister={() => router.push("/auth/vendor-signup")} />
        )}

        {/* Footer */}
        <FooterSection />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
