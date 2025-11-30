// constants/Colors.ts
export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#F8F8F8',
    surface: '#FFFFFF',
    text: '#0F0F0F',
    textSecondary: '#A48111',
    textMuted: '#6b6d7a',
    textInverse: '#FFFFFF',
    primary: '#A48111',
    secondary: '#0F0F0F',
    accent: '#A48111',
    accentDark: '#8A6909',
    border: '#e2e8f0',
    error: '#f56565',
    warning: '#A48111',
    success: '#A48111',
    info: '#A48111',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#e2e8f0',
    tabBarActive: '#A48111',
    tabBarInactive: '#6b6d7a',
    fontFamily: 'System',
    fontFamilyArabic: 'IBM Plex Sans Arabic',
    fontSecondary: '#A48111',
    cardShadow: 'rgba(164, 129, 17, 0.1)',
  },
  dark: {
    background: '#0F0F0F',
    surface: '#1a1a1a',
    text: '#F8F8F8',
    textSecondary: '#A48111',
    textMuted: '#6b6d7a',
    textInverse: '#0F0F0F',
    primary: '#A48111',
    secondary: '#F8F8F8',
    accent: '#A48111',
    accentDark: '#8A6909',
    border: '#2a2a2a',
    error: '#f56565',
    warning: '#A48111',
    success: '#A48111',
    info: '#A48111',
    tabBarBackground: '#0F0F0F',
    tabBarBorder: '#2a2a2a',
    tabBarActive: '#A48111',
    tabBarInactive: '#6b6d7a',
    fontFamily: 'System',
    fontFamilyArabic: 'IBM Plex Sans Arabic',
    fontSecondary: '#A48111',
    cardShadow: 'rgba(164, 129, 17, 0.2)',
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
