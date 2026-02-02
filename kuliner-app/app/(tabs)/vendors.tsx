import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
  TextInput,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  withSpring,
} from "react-native-reanimated";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { vendorService, Vendor } from "@/services/apiServices";
import { dummyService } from "@/services/dummyData";

const USE_DUMMY_DATA = true;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 2;
const HEADER_HEIGHT = 200;

export default function VendorsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const isDark = scheme === "dark";

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showOnlyGems, setShowOnlyGems] = useState(false);

  /* ================= ANIMATION VALUES ================= */
  const scrollY = useSharedValue(0);
  const searchScale = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  /* ================= ANIMATED STYLES ================= */
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.6],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [1, 0.9],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  const searchBoxAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: searchScale.value }],
    };
  });

  const decorCircle1Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollY.value, [0, 500], [0, 45]);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  const decorCircle2Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollY.value, [0, 500], [0, -30]);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  /* ================= DATA ================= */
  const fetchVendors = async () => {
    try {
      if (USE_DUMMY_DATA) {
        const response = await dummyService.getAllVendors();
        setVendors(response.data.data || []);
      } else {
        const response = await vendorService.getAll();
        setVendors(response.data.data || []);
      }
    } catch (error: any) {
      Alert.alert("Error", "Gagal memuat data vendor.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendors();
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const matchesGemFilter = showOnlyGems ? v.is_hidden_gem : true;
    return matchesSearch && matchesGemFilter;
  });

  /* ================= HANDLERS ================= */
  const handleSearchFocus = () => {
    setSearchFocused(true);
    searchScale.value = withSpring(1.02, { damping: 15 });
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    searchScale.value = withSpring(1, { damping: 15 });
  };

  /* ================= RENDER ================= */
  const renderVendorCard = ({
    item,
    index,
  }: {
    item: Vendor;
    index: number;
  }) => (
    <Animated.View entering={FadeInUp.delay(index * 80).springify()}>
      <TouchableOpacity
        style={[styles.vendorCard, { backgroundColor: colors.surface }]}
        activeOpacity={0.9}
        onPress={() => router.push(`/vendor/${item.id}` as any)}
      >
        <View style={styles.cardImageWrap}>
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={styles.vendorImage}
            />
          ) : (
            <LinearGradient
              colors={[colors.primary, colors.tint]}
              style={styles.placeholderImage}
            >
              <FontAwesome name="cutlery" size={32} color="#FFF" />
            </LinearGradient>
          )}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.cardOverlay}
          />
          {/* Hidden Gem Badge */}
          {item.is_hidden_gem && (
            <View style={styles.gemBadge}>
              <MaterialCommunityIcons
                name="diamond-stone"
                size={12}
                color="#FFD700"
              />
              <Text style={styles.gemBadgeText}>Gem</Text>
            </View>
          )}
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating ? item.rating.toFixed(1) : "4.5"}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text
            style={[styles.vendorName, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={12} color={colors.textSecondary} />
            <Text
              style={[styles.vendorAddress, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.address}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.reviewCount}>
              <Ionicons
                name="chatbubble-outline"
                size={12}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.reviewCountText,
                  { color: colors.textSecondary },
                ]}
              >
                {item.reviews_count || 0}
              </Text>
            </View>
            <View
              style={[
                styles.priceBadge,
                { backgroundColor: colors.secondPrimary },
              ]}
            >
              <Text style={[styles.priceText, { color: colors.primary }]}>
                {item.price_range}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* ================= HEADER ================= */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <LinearGradient
            colors={isDark ? ["#10B981", "#059669"] : ["#10B981", "#34D399"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            {/* Decorative Elements - Wrapped to avoid Reanimated transform conflict */}
            <View style={styles.decorCircle1}>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  decorCircle1Style,
                  {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 80,
                  },
                ]}
              />
            </View>
            <View style={styles.decorCircle2}>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  decorCircle2Style,
                  {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 50,
                  },
                ]}
              />
            </View>

            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <View style={styles.headerTitleWrap}>
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={28}
                  color="#FFF"
                />
                <Text style={styles.headerTitle}>Jelajahi Tempat</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                {vendors.filter((v) => v.is_hidden_gem).length} Hidden Gems dari{" "}
                {vendors.length} tempat
              </Text>
            </Animated.View>

            {/* Search Box */}
            <Animated.View
              entering={FadeInUp.delay(200).springify()}
              style={[styles.searchContainer, searchBoxAnimatedStyle]}
            >
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: isDark ? colors.surface : "#FFF",
                    borderColor: searchFocused ? "#10B981" : "transparent",
                    borderWidth: 2,
                  },
                ]}
              >
                <Ionicons
                  name="search"
                  size={20}
                  color={searchFocused ? "#10B981" : colors.textSecondary}
                />
                <TextInput
                  placeholder="Cari restoran..."
                  placeholderTextColor={colors.textSecondary}
                  value={search}
                  onChangeText={setSearch}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  style={[styles.searchInput, { color: colors.text }]}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch("")}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* ================= FILTER & GRID ================= */}
        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {filteredVendors.length} Tempat Ditemukan
            </Text>
            <TouchableOpacity
              style={[
                styles.gemFilterBtn,
                showOnlyGems && {
                  backgroundColor: "#FFD70020",
                  borderColor: "#FFD700",
                },
                !showOnlyGems && { borderColor: colors.border },
              ]}
              onPress={() => setShowOnlyGems(!showOnlyGems)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="diamond-stone"
                size={16}
                color={showOnlyGems ? "#FFD700" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.gemFilterText,
                  { color: showOnlyGems ? "#DAA520" : colors.textSecondary },
                ]}
              >
                Hidden Gems
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.gridContainer}>
          {filteredVendors.map((vendor, index) => (
            <View key={vendor.id}>
              {renderVendorCard({ item: vendor, index })}
            </View>
          ))}
        </View>

        {filteredVendors.length === 0 && (
          <Animated.View
            entering={FadeInUp.springify()}
            style={styles.emptyState}
          >
            <MaterialCommunityIcons
              name="diamond-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {showOnlyGems
                ? "Belum ada Hidden Gems"
                : "Tidak ada tempat ditemukan"}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              {showOnlyGems
                ? "Coba nonaktifkan filter Hidden Gems"
                : "Coba kata kunci lain"}
            </Text>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: "600",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  /* Header */
  header: {
    marginBottom: 8,
  },

  headerGradient: {
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 20 : 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },

  decorCircle1: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
  },

  decorCircle2: {
    position: "absolute",
    bottom: -20,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },

  headerTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFF",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 20,
  },

  /* Search */
  searchContainer: {
    marginTop: 8,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },

  /* Section */
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  gemFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },

  gemFilterText: {
    fontSize: 12,
    fontWeight: "600",
  },

  /* Grid */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },

  vendorCard: {
    width: CARD_WIDTH,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    overflow: "hidden",
  },

  cardImageWrap: {
    height: 120,
    position: "relative",
  },

  vendorImage: {
    width: "100%",
    height: "100%",
  },

  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },

  gemBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },

  gemBadgeText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "700",
  },

  ratingText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  cardContent: {
    padding: 12,
  },

  vendorName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },

  vendorAddress: {
    fontSize: 11,
    flex: 1,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reviewCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  reviewCountText: {
    fontSize: 11,
    fontWeight: "500",
  },

  priceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  priceText: {
    fontSize: 11,
    fontWeight: "700",
  },

  /* Empty State */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  emptySubtitle: {
    fontSize: 14,
  },
});
