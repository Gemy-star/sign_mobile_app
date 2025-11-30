import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals, setFilters } from '@/store/slices/goalsSlice';
import { Button, Card, Icon, Layout, ProgressBar, Spinner, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function GoalsScreen() {
  const dispatch = useAppDispatch();
  // Context for UI preferences (theme, language)
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  // Redux for goals data
  const { goals, isLoading, filters } = useAppSelector((state) => state.goals);

  const isRTL = language === 'ar';
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#F8F8F8' : '#0F0F0F';
  const mutedColor = isDark ? '#A0AEC0' : '#718096';
  const borderColor = isDark ? '#2D3748' : '#E2E8F0';
  const progressBgColor = isDark ? '#2E2E2E' : '#F8F8F8';

  // Fetch goals on mount
  useEffect(() => {
    dispatch(fetchGoals({}));
  }, [dispatch]);

  // Apply filter
  useEffect(() => {
    const goalFilters = filter === 'completed'
      ? { is_completed: true }
      : filter === 'active'
      ? { is_completed: false }
      : {};

    dispatch(setFilters(goalFilters));
    dispatch(fetchGoals({ filters: goalFilters }));
  }, [filter, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchGoals({ filters: filters }));
  };

  // Filter goals based on current filter state
  const filteredGoals = React.useMemo(() => {
    if (filter === 'completed') {
      return goals.filter(g => g.status === 'completed');
    } else if (filter === 'active') {
      return goals.filter(g => g.status !== 'completed');
    }
    return goals;
  }, [goals, filter]);

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return '#48BB78';
    if (progress >= 50) return '#4299E1';
    if (progress >= 25) return '#ED8936';
    return '#F56565';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return '#F56565';
    if (priority === 'medium') return '#ED8936';
    return '#4299E1';
  };

  return (
    <Layout style={styles.container} level="1">
      <AppHeader title={t('news.title')} showUserInfo={false} />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Button
          style={styles.filterButton}
          appearance={filter === 'all' ? 'filled' : 'outline'}
          size="small"
          onPress={() => setFilter('all')}
        >
          {() => <Text>{t('goals.all')}</Text>}
        </Button>
        <Button
          style={styles.filterButton}
          appearance={filter === 'active' ? 'filled' : 'outline'}
          size="small"
          onPress={() => setFilter('active')}
        >
          {() => <Text>{t('goals.active')}</Text>}
        </Button>
        <Button
          style={styles.filterButton}
          appearance={filter === 'completed' ? 'filled' : 'outline'}
          size="small"
          onPress={() => setFilter('completed')}
        >
          {() => <Text>{t('goals.completed')}</Text>}
        </Button>
      </View>

      {isLoading && goals.length === 0 ? (
        <View style={styles.center}>
          <Spinner size="giant" status="primary" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
        >
          {/* Stats Summary */}
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Text category="h4" style={[styles.statNumber, styles.highlightText]}>{goals.length}</Text>
              <Text category="s2" appearance="hint" style={styles.mutedText}>{t('goals.total')}</Text>
            </Card>
          <Card style={styles.statCard}>
            <Text category="h4" style={[styles.statNumber, styles.highlightText]}>
              {goals.filter(g => g.status === 'completed').length}
            </Text>
            <Text category="s2" appearance="hint" style={styles.mutedText}>{t('goals.completed')}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text category="h4" style={[styles.statNumber, styles.highlightText]}>
              {goals.filter(g => g.status !== 'completed').length}
            </Text>
            <Text category="s2" appearance="hint" style={styles.mutedText}>{t('goals.active')}</Text>
          </Card>
        </View>

        {/* Goals List */}
        {filteredGoals.map((goal) => (
          <Card key={goal.id} style={styles.goalCard}>
            <View style={[styles.goalHeader, isRTL && styles.goalHeaderRTL]}>
              <View style={styles.goalTitleContainer}>
                {goal.status === 'completed' && (
                  <Icon name="checkmark-circle" style={styles.checkIcon} fill="#48BB78" />
                )}
                <Text category="h6" style={[styles.goalTitle, isRTL && styles.textRTL]}>
                  {goal.title}
                </Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: '#6366f1' }]}>
                <Text style={styles.priorityText}>
                  {goal.status_display || goal.status}
                </Text>
              </View>
            </View>

            {goal.description && (
              <Text category="p2" appearance="hint" style={[styles.goalDescription, isRTL && styles.textRTL]}>
                {goal.description}
              </Text>
            )}

            {goal.scope_name && (
              <View style={styles.categoryBadgeContainer}>
                <Text style={styles.categoryBadge}>
                  {goal.scope_name}
                </Text>
              </View>
            )}

            {goal.status !== 'completed' && (
              <>
                <View style={styles.progressContainer}>
                  <Text category="s2" appearance="hint" style={styles.mutedText}>{t('goals.progress')}</Text>
                  <Text category="s2" style={styles.highlightText}>
                    {goal.progress_percentage}%
                  </Text>
                </View>
                <ProgressBar
                  progress={goal.progress_percentage / 100}
                  style={[styles.progressBar, { backgroundColor: progressBgColor }]}
                  indicatorStyle={{ backgroundColor: '#A48111' }}
                  status="warning"
                />
              </>
            )}

            {goal.target_date && (
              <View style={[styles.goalFooter, isRTL && styles.goalFooterRTL]}>
                <View style={styles.dateContainer}>
                  <Icon name="calendar-outline" style={styles.dateIcon} fill={mutedColor} />
                  <Text category="c1" appearance="hint">
                    {t('goals.targetDate')}: {new Date(goal.target_date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </Card>
        ))}

        {filteredGoals.length === 0 && (
          <Card style={styles.emptyCard}>
            <Icon name="inbox-outline" style={styles.emptyIcon} fill={borderColor} />
            <Text category="h6" appearance="hint" style={styles.emptyText}>
              {t('goals.noGoals')}
            </Text>
          </Card>
        )}
      </ScrollView>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1 },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
  },
  content: { padding: 16 },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginBottom: 4,
  },
  highlightText: {
    color: '#A48111',
  },
  mutedText: {
    color: '#A48111',
    opacity: 0.7,
  },
  goalCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
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
    fontFamily: 'IBMPlexSansArabic-Bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
  },
  goalDescription: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  categoryBadgeContainer: {
    marginBottom: 12,
  },
  categoryBadge: {
    fontSize: 11,
    fontFamily: 'IBMPlexSansArabic-Medium',
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    opacity: 0.6,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    marginBottom: 12,
    height: 8,
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalFooterRTL: {
    flexDirection: 'row-reverse',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateIcon: {
    width: 14,
    height: 14,
  },
  emptyCard: {
    borderRadius: 16,
    alignItems: 'center',
    padding: 48,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  textRTL: { textAlign: 'right' },
});
