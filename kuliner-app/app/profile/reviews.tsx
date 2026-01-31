import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInRight } from "react-native-reanimated";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

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
];

export default function MyReviewsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const isDark = scheme === "dark";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setReviews(DUMMY_REVIEWS);
      setLoading(false);
    }, 800);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesome
            key={star}
            name={star <= rating ? "star" : "star-o"}
            size={14}
            color="#F59E0B"
          />
        ))}
      </View>
    );
  };

  const renderReviewCard = ({ item, index }: { item: Review; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
      <TouchableOpacity
        style={[styles.reviewCard, { backgroundColor: colors.surface }]}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.vendorImage }} style={styles.vendorImage} />
          <View style={styles.vendorInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.vendorName, { color: colors.text }]} numberOfLines={1}>
                {item.vendorName}
              </Text>
              {item.isHiddenGem && (
                <MaterialCommunityIcons name="diamond-stone" size={14} color="#FFD700" />
              )}
            </View>
            {renderStars(item.rating)}
          </View>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {item.date}
          </Text>
        </View>

        <Text style={[styles.commentText, { color: colors.text }]}>{item.comment}</Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.likeBtn}>
            <Ionicons name="heart-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.likeCount, { color: colors.textSecondary }]}>
              {item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text style={[styles.actionText, { color: "#EF4444" }]}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={isDark ? ["#F59E0B", "#D97706"] : ["#F59E0B", "#FBBF24"]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Saya</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Stats */}
      <Animated.View
        entering={FadeInUp.delay(100)}
        style={[styles.statsContainer, { backgroundColor: colors.surface }]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {reviews.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Review
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
            {reviews.reduce((sum, r) => sum + r.likes, 0)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Likes
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#10B981" }]}>
            {reviews.filter((r) => r.isHiddenGem).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Hidden Gems
          </Text>
        </View>
      </Animated.View>

      {/* Reviews List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="comment-text-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Belum ada review
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Bagikan pengalamanmu di hidden gems yang kamu kunjungi
          </Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReviewCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  listContent: {
    padding: 20,
    paddingTop: 16,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  vendorImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
    fontWeight: "600",
    flex: 1,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    gap: 16,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeCount: {
    fontSize: 14,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
