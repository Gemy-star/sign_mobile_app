// screens/WelcomeMotivationScreen.tsx
// Onboarding screen for the motivation app

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowRight,
    Target,
    TrendingUp,
    Zap
} from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface WelcomeMotivationScreenProps {
  onGetStarted?: () => void;
}

export default function WelcomeMotivationScreen({ onGetStarted }: WelcomeMotivationScreenProps) {
  const { styles, colors, palette, spacing } = useAppStyles();
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Messages',
      description: 'Personalized motivational messages generated just for you',
      color: palette.warning,
    },
    {
      icon: Target,
      title: '8 Life Areas',
      description: 'Focus on mental, physical, career, financial growth & more',
      color: palette.info,
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your growth and maintain your motivation streak',
      color: palette.success,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[palette.primary, palette.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: height * 0.5,
        }}
      />

      <View style={[styles.contentContainer, { flex: 1, justifyContent: 'space-between' }]}>
        {/* Top Section with Logo */}
        <View style={{ alignItems: 'center', marginTop: spacing.xxxl }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.xl,
            }}
          >
            <Image
              source={require('@/assets/images/loader.png')}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </View>

          <Text
            style={[
              styles.heading1,
              {
                color: '#fff',
                fontSize: 32,
                marginBottom: spacing.sm,
                textAlign: 'center',
              }
            ]}
          >
            {t('motivation.appName')}
          </Text>

          <Text
            style={[
              styles.bodyText,
              {
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                marginBottom: spacing.xl,
              }
            ]}
          >
            {t('motivation.tagline')}
          </Text>
        </View>

        {/* Features Cards */}
        <View>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <View
                key={index}
                style={[
                  styles.card,
                  styles.rowCenter,
                  {
                    marginBottom: spacing.md,
                    paddingVertical: spacing.lg,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor: `${feature.color}15`,
                      marginRight: spacing.md,
                    },
                  ]}
                >
                  <Icon size={24} color={feature.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bodyText, { fontWeight: '600', marginBottom: spacing.xs }]}>
                    {feature.title}
                  </Text>
                  <Text style={styles.smallText}>{feature.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Bottom CTA */}
        <View style={{ marginBottom: spacing.xl }}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: palette.primary,
                paddingVertical: spacing.lg,
              },
            ]}
            onPress={onGetStarted}
          >
            <Text style={[styles.buttonText, { fontSize: 18 }]}>
              {t('motivation.getStarted')}
            </Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
