import { Shadows, Spacing, Typography } from '@/constants/Styles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import { Heart, MessageSquare, Target, TrendingUp, User, Zap } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  const { colors, colorScheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={({ route }) => {
        let IconComponent;
        switch (route.name) {
          case 'index':
            IconComponent = Zap;
            break;
          case 'news':
            IconComponent = TrendingUp;
            break;
          case 'messages':
            IconComponent = MessageSquare;
            break;
          case 'motivation':
            IconComponent = Heart;
            break;
          case 'notification':
            IconComponent = Target;
            break;
          case 'profile':
            IconComponent = User;
            break;
          default:
            IconComponent = Zap;
        }

        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBarBackground,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 2,
            paddingTop: Spacing.sm,
            paddingBottom: Spacing.md,
            height: 65,
            ...Shadows.lg,
            shadowColor: colors.cardShadow,
          },
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarLabel: t(`navigation.${route.name}`) || route.name,
          tabBarLabelStyle: {
            fontSize: Typography.fontSize.xs,
            fontWeight: Typography.fontWeight.semibold,
            fontFamily: colors.fontFamilyArabic,
            marginTop: Spacing.xs,
          },
          tabBarIconStyle: {
            marginTop: Spacing.xs,
          },
          tabBarIcon: ({ color, size }) => (
            <IconComponent color={color} size={size || 24} />
          ),
        };
      }}
    />
  );
}
