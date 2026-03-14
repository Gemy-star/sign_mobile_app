// screens/WelcomeMotivationScreen.tsx
// Onboarding screen for the motivation app - Dark Brown Design

import { useLanguage } from '@/contexts/LanguageContext';
import { Icon } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

interface WelcomeMotivationScreenProps {
  onGetStarted?: () => void;
}

export default function WelcomeMotivationScreen({ onGetStarted }: WelcomeMotivationScreenProps) {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: 'flash-outline',
      title: t('motivation.aiMessages'),
      description: t('motivation.aiMessagesDesc'),
      color: '#ED8936',
    },
    {
      icon: 'radio-button-on-outline',
      title: t('motivation.lifeAreas'),
      description: t('motivation.lifeAreasDesc'),
      color: '#4299E1',
    },
    {
      icon: 'trending-up-outline',
      title: t('motivation.trackProgress'),
      description: t('motivation.trackProgressDesc'),
      color: '#48BB78',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(49,30,19,0.85)', 'rgba(83,50,29,0.90)', 'rgba(49,30,19,0.85)']}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section with Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/loader.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appName}>
            {t('motivation.appName')}
          </Text>

          <Text style={styles.tagline}>
            {t('motivation.tagline')}
          </Text>
        </View>

        {/* Features Cards */}
        <View style={styles.featuresSection}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureContent, isRTL && styles.featureContentRTL]}>
                <View style={[styles.iconContainer, { borderColor: `${feature.color}60` }]}>
                  <Icon name={feature.icon} width={24} height={24} fill={feature.color} />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, isRTL && styles.textRTL]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, isRTL && styles.textRTL]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom CTA */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            onPress={onGetStarted}
            style={styles.buttonContainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#C96F4A', '#936036', '#C96F4A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {t('motivation.getStarted')}
              </Text>
              <Icon
                name={isRTL ? 'arrow-back-outline' : 'arrow-forward-outline'}
                width={20}
                height={20}
                fill="#FAF8F5"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#53321D',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(49, 30, 19, 0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250, 248, 245, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    color: '#FAF8F5',
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  tagline: {
    color: '#E8CE80',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  featuresSection: {
    flex: 1,
    marginTop: 16,
  },
  featureCard: {
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(49, 30, 19, 0.60)',
    borderWidth: 1,
    borderColor: 'rgba(250, 248, 245, 0.18)',
    padding: 24,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureContentRTL: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 206, 128, 0.35)',
    backgroundColor: 'rgba(232, 206, 128, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 15,
    color: '#E8CE80',
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 13,
    color: 'rgba(250, 248, 245, 0.6)',
    lineHeight: 20,
  },
  textRTL: {
    textAlign: 'right',
  },
  ctaSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    paddingHorizontal: 32,
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontWeight: 'bold',
  },
});
