import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Button, Card } from '../components/ui';
import { useAuth } from '../../context/AuthContext';
import { MOCK_CATEGORIES } from '../../types/mockData';

const { width } = Dimensions.get('window');

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, user, isVendor, logout } = useAuth();

  const categoryIcons: Record<string, string> = {
    'Photography': 'camera',
    'Catering': 'cutlery',
    'Decoration': 'paint-brush',
    'Venue': 'building',
    'Music & Entertainment': 'music',
    'Event Planning': 'calendar',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {isAuthenticated ? `Hello, ${user?.name?.split(' ')[0]}!` : 'Welcome!'}
            </Text>
            <Text style={styles.tagline}>Find perfect vendors for your events</Text>
          </View>
          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <FontAwesome name="user-circle" size={36} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/auth/user-login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Plan Your{'\n'}
              <Text style={styles.heroHighlight}>Perfect Event</Text>
            </Text>
            <Text style={styles.heroDescription}>
              Connect with trusted vendors for weddings, parties, corporate events, and more.
            </Text>
            <View style={styles.heroButtons}>
              {!isAuthenticated ? (
                <>
                  <Button
                    title="Get Started"
                    onPress={() => router.push('/auth/user-signup')}
                    size="md"
                  />
                  <Button
                    title="I'm a Vendor"
                    onPress={() => router.push('/auth/vendor-signup')}
                    variant="outline"
                    size="md"
                  />
                </>
              ) : (
                <Button
                  title="Explore Vendors"
                  onPress={() => router.push('/(tabs)/explore')}
                  size="md"
                  icon={<FontAwesome name="search" size={16} color={Colors.white} />}
                />
              )}
            </View>
          </View>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Vendors</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10k+</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {MOCK_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                activeOpacity={0.7}
              >
                <View style={styles.categoryIcon}>
                  <FontAwesome
                    name={categoryIcons[category.title] as any || 'star'}
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Vendors</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {[1, 2, 3].map((item) => (
              <Card key={item} style={styles.vendorCard} noPadding>
                <View style={styles.vendorImage}>
                  <View style={styles.vendorImagePlaceholder}>
                    <FontAwesome name="image" size={32} color={Colors.gray300} />
                  </View>
                  <View style={styles.vendorBadge}>
                    <FontAwesome name="star" size={10} color={Colors.warning} />
                    <Text style={styles.vendorRating}>4.9</Text>
                  </View>
                </View>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>Premium Studio {item}</Text>
                  <Text style={styles.vendorCategory}>Photography</Text>
                  <View style={styles.vendorLocation}>
                    <FontAwesome name="map-marker" size={12} color={Colors.gray400} />
                    <Text style={styles.vendorLocationText}>Kathmandu</Text>
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepIcon}>
                <FontAwesome name="search" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepTitle}>Search</Text>
              <Text style={styles.stepDescription}>Browse vendors by category</Text>
            </View>
            
            <View style={styles.stepConnector} />
            
            <View style={styles.stepItem}>
              <View style={styles.stepIcon}>
                <FontAwesome name="comments" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepTitle}>Connect</Text>
              <Text style={styles.stepDescription}>Contact & discuss details</Text>
            </View>
            
            <View style={styles.stepConnector} />
            
            <View style={styles.stepItem}>
              <View style={styles.stepIcon}>
                <FontAwesome name="check-circle" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepTitle}>Book</Text>
              <Text style={styles.stepDescription}>Confirm your booking</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        {!isAuthenticated && (
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Are you a vendor?</Text>
            <Text style={styles.ctaDescription}>
              Join our platform and reach thousands of potential clients
            </Text>
            <Button
              title="Register as Vendor"
              onPress={() => router.push('/auth/vendor-signup')}
              variant="secondary"
              size="lg"
              fullWidth
            />
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>Khumya</Text>
          <Text style={styles.footerTagline}>Events Made Easy</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerCopyright}>
            © {new Date().getFullYear()} Khumya. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
  },
  greeting: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  tagline: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileButton: {
    padding: Spacing.xs,
  },
  loginButton: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  loginButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semiBold,
    fontSize: Typography.fontSize.sm,
  },
  heroSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.gray50,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  heroContent: {
    marginBottom: Spacing.xl,
  },
  heroTitle: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 44,
  },
  heroHighlight: {
    color: Colors.primary,
  },
  heroDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    lineHeight: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.gray200,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  categoriesScroll: {
    paddingRight: Spacing.lg,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: Spacing.base,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  categoryTitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  featuredScroll: {
    paddingRight: Spacing.lg,
  },
  vendorCard: {
    width: 200,
    marginRight: Spacing.base,
    overflow: 'hidden',
  },
  vendorImage: {
    height: 120,
    backgroundColor: Colors.gray100,
    position: 'relative',
  },
  vendorImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  vendorRating: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  vendorInfo: {
    padding: Spacing.md,
  },
  vendorName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  vendorCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    marginTop: 2,
  },
  vendorLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  vendorLocationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  stepNumber: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  stepDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 4,
  },
  stepConnector: {
    width: 30,
    height: 2,
    backgroundColor: Colors.gray200,
    marginTop: 24,
  },
  ctaSection: {
    backgroundColor: Colors.secondary + '10',
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  ctaTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  ctaDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.gray50,
    marginTop: Spacing.lg,
  },
  footerLogo: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  footerTagline: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.base,
  },
  footerLink: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  footerCopyright: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
});
