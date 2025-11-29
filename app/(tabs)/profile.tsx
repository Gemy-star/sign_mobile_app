// app/(tabs)/profile.tsx
// User Profile Screen with Logout

import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import {
    Bell,
    ChevronRight,
    Globe,
    HelpCircle,
    Lock,
    LogOut,
    Moon,
    Shield,
    Star,
    Sun,
    User
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { colors, colorScheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { styles, spacing, palette } = useAppStyles();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Profile Header */}
        <View style={[styles.card, styles.center, { marginTop: spacing.lg, marginBottom: spacing.lg }]}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: `${palette.primary}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <User size={48} color={palette.primary} />
          </View>
          <Text style={[styles.heading2, { color: colors.text }]}>
            {user?.username || 'Guest User'}
          </Text>
          <Text style={[styles.bodyTextSecondary, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            {user?.email || 'user@example.com'}
          </Text>

          <View style={[styles.row, { marginTop: spacing.md, gap: spacing.lg }]}>
            <View style={styles.center}>
              <Text style={[styles.heading3, { color: colors.text }]}>12</Text>
              <Text style={[styles.smallText, { color: colors.textSecondary }]}>Goals</Text>
            </View>
            <View style={styles.center}>
              <Text style={[styles.heading3, { color: colors.text }]}>45</Text>
              <Text style={[styles.smallText, { color: colors.textSecondary }]}>Messages</Text>
            </View>
            <View style={styles.center}>
              <Text style={[styles.heading3, { color: colors.text }]}>7</Text>
              <Text style={[styles.smallText, { color: colors.textSecondary }]}>Streak</Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.mb3}>
          <Text style={[styles.heading3, { color: colors.text, marginBottom: spacing.md }]}>
            {t('profile.preferences')}
          </Text>

          {/* Theme Toggle */}
          <View
            style={[styles.card, styles.row, { justifyContent: 'space-between', marginBottom: spacing.sm }]}
          >
            <View style={styles.row}>
              {colorScheme === 'dark' ? (
                <Moon size={20} color={colors.text} />
              ) : (
                <Sun size={20} color={colors.text} />
              )}
              <Text style={[styles.bodyText, { color: colors.text, marginLeft: spacing.md }]}>
                {t('profile.darkMode')}
              </Text>
            </View>
            <Text style={[styles.bodyTextSecondary, { color: colors.textSecondary }]}>
              {colorScheme === 'dark' ? t('profile.on') : t('profile.off')}
            </Text>
          </View>

          {/* Language Toggle */}
          <TouchableOpacity
            style={[styles.card, styles.row, { justifyContent: 'space-between', marginBottom: spacing.sm }]}
            onPress={toggleLanguage}
          >
            <View style={styles.row}>
              <Globe size={20} color={colors.text} />
              <Text style={[styles.bodyText, { color: colors.text, marginLeft: spacing.md }]}>
                {t('profile.language')}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.bodyTextSecondary, { color: colors.textSecondary, marginRight: spacing.sm }]}>
                {language === 'en' ? t('profile.english') : t('profile.arabic')}
              </Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={[styles.card, styles.row, { justifyContent: 'space-between', marginBottom: spacing.sm }]}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <View style={styles.row}>
              <Bell size={20} color={colors.text} />
              <Text style={[styles.bodyText, { color: colors.text, marginLeft: spacing.md }]}>
                {t('profile.notifications')}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: palette.primary }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.mb3}>
          <Text style={[styles.heading3, { color: colors.text, marginBottom: spacing.md }]}>
            {t('profile.account')}
          </Text>

          <TouchableOpacity style={[styles.card, styles.row, { justifyContent: 'space-between' }, { marginBottom: spacing.sm }]}>
            <View style={styles.row}>
              <Lock size={20} color={colors.text} />
              <Text style={[styles.bodyText, { color: colors.text, marginLeft: spacing.md }]}>
                Change Password
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.row, { justifyContent: 'space-between' }, { marginBottom: spacing.sm }]}>
            <View style={styles.row}>
              <Shield size={20} color={colors.text} />
              <Text style={[styles.bodyText, { color: colors.text, marginLeft: spacing.md }]}>
                Privacy & Security
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* More Section */}
        <View style={styles.mb3}>
          <Text style={[styles.heading3, { color: colors.text, marginBottom: spacing.md }]}>
            {t('profile.more')}
          </Text>

          <TouchableOpacity style={[styles.card, styles.row, { justifyContent: 'space-between' }, { marginBottom: spacing.sm }]}>
            <View style={styles.row}>
              <HelpCircle size={20} color={colors.text} />
              <Text style={[styles.bodyText, { color: colors.text, marginLeft: spacing.md }]}>
                Help & Support
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.row, { justifyContent: 'space-between' }, { marginBottom: spacing.sm }]}>
            <View style={styles.row}>
              <Star size={20} color={colors.text} />
              <Text style={[styles.bodyText, { color: colors.text, marginLeft: spacing.md }]}>
                Rate App
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: `${palette.danger}15`,
              borderWidth: 1,
              borderColor: palette.danger,
              marginTop: spacing.lg,
            }
          ]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={palette.danger} />
          <Text style={[styles.buttonText, { color: palette.danger, marginLeft: spacing.sm }]}>
            {t('profile.logout')}
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.smallText, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl }]}>
          {t('profile.version')} 1.0.0
        </Text>
      </ScrollView>
    </ThemedView>
  );
}

