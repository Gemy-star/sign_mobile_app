import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { Icon, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ---------------------------------------------------------------------------
// MessageRow — extracted so it is not redefined on every parent render
// ---------------------------------------------------------------------------
type MessageItem = {
  id: number;
  message_type?: string;
  message_type_display?: string;
  scope_name?: string;
  content?: string;
  user_rating?: number;
  is_read?: boolean;
  is_favorited?: boolean;
};

type MessageRowProps = {
  item: MessageItem;
  isRTL: boolean;
  noContentLabel: string;
};

function MessageRow({ item, isRTL, noContentLabel }: MessageRowProps) {
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View style={styles.messageCard}>
        <View style={[styles.messageContainer, isRTL && styles.messageContainerRTL]}>
          <View style={styles.messageDetails}>
            <Text
              category="s1"
              style={[styles.messageType, isRTL && styles.textRTL]}
            >
              {item.message_type_display || item.message_type}
            </Text>
            {item.scope_name && (
              <Text
                category="c1"
                style={[styles.scopeName, isRTL && styles.textRTL]}
              >
                {item.scope_name}
              </Text>
            )}
            <Text
              category="p2"
              style={[styles.messageContent, isRTL && styles.textRTL]}
              numberOfLines={2}
            >
              {item.content || noContentLabel}
            </Text>
            {!!item.user_rating && (
              <View style={styles.ratingContainer}>
                <Icon name="star" fill="#FFD700" style={styles.starIcon} />
                <Text category="c1" style={styles.ratingText}>
                  {item.user_rating}/5
                </Text>
              </View>
            )}
          </View>

          <View style={styles.messageStatus}>
            {!item.is_read && <View style={styles.unreadDot} />}
            {item.is_favorited && (
              <Icon name="heart" fill="#FF6B6B" style={styles.favoriteIcon} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
const GRADIENT: [string, string, string] = [
  'rgba(49,30,19,0.85)',
  'rgba(83,50,29,0.90)',
  'rgba(49,30,19,0.85)',
];

export default function MessagesScreen() {
  useTheme();
  const { t, language } = useLanguage();

  const dispatch = useAppDispatch();
  const { messages, isLoading, error } = useAppSelector((state) => state.messages);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = language === 'ar';

  useEffect(() => {
    dispatch(fetchMessages({
      pagination: { page: 1, page_size: 50 },
      filters: { language },
    }));
  }, [dispatch, language]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMessages({
      pagination: { page: 1, page_size: 50 },
      filters: { language },
    }));
    setRefreshing(false);
  };

  const filteredMessages = messages.filter((msg) =>
    msg.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.scope_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const noContentLabel = t('messages.noContent');

  const renderItem = ({ item }: { item: MessageItem }) => (
    <MessageRow item={item} isRTL={isRTL} noContentLabel={noContentLabel} />
  );

  const keyExtractor = (item: MessageItem) => item.id.toString();

  const ListEmpty = (
    <View style={styles.emptyContainer}>
      <Icon
        name="message-square-outline"
        fill="rgba(250,248,245,0.3)"
        style={styles.emptyIcon}
      />
      <Text category="h6" style={styles.mutedText}>
        {t('messages.noMessages')}
      </Text>
    </View>
  );

  if (isLoading && !refreshing && messages.length === 0) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFillObject} />
        <AppHeader title={t('messages.title')} showUserInfo={false} />
        <View style={styles.centerContainer}>
          <Spinner size="giant" status="control" />
        </View>
      </View>
    );
  }

  if (error && messages.length === 0) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFillObject} />
        <AppHeader title={t('messages.title')} showUserInfo={false} />
        <View style={styles.centerContainer}>
          <Text category="h6" status="danger">{t('common.error')}</Text>
          <Text category="p2" style={styles.mutedText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFillObject} />

      <AppHeader title={t('messages.title')} showUserInfo={false} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search-outline" fill="#FAF8F5" style={styles.searchIcon} />
          <TextInput
            placeholder={t('messages.searchPlaceholder')}
            placeholderTextColor="rgba(250,248,245,0.45)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, isRTL && styles.textRTL]}
          />
        </View>
      </View>

      <FlatList
        data={filteredMessages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FAF8F5"
          />
        }
        ListEmptyComponent={ListEmpty}
      />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,248,245,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(232,206,128,0.3)',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    flex: 1,
    color: '#FAF8F5',
    fontSize: 15,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  messageCard: {
    backgroundColor: 'rgba(49,30,19,0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  messageContainerRTL: {
    flexDirection: 'row-reverse',
  },
  messageDetails: {
    flex: 1,
  },
  messageType: {
    color: '#FAF8F5',
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  scopeName: {
    color: '#E8CE80',
    marginBottom: 2,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  messageContent: {
    color: 'rgba(250,248,245,0.85)',
    marginTop: 4,
    fontFamily: 'IBMPlexSansArabic-Regular',
    lineHeight: 20,
  },
  messageStatus: {
    alignItems: 'center',
    marginLeft: 8,
    gap: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C96F4A',
    marginBottom: 4,
  },
  favoriteIcon: {
    width: 20,
    height: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  ratingText: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
  },
  mutedText: {
    color: 'rgba(250,248,245,0.55)',
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  textRTL: {
    textAlign: 'right',
  },
});
