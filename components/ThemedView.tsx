import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {
  backgroundColor?: string;
  surface?: boolean;
}

export function ThemedView({
  backgroundColor,
  surface,
  style,
  children,
  ...props
}: ThemedViewProps) {
  const { colors } = useTheme();

  const bgColor =
    backgroundColor || (surface ? colors.surface : colors.background);

  return (
    <View style={[{ backgroundColor: bgColor }, style]} {...props}>
      {children}
    </View>
  );
}
