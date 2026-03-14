import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals, setFilters } from '@/store/slices/goalsSlice';
import { Icon, ProgressBar, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const GRADIENT: [string, string, string] = [
  'rgba(49,30,19,0.85)',
  'rgba(83,50,29,0.90)',
  'rgba(49,30,19,0.85)',
];

type FilterValue = 'all' | 'active' | 'completed';

export default function GoalsScreen() {
  const dispatch = useAppDispatch();
  useTheme();
  const { t, language } = useLanguage();
  const { goals, isLoading, filters } = useAppSelector((state) => state.goals);

  const isRTL = language === 'ar';
  const [filter, setFilter] = useState<FilterValue>('all');

  useEffect(() => {
    dispatch(fetchGoals({}));
  }, [dispatch]);

  useEffect(() => {
    const goalFilters =
      filter === 'completed'
        ? { is_completed: true }
        : filter === 'active'
        ? { is_completed: false }
        : {};

    dispatch(setFilters(goalFilters));
    dispatch(fetchGoals({ filters: goalFilters }));
  }, [filter, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchGoals({ filters }));
  };

  const filteredGoals = useMemo(() => {
    if (filter === 'completed') return goals.filter((g) => g.status === 'completed');
    if (filter === 'active') return goals.filter((g) => g.status !== 'completed');
    return goals;
  }, [goals, filter]);

  const totalCount     = goals.length;
  const completedCount = goals.filter((g) => g.status === 'completed').length;
  const activeCount    = goals.filter((g) => g.status !== 'completed').length;

  const filterOptions: { value: FilterValue; label: string }[] = [
    { value: 'all',       label: t('goals.all') },
    { value: 'active',    label: t('goals.active') },
    { value: 'completed', label: t('goals.completed') },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFillObject} />

      <AppHeader title={t('news.title')} showUserInfo={false} />

      {/* Filter Pills */}
      <View style={[styles.filterContainer, isRTL && styles.filterContainerRTL]}>
        {filterOptions.map((opt) => {
          const active = filter === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.filterPill, active && styles.filterPillActive]}
              onPress={() => setFilter(opt.value)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading && goals.length === 0 ? (
        <View style={styles.center}>
          <Spinner size="giant" status="control" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor="#FAF8F5"
            />
          }
        >
          {/* Stat Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>{t('goals.total')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>{t('goals.completed')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{activeCount}</Text>
              <Text style={styles.statLabel}>{t('goals.active')}</Text>
            </View>
          </View>

          {/* Goal Cards */}
          {filteredGoals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              {/* Header */}
              <View style={[styles.goalHeader, isRTL && styles.goalHeaderRTL]}>
                <View style={styles.goalTitleContainer}>
                  {goal.status === 'completed' && (
                    <Icon name="checkmark-circle" style={styles.checkIcon} fill="#48BB78" />
                  )}
                  <Text style={[styles.goalTitle, isRTL && styles.textRTL]}>
                    {goal.title}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {goal.status_display || goal.status}
                  </Text>
                </View>
              </View>

              {/* Description */}
              {goal.description && (
                <Text style={[styles.goalDescription, isRTL && styles.textRTL]}>
                  {goal.description}
                </Text>
              )}

              {/* Scope badge */}
              {goal.scope_name && (
                <View style={styles.categoryBadgeContainer}>
                  <Text style={styles.categoryBadge}>{goal.scope_name}</Text>
                </View>
              )}

              {/* Progress */}
              {goal.status !== 'completed' && (
                <>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabel}>{t('goals.progress')}</Text>
                    <Text style={styles.progressValue}>{goal.progress_percentage}%</Text>
                  </View>
                  <ProgressBar
                    progress={goal.progress_percentage / 100}
                    style={styles.progressBar}
                    indicatorStyle={{ backgroundColor: '#C96F4A' }}
                    status="warning"
                  />
                </>
              )}

              {/* Footer — target date */}
              {goal.target_date && (
                <View style={[styles.goalFooter, isRTL && styles.goalFooterRTL]}>
                  <Icon
                    name="calendar-outline"
                    style={styles.dateIcon}
                    fill="rgba(250,248,245,0.55)"
                  />
                  <Text style={styles.dateText}>
                    {t('goals.targetDate')}: {new Date(goal.target_date).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* Empty state */}
          {filteredGoals.length === 0 && (
            <View style={styles.emptyCard}>
              <Icon
                name="inbox-outline"
                style={styles.emptyIcon}
                fill="rgba(250,248,245,0.3)"
              />
              <Text style={styles.emptyText}>{t('goals.noGoals')}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#53321D',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Filter pills
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: width > 600 ? 24 : 16,
    paddingVertical: width > 600 ? 16 : 12,
    gap: width > 600 ? 12 : 8,
  },
  filterContainerRTL: {
    flexDirection: 'row-reverse',
  },
  filterPill: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(250,248,245,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: '#A48111',
  },
  filterPillText: {
    color: 'rgba(250,248,245,0.6)',
    fontSize: 13,
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  // Scroll content
  content: {
    padding: width > 600 ? 24 : 16,
    paddingBottom: 100,
  },
  // Stat cards
  statsContainer: {
    flexDirection: 'row',
    gap: width > 600 ? 16 : 12,
    marginBottom: width > 600 ? 20 : 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(49,30,19,0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: width > 600 ? 20 : 14,
    paddingHorizontal: 8,
  },
  statValue: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: width > 600 ? 28 : 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  // Goal cards
  goalCard: {
    backgroundColor: 'rgba(49,30,19,0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    padding: width > 600 ? 20 : 14,
    marginBottom: width > 600 ? 16 : 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  goalTitle: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: 'rgba(232,206,128,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(232,206,128,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: '#E8CE80',
    fontSize: 10,
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  goalDescription: {
    color: 'rgba(250,248,245,0.75)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  categoryBadgeContainer: {
    marginBottom: 10,
  },
  categoryBadge: {
    color: '#E8CE80',
    fontSize: 11,
    fontFamily: 'IBMPlexSansArabic-Medium',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    color: 'rgba(250,248,245,0.55)',
    fontSize: 12,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  progressValue: {
    color: '#E8CE80',
    fontSize: 12,
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  progressBar: {
    marginBottom: width > 600 ? 16 : 12,
    height: width > 600 ? 10 : 8,
    borderRadius: width > 600 ? 5 : 4,
    backgroundColor: 'rgba(250,248,245,0.12)',
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  goalFooterRTL: {
    flexDirection: 'row-reverse',
  },
  dateIcon: {
    width: width > 600 ? 16 : 14,
    height: width > 600 ? 16 : 14,
  },
  dateText: {
    color: 'rgba(250,248,245,0.55)',
    fontSize: 12,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  // Empty state
  emptyCard: {
    backgroundColor: 'rgba(49,30,19,0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: width > 600 ? 64 : 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: width > 600 ? 80 : 64,
    height: width > 600 ? 80 : 64,
    marginBottom: width > 600 ? 20 : 16,
  },
  emptyText: {
    color: 'rgba(250,248,245,0.55)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 15,
  },
  textRTL: {
    textAlign: 'right',
  },
});
