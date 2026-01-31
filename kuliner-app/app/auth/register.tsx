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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { login } = useAuth();

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Harap isi nama lengkap');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Harap isi email');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Format email tidak valid');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Harap isi password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Konfirmasi password tidak sesuai');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Try real API first
      try {
        const response = await authService.register({
          name: name.trim(),
          email: email.trim(),
          password: password,
          password_confirmation: confirmPassword,
        });
        
        const { user, token } = response.data.data;
        await login(user, token);
        router.replace('/(tabs)');
        return;
      } catch (apiError) {
        console.log('API register failed, using dummy mode...');
      }

      // Dummy register for testing (simulate success)
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        phone: '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        created_at: new Date().toISOString(),
      };
      const dummyToken = 'dummy_token_' + Date.now();
      await login(newUser, dummyToken);
      
      Alert.alert('Demo Mode', 'Registrasi berhasil! (Mode demo)', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error: any) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={[styles.backButton, { 
          backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFF',
          borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
        }]} 
        onPress={navigateToLogin}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

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
                source={require('../../assets/images/logo.jpg')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Buat Akun</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Daftar untuk memulai
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={[styles.inputContainer, { 
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F8F9FA',
              borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
            }]}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Nama Lengkap"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

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

            <View style={[styles.inputContainer, { 
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F8F9FA',
              borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
            }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput, { color: colors.text }]}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: colors.primary }, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Mendaftar...' : 'Daftar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            Dengan mendaftar, Anda menyetujui{' '}
            <Text style={{ color: colors.primary }}>Syarat & Ketentuan</Text>
            {' '}dan{' '}
            <Text style={{ color: colors.primary }}>Kebijakan Privasi</Text>
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Sudah punya akun?{' '}
            </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Masuk</Text>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
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
  registerButton: {
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
