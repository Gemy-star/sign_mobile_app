// screens/AllSetScreen.tsx
// Final onboarding screen before entering the app

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

const LOGO_IMAGE = require('@/assets/images/logo.png');

const SAMPLE_IMAGES = [
  LOGO_IMAGE,
  LOGO_IMAGE,
  LOGO_IMAGE,
];

interface AllSetScreenProps {
  onComplete?: () => void;
}

export default function AllSetScreen({ onComplete }: AllSetScreenProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const isRTL = language === 'ar';

  useEffect(() => {
    // Auto-navigate after showing success
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        router.replace('/(tabs)');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>
          {isRTL ? 'تم الإعداد!' : 'All set!'}
        </Text>
        <Text style={styles.subtitle}>
          {isRTL ? 'يمكنك البدء الآن' : 'Finding messages for you...'}
        </Text>

        <View style={styles.previewContainer}>
          {SAMPLE_IMAGES.map((image, index) => (
            <View key={index} style={styles.previewCard}>
              <Image
                source={image}
                style={styles.previewImage}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
  checkmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C96F4A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  checkmarkText: {
    fontSize: 48,
    color: '#FAF8F5',
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#311E13',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#53321D',
    marginBottom: 48,
  },
  previewContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  previewCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});
