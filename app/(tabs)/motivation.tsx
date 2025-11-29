// app/(tabs)/motivation.tsx
// Main Motivation App Dashboard Screen

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { dataService } from '@/services/data.service';
import { DashboardStats, Message } from '@/types/api';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Bell,
    Brain,
    Briefcase,
    Clock,
    DollarSign,
    Dumbbell,
    Heart,
    Palette,
    Send,
    Sparkles,
    Star,
    Sun,
    TrendingUp
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function MotivationScreen() {
  const { styles, colors, palette, spacing } = useAppStyles();
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dataService.getDashboardStats();

      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData?.stats || {
    messages_today: 0,
    total_messages: 0,
    favorite_messages: 0,
    current_streak: 0,
  };

  const categories = [
    { id: 'mental', icon: Brain, color: palette.primary, emoji: '🧠' },
    { id: 'physical', icon: Dumbbell, color: palette.success, emoji: '💪' },
    { id: 'career', icon: Briefcase, color: palette.secondary, emoji: '💼' },
    { id: 'financial', icon: DollarSign, color: palette.warning, emoji: '💰' },
    { id: 'relationships', icon: Heart, color: palette.danger, emoji: '❤️' },
    { id: 'spiritual', icon: Sparkles, color: palette.info, emoji: '🕊️' },
    { id: 'creativity', icon: Palette, color: '#9a7cb6', emoji: '🎨' },
    { id: 'lifestyle', icon: Sun, color: '#38b2ac', emoji: '🌍' },
  ];

  const recentMessages = dashboardData?.recent_messages || [];

  const getMessageContent = (message: Message) => {
    return message.content || '';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return t('motivation.justNow');
    if (diffHours === 1) return '1h ago';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleToggleFavorite = async (messageId: number) => {
    try {
      await dataService.toggleMessageFavorite(messageId);
      // Reload dashboard to reflect changes
      loadDashboardData();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.bodyTextSecondary, styles.mt2]}>
          {t('motivation.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center, { padding: spacing.xl }]}>
        <Text style={[styles.heading3, { color: palette.danger, marginBottom: spacing.md }]}>
          {t('motivation.error')}
        </Text>
        <Text style={[styles.bodyTextSecondary, { textAlign: 'center', marginBottom: spacing.lg }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={loadDashboardData}
        >
          <Text style={styles.buttonText}>{t('motivation.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.rowBetween, styles.mb3]}>
          <View>
            <Text style={styles.heading1}>{t('motivation.dashboard')}</Text>
            <Text style={styles.bodyTextSecondary}>{t('motivation.tagline')}</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>ME</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <Text style={[styles.heading3, styles.mb2]}>{t('motivation.myStats')}</Text>
        <View style={[styles.row, styles.mb3]}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: palette.primary }]}>
                  <Bell size={20} color="#fff" />
                </View>
              </View>
              <Text style={styles.statValue}>{stats.messages_today}</Text>
              <Text style={styles.statLabel}>{t('motivation.messagesToday')}</Text>
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: palette.info }]}>
                  <TrendingUp size={20} color="#fff" />
                </View>
              </View>
              <Text style={styles.statValue}>{stats.total_messages}</Text>
              <Text style={styles.statLabel}>{t('motivation.totalReceived')}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.row, styles.mb4]}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: palette.warning }]}>
                  <Star size={20} color="#fff" />
                </View>
              </View>
              <Text style={styles.statValue}>{stats.favorite_messages}</Text>
              <Text style={styles.statLabel}>{t('motivation.favorites')}</Text>
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: palette.success }]}>
                  <Clock size={20} color="#fff" />
                </View>
              </View>
              <Text style={styles.statValue}>{stats.current_streak}</Text>
              <Text style={styles.statLabel}>{t('motivation.currentStreak')}</Text>
              <View style={[styles.statTrend, { backgroundColor: `${palette.success}15` }]}>
                <Text style={[styles.smallText, { color: palette.success }]}>
                  {stats.current_streak} {t('motivation.days')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.heading3, styles.mb2]}>{t('motivation.quickActions')}</Text>
        <View style={styles.mb4}>
          <TouchableOpacity style={[styles.button, styles.buttonPrimary, styles.mb2]}>
            <Send size={18} color="#fff" />
            <Text style={styles.buttonText}>{t('motivation.sendNow')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonOutline]}>
            <Clock size={18} color={palette.primary} />
            <Text style={[styles.buttonText, styles.buttonTextOutline]}>
              {t('motivation.viewHistory')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Categories */}
        <Text style={[styles.heading3, styles.mb2]}>{t('motivation.selectCategories')}</Text>
        <View style={[styles.row, { flexWrap: 'wrap', marginBottom: spacing.lg }]}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.badge,
                {
                  backgroundColor: `${category.color}15`,
                  marginRight: spacing.sm,
                  marginBottom: spacing.sm,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                },
              ]}
            >
              <Text style={{ fontSize: 16 }}>{category.emoji}</Text>
              <Text style={[styles.badgeText, { color: category.color }]}>
                {t(`categories.${category.id}.name`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Messages */}
        <Text style={[styles.heading3, styles.mb2]}>{t('motivation.recentMessages')}</Text>
        {recentMessages.length > 0 ? (
          recentMessages.slice(0, 3).map((message) => (
            <View key={message.id} style={[styles.card, styles.mb2]}>
              <View style={styles.rowBetween}>
                <View style={[styles.badge, styles.badgePrimary, { marginBottom: spacing.sm }]}>
                  <Text style={[styles.badgeText, styles.badgeTextPrimary]}>
                    {message.scope_name || 'General'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleToggleFavorite(message.id)}>
                  <Star
                    size={16}
                    color={palette.warning}
                    fill={message.is_favorited ? palette.warning : 'transparent'}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.bodyText, styles.mb1]}>{getMessageContent(message)}</Text>
              <Text style={styles.caption}>
                {getTimeAgo(message.created_at)}
              </Text>
            </View>
          ))
        ) : (
          <View style={[styles.card, styles.center, { padding: spacing.xl }]}>
            <Text style={styles.bodyTextSecondary}>{t('motivation.noMessages')}</Text>
          </View>
        )}

        {/* Premium Prompt */}
        <LinearGradient
          colors={[palette.primary, palette.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { padding: spacing.lg }]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heading3, { color: '#fff', marginBottom: spacing.sm }]}>
                {t('motivation.upgradeToPremium')}
              </Text>
              <Text style={[styles.smallText, { color: 'rgba(255,255,255,0.9)' }]}>
                {t('motivation.customRingtones')}, {t('motivation.advancedAI')}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: '#fff', paddingHorizontal: spacing.lg }
              ]}
            >
              <Text style={[styles.buttonText, { color: palette.primary }]}>
                {t('motivation.upgradeNow')}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}
