import { FontFamily } from '@/constants/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const Header = () => {
  const { language, t } = useLanguage();
  const { colorScheme } = useTheme();
  const { user } = useAuth();
  const isRTL = language === 'ar';
  const { toggleSidebar } = useSidebar();

  const userName = user?.first_name || user?.username || 'User';

  const logoSource = colorScheme === 'dark'
    ? require('@/assets/images/logo-dark.png')
    : require('@/assets/images/logo.png');

  const MenuIcon = (
    <TouchableOpacity style={styles.iconWrapper} onPress={toggleSidebar}>
      <Feather name="menu" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const FavoriteIcon = (
    <TouchableOpacity style={styles.iconWrapper}>
      <Ionicons name="bookmark-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, isRTL && styles.rtl]}>
      {/* Left Icon */}
      <View style={styles.sideIcon}>{isRTL ? MenuIcon : FavoriteIcon}</View>

      {/* Logo and Text Block */}
      <ThemedView style={styles.textContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={logoSource}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <ThemedText style={[styles.welcomeText, { textAlign: isRTL ? 'right' : 'left', fontFamily: FontFamily.arabicBold }]}>
          👋 {t('header.welcome', { name: userName })}
        </ThemedText>
        <ThemedText style={[styles.subText, { textAlign: isRTL ? 'right' : 'left', fontFamily: FontFamily.arabic }]}>
          {t('header.subtitle')}
        </ThemedText>
      </ThemedView>

      {/* Right Icon */}
      <View style={styles.sideIcon}>{isRTL ? FavoriteIcon : MenuIcon}</View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#002524',
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  sideIcon: {
    width: 40,
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 80,
    height: 40,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
});

export default Header;
