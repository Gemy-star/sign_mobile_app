// constants/Colors.ts
// Primary Colors from Pitch Deck
// --color-primary: #C96F4A (Coral/Orange)
// --color-secondary: #936036 (Sidebar Brown)
// --color-dashboard-bg: #53321D (Dashboard Main Background)
// --color-accent: #E8CE80 (Cream/Beige)
// --color-accent-dark: #311E13 (Very Dark Brown)
// --color-brown-medium: #936036 (Medium Brown)

export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#FAF8F5',      // Off-white
    surface: '#FFFFFF',
    text: '#53321D',            // Dark Brown (text-dark)
    textSecondary: '#936036',   // Medium Brown (text-light)
    textMuted: '#D5CCC3',       // Light Gray (text-muted)
    textInverse: '#FAF8F5',     // Off-white
    primary: '#C96F4A',         // Coral/Orange
    secondary: '#936036',       // Sidebar Brown
    accent: '#E8CE80',          // Cream/Beige
    accentDark: '#311E13',      // Very Dark Brown
    border: '#D5CCC3',          // Light Gray
    error: '#C96F4A',           // Coral/Orange (danger)
    warning: '#E8CE80',         // Cream/Beige
    success: '#48bb78',         // Green
    info: '#936036',            // Medium Brown
    tabBarBackground: '#FAF8F5',
    tabBarBorder: '#D5CCC3',
    tabBarActive: '#C96F4A',
    tabBarInactive: '#936036',
    fontFamily: 'Inter',
    fontFamilyArabic: 'IBM Plex Sans Arabic',
    fontSecondary: '#936036',
    cardShadow: 'rgba(49, 30, 19, 0.1)',  // shadow-sm
  },
  dark: {
    background: '#53321D',      // Dashboard Main Background
    surface: '#311E13',         // Very Dark Brown
    text: '#FAF8F5',            // Off-white
    textSecondary: '#E8CE80',   // Cream/Beige
    textMuted: '#D5CCC3',       // Light Gray
    textInverse: '#53321D',     // Dashboard Background
    primary: '#C96F4A',         // Coral/Orange
    secondary: '#936036',       // Sidebar Brown
    accent: '#E8CE80',          // Cream/Beige
    accentDark: '#311E13',      // Very Dark Brown
    border: '#936036',          // Medium Brown
    error: '#C96F4A',           // Coral/Orange (danger)
    warning: '#E8CE80',         // Cream/Beige
    success: '#48bb78',         // Green
    info: '#936036',            // Medium Brown
    tabBarBackground: '#311E13',
    tabBarBorder: '#53321D',
    tabBarActive: '#C96F4A',
    tabBarInactive: '#D5CCC3',
    fontFamily: 'Inter',
    fontFamilyArabic: 'IBM Plex Sans Arabic',
    fontSecondary: '#E8CE80',
    cardShadow: 'rgba(49, 30, 19, 0.2)',  // shadow-md
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
    main: '#C96F4A',      // Coral/Orange
    light: getColorWithOpacity('#C96F4A', 0.1),
    medium: getColorWithOpacity('#C96F4A', 0.5),
    dark: '#936036',      // Medium Brown
  },
  secondary: {
    main: '#936036',      // Sidebar Brown
    light: getColorWithOpacity('#936036', 0.1),
    medium: getColorWithOpacity('#936036', 0.5),
    dark: '#53321D',      // Dashboard Background
  },
  accent: {
    main: '#E8CE80',      // Cream/Beige
    light: getColorWithOpacity('#E8CE80', 0.1),
    medium: getColorWithOpacity('#E8CE80', 0.5),
    dark: '#D5CCC3',      // Light Gray
  },
  background: {
    light: '#FAF8F5',     // Off-white
    medium: '#D5CCC3',    // Light Gray
    dark: '#53321D',      // Dashboard Background
    darker: '#311E13',    // Very Dark Brown
  },
};
