// app/(tabs)/motivation.tsx
// Motivation Screen with UI Kitten

import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { Card, Icon, Layout, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function MotivationScreen() {
  // Context for UI preferences (theme, language)
  const { colors, colorScheme } = useTheme();
  const { t, language } = useLanguage();

  // Redux state for global/API data
  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector((state) => state.messages);
  const [loading, setLoading] = useState(false);

  const isRTL = language === 'ar';

  useEffect(() => {
    // Fetch motivational messages if not already loaded
    if (messages.length === 0) {
      dispatch(fetchMessages({
        pagination: { page: 1, page_size: 5 }
      }));
    }
  }, [dispatch, messages.length]);  const categories = [
    { id: 'mental', iconName: 'bulb-outline', color: '#6366f1', emoji: '🧠' },
    { id: 'physical', iconName: 'activity-outline', color: '#10b981', emoji: '💪' },
    { id: 'career', iconName: 'briefcase-outline', color: '#8b5cf6', emoji: '💼' },
    { id: 'financial', iconName: 'credit-card-outline', color: '#f59e0b', emoji: '💰' },
    { id: 'relationships', iconName: 'heart-outline', color: '#ef4444', emoji: '❤️' },
    { id: 'spiritual', iconName: 'star-outline', color: '#3b82f6', emoji: '🕊️' },
    { id: 'creativity', iconName: 'color-palette-outline', color: '#9a7cb6', emoji: '🎨' },
    { id: 'lifestyle', iconName: 'sun-outline', color: '#38b2ac', emoji: '🌍' },
  ];

  const motivationalMessages = messages.slice(0, 5);

  if (loading) {
    return (
      <Layout style={styles.container} level="1">
        <AppHeader title={t('motivation.appName')} showUserInfo={false} />
        <View style={styles.center}>
          <Spinner size="giant" />
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="1">
      <AppHeader title={t('motivation.appName')} showUserInfo={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Categories */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('motivation.lifeAreas')}
        </Text>
        <Text category="p2" appearance="hint" style={[styles.sectionSubtitle, isRTL && styles.textRTL]}>
          {t('motivation.lifeAreasDesc')}
        </Text>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            return (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Card style={styles.categoryCard}>
                  <LinearGradient
                    colors={[category.color, `${category.color}dd`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryGradient}
                  >
                    <Icon name={category.iconName} style={styles.categoryIcon} fill="#ffffff" />
                  </LinearGradient>
                  <Text category="c1" style={[styles.categoryName, isRTL && styles.textRTL]}>
                    {t(`categories.${category.id}.name`) || category.id}
                  </Text>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Motivational Messages */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('motivation.aiMessages')}
        </Text>
        <Text category="p2" appearance="hint" style={[styles.sectionSubtitle, isRTL && styles.textRTL]}>
          {t('motivation.aiMessagesDesc')}
        </Text>

        {motivationalMessages.map((message: any) => (
          <Card key={message.id} style={styles.messageCard}>
            <View style={[styles.messageHeader, isRTL && styles.messageHeaderRTL]}>
              <Text category="c1" appearance="hint" style={styles.categoryBadge}>
                {message.scope_name || message.message_type_display}
              </Text>
              {message.is_favorited && <Icon name="star" style={styles.starIcon} fill="#f59e0b" />}
            </View>
            <Text category="p1" style={[styles.messageContent, isRTL && styles.textRTL]}>
              {message.content || ''}
            </Text>
            {message.ai_model && (
              <Text category="c1" appearance="hint" style={styles.messageAuthor}>
                - {message.ai_model}
              </Text>
            )}
          </Card>
        ))}
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
  sectionTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    marginBottom: 16,
  },
  textRTL: {
    textAlign: 'right',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryItem: {
    width: (width - 64) / 4,
  },
  categoryCard: {
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  categoryIcon: {
    width: 28,
    height: 28,
  },
  starIcon: {
    width: 16,
    height: 16,
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
  categoryBadge: {
    textTransform: 'uppercase',
    fontFamily: 'IBMPlexSansArabic-Medium',
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
});
