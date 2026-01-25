import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
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
import { CITIES, MOCK_CATEGORIES } from "../../types/mockData";
import { Card, Select } from "../components/ui";

// Mock vendor data for display
const MOCK_VENDORS = [
  {
    id: 1,
    vendorName: "Royal Photography",
    category: "Photography",
    city: "Kathmandu",
    rating: 4.9,
    reviews: 128,
    description: "Professional wedding and event photography services",
    priceRange: "$$$",
  },
  {
    id: 2,
    vendorName: "Divine Catering",
    category: "Catering",
    city: "Pokhara",
    rating: 4.8,
    reviews: 95,
    description: "Authentic Nepali and international cuisine for all events",
    priceRange: "$$",
  },
  {
    id: 3,
    vendorName: "Elegant Decor",
    category: "Decoration",
    city: "Lalitpur",
    rating: 4.7,
    reviews: 76,
    description: "Transform your venue into a magical space",
    priceRange: "$$",
  },
  {
    id: 4,
    vendorName: "Grand Venue Hall",
    category: "Venue",
    city: "Kathmandu",
    rating: 4.9,
    reviews: 203,
    description: "Premium event venue with modern amenities",
    priceRange: "$$$",
  },
  {
    id: 5,
    vendorName: "Beat Masters DJ",
    category: "Music & Entertainment",
    city: "Bhaktapur",
    rating: 4.6,
    reviews: 54,
    description: "Professional DJ and live music for your events",
    priceRange: "$$",
  },
];

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const categoryIcons: Record<string, string> = {
    Photography: "camera",
    Catering: "cutlery",
    Decoration: "paint-brush",
    Venue: "building",
    "Music & Entertainment": "music",
    "Event Planning": "calendar",
  };

  const filteredVendors = MOCK_VENDORS.filter((vendor) => {
    const matchesSearch =
      vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || vendor.category === selectedCategory;
    const matchesCity = !selectedCity || vendor.city === selectedCity;
    return matchesSearch && matchesCategory && matchesCity;
  });

  const renderVendorCard = ({ item }: { item: (typeof MOCK_VENDORS)[0] }) => (
    <Card style={styles.vendorCard} noPadding>
      <View style={styles.vendorImageContainer}>
        <View style={styles.vendorImagePlaceholder}>
          <FontAwesome
            name={(categoryIcons[item.category] as any) || "star"}
            size={40}
            color={Colors.gray300}
          />
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{item.priceRange}</Text>
        </View>
      </View>
      <View style={styles.vendorContent}>
        <View style={styles.vendorHeader}>
          <Text style={styles.vendorName}>{item.vendorName}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={12} color={Colors.warning} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>
        </View>
        <View style={styles.vendorMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={12} color={Colors.gray400} />
            <Text style={styles.locationText}>{item.city}</Text>
          </View>
        </View>
        <Text style={styles.vendorDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <FontAwesome name="arrow-right" size={12} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Vendors</Text>
        <Text style={styles.headerSubtitle}>
          Find the perfect vendor for your event
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={18} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vendors..."
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <FontAwesome
                name="times-circle"
                size={18}
                color={Colors.gray400}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedCategory && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory("")}
          >
            <Text
              style={[
                styles.filterChipText,
                !selectedCategory && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {MOCK_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterChip,
                selectedCategory === category.title && styles.filterChipActive,
              ]}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === category.title ? "" : category.title,
                )
              }
            >
              <FontAwesome
                name={(categoryIcons[category.title] as any) || "star"}
                size={12}
                color={
                  selectedCategory === category.title
                    ? Colors.white
                    : Colors.textSecondary
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category.title &&
                    styles.filterChipTextActive,
                ]}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* City Filter */}
      <View style={styles.cityFilterContainer}>
        <Select
          placeholder="All Cities"
          options={[
            { label: "All Cities", value: "" },
            ...CITIES.map((c) => ({ label: c, value: c })),
          ]}
          value={selectedCity}
          onChange={setSelectedCity}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredVendors.length} vendors found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <FontAwesome name="sort" size={14} color={Colors.textSecondary} />
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Vendor List */}
      <FlatList
        data={filteredVendors}
        renderItem={renderVendorCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.vendorList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FontAwesome name="search" size={48} color={Colors.gray300} />
            <Text style={styles.emptyStateTitle}>No vendors found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ExplorePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  filtersContainer: {
    paddingLeft: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
  },
  cityFilterContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  resultsCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sortText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  vendorList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  vendorCard: {
    marginBottom: Spacing.base,
    overflow: "hidden",
  },
  vendorImageContainer: {
    height: 140,
    backgroundColor: Colors.gray100,
    position: "relative",
  },
  vendorImagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  priceTag: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  priceText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.success,
  },
  vendorContent: {
    padding: Spacing.base,
  },
  vendorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  vendorName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  reviewCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  vendorMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + "15",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  vendorDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    marginTop: Spacing.xs,
  },
  viewButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.base,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
