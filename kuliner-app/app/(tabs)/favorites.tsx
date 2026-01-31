import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { DUMMY_CUISINES } from '@/services/dummyData';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { favoriteService, Favorite } from '@/services/apiServices';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 180;

export default function FavoritesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const isDark = scheme === 'dark';

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const USE_DUMMY_DATA = true;

  /* ================= ANIMATION VALUES ================= */
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  /* ================= ANIMATED STYLES ================= */
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.6],
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

  const decorCircle1Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollY.value, [0, 500], [0, 45]);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  const decorCircle2Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollY.value, [0, 500], [0, -30]);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  /* ================= DATA ================= */
  const fetchFavorites = async () => {
    try {
      if (USE_DUMMY_DATA) {
        // Create mock favorites using vendors instead of cuisines
        const mockFavorites = DUMMY_CUISINES.slice(0, 5).map((cuisine: any, index: number) => ({
          id: index + 1,
          user_id: 1,
          vendor_id: cuisine.vendor_id || 1,
          vendor: {
            id: cuisine.vendor_id || 1,
            name: `Vendor ${cuisine.name}`,
            address: "Jakarta",
            latitude: -6.2,
            longitude: 106.816666,
            opening_hours: "09:00 - 21:00",
            price_range: "15.000 - 50.000",
            cuisine_id: cuisine.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Add cuisine data as part of vendor for display
            cuisine: cuisine,
          },
          created_at: new Date().toISOString(),
        } as unknown as Favorite));
        
        setFavorites(mockFavorites);
        return;
      }

      const response = await favoriteService.getAll();
      setFavorites(response.data.data || []);
    } catch (error) {
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
      if (USE_DUMMY_DATA) {
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        return;
      }

      await favoriteService.remove(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      Alert.alert('Error', 'Gagal menghapus dari favorit');
    }
  };

  const confirmRemoveFavorite = (favorite: Favorite) => {
    const cuisine = (favorite.vendor as any)?.cuisine;
    Alert.alert(
      'Hapus Favorit',
      `Hapus ${cuisine?.name || 'vendor ini'} dari daftar favorit?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => removeFavorite(favorite.id) },
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

  /* ================= RENDER ================= */
  const renderFavoriteCard = ({ item, index }: { item: Favorite; index: number }) => {
    const cuisine = (item.vendor as any)?.cuisine;
    if (!cuisine) return null;
    
    return (
      <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.surface }]}
          onPress={() => router.push(`/cuisine/${cuisine.id}` as any)}
          activeOpacity={0.9}
        >
          <View style={styles.cardImageWrap}>
            {cuisine.image_url ? (
              <Image source={{ uri: cuisine.image_url }} style={styles.cuisineImage} />
            ) : (
              <LinearGradient
                colors={[colors.primary, colors.tint]}
                style={styles.placeholderImage}
              >
                <FontAwesome name="cutlery" size={24} color="#FFF" />
              </LinearGradient>
            )}
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleWrap}>
                <Text style={[styles.cuisineName, { color: colors.text }]} numberOfLines={1}>
                  {cuisine.name}
                </Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{cuisine.category}</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => confirmRemoveFavorite(item)}
                style={styles.heartButton}
                activeOpacity={0.7}
              >
                <Animated.View>
                  <FontAwesome name="heart" size={22} color="#EC4899" />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
              {cuisine.description}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.priceWrap}>
                <Text style={[styles.price, { color: colors.primary }]}>
                  {formatPrice(cuisine.price)}
                </Text>
              </View>
              <View style={styles.regionBadge}>
                <Ionicons name="location" size={12} color={colors.textSecondary} />
                <Text style={[styles.regionText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {cuisine.origin_region}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* ================= HEADER ================= */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <LinearGradient
            colors={isDark ? ["#EC4899", "#BE185D"] : ["#EC4899", "#F472B6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            {/* Decorative Elements */}
            <Animated.View style={[styles.decorCircle1, decorCircle1Style]} />
            <Animated.View style={[styles.decorCircle2, decorCircle2Style]} />

            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <View style={styles.headerTitleWrap}>
                <MaterialCommunityIcons name="diamond" size={24} color="#FFF" />
                <Text style={styles.headerTitle}>Gems Tersimpan</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                {favorites.length} hidden gems favoritmu
              </Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* ================= CONTENT ================= */}
        {favorites.length > 0 && (
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Koleksi Gems-mu
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Hidden gems yang kamu simpan
              </Text>
            </View>
          </Animated.View>
        )}

        {favorites.map((fav, index) => (
          <View key={fav.id} style={styles.cardWrapper}>
            {renderFavoriteCard({ item: fav, index })}
          </View>
        ))}

        {favorites.length === 0 && (
          <Animated.View entering={FadeInUp.springify()} style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="diamond-outline" size={64} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Belum ada gems tersimpan
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Mulai simpan hidden gems favoritmu{'\n'}dengan menekan ikon 💎 pada tempat kuliner
            </Text>
            <TouchableOpacity 
              style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/')}
              activeOpacity={0.9}
            >
              <Text style={styles.exploreBtnText}>Temukan Hidden Gems</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },

  scrollContent: {
    paddingBottom: 100,
  },

  /* Header */
  header: {
    marginBottom: 8,
  },

  headerGradient: {
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 20 : 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },

  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  decorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
  },

  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },

  /* Section */
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 13,
  },

  /* Cards */
  cardWrapper: {
    paddingHorizontal: 20,
  },

  card: {
    flexDirection: 'row',
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    overflow: 'hidden',
  },

  cardImageWrap: {
    width: 110,
    height: 130,
  },

  cuisineImage: {
    width: '100%',
    height: '100%',
  },

  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardTitleWrap: {
    flex: 1,
    marginRight: 8,
  },

  cuisineName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  categoryBadge: {
    backgroundColor: '#FFF5EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF6B00',
  },

  heartButton: {
    padding: 4,
  },

  description: {
    fontSize: 12,
    lineHeight: 18,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceWrap: {
    flex: 1,
  },

  price: {
    fontSize: 16,
    fontWeight: '800',
  },

  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '50%',
  },

  regionText: {
    fontSize: 11,
  },

  /* Empty State */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },

  exploreBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
