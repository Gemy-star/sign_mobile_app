// app/(tabs)/motivation.tsx
// Motivation Screen with UI Kitten

import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MOCK_MESSAGES } from '@/services/message.mock';
import { Card, Layout, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Brain,
    Briefcase,
    DollarSign,
    Dumbbell,
    Heart,
    Palette,
    Sparkles,
    Star,
    Sun
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function MotivationScreen() {
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const [loading] = useState(false);

  const isRTL = language === 'ar';

  const categories = [
    { id: 'mental', icon: Brain, color: '#6366f1', emoji: '🧠' },
    { id: 'physical', icon: Dumbbell, color: '#10b981', emoji: '💪' },
    { id: 'career', icon: Briefcase, color: '#8b5cf6', emoji: '💼' },
    { id: 'financial', icon: DollarSign, color: '#f59e0b', emoji: '💰' },
    { id: 'relationships', icon: Heart, color: '#ef4444', emoji: '❤️' },
    { id: 'spiritual', icon: Sparkles, color: '#3b82f6', emoji: '🕊️' },
    { id: 'creativity', icon: Palette, color: '#9a7cb6', emoji: '🎨' },
    { id: 'lifestyle', icon: Sun, color: '#38b2ac', emoji: '🌍' },
  ];

  const motivationalMessages = MOCK_MESSAGES.slice(0, 5);

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
            const IconComponent = category.icon;
            return (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Card style={styles.categoryCard}>
                  <LinearGradient
                    colors={[category.color, `${category.color}dd`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryGradient}
                  >
                    <IconComponent size={28} color="#ffffff" />
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

        {motivationalMessages.map((message) => (
          <Card key={message.id} style={styles.messageCard}>
            <View style={[styles.messageHeader, isRTL && styles.messageHeaderRTL]}>
              <Text category="c1" appearance="hint" style={styles.categoryBadge}>
                {message.category}
              </Text>
              {message.isFavorite && <Star size={16} color="#f59e0b" fill="#f59e0b" />}
            </View>
            <Text category="p1" style={[styles.messageContent, isRTL && styles.textRTL]}>
              {language === 'ar' ? message.content.ar : message.content.en}
            </Text>
            {message.author && (
              <Text category="c1" appearance="hint" style={styles.messageAuthor}>
                - {message.author}
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
    width: 24,
    height: 24,
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
