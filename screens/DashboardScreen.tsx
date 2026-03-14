// screens/DashboardScreen.tsx
// Home Screen - Today's Messages with Scope Tabs

import AppHeader from '@/components/AppHeader';
import { MessageCard } from '@/components/dashboard/MessageCard';
import { FontFamily } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessages } from '@/store/slices/messagesSlice';
import { fetchScopes } from '@/store/slices/scopesSlice';
import { Scope } from '@/types/api';
import { Icon, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  const { messages, isLoading: messagesLoading } = useAppSelector((state) => state.messages);
  const { scopes, selectedScopes, isLoading: scopesLoading } = useAppSelector((state) => state.scopes);
  const [activeScope, setActiveScope] = useState<number | null>(null); // null = All

  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';

  const bgColor = '#53321D';
  const cardBg = 'rgba(49, 30, 19, 0.60)';
  const textColor = '#FAF8F5';
  const subTextColor = 'rgba(250, 248, 245, 0.6)';
  const tabActiveBg = '#A48111';
  const tabInactiveBg = 'rgba(250, 248, 245, 0.10)';
  const dividerColor = 'rgba(250, 248, 245, 0.10)';

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const dateStr = today.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    dispatch(fetchMessages({ filters: { date_from: todayISO, date_to: todayISO } }));
    if (scopes.length === 0) {
      dispatch(fetchScopes());
    }
  }, [dispatch, todayISO]);

  // Scope tabs: use selectedScopes IDs if set, otherwise show all active scopes
  const userScopes: Scope[] = useMemo(() => {
    const active = scopes.filter((s) => s.is_active);
    if (selectedScopes.length > 0) {
      return active.filter((s) => selectedScopes.includes(s.id));
    }
    return active;
  }, [scopes, selectedScopes]);

  // Messages filtered by active scope tab
  const filteredMessages = useMemo(() => {
    if (activeScope === null) return messages;
    return messages.filter((m) => m.scope === activeScope);
  }, [messages, activeScope]);

  const isLoading = messagesLoading || scopesLoading;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <LinearGradient
        colors={['rgba(49,30,19,0.85)', 'rgba(83,50,29,0.90)', 'rgba(49,30,19,0.85)']}
        style={StyleSheet.absoluteFillObject}
      />
      <AppHeader />

      {/* Date + Title Banner */}
      <View style={[styles.dateBanner, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
        <View style={[styles.dateRow, isRTL && styles.rowRTL]}>
          <Icon name="calendar-outline" style={styles.calendarIcon} fill={tabActiveBg} />
          <Text style={[styles.dateText, { color: subTextColor }, isRTL && styles.textRTL]}>
            {dateStr}
          </Text>
        </View>
        <Text style={[styles.todayTitle, { color: textColor }, isRTL && styles.textRTL]}>
          {t('home.messagesTitle')}
        </Text>
      </View>

      {/* Scope Tabs */}
      <View style={[styles.tabsWrapper, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsContent, isRTL && styles.tabsContentRTL]}
        >
          <TouchableOpacity
            style={[styles.tab, { backgroundColor: activeScope === null ? tabActiveBg : tabInactiveBg }]}
            onPress={() => setActiveScope(null)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, { color: activeScope === null ? '#FFFFFF' : subTextColor }]}>
              {t('home.allScopes')}
            </Text>
          </TouchableOpacity>

          {userScopes.map((scope) => (
            <TouchableOpacity
              key={scope.id}
              style={[styles.tab, { backgroundColor: activeScope === scope.id ? tabActiveBg : tabInactiveBg }]}
              onPress={() => setActiveScope(scope.id)}
              activeOpacity={0.8}
            >
              {scope.icon ? (
                <Text style={styles.scopeEmoji}>{scope.icon}</Text>
              ) : null}
              <Text
                style={[styles.tabText, { color: activeScope === scope.id ? '#FFFFFF' : subTextColor }]}
                numberOfLines={1}
              >
                {scope.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Count badge */}
      <View style={[styles.countRow, isRTL && styles.rowRTL]}>
        <Text style={[styles.countText, { color: subTextColor }]}>
          {filteredMessages.length} {t('messages.messagesCount')}
        </Text>
      </View>

      {/* Messages List */}
      {isLoading && messages.length === 0 ? (
        <View style={styles.center}>
          <Spinner size="giant" status="primary" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadData}
              tintColor={tabActiveBg}
              colors={[tabActiveBg]}
            />
          }
        >
          {filteredMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="inbox-outline" style={styles.emptyIcon} fill={subTextColor} />
              <Text style={[styles.emptyTitle, { color: textColor }, isRTL && styles.textRTL]}>
                {t('home.noTodayMessages')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: subTextColor }, isRTL && styles.textRTL]}>
                {t('home.noTodayMessagesDesc')}
              </Text>
            </View>
          ) : (
            filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                content={message.content || ''}
                category={message.scope_name || message.message_type_display || t('home.general')}
                isFavorited={message.is_favorited}
                author={message.ai_model}
                isRTL={isRTL}
                onPress={() => router.push('/messages')}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
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
  dateBanner: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  calendarIcon: {
    width: 15,
    height: 15,
  },
  dateText: {
    fontSize: 12,
    fontFamily: FontFamily.arabic,
  },
  todayTitle: {
    fontSize: 22,
    fontFamily: FontFamily.arabicBold,
    marginTop: 2,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  tabsWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabsContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabsContentRTL: {
    flexDirection: 'row-reverse',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 13,
    fontFamily: FontFamily.arabicMedium,
  },
  scopeEmoji: {
    fontSize: 14,
  },
  countRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 2,
  },
  countText: {
    fontSize: 12,
    fontFamily: FontFamily.arabic,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FontFamily.arabicBold,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.arabic,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
});
