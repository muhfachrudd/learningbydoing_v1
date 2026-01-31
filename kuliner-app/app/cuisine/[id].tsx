import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Dimensions,
  Alert,
  StatusBar,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { Text, View } from '@/components/Themed';
import {
  reviewService,
  favoriteService,
  Review,
  Cuisine,
} from '@/services/apiServices';
import { DUMMY_CUISINES, DUMMY_VENDORS } from '@/services/dummyData';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 320;
const USE_DUMMY_DATA = true;

export const options = {
  headerShown: false,
};

const CuisineDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [1, 0.9],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  const fetchReviews = async () => {
    try {
      if (USE_DUMMY_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReviews([
          {
            id: 1,
            user_id: 1,
            vendor_id: 1,
            rating: 5,
            comment: 'Enak banget! Rasanya otentik dan porsinya pas. Pasti bakal pesan lagi!',
            created_at: new Date().toISOString(),
            user: {
              id: 1,
              name: 'Budi Santoso',
              email: 'budi@example.com',
              created_at: new Date().toISOString(),
            },
          },
          {
            id: 2,
            user_id: 2,
            vendor_id: 1,
            rating: 4,
            comment: 'Lumayan enak, tapi agak pedas untuk selera saya. Overall recommended!',
            created_at: new Date().toISOString(),
            user: {
              id: 2,
              name: 'Siti Aminah',
              email: 'siti@example.com',
              created_at: new Date().toISOString(),
            },
          },
          {
            id: 3,
            user_id: 3,
            vendor_id: 1,
            rating: 5,
            comment: 'Favorit keluarga! Anak-anak suka banget.',
            created_at: new Date().toISOString(),
            user: {
              id: 3,
              name: 'Ahmad Wijaya',
              email: 'ahmad@example.com',
              created_at: new Date().toISOString(),
            },
          },
        ]);
        setIsFavorite(Math.random() > 0.5);
        return;
      }

      const response = await reviewService.getByCuisine(Number(id));
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReviews();
  }, []);

  const toggleFavorite = async () => {
    try {
      if (USE_DUMMY_DATA) {
        setIsFavorite(!isFavorite);
        return;
      }

      if (isFavorite) {
        Alert.alert('Info', 'Fitur remove favorite real API butuh ID favorite');
      } else {
        await favoriteService.add(Number(id));
        setIsFavorite(true);
        Alert.alert('Sukses', 'Ditambahkan ke favorit');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memproses favorit');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Cek menu ${cuisine?.name} di Kuliner App! Harga: Rp ${cuisine?.price.toLocaleString('id-ID')}`,
        title: cuisine?.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOrder = () => {
    // Get vendor info for this cuisine
    const vendor = DUMMY_VENDORS.find((v) => v.id === cuisine?.vendor_id);
    
    if (!vendor) {
      Alert.alert('Info', 'Informasi vendor tidak tersedia');
      return;
    }

    // Show order options
    Alert.alert(
      'Pesan Menu Ini',
      `Hubungi ${vendor.name} untuk memesan ${cuisine?.name}`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'WhatsApp',
          onPress: () => {
            const phone = vendor.contact?.replace(/[^0-9]/g, '') || '';
            const whatsappNumber = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
            const message = `Halo, saya ingin memesan ${cuisine?.name} (Rp ${cuisine?.price.toLocaleString('id-ID')})`;
            Linking.openURL(`whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`);
          },
        },
        {
          text: 'Telepon',
          onPress: () => {
            if (vendor.contact) {
              Linking.openURL(`tel:${vendor.contact}`);
            }
          },
        },
      ]
    );
  };

  const handleSubmitReview = () => {
    if (newRating === 0) {
      Alert.alert('Error', 'Pilih rating terlebih dahulu');
      return;
    }
    if (!newReview.trim()) {
      Alert.alert('Error', 'Tulis komentar terlebih dahulu');
      return;
    }

    const review: Review = {
      id: Date.now(),
      user_id: 999,
      vendor_id: 1,
      rating: newRating,
      comment: newReview,
      created_at: new Date().toISOString(),
      user: {
        id: 999,
        name: 'Anda',
        email: 'you@example.com',
        created_at: new Date().toISOString(),
      },
    };

    setReviews([review, ...reviews]);
    setNewReview('');
    setNewRating(0);
    Alert.alert('Berhasil', 'Review berhasil ditambahkan!');
  };

  const cuisine = DUMMY_CUISINES.find((c) => c.id === Number(id));

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!cuisine) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient
              colors={['#FEE2E2', '#FECACA']}
              style={styles.errorIconContainer}
            >
              <FontAwesome name="exclamation-triangle" size={50} color="#EF4444" />
            </LinearGradient>
          </Animated.View>
          <Animated.Text
            entering={FadeInDown.delay(200)}
            style={[styles.errorText, { color: colors.text }]}
          >
            Menu tidak ditemukan
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(300)}>
            <TouchableOpacity
              style={[styles.errorBackButton, { backgroundColor: colors.primary }]}
              onPress={() => router.back()}
            >
              <Text style={styles.errorBackButtonText}>Kembali</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Parallax Header */}
      <Animated.View style={[styles.headerImageContainer, headerAnimatedStyle]}>
        {cuisine.image_url ? (
          <Image
            source={{ uri: cuisine.image_url }}
            style={styles.headerImage}
          />
        ) : (
          <LinearGradient
            colors={[colors.primary, '#FF8533']}
            style={[styles.headerImage, styles.headerPlaceholder]}
          >
            <FontAwesome name="cutlery" size={80} color="rgba(255,255,255,0.3)" />
          </LinearGradient>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.headerGradient}
        />

        <Animated.View entering={FadeInUp.delay(300)} style={styles.decorCircle1} />
        <Animated.View entering={FadeInUp.delay(400)} style={styles.decorCircle2} />
      </Animated.View>

      {/* Floating Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Floating Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="share-social-outline" size={22} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
          <View style={styles.indicatorPill} />

          {/* Title Row */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cuisineName, { color: colors.text }]}>{cuisine.name}</Text>
              <TouchableOpacity
                style={styles.vendorBadge}
                onPress={() => router.push(`/vendor/${cuisine.vendor_id || 1}` as any)}
              >
                <MaterialCommunityIcons name="store" size={12} color={colors.primary} />
                <Text style={[styles.vendorBadgeText, { color: colors.primary }]}>
                  Vendor #{cuisine.vendor_id || 1}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>
                Rp {cuisine.price.toLocaleString('id-ID')}
              </Text>
            </View>
          </Animated.View>

          {/* Stats Row */}
          <Animated.View
            entering={FadeInUp.delay(200)}
            style={[styles.statsRow, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F8F9FA' }]}
          >
            <View style={styles.statItem}>
              <View style={styles.ratingBadge}>
                <FontAwesome name="star" size={12} color="#FFF" />
                <Text style={styles.ratingValue}>{averageRating}</Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {reviews.length} ulasan
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>15-20 min</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={20} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>150 kcal</Text>
            </View>
          </Animated.View>

          {/* Tags Section */}
          <Animated.View entering={FadeInUp.delay(250)} style={styles.tagsRow}>
            <View style={[styles.tag, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }]}>
              <MaterialCommunityIcons name="food" size={14} color={colors.textSecondary} />
              <Text style={[styles.tagText, { color: colors.text }]}>{cuisine.category || 'Makanan'}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }]}>
              <MaterialCommunityIcons name="check-circle" size={14} color={colors.primary} />
              <Text style={[styles.tagText, { color: colors.text }]}>Halal</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }]}>
              <MaterialCommunityIcons name="leaf" size={14} color={colors.textSecondary} />
              <Text style={[styles.tagText, { color: colors.text }]}>Fresh</Text>
            </View>
          </Animated.View>

          {/* Description Section */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Deskripsi</Text>
            <View style={[styles.descriptionCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB' }]}>
              <Text style={[styles.descriptionText, { color: colors.text }]}>
                {cuisine.description ||
                  'Nikmati kelezatan kuliner autentik dengan bahan-bahan pilihan yang diolah oleh chef berpengalaman. Cocok untuk menemani waktu santai Anda bersama keluarga tercinta.'}
              </Text>
            </View>
          </Animated.View>

          {/* Add Review Section */}
          <Animated.View entering={FadeInUp.delay(350)} style={styles.addReviewSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tulis Review</Text>
            <View style={[styles.addReviewCard, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFF' }]}>
              <View style={styles.starRatingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                    <FontAwesome
                      name={star <= newRating ? 'star' : 'star-o'}
                      size={28}
                      color={star <= newRating ? '#F59E0B' : '#D1D5DB'}
                      style={{ marginHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[
                  styles.reviewInput,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6',
                    color: colors.text,
                  },
                ]}
                placeholder="Bagaimana pengalaman Anda dengan menu ini?"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                value={newReview}
                onChangeText={setNewReview}
              />
              <TouchableOpacity
                style={[styles.submitReviewBtn, { backgroundColor: colors.primary }]}
                onPress={handleSubmitReview}
              >
                <Ionicons name="send" size={18} color="#FFF" />
                <Text style={styles.submitReviewText}>Kirim Review</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Reviews Section */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.reviewsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Review ({reviews.length})
              </Text>
              <View style={styles.averageRating}>
                <FontAwesome name="star" size={14} color="#F59E0B" />
                <Text style={[styles.averageRatingText, { color: colors.text }]}>{averageRating}</Text>
              </View>
            </View>

            {reviews.map((review, index) => (
              <Animated.View
                key={review.id}
                entering={FadeInRight.delay(100 * index)}
                style={[styles.reviewCard, { 
                  backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFF',
                  borderWidth: 1,
                  borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB'
                }]}
              >
                <View style={styles.reviewHeader}>
                  <View style={[styles.avatarCircle, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }]}>
                    <Text style={[styles.avatarText, { color: colors.text }]}>
                      {review.user?.name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                  <View style={styles.reviewHeaderContent}>
                    <Text style={[styles.reviewUser, { color: colors.text }]}>
                      {review.user?.name || 'User'}
                    </Text>
                    <View style={styles.reviewStars}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={12}
                          color={i < review.rating ? '#F59E0B' : '#E5E7EB'}
                          style={{ marginRight: 2 }}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
                    {index === 0 ? 'Baru saja' : `${index + 1} hari lalu`}
                  </Text>
                </View>
                <Text style={[styles.reviewComment, { color: colors.text }]}>
                  {review.comment}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>

          <View style={{ height: 140 }} />
        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Action Bar */}
      <Animated.View
        entering={FadeInUp.delay(600)}
        style={[styles.bottomBar, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={toggleFavorite}
        >
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={22}
            color={isFavorite ? '#FFF' : colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.orderButton, { backgroundColor: colors.primary }]}
          onPress={handleOrder}
        >
          <Text style={styles.orderButtonText}>Pesan Sekarang</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 0,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  decorCircle1: {
    position: 'absolute',
    top: 60,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    top: 120,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT - 40,
    flexGrow: 1,
  },
  contentContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    minHeight: height,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  indicatorPill: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cuisineName: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  vendorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  vendorBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  priceBadge: {
    backgroundColor: '#FFF5EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B00',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 4,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionCard: {
    padding: 16,
    borderRadius: 16,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  addReviewSection: {
    marginBottom: 20,
  },
  addReviewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  starRatingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  reviewInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  submitReviewText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  averageRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  averageRatingText: {
    fontSize: 16,
    fontWeight: '700',
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontWeight: '600',
    fontSize: 16,
  },
  reviewHeaderContent: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  favButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  orderButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  errorBackButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  errorBackButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CuisineDetailScreen;
