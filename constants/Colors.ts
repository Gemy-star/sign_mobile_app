// constants/Colors.ts
export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#FAF8F5',
    surface: '#FFFFFF',
    text: '#311E13',
    textSecondary: '#53321D',
    textMuted: '#936036',
    textInverse: '#FAF8F5',
    primary: '#C96F4A',
    secondary: '#53321D',
    accent: '#EBCE90',
    accentDark: '#936036',
    border: '#D5CCC3',
    error: '#f56565',
    warning: '#EBCE90',
    success: '#C96F4A',
    info: '#53321D',
    tabBarBackground: '#FAF8F5',
    tabBarBorder: '#D5CCC3',
    tabBarActive: '#C96F4A',
    tabBarInactive: '#936036',
    fontFamily: 'Inter',
    fontFamilyArabic: 'IBM Plex Sans Arabic',
    fontSecondary: '#53321D',
    cardShadow: 'rgba(201, 111, 74, 0.1)',
  },
  dark: {
    background: '#311E13',
    surface: '#53321D',
    text: '#FAF8F5',
    textSecondary: '#EBCE90',
    textMuted: '#D5CCC3',
    textInverse: '#311E13',
    primary: '#C96F4A',
    secondary: '#FAF8F5',
    accent: '#EBCE90',
    accentDark: '#936036',
    border: '#53321D',
    error: '#f56565',
    warning: '#EBCE90',
    success: '#C96F4A',
    info: '#EBCE90',
    tabBarBackground: '#311E13',
    tabBarBorder: '#53321D',
    tabBarActive: '#C96F4A',
    tabBarInactive: '#936036',
    fontFamily: 'Inter',
    fontFamilyArabic: 'IBM Plex Sans Arabic',
    fontSecondary: '#EBCE90',
    cardShadow: 'rgba(201, 111, 74, 0.2)',
  },
};

export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  secondary: string;
  accent: string;
  accentDark: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  tabBarBackground: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  fontFamily: string;
  fontFamilyArabic: string;
  fontSecondary: string;
  cardShadow: string;
};

export type ColorScheme = 'light' | 'dark';

// Color utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Remove # if present
  const hex = color.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Predefined color variations for common use cases
export const ColorVariations = {
  primary: {
    main: '#002524',
    light: getColorWithOpacity('#002524', 0.1),
    medium: getColorWithOpacity('#002524', 0.5),
    dark: '#001a19',
  },
  secondary: {
    main: '#0a3a34',
    light: getColorWithOpacity('#0a3a34', 0.1),
    medium: getColorWithOpacity('#0a3a34', 0.5),
    dark: '#072d28',
  },
};
