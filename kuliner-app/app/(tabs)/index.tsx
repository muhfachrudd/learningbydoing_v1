import React, { useState, useEffect } from 'react';
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
  SafeAreaView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { vendorService, cuisineService, Vendor, Cuisine } from '@/services/apiServices';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 30) / 2;

export default function HomeScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Menu');
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const categories = ['All Menu', 'Makanan', 'Minuman', 'Snack'];

  const fetchData = async () => {
    try {
      console.log('Fetching data from API...');
      const [vendorsResponse, cuisinesResponse] = await Promise.all([
        vendorService.getAll(),
        cuisineService.getAll()
      ]);
      
      console.log('Vendors response:', vendorsResponse.data);
      console.log('Cuisines response:', cuisinesResponse.data);
      
      const vendorsList = vendorsResponse.data.data || [];
      setVendors(vendorsList);
      setCuisines(cuisinesResponse.data.data || []);
      
      // Don't auto-select vendor, show all by default
    } catch (error: any) {
      console.error('Error fetching data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      Alert.alert('Error', 'Gagal memuat data. Pastikan server backend berjalan.');
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
      const vendor = vendors.find(v => v.id === vendorId);
      if (vendor) {
        setSelectedVendor(vendor);
      }
    }
  }, [params.selectedVendorId, vendors]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Filter cuisines based on selected vendor and category
  const getFilteredCuisines = () => {
    let filtered = cuisines;
    
    // Filter by vendor only if one is selected
    if (selectedVendor) {
      filtered = filtered.filter(cuisine => 
        cuisine.vendors?.some(vendor => vendor.id === selectedVendor.id) || 
        selectedVendor.cuisine_id === cuisine.id
      );
    }
    // If no vendor selected, show all cuisines
    
    // Filter by category (if not "All Menu")
    if (selectedCategory !== 'All Menu') {
      filtered = filtered.filter(cuisine => 
        cuisine.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    return filtered;
  };



  const renderCoffeeCard = ({ item }: { item: Cuisine }) => (
    <TouchableOpacity 
      style={styles.coffeeCard}
      onPress={() => router.push(`/cuisine/${item.id}` as any)}
    >
      <View style={styles.coffeeImageContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.coffeeImage} />
        ) : (
          <View style={[styles.coffeeImage, styles.placeholderImage]}>
            <FontAwesome name="coffee" size={30} color="#8B4513" />
          </View>
        )}
        <View style={styles.ratingBadge}>
          <FontAwesome name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>4.8</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <FontAwesome name="heart-o" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.coffeeContent}>
        <Text style={styles.coffeeName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.coffeeDescription} numberOfLines={2}>{item.description || item.category}</Text>
        <Text style={styles.coffeeOrigin} numberOfLines={1}>{item.origin_region}</Text>
      </View>
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
        {/* Vendor Selector Header */}
        <View style={styles.locationHeader}>
          <Text style={styles.locationLabel}>Vendor</Text>
          <TouchableOpacity 
            style={styles.locationRow}
            onPress={() => router.push('/vendor-selector' as any)}
          >
            <Text style={styles.locationText}>
              {selectedVendor ? selectedVendor.name : 'Semua Vendor'}
            </Text>
            <FontAwesome name="chevron-down" size={10} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Profile Icon */}
        <TouchableOpacity style={styles.profileIcon}>
          <FontAwesome name="user-circle" size={32} color="#D4761A" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search coffee"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoTag}>
              <Text style={styles.promoTagText}>Promo</Text>
            </View>
            <Text style={styles.promoTitle}>Buy one get{'\n'}one FREE</Text>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=120&fit=crop' }}
            style={styles.promoImage}
          />
        </View>

        {/* Category Filter */}
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
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Grid */}
        <View style={styles.coffeeGrid}>
          <FlatList
            data={getFilteredCuisines()}
            renderItem={renderCoffeeCard}
            keyExtractor={(item) => `cuisine-${item.id}`}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome name="cutlery" size={50} color="#D4761A" />
                <Text style={styles.emptyText}>
                  {selectedVendor ? `Tidak ada menu dari ${selectedVendor.name}` : 'Belum ada menu tersedia'}
                </Text>
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
    backgroundColor: '#fff',
  },
  locationHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 5,
  },
  profileIcon: {
    position: 'absolute',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    color: '#333',
  },
  promoBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#D4761A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
  },
  promoTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promoTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  promoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  promoImage: {
    width: 100,
    height: 80,
    borderRadius: 12,
  },
  vendorContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  vendorButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 80,
  },
  vendorButtonActive: {
    backgroundColor: '#D4761A',
  },
  vendorButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  vendorButtonTextActive: {
    color: '#fff',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#D4761A',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  coffeeGrid: {
    paddingHorizontal: 20,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  coffeeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 5,
    width: (width - 50) / 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  coffeeImageContainer: {
    position: 'relative',
  },
  coffeeImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 3,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 6,
    borderRadius: 12,
  },
  coffeeContent: {
    padding: 12,
  },
  coffeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  coffeeDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  coffeeOrigin: {
    fontSize: 11,
    color: '#D4761A',
    fontWeight: '500',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
