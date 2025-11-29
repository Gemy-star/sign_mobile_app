import { Typography } from '@/constants/Typography';
import { useTheme } from '@/contexts/ThemeContext';
import { useTypography } from '@/hooks/useTypography';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  variant?:
    | 'body'
    | 'caption'
    | 'heading'
    | 'title'
    | 'subtitle'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4';
  size?: keyof typeof Typography.fontSize;
  weight?: keyof typeof Typography.fontWeight;
  color?: string;
  center?: boolean;
}

export function ThemedText({
  variant = 'body',
  size,
  weight,
  color,
  center,
  style,
  children,
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();
  const { getTextStyle, getVariantStyle, isArabic } = useTypography();

  // Fallback colors in case theme context fails
  const safeColors = {
    text: colors?.text || '#000000',
  };

  const getComputedStyle = () => {
    try {
      // If size or weight is provided, use custom style
      if (size || weight) {
        return getTextStyle ? getTextStyle(size, weight) : styles.fallbackBody;
      }

      // Otherwise use variant style
      return getVariantStyle
        ? getVariantStyle(variant)
        : getFallbackVariantStyle(variant);
    } catch (error) {
      console.warn('Error getting text style:', error);
      return styles.fallbackBody;
    }
  };

  const getFallbackVariantStyle = (variant: string) => {
    switch (variant) {
      case 'title':
      case 'h1':
        return styles.fallbackTitle;
      case 'heading':
      case 'h2':
        return styles.fallbackHeading;
      case 'h3':
        return styles.fallbackSubtitle;
      case 'subtitle':
      case 'h4':
        return styles.fallbackSubtitle;
      case 'caption':
        return styles.fallbackCaption;
      default:
        return styles.fallbackBody;
    }
  };

  const computedStyle = getComputedStyle();

  return (
    <Text
      style={[
        styles.baseText,
        computedStyle,
        {
          color: color || safeColors.text,
          textAlign: center ? 'center' : computedStyle.textAlign || 'left',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontSize: 16,
    lineHeight: 24,
  },
  fallbackTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  fallbackHeading: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  fallbackSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  },
  fallbackCaption: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },
  fallbackBody: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
});
