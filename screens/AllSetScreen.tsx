// screens/AllSetScreen.tsx
// Final onboarding screen before entering the app - Modern Design

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
    TouchableOpacity,
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

interface AllSetScreenProps {
  onComplete?: () => void;
}

export default function AllSetScreen({ onComplete }: AllSetScreenProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const isRTL = language === 'ar';

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [checkScale] = useState(new Animated.Value(0));

  const getFontFamily = (weight: 'regular' | 'bold' | 'semibold' = 'regular') => {
    if (isRTL) {
      return weight === 'bold' ? 'Cairo-Bold' : weight === 'semibold' ? 'Cairo-SemiBold' : 'Cairo-Regular';
    } else {
      return weight === 'bold' ? 'Inter-Bold' : weight === 'semibold' ? 'Inter-SemiBold' : 'Inter-Regular';
    }
  };

  useEffect(() => {
    // Checkmark animation
    Animated.sequence([
      Animated.spring(checkScale, {
        toValue: 1.2,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade in content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate is removed - user clicks button
  }, []);

  const handleGetStarted = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.replace('/(tabs)');
    }
  };

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
          {/* Animated Success Checkmark */}
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [{ scale: checkScale }],
              },
            ]}
          >
            <LinearGradient
              colors={['#48bb78', '#38a169']}
              style={styles.checkmark}
            >
              <Text style={styles.checkmarkText}>✓</Text>
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Text style={[styles.title, { fontFamily: getFontFamily('bold') }]}>
            {isRTL ? 'تم الإعداد! 🎉' : 'All set! 🎉'}
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular') }]}>
            {isRTL ? 'كل شيء جاهز! يمكنك البدء الآن' : 'Everything is ready! You can start now'}
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
                        outputRange: [30, 0],
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

          {/* Get Started Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            style={styles.buttonContainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#C96F4A', '#936036']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={[styles.buttonText, { fontFamily: getFontFamily('bold') }]}>
                {isRTL ? 'ابدأ الآن' : 'Get Started'}
              </Text>
              <Text style={styles.buttonIcon}>{isRTL ? '←' : '→'}</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  checkmarkContainer: {
    marginBottom: 32,
  },
  checkmark: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  checkmarkText: {
    fontSize: 52,
    color: '#FFFFFF',
    fontWeight: '800',
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
  buttonContainer: {
    width: '80%',
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
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  buttonText: {
    fontSize: 20,
    color: '#FAF8F5',
  },
  buttonIcon: {
    fontSize: 24,
    color: '#FAF8F5',
  },
});
