import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Alert,
  Dimensions 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { cuisineService, Cuisine } from '@/services/apiServices';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const searchCuisines = async (query: string) => {
    if (!query.trim()) {
      setCuisines([]);
      return;
    }

    setLoading(true);
    try {
      const response = await cuisineService.search(query);
      setCuisines(response.data.data || []);
    } catch (error) {
      console.error('Error searching cuisines:', error);
      Alert.alert('Error', 'Gagal mencari kuliner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCuisines(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderCuisineCard = ({ item }: { item: Cuisine }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/cuisine/${item.id}` as any)}
    >
      <View style={styles.cardContent}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.cuisineImage} />
        ) : (
          <View style={[styles.cuisineImage, styles.placeholderImage]}>
            <FontAwesome name="cutlery" size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
          </View>
        )}
        <View style={styles.cuisineInfo}>
          <Text style={styles.cuisineName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.vendorName} numberOfLines={1}>{item.vendor?.name || 'Vendor tidak diketahui'}</Text>
          <Text style={styles.vendorAddress} numberOfLines={1}>{item.vendor?.address || 'Alamat tidak diketahui'}</Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari kuliner favorit..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <FontAwesome name="times" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Mencari...</Text>
        </View>
      ) : (
        <FlatList
          data={cuisines}
          renderItem={renderCuisineCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="search" size={50} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
                <Text style={styles.emptyText}>Kuliner tidak ditemukan</Text>
                <Text style={styles.emptySubtext}>Coba kata kunci lain</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome name="search" size={50} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
                <Text style={styles.emptyText}>Mulai mencari kuliner</Text>
                <Text style={styles.emptySubtext}>Ketik nama makanan atau vendor</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
  },
  cuisineImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cuisineInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  cuisineName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vendorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  vendorAddress: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
  },
});
