import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView,
  TouchableOpacity, 
  Image, 
  Alert,
  RefreshControl,
  SafeAreaView,
  Linking,
  FlatList
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { vendorService, cuisineService, Vendor, Cuisine } from '@/services/apiServices';
import { dummyService } from '@/services/dummyData';

const USE_DUMMY_DATA = true;

// Export options to hide header
export const options = {
  headerShown: false,
};

export default function VendorDetailScreen() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const fetchVendorData = async () => {
    try {
      if (!id) return;
      
      const vendorId = parseInt(id as string);
      console.log('Fetching vendor data for ID:', vendorId);
      
      if (USE_DUMMY_DATA) {
        console.log('Using DUMMY DATA for Vendor Detail');
        const [vendorResponse, cuisinesResponse] = await Promise.all([
          dummyService.getVendorById(vendorId),
          dummyService.getAllCuisines()
        ]);

        console.log('Vendor response:', vendorResponse.data);
        setVendor(vendorResponse.data.data || null);
        
        // Filter cuisines for this vendor
        const allCuisines = cuisinesResponse.data.data || [];
        const vendorCuisines = allCuisines.filter(cuisine => 
          cuisine.vendors?.some(v => v.id === vendorId) ||
          vendorResponse.data.data?.cuisine_id === cuisine.id
        );
        setCuisines(vendorCuisines);
      } else {
        const [vendorResponse, cuisinesResponse] = await Promise.all([
          vendorService.getById(vendorId),
          cuisineService.getAll()
        ]);
        
        console.log('Vendor response:', vendorResponse.data);
        setVendor(vendorResponse.data.data);
        
        // Filter cuisines for this vendor
        const allCuisines = cuisinesResponse.data.data || [];
        const vendorCuisines = allCuisines.filter(cuisine => 
          cuisine.vendors?.some(v => v.id === vendorId) ||
          vendorResponse.data.data.cuisine_id === cuisine.id
        );
        setCuisines(vendorCuisines);
      }
      
    } catch (error: any) {
      console.error('Error fetching vendor data:', error);
      Alert.alert('Error', 'Gagal memuat data vendor. Pastikan server backend berjalan.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendorData();
  };

  const handleCall = () => {
    if (vendor?.contact) {
      Linking.openURL(`tel:${vendor.contact}`);
    }
  };

  const handleOpenMaps = () => {
    if (vendor?.latitude && vendor?.longitude) {
      const url = `https://maps.google.com/?q=${vendor.latitude},${vendor.longitude}`;
      Linking.openURL(url);
    }
  };

  const renderCuisineCard = ({ item }: { item: Cuisine }) => (
    <TouchableOpacity 
      style={styles.cuisineCard}
      onPress={() => router.push(`/cuisine/${item.id}` as any)}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.cuisineImage} />
      ) : (
        <View style={[styles.cuisineImage, styles.placeholderImage]}>
          <FontAwesome name="cutlery" size={20} color="#D4761A" />
        </View>
      )}
      <View style={styles.cuisineContent}>
        <Text style={styles.cuisineName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cuisineCategory} numberOfLines={1}>{item.category}</Text>
        <Text style={styles.cuisineOrigin} numberOfLines={1}>{item.origin_region}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Memuat data vendor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={50} color="#D4761A" />
          <Text style={styles.errorText}>Vendor tidak ditemukan</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Vendor</Text>
        </View>

        {/* Vendor Image */}
        <View style={styles.imageContainer}>
          {vendor.image_url ? (
            <Image source={{ uri: vendor.image_url }} style={styles.vendorImage} />
          ) : (
            <View style={[styles.vendorImage, styles.placeholderImage]}>
              <FontAwesome name="cutlery" size={60} color="#D4761A" />
            </View>
          )}
        </View>

        {/* Vendor Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.vendorName}>{vendor.name}</Text>
          
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{vendor.rating ? vendor.rating.toFixed(1) : '4.5'}</Text>
            <Text style={styles.reviewCount}>({vendor.reviews_count || 0} reviews)</Text>
          </View>

          <View style={styles.detailItem}>
            <FontAwesome name="map-marker" size={16} color="#D4761A" />
            <Text style={styles.detailText}>{vendor.address}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenMaps}>
              <Text style={styles.actionButtonText}>Buka Map</Text>
            </TouchableOpacity>
          </View>

          {vendor.contact && (
            <View style={styles.detailItem}>
              <FontAwesome name="phone" size={16} color="#D4761A" />
              <Text style={styles.detailText}>{vendor.contact}</Text>
              <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                <Text style={styles.actionButtonText}>Telepon</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.detailItem}>
            <FontAwesome name="clock-o" size={16} color="#D4761A" />
            <Text style={styles.detailText}>{vendor.opening_hours || 'Jam buka tidak tersedia'}</Text>
          </View>

          <View style={styles.detailItem}>
            <FontAwesome name="money" size={16} color="#D4761A" />
            <Text style={styles.detailText}>{vendor.price_range || 'Harga tidak tersedia'}</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu Tersedia</Text>
          {cuisines.length > 0 ? (
            <FlatList
              data={cuisines}
              renderItem={renderCuisineCard}
              keyExtractor={(item) => `cuisine-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.menuList}
            />
          ) : (
            <View style={styles.emptyMenu}>
              <FontAwesome name="cutlery" size={30} color="#D4761A" />
              <Text style={styles.emptyMenuText}>Belum ada menu tersedia</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#D4761A',
  },
  headerBackButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  vendorImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 20,
  },
  vendorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#333',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
  },
  actionButton: {
    backgroundColor: '#D4761A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  menuSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuList: {
    paddingRight: 20,
  },
  cuisineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    width: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cuisineImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cuisineContent: {
    padding: 10,
  },
  cuisineName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cuisineCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  cuisineOrigin: {
    fontSize: 11,
    color: '#D4761A',
    fontWeight: '500',
  },
  emptyMenu: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyMenuText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: '#D4761A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});