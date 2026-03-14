import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Icon, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// ---------------------------------------------------------------------------
// Static data types
// ---------------------------------------------------------------------------
type Notification = {
  id: string;
  title: { en: string; ar: string };
  message: { en: string; ar: string };
};

type Section = {
  title: { en: string; ar: string };
  data: Notification[];
};

const sections: Section[] = [
  {
    title: { en: 'Today', ar: 'اليوم' },
    data: [
      {
        id: '1',
        title: { en: 'New Achievement!', ar: 'إنجاز جديد!' },
        message: {
          en: 'You completed your 7-day streak!',
          ar: 'لقد أكملت سلسلة 7 أيام!',
        },
      },
    ],
  },
  {
    title: { en: 'Yesterday', ar: 'أمس' },
    data: [
      {
        id: '2',
        title: { en: 'Daily Message', ar: 'رسالة يومية' },
        message: {
          en: 'Your personalized message is ready',
          ar: 'رسالتك الشخصية جاهزة',
        },
      },
      {
        id: '3',
        title: { en: 'Goal Reminder', ar: 'تذكير الأهداف' },
        message: {
          en: "Don't forget to set your goals for today",
          ar: 'لا تنسَ تحديد أهدافك لهذا اليوم',
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Gradient constant
// ---------------------------------------------------------------------------
const GRADIENT: [string, string, string] = [
  'rgba(49,30,19,0.85)',
  'rgba(83,50,29,0.90)',
  'rgba(49,30,19,0.85)',
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function NotificationsScreen() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const localizedSections = sections.map((section) => ({
    title: language === 'ar' ? section.title.ar : section.title.en,
    data: section.data.map((item) => ({
      id: item.id,
      title: language === 'ar' ? item.title.ar : item.title.en,
      message: language === 'ar' ? item.message.ar : item.message.en,
    })),
  }));

  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFillObject} />

      <AppHeader title={t('notifications.title')} showUserInfo={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {localizedSections.map((section, index) => (
          <View key={`${section.title}-${index}`} style={styles.section}>
            {/* Section title */}
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {section.title}
            </Text>

            {/* Notification rows */}
            {section.data.map((item) => (
              <View key={item.id} style={styles.notificationCard}>
                <View style={[styles.notificationHeader, isRTL && styles.notificationHeaderRTL]}>
                  <Icon
                    name="bell-outline"
                    style={styles.bellIcon}
                    fill="#E8CE80"
                  />
                  <Text style={[styles.notificationTitle, isRTL && styles.textRTL]}>
                    {item.title}
                  </Text>
                </View>
                <Text style={[styles.notificationMessage, isRTL && styles.textRTL]}>
                  {item.message}
                </Text>
              </View>
            ))}
          </View>
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
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  notificationCard: {
    backgroundColor: 'rgba(49,30,19,0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  notificationHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  notificationTitle: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  notificationMessage: {
    color: 'rgba(250,248,245,0.55)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  textRTL: {
    textAlign: 'right',
  },
});
