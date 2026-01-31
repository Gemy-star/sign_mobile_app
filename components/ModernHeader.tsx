// components/ModernHeader.tsx
// Modern header component with gradient background

import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  onBack?: () => void;
}

export default function ModernHeader({
  title,
  subtitle,
  showBack = false,
  rightComponent,
  onBack,
}: ModernHeaderProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const getFontFamily = (weight: 'regular' | 'bold' | 'semibold' = 'regular') => {
    if (isRTL) {
      return weight === 'bold' ? 'Cairo-Bold' : weight === 'semibold' ? 'Cairo-SemiBold' : 'Cairo-Regular';
    } else {
      return weight === 'bold' ? 'Inter-Bold' : weight === 'semibold' ? 'Inter-SemiBold' : 'Inter-Regular';
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={['#FAF8F5', '#F5F1ED']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>{isRTL ? '←' : '→'}</Text>
            </TouchableOpacity>
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { fontFamily: getFontFamily('bold') }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular') }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightComponent && (
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(201, 111, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 20,
    color: '#C96F4A',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    color: '#311E13',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#936036',
    lineHeight: 20,
  },
  rightSection: {
    marginLeft: 16,
  },
});
