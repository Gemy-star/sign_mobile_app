// screens/TopicSelectionScreen.tsx
// Pinterest-style topic selection  scopes fetched from API

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchScopes } from '@/store/slices/scopesSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
// 16px padding each side (32) + 2 gaps of 10px between 3 columns (20) = 52
const CARD_WIDTH = (width - 52) / 3;

// Fallback image per category when scope has no icon
const CATEGORY_IMAGES: Record<string, string> = {
  mental:        'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
  physical:      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
  career:        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  financial:     'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400',
  relationships: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400',
  spiritual:     'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
  creativity:    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
  lifestyle:     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
};

const CATEGORY_GRADIENTS: Record<string, string[]> = {
  mental:        ['rgba(201, 111, 74, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  physical:      ['rgba(147, 96, 54, 0.7)',  'rgba(49, 30, 19, 0.9)'],
  career:        ['rgba(232, 206, 128, 0.7)','rgba(49, 30, 19, 0.9)'],
  financial:     ['rgba(147, 96, 54, 0.7)',  'rgba(49, 30, 19, 0.9)'],
  relationships: ['rgba(201, 111, 74, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  spiritual:     ['rgba(232, 206, 128, 0.7)','rgba(49, 30, 19, 0.9)'],
  creativity:    ['rgba(147, 96, 54, 0.7)',  'rgba(49, 30, 19, 0.9)'],
  lifestyle:     ['rgba(201, 111, 74, 0.7)', 'rgba(49, 30, 19, 0.9)'],
};

interface TopicSelectionScreenProps {
  onComplete?: (selectedTopics: string[]) => void;
}

export default function TopicSelectionScreen({ onComplete }: Readonly<TopicSelectionScreenProps>) {
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isRTL = language === 'ar';

  const { scopes, isLoading, error } = useAppSelector((state) => state.scopes);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchScopes());
  }, [dispatch]);

  const getFontFamily = (weight: 'regular' | 'bold' | 'semibold' = 'regular') => {
    if (isRTL) {
      if (weight === 'bold') return 'Cairo-Bold';
      if (weight === 'semibold') return 'Cairo-SemiBold';
      return 'Cairo-Regular';
    }
    if (weight === 'bold') return 'Inter-Bold';
    if (weight === 'semibold') return 'Inter-SemiBold';
    return 'Inter-Regular';
  };

  const toggleScope = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedIds.length >= 3) {
      if (onComplete) {
        onComplete(selectedIds.map(String));
      } else {
        router.push('/finding-topics');
      }
    }
  };

  const canProceed = selectedIds.length >= 3;

  const renderGrid = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C96F4A" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { fontFamily: getFontFamily('regular') }]}>
            {isRTL ? 'تعذر تحميل المواضيع' : 'Could not load topics'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchScopes())}>
            <Text style={[styles.retryButtonText, { fontFamily: getFontFamily('semibold') }]}>
              {isRTL ? 'إعادة المحاولة' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {scopes.filter((s) => s.is_active).map((scope) => {
            const isSelected = selectedIds.includes(scope.id);
            const imageUri = CATEGORY_IMAGES[scope.category] ?? CATEGORY_IMAGES.mental;
            const gradient = CATEGORY_GRADIENTS[scope.category] ?? CATEGORY_GRADIENTS.mental;
            return (
              <TouchableOpacity
                key={scope.id}
                style={[styles.topicCard, isSelected && styles.topicCardSelected]}
                onPress={() => toggleScope(scope.id)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.topicImage}
                  defaultSource={require('@/assets/images/logo.png')}
                />
                <LinearGradient colors={gradient as [string, string]} style={styles.topicOverlay}>
                  <Text style={[styles.topicText, { fontFamily: getFontFamily('bold') }]}>
                    {scope.name}
                  </Text>
                </LinearGradient>
                {isSelected && (
                  <View style={[styles.checkmarkContainer, isRTL ? { left: 12 } : { right: 12 }]}>
                    <LinearGradient colors={['#C96F4A', '#936036']} style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </LinearGradient>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FAF8F5', '#F5F1ED']} style={styles.header}>
        <View style={[styles.headerContent, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.headerTextContainer, isRTL ? { marginLeft: 16 } : { marginRight: 16 }]}>
            <View style={[styles.titleRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text
                style={[
                  styles.title,
                  { fontFamily: getFontFamily('bold') },
                  isRTL && { textAlign: 'right', marginRight: 0, marginLeft: 8 },
                ]}
              >
                {isRTL ? 'مرحبا' : 'Welcome'}
              </Text>
              <Text style={styles.emojiWave}></Text>
            </View>
            <Text
              style={[
                styles.subtitle,
                { fontFamily: getFontFamily('regular') },
                isRTL && { textAlign: 'right' },
              ]}
            >
              {isRTL ? 'اختر 3 مواضيع أو أكثر' : 'Pick 3 or more topics'}
            </Text>
            {selectedIds.length > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#C96F4A', '#936036']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${Math.min((selectedIds.length / 3) * 100, 100)}%` }]}
                  />
                </View>
                <Text style={[styles.progressText, { fontFamily: getFontFamily('semibold') }]}>
                  {selectedIds.length}/3
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!canProceed}
          >
            <LinearGradient
              colors={canProceed ? ['#C96F4A', '#936036'] : ['#D5CCC3', '#D5CCC3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  { fontFamily: getFontFamily('bold') },
                  !canProceed && styles.nextButtonTextDisabled,
                ]}
              >
                {isRTL ? 'التالي' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Grid */}
      {renderGrid()}

      {selectedIds.length > 0 && (
        <View style={styles.selectionIndicator}>
          <LinearGradient
            colors={['#C96F4A', '#936036']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.selectionBadge}
          >
            <Text style={[styles.selectionText, { fontFamily: getFontFamily('bold') }]}>
              {selectedIds.length} {isRTL ? 'موضوع محدد' : 'topics selected'}
            </Text>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    color: '#311E13',
    marginRight: 8,
  },
  emojiWave: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 18,
    color: '#936036',
    marginBottom: 12,
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(213, 204, 195, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#C96F4A',
    minWidth: 40,
  },
  nextButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    minWidth: 90,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 17,
    color: '#FAF8F5',
  },
  nextButtonTextDisabled: {
    color: '#936036',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#936036',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: '#C96F4A',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: 15,
    color: '#FAF8F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topicCardSelected: {
    borderWidth: 4,
    borderColor: '#C96F4A',
    transform: [{ scale: 0.98 }],
  },
  topicImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D5CCC3',
  },
  topicOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 14,
    color: '#FAF8F5',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 12,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmarkText: {
    fontSize: 18,
    color: '#FAF8F5',
    fontWeight: '800',
  },
  selectionIndicator: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  selectionBadge: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  selectionText: {
    fontSize: 16,
    color: '#FAF8F5',
  },
});
