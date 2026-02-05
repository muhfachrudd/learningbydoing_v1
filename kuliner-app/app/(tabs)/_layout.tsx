import React from "react";
import { Tabs } from "expo-router";
import { Image, View, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import { useTheme } from "@/utils/ThemeContext";

/* ================= TAB LAYOUT ================= */
export default function TabLayout() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,

        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ],

        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              source={require("../../assets/images/nav/home.png")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="vendors"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              source={require("../../assets/images/nav/search.png")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              source={require("../../assets/images/nav/like.png")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              source={require("../../assets/images/nav/profile.png")}
            />
          ),
        }}
      />
    </Tabs>
  );
}

/* ================= TAB BAR ICON ================= */
interface TabBarIconProps {
  source: any;
  focused: boolean;
}

function TabBarIcon({ source, focused }: TabBarIconProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.iconWrapper}>
      <View
        style={[
          styles.iconContainer,
          focused && {
            backgroundColor: `${colors.primary}15`,
          },
        ]}
      >
        <Image
          source={source}
          resizeMode="contain"
          style={[
            styles.iconImage,
            {
              tintColor: focused ? colors.primary : colors.tabIconDefault,
            },
          ]}
        />
      </View>

      {focused && (
        <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
      )}
    </View>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 15,
  },

  tabBarIcon: {
    width: 30,
    height: 30,
  },

  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    top: 14,
  },

  iconContainer: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "transparent",
  },

  iconImage: {
    width: 24,
    height: 24,
  },

  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});
