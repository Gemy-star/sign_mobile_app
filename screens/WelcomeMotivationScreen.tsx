// screens/WelcomeMotivationScreen.tsx
// Onboarding screen for the motivation app

import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Card, Icon, Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    <Layout style={styles.container} level="1">
      <View style={styles.headerBackground} />

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

          <Text category="h1" style={styles.appName}>
            {t('motivation.appName')}
          </Text>

          <Text category="s1" appearance="hint" style={styles.tagline}>
            {t('motivation.tagline')}
          </Text>
        </View>

        {/* Features Cards */}
        <View style={styles.featuresSection}>
          {features.map((feature, index) => {
            return (
              <Card
                key={index}
                style={styles.featureCard}
              >
                <View style={[styles.featureContent, isRTL && styles.featureContentRTL]}>
                  <View style={[styles.iconContainer, { backgroundColor: `${feature.color}15` }]}>
                    <Icon name={feature.icon} width={24} height={24} fill={feature.color} />
                  </View>
                  <View style={styles.featureText}>
                    <Text category="s1" style={[styles.featureTitle, isRTL && styles.textRTL]}>
                      {feature.title}
                    </Text>
                    <Text category="p2" appearance="hint" style={isRTL && styles.textRTL}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Bottom CTA */}
        <View style={styles.ctaSection}>
          <Button
            size="large"
            onPress={onGetStarted}
            accessoryRight={(props) => (
              <Icon
                {...props}
                name={isRTL ? 'arrow-back-outline' : 'arrow-forward-outline'}
                width={20}
                height={20}
              />
            )}
            style={styles.startButton}
          >
            {t('motivation.getStarted')}
          </Button>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    color: '#000000',
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  tagline: {
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  featuresSection: {
    flex: 1,
    marginTop: 16,
  },
  featureCard: {
    marginBottom: 12,
    borderRadius: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    marginBottom: 4,
  },
  textRTL: {
    textAlign: 'right',
  },
  ctaSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  startButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
