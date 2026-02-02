import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
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
import { useAuth } from "@/utils/AuthContext";

import {
  vendorService,
  cuisineService,
  Vendor,
  Cuisine,
} from "@/services/apiServices";
import { DUMMY_VENDORS, DUMMY_CUISINES } from "@/services/dummyData";

/* ================= CONFIG ================= */

const USE_DUMMY_DATA = true;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_HEIGHT = 280;

/* ================= COMPONENT ================= */

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const { user } = useAuth();
  const colors = Colors[scheme ?? "light"];
  const isDark = scheme === "dark";

  /* ================= STATE ================= */

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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
    const scale = interpolate(
      scrollY.value,
      [0, 300],
      [1, 1.2],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }],
    };
  });

  const decorCircle2Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollY.value, [0, 500], [0, -30]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  /* ================= DATA ================= */

  const fetchData = useCallback(async () => {
    try {
      if (USE_DUMMY_DATA) {
        await new Promise((r) => setTimeout(r, 600));
        setVendors(DUMMY_VENDORS);
        setCuisines(DUMMY_CUISINES);
        return;
      }

      const [vendorRes, cuisineRes] = await Promise.all([
        vendorService.getAll(),
        cuisineService.getAll(),
      ]);

      setVendors(vendorRes.data.data ?? []);
      setCuisines(cuisineRes.data.data ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  /* ================= MEMO ================= */

  const categories = useMemo(() => {
    const all = cuisines.map((c) => c.category);
    return ["All", ...new Set(all)];
  }, [cuisines]);

  const filteredVendors = useMemo(() => {
    const keyword = searchQuery.toLowerCase();

    return vendors.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(keyword) ||
        v.address.toLowerCase().includes(keyword);

      if (!selectedCategory) return matchSearch;

      const vendorCuisines = cuisines.filter((c) => c.vendor_id === v.id);

      return (
        matchSearch &&
        vendorCuisines.some((c) => c.category === selectedCategory)
      );
    });
  }, [vendors, cuisines, searchQuery, selectedCategory]);

  // Hidden Gems - Tempat tersembunyi dengan kualitas terbaik
  // Kriteria: Rating >= 4.5, Review < 100, atau di-flag sebagai hidden_gem
  const hiddenGems = useMemo(() => {
    return vendors
      .filter(
        (v) =>
          v.is_hidden_gem ||
          ((v.rating || 0) >= 4.5 && (v.reviews_count || 0) < 100),
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  }, [vendors]);

  // Restoran populer - Yang banyak review
  const popularVendors = useMemo(() => {
    return vendors
      .filter((v) => !v.is_hidden_gem && (v.reviews_count || 0) >= 100)
      .sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
  }, [vendors]);

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

  const renderCategory = ({ item, index }: { item: string; index: number }) => {
    const active =
      selectedCategory === item ||
      (item === "All" && selectedCategory === null);

    return (
      <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
        <TouchableOpacity
          onPress={() => setSelectedCategory(item === "All" ? null : item)}
          style={[
            styles.categoryChip,
            {
              backgroundColor: active
                ? colors.primary
                : isDark
                  ? colors.surface
                  : "#FFF",
              borderColor: active ? colors.primary : colors.border,
              shadowColor: active ? colors.primary : "#000",
            },
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: active ? "#FFF" : colors.text,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            {item}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHiddenGem = ({
    item,
    index,
  }: {
    item: Vendor;
    index: number;
  }) => {
    return (
      <Animated.View entering={FadeInRight.delay(index * 150).springify()}>
        <TouchableOpacity
          style={[styles.gemCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push(`/vendor/${item.id}` as any)}
          activeOpacity={0.9}
        >
          <View style={styles.gemImageWrap}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.gemImage} />
            ) : (
              <LinearGradient
                colors={[colors.primary, colors.tint]}
                style={styles.gemPlaceholder}
              >
                <FontAwesome name="cutlery" size={24} color="#FFF" />
              </LinearGradient>
            )}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.gemOverlay}
            />
            <View style={styles.gemBadge}>
              <MaterialCommunityIcons
                name="diamond-stone"
                size={12}
                color="#FFD700"
              />
              <Text style={styles.gemBadgeText}>Hidden Gem</Text>
            </View>
          </View>
          <View style={styles.gemInfo}>
            <Text
              style={[styles.gemName, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <View style={styles.gemRating}>
              <FontAwesome name="star" size={12} color="#FFD700" />
              <Text
                style={[styles.gemRatingText, { color: colors.textSecondary }]}
              >
                {item.rating || 4.5}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderVendor = ({ item, index }: { item: Vendor; index: number }) => {
    const cuisine =
      cuisines.find((c) => c.vendor_id === item.id)?.category ?? "General";

    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface }]}
          onPress={() => router.push(`/vendor/${item.id}` as any)}
          activeOpacity={0.9}
        >
          <View style={styles.cardImageWrap}>
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={styles.cardImage}
              />
            ) : (
              <LinearGradient
                colors={[colors.primary, colors.tint]}
                style={styles.placeholder}
              >
                <FontAwesome name="cutlery" size={32} color="#FFF" />
              </LinearGradient>
            )}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.cardGradient}
            />
            <View style={styles.ratingBadge}>
              <FontAwesome name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
            </View>
            <View style={styles.cardImageInfo}>
              <Text style={styles.cardImageTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.cardImageLocation}>
                <Ionicons name="location" size={14} color="#FFF" />
                <Text style={styles.cardImageAddress} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.tagsContainer}>
              <View
                style={[styles.tag, { backgroundColor: colors.secondPrimary }]}
              >
                <Ionicons name="restaurant" size={12} color={colors.primary} />
                <Text style={[styles.tagText, { color: colors.primary }]}>
                  {cuisine}
                </Text>
              </View>
              <View
                style={[
                  styles.tag,
                  { backgroundColor: isDark ? colors.surface : "#F0F0F0" },
                ]}
              >
                <Ionicons name="time" size={12} color={colors.textSecondary} />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  {item.opening_hours}
                </Text>
              </View>
              <View
                style={[
                  styles.tag,
                  { backgroundColor: isDark ? colors.surface : "#F0F0F0" },
                ]}
              >
                <Ionicons name="cash" size={12} color={colors.textSecondary} />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  {item.price_range}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.reviewCount}>
                <FontAwesome
                  name="comment"
                  size={12}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.reviewText, { color: colors.textSecondary }]}
                >
                  {item.reviews_count || 0} reviews
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => router.push(`/vendor/${item.id}` as any)}
              >
                <Text style={[styles.viewBtnText, { color: colors.primary }]}>
                  Lihat Detail
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
        contentContainerStyle={{ paddingBottom: 100 }}
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
            colors={
              isDark ? [colors.primary, "#0D9488"] : [colors.primary, "#14B8A6"]
            }
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
                    borderRadius: 100,
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
                    borderRadius: 60,
                  },
                ]}
              />
            </View>
            <View style={styles.decorCircle3} />

            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={styles.headerTop}
            >
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>Hidden Gems Finder</Text>
                <Text style={styles.title}>Temukan kuliner tersembunyi</Text>
              </View>

              <TouchableOpacity
                style={styles.profileBtn}
                onPress={() => router.push("/profile")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FFF", "#F5F5F5"]}
                  style={styles.profileBtnInner}
                >
                  {user?.avatar ? (
                    <Image
                      source={{ uri: user.avatar }}
                      style={styles.profileAvatar}
                    />
                  ) : (
                    <FontAwesome name="user" size={18} color={colors.primary} />
                  )}
                </LinearGradient>
              </TouchableOpacity>
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
                    borderColor: searchFocused ? colors.primary : "transparent",
                    borderWidth: 2,
                  },
                ]}
              >
                <Ionicons
                  name="search"
                  size={20}
                  color={searchFocused ? colors.primary : colors.textSecondary}
                />
                <TextInput
                  placeholder="Cari restoran, makanan..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  style={[styles.searchInput, { color: colors.text }]}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
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

        {/* ================= CATEGORIES ================= */}
        <Animated.FlatList
          horizontal
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(i) => i}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />

        {/* ================= HIDDEN GEMS SECTION ================= */}
        {hiddenGems.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrap}>
                <MaterialCommunityIcons
                  name="diamond-stone"
                  size={24}
                  color="#FFD700"
                />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Hidden Gems
                </Text>
              </View>
              <TouchableOpacity
                style={styles.seeAllBtn}
                onPress={() => router.push("/(tabs)/vendors")}
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  Lihat Semua
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
            >
              Tempat tersembunyi dengan kualitas terbaik
            </Text>

            <Animated.FlatList
              horizontal
              data={hiddenGems}
              renderItem={renderHiddenGem}
              keyExtractor={(i) => `gem-${i.id}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gemList}
            />
          </Animated.View>
        )}

        {/* ================= POPULAR SECTION ================= */}
        <Animated.View entering={FadeInUp.delay(400).springify()}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="flame" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Restoran Populer
              </Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={() => router.push("/(tabs)/vendors")}
            >
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                Lihat Semua
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
          >
            Restoran dengan ulasan dan rating terbaik
          </Text>
        </Animated.View>

        {filteredVendors.map((vendor, index) => (
          <View key={vendor.id}>{renderVendor({ item: vendor, index })}</View>
        ))}

        {filteredVendors.length === 0 && (
          <Animated.View
            entering={FadeInUp.springify()}
            style={styles.emptyState}
          >
            <MaterialCommunityIcons
              name="food-off"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Tidak ada hasil
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Coba kata kunci lain atau ubah filter
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

  /* Header */
  header: {
    marginBottom: 8,
  },

  headerGradient: {
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 20 : 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },

  decorCircle1: {
    position: "absolute",
    top: -80,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },

  decorCircle2: {
    position: "absolute",
    top: 40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },

  decorCircle3: {
    position: "absolute",
    bottom: -30,
    left: "40%",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  headerLeft: {
    flex: 1,
  },

  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -0.5,
  },

  profileBtn: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  profileBtnInner: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },

  profileAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
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
    height: 52,
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

  /* Categories */
  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },

  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
  },

  /* Sections */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },

  sectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    paddingBottom: 1,
  },

  sectionSubtitle: {
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 5,
  },

  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* Hidden Gems */
  gemList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },

  gemCard: {
    width: 160,
    borderRadius: 16,
    marginRight: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    overflow: "hidden",
  },

  gemImageWrap: {
    height: 120,
    position: "relative",
  },

  gemImage: {
    width: "100%",
    height: "100%",
  },

  gemPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  gemOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  gemBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },

  gemBadgeText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "700",
  },

  gemInfo: {
    padding: 12,
  },

  gemName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  gemRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  gemRatingText: {
    fontSize: 12,
    fontWeight: "600",
  },

  /* Vendor Cards */
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    overflow: "hidden",
  },

  cardImageWrap: {
    height: 180,
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  ratingBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },

  ratingText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },

  cardImageInfo: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },

  cardImageTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  cardImageLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  cardImageAddress: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    flex: 1,
  },

  cardBody: {
    padding: 16,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },

  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reviewCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  reviewText: {
    fontSize: 13,
    fontWeight: "500",
  },

  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  viewBtnText: {
    fontSize: 14,
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
