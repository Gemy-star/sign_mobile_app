// screens/MessageDetailScreen.tsx
// Message Detail Screen with full message content and actions

import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { dataSource } from '@/services/dataSource.service';
import { Message } from '@/types/api';
import { Icon, Layout, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';

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
          await dataSource.rateMessage(msg.id, msg.user_rating || 0);
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
      await dataSource.rateMessage(message.id, newRating);
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
        {/* Message Card with Background */}
        <View style={styles.messageCardContainer}>
          <ImageBackground
            source={require('@/assets/images/logo.png')}
            style={styles.imageBackground}
            imageStyle={styles.backgroundImage}
          >
            <LinearGradient
              colors={['rgba(49, 30, 19, 0.3)', 'rgba(83, 50, 29, 0.5)', 'rgba(147, 96, 54, 0.4)']}
              style={styles.gradientOverlay}
            >
              <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                {/* Category badge at top */}
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{message.scope_name}</Text>
                </View>

                {/* Message content - centered */}
                <View style={styles.contentContainer}>
                  <Text style={[styles.messageContent, isRTL && styles.textRTL]}>
                    {message.content}
                  </Text>
                  {message.ai_model && (
                    <View style={styles.aiModelContainer}>
                      <Icon name="sparkles-outline" style={styles.aiIcon} fill="#EBCE90" />
                      <Text style={styles.aiModel}>
                        {t('motivation.aiMessages')} • {message.ai_model}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Bottom action buttons */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleToggleFavorite}
                  >
                    <Icon
                      name={isFavorited ? "heart" : "heart-outline"}
                      style={styles.actionIcon}
                      fill={isFavorited ? "#C96F4A" : "#FAF8F5"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRate(rating === 5 ? 0 : 5)}
                  >
                    <Icon
                      name={rating ? "bookmark" : "bookmark-outline"}
                      style={styles.actionIcon}
                      fill={rating ? "#EBCE90" : "#FAF8F5"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                    <Icon name="share" style={styles.actionIcon} fill="#FAF8F5" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="more-horizontal" style={styles.actionIcon} fill="#FAF8F5" />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingSectionTitle}>{t('messages.rateMessage') || 'Rate this message'}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRate(star)}
                style={styles.starButton}
              >
                <Icon
                  name={rating && rating >= star ? 'star' : 'star-outline'}
                  style={styles.starIcon}
                  fill={rating && rating >= star ? '#C96F4A' : '#936036'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Related Goal */}
        {message.goal_title && (
          <View style={styles.relatedCard}>
            <View style={[styles.relatedHeader, isRTL && styles.relatedHeaderRTL]}>
              <Icon name="radio-button-on-outline" style={styles.relatedIcon} fill="#C96F4A" />
              <Text style={[styles.relatedTitle, isRTL && styles.textRTL]}>
                {t('messages.relatedGoal') || 'Related Goal'}
              </Text>
            </View>
            <Text style={[styles.relatedText, isRTL && styles.textRTL]}>
              {message.goal_title}
            </Text>
          </View>
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
  messageCardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 550,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    borderRadius: 24,
  },
  gradientOverlay: {
    flex: 1,
    borderRadius: 24,
  },
  blurContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(213, 204, 195, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(250, 248, 245, 0.2)',
  },
  categoryText: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FAF8F5',
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  messageContent: {
    fontSize: 22,
    lineHeight: 36,
    fontFamily: 'Inter',
    color: '#FAF8F5',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(49, 30, 19, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  aiModelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(213, 204, 195, 0.2)',
  },
  aiIcon: {
    width: 14,
    height: 14,
  },
  aiModel: {
    fontSize: 11,
    fontFamily: 'Inter',
    color: '#EBCE90',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(213, 204, 195, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(250, 248, 245, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  ratingSection: {
    padding: 20,
    backgroundColor: 'rgba(213, 204, 195, 0.1)',
    borderRadius: 16,
    marginBottom: 24,
  },
  ratingSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#311E13',
    textAlign: 'center',
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
  starIcon: {
    width: 28,
    height: 28,
  },
  relatedCard: {
    padding: 20,
    backgroundColor: 'rgba(235, 206, 144, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(201, 111, 74, 0.2)',
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
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#311E13',
  },
  relatedText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#53321D',
    lineHeight: 22,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  textRTL: {
    textAlign: 'center',
  },
});
