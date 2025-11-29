import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles } from '@/constants/Styles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { ScrollView } from 'react-native';

export default function NewsScreen() {
  const { colors, colorScheme } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colorScheme);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemedText style={styles.heading1}>
          {t('news.title')}
        </ThemedText>
        <ThemedText style={styles.bodyTextSecondary}>
          {t('news.subtitle') || 'Latest news and updates'}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
