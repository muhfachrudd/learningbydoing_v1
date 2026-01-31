import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeInRight,
  FadeInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  interpolate,
  useAnimatedScrollHandler,
  Extrapolation,
} from "react-native-reanimated";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_HEIGHT = 140;

interface Review {
  id: number;
  vendorName: string;
  vendorImage: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  isHiddenGem: boolean;
}

const DUMMY_REVIEWS: Review[] = [
  {
    id: 1,
    vendorName: "Warung Bu Tini - Nasi Liwet",
    vendorImage: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200",
    rating: 5,
    comment: "Hidden gem banget! Nasi liwetnya juara, bumbu meresap sempurna. Sambelnya juga mantap. Tempatnya memang kecil tapi rasanya juara!",
    date: "2 hari lalu",
    likes: 12,
    isHiddenGem: true,
  },
  {
    id: 2,
    vendorName: "Sate Taichan Pak Ewok",
    vendorImage: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=200",
    rating: 4,
    comment: "Sate taichannya enak, pedasnya pas. Porsinya agak kecil sih tapi worth it!",
    date: "1 minggu lalu",
    likes: 8,
    isHiddenGem: true,
  },
  {
    id: 3,
    vendorName: "Bakmi Aheng 168",
    vendorImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200",
    rating: 5,
    comment: "Best bakmi di Jakarta! Tekstur mienya pas, toppingnya melimpah. Kuahnya juga gurih. Recommended banget!",
    date: "2 minggu lalu",
    likes: 24,
    isHiddenGem: true,
  },
  {
    id: 4,
    vendorName: "Soto Betawi Bang Mamat",
    vendorImage: "https://images.unsplash.com/photo-1547928578-bca6e567b8e3?w=200",
    rating: 5,
    comment: "Soto betawi terenak! Kuahnya kental, dagingnya empuk. Wajib coba kalau ke daerah sini.",
    date: "3 minggu lalu",
    likes: 18,
    isHiddenGem: true,
  },
  {
    id: 5,
    vendorName: "Es Cendol Dawet Mbak Sri",
    vendorImage: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200",
    rating: 4,
    comment: "Cendolnya seger! Gula merahnya original, bukan yang palsu. Cocok buat siang-siang.",
    date: "1 bulan lalu",
    likes: 6,
    isHiddenGem: false,
  },
];



export default function MyReviewsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const isDark = scheme === "dark";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState<number[]>([]);

  const scrollY = useSharedValue(0);
  const headerScale = useSharedValue(1);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setReviews(DUMMY_REVIEWS);
      setLoading(false);
    }, 800);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -20],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [1, 0.9],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const statsAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -10],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.95],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const handleLike = (reviewId: number) => {
    if (likedReviews.includes(reviewId)) {
      setLikedReviews(likedReviews.filter((id) => id !== reviewId));
      setReviews(reviews.map((r) => 
        r.id === reviewId ? { ...r, likes: r.likes - 1 } : r
      ));
    } else {
      setLikedReviews([...likedReviews, reviewId]);
      setReviews(reviews.map((r) => 
        r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
      ));
    }
  };

  const handleEdit = (review: Review) => {
    Alert.alert(
      "Edit Review",
      `Edit review untuk ${review.vendorName}?`,
      [
        { text: "Batal", style: "cancel" },
        { text: "Edit", onPress: () => Alert.alert("Info", "Fitur edit review akan segera tersedia!") },
      ]
    );
  };

  const handleDelete = (review: Review) => {
    Alert.alert(
      "Hapus Review",
      `Yakin ingin menghapus review untuk ${review.vendorName}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            setReviews(reviews.filter((r) => r.id !== review.id));
          },
        },
      ]
    );
  };

  const renderStars = (rating: number, delay: number = 0) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesome
            key={star}
            name={star <= rating ? "star" : "star-o"}
            size={12}
            color="#F59E0B"
          />
        ))}
      </View>
    );
  };

  const ReviewCard = ({ item, index }: { item: Review; index: number }) => {
    const isLiked = likedReviews.includes(item.id);
    const likeScale = useSharedValue(1);

    const handlePressLike = () => {
      likeScale.value = withSequence(
        withSpring(1.3, { damping: 5 }),
        withSpring(1, { damping: 8 })
      );
      handleLike(item.id);
    };

    const likeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: likeScale.value }],
    }));

    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 80)}
        style={styles.cardWrapper}
      >
        <TouchableOpacity
          style={[styles.reviewCard, { backgroundColor: colors.surface }]}
          activeOpacity={0.95}
        >
          <View style={styles.cardHeader}>
            <Image source={{ uri: item.vendorImage }} style={styles.vendorImage} />
            <View style={styles.vendorInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.vendorName, { color: colors.text }]} numberOfLines={1}>
                  {item.vendorName}
                </Text>
                {item.isHiddenGem && (
                  <View style={styles.gemBadge}>
                    <MaterialCommunityIcons name="diamond-stone" size={12} color="#FFD700" />
                  </View>
                )}
              </View>
              <View style={styles.metaRow}>
                {renderStars(item.rating, 0)}
                <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                  • {item.date}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.commentText, { color: colors.text }]}>{item.comment}</Text>

          <View style={[styles.cardFooter, { borderTopColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]}>
            <TouchableOpacity style={styles.likeBtn} onPress={handlePressLike} activeOpacity={0.7}>
              <Animated.View style={likeAnimatedStyle}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isLiked ? "#EF4444" : colors.textSecondary} 
                />
              </Animated.View>
              <Text style={[styles.likeCount, { color: isLiked ? "#EF4444" : colors.textSecondary }]}>
                {item.likes}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionsRight}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: `${colors.primary}15` }]}
                onPress={() => handleEdit(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={16} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: "rgba(239,68,68,0.1)" }]}
                onPress={() => handleDelete(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={[styles.actionText, { color: "#EF4444" }]}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header with Parallax */}
      <Animated.View style={[styles.headerWrapper, headerAnimatedStyle]}>
        <LinearGradient
          colors={isDark ? ["#F59E0B", "#D97706"] : ["#F59E0B", "#FBBF24"]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Review Saya</Text>
          </View>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Card */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
        >
          <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {reviews.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Review
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, { backgroundColor: "rgba(245,158,11,0.15)" }]}>
                <Ionicons name="heart" size={20} color="#F59E0B" />
              </View>
              <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
                {reviews.reduce((sum, r) => sum + r.likes, 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Likes
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
                <MaterialCommunityIcons name="diamond-stone" size={20} color="#10B981" />
              </View>
              <Text style={[styles.statNumber, { color: "#10B981" }]}>
                {reviews.filter((r) => r.isHiddenGem).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Hidden Gems
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Section Title */}
        <Animated.View 
          entering={FadeInLeft.delay(300).springify()} 
          style={styles.sectionHeader}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Riwayat Review
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            {reviews.length} review telah kamu tulis
          </Text>
        </Animated.View>

        {/* Reviews List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Memuat review...
            </Text>
          </View>
        ) : reviews.length === 0 ? (
          <Animated.View 
            entering={FadeInUp.delay(200).springify()}
            style={styles.emptyContainer}
          >
            <View style={[styles.emptyIconWrap, { backgroundColor: `${colors.primary}10` }]}>
              <MaterialCommunityIcons
                name="comment-text-outline"
                size={48}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Belum ada review
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Bagikan pengalamanmu di hidden gems yang kamu kunjungi
            </Text>
            <TouchableOpacity 
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/vendors")}
            >
              <Ionicons name="compass" size={18} color="#FFF" />
              <Text style={styles.emptyButtonText}>Jelajahi Hidden Gems</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.reviewsList}>
            {reviews.map((item, index) => (
              <ReviewCard key={item.id} item={item} index={index} />
            ))}
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT + 10,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: "80%",
    alignSelf: "center",
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  loadingContainer: {
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 24,
    gap: 8,
  },
  emptyButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  reviewsList: {
    gap: 0,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  vendorImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  gemBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,215,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  dateText: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likeCount: {
    fontSize: 15,
    fontWeight: "600",
  },
  actionsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
