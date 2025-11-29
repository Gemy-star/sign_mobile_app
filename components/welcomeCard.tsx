import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { I18nManager, Image, StyleSheet, Text, View } from 'react-native';

const WelcomeCard = () => {
  const { language, t } = useLanguage?.() || {
    language: 'ar',
    t: (key: string) => key,
  };
  const { colorScheme } = useTheme();
  const isRTL = language === 'ar' || I18nManager.isRTL;

  const logoSource = colorScheme === 'dark'
    ? require('../assets/images/logo-dark.png')
    : require('../assets/images/logo.png');

  return (
    <LinearGradient
      colors={['#FFB347', '#5EF1CA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBorder}
    >
      <View style={styles.card}>
        {/* Logo centered at top */}
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Text content */}
        <View style={styles.textContent}>
          <Text
            style={[
              styles.titleBox,
              {
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
              },
            ]}
          >
            {t('welcomeCard.title') || 'ملتقى التصنيف العالمي في السعودية يرحب بك'}
            <Text style={styles.emoji}> 🔥</Text>
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                textAlign: 'center',
                writingDirection: isRTL ? 'rtl' : 'ltr',
              },
            ]}
          >
            {t('welcomeCard.subtitle') || 'يسعدنا مشاركتك، تصفح جدول فعالياتك والمتحدثين.'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBorder: {
    padding: 2,
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#002524',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 16,
  },
  textContent: {
    width: '100%',
    alignItems: 'center',
  },
  titleBox: {
    width: 295,
    height: 37,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'IBM Plex Sans Arabic',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 14,
  },
  subtitle: {
    width: 295,
    height: 42,
    color: '#ccc',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21, // 14px * 1.5 = 21
    fontFamily: 'IBM Plex Sans Arabic',
  },
});

export default WelcomeCard;
