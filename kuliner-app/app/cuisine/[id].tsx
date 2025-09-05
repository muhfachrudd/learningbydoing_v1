import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { cuisineService, favoriteService, reviewService, Cuisine, Review } from '@/services/apiServices';

const { width } = Dimensions.get('window');

export default function CuisineDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (id) {
      fetchCuisineDetail();
      fetchReviews();
    }
  }, [id]);

  const fetchCuisineDetail = async () => {
    try {
      const response = await cuisineService.getById(Number(id));
      setCuisine(response.data.data);
    } catch (error) {
      console.error('Error fetching cuisine detail:', error);
      Alert.alert('Error', 'Gagal memuat detail kuliner');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getByCuisine(Number(id));
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!cuisine) return;
    
    try {
      const response = await favoriteService.toggle(cuisine.id);
      setIsFavorite(response.data.data.action === 'added');
      Alert.alert(
        'Berhasil',
        response.data.data.action === 'added' ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit'
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Gagal mengubah status favorit');
    }
  };

  const shareContent = async () => {
    if (!cuisine) return;
    
    try {
      await Share.share({
        message: `Check out ${cuisine.name} at ${cuisine.vendor?.name}! Only ${formatPrice(cuisine.price)}`,
        title: cuisine.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const renderReview = (review: Review) => (
    <View key={review.id} style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{review.user?.name || 'Anonymous'}</Text>
        <View style={styles.reviewRating}>
          {renderStars(review.rating)}
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <Text style={styles.reviewDate}>
        {new Date(review.created_at).toLocaleDateString('id-ID')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Memuat detail kuliner...</Text>
      </View>
    );
  }

  if (!cuisine) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-triangle" size={50} color="#e74c3c" />
        <Text style={styles.errorText}>Kuliner tidak ditemukan</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        {cuisine.image_url ? (
          <Image source={{ uri: cuisine.image_url }} style={styles.cuisineImage} />
        ) : (
          <View style={[styles.cuisineImage, styles.placeholderImage]}>
            <FontAwesome name="cutlery" size={50} color="#ccc" />
          </View>
        )}
        
        {/* Back and Action Buttons */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={toggleFavorite}>
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={20}
              color={isFavorite ? '#e74c3c' : 'white'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={shareContent}>
            <FontAwesome name="share" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.cuisineName}>{cuisine.name}</Text>
        <Text style={styles.price}>{formatPrice(cuisine.price)}</Text>
        
        {cuisine.description && (
          <>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.description}>{cuisine.description}</Text>
          </>
        )}

        {/* Vendor Info */}
        {cuisine.vendor && (
          <>
            <Text style={styles.sectionTitle}>Vendor</Text>
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{cuisine.vendor.name}</Text>
              <Text style={styles.vendorAddress}>{cuisine.vendor.address}</Text>
              {cuisine.vendor.phone && (
                <Text style={styles.vendorPhone}>{cuisine.vendor.phone}</Text>
              )}
            </View>
          </>
        )}

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>
            Review ({reviews.length})
          </Text>
          
          {reviews.length > 0 ? (
            reviews.map(renderReview)
          ) : (
            <View style={styles.noReviewsContainer}>
              <FontAwesome name="comment-o" size={40} color="#ccc" />
              <Text style={styles.noReviewsText}>Belum ada review</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
  },
  cuisineImage: {
    width: width,
    height: 250,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    top: 40,
    right: 15,
    flexDirection: 'row',
  },
  actionBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  content: {
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  cuisineName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  vendorInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vendorAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  vendorPhone: {
    fontSize: 14,
    color: '#007AFF',
  },
  reviewsSection: {
    marginTop: 20,
  },
  reviewItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  noReviewsContainer: {
    alignItems: 'center',
    padding: 30,
  },
  noReviewsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
