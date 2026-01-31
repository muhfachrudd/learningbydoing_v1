import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { userService, User } from "@/services/apiServices";
import { useAuth } from "@/utils/AuthContext";
import type { ComponentProps } from "react";

/* ================= TYPES ================= */
interface ProfileStats {
  totalFavorites: number;
  totalReviews: number;
  totalReviewLikes: number;
}
type IconName = ComponentProps<typeof FontAwesome>["name"];
interface MenuItemProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  iconBgColor?: string;
  index?: number;
}

/* ================= CONSTANTS ================= */
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 120;
const AVATAR_SIZE = 100;

/* ================= COMPONENT ================= */
export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { user: authUser, logout, isLoggedIn } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    totalFavorites: 0,
    totalReviews: 0,
    totalReviewLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  const USE_DUMMY_DATA = true;

  /* ================= ANIMATION VALUES ================= */
  const scrollY = useSharedValue(0);
  const avatarScale = useSharedValue(0);
  const statsAnim = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  /* ================= ANIMATED STYLES ================= */
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT],
      [0, -HEADER_MAX_HEIGHT],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT * 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT],
      [1, 0.9],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity,
      height: HEADER_MAX_HEIGHT,
    };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 150],
      [1, 0.5],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 150],
      [0, -40],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale: scale * avatarScale.value }, { translateY }],
      opacity,
    };
  });

  const nameAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 80],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 80],
      [0, -30],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  const decorCircle1Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollY.value, [0, 300], [0, 30]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const decorCircle2Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollY.value, [0, 300], [0, -20]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchProfile();
    // Start entrance animations
    avatarScale.value = withDelay(300, withSpring(1, { damping: 12 }));
    statsAnim.value = withDelay(500, withSpring(1, { damping: 15 }));
  }, []);

  /* ================= FUNCTIONS ================= */
  const fetchProfile = async () => {
    try {
      // Use auth user data if available
      if (authUser) {
        setUser(authUser);
        setStats({
          totalFavorites: 12,
          totalReviews: 5,
          totalReviewLikes: 25,
        });
        setLoading(false);
        return;
      }

      if (USE_DUMMY_DATA) {
        setUser({
          id: 1,
          name: "Budi Santoso",
          email: "budi@example.com",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
          email_verified_at: new Date().toISOString(),
          created_at: new Date(
            new Date().setFullYear(new Date().getFullYear() - 1),
          ).toISOString(),
        } as User);

        setStats({
          totalFavorites: 12,
          totalReviews: 5,
          totalReviewLikes: 25,
        });
        return;
      }

      const [userRes, statsRes] = await Promise.all([
        userService.getProfile(),
        userService.getStats(),
      ]);

      setUser(userRes.data.data);
      setStats(statsRes.data.data);
    } catch {
      Alert.alert("Error", "Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth/login");
          },
        },
      ]
    );
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });

  /* ================= RENDER ================= */
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const menuItems: MenuItemProps[] = [
    {
      icon: "edit",
      title: "Edit Profil",
      subtitle: "Ubah informasi profil Anda",
      onPress: () => router.push('/profile/edit' as any),
      iconBgColor: "#4F46E5",
    },
    {
      icon: "diamond" as any,
      title: "Hidden Gems Tersimpan",
      subtitle: `${stats.totalFavorites} gems tersimpan`,
      onPress: () => router.push('/(tabs)/favorites'),
      iconBgColor: "#D97706",
    },
    {
      icon: "star",
      title: "Review Saya",
      subtitle: `${stats.totalReviews} ulasan ditulis`,
      onPress: () => router.push('/profile/reviews' as any),
      iconBgColor: "#F59E0B",
    },
    {
      icon: "cog",
      title: "Pengaturan",
      subtitle: "Kelola preferensi aplikasi",
      onPress: () => router.push('/profile/settings' as any),
      iconBgColor: "#6B7280",
    },
    {
      icon: "question-circle",
      title: "Bantuan",
      subtitle: "FAQ dan dukungan",
      onPress: () => router.push('/profile/help' as any),
      iconBgColor: "#10B981",
    },
    {
      icon: "info-circle",
      title: "Tentang Aplikasi",
      subtitle: "Versi 1.0.0",
      onPress: () => Alert.alert("Hidden Gems Finder", "Versi 1.0.0\n\nTemukan kuliner tersembunyi berkualitas tinggi di sekitarmu!\n\n© 2026 Hidden Gems Finder"),
      iconBgColor: "#3B82F6",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* ================= ANIMATED HEADER ================= */}
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <LinearGradient
          colors={
            isDark ? [theme.primary, "#CC5500"] : [theme.primary, "#FF8533"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Decorative Elements - Wrapped in View to avoid Reanimated transform conflict */}
          <View style={styles.decorCircle1}>
            <Animated.View style={[StyleSheet.absoluteFill, decorCircle1Style, { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 70 }]} />
          </View>
          <View style={styles.decorCircle2}>
            <Animated.View style={[StyleSheet.absoluteFill, decorCircle2Style, { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 50 }]} />
          </View>
          <View style={styles.decorCircle3} />

          {/* Avatar */}
          <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={["#FFF", "#F0F0F0"]}
                style={styles.avatarPlaceholder}
              >
                <FontAwesome name="user" size={40} color={theme.primary} />
              </LinearGradient>
            )}
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
            </View>
          </Animated.View>

          {/* User Info */}
          <Animated.View style={[styles.userInfo, nameAnimatedStyle]}>
            <Animated.Text
              entering={FadeInUp.delay(400).springify()}
              style={styles.userName}
            >
              {user?.name}
            </Animated.Text>
            <Animated.Text
              entering={FadeInUp.delay(500).springify()}
              style={styles.userEmail}
            >
              {user?.email}
            </Animated.Text>
            <Animated.View
              entering={FadeInUp.delay(600).springify()}
              style={styles.joinedBadge}
            >
              <Ionicons
                name="calendar-outline"
                size={12}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.joinedText}>
                Bergabung {formatDate(user!.created_at)}
              </Text>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Cards */}
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={styles.statsContainer}
        >
          <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
            <StatItem
              icon="heart"
              iconColor="#EC4899"
              value={stats.totalFavorites}
              label="Favorit"
              theme={theme}
              delay={400}
            />
            <View
              style={[styles.statsDivider, { backgroundColor: theme.border }]}
            />
            <StatItem
              icon="star"
              iconColor="#F59E0B"
              value={stats.totalReviews}
              label="Review"
              theme={theme}
              delay={500}
            />
            <View
              style={[styles.statsDivider, { backgroundColor: theme.border }]}
            />
            <StatItem
              icon="thumbs-up"
              iconColor="#10B981"
              value={stats.totalReviewLikes}
              label="Like"
              theme={theme}
              delay={600}
            />
          </View>
        </Animated.View>

        {/* Achievement Badge */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <TouchableOpacity
            style={[styles.achievementCard, { backgroundColor: theme.surface }]}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#FFD700", "#FFA500"]}
              style={styles.achievementIcon}
            >
              <MaterialCommunityIcons
                name="diamond-stone"
                size={24}
                color="#FFF"
              />
            </LinearGradient>
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: theme.text }]}>
                Gem Hunter
              </Text>
              <Text
                style={[
                  styles.achievementSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Temukan 5 hidden gems untuk unlock badge ini!
              </Text>
            </View>
            <View style={styles.achievementProgress}>
              <Text style={[styles.achievementCount, { color: theme.primary }]}>
                2/5
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Menu Section */}
        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Pengaturan
          </Text>
        </Animated.View>

        {menuItems.map((item, index) => (
          <MenuItem key={item.title} {...item} theme={theme} index={index} />
        ))}

        {/* Logout Button */}
        <Animated.View entering={FadeInUp.delay(900).springify()}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: theme.error }]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <FontAwesome name="sign-out" size={20} color={theme.error} />
            <Text style={[styles.logoutText, { color: theme.error }]}>
              Keluar dari Akun
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Kuliner App v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Made in Indonesia
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

/* ================= SUB COMPONENTS ================= */

function StatItem({
  icon,
  iconColor,
  value,
  label,
  theme,
  delay,
}: {
  icon: IconName;
  iconColor: string;
  value: number;
  label: string;
  theme: any;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={styles.statItem}
    >
      <View
        style={[styles.statIconWrap, { backgroundColor: `${iconColor}15` }]}
      >
        <FontAwesome name={icon} size={16} color={iconColor} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
    </Animated.View>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  iconBgColor = "#6B7280",
  theme,
  index = 0,
}: MenuItemProps & { theme: any }) {
  return (
    <Animated.View entering={FadeInRight.delay(700 + index * 80).springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.menuItem, { backgroundColor: theme.surface }]}
      >
        <View style={styles.menuLeft}>
          <LinearGradient
            colors={[iconBgColor, `${iconBgColor}CC`]}
            style={styles.menuIcon}
          >
            <FontAwesome name={icon} size={18} color="#FFF" />
          </LinearGradient>

          <View style={styles.menuTextWrap}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[styles.menuSubtitle, { color: theme.textSecondary }]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {showArrow && (
          <View
            style={[styles.menuArrow, { backgroundColor: theme.background }]}
          >
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.textSecondary}
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 70,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: "600",
  },

  /* Header */
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },

  headerGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 20 : 60,
  },

  decorCircle1: {
    position: "absolute",
    top: -60,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: "hidden",
  },

  decorCircle2: {
    position: "absolute",
    top: 60,
    right: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
  },

  decorCircle3: {
    position: "absolute",
    bottom: 20,
    left: "30%",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  /* Avatar */
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: "#FFF",
  },

  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFF",
  },

  onlineBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },

  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
  },

  /* User Info */
  userInfo: {
    alignItems: "center",
  },

  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },

  joinedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  joinedText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },

  /* Scroll Content */
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT + 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* Stats */
  statsContainer: {
    marginBottom: 20,
  },

  statsCard: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
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

  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },

  statsDivider: {
    width: 1,
    marginVertical: 10,
  },

  /* Achievement */
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  achievementInfo: {
    flex: 1,
    marginLeft: 14,
  },

  achievementTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },

  achievementSubtitle: {
    fontSize: 12,
  },

  achievementProgress: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  achievementCount: {
    fontSize: 14,
    fontWeight: "700",
  },

  /* Section */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  /* Menu Items */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  menuTextWrap: {
    marginLeft: 14,
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },

  menuSubtitle: {
    fontSize: 12,
  },

  menuArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Logout */
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 10,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "700",
  },

  /* Footer */
  footer: {
    alignItems: "center",
    gap: 4,
  },

  footerText: {
    fontSize: 12,
  },
});
