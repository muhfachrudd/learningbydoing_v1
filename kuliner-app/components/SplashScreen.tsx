import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = new Animated.Value(0);
  const logoPulse = new Animated.Value(1);
  const titleOpacity = new Animated.Value(0);
  const subtitleOpacity = new Animated.Value(0);
  const dot1Scale = new Animated.Value(0.5);
  const dot2Scale = new Animated.Value(0.5);
  const dot3Scale = new Animated.Value(0.5);

  useEffect(() => {
    const animateSequence = () => {
      // Logo scale animation
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        // Start pulsing animation after logo appears
        Animated.loop(
          Animated.sequence([
            Animated.timing(logoPulse, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(logoPulse, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });

      // Title fade in animation
      setTimeout(() => {
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 500);

      // Subtitle fade in animation
      setTimeout(() => {
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 1000);

      // Loading dots animation
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dot1Scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Scale, {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.sequence([
            Animated.timing(dot2Scale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Scale, {
              toValue: 0.5,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            Animated.sequence([
              Animated.timing(dot3Scale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(dot3Scale, {
                toValue: 0.5,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setTimeout(animateDots, 200);
            });
          });
        });
      };

      setTimeout(() => {
        animateDots();
      }, 1500);

      // Finish splash screen
      setTimeout(() => {
        onFinish();
      }, 3500); // Increased time to 3.5 seconds
    };

    animateSequence();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      
      <LinearGradient
        colors={['#FF6B6B', '#FFE66D', '#FF6B6B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo Container */}
          <Animated.View 
            style={[
              styles.logoContainer,
              { 
                transform: [
                  { scale: logoScale },
                  { scale: logoPulse }
                ] 
              }
            ]}
          >
            <View style={styles.logoCircle}>
              <FontAwesome name="cutlery" size={60} color="#FFF" />
            </View>
          </Animated.View>

          {/* App Name */}
          <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
            <Text style={styles.appName}>Kuliner App</Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
            <Text style={styles.subtitle}>Discover Amazing Local Foods</Text>
          </Animated.View>

          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              <Animated.View style={[styles.dot, { transform: [{ scale: dot1Scale }] }]} />
              <Animated.View style={[styles.dot, { transform: [{ scale: dot2Scale }] }]} />
              <Animated.View style={[styles.dot, { transform: [{ scale: dot3Scale }] }]} />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for food lovers</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  titleContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
