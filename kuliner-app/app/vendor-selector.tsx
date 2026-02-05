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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useTheme } from "@/utils/ThemeContext";
import { vendorService, Vendor } from "@/services/apiServices";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 30) / 2;

export default function VendorSelectorScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const fetchVendors = async () => {
    try {
      console.log("Fetching vendors from API...");
      const response = await vendorService.getAll();
      console.log("Vendors response:", response.data);
      setVendors(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      Alert.alert(
        "Error",
        "Gagal memuat data vendor. Pastikan server backend berjalan.",
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

  const handleVendorSelect = (vendor: Vendor) => {
    // Navigate back to home with selected vendor
    router.push({
      pathname: "/(tabs)/" as any,
      params: { selectedVendorId: vendor.id, selectedVendorName: vendor.name },
    });
  };

  const handleShowAll = () => {
    // Navigate back to home showing all vendors
    router.push("/(tabs)/" as any);
  };

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => handleVendorSelect(item)}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.vendorImage} />
      ) : (
        <View style={[styles.vendorImage, styles.placeholderImage]}>
          <FontAwesome name="cutlery" size={30} color="#D4761A" />
        </View>
      )}
      <View style={styles.vendorContent}>
        <Text style={styles.vendorName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.vendorAddress} numberOfLines={2}>
          {item.address}
        </Text>
        <View style={styles.vendorFooter}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating ? item.rating.toFixed(1) : "4.5"}
            </Text>
          </View>
          <Text style={styles.selectText}>Pilih</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Memuat vendor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={16} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Pilih Vendor</Text>
          <Text style={styles.headerSubtitle}>
            Pilih vendor untuk melihat menunya
          </Text>
        </View>
      </View>

      {/* Show All Option */}
      <TouchableOpacity style={styles.showAllCard} onPress={handleShowAll}>
        <View style={styles.showAllContent}>
          <FontAwesome name="th-large" size={24} color="#D4761A" />
          <View style={styles.showAllText}>
            <Text style={styles.showAllTitle}>Semua Vendor</Text>
            <Text style={styles.showAllSubtitle}>
              Tampilkan menu dari semua vendor
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#666" />
        </View>
      </TouchableOpacity>

      <FlatList
        data={vendors}
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 15,
    fontWeight: "semibold",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  showAllCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  showAllContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  showAllText: {
    flex: 1,
    marginLeft: 15,
  },
  showAllTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  showAllSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  vendorCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 5,
    width: CARD_WIDTH,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  vendorImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeholderImage: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  vendorContent: {
    padding: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  vendorAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  vendorFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#333",
    fontWeight: "600",
  },
  selectText: {
    fontSize: 12,
    color: "#D4761A",
    backgroundColor: "#FFF3E6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
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
