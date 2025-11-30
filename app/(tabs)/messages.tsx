import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { Card, Icon, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

export default function MessagesScreen() {
  // Context for UI preferences (theme, language)
  const { colors, colorScheme } = useTheme();
  const { t, language } = useLanguage();

  // Redux state for global/API data
  const dispatch = useAppDispatch();
  const { messages, isLoading, error } = useAppSelector((state) => state.messages);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = language === 'ar';

  useEffect(() => {
    dispatch(fetchMessages({ pagination: { page: 1, page_size: 50 } }));
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMessages({ pagination: { page: 1, page_size: 50 } }));
    setRefreshing(false);
  };

  const filteredMessages = messages.filter((msg) =>
    msg.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.scope_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessageItem = ({ item }: { item: typeof messages[0] }) => (
    <Card style={styles.messageCard}>
      <View style={[styles.messageContainer, isRTL && styles.messageContainerRTL]}>
        <View style={styles.messageDetails}>
          <Text category="s1" style={[styles.messageType, isRTL && styles.textRTL]}>
            {item.message_type_display || item.message_type}
          </Text>
          {item.scope_name && (
            <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
              {item.scope_name}
            </Text>
          )}
          <Text category="p2" style={[styles.messageContent, isRTL && styles.textRTL]} numberOfLines={2}>
            {item.content || t('messages.noContent')}
          </Text>
          {item.user_rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" fill="#FFD700" style={styles.starIcon} />
              <Text category="c1">{item.user_rating}/5</Text>
            </View>
          )}
        </View>

        <View style={styles.messageStatus}>
          {!item.is_read && (
            <View style={styles.unreadDot} />
          )}
          {item.is_favorited && (
            <Icon name="heart" fill="#FF6B6B" style={styles.favoriteIcon} />
          )}
        </View>
      </View>
    </Card>
  );

  if (isLoading && !refreshing && messages.length === 0) {
    return (
      <Layout style={styles.container} level="1">
        <AppHeader title={t('messages.title')} showUserInfo={false} />
        <View style={styles.centerContainer}>
          <Spinner size="giant" />
        </View>
      </Layout>
    );
  }

  if (error && messages.length === 0) {
    return (
      <Layout style={styles.container} level="1">
        <AppHeader title={t('messages.title')} showUserInfo={false} />
        <View style={styles.centerContainer}>
          <Text category="h6" status="danger">{t('common.error')}</Text>
          <Text category="p2" appearance="hint">{error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="1">
      <AppHeader title={t('messages.title')} showUserInfo={false} />

      <View style={styles.searchContainer}>
        <Input
          placeholder={t('messages.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessoryLeft={(props) => <Icon {...props} name="search-outline" />}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text category="h6" appearance="hint">{t('messages.noMessages')}</Text>
          </View>
        }
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    borderRadius: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageCard: {
    marginBottom: 12,
    borderRadius: 12,
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
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageContent: {
    marginTop: 4,
  },
  messageStatus: {
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3366FF',
    marginBottom: 4,
  },
  favoriteIcon: {
    width: 20,
    height: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  textRTL: {
    textAlign: 'right',
  },
});
