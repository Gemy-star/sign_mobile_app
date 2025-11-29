import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MOCK_CHAT_MESSAGES } from '@/services/message.mock';
import { Card, Icon, Input, Layout, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MessagesScreen() {
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const isRTL = language === 'ar';

  const filteredMessages = MOCK_CHAT_MESSAGES.filter(msg =>
    (language === 'ar' ? msg.sender.name.ar : msg.sender.name.en)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: typeof MOCK_CHAT_MESSAGES[0] }) => (
    <TouchableOpacity>
      <Card style={styles.chatCard}>
        <View style={[styles.chatItemContainer, isRTL && styles.chatItemContainerRTL]}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />

          <View style={styles.chatDetails}>
            <Text category="s1" style={[styles.senderName, isRTL && styles.textRTL]}>
              {language === 'ar' ? item.sender.name.ar : item.sender.name.en}
            </Text>
            <Text category="p2" appearance="hint" style={[styles.lastMessage, isRTL && styles.textRTL]}>
              {language === 'ar' ? item.lastMessage.ar : item.lastMessage.en}
            </Text>
          </View>

          <View style={styles.timeAndCount}>
            <Text category="c1" appearance="hint">{item.time}</Text>
            {item.unreadCount && item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

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
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  chatCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatItemContainerRTL: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatDetails: {
    flex: 1,
  },
  senderName: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginBottom: 4,
  },
  lastMessage: {
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  textRTL: {
    textAlign: 'right',
  },
  timeAndCount: {
    alignItems: 'flex-end',
  },
  unreadBadge: {
    backgroundColor: '#6366f1',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
