import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MOCK_GOALS } from '@/services/goals.mock';
import { Card, Icon, Layout, ProgressBar, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GoalsScreen() {
  const { t, language } = useLanguage();
  const { colors, colorScheme } = useTheme();
  const isRTL = language === 'ar';
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const mutedColor = isDark ? '#A0AEC0' : '#718096';
  const borderColor = isDark ? '#2D3748' : '#E2E8F0';
  const filterBgInactive = isDark ? '#1A1A1A' : '#F7FAFC';
  const filterBgActive = isDark ? '#FFFFFF' : '#000000';
  const filterTextInactive = isDark ? '#A0AEC0' : '#4A5568';
  const filterTextActive = isDark ? '#000000' : '#FFFFFF';

  const filteredGoals = MOCK_GOALS.filter(goal => {
    if (filter === 'completed') return goal.isCompleted;
    if (filter === 'active') return !goal.isCompleted;
    return true;
  });

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
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filter === 'all' ? filterBgActive : filterBgInactive }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'all' ? filterTextActive : filterTextInactive }
          ]}>
            {t('goals.all')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filter === 'active' ? filterBgActive : filterBgInactive }
          ]}
          onPress={() => setFilter('active')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'active' ? filterTextActive : filterTextInactive }
          ]}>
            {t('goals.active')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filter === 'completed' ? filterBgActive : filterBgInactive }
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[
            styles.filterText,
            { color: filter === 'completed' ? filterTextActive : filterTextInactive }
          ]}>
            {t('goals.completed')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text category="h4" style={styles.statNumber}>{MOCK_GOALS.length}</Text>
            <Text category="s2" appearance="hint">{t('goals.total')}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text category="h4" style={[styles.statNumber, { color: '#48BB78' }]}>
              {MOCK_GOALS.filter(g => g.isCompleted).length}
            </Text>
            <Text category="s2" appearance="hint">{t('goals.completed')}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text category="h4" style={[styles.statNumber, { color: '#4299E1' }]}>
              {MOCK_GOALS.filter(g => !g.isCompleted).length}
            </Text>
            <Text category="s2" appearance="hint">{t('goals.active')}</Text>
          </Card>
        </View>

        {/* Goals List */}
        {filteredGoals.map((goal) => (
          <Card key={goal.id} style={styles.goalCard}>
            <View style={[styles.goalHeader, isRTL && styles.goalHeaderRTL]}>
              <View style={styles.goalTitleContainer}>
                {goal.isCompleted && (
                  <Icon name="checkmark-circle" style={styles.checkIcon} fill="#48BB78" />
                )}
                <Text category="h6" style={[styles.goalTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? goal.title.ar : goal.title.en}
                </Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(goal.priority) }]}>
                <Text style={styles.priorityText}>
                  {goal.priority === 'high' ? '🔴' : goal.priority === 'medium' ? '🟡' : '🔵'}
                </Text>
              </View>
            </View>

            <Text category="p2" appearance="hint" style={[styles.goalDescription, isRTL && styles.textRTL]}>
              {language === 'ar' ? goal.description.ar : goal.description.en}
            </Text>

            <View style={styles.categoryBadgeContainer}>
              <Text style={styles.categoryBadge}>
                {t(`categories.${goal.category}.name`)}
              </Text>
            </View>

            {!goal.isCompleted && (
              <>
                <View style={styles.progressContainer}>
                  <Text category="s2" appearance="hint">{t('goals.progress')}</Text>
                  <Text category="s2" style={{ color: getProgressColor(goal.progress) }}>
                    {goal.progress}%
                  </Text>
                </View>
                <ProgressBar
                  progress={goal.progress / 100}
                  style={styles.progressBar}
                  status={goal.progress >= 75 ? 'success' : goal.progress >= 50 ? 'info' : 'warning'}
                />
              </>
            )}

            <View style={[styles.goalFooter, isRTL && styles.goalFooterRTL]}>
              <View style={styles.dateContainer}>
                <Icon name="calendar-outline" style={styles.dateIcon} fill={mutedColor} />
                <Text category="c1" appearance="hint">
                  {t('goals.targetDate')}: {new Date(goal.targetDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
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
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansArabic-Medium',
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
