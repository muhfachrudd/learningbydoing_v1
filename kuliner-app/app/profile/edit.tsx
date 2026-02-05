import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
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
import { useTheme } from "@/utils/ThemeContext";
import { useAuth } from "@/utils/AuthContext";

export default function EditProfileScreen() {
  const router = useRouter();
  const { colorScheme, isDark } = useTheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
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

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [loading, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Nama tidak boleh kosong");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Email tidak boleh kosong");
      return;
    }

    setSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    Alert.alert("Berhasil", "Profil berhasil diperbarui", [
      { text: "OK", onPress: () => router.back() },
    ]);

    setSaving(false);
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
          <Text style={styles.headerTitle}>Edit Profil</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <Animated.View
            entering={FadeInDown.delay(100)}
            style={styles.avatarSection}
          >
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <LinearGradient
                  colors={[colors.primary, "#FF8533"]}
                  style={styles.avatarPlaceholder}
                >
                  <FontAwesome name="user" size={50} color="#FFF" />
                </LinearGradient>
              )}
              <TouchableOpacity
                style={[
                  styles.editAvatarBtn,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() =>
                  Alert.alert("Info", "Fitur upload foto segera hadir!")
                }
              >
                <Ionicons name="camera" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>
              Ubah Foto
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInUp.delay(200)}
            style={styles.formSection}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Nama Lengkap
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Email
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Masukkan email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Nomor Telepon
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Masukkan nomor telepon"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </Animated.View>

          {/* Save Button */}
          <Animated.View
            entering={FadeInUp.delay(300)}
            style={styles.buttonSection}
          >
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                  <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
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
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  buttonSection: {
    marginTop: 32,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
