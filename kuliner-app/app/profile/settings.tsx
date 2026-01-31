import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

interface SettingItemProps {
  icon: string;
  iconType?: "ionicons" | "material";
  title: string;
  subtitle?: string;
  type: "toggle" | "arrow" | "info";
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  iconColor?: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const isDark = scheme === "dark";

  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [darkMode, setDarkMode] = useState(isDark);
  const [autoPlay, setAutoPlay] = useState(false);

  const SettingItem = ({
    icon,
    iconType = "ionicons",
    title,
    subtitle,
    type,
    value,
    onToggle,
    onPress,
    iconColor,
  }: SettingItemProps) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={type === "toggle"}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: (iconColor || colors.primary) + "20" },
        ]}
      >
        {iconType === "ionicons" ? (
          <Ionicons name={icon as any} size={22} color={iconColor || colors.primary} />
        ) : (
          <MaterialCommunityIcons
            name={icon as any}
            size={22}
            color={iconColor || colors.primary}
          />
        )}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {type === "toggle" && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + "50" }}
          thumbColor={value ? colors.primary : "#f4f3f4"}
        />
      )}
      {type === "arrow" && (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={isDark ? [colors.primary, "#CC5500"] : [colors.primary, "#FF8533"]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferences */}
        <Animated.View entering={FadeInUp.delay(100)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Preferensi
          </Text>
          <View style={styles.section}>
            <SettingItem
              icon="notifications-outline"
              title="Notifikasi"
              subtitle="Terima pemberitahuan hidden gems baru"
              type="toggle"
              value={notifications}
              onToggle={setNotifications}
            />
            <SettingItem
              icon="location-outline"
              title="Akses Lokasi"
              subtitle="Untuk menemukan gems di sekitarmu"
              type="toggle"
              value={locationAccess}
              onToggle={setLocationAccess}
            />
            <SettingItem
              icon="moon-outline"
              title="Mode Gelap"
              subtitle="Tampilan lebih nyaman di malam hari"
              type="toggle"
              value={darkMode}
              onToggle={(value) => {
                setDarkMode(value);
                Alert.alert("Info", "Perubahan tema akan diterapkan saat restart aplikasi");
              }}
            />
          </View>
        </Animated.View>

        {/* Account */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Akun
          </Text>
          <View style={styles.section}>
            <SettingItem
              icon="key-outline"
              title="Ubah Password"
              type="arrow"
              onPress={() => Alert.alert("Info", "Fitur segera hadir!")}
            />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Privasi & Keamanan"
              type="arrow"
              onPress={() => Alert.alert("Info", "Fitur segera hadir!")}
              iconColor="#10B981"
            />
            <SettingItem
              icon="link-outline"
              title="Akun Terhubung"
              subtitle="Google, Facebook"
              type="arrow"
              onPress={() => Alert.alert("Info", "Fitur segera hadir!")}
              iconColor="#3B82F6"
            />
          </View>
        </Animated.View>

        {/* Data */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Data & Penyimpanan
          </Text>
          <View style={styles.section}>
            <SettingItem
              icon="trash-outline"
              title="Hapus Cache"
              subtitle="Bersihkan data sementara"
              type="arrow"
              onPress={() =>
                Alert.alert("Hapus Cache", "Apakah Anda yakin ingin menghapus cache?", [
                  { text: "Batal", style: "cancel" },
                  { text: "Hapus", style: "destructive", onPress: () => Alert.alert("Berhasil", "Cache telah dihapus") },
                ])
              }
              iconColor="#EF4444"
            />
            <SettingItem
              icon="download-outline"
              title="Download Data"
              subtitle="Unduh semua data Anda"
              type="arrow"
              onPress={() => Alert.alert("Info", "Fitur segera hadir!")}
              iconColor="#8B5CF6"
            />
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Tentang
          </Text>
          <View style={styles.section}>
            <SettingItem
              icon="document-text-outline"
              title="Syarat & Ketentuan"
              type="arrow"
              onPress={() => Alert.alert("Info", "Akan membuka halaman Syarat & Ketentuan")}
            />
            <SettingItem
              icon="lock-closed-outline"
              title="Kebijakan Privasi"
              type="arrow"
              onPress={() => Alert.alert("Info", "Akan membuka halaman Kebijakan Privasi")}
            />
            <SettingItem
              icon="information-circle-outline"
              title="Versi Aplikasi"
              subtitle="1.0.0 (Build 2026.02.01)"
              type="info"
            />
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View entering={FadeInUp.delay(500)}>
          <Text style={[styles.sectionTitle, { color: "#EF4444" }]}>Zona Bahaya</Text>
          <View style={styles.section}>
            <SettingItem
              icon="person-remove-outline"
              title="Hapus Akun"
              subtitle="Hapus akun dan semua data secara permanen"
              type="arrow"
              onPress={() =>
                Alert.alert(
                  "Hapus Akun",
                  "Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.",
                  [
                    { text: "Batal", style: "cancel" },
                    { text: "Hapus Akun", style: "destructive" },
                  ]
                )
              }
              iconColor="#EF4444"
            />
          </View>
        </Animated.View>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
