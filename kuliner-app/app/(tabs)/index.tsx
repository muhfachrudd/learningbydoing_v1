import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert,
  RefreshControl,
  Dimensions,
  ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { vendorService, cuisineService, Vendor, Cuisine } from '@/services/apiServices';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 30) / 2;

export default function HomeScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [featuredCuisines, setFeaturedCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const fetchData = async () => {
    try {
      console.log('Fetching data from API...');
      const [vendorsResponse, cuisinesResponse] = await Promise.all([
        vendorService.getAll(),
        cuisineService.getAll()
      ]);
      
      console.log('Vendors response:', vendorsResponse.data);
      console.log('Cuisines response:', cuisinesResponse.data);
      
      setVendors(vendorsResponse.data.data || []);
      setFeaturedCuisines(cuisinesResponse.data.data?.slice(0, 6) || []);
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <TouchableOpacity style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.placeholderImage]}>
          <FontAwesome name="cutlery" size={30} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.vendorName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.vendorAddress} numberOfLines={1}>{item.address}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={12} color="#FFD700" />
          <Text style={styles.rating}>{item.rating ? item.rating.toFixed(1) : '0.0'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedCuisine = ({ item }: { item: Cuisine }) => (
    <TouchableOpacity 
      style={styles.featuredCard}
      onPress={() => router.push(`/cuisine/${item.id}` as any)}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.featuredImage} />
      ) : (
        <View style={[styles.featuredImage, styles.placeholderImage]}>
          <FontAwesome name="cutlery" size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
        </View>
      )}
      <View style={styles.featuredContent}>
        <Text style={styles.cuisineName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cuisineVendor} numberOfLines={1}>{item.category}</Text>
        <Text style={styles.cuisinePrice}>{item.origin_region}</Text>
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
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Kuliner Terdekat</Text>
          <Text style={styles.subtitle}>Temukan kuliner favoritmu</Text>
        </View>

        {/* Featured Cuisines */}
        {featuredCuisines.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rekomendasi Kuliner</Text>
            </View>
            <FlatList
              data={featuredCuisines}
              renderItem={renderFeaturedCuisine}
              keyExtractor={(item) => `cuisine-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </>
        )}

        {/* Vendors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vendor Terpopuler</Text>
        </View>
        
        <FlatList
          data={vendors}
          renderItem={renderVendorCard}
          keyExtractor={(item) => `vendor-${item.id}`}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="cutlery" size={50} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
              <Text style={styles.emptyText}>Belum ada vendor kuliner</Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuredList: {
    paddingLeft: 20,
  },
  featuredCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 15,
    width: 180,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredContent: {
    padding: 12,
  },
  cuisineName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cuisineVendor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cuisinePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 5,
    width: CARD_WIDTH,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vendorAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
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
