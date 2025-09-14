import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import {
  vendorService,
  cuisineService,
  Vendor,
  Cuisine,
} from "@/services/apiServices";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75; // Card akan mengambil 75% dari lebar layar
const CARD_HEIGHT = 280;

export default function HomeScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Menu");
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const categories = ["All Menu", "Makanan", "Minuman", "Snack"];

  const fetchData = async () => {
    try {
      console.log("Fetching data from API...");
      const [vendorsResponse, cuisinesResponse] = await Promise.all([
        vendorService.getAll(),
        cuisineService.getAll(),
      ]);

      console.log("Vendors response:", vendorsResponse.data);
      console.log("Cuisines response:", cuisinesResponse.data);

      const vendorsList = vendorsResponse.data.data || [];
      setVendors(vendorsList);
      setCuisines(cuisinesResponse.data.data || []);

      // Don't auto-select vendor, show all by default
    } catch (error: any) {
      console.error("Error fetching data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      Alert.alert(
        "Error",
        "Gagal memuat data. Pastikan server backend berjalan."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle vendor selection from navigation params
  useEffect(() => {
    if (params.selectedVendorId && vendors.length > 0) {
      const vendorId = parseInt(params.selectedVendorId as string);
      const vendor = vendors.find((v) => v.id === vendorId);
      if (vendor) {
        setSelectedVendor(vendor);
      }
    }
  }, [params.selectedVendorId, vendors]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Filter cuisines based on selected vendor, category, and search query
  const getFilteredCuisines = () => {
    let filtered = cuisines;

    // Filter by search query first
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (cuisine) =>
          cuisine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cuisine.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          cuisine.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cuisine.vendors?.some((vendor) =>
            vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by vendor only if one is selected
    if (selectedVendor) {
      filtered = filtered.filter(
        (cuisine) =>
          cuisine.vendors?.some((vendor) => vendor.id === selectedVendor.id) ||
          selectedVendor.cuisine_id === cuisine.id
      );
    }
    // If no vendor selected, show all cuisines

    // Filter by category (if not "All Menu")
    if (selectedCategory !== "All Menu") {
      filtered = filtered.filter((cuisine) =>
        cuisine.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return filtered;
  };

  const renderCoffeeCard = ({ item }: { item: Cuisine }) => (
    <TouchableOpacity
      style={styles.landscapeCard}
      onPress={() => router.push(`/cuisine/${item.id}` as any)}
    >
      <Image
        source={{
          uri:
            item.image_url ||
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        }}
        style={styles.landscapeImage}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.heartButton}>
        <View style={styles.heartContainer}>
          <FontAwesome name="heart-o" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
      <LinearGradient
        colors={[
          "transparent",
          "rgba(255,255,255,0.5)",
          "rgba(255,255,255,0.5)",
        ]}
        style={styles.gradientOverlay}
      >
        <View style={styles.innerCard}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.infoRow}>
            <View style={styles.locationRow}>
              <FontAwesome name="map-marker" size={12} color="#fff" />
              <Text
                style={styles.locationText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.vendors?.[0]?.address ||
                  item.origin_region ||
                  "Indonesia"}
              </Text>
            </View>

            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Memuat data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.locationHeader}>
          <Text style={styles.locationLabel}>Vendor</Text>
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => router.push("/vendor-selector" as any)}
          >
            <Text style={styles.headerLocationText} numberOfLines={1}>
              {selectedVendor ? selectedVendor.name : "Semua Vendor"}
            </Text>
            <FontAwesome name="chevron-down" size={10} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.profileIcon}>
          <FontAwesome name="user-circle" size={32} color="#D4761A" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <FontAwesome
              name="search"
              size={16}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari menu makanan atau minuman..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery("")}
              >
                <FontAwesome name="times-circle" size={16} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=120&fit=crop",
            }}
            style={styles.promoBanner}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Section */}
        <View style={styles.popularSection}>
          <FlatList
            data={getFilteredCuisines()}
            renderItem={renderCoffeeCard}
            keyExtractor={(item) => `cuisine-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContainer}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery.trim()
                    ? `Tidak ada hasil untuk "${searchQuery}"`
                    : selectedVendor
                    ? `Tidak ada menu dari ${selectedVendor.name}`
                    : "Belum ada menu tersedia"}
                </Text>
                {searchQuery.trim() && (
                  <Text style={styles.emptySubtext}>
                    Coba kata kunci lain atau hapus filter pencarian
                  </Text>
                )}
              </View>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  locationHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    fontSize: 13,
    color: "#fff",
    marginLeft: 6,
    opacity: 0.8,
    flexShrink: 1,
  },
  headerLocationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginRight: 5,
  },
  profileIcon: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  promoBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    width: "89%",
    height: 130,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  promoContent: {
    flex: 1,
  },
  promoTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  promoTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  promoTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 28,
  },
  promoImage: {
    width: 280,
    height: 80,
    borderRadius: 12,
  },

  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: "#D4761A",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 4,
    color: "#666",
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },

  // Popular Section Styles
  popularSection: {
    paddingVertical: 10,
  },
  horizontalListContainer: {
    paddingHorizontal: 20,
  },

  // Landscape Card Styles
  landscapeCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  landscapeImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heartButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 2,
  },
  heartContainer: {
    width: 40,
    height: 38,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  innerCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  ratingText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
});
