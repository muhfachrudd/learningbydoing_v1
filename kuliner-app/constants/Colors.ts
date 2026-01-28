const tintColorLight = '#FF6B00'; // Vivid Orange
const tintColorDark = '#FF8533'; // Lighter Orange for Dark Mode

export default {
  light: {
    text: '#1A1A1A',
    textSecondary: '#666666',
    background: '#F8F9FA', // Off-white
    surface: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    primary: tintColorLight,
    secondary: '#1A1A1A',
    border: '#E5E7EB',
    error: '#DC2626',
    success: '#10B981',
    warning: '#F59E0B',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    background: '#0F172A', // Deep Blue-Grey
    surface: '#1E293B',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    primary: tintColorDark,
    secondary: '#FFFFFF',
    border: '#374151',
    error: '#EF4444',
    success: '#34D399',
    warning: '#FBBF24',
  },
};

