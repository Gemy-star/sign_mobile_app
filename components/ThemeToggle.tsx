// components/ThemeToggle.tsx
// Reusable theme toggle button component

import { useTheme } from '@/contexts/ThemeContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { Icon } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  size = 'medium'
}) => {
  const { colorScheme, toggleColorScheme } = useTheme();
  const { styles, colors, palette } = useAppStyles();
  const isDark = colorScheme === 'dark';

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const buttonSizes = {
    small: 32,
    medium: 40,
    large: 48,
  };

  return (
    <TouchableOpacity
      style={[
        localStyles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          width: buttonSizes[size],
          height: buttonSizes[size],
        },
      ]}
      onPress={toggleColorScheme}
      activeOpacity={0.7}
    >
      <View style={localStyles.iconContainer}>
        {isDark ? (
          <Icon name="moon-outline" width={iconSizes[size]} height={iconSizes[size]} fill={palette.accent} />
        ) : (
          <Icon name="sun-outline" width={iconSizes[size]} height={iconSizes[size]} fill={palette.primary} />
        )}
      </View>
      {showLabel && (
        <Text style={[styles.caption, { color: colors.text, marginTop: 4 }]}>
          {isDark ? 'Dark' : 'Light'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeToggle;
