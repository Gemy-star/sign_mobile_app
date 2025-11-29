import AppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, Icon, Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Notification = {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  message: {
    en: string;
    ar: string;
  };
};

type Section = {
  title: {
    en: string;
    ar: string;
  };
  data: Notification[];
};

const sections: Section[] = [
  {
    title: { en: 'Today', ar: 'اليوم' },
    data: [
      {
        id: '1',
        title: { en: 'New Achievement!', ar: 'إنجاز جديد!' },
        message: { en: 'You completed your 7-day streak!', ar: 'لقد أكملت سلسلة 7 أيام!' }
      }
    ],
  },
  {
    title: { en: 'Yesterday', ar: 'أمس' },
    data: [
      {
        id: '2',
        title: { en: 'Daily Message', ar: 'رسالة يومية' },
        message: { en: 'Your personalized message is ready', ar: 'رسالتك الشخصية جاهزة' }
      },
      {
        id: '3',
        title: { en: 'Goal Reminder', ar: 'تذكير الأهداف' },
        message: { en: 'Don\'t forget to set your goals for today', ar: 'لا تنسَ تحديد أهدافك لهذا اليوم' }
      },
    ],
  },
];

export default function NotificationsScreen() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const localizedSections = sections.map(section => ({
    title: language === 'ar' ? section.title.ar : section.title.en,
    data: section.data.map(item => ({
      id: item.id,
      title: language === 'ar' ? item.title.ar : item.title.en,
      message: language === 'ar' ? item.message.ar : item.message.en,
    }))
  }));

  return (
    <Layout style={styles.container} level="1">
      <AppHeader title={t('notifications.title')} showUserInfo={false} />
      <ScrollView contentContainerStyle={styles.content}>
        {localizedSections.map((section, index) => (
          <View key={`${section.title}-${index}`} style={styles.section}>
            <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {section.title}
            </Text>
            {section.data.map((item) => (
              <Card key={item.id} style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                  <Icon name="bell-outline" style={styles.iconStyle} fill="#6366f1" />
                  <Text category="s1" style={[styles.notificationTitle, isRTL && styles.textRTL]}>
                    {item.title}
                  </Text>
                </View>
                <Text category="p2" appearance="hint" style={[isRTL && styles.textRTL]}>
                  {item.message}
                </Text>
              </Card>
            ))}
          </View>
        ))}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'IBMPlexSansArabic-Bold', marginBottom: 12 },
  notificationCard: { marginBottom: 12, borderRadius: 12 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  notificationTitle: { fontFamily: 'IBMPlexSansArabic-Bold', flex: 1 },
  iconStyle: { width: 20, height: 20 },
  textRTL: { textAlign: 'right' },
});
