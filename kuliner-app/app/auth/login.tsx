import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { authService } from '@/services/apiServices';
import { useAuth } from '@/utils/AuthContext';

// Dummy credentials for testing without backend
const DUMMY_USER = {
  id: 1,
  name: 'John Doe',
  email: 'demo@kuliner.app',
  phone: '08123456789',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  created_at: new Date().toISOString(),
};
const DUMMY_PASSWORD = 'password123';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Harap isi email dan password');
      return;
    }

    setLoading(true);
    try {
      // Try real API first
      try {
        const response = await authService.login(email.trim(), password);
        const { user, token } = response.data.data;
        await login(user, token);
        router.replace('/(tabs)');
        return;
      } catch (apiError) {
        // If API fails, check dummy credentials
        console.log('API login failed, checking dummy credentials...');
      }

      // Dummy login for testing
      if (email.trim() === DUMMY_USER.email && password === DUMMY_PASSWORD) {
        const dummyToken = 'dummy_token_' + Date.now();
        await login(DUMMY_USER, dummyToken);
        Alert.alert('Demo Mode', 'Login berhasil dengan akun demo!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') },
        ]);
      } else {
        Alert.alert('Error', 'Email atau password salah.\n\nGunakan akun demo:\nEmail: demo@kuliner.app\nPassword: password123');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFF' }]}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Selamat Datang</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Masuk untuk melanjutkan
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={[styles.inputContainer, { 
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F8F9FA',
              borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
            }]}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={[styles.inputContainer, { 
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F8F9FA',
              borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
            }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput, { color: colors.text }]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Lupa Password', 'Fitur reset password akan segera tersedia.')}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Lupa Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Masuk...' : 'Masuk'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>atau</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFF',
                borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              }]}
              onPress={() => Alert.alert('Google Login', 'Fitur login dengan Google akan segera tersedia.')}
            >
              <FontAwesome name="google" size={20} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFF',
                borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
              }]}
              onPress={() => Alert.alert('Apple Login', 'Fitur login dengan Apple akan segera tersedia.')}
            >
              <FontAwesome name="apple" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.signupText, { color: colors.textSecondary }]}>
              Belum punya akun?{' '}
            </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
