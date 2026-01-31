// screens/FindingTopicsScreen.tsx
// Loading screen after topic selection

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
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

interface FindingTopicsScreenProps {
  onComplete?: () => void;
}

export default function FindingTopicsScreen({ onComplete }: FindingTopicsScreenProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const isRTL = language === 'ar';

  useEffect(() => {
    // Simulate loading and then navigate to all set screen
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        router.replace('/all-set');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isRTL ? 'تم!' : 'All set!'}
        </Text>
        <Text style={styles.subtitle}>
          {isRTL ? 'جارٍ البحث عن رسائل لك...' : 'Finding messages for you...'}
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

        <ActivityIndicator
          size="large"
          color="#C96F4A"
          style={styles.loader}
        />
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
    marginBottom: 32,
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
  loader: {
    marginTop: 24,
  },
});
