import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  TextInput,
  View as RNView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Text, View } from "@/components/Themed";
import { vendorService, Vendor } from "@/services/apiServices";
import { dummyService } from "@/services/dummyData";

const USE_DUMMY_DATA = true; // Set to false to use real API

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

export default function VendorsScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchVendors = async () => {
    try {
      if (USE_DUMMY_DATA) {
        console.log("Using DUMMY DATA for Vendors");
        const response = await dummyService.getAllVendors();
        setVendors(response.data.data || []);
      } else {
        const response = await vendorService.getAll();
        setVendors(response.data.data || []);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Gagal memuat data vendor. Pastikan server backend berjalan."
      );
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

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      activeOpacity={0.9}
      onPress={() => router.push(`/vendor/${item.id}` as any)}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.vendorImage} />
      ) : (
        <View style={[styles.vendorImage, styles.placeholderImage]}>
          <FontAwesome name="cutlery" size={40} color="#D4761A" />
        </View>
      )}
      <View style={styles.overlay} />

      <View style={styles.vendorContent}>
        <Text style={styles.vendorName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.vendorAddress} numberOfLines={1}>
          {item.address}
        </Text>

        <View style={styles.vendorFooter}>
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={13} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating ? item.rating.toFixed(1) : "4.5"}
            </Text>
          </View>
          <Text style={styles.detailButton}>Detail ➝</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 16, color: "#666" }}>
            ⏳ Memuat vendor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Modern */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cari Restauran</Text>
        <RNView style={styles.searchBox}>
          <FontAwesome
            name="search"
            size={16}
            color="#999"
            style={{ marginRight: 6 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama vendor..."
            value={search}
            onChangeText={setSearch}
          />
        </RNView>
      </View>

      {/* List Vendor */}
      <FlatList
        data={filteredVendors}
        renderItem={renderVendorCard}
        keyExtractor={(item) => `vendor-${item.id}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="cutlery" size={50} color="#D4761A" />
            <Text style={styles.emptyText}>Belum ada vendor tersedia</Text>
            <Text style={styles.emptySubtext}>Silakan coba lagi nanti</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  listContainer: {
    padding: 12,
    paddingBottom: 50,
  },
  vendorCard: {
    borderRadius: 16,
    margin: 6,
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  vendorImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeholderImage: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 16,
  },
  vendorContent: {
    position: "absolute",
    borderRadius: 16,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  vendorAddress: {
    fontSize: 12,
    color: "#000",
    marginTop: 2,
  },
  vendorFooter: {
    marginTop: 8,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7D1",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
  },
  detailButton: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "600",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
});
