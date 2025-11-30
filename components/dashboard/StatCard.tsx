// components/dashboard/StatCard.tsx
// Reusable stat card component for dashboard

import { FontFamily } from '@/constants/Typography';
import { Icon, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StatCardProps {
  value: number | string;
  label: string;
  icon?: string;
  colors: [string, string];
  emoji?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, icon, colors, emoji }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {icon && <Icon name={icon} style={styles.icon} fill="#ffffff" />}
        <Text style={styles.value}>{value}</Text>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 4,
    fontFamily: FontFamily.arabicBold,
  },
  emoji: {
    fontSize: 24,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    color: '#ffffff',
    opacity: 0.95,
    marginTop: 8,
    fontFamily: FontFamily.arabic,
    textAlign: 'center',
  },
});
