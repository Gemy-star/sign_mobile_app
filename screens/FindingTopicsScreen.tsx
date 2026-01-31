// screens/FindingTopicsScreen.tsx
// Loading screen after topic selection - Modern Design

import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

// Using placeholder images for preview
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=300',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300',
];

interface FindingTopicsScreenProps {
  onComplete?: () => void;
}

export default function FindingTopicsScreen({ onComplete }: FindingTopicsScreenProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const isRTL = language === 'ar';

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const getFontFamily = (weight: 'regular' | 'bold' | 'semibold' = 'regular') => {
    if (isRTL) {
      return weight === 'bold' ? 'Cairo-Bold' : weight === 'semibold' ? 'Cairo-SemiBold' : 'Cairo-Regular';
    } else {
      return weight === 'bold' ? 'Inter-Bold' : weight === 'semibold' ? 'Inter-SemiBold' : 'Inter-Regular';
    }
  };

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
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
      <LinearGradient
        colors={['#FAF8F5', '#F5F1ED', '#FAF8F5']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Animated Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#C96F4A', '#936036']}
              style={styles.iconGradient}
            >
              <Text style={styles.iconEmoji}>🔍</Text>
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={[styles.title, { fontFamily: getFontFamily('bold') }]}>
            {isRTL ? 'جارٍ البحث...' : 'Finding messages...'}
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular') }]}>
            {isRTL ? 'نختار أفضل الرسائل لك' : 'We\'re selecting the best messages for you'}
          </Text>

          {/* Preview Cards */}
          <View style={styles.previewContainer}>
            {SAMPLE_IMAGES.map((image, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.previewCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    }],
                  },
                ]}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.previewImage}
                  defaultSource={require('@/assets/images/logo.png')}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(49, 30, 19, 0.6)']}
                  style={styles.cardOverlay}
                />
              </Animated.View>
            ))}
          </View>

          {/* Loading Indicator */}
          <View style={styles.loaderContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '80%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.loadingText, { fontFamily: getFontFamily('semibold') }]}>
              {isRTL ? 'جارٍ التحميل...' : 'Loading...'}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  iconEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    color: '#311E13',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#936036',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  previewContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  previewCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D5CCC3',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    width: '80%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(213, 204, 195, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C96F4A',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 16,
    color: '#936036',
  },
});
