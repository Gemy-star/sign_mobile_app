// screens/DashboardScreen.tsx
// Main Dashboard Screen with improved UI

import AppHeader from '@/components/AppHeader';
import { MessageCard } from '@/components/dashboard/MessageCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { FontFamily } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import { fetchDailyMessage } from '@/store/slices/messagesSlice';
import { Card, Layout, Spinner, Text } from '@ui-kitten/components';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  const { stats, isLoading, lastFetched } = useAppSelector((state) => state.dashboard);
  const { dailyMessage } = useAppSelector((state) => state.messages);

  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';

  // Fetch dashboard data
  useEffect(() => {
    const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
    const isStale = !lastFetched || Date.now() - lastFetched > CACHE_TIME;

    if (isStale) {
      dispatch(fetchDashboardStats(language));
      dispatch(fetchDailyMessage());
    }
  }, [dispatch, lastFetched, language]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats(language));
    dispatch(fetchDailyMessage());
  };

  const navigateToMessages = () => {
    router.push('/all-messages');
  };

  // Stats data
  const statsData = {
    todayMessages: stats?.stats?.messages_today || 3,
    totalMessages: stats?.stats?.total_messages || 127,
    favoriteMessages: stats?.stats?.favorite_messages || 23,
    currentStreak: stats?.stats?.current_streak || 12,
  };

  const recentMessages = stats?.recent_messages || [];

  if (isLoading && !stats) {
    return (
      <Layout style={styles.container} level="1">
        <AppHeader />
        <View style={styles.center}>
          <Spinner size="giant" />
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="1">
      <AppHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Stats Grid - 2x2 layout matching screenshots */}
        <View style={styles.statsGrid}>
          {/* Today's Messages - Purple */}
          <View style={styles.statItem}>
            <StatCard
              value={statsData.todayMessages}
              label={t('home.stats.todayMessages')}
              icon="flash-outline"
              colors={['#8b5cf6', '#6366f1']}
            />
          </View>

          {/* Total Messages - Green */}
          <View style={styles.statItem}>
            <StatCard
              value={statsData.totalMessages}
              label={t('home.stats.totalMessages')}
              colors={['#10b981', '#059669']}
            />
          </View>

          {/* Favorite Messages - Orange */}
          <View style={styles.statItem}>
            <StatCard
              value={statsData.favoriteMessages}
              label={t('home.stats.favoriteMessages')}
              icon="star"
              colors={['#f59e0b', '#d97706']}
            />
          </View>

          {/* Current Streak - Red */}
          <View style={styles.statItem}>
            <StatCard
              value={statsData.currentStreak}
              label={t('home.stats.currentStreak')}
              icon="trending-up-outline"
              emoji="⭐"
              colors={['#ef4444', '#dc2626']}
            />
          </View>
        </View>

        {/* Streak Card - Full width */}
        <View style={styles.streakContainer}>
          <StatCard
            value={`${statsData.currentStreak} 🔥`}
            label={t('home.streak')}
            colors={['#ef4444', '#dc2626']}
          />
        </View>

        {/* Recent Messages Section */}
        <Card style={styles.sectionCard}>
          <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
            <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('home.motivationalMessages')}
            </Text>
          </View>

          {recentMessages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('home.noRecentMessages')}</Text>
            </View>
          ) : (
            recentMessages.slice(0, 5).map((message: any) => (
              <MessageCard
                key={message.id}
                content={message.content || ''}
                category={message.scope_name || message.message_type_display || 'General'}
                isFavorited={message.is_favorited}
                author={message.ai_model}
                isRTL={isRTL}
                onPress={navigateToMessages}
              />
            ))
          )}
        </Card>
      </ScrollView>
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 12,
  },
  statItem: {
    width: '50%',
    padding: 6,
  },
  streakContainer: {
    marginBottom: 16,
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  sectionTitle: {
    fontFamily: FontFamily.arabicBold,
    fontSize: 18,
  },
  textRTL: {
    textAlign: 'right',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    fontFamily: FontFamily.arabic,
    fontSize: 14,
  },
});
