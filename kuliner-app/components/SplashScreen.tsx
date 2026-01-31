import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Image,
} from "react-native";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation Values (useRef biar ga recreate)
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoTranslateY, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(onFinish, 1500);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.light.primary}
      />

      <View
        style={[styles.background, { backgroundColor: Colors.light.primary }]}
      >
        {/* Decorative Circle */}
        <View style={styles.decorativeCircle} />

        <View style={styles.content}>
          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ translateY: logoTranslateY }],
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={require("../assets/images/logo.jpg")}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          {/* Text */}
          <Animated.View
            style={[styles.textContainer, { opacity: textOpacity }]}
          >
            <Text style={styles.appName}>Kuliner App</Text>
            <Text style={styles.tagline}>Jelajahi Rasa Nusantara</Text>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
          <Text style={styles.versionText}>v1.0.0</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  decorativeCircle: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    marginBottom: 28,
  },

  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    alignItems: "center",
  },

  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 6,
    letterSpacing: -0.5,
  },

  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  footer: {
    position: "absolute",
    bottom: 50,
  },

  versionText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: "500",
  },
});
