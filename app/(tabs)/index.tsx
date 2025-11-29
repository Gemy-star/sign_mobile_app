// app/(tabs)/index.tsx
// Main Dashboard with UI Kitten

import AppHeader from '@/components/AppHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MOCK_MESSAGES } from '@/services/message.mock';
import { Card, Icon, Layout, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [loading] = useState(false);

  const isRTL = language === 'ar';

  const stats = {
    messages_today: 5,
    total_messages: MOCK_MESSAGES.length,
    favorite_messages: MOCK_MESSAGES.filter(m => m.isFavorite).length,
    current_streak: 7,
  };

  const categories = [
    { id: 'mental', icon: 'flash-outline', color: '#6366f1', emoji: '🧠', nameKey: 'mental' },
    { id: 'physical', icon: 'activity-outline', color: '#10b981', emoji: '💪', nameKey: 'physical' },
    { id: 'career', icon: 'briefcase-outline', color: '#8b5cf6', emoji: '💼', nameKey: 'career' },
    { id: 'financial', icon: 'trending-up-outline', color: '#f59e0b', emoji: '💰', nameKey: 'financial' },
    { id: 'relationships', icon: 'heart-outline', color: '#ef4444', emoji: '❤️', nameKey: 'relationships' },
    { id: 'spiritual', icon: 'sun-outline', color: '#3b82f6', emoji: '🕊️', nameKey: 'spiritual' },
    { id: 'creativity', icon: 'color-palette-outline', color: '#9a7cb6', emoji: '🎨', nameKey: 'creativity' },
    { id: 'lifestyle', icon: 'globe-outline', color: '#14b8a6', emoji: '🌍', nameKey: 'lifestyle' },
  ];

  const recentMessages = MOCK_MESSAGES.slice(0, 3);

  if (loading) {
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <Icon name="flash-outline" style={styles.statIcon} fill="#ffffff" />
              <Text style={styles.statValue}>{stats.messages_today}</Text>
              <Text style={styles.statLabel}>{t('home.messagesTitle')}</Text>
            </LinearGradient>
          </Card>

          <Card style={styles.statCard}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <Text style={styles.statValue}>{stats.total_messages}</Text>
              <Text style={styles.statLabel}>{t('home.totalMessages')}</Text>
            </LinearGradient>
          </Card>

          <Card style={styles.statCard}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <Icon name="star" style={styles.statIcon} fill="#ffffff" />
              <Text style={styles.statValue}>{stats.favorite_messages}</Text>
              <Text style={styles.statLabel}>{t('home.favorites')}</Text>
            </LinearGradient>
          </Card>

          <Card style={styles.statCard}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <Text style={styles.statValue}>{stats.current_streak} 🔥</Text>
              <Text style={styles.statLabel}>{t('home.streak')}</Text>
            </LinearGradient>
          </Card>
        </View>

        {/* Categories */}
        <Card style={styles.sectionCard}>
          <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t('home.categories')}
          </Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <LinearGradient
                  colors={[category.color, `${category.color}dd`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </LinearGradient>
                <Text style={[styles.categoryName, isRTL && styles.textRTL]}>
                  {t(`categories.${category.nameKey}.name`) || category.nameKey}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Recent Messages */}
        <Card style={styles.sectionCard}>
          <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
            <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('home.recentMessages')}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                {t('home.viewAll')}
              </Text>
            </TouchableOpacity>
          </View>

          {recentMessages.length === 0 ? (
            <Text style={styles.emptyText}>{t('home.noRecentMessages')}</Text>
          ) : (
            recentMessages.map((message) => (
              <Card key={message.id} style={styles.messageCard}>
                <View style={[styles.messageHeader, isRTL && styles.messageHeaderRTL]}>
                  <Text style={styles.categoryBadge}>
                    {message.category}
                  </Text>
                  {message.isFavorite && <Icon name="star" style={styles.favoriteIcon} fill="#f59e0b" />}
                </View>
                <Text style={[styles.messageContent, isRTL && styles.textRTL]}>
                  {language === 'ar' ? message.content.ar : message.content.en}
                </Text>
                {message.author && (
                  <Text style={styles.messageAuthor}>- {message.author}</Text>
                )}
              </Card>
            ))
          )}
        </Card>
      </ScrollView>
    </Layout>
  );
}const styles = StyleSheet.create({
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
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  sectionTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  textRTL: {
    textAlign: 'right',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  categoryItem: {
    width: (width - 80) / 4,
    alignItems: 'center',
  },
  categoryGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  messageCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  categoryBadge: {
    fontSize: 12,
    textTransform: 'uppercase',
    opacity: 0.6,
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  messageContent: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  messageAuthor: {
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 8,
    fontFamily: 'IBMPlexSansArabic-Light',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 20,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  statIcon: {
    width: 24,
    height: 24,
  },
  favoriteIcon: {
    width: 16,
    height: 16,
  },
});
