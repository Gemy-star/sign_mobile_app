// hooks/useAppStyles.ts
// Custom hook to easily access theme-aware styles throughout the app

import {
    BorderRadius,
    ColorPalette,
    createStyles,
    Shadows,
    Spacing,
    ThemeColors as ThemeColorsType,
    Typography
} from '@/constants/Styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

/**
 * Custom hook that provides theme-aware styles and utilities
 * @returns Object containing styles, colors, and style utilities
 */
export const useAppStyles = () => {
  const { colors, colorScheme } = useTheme();

  // Memoize styles to prevent unnecessary recalculations
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);

  // Get theme-specific colors
  const themeColors = ThemeColorsType[colorScheme];

  return {
    // Theme-aware styles
    styles,

    // Colors
    colors,
    themeColors,
    palette: ColorPalette,

    // Theme state
    colorScheme,
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',

    // Style constants
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    typography: Typography,

    // Utility functions
    getStatusColor: (status: 'success' | 'warning' | 'danger' | 'info') => {
      return ColorPalette[status];
    },

    getSpacing: (...values: (keyof typeof Spacing)[]) => {
      return values.map(key => Spacing[key]);
    },
  };
};

export default useAppStyles;
