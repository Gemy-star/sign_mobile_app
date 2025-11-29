import { FontFamily } from '@/constants/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

const Sidebar = () => {
  const { isVisible, toggleSidebar } = useSidebar();
  const { language, t } = useLanguage();
  const { colorScheme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isRTL = language === 'ar';

  const userName = user?.first_name || user?.username || 'User';

  const logoSource = colorScheme === 'dark'
    ? require('@/assets/images/logo-dark.png')
    : require('@/assets/images/logo.png');

  if (!isVisible) return null;

  const menuItems = [
    {
      label: t('sidebar.eventSchedule'),
      icon: <FontAwesome5 name="calendar-alt" size={20} color="#fff" />,
    },
    {
      label: t('sidebar.speakers'),
      icon: <Ionicons name="mic" size={20} color="#fff" />,
    },
    {
      label: t('sidebar.attendees'),
      icon: <MaterialCommunityIcons name="account-group" size={20} color="#fff" />,
    },
    {
      label: t('sidebar.exhibitions'),
      icon: <Ionicons name="book" size={20} color="#fff" />,
    },
    {
      label: t('sidebar.floorPlan'),
      icon: <Entypo name="map" size={20} color="#fff" />,
    },
    {
      label: t('sidebar.location'),
      icon: <Ionicons name="location-sharp" size={20} color="#fff" />,
    },
  ];

  return (
    <>
      {/* Overlay to close sidebar */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleSidebar} />

      {/* Sidebar */}
      <LinearGradient
        colors={['#002524', '#0a3a34']}
        style={[
          styles.sidebar,
          {
            top: HEADER_HEIGHT,
            height: SCREEN_HEIGHT - HEADER_HEIGHT - insets.bottom,
            [isRTL ? 'right' : 'left']: 0,
          },
        ]}
      >
        <View style={styles.sidebarLogoContainer}>
          <Image
            source={logoSource}
            style={styles.sidebarLogo}
            resizeMode="contain"
          />
        </View>

        {/* User Welcome */}
        <View style={[styles.userSection, isRTL && { alignItems: 'flex-end' }]}>
          <ThemedText style={[styles.userWelcome, { fontFamily: FontFamily.arabic, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('sidebar.welcome')}
          </ThemedText>
          <ThemedText style={[styles.userName, { fontFamily: FontFamily.arabicBold, textAlign: isRTL ? 'right' : 'left' }]}>
            {userName}
          </ThemedText>
          <ThemedText style={[styles.userSubtitle, { fontFamily: FontFamily.arabic, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('sidebar.subtitle')}
          </ThemedText>
        </View>

        <ScrollView contentContainerStyle={[styles.menu, { paddingBottom: insets.bottom + 20 }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isRTL && { flexDirection: 'row-reverse' }]}
            >
              <View style={styles.icon}>{item.icon}</View>
              <ThemedText style={[styles.menuText, { fontFamily: FontFamily.arabic, textAlign: isRTL ? 'right' : 'left' }]}>{item.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9998,
  },
  sidebar: {
    position: 'absolute',
    width: 250,
    paddingHorizontal: 16,
    paddingTop: 24,
    zIndex: 9999, // on top of overlay and tab bar
    elevation: 20, // Android elevation
    overflow: 'hidden',
  },
  sidebarLogoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  sidebarLogo: {
    width: 120,
    height: 60,
  },
  userSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  userWelcome: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 4,
  },
  userSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  menu: {
    gap: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  icon: {
    width: 24,
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Sidebar;
