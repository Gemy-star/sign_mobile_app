// app/(tabs)/index.tsx
// Main Dashboard - Motivational App

import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { dataService } from '@/services/data.service';
import { DashboardStats } from '@/types/api';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Brain,
  Briefcase,
  Calendar,
  DollarSign,
  Dumbbell,
  Flame,
  Heart,
  Palette,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { styles: appStyles, spacing, palette } = useAppStyles();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await dataService.getDashboardStats();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
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
    { id: 'mental', color: '#6366f1', emoji: '🧠', name: 'Mental' },
    { id: 'physical', color: '#10b981', emoji: '💪', name: 'Physical' },
    { id: 'career', color: '#8b5cf6', emoji: '💼', name: 'Career' },
    { id: 'financial', color: '#f59e0b', emoji: '💰', name: 'Financial' },
    { id: 'relationships', color: '#ef4444', emoji: '❤️', name: 'Relations' },
    { id: 'spiritual', color: '#3b82f6', emoji: '🕊️', name: 'Spiritual' },
    { id: 'creativity', color: '#9a7cb6', emoji: '🎨', name: 'Creative' },
    { id: 'lifestyle', color: '#38b2ac', emoji: '🌍', name: 'Lifestyle' },
  ];

  if (loading) {
    return (
      <ThemedView style={[appStyles.container, appStyles.center]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={appStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View style={[appStyles.mb3, { marginTop: spacing.lg }]}>
          <Text style={[appStyles.heading2, { color: colors.text }]}>
            {t('motivation.welcome')}, {user?.username || 'User'}! 👋
          </Text>
          <Text style={[appStyles.bodyTextSecondary, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            {t('motivation.tagline') || 'Stay motivated and achieve your goals'}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIconGradient}
            >
              <Zap size={20} color="#fff" />
            </LinearGradient>
            <Text style={[appStyles.heading1, { color: colors.text, marginTop: spacing.sm, fontSize: 28 }]}>
              {stats.messages_today}
            </Text>
            <Text style={[appStyles.smallText, { color: colors.textSecondary }]}>
              Today's Messages
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <LinearGradient
              colors={['#f59e0b', '#ef4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIconGradient}
            >
              <Flame size={20} color="#fff" />
            </LinearGradient>
            <Text style={[appStyles.heading1, { color: colors.text, marginTop: spacing.sm, fontSize: 28 }]}>
              {stats.current_streak}
            </Text>
            <Text style={[appStyles.smallText, { color: colors.textSecondary }]}>
              Day Streak
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <LinearGradient
              colors={['#10b981', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIconGradient}
            >
              <Star size={20} color="#fff" />
            </LinearGradient>
            <Text style={[appStyles.heading1, { color: colors.text, marginTop: spacing.sm, fontSize: 28 }]}>
              {stats.favorite_messages}
            </Text>
            <Text style={[appStyles.smallText, { color: colors.textSecondary }]}>
              Favorites
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <LinearGradient
              colors={['#3b82f6', '#6366f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statIconGradient}
            >
              <TrendingUp size={20} color="#fff" />
            </LinearGradient>
            <Text style={[appStyles.heading1, { color: colors.text, marginTop: spacing.sm, fontSize: 28 }]}>
              {stats.total_messages}
            </Text>
            <Text style={[appStyles.smallText, { color: colors.textSecondary }]}>
              Total Messages
            </Text>
          </View>
        </View>

        {/* Life Categories */}
        <View style={appStyles.mb4}>
          <Text style={[appStyles.heading2, { color: colors.text, marginBottom: spacing.md }]}>
            Focus Areas
          </Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, appStyles.card, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                  <Text style={{ fontSize: 32 }}>{category.emoji}</Text>
                </View>
                <Text style={[appStyles.smallText, { color: colors.text, textAlign: 'center', marginTop: spacing.sm }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={appStyles.mb4}>
          <Text style={[appStyles.heading2, { color: colors.text, marginBottom: spacing.md }]}>
            Quick Actions
          </Text>
          
          <TouchableOpacity style={[styles.actionCard, appStyles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.actionIcon, { backgroundColor: '#6366f115' }]}>
              <Calendar size={24} color="#6366f1" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[appStyles.bodyText, { color: colors.text, fontWeight: '600' }]}>
                Set Today's Goals
              </Text>
              <Text style={[appStyles.smallText, { color: colors.textSecondary, marginTop: 4 }]}>
                Define what you want to achieve today
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, appStyles.card, { backgroundColor: colors.surface, marginTop: spacing.md }]}>
            <View style={[styles.actionIcon, { backgroundColor: '#10b98115' }]}>
              <Zap size={24} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[appStyles.bodyText, { color: colors.text, fontWeight: '600' }]}>
                Get Motivated
              </Text>
              <Text style={[appStyles.smallText, { color: colors.textSecondary, marginTop: 4 }]}>
                Receive your personalized AI message
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    width: (width - 48 - 12) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 48 - 24) / 3,
    aspectRatio: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
});
