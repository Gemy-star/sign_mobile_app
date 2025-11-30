// screens/MessageDetailScreen.tsx
// Message Detail Screen with full message content and actions

import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { dataSource } from '@/services/data-source.service';
import { Message } from '@/types/api';
import { Button, Card, Icon, Layout, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MessageDetailScreen() {
  const { messageId } = useLocalSearchParams<{ messageId: string }>();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';

  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    loadMessage();
  }, [messageId]);

  const loadMessage = async () => {
    if (!messageId) return;

    setLoading(true);
    try {
      // For now, get all messages and filter
      const response = await dataSource.getMessages();
      if (response.success && response.data) {
        const msg = response.data.results.find(m => m.id === parseInt(messageId));
        if (msg) {
          setMessage(msg);
          setIsFavorited(msg.is_favorited || false);
          setRating(msg.user_rating || null);
          // Mark as read
          await dataSource.rateMessage(msg.id, { rating: msg.user_rating || 0 });
        }
      }
    } catch (error) {
      console.error('Failed to load message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!message) return;

    try {
      // Toggle favorite
      setIsFavorited(!isFavorited);
      // In a real app, this would call the API
      // await dataSource.toggleMessageFavorite(message.id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setIsFavorited(!isFavorited); // Revert on error
    }
  };

  const handleRate = async (newRating: number) => {
    if (!message) return;

    try {
      setRating(newRating);
      await dataSource.rateMessage(message.id, { rating: newRating });
    } catch (error) {
      console.error('Failed to rate message:', error);
    }
  };

  const handleShare = async () => {
    if (!message) return;

    try {
      await Share.share({
        message: message.content,
        title: t('messages.title'),
      });
    } catch (error) {
      console.error('Failed to share message:', error);
    }
  };

  if (loading) {
    return (
      <Layout style={styles.container} level="1">
        <AppHeader title={t('messages.title')} showUserInfo={false} />
        <View style={styles.center}>
          <Spinner size="giant" />
        </View>
      </Layout>
    );
  }

  if (!message) {
    return (
      <Layout style={styles.container} level="1">
        <AppHeader title={t('messages.title')} showUserInfo={false} />
        <View style={styles.center}>
          <Icon name="inbox-outline" style={styles.emptyIcon} fill="#A0AEC0" />
          <Text category="h6" appearance="hint">{t('messages.noContent')}</Text>
        </View>
      </Layout>
    );
  }

  const categoryColor = getCategoryColor(message.scope_name || '');

  return (
    <Layout style={styles.container} level="1">
      <AppHeader title={t('messages.title')} showUserInfo={false} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Category Badge */}
        <View style={styles.categoryContainer}>
          <LinearGradient
            colors={[categoryColor, `${categoryColor}dd`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryBadge}
          >
            <Text style={styles.categoryText}>{message.scope_name}</Text>
          </LinearGradient>
          <Text category="c1" appearance="hint" style={styles.messageType}>
            {message.message_type_display}
          </Text>
        </View>

        {/* Message Content */}
        <Card style={styles.messageCard}>
          <Text category="h5" style={[styles.messageContent, isRTL && styles.textRTL]}>
            {message.content}
          </Text>

          {message.ai_model && (
            <View style={styles.aiModelContainer}>
              <Icon name="sparkles-outline" style={styles.aiIcon} fill="#6366f1" />
              <Text category="c1" appearance="hint" style={styles.aiModel}>
                {t('motivation.aiMessages')} • {message.ai_model}
              </Text>
            </View>
          )}

          {/* Date */}
          <View style={[styles.dateContainer, isRTL && styles.dateContainerRTL]}>
            <Icon name="clock-outline" style={styles.dateIcon} fill="#A0AEC0" />
            <Text category="c1" appearance="hint">
              {new Date(message.created_at).toLocaleString()}
            </Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, isFavorited && styles.actionButtonActive]}
            onPress={handleToggleFavorite}
          >
            <Icon
              name={isFavorited ? 'star' : 'star-outline'}
              style={styles.actionIcon}
              fill={isFavorited ? '#f59e0b' : '#A0AEC0'}
            />
            <Text category="c1" style={styles.actionText}>
              {isFavorited ? t('messages.noMessages') : t('common.like')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share-outline" style={styles.actionIcon} fill="#A0AEC0" />
            <Text category="c1" style={styles.actionText}>
              {t('common.share')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rating */}
        <Card style={styles.ratingCard}>
          <Text category="h6" style={[styles.ratingTitle, isRTL && styles.textRTL]}>
            Rate this message
          </Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRate(star)}
                style={styles.starButton}
              >
                <Icon
                  name={rating && rating >= star ? 'star' : 'star-outline'}
                  style={styles.starIconLarge}
                  fill={rating && rating >= star ? '#f59e0b' : '#A0AEC0'}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating && (
            <Text category="c1" appearance="hint" style={styles.ratingText}>
              You rated this {rating} out of 5
            </Text>
          )}
        </Card>

        {/* Related Goal */}
        {message.goal_title && (
          <Card style={styles.relatedCard}>
            <View style={[styles.relatedHeader, isRTL && styles.relatedHeaderRTL]}>
              <Icon name="radio-button-on-outline" style={styles.relatedIcon} fill={categoryColor} />
              <Text category="h6" style={[styles.relatedTitle, isRTL && styles.textRTL]}>
                Related Goal
              </Text>
            </View>
            <Text category="p1" style={[styles.relatedText, isRTL && styles.textRTL]}>
              {message.goal_title}
            </Text>
          </Card>
        )}
      </ScrollView>
    </Layout>
  );
}

function getCategoryColor(scopeName: string): string {
  const name = scopeName.toLowerCase();
  if (name.includes('mental')) return '#6366f1';
  if (name.includes('physical')) return '#10b981';
  if (name.includes('career')) return '#8b5cf6';
  if (name.includes('financial')) return '#f59e0b';
  if (name.includes('relationship')) return '#ef4444';
  if (name.includes('spiritual')) return '#3b82f6';
  if (name.includes('creativity')) return '#9a7cb6';
  if (name.includes('lifestyle')) return '#38b2ac';
  return '#6366f1';
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  messageType: {
    fontFamily: 'IBMPlexSansArabic-Medium',
    textTransform: 'uppercase',
  },
  messageCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
  },
  messageContent: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    lineHeight: 28,
    marginBottom: 16,
  },
  aiModelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160, 174, 192, 0.2)',
    marginBottom: 12,
  },
  aiIcon: {
    width: 16,
    height: 16,
  },
  aiModel: {
    fontFamily: 'IBMPlexSansArabic-Light',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateContainerRTL: {
    flexDirection: 'row-reverse',
  },
  dateIcon: {
    width: 14,
    height: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(160, 174, 192, 0.1)',
  },
  actionButtonActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  actionText: {
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  ratingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  ratingTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  starButton: {
    padding: 4,
  },
  starIconLarge: {
    width: 32,
    height: 32,
  },
  ratingText: {
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  relatedCard: {
    borderRadius: 16,
    padding: 20,
  },
  relatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  relatedHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  relatedIcon: {
    width: 20,
    height: 20,
  },
  relatedTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  relatedText: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    lineHeight: 22,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  textRTL: {
    textAlign: 'right',
  },
});
