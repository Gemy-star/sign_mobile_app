import { useLanguage } from '@/contexts/LanguageContext';
import { Icon } from '@ui-kitten/components';
import { Tabs } from 'expo-router';
import React from 'react';

const makeIcon = (name: string) =>
  ({ color, size }: { color: string; size: number }) => (
    <Icon name={name} style={{ width: size || 24, height: size || 24 }} fill={color} />
  );

export default function TabLayout() {
  const { t } = useLanguage();

  const tabBarBg = '#53321D';
  const tabBarBorder = 'rgba(232, 206, 128, 0.25)';
  const activeColor = '#E8CE80';
  const inactiveColor = 'rgba(250, 248, 245, 0.45)';

  const sharedScreenOptions = {
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
    tabBarLabelStyle: {
      fontSize: 11,
      fontFamily: 'IBMPlexSansArabic-SemiBold',
      marginTop: 4,
    },
    tabBarIconStyle: { marginTop: 4 },
  };

  return (
    <Tabs screenOptions={sharedScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t('navigation.index'),
          tabBarIcon: makeIcon('home-outline'),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: t('navigation.messages'),
          tabBarIcon: makeIcon('message-square-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: t('navigation.profile'),
          tabBarIcon: makeIcon('person-outline'),
        }}
      />

      {/* Moved into profile screen internal tabs */}
      <Tabs.Screen name="news"         options={{ href: null }} />
      <Tabs.Screen name="motivation"   options={{ href: null }} />
      <Tabs.Screen name="notification" options={{ href: null }} />
    </Tabs>
  );
}
