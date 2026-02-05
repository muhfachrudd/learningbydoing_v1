import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  useColorScheme as useSystemColorScheme,
  Appearance,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  colorScheme: "light" | "dark";
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [theme, setThemeState] = useState<ThemeType>("system");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.log("Error loading theme:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Determine the actual color scheme
  const colorScheme: "light" | "dark" =
    theme === "system" ? (systemColorScheme ?? "light") : theme;

  const isDark = colorScheme === "dark";

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeContext.Provider
      value={{ theme, colorScheme, isDark, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Helper hook that returns the color scheme
export function useAppColorScheme(): "light" | "dark" {
  const { colorScheme } = useTheme();
  return colorScheme;
}
