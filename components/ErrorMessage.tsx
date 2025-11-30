import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@ui-kitten/components';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemedText } from './ThemedText';
import { Spacing, BorderRadius } from '@/constants/Spacing';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ThemedText variant="subtitle" color={colors.error} center>
        {t('common.error')}
      </ThemedText>
      <ThemedText 
        size="sm" 
        color={colors.textSecondary} 
        center 
        style={styles.messageText}
      >
        {message}
      </ThemedText>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Icon name="refresh-outline" width={16} height={16} fill={colors.primary} />
          <ThemedText size="sm" weight="semibold" color={colors.primary}>
            {t('common.retry')}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  messageText: {
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
});