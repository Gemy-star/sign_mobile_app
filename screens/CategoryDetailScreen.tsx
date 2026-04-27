// screens/CategoryDetailScreen.tsx
// Category Detail Screen — warm brown design (matches DashboardScreen)

import AppHeader from '@/components/AppHeader';
import { FontFamily } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals } from '@/store/slices/goalsSlice';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { Icon, Spinner } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG = '#53321D';
const CARD_BG = 'rgba(49, 30, 19, 0.65)';
const CARD_BORDER = 'rgba(250, 248, 245, 0.12)';
const TEXT = '#FAF8F5';
const MUTED = 'rgba(250, 248, 245, 0.55)';
const GOLD = '#A48111';
const GOLD_SOLID = '#D4A820';
const DIVIDER = 'rgba(250, 248, 245, 0.10)';

// ─── Category config ──────────────────────────────────────────────────────────
type CategoryId =
  | 'mental'
  | 'physical'
  | 'career'
  | 'financial'
  | 'relationships'
  | 'spiritual'
  | 'creativity'
  | 'lifestyle';

const categoryConfig: Record<CategoryId, { iconName: string; color: string }> = {
  mental:        { iconName: 'bulb-outline',          color: '#6366f1' },
  physical:      { iconName: 'activity-outline',      color: '#10b981' },
  career:        { iconName: 'briefcase-outline',      color: '#8b5cf6' },
  financial:     { iconName: 'credit-card-outline',   color: '#f59e0b' },
  relationships: { iconName: 'heart-outline',          color: '#ef4444' },
  spiritual:     { iconName: 'star-outline',           color: '#3b82f6' },
  creativity:    { iconName: 'color-palette-outline', color: '#9a7cb6' },
  lifestyle:     { iconName: 'sun-outline',            color: '#38b2ac' },
};

export default function CategoryDetailScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: CategoryId }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const isRTL = language === 'ar';

  const { messages, isLoading: messagesLoading } = useAppSelector((s) => s.messages);
  const { goals, isLoading: goalsLoading } = useAppSelector((s) => s.goals);

  const [tab, setTab] = useState<0 | 1>(0);
  const [refreshing, setRefreshing] = useState(false);

  const catKey = categoryId ?? 'mental';
  const category = categoryConfig[catKey as CategoryId] ?? categoryConfig.mental;
  const categoryName = t(`categories.${catKey}.name`);
  const categoryDesc = t(`categories.${catKey}.description`);

  useEffect(() => {
    loadData();
  }, [categoryId, language]);

  const loadData = () => {
    dispatch(fetchMessages({ pagination: { page: 1, page_size: 20 }, filters: { language } }));
    dispatch(fetchGoals({}));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchMessages({ pagination: { page: 1, page_size: 20 }, filters: { language } })),
      dispatch(fetchGoals({})),
    ]);
    setRefreshing(false);
  };

  const categoryMessages = messages.filter((m) =>
    m.scope_name?.toLowerCase().includes(catKey),
  );
  const categoryGoals = goals.filter((g) =>
    g.scope_name?.toLowerCase().includes(catKey),
  );

  // ─── Empty state ───────────────────────────────────────────────────────────
  const renderEmpty = (text: string) => (
    <View style={styles.emptyCard}>
      <Icon name="inbox-outline" style={styles.emptyIcon} fill={MUTED} />
      <Text style={[styles.emptyText, isRTL && styles.textRTL]}>{text}</Text>
    </View>
  );

  // ─── Messages tab ──────────────────────────────────────────────────────────
  const renderMessages = () => (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={GOLD}
          colors={[GOLD]}
        />
      }
    >
      {messagesLoading && categoryMessages.length === 0 ? (
        <View style={styles.center}>
          <Spinner size="large" status="warning" />
        </View>
      ) : categoryMessages.length === 0 ? (
        renderEmpty(t('messages.noMessages'))
      ) : (
        categoryMessages.map((msg) => (
          <TouchableOpacity
            key={msg.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/message-detail?messageId=${msg.id}`)}
          >
            <View style={styles.msgCard}>
              <View style={[styles.msgMeta, isRTL && styles.rowRev]}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{msg.message_type_display}</Text>
                </View>
                {msg.is_favorited && (
                  <Icon name="star" style={styles.starIcon} fill={GOLD_SOLID} />
                )}
              </View>
              <Text style={[styles.msgContent, isRTL && styles.textRTL]}>
                {msg.content}
              </Text>
              {msg.ai_model && (
                <Text style={[styles.msgAuthor, isRTL && styles.textRTL]}>
                  — {msg.ai_model}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  // ─── Goals tab ─────────────────────────────────────────────────────────────
  const renderGoals = () => (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={GOLD}
          colors={[GOLD]}
        />
      }
    >
      {goalsLoading && categoryGoals.length === 0 ? (
        <View style={styles.center}>
          <Spinner size="large" status="warning" />
        </View>
      ) : categoryGoals.length === 0 ? (
        renderEmpty(t('goals.noGoals'))
      ) : (
        categoryGoals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={[styles.goalHeader, isRTL && styles.rowRev]}>
              <View style={[styles.goalTitleRow, isRTL && styles.rowRev]}>
                {goal.status === 'completed' && (
                  <Icon name="checkmark-circle" style={styles.checkIcon} fill="#4CAF82" />
                )}
                <Text
                  style={[styles.goalTitle, isRTL && styles.textRTL]}
                  numberOfLines={2}
                >
                  {goal.title}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: category.color + '33' }]}>
                <Text style={[styles.statusText, { color: category.color }]}>
                  {goal.status_display}
                </Text>
              </View>
            </View>

            {goal.description ? (
              <Text style={[styles.goalDesc, isRTL && styles.textRTL]}>
                {goal.description}
              </Text>
            ) : null}

            {goal.status !== 'completed' && (
              <>
                <View style={[styles.progressMeta, isRTL && styles.rowRev]}>
                  <Text style={styles.progressLabel}>{t('goals.progress')}</Text>
                  <Text style={[styles.progressValue, { color: category.color }]}>
                    {goal.progress_percentage}%
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${goal.progress_percentage}%` as any,
                        backgroundColor: category.color,
                      },
                    ]}
                  />
                </View>
              </>
            )}

            {goal.target_date ? (
              <View style={[styles.goalFooter, isRTL && styles.rowRev]}>
                <Icon name="calendar-outline" style={styles.dateIcon} fill={MUTED} />
                <Text style={styles.goalDate}>
                  {t('goals.targetDate')}: {new Date(goal.target_date).toLocaleDateString()}
                </Text>
              </View>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );

  // ─── Root ──────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      {/* Gradient backdrop */}
      <LinearGradient
        colors={['#6B3A20', BG, '#3D2110']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <AppHeader title={categoryName} showUserInfo={false} showBack={true} />

      {/* Category hero */}
      <View style={styles.hero}>
        <LinearGradient
          colors={[category.color, category.color + 'BB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}
        >
          <Icon name={category.iconName} style={styles.heroIcon} fill="#ffffff" />
        </LinearGradient>
        <Text style={[styles.heroTitle, isRTL && styles.textRTL]}>{categoryName}</Text>
        <Text style={[styles.heroDesc, isRTL && styles.textRTL]}>{categoryDesc}</Text>
      </View>

      {/* Gold divider */}
      <View style={styles.heroDivider} />

      {/* Custom tab bar */}
      <View style={[styles.tabBar, isRTL && styles.rowRev]}>
        {([t('messages.title'), t('news.title')] as string[]).map((label, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tabBtn, tab === i && styles.tabBtnActive]}
            onPress={() => setTab(i as 0 | 1)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabLabel, tab === i && styles.tabLabelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      <View style={styles.tabPane}>
        {tab === 0 ? renderMessages() : renderGoals()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },

  // ─── Hero ────────────────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  heroIcon: {
    width: 38,
    height: 38,
  },
  heroTitle: {
    fontFamily: FontFamily.arabicBold,
    fontSize: 22,
    color: TEXT,
    marginBottom: 6,
    textAlign: 'center',
  },
  heroDesc: {
    fontFamily: FontFamily.arabic,
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(164, 129, 17, 0.30)',
    marginHorizontal: 20,
  },

  // ─── Tab bar ─────────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: 'rgba(49, 30, 19, 0.50)',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: GOLD,
  },
  tabLabel: {
    fontFamily: FontFamily.arabicMedium,
    fontSize: 13,
    color: MUTED,
  },
  tabLabelActive: {
    color: '#fff',
    fontFamily: FontFamily.arabicBold,
  },
  tabPane: {
    flex: 1,
  },

  // ─── Tab content ─────────────────────────────────────────────────────────
  tabContent: {
    padding: 16,
    paddingBottom: 36,
    gap: 12,
  },

  // ─── Message card ─────────────────────────────────────────────────────────
  msgCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    padding: 16,
  },
  msgMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    backgroundColor: 'rgba(164, 129, 17, 0.18)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeBadgeText: {
    fontFamily: FontFamily.arabicMedium,
    fontSize: 10,
    color: GOLD_SOLID,
    textTransform: 'uppercase',
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  msgContent: {
    fontFamily: FontFamily.arabic,
    fontSize: 15,
    color: TEXT,
    lineHeight: 24,
    marginBottom: 8,
  },
  msgAuthor: {
    fontFamily: FontFamily.arabicLight,
    fontSize: 12,
    color: MUTED,
    fontStyle: 'italic',
  },

  // ─── Goal card ────────────────────────────────────────────────────────────
  goalCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  checkIcon: {
    width: 18,
    height: 18,
    flexShrink: 0,
  },
  goalTitle: {
    fontFamily: FontFamily.arabicBold,
    fontSize: 15,
    color: TEXT,
    flex: 1,
    lineHeight: 22,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  statusText: {
    fontFamily: FontFamily.arabicMedium,
    fontSize: 11,
  },
  goalDesc: {
    fontFamily: FontFamily.arabic,
    fontSize: 13,
    color: MUTED,
    lineHeight: 20,
    marginBottom: 12,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontFamily: FontFamily.arabicMedium,
    fontSize: 12,
    color: MUTED,
  },
  progressValue: {
    fontFamily: FontFamily.arabicBold,
    fontSize: 12,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(250, 248, 245, 0.12)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateIcon: {
    width: 13,
    height: 13,
  },
  goalDate: {
    fontFamily: FontFamily.arabic,
    fontSize: 12,
    color: MUTED,
  },

  // ─── Empty ────────────────────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    alignItems: 'center',
    paddingVertical: 52,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    marginBottom: 14,
  },
  emptyText: {
    fontFamily: FontFamily.arabicMedium,
    fontSize: 15,
    color: MUTED,
    textAlign: 'center',
  },

  // ─── RTL / shared ─────────────────────────────────────────────────────────
  textRTL: {
    textAlign: 'right',
  },
  rowRev: {
    flexDirection: 'row-reverse',
  },
});
