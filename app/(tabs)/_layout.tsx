import { useLanguage } from '@/contexts/LanguageContext';
import { Icon } from '@ui-kitten/components';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { t } = useLanguage();

  const tabBarBg = '#53321D';
  const tabBarBorder = 'rgba(232, 206, 128, 0.25)';
  const activeColor = '#E8CE80';
  const inactiveColor = 'rgba(250, 248, 245, 0.45)';

  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName: string;
        switch (route.name) {
          case 'index':
            iconName = 'home-outline';
            break;
          case 'news':
            iconName = 'trending-up-outline';
            break;
          case 'messages':
            iconName = 'message-square-outline';
            break;
          case 'motivation':
            iconName = 'heart-outline';
            break;
          case 'notification':
            iconName = 'activity-outline';
            break;
          case 'profile':
            iconName = 'person-outline';
            break;
          default:
            iconName = 'home-outline';
        }

        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopColor: tabBarBorder,
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 65,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
          },
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarLabel: t(`navigation.${route.name}`) || route.name,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            fontFamily: 'IBMPlexSansArabic-SemiBold',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={iconName}
              style={{ width: size || 24, height: size || 24 }}
              fill={color}
            />
          ),
        };
      }}
    />
  );
}
