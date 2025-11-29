// components/AppHeader.tsx
// New attractive header using UI Kitten

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, Card, Icon, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title?: string;
  showUserInfo?: boolean;
}

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: { en: 'New Achievement!', ar: 'إنجاز جديد!' },
    message: { en: 'You completed your 7-day streak!', ar: 'لقد أكملت سلسلة 7 أيام!' },
  },
  {
    id: '2',
    title: { en: 'Daily Message', ar: 'رسالة يومية' },
    message: { en: 'Your personalized message is ready', ar: 'رسالتك الشخصية جاهزة' },
  },
  {
    id: '3',
    title: { en: 'Goal Reminder', ar: 'تذكير الأهداف' },
    message: { en: "Don't forget to set your goals", ar: 'لا تنسَ تحديد أهدافك' },
  },
];

export default function AppHeader({ title, showUserInfo = true }: AppHeaderProps) {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { colors, colorScheme, toggleColorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const userName = user?.first_name || user?.username || 'User';
  const isRTL = language === 'ar';

  const isDark = colorScheme === 'dark';
  const headerBg = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const iconColor = isDark ? '#FFFFFF' : '#000000';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: headerBg }]}>
      <View style={[styles.content, isRTL && styles.contentRTL]}>
        {/* Left Section - User Info or Title */}
        <View style={[styles.leftSection, isRTL && styles.leftSectionRTL]}>
          {showUserInfo ? (
            <>
              <Avatar
                size="small"
                style={styles.avatar}
                source={{ uri: `https://ui-avatars.com/api/?name=${userName}&background=random` }}
              />
              <View style={styles.userInfo}>
                <Text style={[styles.greeting, { color: textColor }]}>
                  {t('header.welcome')}
                </Text>
                <Text style={[styles.userName, { color: textColor }]}>{userName}</Text>
              </View>
            </>
          ) : (
            <Text style={[styles.title, { color: textColor }]}>{title || t('motivation.appName')}</Text>
          )}
        </View>

        {/* Right Section - Actions */}
        <View style={[styles.rightSection, isRTL && styles.rightSectionRTL]}>
          {/* Language Toggle */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}
            onPress={() => setShowLanguageMenu(true)}
          >
            <Icon
              name="globe-outline"
              style={styles.icon}
              fill={iconColor}
            />
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}
            onPress={toggleColorScheme}
          >
            <Icon
              name={colorScheme === 'dark' ? 'sun-outline' : 'moon-outline'}
              style={styles.icon}
              fill={iconColor}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}
            onPress={() => setShowNotifications(!showNotifications)}
          >
            <Icon name="bell-outline" style={styles.icon} fill={iconColor} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{MOCK_NOTIFICATIONS.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Dropdown */}
      {showNotifications && (
        <View style={[styles.dropdown, isRTL ? { left: 20 } : { right: 20 }, { backgroundColor: headerBg, borderColor: isDark ? '#2D3748' : '#E2E8F0' }]}>
          <View style={[styles.dropdownHeader, isRTL && styles.dropdownHeaderRTL]}>
            <Text category="h6" style={{ color: textColor }}>{t('notifications.title')}</Text>
            <TouchableOpacity onPress={() => setShowNotifications(false)}>
              <Icon name="close-outline" style={styles.closeIcon} fill={iconColor} />
            </TouchableOpacity>
          </View>
          {MOCK_NOTIFICATIONS.map((notification) => (
            <Card key={notification.id} style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Icon name="bell-outline" style={styles.notificationIcon} fill="#6366f1" />
                <View style={styles.notificationText}>
                  <Text category="s1" style={[styles.notificationTitle, isRTL && styles.textRTL]}>
                    {language === 'ar' ? notification.title.ar : notification.title.en}
                  </Text>
                  <Text category="p2" appearance="hint" style={[isRTL && styles.textRTL]}>
                    {language === 'ar' ? notification.message.ar : notification.message.en}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Language Modal */}
      <Modal
        visible={showLanguageMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, isRTL ? styles.modalOverlayRTL : styles.modalOverlayLTR]}
          activeOpacity={1}
          onPress={() => setShowLanguageMenu(false)}
        >
          <View style={[styles.languageMenu, { backgroundColor: headerBg, borderColor: isDark ? '#2D3748' : '#E2E8F0' }]}>
            <Text category="h6" style={[styles.menuTitle, { color: textColor }]}>
              {t('profile.language')}
            </Text>

            <TouchableOpacity
              style={[styles.languageOption, language === 'en' && styles.languageOptionActive]}
              onPress={() => {
                setLanguage('en');
                setShowLanguageMenu(false);
              }}
            >
              <View style={styles.languageRow}>
                <Text style={styles.flag}>🇬🇧</Text>
                <Text style={[styles.languageText, { color: textColor }]}>English</Text>
              </View>
              {language === 'en' && <Icon name="checkmark-outline" style={styles.checkIcon} fill="#48BB78" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageOption, language === 'ar' && styles.languageOptionActive]}
              onPress={() => {
                setLanguage('ar');
                setShowLanguageMenu(false);
              }}
            >
              <View style={styles.languageRow}>
                <Text style={styles.flag}>🇸🇦</Text>
                <Text style={[styles.languageText, { color: textColor }]}>العربية</Text>
              </View>
              {language === 'ar' && <Icon name="checkmark-outline" style={styles.checkIcon} fill="#48BB78" />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentRTL: {
    flexDirection: 'row-reverse',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leftSectionRTL: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightSectionRTL: {
    flexDirection: 'row-reverse',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  icon: {
    width: 24,
    height: 24,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    width: 320,
    maxHeight: 400,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dropdownHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  notificationItem: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    marginTop: 2,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  languageMenu: {
    width: 200,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuTitle: {
    marginBottom: 12,
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  languageOptionActive: {
    backgroundColor: 'rgba(72, 187, 120, 0.1)',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 24,
  },
  languageText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  modalOverlayLTR: {
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  modalOverlayRTL: {
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
});
