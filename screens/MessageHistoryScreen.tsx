// screens/MessageHistoryScreen.tsx
// Screen to view past motivational messages with search and filter

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { MotivationCategory } from '@/types/motivation';
import { Icon } from '@ui-kitten/components';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MessageHistoryScreen() {
  const { styles, colors, palette, spacing } = useAppStyles();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');
  const [selectedCategory, setSelectedCategory] = useState<MotivationCategory | 'all'>('all');

  const mockMessages = [
    {
      id: '1',
      category: 'mental' as MotivationCategory,
      content: 'Your thoughts shape your reality. Choose them wisely and watch your world transform.',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      isFavorite: true,
      isRead: true,
    },
    {
      id: '2',
      category: 'physical' as MotivationCategory,
      content: 'Progress is progress, no matter how small. Every step forward counts!',
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      isFavorite: false,
      isRead: true,
    },
    {
      id: '3',
      category: 'career' as MotivationCategory,
      content: 'Every expert was once a beginner. Your journey matters more than the destination.',
      timestamp: Date.now() - 8 * 60 * 60 * 1000,
      isFavorite: true,
      isRead: true,
    },
    {
      id: '4',
      category: 'financial' as MotivationCategory,
      content: 'Financial freedom starts with a single wise decision. Make that decision today.',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      isFavorite: false,
      isRead: true,
    },
    {
      id: '5',
      category: 'relationships' as MotivationCategory,
      content: 'Strong relationships are built one conversation at a time. Reach out today.',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      isFavorite: true,
      isRead: true,
    },
  ];

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getCategoryColor = (category: MotivationCategory) => {
    const colors: Record<MotivationCategory, string> = {
      mental: palette.primary,
      physical: palette.success,
      career: palette.secondary,
      financial: palette.warning,
      relationships: palette.danger,
      spiritual: palette.info,
      creativity: '#9a7cb6',
      lifestyle: '#38b2ac',
    };
    return colors[category] || palette.primary;
  };

  const filteredMessages = mockMessages.filter((msg) => {
    if (filterMode === 'favorites' && !msg.isFavorite) return false;
    if (selectedCategory !== 'all' && msg.category !== selectedCategory) return false;
    if (searchQuery && !msg.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Header - Sticky */}
        <View style={{ backgroundColor: colors.background, paddingBottom: spacing.md }}>
          <Text style={[styles.heading1, styles.mb2]}>{t('motivation.messageHistory')}</Text>

          {/* Search Bar */}
          <View style={[styles.input, styles.rowCenter, styles.mb2]}>
            <Icon name="search-outline" width={20} height={20} fill={colors.textSecondary} style={{ marginRight: spacing.sm }} />
            <TextInput
              style={[styles.bodyText, { flex: 1, padding: 0 }]}
              placeholder={t('motivation.searchMessages')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Buttons */}
          <View style={styles.rowCenter}>
            <TouchableOpacity
              style={[
                styles.badge,
                filterMode === 'all' ? styles.badgePrimary : { backgroundColor: colors.border },
                styles.mr2,
              ]}
              onPress={() => setFilterMode('all')}
            >
              <Text
                style={[
                  styles.badgeText,
                  filterMode === 'all' ? styles.badgeTextPrimary : { color: colors.textSecondary },
                ]}
              >
                {t('motivation.allMessages')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.badge,
                filterMode === 'favorites' ? styles.badgeWarning : { backgroundColor: colors.border },
              ]}
              onPress={() => setFilterMode('favorites')}
            >
              <Icon
                name={filterMode === 'favorites' ? 'star' : 'star-outline'}
                width={12}
                height={12}
                fill={filterMode === 'favorites' ? palette.warning : colors.textSecondary}
              />
              <Text
                style={[
                  styles.badgeText,
                  filterMode === 'favorites' ? styles.badgeTextWarning : { color: colors.textSecondary },
                ]}
              >
                {t('motivation.favoritesOnly')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages List */}
        <View style={styles.mt3}>
          {filteredMessages.length === 0 ? (
            <View style={[styles.emptyState, { paddingTop: spacing.xxxl }]}>
              <Text style={styles.emptyStateTitle}>{t('motivation.noMessages')}</Text>
              <Text style={styles.emptyStateDescription}>{t('motivation.noMessagesDesc')}</Text>
            </View>
          ) : (
            filteredMessages.map((message, index) => (
              <View
                key={message.id}
                style={[
                  styles.card,
                  styles.mb2,
                  {
                    borderLeftWidth: 4,
                    borderLeftColor: getCategoryColor(message.category),
                  },
                ]}
              >
                {/* Message Header */}
                <View style={[styles.rowBetween, styles.mb2]}>
                  <View style={[styles.badge, { backgroundColor: `${getCategoryColor(message.category)}15` }]}>
                    <Text style={[styles.badgeText, { color: getCategoryColor(message.category) }]}>
                      {message.category}
                    </Text>
                  </View>

                  <TouchableOpacity>
                    <Icon
                      name={message.isFavorite ? 'star' : 'star-outline'}
                      width={20}
                      height={20}
                      fill={palette.warning}
                    />
                  </TouchableOpacity>
                </View>

                {/* Message Content */}
                <Text style={[styles.bodyText, styles.mb2]}>{message.content}</Text>

                {/* Message Footer */}
                <View style={[styles.rowBetween, { alignItems: 'center' }]}>
                  <View style={styles.rowCenter}>
                    <Icon name="clock-outline" width={14} height={14} fill={colors.textSecondary} />
                    <Text style={[styles.caption, { marginLeft: spacing.xs }]}>
                      {getTimeAgo(message.timestamp)}
                    </Text>
                  </View>

                  <View style={styles.rowCenter}>
                    <TouchableOpacity style={styles.mr3}>
                      <Icon name="share-outline" width={18} height={18} fill={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Icon name="trash-2-outline" width={18} height={18} fill={palette.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Stats Footer */}
        {filteredMessages.length > 0 && (
          <View style={[styles.card, styles.mt3, { backgroundColor: `${palette.info}10` }]}>
            <View style={styles.rowCenter}>
              <Icon name="checkmark-circle-outline" width={20} height={20} fill={palette.info} style={{ marginRight: spacing.sm }} />
              <Text style={[styles.smallText, { color: palette.info }]}>
                {filteredMessages.length} messages found
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
