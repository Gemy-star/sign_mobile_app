// app/(tabs)/profile.tsx

import AppHeader from '@/components/AppHeader';
import { FontFamily } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import HelpSupportScreen from '@/screens/HelpSupportScreen';
import PackagesScreen from '@/screens/PackagesScreen';
import PrivacySecurityScreen from '@/screens/PrivacySecurityScreen';
import TopicSelectionScreen from '@/screens/TopicSelectionScreen';
import { profileApi } from '@/services/api';
import {
    cancelAllNotifications,
    requestNotificationPermissions,
    scheduleDailyNotification,
    setupAndroidChannel,
} from '@/services/notification.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { fetchGoals } from '@/store/slices/goalsSlice';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { setPreferences } from '@/store/slices/profileSlice';
import { fetchActiveSubscription, updateSubscriptionScopes } from '@/store/slices/subscriptionsSlice';
import { Scope } from '@/types/api';
import { Icon, ProgressBar, Spinner, Text, Toggle } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────
type ProfileTab = 'profile' | 'goals' | 'motivation' | 'notifications';
type GoalsFilter = 'all' | 'active' | 'completed';

// ─── Internal tab definitions ─────────────────────────────────────────────────
const PROFILE_TABS: Array<{ id: ProfileTab; icon: string; labelKey: string }> = [
  { id: 'profile',       icon: 'person-outline',      labelKey: 'profile.title' },
  { id: 'goals',         icon: 'trending-up-outline', labelKey: 'news.title' },
  { id: 'motivation',    icon: 'heart-outline',       labelKey: 'motivation.appName' },
  { id: 'notifications', icon: 'bell-outline',        labelKey: 'notifications.title' },
];

// ─── Motivation categories ────────────────────────────────────────────────────
const MOTIVATION_CATEGORIES = [
  { id: 'mental',        iconName: 'bulb-outline',          color: '#6366f1' },
  { id: 'physical',      iconName: 'activity-outline',      color: '#10b981' },
  { id: 'career',        iconName: 'briefcase-outline',     color: '#8b5cf6' },
  { id: 'financial',     iconName: 'credit-card-outline',   color: '#f59e0b' },
  { id: 'relationships', iconName: 'heart-outline',         color: '#ef4444' },
  { id: 'spiritual',     iconName: 'star-outline',          color: '#3b82f6' },
  { id: 'creativity',    iconName: 'color-palette-outline', color: '#9a7cb6' },
  { id: 'lifestyle',     iconName: 'sun-outline',           color: '#38b2ac' },
] as const;

// ─── Notification sections ────────────────────────────────────────────────────
const NOTIF_SECTIONS = [
  {
    title: { en: 'Today', ar: 'اليوم' },
    data: [
      {
        id: '1',
        title: { en: 'New Achievement!', ar: 'إنجاز جديد!' },
        message: { en: 'You completed your 7-day streak!', ar: 'لقد أكملت سلسلة 7 أيام!' },
      },
    ],
  },
  {
    title: { en: 'Yesterday', ar: 'أمس' },
    data: [
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
    ],
  },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

// ─── Screen ───────────────────────────────────────────────────────────────────
// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Build the daily-notification body text from the user's selected scope names. */
function buildNotifBody(isArabic: boolean, scopeNames: string): string {
  if (scopeNames) {
    return isArabic
      ? `رسائلك اليومية جاهزة في: ${scopeNames}`
      : `Your daily messages are ready for: ${scopeNames}`;
  }
  return isArabic
    ? 'رسالتك التحفيزية اليومية جاهزة. افتح التطبيق لقراءتها.'
    : 'Your daily motivational message is ready. Open the app to read it.';
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAppSelector((state) => state.auth);
  const { preferences } = useAppSelector((state) => state.profile);
  const { activeSubscription, isLoading: subLoading } = useAppSelector((state) => state.subscriptions);
  const { goals, isLoading: goalsLoading } = useAppSelector((state) => state.goals);
  const { messages, isLoading: messagesLoading } = useAppSelector((state) => state.messages);

  // ── Tab state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [goalsFilter, setGoalsFilter] = useState<GoalsFilter>('all');

  // ── Profile state ────────────────────────────────────────────────────────
  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.notifications);
  const [notificationTime, setNotificationTime] = useState(preferences.notificationTime ?? '09:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempHour, setTempHour] = useState(() => Number.parseInt(preferences.notificationTime?.split(':')[0] ?? '9', 10));
  const [tempMinute, setTempMinute] = useState(() => {
    const m = Number.parseInt(preferences.notificationTime?.split(':')[1] ?? '0', 10);
    return Math.round(m / 5) * 5;
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPrivacySecurity, setShowPrivacySecurity] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showScopeSelection, setShowScopeSelection] = useState(false);

  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';

  // Colors (warm brown theme matching other screens)
  const bgColor = '#53321D';
  const cardBg = 'rgba(49, 30, 19, 0.65)';
  const textColor = '#FAF8F5';
  const subTextColor = 'rgba(250, 248, 245, 0.6)';
  const dividerColor = 'rgba(250, 248, 245, 0.10)';
  const rowBg = 'rgba(49, 30, 19, 0.40)';
  const gold = '#A48111';

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeSubscription) dispatch(fetchActiveSubscription());
    setupAndroidChannel();
  }, []);

  useEffect(() => {
    if (activeTab === 'goals') {
      dispatch(fetchGoals({}));
    } else if (activeTab === 'motivation' && messages.length === 0) {
      dispatch(fetchMessages({ pagination: { page: 1, page_size: 5 }, filters: { language } }));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'goals') return;
    const goalFilters =
      goalsFilter === 'completed' ? { is_completed: true } :
      goalsFilter === 'active'    ? { is_completed: false } : {};
    dispatch(fetchGoals({ filters: goalFilters }));
  }, [goalsFilter]);

  // ── Profile handlers ──────────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.logout'), style: 'destructive', onPress: () => dispatch(logoutAction()) },
    ]);
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(t('profile.notifications'), t('profile.notificationPermissionDenied'));
        return;
      }
      const [h, m] = notificationTime.split(':').map(Number);
      const scopeNames = selectedScopes.map((s) => s.name).join(', ');
      await scheduleDailyNotification(
        h, m,
        language === 'ar' ? 'تذكيرك اليومي' : 'Daily Reminder',
        buildNotifBody(language === 'ar', scopeNames),
      );
    } else {
      await cancelAllNotifications();
    }
    setNotificationsEnabled(value);
    dispatch(setPreferences({ notifications: value }));
  };

  const handleSaveNotificationTime = async () => {
    const hh = String(tempHour).padStart(2, '0');
    const mm = String(tempMinute).padStart(2, '0');
    const time = `${hh}:${mm}`;
    setNotificationTime(time);
    setShowTimePicker(false);
    dispatch(setPreferences({ notificationTime: time }));

    // Persist delivery_time to the backend so the server-side cron
    // knows when this user expects their daily scope messages.
    try {
      await profileApi.updateMessagePreferences({ delivery_time: time });
    } catch {
      // Non-critical — local notification still fires even if backend sync fails
    }

    if (notificationsEnabled) {
      const scopeNames = selectedScopes.map((s) => s.name).join(', ');
      await scheduleDailyNotification(
        tempHour, tempMinute,
        language === 'ar' ? 'تذكيرك اليومي' : 'Daily Reminder',
        buildNotifBody(language === 'ar', scopeNames),
      );
    }
  };

  const handleScopesSelected = async (selectedTopics: string[]) => {
    setShowScopeSelection(false);
    if (activeSubscription) {
      const allScopes: Scope[] = activeSubscription.selected_scopes ?? [];
      const newIds = allScopes.filter((s) => selectedTopics.includes(s.name)).map((s) => s.id);
      if (newIds.length > 0) {
        dispatch(updateSubscriptionScopes({ id: activeSubscription.id, data: { scope_ids: newIds } }));
      }
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────
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

  const filteredGoals = useMemo(() => {
    if (goalsFilter === 'completed') return goals.filter((g) => g.status === 'completed');
    if (goalsFilter === 'active')    return goals.filter((g) => g.status !== 'completed');
    return goals;
  }, [goals, goalsFilter]);

  const goalsStats = useMemo(() => ({
    total:     goals.length,
    completed: goals.filter((g) => g.status === 'completed').length,
    active:    goals.filter((g) => g.status !== 'completed').length,
  }), [goals]);

  const motivationalMessages = messages.slice(0, 5);

  const localizedNotifSections = NOTIF_SECTIONS.map((s) => ({
    title: language === 'ar' ? s.title.ar : s.title.en,
    data: s.data.map((item) => ({
      id:      item.id,
      title:   language === 'ar' ? item.title.ar   : item.title.en,
      message: language === 'ar' ? item.message.ar : item.message.en,
    })),
  }));

  // ── Sub-components ────────────────────────────────────────────────────────
  const SettingRow = ({
    icon, label, right, onPress, danger,
  }: {
    icon: string; label: string; right?: React.ReactNode; onPress?: () => void; danger?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.settingRow, { backgroundColor: rowBg, borderBottomColor: dividerColor }, isRTL && styles.rowRTL]}
    >
      <View style={[styles.settingLeft, isRTL && styles.rowRTL]}>
        <View style={[styles.iconWrap, { backgroundColor: danger ? 'rgba(239,68,68,0.15)' : 'rgba(250,248,245,0.12)' }]}>
          <Icon name={icon} style={styles.rowIcon} fill={danger ? '#ef4444' : 'rgba(250,248,245,0.80)'} />
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

  const goalsFilterOptions: Array<{ value: GoalsFilter; label: string }> = [
    { value: 'all',       label: t('goals.all') },
    { value: 'active',    label: t('goals.active') },
    { value: 'completed', label: t('goals.completed') },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <LinearGradient
        colors={['rgba(49,30,19,0.85)', 'rgba(83,50,29,0.90)', 'rgba(49,30,19,0.85)']}
        style={StyleSheet.absoluteFillObject}
      />
      <AppHeader title={t('profile.title')} showUserInfo={false} />

      {/* ── Internal tab bar ───────────────────────────────────────────────── */}
      <View style={[styles.tabBarWrapper, { borderBottomColor: dividerColor }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabBarContent, isRTL && styles.tabBarContentRTL]}
        >
          {PROFILE_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.internalTab, active && styles.internalTabActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.8}
              >
                <Icon
                  name={tab.icon}
                  style={styles.internalTabIcon}
                  fill={active ? '#FFFFFF' : subTextColor}
                />
                <Text style={[styles.internalTabText, { color: active ? '#FFFFFF' : subTextColor }]}>
                  {t(tab.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Main scroll content ────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ════════════════════ PROFILE TAB ════════════════════ */}
        {activeTab === 'profile' && (
          <>
            {/* User Card */}
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
              <Text style={[styles.userEmail, { color: subTextColor }]}>{user?.email || ''}</Text>
              {user?.has_active_trial && (
                <View style={styles.trialBadge}>
                  <Icon name="clock-outline" style={styles.trialIcon} fill={gold} />
                  <Text style={styles.trialText}>
                    {t('profile.trialDaysLeft').replace('{n}', String(user.trial_remaining_days ?? 0))}
                  </Text>
                </View>
              )}
            </View>

            {/* Subscription */}
            <SectionHeader label={t('profile.subscription')} />
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              {subLoading && !activeSubscription ? (
                <View style={styles.loadingCenter}><Spinner size="small" status="primary" /></View>
              ) : activeSubscription && pkg ? (
                <>
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
                    {endDate && (
                      <Text style={[styles.endDate, { color: subTextColor }]}>
                        {t('profile.activeUntil')} {endDate}
                      </Text>
                    )}
                  </View>

                  <View style={[styles.planMeta, { borderTopColor: dividerColor }]}>
                    {[
                      { icon: 'message-square-outline', value: String(pkg.messages_per_day ?? '∞'), label: t('profile.msgPerDay') },
                      { icon: 'grid-outline', value: `${selectedScopes.length}${maxScopes ? `/${maxScopes}` : ''}`, label: t('profile.scopes') },
                      { icon: 'calendar-outline', value: pkg.duration_display || pkg.duration, label: t('profile.plan') },
                    ].map((meta, idx, arr) => (
                      <React.Fragment key={meta.label}>
                        <View style={styles.metaItem}>
                          <Icon name={meta.icon} style={styles.metaIcon} fill={gold} />
                          <Text style={[styles.metaValue, { color: textColor }]}>{meta.value}</Text>
                          <Text style={[styles.metaLabel, { color: subTextColor }]}>{meta.label}</Text>
                        </View>
                        {idx < arr.length - 1 && <View style={[styles.metaDivider, { backgroundColor: dividerColor }]} />}
                      </React.Fragment>
                    ))}
                  </View>

                  {selectedScopes.length > 0 && (
                    <View style={[styles.scopesSection, { borderTopColor: dividerColor }]}>
                      <Text style={[styles.scopesLabel, { color: subTextColor }, isRTL && styles.textRTL]}>
                        {t('profile.selectedScopes')}
                      </Text>
                      <View style={[styles.chips, isRTL && styles.chipsRTL]}>
                        {selectedScopes.map((scope) => (
                          <View key={scope.id} style={[styles.chip, { backgroundColor: 'rgba(250,248,245,0.10)' }]}>
                            {scope.icon ? <Text style={styles.chipEmoji}>{scope.icon}</Text> : null}
                            <Text style={[styles.chipText, { color: gold }]}>{scope.name}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={[styles.subActions, isRTL && styles.rowRTL]}>
                    <TouchableOpacity style={[styles.scopeBtn, { borderColor: gold }]} onPress={() => setShowScopeSelection(true)} activeOpacity={0.8}>
                      <Icon name="grid-outline" style={styles.btnIcon} fill={gold} />
                      <Text style={[styles.scopeBtnText, { color: gold }]}>{t('profile.changeScopes')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.upgradeBtn} onPress={() => setShowUpgrade(true)} activeOpacity={0.8}>
                      <LinearGradient colors={['#A48111', '#D4A820']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.upgradeBtnGradient}>
                        <Icon name="trending-up-outline" style={styles.btnIcon} fill="#FFFFFF" />
                        <Text style={styles.upgradeBtnText}>{t('profile.upgrade')}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.noSubContainer}>
                  <Icon name="credit-card-outline" style={styles.noSubIcon} fill={subTextColor} />
                  <Text style={[styles.noSubText, { color: textColor }]}>{t('profile.noSubscription')}</Text>
                  <Text style={[styles.noSubDesc, { color: subTextColor }]}>{t('profile.noSubscriptionDesc')}</Text>
                  <TouchableOpacity style={styles.upgradeBtn} onPress={() => setShowUpgrade(true)} activeOpacity={0.8}>
                    <LinearGradient colors={['#A48111', '#D4A820']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.upgradeBtnGradient}>
                      <Icon name="star-outline" style={styles.btnIcon} fill="#FFFFFF" />
                      <Text style={styles.upgradeBtnText}>{t('profile.viewPlans')}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Preferences */}
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
                    style={[styles.langToggle, { backgroundColor: 'rgba(250,248,245,0.12)' }]}
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
              {notificationsEnabled && (
                <SettingRow
                  icon="clock-outline"
                  label={t('profile.notificationTime')}
                  onPress={() => {
                    const [h, m] = notificationTime.split(':').map(Number);
                    setTempHour(h);
                    setTempMinute(Math.round(m / 5) * 5);
                    setShowTimePicker(true);
                  }}
                  right={
                    <View style={[styles.timeBadge, { backgroundColor: 'rgba(250,248,245,0.12)' }]}>
                      <Text style={[styles.timeBadgeText, { color: gold }]}>{notificationTime}</Text>
                    </View>
                  }
                />
              )}
            </View>

            {/* Account */}
            <SectionHeader label={t('profile.account')} />
            <View style={[styles.card, { backgroundColor: cardBg, padding: 0, overflow: 'hidden' }]}>
              <SettingRow icon="lock-outline"   label={t('profile.changePassword')}  onPress={() => setShowChangePassword(true)} />
              <SettingRow icon="shield-outline" label={t('profile.privacySecurity')} onPress={() => setShowPrivacySecurity(true)} />
            </View>

            {/* More */}
            <SectionHeader label={t('profile.more')} />
            <View style={[styles.card, { backgroundColor: cardBg, padding: 0, overflow: 'hidden' }]}>
              <SettingRow icon="question-mark-circle-outline" label={t('profile.helpSupport')} onPress={() => setShowHelpSupport(true)} />
              <SettingRow icon="star-outline" label={t('profile.rateApp')} onPress={() => {}} />
            </View>

            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.logoutRow, { backgroundColor: cardBg }]}
              activeOpacity={0.7}
            >
              <Icon name="log-out-outline" style={styles.logoutIcon} fill="#ef4444" />
              <Text style={styles.logoutText}>{t('profile.logout')}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ════════════════════ GOALS TAB ════════════════════ */}
        {activeTab === 'goals' && (
          <>
            {/* Filter pills */}
            <View style={[styles.filterRow, isRTL && styles.rowRTL]}>
              {goalsFilterOptions.map((opt) => {
                const active = goalsFilter === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.filterPill, active && styles.filterPillActive]}
                    onPress={() => setGoalsFilter(opt.value)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {goalsLoading && goals.length === 0 ? (
              <View style={styles.center}><Spinner size="giant" status="primary" /></View>
            ) : (
              <>
                {/* Stats row */}
                <View style={styles.statsRow}>
                  {[
                    { value: goalsStats.total,     labelKey: 'goals.total' },
                    { value: goalsStats.completed, labelKey: 'goals.completed' },
                    { value: goalsStats.active,    labelKey: 'goals.active' },
                  ].map((s) => (
                    <View key={s.labelKey} style={[styles.statCard, { backgroundColor: cardBg }]}>
                      <Text style={[styles.statValue, { color: textColor }]}>{s.value}</Text>
                      <Text style={[styles.statLabel, { color: gold }]}>{t(s.labelKey)}</Text>
                    </View>
                  ))}
                </View>

                {/* Goal cards */}
                {filteredGoals.map((goal) => (
                  <View key={goal.id} style={[styles.goalCard, { backgroundColor: cardBg }]}>
                    <View style={[styles.goalHeader, isRTL && styles.rowRTL]}>
                      <View style={styles.goalTitleRow}>
                        {goal.status === 'completed' && (
                          <Icon name="checkmark-circle" style={styles.checkIcon} fill="#48BB78" />
                        )}
                        <Text style={[styles.goalTitle, { color: textColor }, isRTL && styles.textRTL]}>
                          {goal.title}
                        </Text>
                      </View>
                      <View style={styles.goalStatusBadge}>
                        <Text style={styles.goalStatusText}>{goal.status_display || goal.status}</Text>
                      </View>
                    </View>
                    {goal.description && (
                      <Text style={[styles.goalDesc, { color: subTextColor }, isRTL && styles.textRTL]}>
                        {goal.description}
                      </Text>
                    )}
                    {goal.scope_name && (
                      <Text style={[styles.goalScope, { color: gold }]}>{goal.scope_name}</Text>
                    )}
                    {goal.status !== 'completed' && (
                      <>
                        <View style={[styles.progressLabelRow, isRTL && styles.rowRTL]}>
                          <Text style={[styles.progressLabel, { color: subTextColor }]}>{t('goals.progress')}</Text>
                          <Text style={[styles.progressValue, { color: gold }]}>{goal.progress_percentage}%</Text>
                        </View>
                        <ProgressBar
                          progress={goal.progress_percentage / 100}
                          style={styles.progressBar}
                          indicatorStyle={{ backgroundColor: '#C96F4A' }}
                          status="warning"
                        />
                      </>
                    )}
                    {goal.target_date && (
                      <View style={[styles.goalFooter, isRTL && styles.rowRTL]}>
                        <Icon name="calendar-outline" style={styles.dateIcon} fill={subTextColor} />
                        <Text style={[styles.dateText, { color: subTextColor }]}>
                          {t('goals.targetDate')}: {new Date(goal.target_date).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}

                {filteredGoals.length === 0 && (
                  <View style={[styles.emptyCard, { backgroundColor: cardBg }]}>
                    <Icon name="inbox-outline" style={styles.emptyIcon} fill={subTextColor} />
                    <Text style={[styles.emptyText, { color: subTextColor }]}>{t('goals.noGoals')}</Text>
                  </View>
                )}
              </>
            )}
          </>
        )}

        {/* ════════════════════ MOTIVATION TAB ════════════════════ */}
        {activeTab === 'motivation' && (
          <>
            <Text style={[styles.tabSectionTitle, isRTL && styles.textRTL]}>{t('motivation.lifeAreas')}</Text>
            <Text style={[styles.tabSectionSubtitle, isRTL && styles.textRTL]}>{t('motivation.lifeAreasDesc')}</Text>

            <View style={styles.categoriesGrid}>
              {MOTIVATION_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => router.push(`/category-detail?categoryId=${cat.id}` as any)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.categoryCard, { backgroundColor: cardBg }]}>
                    <LinearGradient
                      colors={[cat.color, `${cat.color}dd`]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.categoryGradient}
                    >
                      <Icon name={cat.iconName} style={styles.categoryIcon} fill="#fff" />
                    </LinearGradient>
                    <Text style={styles.categoryName}>{t(`categories.${cat.id}.name`) || cat.id}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.tabSectionTitle, isRTL && styles.textRTL]}>{t('motivation.aiMessages')}</Text>
            <Text style={[styles.tabSectionSubtitle, isRTL && styles.textRTL]}>{t('motivation.aiMessagesDesc')}</Text>

            {messagesLoading && motivationalMessages.length === 0 ? (
              <View style={styles.center}><Spinner size="large" status="primary" /></View>
            ) : (
              motivationalMessages.map((msg) => (
                <TouchableOpacity
                  key={msg.id}
                  onPress={() => router.push(`/message-detail?messageId=${msg.id}` as any)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.msgCard, { backgroundColor: cardBg }]}>
                    <View style={[styles.msgHeader, isRTL && styles.rowRTL]}>
                      <Text style={styles.msgCategory}>{msg.scope_name || msg.message_type_display}</Text>
                      {msg.is_favorited && <Icon name="star" style={styles.starIcon} fill="#f59e0b" />}
                    </View>
                    <Text style={[styles.msgContent, { color: textColor }, isRTL && styles.textRTL]}>
                      {msg.content || ''}
                    </Text>
                    {msg.ai_model && (
                      <Text style={[styles.msgAuthor, { color: subTextColor }]}>- {msg.ai_model}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {/* ════════════════════ NOTIFICATIONS TAB ════════════════════ */}
        {activeTab === 'notifications' && (
          <>
            {localizedNotifSections.map((section, idx) => (
              <View key={`${section.title}-${idx}`} style={styles.notifSection}>
                <Text style={[styles.notifSectionTitle, { color: gold }, isRTL && styles.textRTL]}>
                  {section.title}
                </Text>
                {section.data.map((item) => (
                  <View key={item.id} style={[styles.notifCard, { backgroundColor: cardBg }]}>
                    <View style={[styles.notifCardHeader, isRTL && styles.rowRTL]}>
                      <View style={styles.notifIconWrap}>
                        <Icon name="bell-outline" style={styles.notifBellIcon} fill={gold} />
                      </View>
                      <Text style={[styles.notifCardTitle, { color: textColor }, isRTL && styles.textRTL]}>
                        {item.title}
                      </Text>
                    </View>
                    <Text style={[styles.notifCardMsg, { color: subTextColor }, isRTL && styles.textRTL]}>
                      {item.message}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

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
        <PackagesScreen onComplete={() => { setShowUpgrade(false); dispatch(fetchActiveSubscription()); }} />
      </Modal>
      <Modal visible={showScopeSelection} animationType="slide" onRequestClose={() => setShowScopeSelection(false)}>
        <TopicSelectionScreen onComplete={handleScopesSelected} />
      </Modal>

      {/* Time picker modal */}
      <Modal visible={showTimePicker} transparent animationType="fade" onRequestClose={() => setShowTimePicker(false)}>
        <View style={styles.timePickerOverlay}>
          <View style={[styles.timePickerCard, { backgroundColor: '#2A1509' }]}>
            <Text style={[styles.timePickerTitle, { color: textColor }, isRTL && styles.textRTL]}>
              {t('profile.notificationTime')}
            </Text>
            <Text style={[styles.timePickerDesc, { color: subTextColor }, isRTL && styles.textRTL]}>
              {t('profile.notificationTimeDesc')}
            </Text>
            <View style={styles.timePickerColumns}>
              <View style={styles.timePickerColumn}>
                <Text style={[styles.timePickerColLabel, { color: subTextColor }]}>
                  {language === 'ar' ? 'ساعة' : 'Hour'}
                </Text>
                <FlatList
                  data={HOURS}
                  keyExtractor={(item) => `h-${item}`}
                  style={styles.timeList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const selected = item === tempHour;
                    return (
                      <TouchableOpacity
                        style={[styles.timeListItem, selected && { backgroundColor: gold, borderRadius: 10 }]}
                        onPress={() => setTempHour(item)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.timeListItemText, { color: selected ? '#FFF' : textColor }]}>
                          {String(item).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <Text style={[styles.timePickerColon, { color: gold }]}>:</Text>
              <View style={styles.timePickerColumn}>
                <Text style={[styles.timePickerColLabel, { color: subTextColor }]}>
                  {language === 'ar' ? 'دقيقة' : 'Min'}
                </Text>
                <FlatList
                  data={MINUTES}
                  keyExtractor={(item) => `m-${item}`}
                  style={styles.timeList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const selected = item === tempMinute;
                    return (
                      <TouchableOpacity
                        style={[styles.timeListItem, selected && { backgroundColor: gold, borderRadius: 10 }]}
                        onPress={() => setTempMinute(item)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.timeListItemText, { color: selected ? '#FFF' : textColor }]}>
                          {String(item).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
            <View style={[styles.timePickerPreview, { borderColor: dividerColor }]}>
              <Text style={[styles.timePickerPreviewText, { color: gold }]}>
                {String(tempHour).padStart(2, '0')}:{String(tempMinute).padStart(2, '0')}
              </Text>
            </View>
            <View style={[styles.timePickerActions, isRTL && styles.rowRTL]}>
              <TouchableOpacity
                style={[styles.timePickerBtn, styles.timePickerBtnCancel, { borderColor: dividerColor }]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={{ color: subTextColor, fontFamily: FontFamily.arabicMedium }}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timePickerBtn, { backgroundColor: gold }]}
                onPress={handleSaveNotificationTime}
              >
                <Text style={{ color: '#FFF', fontFamily: FontFamily.arabicBold }}>
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },

  // ── Internal tab bar
  tabBarWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabBarContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabBarContentRTL: { flexDirection: 'row-reverse' },
  internalTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(250,248,245,0.10)',
  },
  internalTabActive: { backgroundColor: '#A48111' },
  internalTabIcon: { width: 15, height: 15 },
  internalTabText: { fontSize: 13, fontFamily: FontFamily.arabicMedium },

  // ── User card
  userCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(250,248,245,0.15)',
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: { fontSize: 32, fontFamily: FontFamily.arabicBold, color: '#FFFFFF' },
  userName: { fontSize: 20, fontFamily: FontFamily.arabicBold, marginBottom: 4 },
  userEmail: { fontSize: 13, fontFamily: FontFamily.arabic, marginBottom: 8 },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(164,129,17,0.20)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(164,129,17,0.40)',
  },
  trialIcon: { width: 14, height: 14 },
  trialText: { fontSize: 12, fontFamily: FontFamily.arabicMedium, color: '#A48111' },

  // ── Section header
  sectionHeader: {
    fontSize: 11,
    fontFamily: FontFamily.arabicSemiBold,
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },

  // ── Generic card
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(250,248,245,0.15)',
  },

  // ── Subscription
  loadingCenter: { alignItems: 'center', paddingVertical: 20 },
  planRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  planNameWrap: { gap: 6 },
  planName: { fontSize: 18, fontFamily: FontFamily.arabicBold },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: FontFamily.arabicSemiBold },
  endDate: { fontSize: 12, fontFamily: FontFamily.arabic, textAlign: 'right' },
  planMeta: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 14, marginBottom: 14 },
  metaItem: { flex: 1, alignItems: 'center', gap: 2 },
  metaDivider: { width: StyleSheet.hairlineWidth, marginVertical: 4 },
  metaIcon: { width: 18, height: 18, marginBottom: 2 },
  metaValue: { fontSize: 16, fontFamily: FontFamily.arabicBold },
  metaLabel: { fontSize: 10, fontFamily: FontFamily.arabic, textAlign: 'center' },
  scopesSection: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, marginBottom: 14 },
  scopesLabel: { fontSize: 11, fontFamily: FontFamily.arabicMedium, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipsRTL: { flexDirection: 'row-reverse' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14 },
  chipEmoji: { fontSize: 13 },
  chipText: { fontSize: 12, fontFamily: FontFamily.arabicMedium },
  subActions: { flexDirection: 'row', gap: 10 },
  scopeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 12, paddingVertical: 10 },
  scopeBtnText: { fontSize: 13, fontFamily: FontFamily.arabicSemiBold },
  upgradeBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  upgradeBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 12 },
  upgradeBtnText: { fontSize: 13, fontFamily: FontFamily.arabicSemiBold, color: '#FFFFFF' },
  btnIcon: { width: 16, height: 16 },
  noSubContainer: { alignItems: 'center', paddingVertical: 8, gap: 8 },
  noSubIcon: { width: 40, height: 40, opacity: 0.3, marginBottom: 4 },
  noSubText: { fontSize: 16, fontFamily: FontFamily.arabicBold },
  noSubDesc: { fontSize: 13, fontFamily: FontFamily.arabic, textAlign: 'center', lineHeight: 20, marginBottom: 8 },

  // ── Setting rows
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  rowIcon: { width: 18, height: 18 },
  chevron: { width: 18, height: 18 },
  settingLabel: { fontSize: 14, fontFamily: FontFamily.arabicMedium },
  langToggle: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  langToggleText: { fontSize: 13, fontFamily: FontFamily.arabicSemiBold },
  timeBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  timeBadgeText: { fontSize: 14, fontFamily: FontFamily.arabicSemiBold },

  // ── Logout
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  logoutIcon: { width: 20, height: 20 },
  logoutText: { fontSize: 14, fontFamily: FontFamily.arabicMedium, color: '#ef4444' },

  // ── Goals tab
  filterRow: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginTop: 16, marginBottom: 4 },
  filterPill: { flex: 1, height: 36, borderRadius: 18, backgroundColor: 'rgba(250,248,245,0.10)', justifyContent: 'center', alignItems: 'center' },
  filterPillActive: { backgroundColor: '#A48111' },
  filterPillText: { color: 'rgba(250,248,245,0.6)', fontSize: 13, fontFamily: FontFamily.arabicMedium },
  filterPillTextActive: { color: '#FFFFFF' },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 12, marginBottom: 4 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(250,248,245,0.15)' },
  statValue: { fontSize: 22, fontFamily: FontFamily.arabicBold, marginBottom: 4 },
  statLabel: { fontSize: 11, fontFamily: FontFamily.arabicMedium, textAlign: 'center' },
  goalCard: { marginHorizontal: 16, marginTop: 10, borderRadius: 16, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(250,248,245,0.15)' },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  checkIcon: { width: 20, height: 20 },
  goalTitle: { fontSize: 15, fontFamily: FontFamily.arabicBold, flex: 1 },
  goalStatusBadge: { backgroundColor: 'rgba(232,206,128,0.2)', borderWidth: 1, borderColor: 'rgba(232,206,128,0.4)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  goalStatusText: { color: '#E8CE80', fontSize: 10, fontFamily: FontFamily.arabicMedium },
  goalDesc: { fontSize: 13, fontFamily: FontFamily.arabic, lineHeight: 20, marginBottom: 10 },
  goalScope: { fontSize: 11, fontFamily: FontFamily.arabicMedium, textTransform: 'uppercase', opacity: 0.8, marginBottom: 10 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progressLabel: { fontSize: 12, fontFamily: FontFamily.arabic },
  progressValue: { fontSize: 12, fontFamily: FontFamily.arabicMedium },
  progressBar: { marginBottom: 12, height: 8, borderRadius: 4, backgroundColor: 'rgba(250,248,245,0.12)' },
  goalFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dateIcon: { width: 14, height: 14 },
  dateText: { fontSize: 12, fontFamily: FontFamily.arabic },
  center: { alignItems: 'center', paddingVertical: 40 },
  emptyCard: { marginHorizontal: 16, marginTop: 10, borderRadius: 16, alignItems: 'center', paddingVertical: 48, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(250,248,245,0.15)' },
  emptyIcon: { width: 64, height: 64, marginBottom: 16, opacity: 0.4 },
  emptyText: { fontSize: 15, fontFamily: FontFamily.arabic },

  // ── Motivation tab
  tabSectionTitle: { color: '#E8CE80', fontFamily: FontFamily.arabicBold, fontSize: 17, marginTop: 16, marginBottom: 4, marginHorizontal: 16 },
  tabSectionSubtitle: { color: 'rgba(250,248,245,0.55)', fontFamily: FontFamily.arabic, fontSize: 13, marginBottom: 14, marginHorizontal: 16 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginHorizontal: 16, marginBottom: 20 },
  categoryItem: { width: (width - 64) / 4 },
  categoryCard: { borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(250,248,245,0.15)', borderRadius: 14, padding: 8, alignItems: 'center' },
  categoryGradient: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryIcon: { width: 26, height: 26 },
  categoryName: { color: '#FAF8F5', fontSize: 10, textAlign: 'center', fontFamily: FontFamily.arabic },
  msgCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 16, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(250,248,245,0.15)' },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  msgCategory: { color: '#E8CE80', fontSize: 11, textTransform: 'uppercase', fontFamily: FontFamily.arabicMedium },
  starIcon: { width: 16, height: 16 },
  msgContent: { fontSize: 15, lineHeight: 22, fontFamily: FontFamily.arabic, marginBottom: 8 },
  msgAuthor: { fontFamily: FontFamily.arabicLight, fontSize: 12 },

  // ── Notifications tab
  notifSection: { marginHorizontal: 16, marginTop: 16 },
  notifSectionTitle: { fontFamily: FontFamily.arabicBold, fontSize: 14, marginBottom: 10 },
  notifCard: { borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(250,248,245,0.15)' },
  notifCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  notifIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(164,129,17,0.15)', justifyContent: 'center', alignItems: 'center' },
  notifBellIcon: { width: 18, height: 18 },
  notifCardTitle: { fontSize: 14, fontFamily: FontFamily.arabicBold, flex: 1 },
  notifCardMsg: { fontSize: 13, fontFamily: FontFamily.arabic, lineHeight: 20 },

  // ── Time picker
  timePickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  timePickerCard: { width: '100%', borderRadius: 20, padding: 24, gap: 16 },
  timePickerTitle: { fontSize: 18, fontFamily: FontFamily.arabicBold },
  timePickerDesc: { fontSize: 13, fontFamily: FontFamily.arabic, marginTop: -8 },
  timePickerColumns: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  timePickerColumn: { flex: 1, alignItems: 'center', gap: 6 },
  timePickerColLabel: { fontSize: 11, fontFamily: FontFamily.arabicSemiBold, letterSpacing: 0.5, textTransform: 'uppercase' },
  timeList: { height: 180, width: '100%' },
  timeListItem: { paddingVertical: 10, alignItems: 'center' },
  timeListItemText: { fontSize: 20, fontFamily: FontFamily.arabicMedium },
  timePickerColon: { fontSize: 28, fontFamily: FontFamily.arabicBold, paddingTop: 32 },
  timePickerPreview: { alignItems: 'center', paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  timePickerPreviewText: { fontSize: 36, fontFamily: FontFamily.arabicBold, letterSpacing: 2 },
  timePickerActions: { flexDirection: 'row', gap: 12 },
  timePickerBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  timePickerBtnCancel: { borderWidth: 1 },

  // ── Shared
  rowRTL: { flexDirection: 'row-reverse' },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
  bottomSpacer: { height: 60 },
});
