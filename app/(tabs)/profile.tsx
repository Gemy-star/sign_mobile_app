// app/(tabs)/profile.tsx
// User Profile Screen

import AppHeader from '@/components/AppHeader';
import { FontFamily } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import HelpSupportScreen from '@/screens/HelpSupportScreen';
import PackagesScreen from '@/screens/PackagesScreen';
import PrivacySecurityScreen from '@/screens/PrivacySecurityScreen';
import TopicSelectionScreen from '@/screens/TopicSelectionScreen';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { setPreferences } from '@/store/slices/profileSlice';
import { fetchActiveSubscription, updateSubscriptionScopes } from '@/store/slices/subscriptionsSlice';
import { Scope } from '@/types/api';
import { Button, Icon, Layout, Spinner, Text, Toggle } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { colorScheme, toggleColorScheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAppSelector((state) => state.auth);
  const { preferences } = useAppSelector((state) => state.profile);
  const { activeSubscription, isLoading: subLoading } = useAppSelector((state) => state.subscriptions);

  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.notifications);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPrivacySecurity, setShowPrivacySecurity] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showScopeSelection, setShowScopeSelection] = useState(false);

  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';

  const bgColor = isDark ? '#0A0A0A' : '#F4F5F7';
  const cardBg = isDark ? '#111111' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDark ? '#888888' : '#666666';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const rowBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const gold = '#A48111';

  useEffect(() => {
    if (!activeSubscription) {
      dispatch(fetchActiveSubscription());
    }
  }, []);

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: () => dispatch(logoutAction()),
      },
    ]);
  };

  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    dispatch(setPreferences({ notifications: value }));
  };

  const handleScopesSelected = async (selectedTopics: string[]) => {
    setShowScopeSelection(false);
    if (activeSubscription) {
      // Convert scope names back to IDs if needed — here we get IDs from selected_scopes
      const allScopes: Scope[] = activeSubscription.selected_scopes ?? [];
      const newIds = allScopes
        .filter((s) => selectedTopics.includes(s.name))
        .map((s) => s.id);
      if (newIds.length > 0) {
        dispatch(updateSubscriptionScopes({ id: activeSubscription.id, data: { scope_ids: newIds } }));
      }
    }
  };

  // Subscription derived data
  const pkg = activeSubscription?.package;
  const selectedScopes: Scope[] = activeSubscription?.selected_scopes ?? [];
  const maxScopes = pkg?.max_scopes ?? null;
  const isActive = activeSubscription?.is_active_status ?? false;
  const endDate = activeSubscription?.end_date
    ? new Date(activeSubscription.end_date).toLocaleDateString(
        language === 'ar' ? 'ar-SA' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
      )
    : null;

  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || 'User';

  // ─── Row helper ───────────────────────────────────────────────────────────
  const SettingRow = ({
    icon,
    label,
    right,
    onPress,
    danger,
  }: {
    icon: string;
    label: string;
    right?: React.ReactNode;
    onPress?: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.settingRow, { backgroundColor: rowBg, borderBottomColor: dividerColor }, isRTL && styles.rowRTL]}
    >
      <View style={[styles.settingLeft, isRTL && styles.rowRTL]}>
        <View style={[styles.iconWrap, { backgroundColor: danger ? 'rgba(239,68,68,0.1)' : isDark ? '#222' : '#F5F5F5' }]}>
          <Icon
            name={icon}
            style={styles.rowIcon}
            fill={danger ? '#ef4444' : isDark ? '#CCCCCC' : '#555555'}
          />
        </View>
        <Text style={[styles.settingLabel, { color: danger ? '#ef4444' : textColor }, isRTL && styles.textRTL]}>
          {label}
        </Text>
      </View>
      {right ?? (
        onPress ? (
          <Icon
            name={isRTL ? 'chevron-left-outline' : 'chevron-right-outline'}
            style={styles.chevron}
            fill={subTextColor}
          />
        ) : null
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ label }: { label: string }) => (
    <Text style={[styles.sectionHeader, { color: subTextColor }, isRTL && styles.textRTL]}>
      {label.toUpperCase()}
    </Text>
  );

  return (
    <Layout style={[styles.container, { backgroundColor: bgColor }]} level="1">
      <AppHeader title={t('profile.title')} showUserInfo={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── User Card ──────────────────────────────────────────────────── */}
        <View style={[styles.userCard, { backgroundColor: cardBg }]}>
          <LinearGradient
            colors={['#A48111', '#D4A820']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarInitial}>
              {(user?.first_name || user?.username || 'U')[0].toUpperCase()}
            </Text>
          </LinearGradient>

          <Text style={[styles.userName, { color: textColor }]}>{userName}</Text>
          <Text style={[styles.userEmail, { color: subTextColor }]}>
            {user?.email || ''}
          </Text>

          {user?.has_active_trial && (
            <View style={styles.trialBadge}>
              <Icon name="clock-outline" style={styles.trialIcon} fill="#A48111" />
              <Text style={styles.trialText}>
                {t('profile.trialDaysLeft').replace('{n}', String(user.trial_remaining_days ?? 0))}
              </Text>
            </View>
          )}
        </View>

        {/* ── Subscription Card ──────────────────────────────────────────── */}
        <SectionHeader label={t('profile.subscription')} />
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          {subLoading && !activeSubscription ? (
            <View style={styles.subLoading}>
              <Spinner size="small" status="primary" />
            </View>
          ) : activeSubscription && pkg ? (
            <>
              {/* Plan name + status badge */}
              <View style={[styles.planRow, isRTL && styles.rowRTL]}>
                <View style={styles.planNameWrap}>
                  <Text style={[styles.planName, { color: textColor }]}>{pkg.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)' }]}>
                    <View style={[styles.statusDot, { backgroundColor: isActive ? '#10b981' : '#ef4444' }]} />
                    <Text style={[styles.statusText, { color: isActive ? '#10b981' : '#ef4444' }]}>
                      {isActive ? t('profile.active') : t('profile.inactive')}
                    </Text>
                  </View>
                </View>
                {endDate ? (
                  <Text style={[styles.endDate, { color: subTextColor }]}>
                    {t('profile.activeUntil')} {endDate}
                  </Text>
                ) : null}
              </View>

              {/* Plan details row */}
              <View style={[styles.planMeta, { borderTopColor: dividerColor }]}>
                <View style={styles.metaItem}>
                  <Icon name="message-square-outline" style={styles.metaIcon} fill={gold} />
                  <Text style={[styles.metaValue, { color: textColor }]}>
                    {pkg.messages_per_day ?? '∞'}
                  </Text>
                  <Text style={[styles.metaLabel, { color: subTextColor }]}>
                    {t('profile.msgPerDay')}
                  </Text>
                </View>
                <View style={[styles.metaDivider, { backgroundColor: dividerColor }]} />
                <View style={styles.metaItem}>
                  <Icon name="grid-outline" style={styles.metaIcon} fill={gold} />
                  <Text style={[styles.metaValue, { color: textColor }]}>
                    {selectedScopes.length}{maxScopes ? `/${maxScopes}` : ''}
                  </Text>
                  <Text style={[styles.metaLabel, { color: subTextColor }]}>
                    {t('profile.scopes')}
                  </Text>
                </View>
                <View style={[styles.metaDivider, { backgroundColor: dividerColor }]} />
                <View style={styles.metaItem}>
                  <Icon name="calendar-outline" style={styles.metaIcon} fill={gold} />
                  <Text style={[styles.metaValue, { color: textColor }]}>
                    {pkg.duration_display || pkg.duration}
                  </Text>
                  <Text style={[styles.metaLabel, { color: subTextColor }]}>
                    {t('profile.plan')}
                  </Text>
                </View>
              </View>

              {/* Selected scope chips */}
              {selectedScopes.length > 0 && (
                <View style={[styles.scopesSection, { borderTopColor: dividerColor }]}>
                  <Text style={[styles.scopesLabel, { color: subTextColor }, isRTL && styles.textRTL]}>
                    {t('profile.selectedScopes')}
                  </Text>
                  <View style={[styles.chips, isRTL && styles.chipsRTL]}>
                    {selectedScopes.map((scope) => (
                      <View key={scope.id} style={[styles.chip, { backgroundColor: isDark ? '#222' : '#F0EBD8' }]}>
                        {scope.icon ? <Text style={styles.chipEmoji}>{scope.icon}</Text> : null}
                        <Text style={[styles.chipText, { color: gold }]}>{scope.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Action buttons */}
              <View style={[styles.subActions, isRTL && styles.rowRTL]}>
                <TouchableOpacity
                  style={[styles.scopeBtn, { borderColor: gold }]}
                  onPress={() => setShowScopeSelection(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="grid-outline" style={styles.btnIcon} fill={gold} />
                  <Text style={[styles.scopeBtnText, { color: gold }]}>{t('profile.changeScopes')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.upgradeBtn}
                  onPress={() => setShowUpgrade(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#A48111', '#D4A820']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.upgradeBtnGradient}
                  >
                    <Icon name="trending-up-outline" style={styles.btnIcon} fill="#FFFFFF" />
                    <Text style={styles.upgradeBtnText}>{t('profile.upgrade')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* No subscription */
            <View style={styles.noSubContainer}>
              <Icon name="credit-card-outline" style={styles.noSubIcon} fill={subTextColor} />
              <Text style={[styles.noSubText, { color: textColor }]}>{t('profile.noSubscription')}</Text>
              <Text style={[styles.noSubDesc, { color: subTextColor }]}>{t('profile.noSubscriptionDesc')}</Text>
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => setShowUpgrade(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#A48111', '#D4A820']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upgradeBtnGradient}
                >
                  <Icon name="star-outline" style={styles.btnIcon} fill="#FFFFFF" />
                  <Text style={styles.upgradeBtnText}>{t('profile.viewPlans')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Preferences ────────────────────────────────────────────────── */}
        <SectionHeader label={t('profile.preferences')} />
        <View style={[styles.card, { backgroundColor: cardBg, padding: 0, overflow: 'hidden' }]}>
          <SettingRow
            icon={isDark ? 'sun-outline' : 'moon-outline'}
            label={t('profile.darkMode')}
            right={<Toggle checked={colorScheme === 'dark'} onChange={toggleColorScheme} />}
          />
          <SettingRow
            icon="globe-outline"
            label={t('profile.language')}
            right={
              <TouchableOpacity
                onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                style={[styles.langToggle, { backgroundColor: isDark ? '#222' : '#F0F0F0' }]}
              >
                <Text style={[styles.langToggleText, { color: textColor }]}>
                  {language === 'ar' ? 'EN' : 'ع'}
                </Text>
              </TouchableOpacity>
            }
          />
          <SettingRow
            icon="bell-outline"
            label={t('profile.notifications')}
            right={<Toggle checked={notificationsEnabled} onChange={handleToggleNotifications} />}
          />
        </View>

        {/* ── Account ────────────────────────────────────────────────────── */}
        <SectionHeader label={t('profile.account')} />
        <View style={[styles.card, { backgroundColor: cardBg, padding: 0, overflow: 'hidden' }]}>
          <SettingRow
            icon="lock-outline"
            label={t('profile.changePassword')}
            onPress={() => setShowChangePassword(true)}
          />
          <SettingRow
            icon="shield-outline"
            label={t('profile.privacySecurity')}
            onPress={() => setShowPrivacySecurity(true)}
          />
        </View>

        {/* ── More ───────────────────────────────────────────────────────── */}
        <SectionHeader label={t('profile.more')} />
        <View style={[styles.card, { backgroundColor: cardBg, padding: 0, overflow: 'hidden' }]}>
          <SettingRow
            icon="question-mark-circle-outline"
            label={t('profile.helpSupport')}
            onPress={() => setShowHelpSupport(true)}
          />
          <SettingRow
            icon="star-outline"
            label={t('profile.rateApp')}
            onPress={() => {}}
          />
        </View>

        {/* ── Logout ─────────────────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutRow, { backgroundColor: cardBg }]}
          activeOpacity={0.7}
        >
          <Icon name="log-out-outline" style={styles.logoutIcon} fill="#ef4444" />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <Modal visible={showChangePassword} animationType="slide" onRequestClose={() => setShowChangePassword(false)}>
        <ChangePasswordScreen
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => {
            setShowChangePassword(false);
            Alert.alert(t('common.success'), t('changePassword.success') || 'Password changed successfully!');
          }}
        />
      </Modal>

      <Modal visible={showPrivacySecurity} animationType="slide" onRequestClose={() => setShowPrivacySecurity(false)}>
        <PrivacySecurityScreen onClose={() => setShowPrivacySecurity(false)} />
      </Modal>

      <Modal visible={showHelpSupport} animationType="slide" onRequestClose={() => setShowHelpSupport(false)}>
        <HelpSupportScreen onClose={() => setShowHelpSupport(false)} />
      </Modal>

      <Modal visible={showUpgrade} animationType="slide" onRequestClose={() => setShowUpgrade(false)}>
        <PackagesScreen onComplete={() => {
          setShowUpgrade(false);
          dispatch(fetchActiveSubscription());
        }} />
      </Modal>

      <Modal visible={showScopeSelection} animationType="slide" onRequestClose={() => setShowScopeSelection(false)}>
        <TopicSelectionScreen
          onComplete={handleScopesSelected}
        />
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },

  // User card
  userCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 32,
    fontFamily: FontFamily.arabicBold,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontFamily: FontFamily.arabicBold,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontFamily: FontFamily.arabic,
    marginBottom: 8,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(164,129,17,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 4,
  },
  trialIcon: { width: 14, height: 14 },
  trialText: {
    fontSize: 12,
    fontFamily: FontFamily.arabicMedium,
    color: '#A48111',
  },

  // Section header
  sectionHeader: {
    fontSize: 11,
    fontFamily: FontFamily.arabicSemiBold,
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },

  // Generic card
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
  },

  // Subscription card internals
  subLoading: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planNameWrap: {
    gap: 6,
  },
  planName: {
    fontSize: 18,
    fontFamily: FontFamily.arabicBold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FontFamily.arabicSemiBold,
  },
  endDate: {
    fontSize: 12,
    fontFamily: FontFamily.arabic,
    textAlign: 'right',
  },

  // Plan meta row (3 stats)
  planMeta: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 14,
    marginBottom: 14,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  metaIcon: { width: 18, height: 18, marginBottom: 2 },
  metaValue: {
    fontSize: 16,
    fontFamily: FontFamily.arabicBold,
  },
  metaLabel: {
    fontSize: 10,
    fontFamily: FontFamily.arabic,
    textAlign: 'center',
  },

  // Scope chips
  scopesSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
    marginBottom: 14,
  },
  scopesLabel: {
    fontSize: 11,
    fontFamily: FontFamily.arabicMedium,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipsRTL: {
    flexDirection: 'row-reverse',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  chipEmoji: { fontSize: 13 },
  chipText: {
    fontSize: 12,
    fontFamily: FontFamily.arabicMedium,
  },

  // Action buttons
  subActions: {
    flexDirection: 'row',
    gap: 10,
  },
  scopeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
  },
  scopeBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.arabicSemiBold,
  },
  upgradeBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  upgradeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  upgradeBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.arabicSemiBold,
    color: '#FFFFFF',
  },
  btnIcon: { width: 16, height: 16 },

  // No subscription
  noSubContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  noSubIcon: { width: 40, height: 40, opacity: 0.3, marginBottom: 4 },
  noSubText: {
    fontSize: 16,
    fontFamily: FontFamily.arabicBold,
  },
  noSubDesc: {
    fontSize: 13,
    fontFamily: FontFamily.arabic,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },

  // Setting rows
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowIcon: { width: 18, height: 18 },
  chevron: { width: 18, height: 18 },
  settingLabel: {
    fontSize: 14,
    fontFamily: FontFamily.arabicMedium,
  },
  rowRTL: { flexDirection: 'row-reverse' },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },

  // Language toggle
  langToggle: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
  },
  langToggleText: {
    fontSize: 13,
    fontFamily: FontFamily.arabicSemiBold,
  },

  // Logout
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  logoutIcon: { width: 20, height: 20 },
  logoutText: {
    fontSize: 14,
    fontFamily: FontFamily.arabicMedium,
    color: '#ef4444',
  },

  bottomSpacer: { height: 60 },
});
