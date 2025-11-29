// screens/PrivacySecurityScreen.tsx
// Privacy & Security Settings Screen with UI Kitten

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, Icon, Layout, Text, Toggle } from '@ui-kitten/components';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface PrivacySecurityScreenProps {
  onClose: () => void;
}

export default function PrivacySecurityScreen({ onClose }: PrivacySecurityScreenProps) {
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);

  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';

  // Mock data for privacy settings
  const handleDeleteAccount = () => {
    // TODO: Implement delete account flow
    console.log('Delete account requested');
  };

  const handleDataDownload = () => {
    // TODO: Implement data download
    console.log('Data download requested');
  };

  return (
    <Layout style={styles.container} level="1">
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={onClose}>
          <Icon
            name={isRTL ? 'arrow-forward-outline' : 'arrow-back-outline'}
            style={styles.backIcon}
            fill={textColor}
          />
        </TouchableOpacity>
        <Text category="h5" style={[styles.title, { color: textColor }]}>
          {t('profile.privacySecurity')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Security Section */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('privacy.security') || 'Security'}
        </Text>

        <Card style={styles.settingCard}>
          <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
            <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Icon name="lock-outline" style={styles.iconStyle} />
              <View style={styles.settingInfo}>
                <Text category="s1" style={styles.settingText}>
                  {t('privacy.twoFactorAuth') || 'Two-Factor Authentication'}
                </Text>
                <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                  {t('privacy.twoFactorAuthDesc') || 'Add extra security to your account'}
                </Text>
              </View>
            </View>
            <Toggle checked={twoFactorAuth} onChange={setTwoFactorAuth} />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
            <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Icon name="smartphone-outline" style={styles.iconStyle} />
              <View style={styles.settingInfo}>
                <Text category="s1" style={styles.settingText}>
                  {t('privacy.biometricAuth') || 'Biometric Authentication'}
                </Text>
                <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                  {t('privacy.biometricAuthDesc') || 'Use fingerprint or face ID'}
                </Text>
              </View>
            </View>
            <Toggle checked={biometricAuth} onChange={setBiometricAuth} />
          </View>
        </Card>

        {/* Privacy Section */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('privacy.privacy') || 'Privacy'}
        </Text>

        <Card style={styles.settingCard}>
          <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
            <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Icon name="activity-outline" style={styles.iconStyle} />
              <View style={styles.settingInfo}>
                <Text category="s1" style={styles.settingText}>
                  {t('privacy.shareAnalytics') || 'Share Analytics'}
                </Text>
                <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                  {t('privacy.shareAnalyticsDesc') || 'Help improve the app'}
                </Text>
              </View>
            </View>
            <Toggle checked={shareAnalytics} onChange={setShareAnalytics} />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
            <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Icon name="eye-outline" style={styles.iconStyle} />
              <View style={styles.settingInfo}>
                <Text category="s1" style={styles.settingText}>
                  {t('privacy.personalizedAds') || 'Personalized Ads'}
                </Text>
                <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                  {t('privacy.personalizedAdsDesc') || 'See relevant advertisements'}
                </Text>
              </View>
            </View>
            <Toggle checked={personalizedAds} onChange={setPersonalizedAds} />
          </View>
        </Card>

        {/* Data Section */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('privacy.yourData') || 'Your Data'}
        </Text>

        <TouchableOpacity onPress={handleDataDownload}>
          <Card style={styles.settingCard}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="download-outline" style={styles.iconStyle} />
                <View style={styles.settingInfo}>
                  <Text category="s1" style={styles.settingText}>
                    {t('privacy.downloadData') || 'Download Your Data'}
                  </Text>
                  <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                    {t('privacy.downloadDataDesc') || 'Get a copy of your information'}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount}>
          <Card style={[styles.settingCard, styles.dangerCard]}>
            <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
              <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                <Icon name="trash-2-outline" style={styles.iconStyle} fill="#ef4444" />
                <View style={styles.settingInfo}>
                  <Text category="s1" style={[styles.settingText, styles.dangerText]}>
                    {t('privacy.deleteAccount') || 'Delete Account'}
                  </Text>
                  <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                    {t('privacy.deleteAccountDesc') || 'Permanently delete your account'}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} fill="#ef4444" />
            </View>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  placeholder: {
    width: 24,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginTop: 8,
    marginBottom: 12,
  },
  textRTL: {
    textAlign: 'right',
  },
  settingCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  dangerCard: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingRowRTL: {
    flexDirection: 'row-reverse',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLeftRTL: {
    flexDirection: 'row-reverse',
  },
  settingInfo: {
    flex: 1,
  },
  settingText: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    marginBottom: 4,
  },
  dangerText: {
    color: '#ef4444',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
