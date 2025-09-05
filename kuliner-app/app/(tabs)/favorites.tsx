import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert,
  RefreshControl 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { favoriteService, Favorite } from '@/services/apiServices';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const fetchFavorites = async () => {
    try {
      const response = await favoriteService.getAll();
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Error', 'Gagal memuat data favorit');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const removeFavorite = async (favoriteId: number) => {
    try {
      await favoriteService.remove(favoriteId);
      
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      Alert.alert('Berhasil', 'Kuliner telah dihapus dari favorit');
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Gagal menghapus dari favorit');
    }
  };

  const confirmRemoveFavorite = (favorite: Favorite) => {
    Alert.alert(
      'Hapus Favorit',
      `Hapus ${favorite.cuisine?.name || 'kuliner ini'} dari daftar favorit?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => removeFavorite(favorite.id),
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderFavoriteCard = ({ item }: { item: Favorite }) => {
    const cuisine = item.cuisine;
    if (!cuisine) return null;
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push(`/cuisine/${cuisine.id}` as any)}
      >
        <View style={styles.cardContent}>
          {cuisine.image_url ? (
            <Image source={{ uri: cuisine.image_url }} style={styles.cuisineImage} />
          ) : (
            <View style={[styles.cuisineImage, styles.placeholderImage]}>
              <FontAwesome name="cutlery" size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
            </View>
          )}
          <View style={styles.cuisineInfo}>
            <View style={styles.cuisineHeader}>
              <Text style={styles.cuisineName} numberOfLines={1}>{cuisine.name}</Text>
              <TouchableOpacity 
                onPress={() => confirmRemoveFavorite(item)}
                style={styles.heartButton}
              >
                <FontAwesome name="heart" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
            <Text style={styles.vendorName} numberOfLines={1}>{cuisine.vendor?.name || 'Vendor tidak diketahui'}</Text>
            <Text style={styles.vendorAddress} numberOfLines={1}>{cuisine.vendor?.address || 'Alamat tidak diketahui'}</Text>
            <View style={styles.bottomInfo}>
              <Text style={styles.price}>{formatPrice(cuisine.price)}</Text>
              <Text style={styles.date}>Ditambahkan: {formatDate(item.created_at)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Memuat favorit...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorit Saya</Text>
        <Text style={styles.subtitle}>Kuliner yang kamu sukai</Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="heart-o" size={50} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
            <Text style={styles.emptyText}>Belum ada favorit</Text>
            <Text style={styles.emptySubtext}>Mulai tambahkan kuliner favorit kamu</Text>
          </View>
        }
      />
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
  },
  cuisineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cuisineName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  heartButton: {
    padding: 5,
  },
  vendorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  vendorAddress: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  date: {
    fontSize: 10,
    color: '#999',
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
    textAlign: 'center',
  },
});
