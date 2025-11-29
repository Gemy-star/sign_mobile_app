// constants/Colors.ts
export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#f8f9fa',
    surface: '#FFFFFF',
    text: '#2d3748',
    textSecondary: '#718096',
    textMuted: '#a0aec0',
    textInverse: '#FFFFFF',
    primary: '#eb672a',
    secondary: '#815ba4',
    accent: '#ef8859',
    accentDark: '#cf4f13',
    border: '#e2e8f0',
    error: '#f56565',
    warning: '#ed8936',
    success: '#48bb78',
    info: '#4299e1',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#e2e8f0',
    tabBarActive: '#eb672a',
    tabBarInactive: '#8E8E93',
    fontFamily: 'System',
    fontFamilyArabic: 'IBM Plex Sans Arabic',
    fontSecondary: '#718096',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    background: '#1a1a2e',
    surface: '#252538',
    text: '#FFFFFF',
    textSecondary: '#b8bac3',
    textMuted: '#6b6d7a',
    textInverse: '#000000',
    primary: '#eb672a',
    secondary: '#815ba4',
    accent: '#ef8859',
    accentDark: '#cf4f13',
    border: '#3a3a4e',
    error: '#f56565',
    warning: '#ed8936',
    success: '#48bb78',
    info: '#4299e1',
    tabBarBackground: '#1a1a2e',
    tabBarBorder: '#3a3a4e',
    tabBarActive: '#ef8859',
    tabBarInactive: '#8E8E93',
    fontFamily: 'System',
    fontFamilyArabic: 'IBM Plex Sans Arabic',
    fontSecondary: '#b8bac3',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
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
