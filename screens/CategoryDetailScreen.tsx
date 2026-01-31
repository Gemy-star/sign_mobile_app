// screens/CategoryDetailScreen.tsx
// Category Detail Screen with messages and goals for a specific category

import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals } from '@/store/slices/goalsSlice';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { Card, Icon, Layout, ProgressBar, Spinner, Tab, TabView, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type CategoryId = 'mental' | 'physical' | 'career' | 'financial' | 'relationships' | 'spiritual' | 'creativity' | 'lifestyle';

const categoryConfig: Record<CategoryId, { iconName: string; color: string }> = {
  mental: { iconName: 'bulb-outline', color: '#6366f1' },
  physical: { iconName: 'activity-outline', color: '#10b981' },
  career: { iconName: 'briefcase-outline', color: '#8b5cf6' },
  financial: { iconName: 'credit-card-outline', color: '#f59e0b' },
  relationships: { iconName: 'heart-outline', color: '#ef4444' },
  spiritual: { iconName: 'star-outline', color: '#3b82f6' },
  creativity: { iconName: 'color-palette-outline', color: '#9a7cb6' },
  lifestyle: { iconName: 'sun-outline', color: '#38b2ac' },
};

export default function CategoryDetailScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: CategoryId }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';

  const { messages, isLoading: messagesLoading } = useAppSelector((state) => state.messages);
  const { goals, isLoading: goalsLoading } = useAppSelector((state) => state.goals);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const category = categoryId ? categoryConfig[categoryId] : categoryConfig.mental;
  const categoryName = t(`categories.${categoryId}.name`);
  const categoryDesc = t(`categories.${categoryId}.description`);

  useEffect(() => {
    // Fetch data for this category
    dispatch(fetchMessages({
      pagination: { page: 1, page_size: 20 },
      filters: { language }
    }));
    dispatch(fetchGoals({}));
  }, [dispatch, categoryId, language]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchMessages({
        pagination: { page: 1, page_size: 20 },
        filters: { language }
      })),
      dispatch(fetchGoals({}))
    ]);
    setRefreshing(false);
  };

  // Filter messages and goals by category
  const categoryMessages = messages.filter(m => m.scope_name?.toLowerCase().includes(categoryId));
  const categoryGoals = goals.filter(g => g.scope_name?.toLowerCase().includes(categoryId));

  const renderMessagesTab = () => (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {messagesLoading && categoryMessages.length === 0 ? (
        <View style={styles.center}>
          <Spinner size="large" />
        </View>
      ) : categoryMessages.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Icon name="inbox-outline" style={styles.emptyIcon} fill="#A0AEC0" />
          <Text category="h6" appearance="hint" style={styles.emptyText}>
            {t('messages.noMessages')}
          </Text>
        </Card>
      ) : (
        categoryMessages.map((message) => (
          <TouchableOpacity
            key={message.id}
            onPress={() => router.push(`/message-detail?messageId=${message.id}`)}
          >
            <Card style={styles.messageCard}>
              <View style={[styles.messageHeader, isRTL && styles.messageHeaderRTL]}>
                <View style={styles.messageBadge}>
                  <Text category="c1" appearance="hint" style={styles.badgeText}>
                    {message.message_type_display}
                  </Text>
                </View>
                {message.is_favorited && (
                  <Icon name="star" style={styles.starIcon} fill="#f59e0b" />
                )}
              </View>
              <Text category="p1" style={[styles.messageContent, isRTL && styles.textRTL]}>
                {message.content}
              </Text>
              {message.ai_model && (
                <Text category="c1" appearance="hint" style={styles.messageAuthor}>
                  - {message.ai_model}
                </Text>
              )}
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderGoalsTab = () => (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {goalsLoading && categoryGoals.length === 0 ? (
        <View style={styles.center}>
          <Spinner size="large" />
        </View>
      ) : categoryGoals.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Icon name="inbox-outline" style={styles.emptyIcon} fill="#A0AEC0" />
          <Text category="h6" appearance="hint" style={styles.emptyText}>
            {t('goals.noGoals')}
          </Text>
        </Card>
      ) : (
        categoryGoals.map((goal) => (
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
              <View style={[styles.statusBadge, { backgroundColor: category.color }]}>
                <Text style={styles.statusText}>{goal.status_display}</Text>
              </View>
            </View>

            {goal.description && (
              <Text category="p2" appearance="hint" style={[styles.goalDescription, isRTL && styles.textRTL]}>
                {goal.description}
              </Text>
            )}

            {goal.status !== 'completed' && (
              <>
                <View style={[styles.progressContainer, isRTL && styles.progressContainerRTL]}>
                  <Text category="s2" appearance="hint">{t('goals.progress')}</Text>
                  <Text category="s2" style={{ color: category.color }}>
                    {goal.progress_percentage}%
                  </Text>
                </View>
                <ProgressBar
                  progress={goal.progress_percentage / 100}
                  style={styles.progressBar}
                  status={goal.progress_percentage >= 75 ? 'success' : goal.progress_percentage >= 50 ? 'info' : 'warning'}
                />
              </>
            )}

            {goal.target_date && (
              <View style={[styles.goalFooter, isRTL && styles.goalFooterRTL]}>
                <Icon name="calendar-outline" style={styles.dateIcon} fill="#A0AEC0" />
                <Text category="c1" appearance="hint">
                  {t('goals.targetDate')}: {new Date(goal.target_date).toLocaleDateString()}
                </Text>
              </View>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );

  return (
    <Layout style={styles.container} level="1">
      <AppHeader title={categoryName} showUserInfo={false} />

      {/* Category Header */}
      <View style={styles.categoryHeader}>
        <LinearGradient
          colors={[category.color, `${category.color}dd`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <Icon name={category.iconName} style={styles.categoryIcon} fill="#ffffff" />
        </LinearGradient>
        <Text category="h5" style={[styles.categoryTitle, isRTL && styles.textRTL]}>
          {categoryName}
        </Text>
        <Text category="p2" appearance="hint" style={[styles.categoryDescription, isRTL && styles.textRTL]}>
          {categoryDesc}
        </Text>
      </View>

      {/* Tabs */}
      <TabView
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}
        style={styles.tabView}
      >
        <Tab title={t('messages.title')}>
          {renderMessagesTab()}
        </Tab>
        <Tab title={t('news.title')}>
          {renderGoalsTab()}
        </Tab>
      </TabView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  categoryHeader: {
    padding: 20,
    alignItems: 'center',
  },
  categoryGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
  },
  categoryTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryDescription: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
    paddingBottom: 40,
  },
  messageCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  messageBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: 'IBMPlexSansArabic-Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  messageContent: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'IBMPlexSansArabic-Regular',
    marginBottom: 8,
  },
  messageAuthor: {
    fontStyle: 'italic',
    fontFamily: 'IBMPlexSansArabic-Light',
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  goalDescription: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressContainerRTL: {
    flexDirection: 'row-reverse',
  },
  progressBar: {
    marginBottom: 12,
    height: 8,
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalFooterRTL: {
    flexDirection: 'row-reverse',
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
  textRTL: {
    textAlign: 'right',
  },
});
