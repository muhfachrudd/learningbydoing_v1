import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert,
  RefreshControl,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { vendorService, Vendor } from '@/services/apiServices';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 30) / 2;

export default function VendorsScreen() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const fetchVendors = async () => {
    try {
      console.log('Fetching vendors from API...');
      const response = await vendorService.getAll();
      console.log('Vendors response:', response.data);
      setVendors(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      Alert.alert('Error', 'Gagal memuat data vendor. Pastikan server backend berjalan.');
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

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <TouchableOpacity style={styles.vendorCard}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.vendorImage} />
      ) : (
        <View style={[styles.vendorImage, styles.placeholderImage]}>
          <FontAwesome name="cutlery" size={30} color="#D4761A" />
        </View>
      )}
      <View style={styles.vendorContent}>
        <Text style={styles.vendorName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.vendorAddress} numberOfLines={2}>{item.address}</Text>
        <View style={styles.vendorFooter}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating ? item.rating.toFixed(1) : '4.5'}</Text>
          </View>
          <Text style={styles.vendorType}>Restaurant</Text>
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
        <Text style={styles.headerTitle}>Vendors</Text>
        <Text style={styles.headerSubtitle}>Temukan vendor kuliner terbaik</Text>
      </View>

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
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  vendorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 5,
    width: CARD_WIDTH,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  vendorImage: {
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
  vendorContent: {
    padding: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vendorAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  vendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#333',
    fontWeight: '600',
  },
  vendorType: {
    fontSize: 10,
    color: '#D4761A',
    backgroundColor: '#FFF3E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
});
