// components/StyleShowcase.tsx
// Example component showcasing all available styles from the new styling system

import { useAppStyles } from '@/hooks/useAppStyles';
import {
    AlertTriangle,
    Bell,
    CheckCircle,
    Info,
    XCircle
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export const StyleShowcase = () => {
  const { styles, palette, spacing, isDark } = useAppStyles();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>

        {/* Typography Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Typography</Text>
          <Text style={styles.heading1}>Heading 1</Text>
          <Text style={styles.heading2}>Heading 2</Text>
          <Text style={styles.heading3}>Heading 3</Text>
          <Text style={styles.bodyText}>Body Text - Regular</Text>
          <Text style={styles.bodyTextSecondary}>Body Text - Secondary</Text>
          <Text style={styles.smallText}>Small Text</Text>
          <Text style={styles.caption}>Caption Text</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Buttons</Text>

          <TouchableOpacity style={[styles.button, styles.buttonPrimary]}>
            <Text style={styles.buttonText}>Primary Button</Text>
          </TouchableOpacity>

          <View style={styles.mt2} />

          <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}>Secondary Button</Text>
          </TouchableOpacity>

          <View style={styles.mt2} />

          <TouchableOpacity style={[styles.button, styles.buttonOutline]}>
            <Text style={[styles.buttonText, styles.buttonTextOutline]}>Outline Button</Text>
          </TouchableOpacity>

          <View style={styles.mt2} />

          <View style={styles.rowCenter}>
            <TouchableOpacity style={[styles.button, styles.buttonSmall, styles.buttonPrimary, styles.mr2]}>
              <Text style={styles.buttonText}>Small</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonLarge, styles.buttonSecondary]}>
              <Text style={styles.buttonText}>Large Button</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stat Cards Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stat Cards</Text>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: palette.primary }]}>
                <Bell size={24} color="#fff" />
              </View>
            </View>
            <Text style={styles.statValue}>1,234</Text>
            <Text style={styles.statLabel}>Total Notifications</Text>
            <View style={[styles.statTrend, { backgroundColor: `${palette.success}15` }]}>
              <Text style={[styles.smallText, { color: palette.success }]}>↑ 12.5%</Text>
            </View>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Badges</Text>

          <View style={styles.rowCenter}>
            <View style={[styles.badge, styles.badgeSuccess, styles.mr2]}>
              <CheckCircle size={12} color={palette.success} />
              <Text style={[styles.badgeText, styles.badgeTextSuccess]}>Success</Text>
            </View>

            <View style={[styles.badge, styles.badgeWarning, styles.mr2]}>
              <AlertTriangle size={12} color={palette.warning} />
              <Text style={[styles.badgeText, styles.badgeTextWarning]}>Warning</Text>
            </View>
          </View>

          <View style={[styles.rowCenter, styles.mt2]}>
            <View style={[styles.badge, styles.badgeDanger, styles.mr2]}>
              <XCircle size={12} color={palette.danger} />
              <Text style={[styles.badgeText, styles.badgeTextDanger]}>Danger</Text>
            </View>

            <View style={[styles.badge, styles.badgeInfo, styles.mr2]}>
              <Info size={12} color={palette.info} />
              <Text style={[styles.badgeText, styles.badgeTextInfo]}>Info</Text>
            </View>

            <View style={[styles.badge, styles.badgePrimary]}>
              <Text style={[styles.badgeText, styles.badgeTextPrimary]}>Primary</Text>
            </View>
          </View>
        </View>

        {/* List Items Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>List Items</Text>

          <View style={styles.listItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>John Doe</Text>
              <Text style={styles.listItemSubtitle}>Software Engineer</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AS</Text>
            </View>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>Alice Smith</Text>
              <Text style={styles.listItemSubtitle}>Product Manager</Text>
            </View>
          </View>
        </View>

        {/* Spacing Utilities */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spacing Utilities</Text>
          <Text style={styles.bodyTextSecondary}>
            Available spacing: xs={spacing.xs}px, sm={spacing.sm}px, md={spacing.md}px,
            lg={spacing.lg}px, xl={spacing.xl}px, xxl={spacing.xxl}px, xxxl={spacing.xxxl}px
          </Text>

          <View style={styles.mt3}>
            <View style={[styles.badge, styles.badgePrimary]}>
              <Text style={[styles.badgeText, styles.badgeTextPrimary]}>mt1</Text>
            </View>
            <View style={[styles.badge, styles.badgePrimary, styles.mt1]}>
              <Text style={[styles.badgeText, styles.badgeTextPrimary]}>mt2</Text>
            </View>
            <View style={[styles.badge, styles.badgePrimary, styles.mt2]}>
              <Text style={[styles.badgeText, styles.badgeTextPrimary]}>mt3</Text>
            </View>
            <View style={[styles.badge, styles.badgePrimary, styles.mt3]}>
              <Text style={[styles.badgeText, styles.badgeTextPrimary]}>mt4</Text>
            </View>
          </View>
        </View>

        {/* Theme Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Theme</Text>
          <View style={[styles.badge, isDark ? styles.badgeInfo : styles.badgeWarning]}>
            <Text style={[styles.badgeText, isDark ? styles.badgeTextInfo : styles.badgeTextWarning]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

export default StyleShowcase;
