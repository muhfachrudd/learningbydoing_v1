import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import {
  vendorService,
  cuisineService,
  Vendor,
  Cuisine,
} from "@/services/apiServices";
import { DUMMY_VENDORS, DUMMY_CUISINES } from "@/services/dummyData";

const USE_DUMMY_DATA = true;

const HomeScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      if (USE_DUMMY_DATA) {
        // Simulate network delay for skeleton demo
        await new Promise((resolve) => setTimeout(resolve, 800));
        setVendors(DUMMY_VENDORS);
        setCuisines(DUMMY_CUISINES);
      } else {
        const [vendorsResponse, cuisinesResponse] = await Promise.all([
          vendorService.getAll(),
          cuisineService.getAll(),
        ]);
        setVendors(vendorsResponse.data.data || []);
        setCuisines(cuisinesResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Memoized filtered data - DIPERBAIKI
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      // Filter berdasarkan search query
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.address.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter berdasarkan kategori - PERBAIKAN DI SINI
      let matchesCategory = true;
      if (selectedCategory) {
        // Cari semua cuisines yang dimiliki vendor ini
        const vendorCuisines = cuisines.filter((c) => c.vendor_id === vendor.id);
        // Check apakah ada cuisine yang categorynya sesuai dengan selectedCategory
        matchesCategory = vendorCuisines.some(
          (cuisine) => cuisine.category === selectedCategory
        );
      }

      return matchesSearch && matchesCategory;
    });
  }, [vendors, searchQuery, selectedCategory, cuisines]);

  const categories = useMemo(() => {
    const allCategories = cuisines.map((c) => c.category);
    return ["All", ...new Set(allCategories)];
  }, [cuisines]);

  const renderCategoryItem = ({ item }: { item: string }) => {
    const isSelected =
      selectedCategory === item ||
      (item === "All" && selectedCategory === null);
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isSelected && { backgroundColor: colors.primary },
        ]}
        onPress={() => setSelectedCategory(item === "All" ? null : item)}
      >
        <Text style={[styles.categoryText, isSelected && { color: "#FFF" }]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderVendorCard = ({ item }: { item: Vendor }) => {
    // Ambil cuisine utama vendor untuk ditampilkan di tag - DIPERBAIKI
    const vendorCuisines = cuisines.filter((c) => c.vendor_id === item.id);
    const primaryCuisine = vendorCuisines.find((c) => c.category === "Makanan") || vendorCuisines[0];
    const displayCategory = primaryCuisine?.category || "General";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/vendor/${item.id}` as any)}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          {item.image_url ? (
            <Image 
              source={{ uri: item.image_url }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cardImage, styles.placeholderImage]}>
              <FontAwesome name="cutlery" size={30} color="#ccc" />
            </View>
          )}
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={12} color="#FFF" />
            <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.priceRange}>Rp. {item.price_range}</Text>
          </View>

          <View style={styles.locationContainer}>
            <FontAwesome
              name="map-marker"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.address}
            </Text>
          </View>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{displayCategory}</Text>
            </View>
            <View style={styles.tag}>
              <FontAwesome
                name="clock-o"
                size={10}
                color={colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.tagText}>{item.opening_hours}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Selamat Datang</Text>
              <Text style={styles.location}>Explore Kuliner Terbaik</Text>
            </View>
            <View style={styles.profileButton}>
              <FontAwesome name="user" size={20} color={colors.primary} />
            </View>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          {/* Skeleton Loading Demo */}
          <View
            style={{
              height: 200,
              backgroundColor: "#E0E0E0",
              borderRadius: 16,
              marginBottom: 20,
            }}
          />
          <View
            style={{
              height: 200,
              backgroundColor: "#E0E0E0",
              borderRadius: 16,
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredVendors}
        renderItem={renderVendorCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={styles.textWrapper}>
                  <Text style={styles.greeting}>Selamat Datang</Text>
                  <Text style={styles.location}>Mau makan apa hari ini?</Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/profile")}
                  style={styles.profileButton}
                >
                  <FontAwesome name="user" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <FontAwesome
                  name="search"
                  size={16}
                  color={colors.textSecondary}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari nasi goreng, sate..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.categoriesContainer}>
              <FlatList
                horizontal
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              />
            </View>

            <Text style={styles.sectionTitle}>Restoran Populer</Text>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada vendor ditemukan</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "transparent",
  },

  textWrapper: {
    backgroundColor: "transparent",
  },

  greeting: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
    backgroundColor: "transparent",
  },

  location: {
    fontSize: 20,
    color: "#1A1A1A",
    fontWeight: "800",
    backgroundColor: "transparent",
  },

  profileButton: {
    width: 44,
    height: 44,
    backgroundColor: "#FFF5EB",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    height: "100%",
  },
  categoriesContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    marginLeft: 24,
    marginTop: 10,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  cardImageContainer: {
    height: 160,
    backgroundColor: "#F0F0F0",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 10,
  },
  priceRange: {
    fontSize: 14,
    color: "#FF6B00",
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default HomeScreen;