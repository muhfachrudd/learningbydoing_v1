import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  ScrollView 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { userService, User } from '@/services/apiServices';

interface ProfileStats {
  totalFavorites: number;
  totalReviews: number;
  totalReviewLikes: number;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    totalFavorites: 0,
    totalReviews: 0,
    totalReviewLikes: 0,
  });
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  const fetchProfile = async () => {
    try {
      const userResponse = await userService.getProfile();
      const statsResponse = await userService.getStats();

      setUser(userResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    Alert.alert('Info', 'Fitur edit profil akan segera tersedia');
  };

  const handleSettings = () => {
    Alert.alert('Info', 'Fitur pengaturan akan segera tersedia');
  };

  const handleAbout = () => {
    Alert.alert(
      'Tentang Aplikasi',
      'Kuliner App v1.0.0\n\nAplikasi untuk menemukan kuliner terbaik di sekitar Anda.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            // Implement logout logic here
            Alert.alert('Info', 'Fitur logout akan segera diimplementasi');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
    });
  };

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <FontAwesome name={icon as any} size={20} color={Colors[colorScheme ?? 'light'].tint} />
        </View>
        <View>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <FontAwesome name="chevron-right" size={16} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name="user" size={40} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.name || 'Nama Pengguna'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
        {user?.created_at && (
          <Text style={styles.joinDate}>Bergabung {formatDate(user.created_at)}</Text>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalFavorites}</Text>
          <Text style={styles.statLabel}>Favorit</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalReviews}</Text>
          <Text style={styles.statLabel}>Review</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalReviewLikes}</Text>
          <Text style={styles.statLabel}>Like</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon="edit"
          title="Edit Profil"
          subtitle="Ubah informasi profil Anda"
          onPress={handleEditProfile}
        />
        
        <MenuItem
          icon="cog"
          title="Pengaturan"
          subtitle="Kelola preferensi aplikasi"
          onPress={handleSettings}
        />
        
        <MenuItem
          icon="info-circle"
          title="Tentang"
          subtitle="Informasi aplikasi"
          onPress={handleAbout}
        />
        
        <MenuItem
          icon="sign-out"
          title="Keluar"
          onPress={handleLogout}
          showArrow={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  menuContainer: {
    backgroundColor: 'white',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
