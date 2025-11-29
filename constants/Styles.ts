// constants/Styles.ts
// Comprehensive styling system for dark and light themes
// Based on motivational messages dashboard styles

import { StyleSheet } from 'react-native';
import { FontFamily } from './Typography';

// ============================================================================
// COLOR PALETTE - SHARED ACROSS THEMES
// ============================================================================
export const ColorPalette = {
  // Primary Colors
  primary: '#eb672a',          // Orange
  secondary: '#815ba4',        // Purple
  accent: '#ef8859',           // Light Orange
  accentDark: '#cf4f13',       // Dark Orange
  purpleLight: '#9a7cb6',      // Light Purple

  // Status Colors
  success: '#48bb78',
  warning: '#ed8936',
  danger: '#f56565',
  info: '#4299e1',

  // Neutral Colors
  white: '#ffffff',
  black: '#000000',
};

// ============================================================================
// THEME-SPECIFIC COLORS
// ============================================================================
export const ThemeColors = {
  light: {
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#2d3748',
    textSecondary: '#718096',
    textMuted: '#a0aec0',
    border: '#e2e8f0',
    tabBarBackground: '#ffffff',
    tabBarBorder: '#e2e8f0',
    tabBarActive: ColorPalette.primary,
    tabBarInactive: '#8E8E93',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    background: '#1a1a2e',
    surface: '#252538',
    text: '#ffffff',
    textSecondary: '#b8bac3',
    textMuted: '#6b6d7a',
    border: '#3a3a4e',
    tabBarBackground: '#1a1a2e',
    tabBarBorder: '#3a3a4e',
    tabBarActive: ColorPalette.accent,
    tabBarInactive: '#8E8E93',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
};

// ============================================================================
// SPACING CONSTANTS
// ============================================================================
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================
export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ============================================================================
// SHADOWS
// ============================================================================
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 12,
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================
export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ============================================================================
// COMMON STYLES FACTORY
// ============================================================================
export const createStyles = (theme: 'light' | 'dark') => {
  const themeColors = ThemeColors[theme];

  return StyleSheet.create({
    // ========================================================================
    // CONTAINER STYLES
    // ========================================================================
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    scrollView: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    contentContainer: {
      padding: Spacing.lg,
      paddingBottom: Spacing.xxxl,
    },

    // ========================================================================
    // CARD STYLES
    // ========================================================================
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      ...Shadows.md,
      shadowColor: themeColors.cardShadow,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
      paddingBottom: Spacing.md,
      borderBottomWidth: 2,
      borderBottomColor: themeColors.border,
    },
    cardTitle: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.semibold,
      color: themeColors.text,
    },
    cardSubtitle: {
      fontSize: Typography.fontSize.sm,
      color: themeColors.textSecondary,
      marginTop: Spacing.xs,
    },

    // ========================================================================
    // STAT CARD STYLES
    // ========================================================================
    statCard: {
      backgroundColor: themeColors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      ...Shadows.md,
      shadowColor: themeColors.cardShadow,
      position: 'relative',
      overflow: 'hidden',
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    statIcon: {
      width: 50,
      height: 50,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statValue: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: themeColors.text,
      marginBottom: Spacing.xs,
    },
    statLabel: {
      fontSize: Typography.fontSize.sm,
      color: themeColors.textSecondary,
      fontWeight: Typography.fontWeight.medium,
    },
    statTrend: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.sm,
      marginTop: Spacing.sm,
      alignSelf: 'flex-start',
    },

    // ========================================================================
    // TEXT STYLES
    // ========================================================================
    heading1: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      fontFamily: FontFamily.arabicBold,
      color: themeColors.text,
      lineHeight: Typography.fontSize.xxxl * Typography.lineHeight.tight,
    },
    heading2: {
      fontSize: Typography.fontSize.xxl,
      fontWeight: Typography.fontWeight.bold,
      fontFamily: FontFamily.arabicBold,
      color: themeColors.text,
      lineHeight: Typography.fontSize.xxl * Typography.lineHeight.tight,
    },
    heading3: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.semibold,
      fontFamily: FontFamily.arabicSemiBold,
      color: themeColors.text,
      lineHeight: Typography.fontSize.xl * Typography.lineHeight.normal,
    },
    bodyText: {
      fontSize: Typography.fontSize.base,
      fontFamily: FontFamily.arabic,
      color: themeColors.text,
      lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    },
    bodyTextSecondary: {
      fontSize: Typography.fontSize.base,
      fontFamily: FontFamily.arabic,
      color: themeColors.textSecondary,
      lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    },
    smallText: {
      fontSize: Typography.fontSize.sm,
      fontFamily: FontFamily.arabic,
      color: themeColors.textSecondary,
    },
    caption: {
      fontSize: Typography.fontSize.xs,
      fontFamily: FontFamily.arabic,
      color: themeColors.textMuted,
    },

    // ========================================================================
    // BUTTON STYLES
    // ========================================================================
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.md,
    },
    buttonPrimary: {
      backgroundColor: ColorPalette.primary,
    },
    buttonSecondary: {
      backgroundColor: ColorPalette.secondary,
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: ColorPalette.primary,
    },
    buttonText: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.semibold,
      color: ColorPalette.white,
    },
    buttonTextOutline: {
      color: ColorPalette.primary,
    },
    buttonSmall: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
    },
    buttonLarge: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xxl,
    },

    // ========================================================================
    // BADGE STYLES
    // ========================================================================
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      alignSelf: 'flex-start',
    },
    badgeSuccess: {
      backgroundColor: `${ColorPalette.success}15`,
    },
    badgeWarning: {
      backgroundColor: `${ColorPalette.warning}15`,
    },
    badgeDanger: {
      backgroundColor: `${ColorPalette.danger}15`,
    },
    badgeInfo: {
      backgroundColor: `${ColorPalette.info}15`,
    },
    badgePrimary: {
      backgroundColor: `${ColorPalette.primary}15`,
    },
    badgeText: {
      fontSize: Typography.fontSize.xs,
      fontWeight: Typography.fontWeight.semibold,
    },
    badgeTextSuccess: {
      color: ColorPalette.success,
    },
    badgeTextWarning: {
      color: ColorPalette.warning,
    },
    badgeTextDanger: {
      color: ColorPalette.danger,
    },
    badgeTextInfo: {
      color: ColorPalette.info,
    },
    badgeTextPrimary: {
      color: ColorPalette.primary,
    },

    // ========================================================================
    // FORM STYLES
    // ========================================================================
    formGroup: {
      marginBottom: Spacing.lg,
    },
    formLabel: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.semibold,
      color: themeColors.text,
      marginBottom: Spacing.sm,
    },
    input: {
      backgroundColor: themeColors.surface,
      borderWidth: 2,
      borderColor: themeColors.border,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      fontSize: Typography.fontSize.base,
      color: themeColors.text,
    },
    inputFocused: {
      borderColor: ColorPalette.primary,
    },

    // ========================================================================
    // TAB BAR STYLES
    // ========================================================================
    tabBarStyle: {
      backgroundColor: themeColors.tabBarBackground,
      borderTopColor: themeColors.tabBarBorder,
      borderTopWidth: 2,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.md,
      height: 65,
      ...Shadows.lg,
      shadowColor: themeColors.cardShadow,
    },
    tabBarLabelStyle: {
      fontSize: Typography.fontSize.xs,
      fontWeight: Typography.fontWeight.semibold,
      marginTop: Spacing.xs,
    },
    tabBarIconContainer: {
      marginTop: Spacing.xs,
    },

    // ========================================================================
    // LAYOUT STYLES
    // ========================================================================
    row: {
      flexDirection: 'row',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    column: {
      flexDirection: 'column',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    // ========================================================================
    // SPACING UTILITIES
    // ========================================================================
    mt1: { marginTop: Spacing.xs },
    mt2: { marginTop: Spacing.sm },
    mt3: { marginTop: Spacing.md },
    mt4: { marginTop: Spacing.lg },
    mb1: { marginBottom: Spacing.xs },
    mb2: { marginBottom: Spacing.sm },
    mb3: { marginBottom: Spacing.md },
    mb4: { marginBottom: Spacing.lg },
    ml1: { marginLeft: Spacing.xs },
    ml2: { marginLeft: Spacing.sm },
    ml3: { marginLeft: Spacing.md },
    ml4: { marginLeft: Spacing.lg },
    mr1: { marginRight: Spacing.xs },
    mr2: { marginRight: Spacing.sm },
    mr3: { marginRight: Spacing.md },
    mr4: { marginRight: Spacing.lg },
    p1: { padding: Spacing.xs },
    p2: { padding: Spacing.sm },
    p3: { padding: Spacing.md },
    p4: { padding: Spacing.lg },

    // ========================================================================
    // DIVIDER
    // ========================================================================
    divider: {
      height: 1,
      backgroundColor: themeColors.border,
      marginVertical: Spacing.lg,
    },
    dividerThick: {
      height: 2,
      backgroundColor: themeColors.border,
      marginVertical: Spacing.lg,
    },

    // ========================================================================
    // AVATAR
    // ========================================================================
    avatar: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.full,
      backgroundColor: ColorPalette.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarLarge: {
      width: 60,
      height: 60,
      borderRadius: BorderRadius.full,
    },
    avatarSmall: {
      width: 30,
      height: 30,
      borderRadius: BorderRadius.full,
    },
    avatarText: {
      color: ColorPalette.white,
      fontWeight: Typography.fontWeight.semibold,
      fontSize: Typography.fontSize.sm,
    },

    // ========================================================================
    // LIST ITEM
    // ========================================================================
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.lg,
      backgroundColor: themeColors.surface,
      borderRadius: BorderRadius.md,
      marginBottom: Spacing.sm,
      ...Shadows.sm,
      shadowColor: themeColors.cardShadow,
    },
    listItemContent: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    listItemTitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: themeColors.text,
      marginBottom: Spacing.xs,
    },
    listItemSubtitle: {
      fontSize: Typography.fontSize.sm,
      color: themeColors.textSecondary,
    },

    // ========================================================================
    // LOADING
    // ========================================================================
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.background,
    },
    loadingText: {
      marginTop: Spacing.lg,
      fontSize: Typography.fontSize.base,
      color: themeColors.textSecondary,
    },

    // ========================================================================
    // EMPTY STATE
    // ========================================================================
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xxxl,
    },
    emptyStateTitle: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.semibold,
      color: themeColors.text,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
      textAlign: 'center',
    },
    emptyStateDescription: {
      fontSize: Typography.fontSize.base,
      color: themeColors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xl,
    },
  });
};

// ============================================================================
// EXPORT DEFAULT STYLES (FOR BOTH THEMES)
// ============================================================================
export const LightStyles = createStyles('light');
export const DarkStyles = createStyles('dark');
