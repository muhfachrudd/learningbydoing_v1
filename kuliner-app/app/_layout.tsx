import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import CustomSplashScreen from "@/components/SplashScreen";
import { AuthProvider, useAuth } from "@/utils/AuthContext";
import { ThemeProvider, useTheme } from "@/utils/ThemeContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { colorScheme } = useTheme();
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [splashAnimationDone, setSplashAnimationDone] = useState(false);

  const handleSplashFinish = () => {
    setSplashAnimationDone(true);
  };

  // Both conditions must be true to hide splash
  const isReady = !isLoading && splashAnimationDone;

  // Handle navigation after everything is ready
  // Users can now browse without logging in
  // Only redirect to login when accessing protected routes (like profile actions)
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "auth";
    const inProfileGroup = segments[0] === "profile";

    // If user is logged in and in auth screens, redirect to home
    if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }

    // If user is NOT logged in and tries to access profile screens, redirect to login
    if (!isLoggedIn && inProfileGroup) {
      router.replace("/auth/login");
    }

    // Note: We no longer force login for home/browse screens
    // Users can explore the app without logging in
  }, [isLoggedIn, isReady, segments]);

  // Show splash until both animation is done AND auth is ready
  if (!isReady) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="vendor-selector" options={{ headerShown: false }} />
        <Stack.Screen name="vendor/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="cuisine/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/settings"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="profile/reviews" options={{ headerShown: false }} />
        <Stack.Screen name="profile/help" options={{ headerShown: false }} />
      </Stack>
    </NavigationThemeProvider>
  );
}
