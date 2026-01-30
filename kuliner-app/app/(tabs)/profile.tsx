import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  View as RNView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { userService, User } from "@/services/apiServices";
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
}

/* ================= COMPONENT ================= */
export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    totalFavorites: 0,
    totalReviews: 0,
    totalReviewLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  const USE_DUMMY_DATA = true;

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= FUNCTIONS ================= */
  const fetchProfile = async () => {
    try {
      if (USE_DUMMY_DATA) {
        setUser({
          id: 1,
          name: "Budi Santoso",
          email: "budi@example.com",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });

  /* ================= RENDER ================= */
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HEADER ================= */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Avatar uri={user?.avatar} />

        <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
        <Text style={{ color: theme.text }}>{user?.email}</Text>
        <Text style={{ color: theme.text }}>
          Bergabung {formatDate(user!.created_at)}
        </Text>

        <Stats stats={stats} theme={theme} />
      </View>

      {/* ================= MENU ================= */}
      <MenuItem
        icon="edit"
        title="Edit Profil"
        subtitle="Ubah informasi profil Anda"
        onPress={() => Alert.alert("Info", "Segera tersedia")}
        theme={theme}
      />
      <MenuItem
        icon="cog"
        title="Pengaturan"
        subtitle="Kelola preferensi aplikasi"
        onPress={() => Alert.alert("Info", "Segera tersedia")}
        theme={theme}
      />
      <MenuItem
        icon="info-circle"
        title="Tentang"
        subtitle="Informasi aplikasi"
        onPress={() => Alert.alert("Kuliner App v1.0.0")}
        theme={theme}
      />
      <MenuItem
        icon="sign-out"
        title="Keluar"
        onPress={() => Alert.alert("Logout")}
        showArrow={false}
        theme={theme}
      />

      <RNView style={{ height: 24 }} />
    </ScrollView>
  );
}

/* ================= SUB COMPONENTS ================= */

function Avatar({ uri }: { uri?: string }) {
  return (
    <RNView style={styles.avatarWrapper}>
      {uri ? (
        <Image source={{ uri }} style={styles.avatar} />
      ) : (
        <RNView style={styles.avatarPlaceholder}>
          <FontAwesome name="user" size={36} color="#aaa" />
        </RNView>
      )}
    </RNView>
  );
}

function Stats({ stats, theme }: { stats: ProfileStats; theme: any }) {
  return (
    <RNView style={[styles.statsBox, { backgroundColor: theme.surface }]}>
      <StatItem label="Favorit" value={stats.totalFavorites} theme={theme} />
      <Divider theme={theme} />
      <StatItem label="Review" value={stats.totalReviews} theme={theme} />
      <Divider theme={theme} />
      <StatItem label="Like" value={stats.totalReviewLikes} theme={theme} />
    </RNView>
  );
}

function StatItem({
  label,
  value,
  theme,
}: {
  label: string;
  value: number;
  theme: any;
}) {
  return (
    <RNView style={styles.statItem}>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={{ color: theme.textSecondary }}>{label}</Text>
    </RNView>
  );
}

function Divider({ theme }: { theme: any }) {
  return <RNView style={[styles.divider, { backgroundColor: theme.border }]} />;
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  theme,
}: MenuItemProps & { theme: any }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.menuItem, { backgroundColor: theme.surface }]}
    >
      <RNView style={styles.menuLeft}>
        <RNView
          style={[styles.menuIcon, { backgroundColor: theme.secondPrimary }]}
        >
          <FontAwesome name={icon} size={22} color={theme.tint} />
        </RNView>

        <RNView>
          <Text style={[styles.menuTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={{ color: theme.textSecondary }}>{subtitle}</Text>
          )}
        </RNView>
      </RNView>

      {showArrow && (
        <FontAwesome
          name="chevron-right"
          size={16}
          color={theme.tabIconDefault}
        />
      )}
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
  },

  avatarWrapper: { marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  name: { fontSize: 22, fontWeight: "bold" },

  statsBox: {
    flexDirection: "row",
    marginTop: 10,
    marginHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  statValue: { fontSize: 22, fontWeight: "bold" },
  divider: { width: 1, marginVertical: 8 },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 14,
    elevation: 2,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});
