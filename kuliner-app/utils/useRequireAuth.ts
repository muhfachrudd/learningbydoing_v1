import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

/**
 * Hook to handle protected actions that require authentication.
 * If user is not logged in, shows a prompt and redirects to login.
 *
 * Usage:
 * const { requireAuth } = useRequireAuth();
 *
 * // In your component:
 * const handleFavorite = () => {
 *   if (!requireAuth('menambahkan favorit')) return;
 *   // ... do favorite logic
 * }
 */
export function useRequireAuth() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const requireAuth = (actionName: string = "melakukan aksi ini"): boolean => {
    if (!isLoggedIn) {
      Alert.alert("Login Diperlukan", `Anda perlu login untuk ${actionName}.`, [
        {
          text: "Nanti",
          style: "cancel",
        },
        {
          text: "Login",
          onPress: () => router.push("/auth/login"),
        },
      ]);
      return false;
    }
    return true;
  };

  return { requireAuth, isLoggedIn };
}
