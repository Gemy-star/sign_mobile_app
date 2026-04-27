// components/AppHeader.tsx

import { FontFamily } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppSelector } from '@/store/hooks';
import { Icon, Text } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title?: string;
  showUserInfo?: boolean;
  showBack?: boolean;
}

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: { en: 'New Achievement!', ar: 'إنجاز جديد!' },
    message: { en: 'You completed your 7-day streak!', ar: 'لقد أكملت سلسلة 7 أيام!' },
    icon: 'star-outline',
    iconColor: '#D4A820',
  },
  {
    id: '2',
    title: { en: 'Daily Message', ar: 'رسالة يومية' },
    message: { en: 'Your personalized message is ready', ar: 'رسالتك الشخصية جاهزة' },
    icon: 'message-square-outline',
    iconColor: '#A48111',
  },
  {
    id: '3',
    title: { en: 'Goal Reminder', ar: 'تذكير الأهداف' },
    message: { en: "Don't forget to set your goals", ar: 'لا تنسَ تحديد أهدافك' },
    icon: 'flag-outline',
    iconColor: '#C96F4A',
  },
];

const GOLD = '#A48111';
const CREAM = '#FAF8F5';
const BG = '#311E13';

export default function AppHeader({ title, showUserInfo = true, showBack = false }: AppHeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { t, language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const userName = user?.first_name || user?.username || 'User';
  const isRTL = language === 'ar';
  const unreadCount = MOCK_NOTIFICATIONS.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={[styles.content, isRTL && styles.contentRTL]}>

        {/* Left — Back button (optional) + User info or screen title */}
        <View style={[styles.leftSection, isRTL && styles.leftSectionRTL]}>
          {showBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon
                name={isRTL ? 'arrow-ios-forward-outline' : 'arrow-ios-back-outline'}
                style={styles.backIcon}
                fill={CREAM}
              />
            </TouchableOpacity>
          )}
          {showUserInfo ? (
            <View style={styles.userBlock}>
              <View style={[styles.avatarRing]}>
                <Text style={styles.avatarInitial}>
                  {(user?.first_name || user?.username || 'U')[0].toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={[styles.greeting, isRTL && styles.textRTL]}>
                  {t('header.welcome')}
                </Text>
                <Text style={[styles.userName, isRTL && styles.textRTL]}>{userName}</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.titleWrap, isRTL && styles.titleWrapRTL]}>
              {!showBack && <View style={styles.titleAccent} />}
              <Text style={[styles.title, isRTL && styles.textRTL]}>
                {title || t('motivation.appName')}
              </Text>
            </View>
          )}
        </View>

        {/* Right — Action icons */}
        <View style={[styles.rightSection, isRTL && styles.rightSectionRTL]}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowLanguageMenu(true)}
            activeOpacity={0.7}
          >
            <Icon name="globe-outline" style={styles.icon} fill={CREAM} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowNotifications(!showNotifications)}
            activeOpacity={0.7}
          >
            <Icon name="bell-outline" style={styles.icon} fill={CREAM} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification panel */}
      {showNotifications && (
        <View style={[styles.notifPanel, isRTL ? { left: 16 } : { right: 16 }]}>
          {/* Panel header */}
          <View style={[styles.notifHeader, isRTL && styles.rowRTL]}>
            <Text style={[styles.notifTitle, isRTL && styles.textRTL]}>
              {t('notifications.title')}
            </Text>
            <TouchableOpacity
              onPress={() => setShowNotifications(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="close-outline" style={styles.closeIcon} fill="rgba(250,248,245,0.5)" />
            </TouchableOpacity>
          </View>

          {/* Items */}
          {MOCK_NOTIFICATIONS.map((n, idx) => (
            <View
              key={n.id}
              style={[
                styles.notifItem,
                isRTL && styles.rowRTL,
                idx < MOCK_NOTIFICATIONS.length - 1 && styles.notifItemBorder,
              ]}
            >
              <View style={[styles.notifIconWrap, { backgroundColor: `${n.iconColor}20` }]}>
                <Icon name={n.icon} style={styles.notifIcon} fill={n.iconColor} />
              </View>
              <View style={styles.notifTextWrap}>
                <Text style={[styles.notifItemTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? n.title.ar : n.title.en}
                </Text>
                <Text style={[styles.notifItemMsg, isRTL && styles.textRTL]}>
                  {language === 'ar' ? n.message.ar : n.message.en}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Language modal */}
      <Modal
        visible={showLanguageMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <TouchableOpacity
          style={[
            styles.modalOverlay,
            isRTL ? styles.modalOverlayRTL : styles.modalOverlayLTR,
          ]}
          activeOpacity={1}
          onPress={() => setShowLanguageMenu(false)}
        >
          <View style={styles.langMenu}>
            <Text style={styles.langMenuTitle}>{t('profile.language')}</Text>

            {[
              { code: 'en', label: 'English', flag: '🇬🇧' },
              { code: 'ar', label: 'العربية', flag: '🇸🇦' },
            ].map((lang) => {
              const active = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langOption, active && styles.langOptionActive]}
                  onPress={() => {
                    setLanguage(lang.code as 'en' | 'ar');
                    setShowLanguageMenu(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.langOptionLeft}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                    <Text style={[styles.langLabel, active && { color: GOLD }]}>
                      {lang.label}
                    </Text>
                  </View>
                  {active && (
                    <Icon name="checkmark-outline" style={styles.checkIcon} fill={GOLD} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(164, 129, 17, 0.35)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  contentRTL: { flexDirection: 'row-reverse' },

  // Left / user
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSectionRTL: { flexDirection: 'row-reverse' },

  userBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarRing: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(164,129,17,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(164,129,17,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontFamily: FontFamily.arabicBold,
    color: GOLD,
  },
  greeting: {
    fontSize: 11,
    fontFamily: FontFamily.arabicMedium,
    color: 'rgba(250,248,245,0.5)',
  },
  userName: {
    fontSize: 16,
    fontFamily: FontFamily.arabicBold,
    color: CREAM,
    marginTop: 1,
  },

  // Title
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleWrapRTL: { flexDirection: 'row-reverse' },
  titleAccent: {
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: GOLD,
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.arabicBold,
    color: CREAM,
  },

  // Right / icons
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightSectionRTL: { flexDirection: 'row-reverse' },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(250,248,245,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(250,248,245,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 8,
  },
  backIcon: { width: 22, height: 22 },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(250,248,245,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(250,248,245,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: { width: 20, height: 20 },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: GOLD,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: BG,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: FontFamily.arabicBold,
    color: '#FFFFFF',
  },

  // Notification panel
  notifPanel: {
    position: 'absolute',
    top: 70,
    width: 300,
    backgroundColor: '#1E0D05',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(250,248,245,0.12)',
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    zIndex: 1000,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(250,248,245,0.10)',
  },
  notifTitle: {
    fontSize: 13,
    fontFamily: FontFamily.arabicSemiBold,
    color: CREAM,
    letterSpacing: 0.5,
  },
  closeIcon: { width: 20, height: 20 },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notifItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(250,248,245,0.07)',
  },
  notifIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  notifIcon: { width: 18, height: 18 },
  notifTextWrap: { flex: 1 },
  notifItemTitle: {
    fontSize: 13,
    fontFamily: FontFamily.arabicSemiBold,
    color: CREAM,
    marginBottom: 2,
  },
  notifItemMsg: {
    fontSize: 11,
    fontFamily: FontFamily.arabic,
    color: 'rgba(250,248,245,0.55)',
    lineHeight: 16,
  },

  // Language modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-start',
    paddingTop: 78,
  },
  modalOverlayLTR: { alignItems: 'flex-end', paddingRight: 18 },
  modalOverlayRTL: { alignItems: 'flex-start', paddingLeft: 18 },

  langMenu: {
    width: 190,
    backgroundColor: '#1E0D05',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(250,248,245,0.12)',
    padding: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  langMenuTitle: {
    fontSize: 11,
    fontFamily: FontFamily.arabicSemiBold,
    color: 'rgba(250,248,245,0.4)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 8,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 2,
  },
  langOptionActive: {
    backgroundColor: 'rgba(164,129,17,0.15)',
  },
  langOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flag: { fontSize: 20 },
  langLabel: {
    fontSize: 14,
    fontFamily: FontFamily.arabicMedium,
    color: CREAM,
  },
  checkIcon: { width: 18, height: 18 },

  // Shared
  rowRTL: { flexDirection: 'row-reverse' },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
});
