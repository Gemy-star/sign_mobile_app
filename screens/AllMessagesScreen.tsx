// screens/AllMessagesScreen.tsx
// Screen to display all motivational messages

import { MessageCard } from '@/components/dashboard/MessageCard';
import { FontFamily } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { Button, Icon, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AllMessagesScreen() {
  const dispatch = useAppDispatch();
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  const { messages, isLoading, lastFetched } = useAppSelector((state) => state.messages);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const CACHE_TIME = 5 * 60 * 1000;
    const isStale = !lastFetched || Date.now() - lastFetched > CACHE_TIME;

    if (isStale) {
      dispatch(fetchMessages({ pagination: undefined, filters: { language } }));
    }
  }, [dispatch, lastFetched, language]);

  const handleRefresh = () => {
    dispatch(fetchMessages({ pagination: undefined, filters: { language } }));
  };

  const handleBack = () => {
    router.back();
  };

  // Filter messages
  const filteredMessages = messages.filter((msg: any) => {
    const matchesSearch = !searchQuery ||
      msg.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.scope_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !filterCategory ||
      msg.scope_name === filterCategory ||
      msg.message_type_display === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    'MENTAL HEALTH',
    'PHYSICAL HEALTH',
    'CAREER DEVELOPMENT',
    'FINANCIAL WELLNESS',
  ];

  const renderSearchIcon = (props: any) => (
    <Icon {...props} name="search-outline" />
  );

  if (isLoading && messages.length === 0) {
    return (
      <Layout style={styles.container} level="1">
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name={isRTL ? 'arrow-forward-outline' : 'arrow-back-outline'} style={styles.backIcon} fill="#fff" />
          </TouchableOpacity>
          <Text category="h6" style={styles.headerTitle}>
            {t('home.motivationalMessages')}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.center}>
          <Spinner size="giant" />
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="1">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name={isRTL ? 'arrow-forward-outline' : 'arrow-back-outline'} style={styles.backIcon} fill="#fff" />
        </TouchableOpacity>
        <Text category="h6" style={styles.headerTitle}>
          {t('home.motivationalMessages')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder={t('messages.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessoryLeft={renderSearchIcon}
          style={styles.searchInput}
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <Button
          size="small"
          appearance={filterCategory === null ? 'filled' : 'outline'}
          onPress={() => setFilterCategory(null)}
          style={styles.categoryButton}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            size="small"
            appearance={filterCategory === category ? 'filled' : 'outline'}
            onPress={() => setFilterCategory(category)}
            style={styles.categoryButton}
          >
            {category}
          </Button>
        ))}
      </ScrollView>

      {/* Messages List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {filteredMessages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('home.noRecentMessages')}</Text>
          </View>
        ) : (
          filteredMessages.map((message: any) => (
            <MessageCard
              key={message.id}
              content={message.content || ''}
              category={message.scope_name || message.message_type_display || 'General'}
              isFavorited={message.is_favorited}
              author={message.ai_model}
              isRTL={isRTL}
            />
          ))
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#8b5cf6',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    color: '#fff',
    fontFamily: FontFamily.arabicBold,
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    borderRadius: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  categoryButton: {
    marginRight: 8,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    fontFamily: FontFamily.arabic,
    fontSize: 14,
  },
});
