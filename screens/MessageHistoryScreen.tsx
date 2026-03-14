// screens/MessageHistoryScreen.tsx
// Screen to view past motivational messages with search and filter

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFavoriteMessages, fetchMessages } from '@/store/slices/messagesSlice';
import { Icon } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MessageHistoryScreen() {
  const { styles, colors, palette, spacing } = useAppStyles();
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();

  const { messages, favoriteMessages, isLoading } = useAppSelector((state) => state.messages);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    if (filterMode === 'favorites') {
      dispatch(fetchFavoriteMessages());
    }
  }, [filterMode, dispatch]);

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getCategoryColor = (scopeName: string) => {
    const name = (scopeName || '').toLowerCase();
    if (name.includes('mental')) return palette.primary;
    if (name.includes('physical')) return palette.success;
    if (name.includes('career')) return palette.secondary;
    if (name.includes('financial')) return palette.warning;
    if (name.includes('relation')) return palette.danger;
    if (name.includes('spiritual')) return palette.info;
    return palette.primary;
  };

  const sourceMessages = filterMode === 'favorites' ? favoriteMessages : messages;

  const filteredMessages = sourceMessages.filter((msg) => {
    if (filterMode === 'favorites' && !msg.is_favorited) return false;
    if (searchQuery && !(msg.content || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const renderMessageList = () => {
    if (isLoading) {
      return (
        <View style={[styles.emptyState, { paddingTop: spacing.xxxl }]}>
          <ActivityIndicator color={palette.primary} />
        </View>
      );
    }
    if (filteredMessages.length === 0) {
      return (
        <View style={[styles.emptyState, { paddingTop: spacing.xxxl }]}>
          <Text style={styles.emptyStateTitle}>{t('motivation.noMessages')}</Text>
          <Text style={styles.emptyStateDescription}>{t('motivation.noMessagesDesc')}</Text>
        </View>
      );
    }
    return filteredMessages.map((message) => (
      <View
        key={message.id}
        style={[
          styles.card,
          styles.mb2,
          isRTL
            ? { borderRightWidth: 4, borderRightColor: getCategoryColor(message.scope_name || '') }
            : { borderLeftWidth: 4, borderLeftColor: getCategoryColor(message.scope_name || '') },
        ]}
      >
        {/* Message Header */}
        <View style={[styles.rowBetween, styles.mb2]}>
          <View style={[styles.badge, { backgroundColor: `${getCategoryColor(message.scope_name || '')}15` }]}>
            <Text style={[styles.badgeText, { color: getCategoryColor(message.scope_name || '') }]}>
              {message.scope_name || message.message_type_display || message.message_type}
            </Text>
          </View>
          <TouchableOpacity onPress={() => dispatch(toggleMessageFavorite(message.id))}>
            <Icon
              name={message.is_favorited ? 'star' : 'star-outline'}
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
            <Text style={[styles.caption, isRTL ? { marginRight: spacing.xs } : { marginLeft: spacing.xs }]}>
              {getTimeAgo(message.created_at)}
            </Text>
          </View>
          <View style={styles.rowCenter}>
            <TouchableOpacity style={styles.mr3}>
              <Icon name="share-outline" width={18} height={18} fill={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(deleteMessage(message.id))}>
              <Icon name="trash-2-outline" width={18} height={18} fill={palette.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

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
            <Icon name="search-outline" width={20} height={20} fill={colors.textSecondary} style={isRTL ? { marginLeft: spacing.sm } : { marginRight: spacing.sm }} />
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
          {renderMessageList()}
        </View>

        {/* Stats Footer */}
        {filteredMessages.length > 0 && (
          <View style={[styles.card, styles.mt3, { backgroundColor: `${palette.info}10` }]}>
            <View style={styles.rowCenter}>
              <Icon name="checkmark-circle-outline" width={20} height={20} fill={palette.info} style={isRTL ? { marginLeft: spacing.sm } : { marginRight: spacing.sm }} />
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
