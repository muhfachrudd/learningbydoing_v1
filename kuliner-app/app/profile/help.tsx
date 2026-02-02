import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, {
  FadeInUp,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "Apa itu Hidden Gems Finder?",
    answer:
      "Hidden Gems Finder adalah aplikasi untuk menemukan tempat kuliner tersembunyi yang berkualitas tinggi tapi belum banyak diketahui orang. Kami membantu Anda menemukan tempat makan lokal autentik dengan rating tinggi namun masih sepi pengunjung.",
  },
  {
    id: 2,
    question: "Bagaimana cara menentukan Hidden Gem?",
    answer:
      "Hidden Gem ditentukan berdasarkan kombinasi rating tinggi (4.5+), jumlah review yang masih sedikit (<100), dan rekomendasi dari komunitas lokal. Ini memastikan tempat tersebut berkualitas tapi belum mainstream.",
  },
  {
    id: 3,
    question: "Bagaimana cara menyimpan tempat favorit?",
    answer:
      "Anda bisa menyimpan tempat favorit dengan menekan tombol hati/love pada halaman detail vendor atau cuisine. Semua tempat yang disimpan akan muncul di tab Favorit.",
  },
  {
    id: 4,
    question: "Apakah data lokasi saya aman?",
    answer:
      "Ya, kami sangat menjaga privasi Anda. Data lokasi hanya digunakan untuk menampilkan hidden gems di sekitar Anda dan tidak dibagikan ke pihak ketiga.",
  },
  {
    id: 5,
    question: "Bagaimana cara memberikan review?",
    answer:
      "Buka halaman detail makanan (cuisine), scroll ke bagian bawah dan Anda akan menemukan form untuk menulis review beserta rating bintang.",
  },
  {
    id: 6,
    question: "Bagaimana cara menghubungi vendor?",
    answer:
      "Di halaman detail vendor, Anda bisa menekan tombol 'Telepon' untuk menghubungi langsung atau 'Petunjuk Arah' untuk navigasi ke lokasi.",
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const isDark = scheme === "dark";
  const HEADER_HEIGHT = 140;

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
      [0, -20],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [1, 0.9],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactEmail = () => {
    Linking.openURL(
      "mailto:support@hiddengemsfinder.com?subject=Bantuan%20Aplikasi",
    );
  };

  const handleContactWhatsApp = () => {
    Linking.openURL(
      "https://wa.me/6281234567890?text=Halo,%20saya%20butuh%20bantuan%20dengan%20aplikasi%20Hidden%20Gems%20Finder",
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Animated.View style={[styles.headerWrapper, headerAnimatedStyle]}>
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bantuan</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Hubungi Kami
          </Text>
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={[styles.contactCard, { backgroundColor: colors.surface }]}
              onPress={handleContactEmail}
            >
              <View
                style={[styles.contactIcon, { backgroundColor: "#3B82F620" }]}
              >
                <Ionicons name="mail" size={24} color="#3B82F6" />
              </View>
              <Text style={[styles.contactTitle, { color: colors.text }]}>
                Email
              </Text>
              <Text
                style={[
                  styles.contactSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                support@app.com
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactCard, { backgroundColor: colors.surface }]}
              onPress={handleContactWhatsApp}
            >
              <View
                style={[styles.contactIcon, { backgroundColor: "#22C55E20" }]}
              >
                <Ionicons name="logo-whatsapp" size={24} color="#22C55E" />
              </View>
              <Text style={[styles.contactTitle, { color: colors.text }]}>
                WhatsApp
              </Text>
              <Text
                style={[
                  styles.contactSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Chat langsung
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* FAQ */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Pertanyaan Umum (FAQ)
          </Text>
          {FAQ_DATA.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(300 + index * 50)}
            >
              <TouchableOpacity
                style={[styles.faqItem, { backgroundColor: colors.surface }]}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <MaterialCommunityIcons
                    name="frequently-asked-questions"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>
                    {item.question}
                  </Text>
                  <Ionicons
                    name={
                      expandedId === item.id ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
                {expandedId === item.id && (
                  <Text
                    style={[styles.faqAnswer, { color: colors.textSecondary }]}
                  >
                    {item.answer}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Tips */}
        <Animated.View entering={FadeInUp.delay(500)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Tips Menggunakan Aplikasi
          </Text>
          <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.tipItem}>
              <View
                style={[styles.tipBullet, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.tipNumber}>1</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Aktifkan lokasi untuk menemukan hidden gems di sekitarmu
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View
                style={[styles.tipBullet, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.tipNumber}>2</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Filter berdasarkan kategori untuk pencarian lebih spesifik
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View
                style={[styles.tipBullet, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.tipNumber}>3</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Simpan tempat favorit agar mudah dikunjungi lagi
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View
                style={[styles.tipBullet, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.tipNumber}>4</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Berikan review untuk membantu pengguna lain
              </Text>
            </View>
          </View>
        </Animated.View>
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
  scrollContent: {
    paddingTop: 150,
    paddingHorizontal: 20,
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
  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  contactCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  contactSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  faqItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  tipsCard: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  tipNumber: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
