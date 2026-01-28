import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  Alert,
  Animated,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "@/components/Themed";

import {
  reviewService,
  favoriteService,
  Review,
  Cuisine,
} from "@/services/apiServices";

import { DUMMY_CUISINES } from "@/services/dummyData";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

const USE_DUMMY_DATA = true;

const CuisineDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollY = new Animated.Value(0);

  // Constants
  const HEADER_HEIGHT = 300;

  // Parallax Header Animation
  const transformY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -50], // Move image slightly up
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0],
    outputRange: [2, 1], // Zoom effect on pull down
    extrapolate: "clamp",
  });

  const fetchReviews = async () => {
    try {
      if (USE_DUMMY_DATA) {
        setReviews([
          {
            id: 1,
            user_id: 1,
            vendor_id: 1, // Changed from cuisine_id
            rating: 5,
            comment: "Enak banget! Rasanya otentik.",
            created_at: new Date().toISOString(),
            user: {
              id: 1,
              name: "Budi Santoso",
              email: "budi@example.com",
              created_at: new Date().toISOString(),
            },
          },
          {
            id: 2,
            user_id: 2,
            vendor_id: 1, // Changed from cuisine_id
            rating: 4,
            comment: "Lumayan, tapi agak pedas.",
            created_at: new Date().toISOString(),
            user: {
              id: 2,
              name: "Siti Aminah",
              email: "siti@example.com",
              created_at: new Date().toISOString(),
            },
          },
        ]);

        // Mock Favorite check
        setIsFavorite(Math.random() > 0.5);
        return;
      }

      const response = await reviewService.getByCuisine(Number(id));
      setReviews(response.data.data || []);

      // Real API check would need to check all favorites to see if this cuisine's vendor is favorited
      // Skipping for now as favoriteService.check does not exist
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      if (USE_DUMMY_DATA) {
        setIsFavorite(!isFavorite);
        Alert.alert(
          "Berhasil",
          !isFavorite
            ? "Ditambahkan ke favorit (Dummy)"
            : "Dihapus dari favorit (Dummy)",
        );
        return;
      }

      if (isFavorite) {
        Alert.alert("Info", "Fitur remove favorite real API butuh ID favorite");
      } else {
        await favoriteService.add(Number(id)); // Assuming ID maps nicely for now
        setIsFavorite(true);
        Alert.alert("Sukses", "Ditambahkan ke favorit");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memproses favorit");
    }
  };

  // Find cuisine data from Dummy or Param
  const cuisine = DUMMY_CUISINES.find((c) => c.id === Number(id));

  if (!cuisine) {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            Menu tidak ditemukan
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ alignSelf: "center", marginTop: 20 }}
          >
            <Text style={{ color: colors.primary }}>Kembali</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Parallax Header */}
      <Animated.View
        style={[
          styles.headerImageContainer,
          { transform: [{ translateY: transformY }, { scale: imageScale }] },
        ]}
      >
        <Image
          source={{
            uri:
              cuisine.image_url ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          }}
          style={styles.headerImage}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.headerGradient}
        />
      </Animated.View>

      {/* Floating Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={20} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.indicatorPill} />

          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cuisineName}>{cuisine.name}</Text>
              <Text style={styles.vendorName}>
                oleh Vendor #{cuisine.vendor_id || 1}
              </Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>
                Rp {cuisine.price.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <FontAwesome name="star" size={16} color="#F59E0B" />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <FontAwesome name="clock-o" size={16} color="#666" />
              <Text style={styles.statValue}>20 m</Text>
              <Text style={styles.statLabel}>Waktu</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <FontAwesome name="fire" size={16} color="#EF4444" />
              <Text style={styles.statValue}>150</Text>
              <Text style={styles.statLabel}>Kalori</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.descriptionText}>
            {cuisine.description ||
              "Nikmati kelezatan kuliner autentik dengan bahan-bahan pilihan yang diolah oleh chef berpengalaman. Cocok untuk menemani waktu santai Anda."}
          </Text>

          <Text style={styles.sectionTitle}>Review ({reviews.length})</Text>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {review.user?.name?.charAt(0) || "U"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewUser}>
                    {review.user?.name || "User"}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={10}
                        color={i < review.rating ? "#F59E0B" : "#E5E7EB"}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>2 hari lalu</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={toggleFavorite}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={24}
            color={isFavorite ? "#FFF" : colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.orderButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.orderButtonText}>Pesan Sekarang</Text>
          <FontAwesome
            name="arrow-right"
            size={16}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 300,
    zIndex: 0,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    paddingTop: 260, // Start content below image
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    minHeight: 800,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  indicatorPill: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cuisineName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 32,
  },
  vendorName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  priceBadge: {
    backgroundColor: "#FFF5EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B00",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  reviewItem: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontWeight: "700",
    color: "#6B7280",
    fontSize: 14,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  reviewDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  reviewComment: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
  },
  favButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  favButtonActive: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  orderButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  orderButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default CuisineDetailScreen;
