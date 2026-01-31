// app/(tabs)/profile.tsx
// User Profile Screen with UI Kitten

import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import HelpSupportScreen from '@/screens/HelpSupportScreen';
import PrivacySecurityScreen from '@/screens/PrivacySecurityScreen';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { setPreferences } from '@/store/slices/profileSlice';
import { Button, Card, Icon, Layout, Text, Toggle } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  // Context for UI preferences (theme, language)
  const { colors, colorScheme, toggleColorScheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  // Redux for global app-wide state (auth, profile)
  const { user } = useAppSelector((state) => state.auth);
  const { preferences } = useAppSelector((state) => state.profile);

  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.notifications);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPrivacySecurity, setShowPrivacySecurity] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);

  const isRTL = language === 'ar';

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: () => {
            dispatch(logoutAction());
          },
        },
      ]
    );
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang); // Context handles language (UI preference)
  };

  const handleToggleTheme = () => {
    toggleColorScheme(); // Context handles theme (UI preference)
  };

  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    dispatch(setPreferences({ notifications: value })); // Redux handles profile preferences (global state)
  };

  return (
    <Layout style={styles.container} level="1">
      <AppHeader title={t('profile.title')} showUserInfo={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Icon name="person-outline" style={styles.profileIcon} fill="#ffffff" />
          </LinearGradient>
          <Text category="h5" style={styles.userName}>
            {user?.username || 'Guest User'}
          </Text>
          <Text category="p2" appearance="hint">
            {user?.email || 'user@example.com'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text category="h6">12</Text>
              <Text category="c1" appearance="hint">{t('profile.goals')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text category="h6">45</Text>
              <Text category="c1" appearance="hint">{t('profile.messagesCount')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text category="h6">7</Text>
              <Text category="c1" appearance="hint">{t('profile.streak')}</Text>
            </View>
          </View>
        </Card>

        {/* Settings Section */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('profile.preferences')}
        </Text>

        <Card style={styles.settingCard}>
          <TouchableOpacity activeOpacity={1}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="moon-outline" style={styles.iconStyle} />
                <Text category="s1" style={styles.settingText}>{t('profile.darkMode')}</Text>
              </View>
              <Toggle checked={colorScheme === 'dark'} onChange={handleToggleTheme} />
            </View>
          </TouchableOpacity>
        </Card>

        <TouchableOpacity onPress={toggleLanguage} activeOpacity={0.7}>
          <Card style={styles.settingCard}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="globe-outline" style={styles.iconStyle} />
                <Text category="s1" style={styles.settingText}>{t('profile.language')}</Text>
              </View>
              <Text category="s1" style={styles.languageText}>
                {language === 'ar' ? t('profile.arabic') : t('profile.english')}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        <Card style={styles.settingCard}>
          <TouchableOpacity activeOpacity={1}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="bell-outline" style={styles.iconStyle} />
                <Text category="s1" style={styles.settingText}>{t('profile.notifications')}</Text>
              </View>
              <Toggle checked={notificationsEnabled} onChange={handleToggleNotifications} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Account Section */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('profile.account')}
        </Text>

        <TouchableOpacity onPress={() => setShowChangePassword(true)} activeOpacity={0.7}>
          <Card style={styles.settingCard}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="lock-outline" style={styles.iconStyle} />
                <Text category="s1" style={styles.settingText}>{t('profile.changePassword')}</Text>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowPrivacySecurity(true)} activeOpacity={0.7}>
          <Card style={styles.settingCard}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="shield-outline" style={styles.iconStyle} />
                <Text category="s1" style={styles.settingText}>{t('profile.privacySecurity')}</Text>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} />
            </View>
          </Card>
        </TouchableOpacity>

        {/* More Section */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('profile.more')}
        </Text>

        <TouchableOpacity onPress={() => setShowHelpSupport(true)} activeOpacity={0.7}>
          <Card style={styles.settingCard}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="question-mark-circle-outline" style={styles.iconStyle} />
                <Text category="s1" style={styles.settingText}>{t('profile.helpSupport')}</Text>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity>
          <Card style={styles.settingCard}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="star-outline" style={styles.iconStyle} />
                <Text category="s1" style={styles.settingText}>{t('profile.rateApp')}</Text>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} />
            </View>
          </Card>
        </TouchableOpacity>

        {/* Logout Button */}
        <Button
          onPress={handleLogout}
          status="danger"
          accessoryLeft={(props) => <Icon {...props} name="log-out-outline" />}
          style={styles.logoutButton}
        >
          {() => <Text>{t('profile.logout')}</Text>}
        </Button>
      </ScrollView>

      {/* Modals */}
      <Modal
        visible={showChangePassword}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowChangePassword(false)}
      >
        <ChangePasswordScreen
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => {
            setShowChangePassword(false);
            Alert.alert(
              t('common.success') || 'Success',
              t('changePassword.success') || 'Password changed successfully!'
            );
          }}
        />
      </Modal>

      <Modal
        visible={showPrivacySecurity}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowPrivacySecurity(false)}
      >
        <PrivacySecurityScreen onClose={() => setShowPrivacySecurity(false)} />
      </Modal>

      <Modal
        visible={showHelpSupport}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowHelpSupport(false)}
      >
        <HelpSupportScreen onClose={() => setShowHelpSupport(false)} />
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  profileCard: {
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginTop: 8,
    marginBottom: 12,
  },
  textRTL: {
    textAlign: 'right',
  },
  settingCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingRowRTL: {
    flexDirection: 'row-reverse',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLeftRTL: {
    flexDirection: 'row-reverse',
  },
  settingText: {
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  languageText: {
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  logoutButton: {
    marginTop: 24,
    borderRadius: 12,
  },
  statIcon: {
    width: 20,
    height: 20,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  profileIcon: {
    width: 48,
    height: 48,
  },
});
