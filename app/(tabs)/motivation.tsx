// app/(tabs)/motivation.tsx

import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { Icon, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const GRADIENT: [string, string, string] = [
  'rgba(49,30,19,0.85)',
  'rgba(83,50,29,0.90)',
  'rgba(49,30,19,0.85)',
];

const categories = [
  { id: 'mental',        iconName: 'bulb-outline',          color: '#6366f1' },
  { id: 'physical',      iconName: 'activity-outline',       color: '#10b981' },
  { id: 'career',        iconName: 'briefcase-outline',      color: '#8b5cf6' },
  { id: 'financial',     iconName: 'credit-card-outline',    color: '#f59e0b' },
  { id: 'relationships', iconName: 'heart-outline',          color: '#ef4444' },
  { id: 'spiritual',     iconName: 'star-outline',           color: '#3b82f6' },
  { id: 'creativity',    iconName: 'color-palette-outline',  color: '#9a7cb6' },
  { id: 'lifestyle',     iconName: 'sun-outline',            color: '#38b2ac' },
] as const;

// ---------------------------------------------------------------------------
// CategoryCard — extracted to avoid inline component definition
// ---------------------------------------------------------------------------
type CategoryCardProps = Readonly<{
  category: typeof categories[number];
  label: string;
  onPress: () => void;
}>;

function CategoryCard({ category, label, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.categoryCard}>
        <LinearGradient
          colors={[category.color, `${category.color}dd`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <Icon name={category.iconName} style={styles.categoryIcon} fill="#ffffff" />
        </LinearGradient>
        <Text category="c1" style={styles.categoryName}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// MessageCard — extracted to avoid inline component definition
// ---------------------------------------------------------------------------
type MotivationMessage = {
  id: number;
  scope_name?: string;
  message_type_display?: string;
  is_favorited?: boolean;
  content?: string;
  ai_model?: string;
};

type MessageCardProps = Readonly<{
  message: MotivationMessage;
  isRTL: boolean;
  onPress: () => void;
}>;

function MessageCard({ message, isRTL, onPress }: MessageCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <View style={styles.messageCard}>
        <View style={[styles.messageHeader, isRTL && styles.messageHeaderRTL]}>
          <Text category="c1" style={styles.categoryBadge}>
            {message.scope_name || message.message_type_display}
          </Text>
          {message.is_favorited && (
            <Icon name="star" style={styles.starIcon} fill="#f59e0b" />
          )}
        </View>
        <Text category="p1" style={[styles.messageContent, isRTL && styles.textRTL]}>
          {message.content || ''}
        </Text>
        {message.ai_model && (
          <Text category="c1" style={styles.messageAuthor}>
            - {message.ai_model}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function MotivationScreen() {
  useTheme();
  const { t, language } = useLanguage();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector((state) => state.messages);

  const isRTL = language === 'ar';

  useEffect(() => {
    if (messages.length === 0) {
      dispatch(fetchMessages({
        pagination: { page: 1, page_size: 5 },
        filters: { language },
      }));
    }
  }, [dispatch, messages.length, language]);

  const motivationalMessages = messages.slice(0, 5) as MotivationMessage[];

  if (isLoading && messages.length === 0) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFillObject} />
        <AppHeader title={t('motivation.appName')} showUserInfo={false} />
        <View style={styles.center}>
          <Spinner size="giant" status="control" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFillObject} />

      <AppHeader title={t('motivation.appName')} showUserInfo={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Section: Life Areas */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('motivation.lifeAreas')}
        </Text>
        <Text category="p2" style={[styles.sectionSubtitle, isRTL && styles.textRTL]}>
          {t('motivation.lifeAreasDesc')}
        </Text>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              label={t(`categories.${category.id}.name`) || category.id}
              onPress={() => router.push(`/category-detail?categoryId=${category.id}`)}
            />
          ))}
        </View>

        {/* Section: AI Messages */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('motivation.aiMessages')}
        </Text>
        <Text category="p2" style={[styles.sectionSubtitle, isRTL && styles.textRTL]}>
          {t('motivation.aiMessagesDesc')}
        </Text>

        {motivationalMessages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            isRTL={isRTL}
            onPress={() => router.push(`/message-detail?messageId=${message.id}`)}
          />
        ))}

      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginTop: 16,
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: 'rgba(250,248,245,0.55)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    marginBottom: 16,
  },
  textRTL: {
    textAlign: 'right',
  },
  // Category grid
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
    backgroundColor: 'rgba(49,30,19,0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    padding: 8,
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
  categoryIcon: {
    width: 28,
    height: 28,
  },
  categoryName: {
    color: '#FAF8F5',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  // Message cards
  messageCard: {
    backgroundColor: 'rgba(49,30,19,0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  categoryBadge: {
    color: '#E8CE80',
    textTransform: 'uppercase',
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  messageContent: {
    color: '#FAF8F5',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'IBMPlexSansArabic-Regular',
    marginBottom: 8,
  },
  messageAuthor: {
    color: 'rgba(250,248,245,0.55)',
    fontStyle: 'italic',
    fontFamily: 'IBMPlexSansArabic-Light',
  },
});
