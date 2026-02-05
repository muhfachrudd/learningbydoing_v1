import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Linking,
  StatusBar,
  Dimensions,
  ScrollView as RNScrollView,
  ActivityIndicator,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useTheme } from "@/utils/ThemeContext";
import {
  vendorService,
  cuisineService,
  Vendor,
  Cuisine,
} from "@/services/apiServices";
import { dummyService } from "@/services/dummyData";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 350;
const USE_DUMMY_DATA = true;

export const options = {
  headerShown: false,
};

export default function VendorDetailScreen() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [menuSectionY, setMenuSectionY] = useState(0);
  const scrollViewRef = useRef<any>(null);
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleViewMenu = () => {
    if (cuisines.length === 0) {
      Alert.alert("Menu", "Menu belum tersedia untuk tempat ini.");
      return;
    }
    // Scroll to menu section
    scrollViewRef.current?.scrollTo({ y: menuSectionY - 100, animated: true });
  };

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    // Keep header image completely static - no movement
    return {
      opacity: 1,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    // Removed transform to avoid Reanimated warning about
    // layout animations overwriting transform
    return {};
  });

  const fetchVendorData = async () => {
    try {
      if (!id) return;

      const vendorId = parseInt(id as string);

      if (USE_DUMMY_DATA) {
        const [vendorResponse, cuisinesResponse] = await Promise.all([
          dummyService.getVendorById(vendorId),
          dummyService.getAllCuisines(),
        ]);

        setVendor(vendorResponse.data.data || null);
        const allCuisines = cuisinesResponse.data.data || [];
        setCuisines(allCuisines.slice(0, 5));
      } else {
        const [vendorResponse, cuisinesResponse] = await Promise.all([
          vendorService.getById(vendorId),
          cuisineService.getAll(),
        ]);

        setVendor(vendorResponse.data.data);
        const allCuisines = cuisinesResponse.data.data || [];
        setCuisines(allCuisines.slice(0, 5));
      }
    } catch (error: any) {
      console.error("Error fetching vendor data:", error);
      Alert.alert("Error", "Gagal memuat data vendor.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVendorData();
  }, []);

  const handleCall = () => {
    if (vendor?.contact) {
      Linking.openURL(`tel:${vendor.contact}`);
    }
  };

  const handleOpenMaps = () => {
    if (vendor?.latitude && vendor?.longitude) {
      const url = `https://maps.google.com/?q=${vendor.latitude},${vendor.longitude}`;
      Linking.openURL(url);
    } else if (vendor?.address) {
      const url = `https://maps.google.com/?q=${encodeURIComponent(vendor.address)}`;
      Linking.openURL(url);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!vendor) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient
              colors={["#FEE2E2", "#FECACA"]}
              style={styles.errorIconContainer}
            >
              <FontAwesome
                name="exclamation-triangle"
                size={50}
                color="#EF4444"
              />
            </LinearGradient>
          </Animated.View>
          <Animated.Text
            entering={FadeInDown.delay(200)}
            style={[styles.errorText, { color: colors.text }]}
          >
            Vendor tidak ditemukan
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(300)}>
            <TouchableOpacity
              style={[
                styles.errorBackButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => router.back()}
            >
              <Text style={styles.errorBackButtonText}>Kembali</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.headerImageContainer, headerAnimatedStyle]}>
        {vendor.image_url ? (
          <Image
            source={{ uri: vendor.image_url }}
            style={styles.headerImage}
          />
        ) : (
          <LinearGradient
            colors={[colors.primary, "#FF8533"]}
            style={[styles.headerImage, styles.headerPlaceholder]}
          >
            <FontAwesome
              name="cutlery"
              size={80}
              color="rgba(255,255,255,0.3)"
            />
          </LinearGradient>
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.headerGradient}
        />

        <Animated.View
          entering={FadeInUp.delay(300)}
          style={styles.decorCircle1}
        />
        <Animated.View
          entering={FadeInUp.delay(400)}
          style={styles.decorCircle2}
        />
      </Animated.View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shareButton}
        onPress={() =>
          Alert.alert(
            "Share",
            `Bagikan ${vendor?.name || "restoran ini"} ke teman!`,
          )
        }
      >
        <Ionicons name="share-social-outline" size={22} color="#FFF" />
      </TouchableOpacity>

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Animated.View
          style={[
            styles.contentContainer,
            { backgroundColor: colors.background },
            contentAnimatedStyle,
          ]}
        >
          <View style={styles.indicatorPill} />

          <Animated.View
            entering={FadeInUp.delay(100)}
            style={styles.vendorHeader}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.vendorName, { color: colors.text }]}>
                {vendor.name}
              </Text>
              <View style={styles.badgeRow}>
                {vendor.is_hidden_gem && (
                  <View
                    style={[
                      styles.hiddenGemBadge,
                      { backgroundColor: colors.surfaceSecondary },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="diamond-stone"
                      size={12}
                      color="#FFD700"
                    />
                    <Text style={styles.hiddenGemText}>Hidden Gem</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: colors.surfaceSecondary },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="silverware-fork-knife"
                    size={12}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.categoryText, { color: colors.primary }]}
                  >
                    Restoran
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.openBadge,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(16, 185, 129, 0.15)"
                      : "#D1FAE5",
                },
              ]}
            >
              <View style={styles.openDot} />
              <Text style={styles.openText}>Buka</Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(200)}
            style={[
              styles.statsRow,
              {
                backgroundColor: colors.surface,
              },
            ]}
          >
            <View style={styles.statItem}>
              <View style={styles.ratingBadge}>
                <FontAwesome name="star" size={12} color="#FFF" />
                <Text style={styles.ratingValue}>
                  {vendor.rating?.toFixed(1) || "4.5"}
                </Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {vendor.reviews_count || 128} ulasan
              </Text>
            </View>

            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />

            <View style={styles.statItem}>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                20-30 min
              </Text>
            </View>

            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="cash"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {vendor.price_range || "Rp 20-50k"}
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(300)}
            style={styles.actionRow}
          >
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={handleOpenMaps}
            >
              <Ionicons name="navigate" size={20} color="#FFF" />
              <Text style={styles.actionBtnText}>Petunjuk Arah</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.actionBtnOutline,
                { borderColor: colors.primary },
              ]}
              onPress={handleCall}
            >
              <Ionicons name="call" size={20} color={colors.primary} />
              <Text
                style={[styles.actionBtnTextOutline, { color: colors.primary }]}
              >
                Telepon
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400)}
            style={styles.infoSection}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Informasi
            </Text>

            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <View style={styles.infoRow}>
                <View
                  style={[
                    styles.infoIconContainer,
                    {
                      backgroundColor: colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name="location"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  >
                    Alamat
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {vendor.address}
                  </Text>
                </View>
              </View>

              <View
                style={[styles.infoDivider, { backgroundColor: colors.border }]}
              />

              <View style={styles.infoRow}>
                <View
                  style={[
                    styles.infoIconContainer,
                    {
                      backgroundColor: colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name="time"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  >
                    Jam Operasional
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {vendor.opening_hours || "08:00 - 22:00"}
                  </Text>
                </View>
              </View>

              {vendor.contact && (
                <>
                  <View
                    style={[
                      styles.infoDivider,
                      { backgroundColor: colors.border },
                    ]}
                  />
                  <View style={styles.infoRow}>
                    <View
                      style={[
                        styles.infoIconContainer,
                        {
                          backgroundColor: colors.surfaceSecondary,
                        },
                      ]}
                    >
                      <Ionicons
                        name="call"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </View>
                    <View style={styles.infoContent}>
                      <Text
                        style={[
                          styles.infoLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Kontak
                      </Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {vendor.contact}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(500)}
            style={styles.menuSection}
            onLayout={(event) =>
              setMenuSectionY(event.nativeEvent.layout.y + HEADER_HEIGHT - 40)
            }
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Menu Populer
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Menu", "Fitur lihat semua menu segera hadir!")
                }
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  Lihat Semua
                </Text>
              </TouchableOpacity>
            </View>

            {cuisines.length > 0 ? (
              <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.menuList}
              >
                {cuisines.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInRight.delay(100 * index)}
                  >
                    <TouchableOpacity
                      style={[
                        styles.menuCard,
                        {
                          backgroundColor: colors.surface,
                        },
                      ]}
                      onPress={() => router.push(`/cuisine/${item.id}` as any)}
                    >
                      {item.image_url ? (
                        <Image
                          source={{ uri: item.image_url }}
                          style={styles.menuImage}
                        />
                      ) : (
                        <View
                          style={[
                            styles.menuImage,
                            styles.menuPlaceholder,
                            {
                              backgroundColor: colors.surfaceSecondary,
                            },
                          ]}
                        >
                          <FontAwesome
                            name="cutlery"
                            size={24}
                            color={colors.textSecondary}
                          />
                        </View>
                      )}
                      <View style={styles.menuContent}>
                        <Text
                          style={[styles.menuName, { color: colors.text }]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.menuCategory,
                            { color: colors.textSecondary },
                          ]}
                          numberOfLines={1}
                        >
                          {item.category}
                        </Text>
                        <Text
                          style={[styles.menuPrice, { color: colors.text }]}
                        >
                          Rp {item.price?.toLocaleString("id-ID") || "0"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </RNScrollView>
            ) : (
              <View
                style={[
                  styles.emptyMenu,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <MaterialCommunityIcons
                  name="food-off"
                  size={40}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.emptyMenuText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Belum ada menu tersedia
                </Text>
              </View>
            )}
          </Animated.View>

          <View style={{ height: 120 }} />
        </Animated.View>
      </Animated.ScrollView>

      <Animated.View
        entering={FadeInUp.delay(600)}
        style={[
          styles.bottomBar,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={toggleFavorite}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={22}
            color={isFavorite ? "#FFF" : colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.orderButton, { backgroundColor: colors.primary }]}
          onPress={handleViewMenu}
        >
          <Text style={styles.orderButtonText}>Lihat Menu Lengkap</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 0,
  },
  headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  headerPlaceholder: { justifyContent: "center", alignItems: "center" },
  headerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  decorCircle1: {
    position: "absolute",
    top: 60,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorCircle2: {
    position: "absolute",
    top: 120,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  shareButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollContent: { paddingTop: HEADER_HEIGHT - 40, flexGrow: 1 },
  contentContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    minHeight: height,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  indicatorPill: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  vendorHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  hiddenGemBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  hiddenGemText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D97706",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  categoryText: { fontSize: 12, fontWeight: "600", marginLeft: 4 },
  openBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  openText: { fontSize: 12, fontWeight: "600", color: "#10B981" },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    marginBottom: 20,
  },
  statItem: { flex: 1, alignItems: "center" },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
    marginLeft: 4,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: { fontSize: 12, marginTop: 6, fontWeight: "500" },
  statDivider: { width: 1, height: 40, backgroundColor: "#E5E7EB" },
  actionRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  actionBtnOutline: { backgroundColor: "transparent", borderWidth: 2 },
  actionBtnText: { fontSize: 14, fontWeight: "600", color: "#FFF" },
  actionBtnTextOutline: { fontSize: 14, fontWeight: "600" },
  infoSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAllText: { fontSize: 14, fontWeight: "600" },
  infoCard: { borderRadius: 16, padding: 16 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: "600" },
  infoDivider: {
    height: 1,
    marginVertical: 14,
    marginLeft: 58,
  },
  menuSection: { marginBottom: 24 },
  menuList: { paddingRight: 24, paddingVertical: 4 },
  menuCard: {
    width: 150,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuImage: { width: "100%", height: 100 },
  menuPlaceholder: { justifyContent: "center", alignItems: "center" },
  menuContent: { padding: 12 },
  menuName: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  menuCategory: { fontSize: 12, marginBottom: 6 },
  menuPrice: { fontSize: 14, fontWeight: "600" },
  emptyMenu: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
  },
  emptyMenuText: { fontSize: 14, marginTop: 12 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  favButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  favButtonActive: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  orderButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  orderButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { fontSize: 16, fontWeight: "500" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorText: { fontSize: 18, fontWeight: "600", marginBottom: 24 },
  errorBackButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  errorBackButtonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
