import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
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

/* ================= CONFIG ================= */

const USE_DUMMY_DATA = true;

/* ================= COMPONENT ================= */

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  /* ================= STATE ================= */

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  /* ================= RENDER ================= */

  const renderCategory = ({ item }: { item: string }) => {
    const active =
      selectedCategory === item ||
      (item === "All" && selectedCategory === null);

    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item === "All" ? null : item)}
        style={[
          styles.categoryChip,
          {
            backgroundColor: active ? colors.primary : colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={{
            color: active ? "#FFF" : colors.text,
            fontWeight: "600",
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderVendor = ({ item }: { item: Vendor }) => {
    const cuisine =
      cuisines.find((c) => c.vendor_id === item.id)?.category ?? "General";

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface }]}
        onPress={() => router.push(`/vendor/${item.id}` as any)}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageWrap}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.cardImage} />
          ) : (
            <View style={styles.placeholder}>
              <FontAwesome
                name="cutlery"
                size={28}
                color={colors.textSecondary}
              />
            </View>
          )}
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={12} color="#FFF" />
            <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.name}</Text>

          <View style={styles.row}>
            <FontAwesome
              name="map-marker"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.muted} numberOfLines={1}>
              {item.address}
            </Text>
          </View>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{cuisine}</Text>
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
      <View style={styles.center}>
        <Text>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredVendors}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderVendor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
              <View style={styles.headerTop}>
                <View>
                  <Text style={[{ color: colors.text }]}>Selamat Datang</Text>
                  <Text style={[styles.title, { color: colors.text }]}>Mau makan apa hari ini...?</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.profileBtn,
                    { backgroundColor: colors.background },
                  ]}
                  onPress={() => router.push("/profile")}
                >
                  <FontAwesome name="user" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.searchBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <FontAwesome
                  name="search"
                  size={16}
                  color={colors.textSecondary}
                />
                <TextInput
                  placeholder="Cari makanan..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{ marginLeft: 8, flex: 1 }}
                />
              </View>
            </View>

            <FlatList
              horizontal
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(i) => i}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />

            <Text style={styles.section}>Restoran Populer</Text>
          </>
        }
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
  },

  muted: {
    fontSize: 13,
    marginLeft: 8,
    color: "#000000ff",
  },

  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },

  categoryList: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },

  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    elevation: 1,
    shadowOpacity: 0.04,
  },

  section: {
    marginHorizontal: 24,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 2,
    shadowOpacity: 0.06,
  },

  cardImageWrap: {
    height: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: "100%",
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

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cardBody: {
    padding: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
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
});
