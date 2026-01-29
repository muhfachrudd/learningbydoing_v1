import React from "react";
import { Tabs } from "expo-router";
import { Image, View, Platform } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          shadowOpacity: 0,
          height: 90,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -10 },
          shadowRadius: 20,
          elevation: 20,
          borderWidth: 1,
          borderColor: colors.border,
        },
        tabBarShowLabel: false,
        tabBarIconStyle: {
          width: 30,
          height: 30,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={require("../../assets/images/nav/home.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vendors"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={require("../../assets/images/nav/search.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={require("../../assets/images/nav/like.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={require("../../assets/images/nav/profile.png")}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: { source: any; focused: boolean }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        top: 14,
      }}
    >
      <View
        style={{
          padding: 10,
          borderRadius: 20,
          backgroundColor: props.focused
            ? colors.primary + "15"
            : "transparent",
        }}
      >
        <Image
          source={props.source}
          style={{
            width: 24,
            height: 24,
            tintColor: props.focused ? colors.primary : colors.tabIconDefault,
          }}
          resizeMode="contain"
        />
      </View>
      {props.focused && (
        <View
          style={{
            width: 4,
            height: 4,
            backgroundColor: colors.primary,
            borderRadius: 2,
            marginTop: 4,
          }}
        />
      )}
    </View>
  );
}
