import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles, Spacing } from '@/constants/Styles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { SectionList, View } from 'react-native';
import { NotificationCard } from '../../components/NotificationCard';

type Notification = {
  id: string;
  title: string;
  message: string;
};

type Section = {
  title: string;
  data: Notification[];
};

const sections: Section[] = [
  {
    title: 'اليوم',
    data: [{ id: '1', title: 'عنوان الاشعار', message: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.' }],
  },
  {
    title: 'أمس',
    data: [
      { id: '2', title: 'عنوان الاشعار', message: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.' },
      { id: '3', title: 'عنوان الاشعار', message: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.' },
    ],
  },
  {
    title: 'السبت 11/1/2024',
    data: [
      { id: '4', title: 'عنوان الاشعار', message: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.' },
      { id: '5', title: 'عنوان الاشعار', message: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.' },
      { id: '6', title: 'عنوان الاشعار', message: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة.' },
    ],
  },
];

export default function NotificationsScreen() {
  const { colors, colorScheme } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colorScheme);

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationCard
      title={item.title}
      message={item.message}
    />
  );

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <ThemedText style={[styles.heading3, { marginVertical: Spacing.md }]}>
      {section.title}
    </ThemedText>
  );

  return (
    <ThemedView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        SectionSeparatorComponent={() => <View style={{ height: Spacing.xl }} />}
      />
    </ThemedView>
  );
}
