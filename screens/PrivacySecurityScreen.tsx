// screens/PrivacySecurityScreen.tsx
// Privacy & Security Settings Screen - Dark Brown Visual Style

import { useLanguage } from '@/contexts/LanguageContext';
import { Icon, Text, Toggle } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface PrivacySecurityScreenProps {
  readonly onClose: () => void;
}

export default function PrivacySecurityScreen({ onClose }: Readonly<PrivacySecurityScreenProps>) {
  const { t, language } = useLanguage();
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);

  const isRTL = language === 'ar';

  const handleDeleteAccount = () => {
    // TODO: Implement delete account flow
    console.log('Delete account requested');
  };

  const handleDataDownload = () => {
    // TODO: Implement data download
    console.log('Data download requested');
  };

  return (
    <View style={styles.root}>
      {/* Background */}
      <View style={styles.backgroundFill} />
      <LinearGradient
        colors={['rgba(49,30,19,0.85)', 'rgba(83,50,29,0.90)', 'rgba(49,30,19,0.85)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon
            name={isRTL ? 'arrow-forward-outline' : 'arrow-back-outline'}
            style={styles.backIcon}
            fill="#FAF8F5"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('profile.privacySecurity')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Security section ─────────────────────────────── */}
        <Text style={[styles.sectionLabel, isRTL && styles.textRTL]}>
          {t('privacy.security') || 'Security'}
        </Text>

        {/* Two-Factor Auth */}
        <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
          <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
            <View style={styles.iconBox}>
              <Icon name="lock-outline" style={styles.iconStyle} fill="#FAF8F5" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isRTL && styles.textRTL]}>
                {t('privacy.twoFactorAuth') || 'Two-Factor Authentication'}
              </Text>
              <Text style={[styles.settingSubtitle, isRTL && styles.textRTL]}>
                {t('privacy.twoFactorAuthDesc') || 'Add extra security to your account'}
              </Text>
            </View>
          </View>
          <Toggle checked={twoFactorAuth} onChange={setTwoFactorAuth} />
        </View>

        {/* Biometric Auth */}
        <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
          <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
            <View style={styles.iconBox}>
              <Icon name="smartphone-outline" style={styles.iconStyle} fill="#FAF8F5" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isRTL && styles.textRTL]}>
                {t('privacy.biometricAuth') || 'Biometric Authentication'}
              </Text>
              <Text style={[styles.settingSubtitle, isRTL && styles.textRTL]}>
                {t('privacy.biometricAuthDesc') || 'Use fingerprint or face ID'}
              </Text>
            </View>
          </View>
          <Toggle checked={biometricAuth} onChange={setBiometricAuth} />
        </View>

        {/* ── Privacy section ──────────────────────────────── */}
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced, isRTL && styles.textRTL]}>
          {t('privacy.privacy') || 'Privacy'}
        </Text>

        {/* Share Analytics */}
        <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
          <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
            <View style={styles.iconBox}>
              <Icon name="activity-outline" style={styles.iconStyle} fill="#FAF8F5" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isRTL && styles.textRTL]}>
                {t('privacy.shareAnalytics') || 'Share Analytics'}
              </Text>
              <Text style={[styles.settingSubtitle, isRTL && styles.textRTL]}>
                {t('privacy.shareAnalyticsDesc') || 'Help improve the app'}
              </Text>
            </View>
          </View>
          <Toggle checked={shareAnalytics} onChange={setShareAnalytics} />
        </View>

        {/* Personalized Ads */}
        <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
          <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
            <View style={styles.iconBox}>
              <Icon name="eye-outline" style={styles.iconStyle} fill="#FAF8F5" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isRTL && styles.textRTL]}>
                {t('privacy.personalizedAds') || 'Personalized Ads'}
              </Text>
              <Text style={[styles.settingSubtitle, isRTL && styles.textRTL]}>
                {t('privacy.personalizedAdsDesc') || 'See relevant advertisements'}
              </Text>
            </View>
          </View>
          <Toggle checked={personalizedAds} onChange={setPersonalizedAds} />
        </View>

        {/* ── Your Data section ────────────────────────────── */}
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced, isRTL && styles.textRTL]}>
          {t('privacy.yourData') || 'Your Data'}
        </Text>

        {/* Download Data */}
        <TouchableOpacity onPress={handleDataDownload} activeOpacity={0.75}>
          <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
            <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <View style={styles.iconBox}>
                <Icon name="download-outline" style={styles.iconStyle} fill="#FAF8F5" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, isRTL && styles.textRTL]}>
                  {t('privacy.downloadData') || 'Download Your Data'}
                </Text>
                <Text style={[styles.settingSubtitle, isRTL && styles.textRTL]}>
                  {t('privacy.downloadDataDesc') || 'Get a copy of your information'}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right-outline" style={styles.chevronIcon} fill="rgba(250,248,245,0.5)" />
          </View>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity onPress={handleDeleteAccount} activeOpacity={0.75}>
          <View style={[styles.settingRow, styles.dangerRow, isRTL && styles.settingRowRTL]}>
            <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <View style={[styles.iconBox, styles.dangerIconBox]}>
                <Icon name="trash-2-outline" style={styles.iconStyle} fill="#ef4444" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, styles.dangerText, isRTL && styles.textRTL]}>
                  {t('privacy.deleteAccount') || 'Delete Account'}
                </Text>
                <Text style={[styles.settingSubtitle, isRTL && styles.textRTL]}>
                  {t('privacy.deleteAccountDesc') || 'Permanently delete your account'}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right-outline" style={styles.chevronIcon} fill="#ef4444" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#53321D',
  },
  backgroundFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#53321D',
  },
  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(49,30,19,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(250,248,245,0.1)',
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 18,
  },
  placeholder: {
    width: 24,
  },
  // ── Scroll content ───────────────────────────────────────
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  // ── Section labels ───────────────────────────────────────
  sectionLabel: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sectionLabelSpaced: {
    marginTop: 28,
  },
  // ── Setting rows ─────────────────────────────────────────
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(49,30,19,0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(250,248,245,0.08)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 0,
    marginBottom: 1,
  },
  settingRowRTL: {
    flexDirection: 'row-reverse',
  },
  dangerRow: {
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingLeftRTL: {
    flexDirection: 'row-reverse',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(250,248,245,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIconBox: {
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  iconStyle: {
    width: 18,
    height: 18,
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 14,
    marginBottom: 2,
  },
  settingSubtitle: {
    color: 'rgba(250,248,245,0.6)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 12,
  },
  dangerText: {
    color: '#ef4444',
  },
  // ── RTL helpers ──────────────────────────────────────────
  textRTL: {
    textAlign: 'right',
  },
});
